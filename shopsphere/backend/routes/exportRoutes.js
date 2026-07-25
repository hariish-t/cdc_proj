const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { strictLimiter } = require('../middleware/rateLimiter');
const { auditLoggers } = require('../middleware/auditLog');
const { validateExport } = require('../middleware/validator');

/**
 * Export Routes
 * Base: /api/export
 * All routes require authentication and admin role
 */

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/export/orders/excel
 * @desc    Export orders to Excel format
 * @access  Private (Admin)
 */
router.get(
  '/orders/excel',
  strictLimiter,
  validateExport,
  auditLoggers.exportData,
  exportController.exportOrdersToExcel
);

/**
 * @route   GET /api/export/orders/csv
 * @desc    Export orders to CSV format
 * @access  Private (Admin)
 */
router.get(
  '/orders/csv',
  strictLimiter,
  validateExport,
  auditLoggers.exportData,
  exportController.exportOrdersToCSV
);

/**
 * @route   GET /api/export/analytics/excel
 * @desc    Export analytics summary to Excel
 * @access  Private (Admin)
 */
router.get(
  '/analytics/excel',
  strictLimiter,
  auditLoggers.exportData,
  exportController.exportAnalyticsToExcel
);

/**
 * @route   GET /api/export/orders
 * @desc    Generic export endpoint with format selection
 * @access  Private (Admin)
 */
router.get(
  '/orders',
  strictLimiter,
  validateExport,
  auditLoggers.exportData,
  exportController.exportOrders
);

module.exports = router;
