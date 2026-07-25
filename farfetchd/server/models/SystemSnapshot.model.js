const mongoose = require('mongoose');

/**
 * SystemSnapshot Model
 * Stores 10-minute performance snapshots for history
 */
const SystemSnapshotSchema = new mongoose.Schema({
  // Session identifier
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // Time range for this snapshot
  startTime: {
    type: Date,
    required: true
  },
  
  endTime: {
    type: Date,
    required: true
  },
  
  duration: {
    type: Number, // in seconds
    required: true
  },

  // Peak values during this period
  peaks: {
    cpu: {
      usage: Number,
      loadAverage: Number,
      timestamp: Date
    },
    memory: {
      usedPercent: Number,
      usedBytes: Number,
      timestamp: Date
    },
    network: {
      uploadSpeed: Number,
      downloadSpeed: Number,
      timestamp: Date
    }
  },

  // Average values
  averages: {
    cpuUsage: Number,
    memoryUsed: Number,
    networkUpload: Number,
    networkDownload: Number
  },

  // Top resource-hungry processes during this period
  topProcesses: [{
    name: String,
    pid: Number,
    peakMemory: String,
    peakCpu: Number
  }],

  // System info (static for this session)
  systemInfo: {
    cpuModel: String,
    cores: Number,
    totalMemory: String,
    os: String,
    kernel: String
  },

  // Anomalies detected
  anomalies: [{
    type: {
      type: String,
      enum: ['cpu_saturated', 'memory_critical', 'process_spike']
    },
    message: String,
    timestamp: Date,
    value: Number
  }]
}, {
  timestamps: true
});

// Index for efficient queries
SystemSnapshotSchema.index({ startTime: -1 });
SystemSnapshotSchema.index({ sessionId: 1, startTime: -1 });

module.exports = mongoose.model('SystemSnapshot', SystemSnapshotSchema);
