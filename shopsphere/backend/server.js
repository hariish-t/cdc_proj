require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

// Import configurations
const { connectDB } = require('./config/database');
const { initializeSocket } = require('./config/socket');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const exportRoutes = require('./routes/exportRoutes');

/**
 * Initialize Express Application
 */
const app = express();
const server = http.createServer(app);

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * Initialize Socket.IO
 */
const io = initializeSocket(server);

/**
 * Middleware: Make io available to all routes
 */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Swagger UI
  crossOriginEmbedderPolicy: false
}));

/**
 * CORS Configuration
 */
app.use(cors({
  origin: 'http://localhost:5173'	,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * HTTP Request Logging
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

/**
 * API Routes
 */
const API_PREFIX = '/api';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/export`, exportRoutes);

/**
 * API Documentation (Swagger UI)
 */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ShopSphere API Docs'
  })
);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    activeConnections: io.getActiveUsers()
  });
});

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ShopSphere Analytics API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      orders: `${API_PREFIX}/orders`,
      analytics: `${API_PREFIX}/analytics`,
      export: `${API_PREFIX}/export`
    }
  });
});

/**
 * 404 Handler - Must be after all routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler - Must be last
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 ShopSphere Analytics Server                         ║
║                                                           ║
║   Environment: ${(process.env.NODE_ENV || 'development').toUpperCase().padEnd(10)}                                  ║
║   Port: ${PORT.toString().padEnd(10)}                                         ║
║   Server: http://localhost:${PORT}                            ║
║   API Docs: http://localhost:${PORT}/api-docs                  ║
║   Health: http://localhost:${PORT}/health                      ║
║                                                           ║
║   Socket.IO: ✅ Active                                    ║
║   MongoDB: ✅ Connected                                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

/**
 * Graceful Shutdown
 */
const gracefulShutdown = (signal) => {
  logger.info(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Close Socket.IO connections
    io.close(() => {
      logger.info('Socket.IO closed');
    });
    
    // Close database connection
    const { disconnectDB } = require('./config/database');
    await disconnectDB();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

module.exports = { app, server, io };
