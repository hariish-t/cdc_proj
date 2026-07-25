const winston = require('winston');
const path = require('path');

/**
 * Professional Winston Logger Configuration
 * Logs to console in development, files in production
 */

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = `\n${JSON.stringify(meta, null, 2)}`;
    }
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// Format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports
const transports = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  })
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Error logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  transports,
  exitOnError: false
});

/**
 * Stream for Morgan HTTP logger
 */
logger.stream = {
  write: (message) => logger.http(message.trim())
};

/**
 * Helper methods for structured logging
 */
logger.logAPI = (method, path, statusCode, duration) => {
  const level = statusCode >= 400 ? 'error' : 'info';
  logger.log(level, `${method} ${path} ${statusCode} - ${duration}ms`);
};

logger.logError = (error, context = {}) => {
  logger.error(`${error.message}`, {
    stack: error.stack,
    ...context
  });
};

logger.logAudit = (action, user, details = {}) => {
  logger.info('Audit Log', {
    action,
    user: user?.email || 'unknown',
    userId: user?._id,
    timestamp: new Date().toISOString(),
    ...details
  });
};

module.exports = logger;
