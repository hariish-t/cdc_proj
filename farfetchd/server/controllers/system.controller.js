const systemCollector = require('../utils/systemCollector');

/**
 * System Controller
 * Handles REST endpoints for system metrics
 */

// Get static system information
exports.getSystemInfo = async (req, res) => {
  try {
    const info = await systemCollector.getSystemInfo();
    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system information'
    });
  }
};

// Get current metrics snapshot
exports.getCurrentMetrics = async (req, res) => {
  try {
    const metrics = await systemCollector.collectAll();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error collecting metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect metrics'
    });
  }
};

// Get specific metric type
exports.getMetricByType = async (req, res) => {
  const { type } = req.params;
  
  try {
    let data;
    
    switch(type) {
      case 'cpu':
        data = await systemCollector.getCPU();
        break;
      case 'memory':
        data = await systemCollector.getMemory();
        break;
      case 'processes':
        data = await systemCollector.getProcesses();
        break;
      case 'network':
        data = await systemCollector.getNetwork();
        break;
      case 'storage':
        data = await systemCollector.getStorage();
        break;
      case 'uptime':
        data = await systemCollector.getUptime();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid metric type'
        });
    }
    
    res.json({
      success: true,
      type,
      data
    });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to fetch ${type} metrics`
    });
  }
};
