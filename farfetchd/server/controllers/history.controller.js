const SystemSnapshot = require('../models/SystemSnapshot.model');

/**
 * History Controller
 * Manages saved performance snapshots
 */

// Save a new snapshot
exports.saveSnapshot = async (req, res) => {
  try {
    const snapshotData = req.body;
    
    const snapshot = new SystemSnapshot(snapshotData);
    await snapshot.save();
    
    res.status(201).json({
      success: true,
      message: 'Snapshot saved successfully',
      data: snapshot
    });
  } catch (error) {
    console.error('Error saving snapshot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save snapshot'
    });
  }
};

// Get all snapshots (with pagination)
exports.getAllSnapshots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const snapshots = await SystemSnapshot.find()
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await SystemSnapshot.countDocuments();
    
    res.json({
      success: true,
      data: snapshots,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch snapshots'
    });
  }
};

// Get snapshot by ID
exports.getSnapshotById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const snapshot = await SystemSnapshot.findById(id).select('-__v');
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        error: 'Snapshot not found'
      });
    }
    
    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    console.error('Error fetching snapshot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch snapshot'
    });
  }
};

// Get snapshots by session ID
exports.getSnapshotsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const snapshots = await SystemSnapshot.find({ sessionId })
      .sort({ startTime: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      data: snapshots,
      count: snapshots.length
    });
  } catch (error) {
    console.error('Error fetching session snapshots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session snapshots'
    });
  }
};

// Delete snapshot by ID
exports.deleteSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    
    const snapshot = await SystemSnapshot.findByIdAndDelete(id);
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        error: 'Snapshot not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Snapshot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete snapshot'
    });
  }
};

// Delete all snapshots (use with caution)
exports.deleteAllSnapshots = async (req, res) => {
  try {
    const result = await SystemSnapshot.deleteMany({});
    
    res.json({
      success: true,
      message: `${result.deletedCount} snapshots deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting snapshots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete snapshots'
    });
  }
};

// Get statistics (peaks, averages across all snapshots)
exports.getStatistics = async (req, res) => {
  try {
    const snapshots = await SystemSnapshot.find().select('peaks averages startTime');
    
    if (snapshots.length === 0) {
      return res.json({
        success: true,
        message: 'No data available',
        data: null
      });
    }
    
    // Calculate overall statistics
    const stats = {
      totalSessions: snapshots.length,
      overallPeaks: {
        cpu: Math.max(...snapshots.map(s => s.peaks?.cpu?.usage || 0)),
        memory: Math.max(...snapshots.map(s => s.peaks?.memory?.usedPercent || 0))
      },
      overallAverages: {
        cpu: snapshots.reduce((sum, s) => sum + (s.averages?.cpuUsage || 0), 0) / snapshots.length,
        memory: snapshots.reduce((sum, s) => sum + (s.averages?.memoryUsed || 0), 0) / snapshots.length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate statistics'
    });
  }
};
