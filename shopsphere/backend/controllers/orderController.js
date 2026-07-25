const Order = require('../models/Order');
const { ORDER_STATUS, PAYMENT_METHODS } = require('../config/constants');

/**
 * Get all orders with pagination and filters
 * @route GET /api/orders
 */
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { status, search, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    console.log('\n📋 === GET ORDERS REQUEST ===');
    console.log('Page:', page, '| Limit:', limit, '| Status:', status);

    // Build query - Admin sees all orders
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { 'product.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    console.log(`📦 Found ${orders.length} orders (Total: ${total})`);
    console.log('===============================\n');

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + orders.length < total
      }
    });

  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders',
      message: error.message 
    });
  }
};

/**
 * Get recent orders (last 24 hours or custom limit)
 * @route GET /api/orders/recent
 */
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const hours = parseInt(req.query.hours) || 24;

    console.log(`\n📋 Fetching last ${limit} orders from past ${hours} hours...`);

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const orders = await Order.find({
      createdAt: { $gte: startDate }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`📦 Found ${orders.length} recent orders`);

    res.json({
      success: true,
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error('❌ Recent orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent orders',
      message: error.message 
    });
  }
};

/**
 * Get order statistics
 * @route GET /api/orders/stats
 */
exports.getOrderStats = async (req, res) => {
  try {
    console.log('📊 Fetching order statistics...');

    const stats = await Order.aggregate([
      {
        $facet: {
          statusDistribution: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' }
              }
            }
          ],
          overall: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                averageOrderValue: { $avg: '$totalAmount' }
              }
            }
          ],
          recentOrders: [
            {
              $match: {
                createdAt: { 
                  $gte: new Date(new Date().setHours(new Date().getHours() - 24)) 
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    const result = {
      statusDistribution: stats[0].statusDistribution,
      overall: stats[0].overall[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
      recentOrders: stats[0].recentOrders[0]?.count || 0
    };

    console.log('📊 Stats:', result);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
};

/**
 * Get single order by ID
 * @route GET /api/orders/:id
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order',
      message: error.message 
    });
  }
};

/**
 * Create new order
 * @route POST /api/orders
 */
exports.createOrder = async (req, res) => {
  try {
    console.log('\n📦 Creating new order...');

    const orderData = {
      ...req.body,
      userId: req.user._id
    };

    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created:', order.orderId);

    // Emit socket event if available
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', order);
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create order',
      message: error.message 
    });
  }
};

/**
 * Update order
 * @route PUT /api/orders/:id
 */
exports.updateOrder = async (req, res) => {
  try {
    console.log('\n📝 Updating order:', req.params.id);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    console.log('✅ Order updated:', order.orderId);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('orderUpdated', order);
    }

    res.json({
      success: true,
      order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order',
      message: error.message 
    });
  }
};

/**
 * Delete order
 * @route DELETE /api/orders/:id
 */
exports.deleteOrder = async (req, res) => {
  try {
    console.log('\n🗑️  Deleting order:', req.params.id);

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    console.log('✅ Order deleted:', order.orderId);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('orderDeleted', { orderId: order._id });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete order',
      message: error.message 
    });
  }
};

/**
 * Simulate order creation (for demo purposes)
 * @route POST /api/orders/simulate
 */
exports.simulateOrder = async (req, res) => {
  try {
    console.log('🎲 Simulating demo order...');

    const products = [
      { name: 'Wireless Headphones', category: 'electronics', price: 2499 },
      { name: 'Smart Watch', category: 'electronics', price: 4999 },
      { name: 'Yoga Mat', category: 'sports', price: 899 },
      { name: 'Coffee Maker', category: 'home', price: 3499 },
      { name: 'Running Shoes', category: 'sports', price: 2999 }
    ];

    const customers = [
      { name: 'Rajesh Kumar', email: 'rajesh@example.com' },
      { name: 'Priya Sharma', email: 'priya@example.com' },
      { name: 'Amit Patel', email: 'amit@example.com' }
    ];

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;

    const amount = randomProduct.price * randomQuantity;
    const tax = Math.floor(amount * 0.18);
    const discount = Math.random() < 0.2 ? Math.floor(amount * 0.1) : 0;

    const orderData = {
      userId: req.user._id,
      customerName: randomCustomer.name,
      customerEmail: randomCustomer.email,
      product: {
        name: randomProduct.name,
        category: randomProduct.category,
        quantity: randomQuantity,
        unitPrice: randomProduct.price
      },
      amount,
      tax,
      discount,
      totalAmount: amount + tax - discount,
      status: ORDER_STATUS.PENDING,
      paymentMethod: PAYMENT_METHODS.UPI,
      shippingAddress: {
        street: `${Math.floor(Math.random() * 500)} MG Road`,
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001'
      }
    };

    const order = new Order(orderData);
    await order.save();

    console.log('✅ Demo order created:', order.orderId);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', order);
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Demo order created successfully'
    });

  } catch (error) {
    console.error('❌ Simulate order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to simulate order',
      message: error.message 
    });
  }
};

/**
 * Create bulk orders
 * @route POST /api/orders/bulk
 */
exports.createBulkOrders = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Orders array is required' 
      });
    }

    console.log(`📦 Creating ${orders.length} bulk orders...`);

    const ordersWithUser = orders.map(order => ({
      ...order,
      userId: req.user._id
    }));

    const createdOrders = await Order.insertMany(ordersWithUser);

    console.log(`✅ Created ${createdOrders.length} orders`);

    res.status(201).json({
      success: true,
      orders: createdOrders,
      count: createdOrders.length,
      message: `${createdOrders.length} orders created successfully`
    });

  } catch (error) {
    console.error('❌ Bulk create error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create bulk orders',
      message: error.message 
    });
  }
};

/**
 * Update bulk orders
 * @route PUT /api/orders/bulk
 */
exports.updateBulkOrders = async (req, res) => {
  try {
    const { orderIds, updateData } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Order IDs array is required' 
      });
    }

    console.log(`📝 Updating ${orderIds.length} orders...`);

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: updateData }
    );

    console.log(`✅ Updated ${result.modifiedCount} orders`);

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} orders updated successfully`
    });

  } catch (error) {
    console.error('❌ Bulk update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update bulk orders',
      message: error.message 
    });
  }
};

/**
 * Delete bulk orders
 * @route DELETE /api/orders/bulk
 */
exports.deleteBulkOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Order IDs array is required' 
      });
    }

    console.log(`🗑️  Deleting ${orderIds.length} orders...`);

    const result = await Order.deleteMany({ _id: { $in: orderIds } });

    console.log(`✅ Deleted ${result.deletedCount} orders`);

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} orders deleted successfully`
    });

  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete bulk orders',
      message: error.message 
    });
  }
};
