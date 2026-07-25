const User = require('../models/User');
const Order = require('../models/Order');
const { connectDB, disconnectDB } = require('../config/database');
const logger = require('./logger');
const { CATEGORIES, ORDER_STATUS } = require('../config/constants');

/**
 * Sample products for different categories
 */
const sampleProducts = [
  // Electronics
  { name: 'iPhone 15 Pro Max', category: CATEGORIES.ELECTRONICS, basePrice: 134900 },
  { name: 'Samsung Galaxy S24 Ultra', category: CATEGORIES.ELECTRONICS, basePrice: 124999 },
  { name: 'MacBook Pro M3', category: CATEGORIES.ELECTRONICS, basePrice: 199900 },
  { name: 'Sony WH-1000XM5 Headphones', category: CATEGORIES.ELECTRONICS, basePrice: 29990 },
  { name: 'iPad Air', category: CATEGORIES.ELECTRONICS, basePrice: 59900 },
  { name: 'Dell XPS 15', category: CATEGORIES.ELECTRONICS, basePrice: 154900 },
  { name: 'Canon EOS R6', category: CATEGORIES.ELECTRONICS, basePrice: 229900 },
  
  // Fashion
  { name: 'Nike Air Max 270', category: CATEGORIES.FASHION, basePrice: 12995 },
  { name: 'Adidas Ultraboost', category: CATEGORIES.FASHION, basePrice: 16999 },
  { name: 'Levi\'s 501 Jeans', category: CATEGORIES.FASHION, basePrice: 4499 },
  { name: 'Ray-Ban Aviator', category: CATEGORIES.FASHION, basePrice: 8990 },
  { name: 'Tommy Hilfiger Polo', category: CATEGORIES.FASHION, basePrice: 3999 },
  
  // Home & Kitchen
  { name: 'Dyson V15 Vacuum', category: CATEGORIES.HOME, basePrice: 59900 },
  { name: 'KitchenAid Stand Mixer', category: CATEGORIES.HOME, basePrice: 34900 },
  { name: 'Philips Air Fryer', category: CATEGORIES.HOME, basePrice: 12999 },
  { name: 'Nespresso Coffee Machine', category: CATEGORIES.HOME, basePrice: 24900 },
  
  // Sports
  { name: 'Yonex Badminton Racket', category: CATEGORIES.SPORTS, basePrice: 5499 },
  { name: 'Decathlon Cycle', category: CATEGORIES.SPORTS, basePrice: 24999 },
  { name: 'Nike Football', category: CATEGORIES.SPORTS, basePrice: 2499 },
  
  // Books
  { name: 'Atomic Habits', category: CATEGORIES.BOOKS, basePrice: 599 },
  { name: 'Deep Work', category: CATEGORIES.BOOKS, basePrice: 449 },
  { name: 'The Pragmatic Programmer', category: CATEGORIES.BOOKS, basePrice: 899 },
  
  // Beauty
  { name: 'Lakme Makeup Kit', category: CATEGORIES.BEAUTY, basePrice: 1999 },
  { name: 'Biotique Face Pack', category: CATEGORIES.BEAUTY, basePrice: 299 },
  
  // Toys
  { name: 'LEGO Star Wars Set', category: CATEGORIES.TOYS, basePrice: 8999 },
  { name: 'Hot Wheels Collection', category: CATEGORIES.TOYS, basePrice: 2499 }
];

/**
 * Sample customer names
 */
const customerNames = [
  'Rahul Sharma', 'Priya Singh', 'Amit Patel', 'Sneha Gupta', 'Vikram Reddy',
  'Anjali Verma', 'Rohan Kumar', 'Kavya Iyer', 'Arjun Nair', 'Pooja Desai',
  'Karthik Menon', 'Divya Krishnan', 'Sanjay Agarwal', 'Neha Joshi', 'Varun Malhotra',
  'Riya Mehta', 'Aditya Kapoor', 'Swati Pandey', 'Nikhil Rao', 'Meera Pillai'
];

/**
 * Generate random date within last N days
 */
const randomDateInPast = (days) => {
  const now = Date.now();
  const pastDate = now - (days * 24 * 60 * 60 * 1000);
  return new Date(pastDate + Math.random() * (now - pastDate));
};

/**
 * Generate random order
 */
const generateRandomOrder = (adminId) => {
  const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
  const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
  const quantity = Math.floor(Math.random() * 3) + 1;
  const unitPrice = product.basePrice + Math.floor(Math.random() * 1000);
  const amount = unitPrice * quantity;
  const tax = Math.floor(amount * 0.18);
  const discount = Math.random() > 0.7 ? Math.floor(amount * 0.1) : 0;
  
  const statuses = Object.values(ORDER_STATUS);
  const paymentMethods = ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash_on_delivery'];
  
  return {
    userId: adminId,
    customerName: customer,
    customerEmail: customer.toLowerCase().replace(' ', '.') + '@example.com',
    product: {
      name: product.name,
      category: product.category,
      quantity: quantity,
      unitPrice: unitPrice
    },
    amount: amount,
    tax: tax,
    discount: discount,
    totalAmount: amount + tax - discount,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    createdAt: randomDateInPast(180) // Random date in last 6 months
  };
};

/**
 * Seed database with sample data
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    logger.info('Clearing existing data...');
    await Order.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    logger.info('Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@shopsphere.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin'
    });

    logger.info(`✅ Admin created: ${admin.email}`);

    // Generate orders
    const numberOfOrders = 500; // Generate 500 sample orders
    logger.info(`Generating ${numberOfOrders} sample orders...`);

    const orders = [];
    for (let i = 0; i < numberOfOrders; i++) {
      orders.push(generateRandomOrder(admin._id));
    }

    // Insert orders in batches
    const batchSize = 100;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      await Order.insertMany(batch);
      logger.info(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(orders.length / batchSize)}`);
    }

    logger.info(`✅ ${orders.length} orders created successfully`);

    // Display summary
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    logger.info('📊 Order Status Summary:');
    stats.forEach(stat => {
      logger.info(`  ${stat._id}: ${stat.count}`);
    });

    logger.info('\n🎉 Database seeded successfully!');
    logger.info('\n📝 Login Credentials:');
    logger.info(`   Email: ${admin.email}`);
    logger.info(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

/**
 * Run seeding if called directly
 */
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, generateRandomOrder };
