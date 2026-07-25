const mongoose = require('mongoose');
const { AUDIT_ACTIONS } = require('../config/constants');

/**
 * Audit Log Schema for tracking all admin activities
 */
const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: Object.values(AUDIT_ACTIONS),
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required']
    },
    ipAddress: {
      type: String,
      default: 'unknown'
    },
    userAgent: {
      type: String,
      default: 'unknown'
    },
    resourceType: {
      type: String,
      enum: ['order', 'user', 'analytics', 'export', 'auth', 'system'],
      default: 'system'
    },
    resourceId: {
      type: String,
      default: null
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success'
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Static method: Create audit log entry
 */
auditLogSchema.statics.logAction = async function (data) {
  try {
    const log = new this({
      action: data.action,
      userId: data.userId,
      userEmail: data.userEmail,
      ipAddress: data.ipAddress || 'unknown',
      userAgent: data.userAgent || 'unknown',
      resourceType: data.resourceType || 'system',
      resourceId: data.resourceId,
      details: data.details || {},
      status: data.status || 'success',
      errorMessage: data.errorMessage
    });

    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

/**
 * Static method: Get user activity
 */
auditLogSchema.statics.getUserActivity = async function (userId, limit = 50) {
  return await this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');
};

/**
 * Static method: Get activity by action type
 */
auditLogSchema.statics.getByAction = async function (action, limit = 100) {
  return await this.find({ action })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email role')
    .select('-__v');
};

/**
 * Static method: Get failed actions
 */
auditLogSchema.statics.getFailedActions = async function (days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.find({
    status: 'failure',
    createdAt: { $gte: startDate }
  })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email role')
    .select('-__v');
};

/**
 * Indexes for performance
 */
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ status: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
