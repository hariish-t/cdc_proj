const logger = require('../utils/logger');
const { formatErrorResponse, isOperationalError } = require('../utils/errorTypes');

/**
 * Global Error Handler Middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.logError(err, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?.id
  });

  // 1. Handle Mongoose validation errors safely
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(422).json({
      success: false,
      error: {
        message: 'Validation failed',
        type: 'ValidationError',
        details: errors
      }
    });
  }

  // 2. Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'Field';
    return res.status(409).json({
      success: false,
      error: {
        message: `${field} already exists`,
        type: 'ConflictError'
      }
    });
  }

  // 3. Handle specific Auth Errors you are throwing
  // This picks up the 401 you throw in findByCredentials
  if (err.message === 'Invalid login credentials' || err.statusCode === 401) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid email or password',
        type: 'AuthenticationError'
      }
    });
  }

  // 4. Fallback for all other errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      type: err.name || 'ServerError',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      type: 'NotFoundError'
    }
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, notFoundHandler, asyncHandler };
