import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

/**
 * Initialize socket connection
 */
export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('✅ Connected to SystemStream backend');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from backend');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  return socket;
};

/**
 * Subscribe to system metrics
 */
export const subscribeToMetrics = (callback) => {
  if (!socket) {
    socket = connectSocket();
  }

  socket.on('system:metrics', (data) => {
    callback(data);
  });

  return () => {
    socket.off('system:metrics');
  };
};

/**
 * Subscribe to system info (static data)
 */
export const subscribeToSystemInfo = (callback) => {
  if (!socket) {
    socket = connectSocket();
  }

  socket.on('system:info', (data) => {
    callback(data);
  });

  return () => {
    socket.off('system:info');
  };
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get connection status
 */
export const isConnected = () => {
  return socket?.connected || false;
};

export default {
  connectSocket,
  subscribeToMetrics,
  subscribeToSystemInfo,
  disconnectSocket,
  isConnected
};
