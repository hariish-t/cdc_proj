import { useEffect, useState } from 'react';
import socketService from '../services/socket';

/**
 * Custom hook for Socket.IO integration
 * Manages real-time connection and event listeners
 * 
 * @returns {Object} Socket state and helper functions
 * 
 * Usage:
 * const { connected, subscribeToOrders, subscribeToAnalytics } = useSocket();
 */
export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Update connected state when socket status changes
    const checkConnection = () => {
      setConnected(socketService.isConnected());
    };

    // Check connection status periodically
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Subscribe to new orders with callback
   */
  const subscribeToOrders = (callback) => {
    socketService.onNewOrder(callback);
    return () => socketService.off('new-order', callback);
  };

  /**
   * Subscribe to order updates with callback
   */
  const subscribeToOrderUpdates = (callback) => {
    socketService.onOrderUpdate(callback);
    return () => socketService.off('order-update', callback);
  };

  /**
   * Subscribe to analytics updates with callback
   */
  const subscribeToAnalytics = (callback) => {
    socketService.onAnalyticsUpdate(callback);
    socketService.subscribeAnalytics();
    
    return () => {
      socketService.off('analytics-update', callback);
      socketService.unsubscribeAnalytics();
    };
  };

  /**
   * Ping server for health check
   */
  const ping = () => {
    socketService.ping();
  };

  return {
    connected,
    subscribeToOrders,
    subscribeToOrderUpdates,
    subscribeToAnalytics,
    ping,
  };
};

export default useSocket;
