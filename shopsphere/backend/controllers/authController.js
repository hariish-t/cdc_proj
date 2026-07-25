const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { AuthenticationError } = require('../utils/errorTypes');
const logger = require('../utils/logger');

/**
 * Generate JWT tokens
 */
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AuthenticationError('Email already registered');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'viewer'
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: user.profile,
      accessToken,
      refreshToken
    }
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by credentials
  const user = await User.findByCredentials(email, password);

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.profile,
      accessToken,
      refreshToken
    }
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate new tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  // Update refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    message: 'Token refreshed',
    data: {
      accessToken,
      refreshToken
    }
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  const user = req.user;

  // Clear refresh token
  user.refreshToken = undefined;
  await user.save();

  logger.info(`User logged out: ${user.email}`);

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.profile
    }
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = req.user;

  if (name) user.name = name;
  await user.save();

  logger.info(`Profile updated: ${user.email}`);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.profile
    }
  });
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed: ${user.email}`);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
exports.verifyToken = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user.profile
    }
  });
});
