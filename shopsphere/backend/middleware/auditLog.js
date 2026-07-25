const AuditLog = require('../models/AuditLog');
const { AUDIT_ACTIONS } = require('../config/constants');

const logAction = (action, resourceType = 'system') => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      setImmediate(async () => {
        try {
          // 1. EXTRACT USER ID (Crucial for Login)
          // We check req.user (for existing sessions) or the 'data' (the response body of a successful login)
          const userId = req.user?._id || data?.data?.user?._id || data?.user?._id;

          // 2. SAFETY CHECK
          // If the action is LOGIN and we still don't have a userId, 
          // it means the login actually failed or the data structure is weird.
          // We don't call .logAction if userId is missing to avoid the "Required" validation error.
          if (!userId && action === AUDIT_ACTIONS.LOGIN) {
            console.log('Skipping audit log: No user ID found in request or response.');
            return;
          }

          const logData = {
            action,
            userId: userId || null, // Fallback to null
            userEmail: req.user?.email || data?.data?.user?.email || data?.user?.email || 'anonymous',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent') || 'unknown',
            resourceType,
            resourceId: req.params?.id || null,
            details: {
              method: req.method,
              path: req.path,
              query: req.query,
              body: sanitizeBody(req.body)
            },
            status: res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failure',
            errorMessage: data?.error?.message || null
          };

          // Only proceed if we have the minimum required data for your Schema
          if (logData.userId) {
             await AuditLog.logAction(logData);
          }
          
        } catch (error) {
          // This ensures a logging failure NEVER crashes your server logic
          console.error('CRITICAL AUDIT LOG ERROR:', error.message);
        }
      });

      return originalJson(data);
    };

    next();
  };
};

const sanitizeBody = (body) => {
  if (!body) return {};
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'refreshToken', 'secret'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) sanitized[field] = '[REDACTED]';
  });
  return sanitized;
};

const auditLoggers = {
  login: logAction(AUDIT_ACTIONS.LOGIN, 'auth'),
  logout: logAction(AUDIT_ACTIONS.LOGOUT, 'auth'),
  createOrder: logAction(AUDIT_ACTIONS.CREATE_ORDER, 'order'),
  updateOrder: logAction(AUDIT_ACTIONS.UPDATE_ORDER, 'order'),
  deleteOrder: logAction(AUDIT_ACTIONS.DELETE_ORDER, 'order'),
  exportData: logAction(AUDIT_ACTIONS.EXPORT_DATA, 'export'),
  viewAnalytics: logAction(AUDIT_ACTIONS.VIEW_ANALYTICS, 'analytics')
};

module.exports = { logAction, auditLoggers };
