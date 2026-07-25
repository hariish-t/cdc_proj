const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { auditLoggers } = require('../middleware/auditLog');
const {
  validateOrder,
  validateOrderUpdate,
  validateObjectId,
  validatePagination
} = require('../middleware/validator');

/**
 * Order Routes
 * Base: /api/orders
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private (Admin)
 */
router.get(
  '/stats',
  requireAdmin,
  orderController.getOrderStats
);

/**
 * @route   GET /api/orders/recent
 * @desc    Get recent orders (last 24 hours)
 * @access  Private (Admin)
 */
router.get(
  '/recent',
  requireAdmin,
  orderController.getRecentOrders
);

/**
 * @route   POST /api/orders/simulate
 * @desc    Create a simulated demo order
 * @access  Private (Admin)
 */
router.post(
  '/simulate',
  requireAdmin,
  orderController.simulateOrder
);

/**
 * @route   POST /api/orders/bulk
 * @desc    Create multiple orders (bulk insert)
 * @access  Private (Admin)
 */
router.post(
  '/bulk',
  requireAdmin,
  auditLoggers.createOrder,
  orderController.createBulkOrders
);

/**
 * @route   PUT /api/orders/bulk
 * @desc    Update multiple orders
 * @access  Private (Admin)
 */
router.put(
  '/bulk',
  requireAdmin,
  auditLoggers.updateOrder,
  orderController.updateBulkOrders
);

/**
 * @route   DELETE /api/orders/bulk
 * @desc    Delete multiple orders
 * @access  Private (Admin)
 */
router.delete(
  '/bulk',
  requireAdmin,
  auditLoggers.deleteOrder,
  orderController.deleteBulkOrders
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination
 * @access  Private (Admin)
 */
router.get(
  '/',
  requireAdmin,
  validatePagination,
  orderController.getOrders
);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private (Admin)
 */
router.post(
  '/',
  requireAdmin,
  apiLimiter,
  validateOrder,
  auditLoggers.createOrder,
  orderController.createOrder
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  requireAdmin,
  validateObjectId,
  orderController.getOrderById
);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update order
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  requireAdmin,
  validateObjectId,
  validateOrderUpdate,
  auditLoggers.updateOrder,
  orderController.updateOrder
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  requireAdmin,
  validateObjectId,
  auditLoggers.deleteOrder,
  orderController.deleteOrder
);

module.exports = router;
