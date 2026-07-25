/**
 * Custom Error Classes for Better Error Handling
 * Each error type maps to specific HTTP status codes
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

class TokenExpiredError extends AppError {
  constructor(message = 'Token has expired') {
    super(message, 401);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Error handler helper - determines if error should be exposed to client
 */
const isOperationalError = (error) => {
  return error instanceof AppError && error.isOperational;
};

/**
 * Format error response for API
 */
const formatErrorResponse = (error) => {
  if (isOperationalError(error)) {
    return {
      success: false,
      error: {
        message: error.message,
        type: error.name,
        statusCode: error.statusCode
      }
    };
  }

  // Hide internal errors from client
  return {
    success: false,
    error: {
      message: 'Internal server error',
      type: 'ServerError',
      statusCode: 500
    }
  };
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  DatabaseError,
  RateLimitError,
  TokenExpiredError,
  isOperationalError,
  formatErrorResponse
};
