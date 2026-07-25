const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError, ConflictError } = require('../utils/errorTypes');
const logger = require('../utils/logger');

/**
 * Authentication Service
 * Handles user registration, login, token management
 */
class AuthService {
  /**
   * Generate JWT access token
   */
  generateAccessToken(userId) {
    return jwt.sign(
      { id: userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { id: userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      logger.info(`New user registered: ${user.email}`);

      // Generate tokens
      const accessToken = this.generateAccessToken(user._id);
      const refreshToken = this.generateRefreshToken(user._id);

      // Save refresh token to database
      user.refreshToken = refreshToken;
      await user.save();

      return {
        user: user.profile,
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user and verify credentials
      const user = await User.findByCredentials(email, password);

      // Generate tokens
      const accessToken = this.generateAccessToken(user._id);
      const refreshToken = this.generateRefreshToken(user._id);

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save();

      logger.info(`User logged in: ${user.email}`);

      return {
        user: user.profile,
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.warn(`Login failed for: ${email}`);
      throw new AuthenticationError(error.message);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select('+refreshToken');
      
      if (!user || user.refreshToken !== refreshToken || !user.isActive) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user._id);

      return {
        accessToken: newAccessToken
      };
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1 }
      });

      logger.info(`User logged out: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      return user.profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    try {
      // Don't allow updating sensitive fields
      delete updateData.password;
      delete updateData.role;
      delete updateData.refreshToken;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      logger.info(`User profile updated: ${user.email}`);
      return user.profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
