const Order = require('../models/Order');
const User = require('../models/User');
const { ORDER_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Analytics Service
 * Advanced MongoDB aggregations for business insights
 */
class AnalyticsService {
  /**
   * Get total revenue from completed orders
   */
  async getTotalRevenue(filters = {}) {
    try {
      const matchStage = {
        status: ORDER_STATUS.COMPLETED,
        ...filters
      };

      const result = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' },
            totalTax: { $sum: '$tax' },
            totalDiscount: { $sum: '$discount' }
          }
        }
      ]);

      return result[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        totalTax: 0,
        totalDiscount: 0
      };
    } catch (error) {
      logger.error('Total revenue calculation error:', error);
      throw error;
    }
  }

  /**
   * Get monthly sales report
   */
  async getMonthlySales(year = new Date().getFullYear()) {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            status: ORDER_STATUS.COMPLETED,
            createdAt: {
              $gte: new Date(year, 0, 1),
              $lt: new Date(year + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        },
        {
          $sort: { '_id.month': 1 }
        },
        {
          $project: {
            _id: 0,
            month: '$_id.month',
            year: '$_id.year',
            totalSales: { $round: ['$totalSales', 2] },
            orderCount: 1,
            avgOrderValue: { $round: ['$avgOrderValue', 2] }
          }
        }
      ]);

      // Fill in missing months with zero values
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const completeData = months.map(month => {
        const monthData = result.find(r => r.month === month);
        return monthData || {
          month,
          year,
          totalSales: 0,
          orderCount: 0,
          avgOrderValue: 0
        };
      });

      return completeData;
    } catch (error) {
      logger.error('Monthly sales calculation error:', error);
      throw error;
    }
  }

  /**
   * Get top customers by total spending
   */
  async getTopCustomers(limit = 5) {
    try {
      const result = await Order.aggregate([
        {
          $match: { status: ORDER_STATUS.COMPLETED }
        },
        {
          $group: {
            _id: '$customerEmail',
            customerName: { $first: '$customerName' },
            totalSpent: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' },
            lastOrderDate: { $max: '$createdAt' }
          }
        },
        {
          $sort: { totalSpent: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 0,
            email: '$_id',
            name: '$customerName',
            totalSpent: { $round: ['$totalSpent', 2] },
            orderCount: 1,
            avgOrderValue: { $round: ['$avgOrderValue', 2] },
            lastOrderDate: 1
          }
        }
      ]);

      return result;
    } catch (error) {
      logger.error('Top customers calculation error:', error);
      throw error;
    }
  }

  /**
   * Get sales by product category
   */
  async getSalesByCategory() {
    try {
      const result = await Order.aggregate([
        {
          $match: { status: ORDER_STATUS.COMPLETED }
        },
        {
          $group: {
            _id: '$product.category',
            totalRevenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' },
            totalQuantity: { $sum: '$product.quantity' }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            totalRevenue: { $round: ['$totalRevenue', 2] },
            orderCount: 1,
            avgOrderValue: { $round: ['$avgOrderValue', 2] },
            totalQuantity: 1
          }
        }
      ]);

      return result;
    } catch (error) {
      logger.error('Category sales calculation error:', error);
      throw error;
    }
  }

  /**
   * Get top selling products
   */
  async getTopProducts(limit = 10) {
    try {
      const result = await Order.aggregate([
        {
          $match: { status: ORDER_STATUS.COMPLETED }
        },
        {
          $group: {
            _id: '$product.name',
            category: { $first: '$product.category' },
            totalRevenue: { $sum: '$totalAmount' },
            totalQuantity: { $sum: '$product.quantity' },
            orderCount: { $sum: 1 },
            avgPrice: { $avg: '$product.unitPrice' }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 0,
            productName: '$_id',
            category: 1,
            totalRevenue: { $round: ['$totalRevenue', 2] },
            totalQuantity: 1,
            orderCount: 1,
            avgPrice: { $round: ['$avgPrice', 2] }
          }
        }
      ]);

      return result;
    } catch (error) {
      logger.error('Top products calculation error:', error);
      throw error;
    }
  }

  /**
   * Get hourly sales pattern
   */
  async getHourlySales() {
    try {
      const result = await Order.aggregate([
        {
          $match: { status: ORDER_STATUS.COMPLETED }
        },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' }
          }
        },
        {
          $sort: { _id: 1 }
        },
        {
          $project: {
            _id: 0,
            hour: '$_id',
            orderCount: 1,
            totalRevenue: { $round: ['$totalRevenue', 2] }
          }
        }
      ]);

      // Fill in all 24 hours
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const completeData = hours.map(hour => {
        const hourData = result.find(r => r.hour === hour);
        return hourData || { hour, orderCount: 0, totalRevenue: 0 };
      });

      return completeData;
    } catch (error) {
      logger.error('Hourly sales calculation error:', error);
      throw error;
    }
  }

  /**
   * Get revenue growth comparison
   */
  async getRevenueGrowth() {
    try {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const [thisMonth, lastMonth] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              status: ORDER_STATUS.COMPLETED,
              createdAt: { $gte: thisMonthStart }
            }
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: '$totalAmount' },
              orders: { $sum: 1 }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              status: ORDER_STATUS.COMPLETED,
              createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
            }
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: '$totalAmount' },
              orders: { $sum: 1 }
            }
          }
        ])
      ]);

      const thisMonthData = thisMonth[0] || { revenue: 0, orders: 0 };
      const lastMonthData = lastMonth[0] || { revenue: 0, orders: 0 };

      const revenueGrowth = lastMonthData.revenue > 0
        ? ((thisMonthData.revenue - lastMonthData.revenue) / lastMonthData.revenue) * 100
        : 0;

      const ordersGrowth = lastMonthData.orders > 0
        ? ((thisMonthData.orders - lastMonthData.orders) / lastMonthData.orders) * 100
        : 0;

      return {
        thisMonth: {
          revenue: Math.round(thisMonthData.revenue * 100) / 100,
          orders: thisMonthData.orders
        },
        lastMonth: {
          revenue: Math.round(lastMonthData.revenue * 100) / 100,
          orders: lastMonthData.orders
        },
        growth: {
          revenue: Math.round(revenueGrowth * 100) / 100,
          orders: Math.round(ordersGrowth * 100) / 100
        }
      };
    } catch (error) {
      logger.error('Revenue growth calculation error:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData() {
    try {
      const [revenue, topCustomers, salesByCategory, revenueGrowth] = await Promise.all([
        this.getTotalRevenue(),
        this.getTopCustomers(5),
        this.getSalesByCategory(),
        this.getRevenueGrowth()
      ]);

      return {
        revenue,
        topCustomers,
        salesByCategory,
        revenueGrowth,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Dashboard data error:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
