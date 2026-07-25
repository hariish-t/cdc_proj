const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('./constants');

/**
 * Initialize Socket.IO with authentication
 */
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Track active connections
  let activeUsers = 0;

  /**
   * Socket.IO Middleware: Authenticate connections (optional)
   */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.isAuthenticated = true;
      } else {
        socket.isAuthenticated = false;
      }

      next();
    } catch (error) {
      // Allow connection even if token is invalid (for public features)
      socket.isAuthenticated = false;
      next();
    }
  });

  /**
   * Connection handler
   */
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    activeUsers++;
    
    logger.info(`Socket connected: ${socket.id} | Active users: ${activeUsers}`);

    // Emit active user count to all clients
    io.emit('active-users', { count: activeUsers });

    /**
     * Join room based on user role (optional)
     */
    if (socket.isAuthenticated) {
      socket.join(`user-${socket.userId}`);
      logger.info(`User ${socket.userId} joined their room`);
    }

    /**
     * Handle client events
     */
    socket.on('subscribe-analytics', () => {
      socket.join('analytics-room');
      logger.info(`Socket ${socket.id} subscribed to analytics`);
    });

    socket.on('unsubscribe-analytics', () => {
      socket.leave('analytics-room');
      logger.info(`Socket ${socket.id} unsubscribed from analytics`);
    });

    /**
     * Handle ping/pong for connection monitoring
     */
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    /**
     * Disconnect handler
     */
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      activeUsers--;
      logger.info(`Socket disconnected: ${socket.id} | Reason: ${reason} | Active users: ${activeUsers}`);
      
      // Emit updated active user count
      io.emit('active-users', { count: activeUsers });
    });

    /**
     * Error handler
     */
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  /**
   * Helper function to emit to authenticated users only
   */
  io.emitToAuthenticated = (event, data) => {
    io.sockets.sockets.forEach((socket) => {
      if (socket.isAuthenticated) {
        socket.emit(event, data);
      }
    });
  };

  /**
   * Helper function to emit to specific user
   */
  io.emitToUser = (userId, event, data) => {
    io.to(`user-${userId}`).emit(event, data);
  };

  /**
   * Helper function to get active user count
   */
  io.getActiveUsers = () => activeUsers;

  logger.info('✅ Socket.IO initialized successfully');

  return io;
};

module.exports = { initializeSocket };
