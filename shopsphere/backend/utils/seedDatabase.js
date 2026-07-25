require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const { ROLES, ORDER_STATUS, CATEGORIES } = require('../config/constants');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@shopsphere.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: ROLES.ADMIN,
    isActive: true
  },
  {
    name: 'Manager User',
    email: 'manager@shopsphere.com',
    password: 'Manager@123456',
    role: ROLES.MANAGER,
    isActive: true
  },
  {
    name: 'Demo Customer',
    email: 'customer@example.com',
    password: 'Customer@123',
    role: ROLES.VIEWER,
    isActive: true
  }
];

const products = [
  { name: 'Wireless Headphones', category: CATEGORIES.ELECTRONICS, unitPrice: 2499 },
  { name: 'Smart Watch', category: CATEGORIES.ELECTRONICS, unitPrice: 4999 },
  { name: 'Yoga Mat', category: CATEGORIES.SPORTS, unitPrice: 899 },
  { name: 'Coffee Maker', category: CATEGORIES.HOME, unitPrice: 3499 },
  { name: 'Running Shoes', category: CATEGORIES.SPORTS, unitPrice: 2999 },
  { name: 'Laptop Stand', category: CATEGORIES.ELECTRONICS, unitPrice: 1299 },
  { name: 'Water Bottle', category: CATEGORIES.SPORTS, unitPrice: 499 },
  { name: 'LED Lamp', category: CATEGORIES.HOME, unitPrice: 1499 },
  { name: 'Bluetooth Speaker', category: CATEGORIES.ELECTRONICS, unitPrice: 1999 },
  { name: 'Backpack', category: CATEGORIES.FASHION, unitPrice: 1799 },
  { name: 'Gaming Mouse', category: CATEGORIES.ELECTRONICS, unitPrice: 1599 },
  { name: 'Desk Chair', category: CATEGORIES.HOME, unitPrice: 8999 },
  { name: 'Protein Powder', category: CATEGORIES.SPORTS, unitPrice: 2499 },
  { name: 'Winter Jacket', category: CATEGORIES.FASHION, unitPrice: 4999 },
  { name: 'Electric Kettle', category: CATEGORIES.HOME, unitPrice: 1299 }
];

const customers = [
  { name: 'Rajesh Kumar', email: 'rajesh.k@email.com' },
  { name: 'Priya Sharma', email: 'priya.s@email.com' },
  { name: 'Amit Patel', email: 'amit.p@email.com' },
  { name: 'Sneha Reddy', email: 'sneha.r@email.com' },
  { name: 'Vikram Singh', email: 'vikram.s@email.com' },
  { name: 'Anita Desai', email: 'anita.d@email.com' },
  { name: 'Rahul Verma', email: 'rahul.v@email.com' },
  { name: 'Pooja Iyer', email: 'pooja.i@email.com' },
  { name: 'Arjun Mehta', email: 'arjun.m@email.com' },
  { name: 'Kavya Nair', email: 'kavya.n@email.com' }
];

