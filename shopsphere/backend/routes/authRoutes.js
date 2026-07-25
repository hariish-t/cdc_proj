const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, verifyRefreshToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { auditLoggers } = require('../middleware/auditLog');
const {
  validateRegister,
  validateLogin,
  validateRefreshToken
} = require('../middleware/validator');

/**
 * Authentication Routes
 * Base: /api/auth
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validateRegister,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validateLogin,
  auditLoggers.login,
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  validateRefreshToken,
  verifyRefreshToken,
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  auditLoggers.logout,
  authController.logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  authController.updateProfile
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  authController.changePassword
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
router.get(
  '/verify',
  authenticate,
  authController.verifyToken
);

module.exports = router;
