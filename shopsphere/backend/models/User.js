const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

/**
 * User Schema with Authentication & Authorization
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VIEWER
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    },
    refreshToken: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for user's full profile
userSchema.virtual('profile').get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    lastLogin: this.lastLogin
  };
});

/**
 * Pre-save hook: Hash password before saving
 */
userSchema.pre('save', async function () {
  // Only hash password if it's modified
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() needed here!
  } catch (error) {
    // In async middleware, you just throw the error
    throw error;
  }
});

/**
 * Instance method: Compare password for login
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method: Check if user account is locked
 */
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

/**
 * Instance method: Increment login attempts
 */
userSchema.methods.incrementLoginAttempts = async function () {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

/**
 * Instance method: Reset login attempts on successful login
 */
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 }
  });
};

/**
 * Static method: Find by credentials
 * ENHANCED: Added account lock and active status checks to prevent 500 errors
 */
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    const err = new Error('Invalid login credentials');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is disabled. Please contact admin.');
    err.statusCode = 403;
    throw err;
  }

  if (user.isLocked()) {
    const err = new Error('Account is temporarily locked due to many failed attempts.');
    err.statusCode = 423;
    throw err;
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    // Increment attempts on wrong password
    await user.incrementLoginAttempts();
    const err = new Error('Invalid login credentials');
    err.statusCode = 401;
    throw err;
  }
  
  // Success! Reset attempts
  await user.resetLoginAttempts();
  return user;
};

/**
 * Indexes for performance
 */
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