const generateOrders = (adminUserId, count = 200) => {
  const orders = [];
  const paymentMethods = ['credit_card', 'debit_card', 'upi', 'net_banking'];
  
  // Status distribution: 70% completed, 15% processing, 10% pending, 5% cancelled
  const statusWeights = [
    { status: ORDER_STATUS.COMPLETED, weight: 0.70 },
    { status: ORDER_STATUS.PROCESSING, weight: 0.15 },
    { status: ORDER_STATUS.PENDING, weight: 0.10 },
    { status: ORDER_STATUS.CANCELLED, weight: 0.05 }
  ];

  const getWeightedStatus = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (const { status, weight } of statusWeights) {
      cumulative += weight;
      if (rand < cumulative) return status;
    }
    return ORDER_STATUS.COMPLETED;
  };

  // Generate orders spread across 2026 (Jan 1 to current date)
  const year = 2026;
  const startDate = new Date(year, 0, 1); // January 1, 2026
  const endDate = new Date(year, 11, 31); // Current date
  const timeRange = endDate.getTime() - startDate.getTime();

  console.log(`📅 Generating ${count} orders from ${startDate.toDateString()} to ${endDate.toDateString()}`);

  for (let i = 0; i < count; i++) {
    // Distribute orders evenly throughout the time range
    const randomTime = startDate.getTime() + Math.random() * timeRange;
    const createdDate = new Date(randomTime);

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;
    const status = getWeightedStatus();
    
    const amount = randomProduct.unitPrice * randomQuantity;
    const tax = Math.floor(amount * 0.18);
    const discount = Math.random() < 0.2 ? Math.floor(amount * 0.1) : 0;
    const totalAmount = amount + tax - discount;

    orders.push({
      userId: adminUserId,
      customerName: randomCustomer.name,
      customerEmail: randomCustomer.email,
      product: {
        name: randomProduct.name,
        category: randomProduct.category,
        quantity: randomQuantity,
        unitPrice: randomProduct.unitPrice
      },
      amount,
      tax,
      discount,
      totalAmount,
      status,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: {
        street: `${Math.floor(Math.random() * 500)} MG Road`,
        city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)],
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal'][Math.floor(Math.random() * 5)],
        country: 'India',
        zipCode: `${Math.floor(Math.random() * 900000) + 100000}`
      },
      createdAt: createdDate,
      updatedAt: createdDate,
      ...(status === ORDER_STATUS.COMPLETED && { 
        completedAt: new Date(createdDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000) 
      }),
      ...(status === ORDER_STATUS.CANCELLED && { 
        cancelledAt: new Date(createdDate.getTime() + (Math.random() * 1 + 0.5) * 24 * 60 * 60 * 1000) 
      })
    });
  }

  // Sort by date for better distribution check
  orders.sort((a, b) => a.createdAt - b.createdAt);

  return orders;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Data cleared\n');
    
    // Create users
    console.log('👤 Creating users...');
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find(u => u.role === ROLES.ADMIN);
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log(`   Admin: ${adminUser.email}\n`);
    
    // Create orders (200 orders for better data distribution)
    console.log('📦 Generating 200 orders...');
    const orders = generateOrders(adminUser._id, 200);
    await Order.insertMany(orders);
    console.log(`✅ Created ${orders.length} orders\n`);
    
    // Display statistics
    console.log('📊 Database Statistics:');
    console.log('─'.repeat(50));
    
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: ORDER_STATUS.COMPLETED });
    const processingOrders = await Order.countDocuments({ status: ORDER_STATUS.PROCESSING });
    const pendingOrders = await Order.countDocuments({ status: ORDER_STATUS.PENDING });
    const cancelledOrders = await Order.countDocuments({ status: ORDER_STATUS.CANCELLED });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: ORDER_STATUS.COMPLETED } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const avgOrderValue = totalRevenue[0]?.total / completedOrders || 0;

    // Show distribution by month
    const monthlyDistribution = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log(`Total Orders:      ${totalOrders}`);
    console.log(`├─ Completed:      ${completedOrders} (${(completedOrders/totalOrders*100).toFixed(0)}%)`);
    console.log(`├─ Processing:     ${processingOrders} (${(processingOrders/totalOrders*100).toFixed(0)}%)`);
    console.log(`├─ Pending:        ${pendingOrders} (${(pendingOrders/totalOrders*100).toFixed(0)}%)`);
    console.log(`└─ Cancelled:      ${cancelledOrders} (${(cancelledOrders/totalOrders*100).toFixed(0)}%)`);
    console.log();
    console.log(`Total Revenue:     ₹${totalRevenue[0]?.total.toLocaleString('en-IN') || 0}`);
    console.log(`Avg Order Value:   ₹${Math.round(avgOrderValue).toLocaleString('en-IN')}`);
    console.log();
    console.log('Monthly Distribution (2026):');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyDistribution.forEach(m => {
      console.log(`  ${months[m._id - 1]}: ${m.count} orders`);
    });
    
    console.log('─'.repeat(50));
    console.log('\n✅ Database seeded successfully!\n');
    console.log('🔐 Login Credentials:');
    console.log(`   Email:    ${adminUser.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log();
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB\n');
    process.exit(0);
  }
};

// Run seed
connectDB().then(seedDatabase);
