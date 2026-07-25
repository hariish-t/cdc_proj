const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * Analytics Routes
 * Base: /api/analytics
 * All routes require Admin authentication
 */

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get complete dashboard analytics
 * @access  Private (Admin)
 */
router.get('/dashboard', analyticsController.getDashboardAnalytics);

/**
 * @route   GET /api/analytics/revenue
 * @desc    Get total revenue
 * @access  Private (Admin)
 */
router.get('/revenue', analyticsController.getTotalRevenue);

/**
 * @route   GET /api/analytics/monthly-sales
 * @desc    Get monthly sales report
 * @access  Private (Admin)
 */
router.get('/monthly-sales', analyticsController.getMonthlySales);

/**
 * @route   GET /api/analytics/top-customers
 * @desc    Get top customers by spending
 * @access  Private (Admin)
 */
router.get('/top-customers', analyticsController.getTopCustomers);

/**
 * @route   GET /api/analytics/order-status-distribution
 * @desc    Get order status distribution
 * @access  Private (Admin)
 */
router.get('/order-status-distribution', analyticsController.getOrderStatusDistribution);

/**
 * @route   GET /api/analytics/recent-trends
 * @desc    Get recent trends (last 7 days)
 * @access  Private (Admin)
 */
router.get('/recent-trends', analyticsController.getRecentTrends);

/**
 * @route   GET /api/analytics/category-performance
 * @desc    Get performance by product category
 * @access  Private (Admin)
 */
router.get('/category-performance', analyticsController.getCategoryPerformance);

module.exports = router;
