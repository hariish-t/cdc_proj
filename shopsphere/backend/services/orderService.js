const Order = require('../models/Order');
const { NotFoundError, ValidationError } = require('../utils/errorTypes');
const logger = require('../utils/logger');
const { ORDER_STATUS } = require('../config/constants');

/**
 * Order Service
 * Handles all order-related business logic
 */
class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData, userId) {
    try {
      // Calculate total amount
      const amount = orderData.product.quantity * orderData.product.unitPrice;
      const tax = orderData.tax || amount * 0.18; // 18% GST
      const discount = orderData.discount || 0;
      const totalAmount = amount + tax - discount;

      const order = new Order({
        ...orderData,
        userId,
        amount,
        tax,
        discount,
        totalAmount
      });

      await order.save();
      logger.info(`Order created: ${order.orderId}`);

      return order;
    } catch (error) {
      logger.error('Order creation error:', error);
      throw error;
    }
  }

  /**
   * Create multiple orders at once (bulk insert)
   */
  async createManyOrders(ordersData, userId) {
    try {
      const orders = ordersData.map(orderData => ({
        ...orderData,
        userId,
        amount: orderData.product.quantity * orderData.product.unitPrice,
        tax: orderData.tax || (orderData.product.quantity * orderData.product.unitPrice) * 0.18,
        discount: orderData.discount || 0
      }));

      // Calculate totalAmount for each order
      orders.forEach(order => {
        order.totalAmount = order.amount + order.tax - order.discount;
      });

      const result = await Order.insertMany(orders);
      logger.info(`${result.length} orders created in bulk`);

      return result;
    } catch (error) {
      logger.error('Bulk order creation error:', error);
      throw error;
    }
  }

  /**
   * Get all orders with pagination and filters
   */
  async getOrders(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate,
        category
      } = options;

      // Build query
      const query = {};

      if (status) {
        query.status = status;
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      if (category) {
        query['product.category'] = category;
      }

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const orders = await Order.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Order.countDocuments(query);

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Get orders error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId).populate('userId', 'name email role');
      
      if (!order) {
        throw new NotFoundError('Order');
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update order
   */
  async updateOrder(orderId, updateData) {
    try {
      // Don't allow updating certain fields
      delete updateData.orderId;
      delete updateData.userId;
      delete updateData.createdAt;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!order) {
        throw new NotFoundError('Order');
      }

      logger.info(`Order updated: ${order.orderId}`);
      return order;
    } catch (error) {
      logger.error('Order update error:', error);
      throw error;
    }
  }

  /**
   * Update multiple orders
   */
  async updateManyOrders(filter, updateData) {
    try {
      const result = await Order.updateMany(filter, { $set: updateData });
      logger.info(`${result.modifiedCount} orders updated`);
      return result;
    } catch (error) {
      logger.error('Bulk order update error:', error);
      throw error;
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(orderId) {
    try {
      const order = await Order.findByIdAndDelete(orderId);
      
      if (!order) {
        throw new NotFoundError('Order');
      }

      logger.info(`Order deleted: ${order.orderId}`);
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete multiple orders
   */
  async deleteManyOrders(filter) {
    try {
      const result = await Order.deleteMany(filter);
      logger.info(`${result.deletedCount} orders deleted`);
      return result;
    } catch (error) {
      logger.error('Bulk order deletion error:', error);
      throw error;
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats() {
    try {
      const stats = await Order.aggregate([
        {
          $facet: {
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalAmount: { $sum: '$totalAmount' }
                }
              }
            ],
            byCategory: [
              {
                $group: {
                  _id: '$product.category',
                  count: { $sum: 1 },
                  totalAmount: { $sum: '$totalAmount' }
                }
              },
              { $sort: { totalAmount: -1 } },
              { $limit: 5 }
            ],
            overall: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$totalAmount' },
                  avgOrderValue: { $avg: '$totalAmount' }
                }
              }
            ]
          }
        }
      ]);

      return stats[0];
    } catch (error) {
      logger.error('Order stats error:', error);
      throw error;
    }
  }

  /**
   * Get recent orders (last 24 hours)
   */
  async getRecentOrders(limit = 10) {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const orders = await Order.find({
        createdAt: { $gte: oneDayAgo }
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email');

      return orders;
    } catch (error) {
      logger.error('Get recent orders error:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();
