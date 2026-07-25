import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /**
   * Connect to Socket.IO server
   */
  connect(token = null) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token: token || localStorage.getItem('accessToken'),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
    return this.socket;
  }

  /**
   * Setup default listeners
   */
  setupListeners() {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Active users count
    this.socket.on('active-users', (data) => {
      console.log('Active users:', data.count);
    });
  }

  /**
   * Subscribe to new orders
   */
  onNewOrder(callback) {
    if (!this.socket) return;
    this.socket.on('new-order', callback);
  }

  /**
   * Subscribe to order updates
   */
  onOrderUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('order-update', callback);
  }

  /**
   * Subscribe to analytics updates
   */
  onAnalyticsUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('analytics-update', callback);
  }

  /**
   * Subscribe to analytics room
   */
  subscribeAnalytics() {
    if (!this.socket) return;
    this.socket.emit('subscribe-analytics');
  }

  /**
   * Unsubscribe from analytics room
   */
  unsubscribeAnalytics() {
    if (!this.socket) return;
    this.socket.emit('unsubscribe-analytics');
  }

  /**
   * Remove specific listener
   */
  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket disconnected manually');
    }
  }

  /**
   * Check connection status
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Ping server for connection health check
   */
  ping() {
    if (!this.socket) return;
    this.socket.emit('ping');
    this.socket.once('pong', (data) => {
      console.log('Pong received:', data);
    });
  }

  /**
   * Get socket instance
   */
  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
