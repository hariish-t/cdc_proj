const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errorTypes');
const { ORDER_STATUS, CATEGORIES } = require('../config/constants');

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new ValidationError(errorMessages.join(', '));
  }
  next();
};

/**
 * User Registration Validation
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Name must be 3-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'viewer']).withMessage('Invalid role'),
  validate
];

/**
 * User Login Validation
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Order Creation Validation
 */
const validateOrder = [
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Customer name must be 2-100 characters'),
  body('customerEmail')
    .trim()
    .notEmpty().withMessage('Customer email is required')
    .isEmail().withMessage('Invalid customer email format')
    .normalizeEmail(),
  body('product.name')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('product.category')
    .notEmpty().withMessage('Product category is required')
    .isIn(Object.values(CATEGORIES)).withMessage('Invalid product category'),
  body('product.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('product.unitPrice')
    .isFloat({ min: 0 }).withMessage('Unit price must be positive'),
  body('amount')
    .isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  body('status')
    .optional()
    .isIn(Object.values(ORDER_STATUS)).withMessage('Invalid order status'),
  body('tax')
    .optional()
    .isFloat({ min: 0 }).withMessage('Tax must be positive'),
  body('discount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discount must be positive'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  validate
];

/**
 * Order Update Validation
 */
const validateOrderUpdate = [
  body('status')
    .optional()
    .isIn(Object.values(ORDER_STATUS)).withMessage('Invalid order status'),
  body('amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  validate
];

/**
 * MongoDB ObjectId Validation
 */
const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate
];

/**
 * Pagination Validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

/**
 * Date Range Validation
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format'),
  validate
];

/**
 * Export Format Validation
 */
const validateExport = [
  query('format')
    .optional()
    .isIn(['pdf', 'excel', 'csv']).withMessage('Invalid export format'),
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date'),
  validate
];

/**
 * Refresh Token Validation
 */
const validateRefreshToken = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateOrder,
  validateOrderUpdate,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateExport,
  validateRefreshToken
};
