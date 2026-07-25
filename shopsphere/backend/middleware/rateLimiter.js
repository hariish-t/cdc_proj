const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../config/constants');

/**
 * Rate limiter for authentication routes (stricter)
 */
const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH.WINDOW_MS,
  max: RATE_LIMITS.AUTH.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: 'Too many login attempts. Please try again later.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
        type: 'RateLimitError',
        retryAfter: Math.ceil(RATE_LIMITS.AUTH.WINDOW_MS / 1000 / 60) + ' minutes'
      }
    });
  }
});

/**
 * Rate limiter for general API routes
 */
const apiLimiter = rateLimit({
  windowMs: RATE_LIMITS.API.WINDOW_MS,
  max: RATE_LIMITS.API.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: 'Too many requests. Please try again later.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Rate limit exceeded. Please slow down your requests.',
        type: 'RateLimitError',
        retryAfter: Math.ceil(RATE_LIMITS.API.WINDOW_MS / 1000 / 60) + ' minutes'
      }
    });
  }
});

/**
 * Strict rate limiter for sensitive operations (exports, bulk operations)
 */
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    success: false,
    error: {
      message: 'Too many requests for this operation.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'You have exceeded the rate limit for this operation.',
        type: 'RateLimitError',
        retryAfter: '1 hour'
      }
    });
  }
});

/**
 * Custom key generator based on user ID (if authenticated) or IP
 */
const createUserBasedLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      return req.user ? req.user.id : req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = {
  authLimiter,
  apiLimiter,
  strictLimiter,
  createUserBasedLimiter
};
