const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError, AuthorizationError } = require('../utils/errorTypes');
const { asyncHandler } = require('./errorHandler');
const { ROLES } = require('../config/constants');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
console.log('✅ TOKEN DECODED:', decoded); // Add this!
    // Get user from database
    const user = await User.findById(decoded.id || decoded._id).select('-password -refreshToken');
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
});

/**
 * Check if user has required role(s)
 * @param {Array|String} roles - Required role(s)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Access denied. Required role: ${roles.join(' or ')}`
      );
    }

    next();
  };
};

/**
 * Admin only access
 */
const requireAdmin = authorize(ROLES.ADMIN);

/**
 * Admin or Manager access
 */
const requireAdminOrManager = authorize(ROLES.ADMIN, ROLES.MANAGER);

/**
 * Optional authentication (doesn't fail if no token)
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});

/**
 * Verify refresh token
 */
const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AuthenticationError('Refresh token required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id || decoded._id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      throw new AuthenticationError('Invalid refresh token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
});

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireAdminOrManager,
  optionalAuth,
  verifyRefreshToken
};
