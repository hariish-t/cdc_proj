const Order = require('../models/Order');
const { ORDER_STATUS, CATEGORIES } = require('../config/constants');

/**
 * Get complete dashboard analytics
 * @route GET /api/analytics/dashboard
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    console.log('\n📊 === DASHBOARD ANALYTICS REQUEST ===');
    console.log('User:', req.user.email, '| Role:', req.user.role);

    // Get ALL orders (no user filter since admin should see everything)
    const allOrders = await Order.find({}).lean();
    console.log(`📦 Total orders found: ${allOrders.length}`);

    if (allOrders.length === 0) {
      console.log('⚠️  No orders in database!');
      return res.json({
        totalOrders: 0,
        totalRevenue: 0,
        completedOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        cancelledOrders: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        orderGrowth: 0
      });
    }

    // Calculate metrics
    const completedOrders = allOrders.filter(o => o.status === ORDER_STATUS.COMPLETED);
    const pendingOrders = allOrders.filter(o => o.status === ORDER_STATUS.PENDING);
    const processingOrders = allOrders.filter(o => o.status === ORDER_STATUS.PROCESSING);
    const cancelledOrders = allOrders.filter(o => o.status === ORDER_STATUS.CANCELLED);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Calculate growth (last 15 days vs previous 15 days)
    const now = new Date();
    const last15Days = new Date(now);
    last15Days.setDate(last15Days.getDate() - 15);
    const previous30Days = new Date(now);
    previous30Days.setDate(previous30Days.getDate() - 30);

    const recentOrders = allOrders.filter(o => new Date(o.createdAt) >= last15Days);
    const previousOrders = allOrders.filter(o => {
      const date = new Date(o.createdAt);
      return date >= previous30Days && date < last15Days;
    });

    const recentRevenue = recentOrders
      .filter(o => o.status === ORDER_STATUS.COMPLETED)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const previousRevenue = previousOrders
      .filter(o => o.status === ORDER_STATUS.COMPLETED)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const revenueGrowth = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
      : recentRevenue > 0 ? 100 : 0;

    const orderGrowth = previousOrders.length > 0 
      ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 
      : recentOrders.length > 0 ? 100 : 0;

    const dashboardData = {
      totalOrders: allOrders.length,
      totalRevenue: Math.round(totalRevenue),
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      processingOrders: processingOrders.length,
      cancelledOrders: cancelledOrders.length,
      averageOrderValue: Math.round(averageOrderValue),
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      orderGrowth: Math.round(orderGrowth * 10) / 10
    };

    console.log('📤 Dashboard Data:', dashboardData);
    console.log('=====================================\n');

    res.json(dashboardData);

  } catch (error) {
    console.error('❌ Dashboard analytics error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard analytics',
      message: error.message 
    });
  }
};

/**
 * Get total revenue
 * @route GET /api/analytics/revenue
 */
exports.getTotalRevenue = async (req, res) => {
  try {
    console.log('💰 Fetching total revenue...');

    const result = await Order.aggregate([
      { $match: { status: ORDER_STATUS.COMPLETED } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const data = result[0] || { totalRevenue: 0, orderCount: 0 };
    console.log('💰 Total Revenue:', data);

    res.json(data);

  } catch (error) {
    console.error('❌ Revenue error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch revenue',
      message: error.message 
    });
  }
};

/**
 * Get monthly sales
 * @route GET /api/analytics/monthly-sales
 */
exports.getMonthlySales = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    console.log(`📊 Fetching monthly sales for ${year}...`);

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const orders = await Order.find({
      status: ORDER_STATUS.COMPLETED,
      createdAt: { $gte: startDate, $lte: endDate }
    }).lean();

    console.log(`📦 Found ${orders.length} completed orders for ${year}`);

    // Initialize all 12 months
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i).toLocaleString('default', { month: 'short' }),
      sales: 0,
      orders: 0
    }));

    // Aggregate data by month
    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlyData[month].sales += order.totalAmount || 0;
      monthlyData[month].orders += 1;
    });

    console.log('📈 Monthly data generated');

    res.json(monthlyData);

  } catch (error) {
    console.error('❌ Monthly sales error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch monthly sales',
      message: error.message 
    });
  }
};

/**
 * Get top customers
 * @route GET /api/analytics/top-customers
 */
exports.getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    console.log(`👥 Fetching top ${limit} customers...`);

    const topCustomers = await Order.aggregate([
      { $match: { status: ORDER_STATUS.COMPLETED } },
      {
        $group: {
          _id: '$customerEmail',
          name: { $first: '$customerName' },
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          email: '$_id',
          name: 1,
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    console.log(`👥 Top customers: ${topCustomers.length}`);

    res.json(topCustomers);

  } catch (error) {
    console.error('❌ Top customers error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch top customers',
      message: error.message 
    });
  }
};

/**
 * Get order status distribution
 * @route GET /api/analytics/order-status-distribution
 */
exports.getOrderStatusDistribution = async (req, res) => {
  try {
    console.log('📊 Fetching order status distribution...');

    const distribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          totalAmount: 1
        }
      }
    ]);

    console.log('📊 Distribution:', distribution);

    res.json(distribution);

  } catch (error) {
    console.error('❌ Distribution error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order distribution',
      message: error.message 
    });
  }
};

/**
 * Get recent trends (last 7 days)
 * @route GET /api/analytics/recent-trends
 */
exports.getRecentTrends = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    console.log(`📈 Fetching trends for last ${days} days...`);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: startDate }
    }).lean();

    // Group by date
    const trendData = {};
    
    // Initialize all dates
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      trendData[dateStr] = {
        date: dateStr,
        orders: 0,
        revenue: 0,
        completed: 0,
        pending: 0,
        processing: 0,
        cancelled: 0
      };
    }

    // Fill in actual data
    orders.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (trendData[dateStr]) {
        trendData[dateStr].orders += 1;
        trendData[dateStr][order.status] += 1;
        if (order.status === ORDER_STATUS.COMPLETED) {
          trendData[dateStr].revenue += order.totalAmount || 0;
        }
      }
    });

    const result = Object.values(trendData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    console.log(`📈 Trend data points: ${result.length}`);

    res.json(result);

  } catch (error) {
    console.error('❌ Trends error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent trends',
      message: error.message 
    });
  }
};

/**
 * Get category performance
 * @route GET /api/analytics/category-performance
 */
exports.getCategoryPerformance = async (req, res) => {
  try {
    console.log('📊 Fetching category performance...');

    const performance = await Order.aggregate([
      { $match: { status: ORDER_STATUS.COMPLETED } },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: '$product.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalRevenue: 1,
          orderCount: 1,
          totalQuantity: 1,
          averageOrderValue: {
            $round: [{ $divide: ['$totalRevenue', '$orderCount'] }, 2]
          }
        }
      }
    ]);

    console.log('📊 Category performance:', performance);

    res.json(performance);

  } catch (error) {
    console.error('❌ Category performance error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch category performance',
      message: error.message 
    });
  }
};
