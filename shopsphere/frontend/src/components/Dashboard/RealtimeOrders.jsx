import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShoppingBag, Clock, DollarSign, Zap } from 'lucide-react';
import useSocket from '../../hooks/useSocket';
import { formatCurrency, formatRelativeDate, getStatusColor, formatStatus } from '../../utils/formatters';

/**
 * Realtime Orders Component
 * Live feed of orders with Socket.IO integration
 * Shows new orders as they come in with beautiful animations
 */
export const RealtimeOrders = ({ initialOrders = [] }) => {
  const [orders, setOrders] = useState(initialOrders);
  const { connected, subscribeToOrders } = useSocket();

  // Subscribe to real-time order updates
  useEffect(() => {
    const unsubscribe = subscribeToOrders((newOrder) => {
      // Play notification sound (optional)
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore if audio fails to play
      });

      // Add new order to top of list
      setOrders((prev) => [newOrder, ...prev].slice(0, 10)); // Keep only last 10
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToOrders]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      x: 50,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
            Live Orders
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time order feed
          </p>
        </div>

        {/* Connection status */}
        <motion.div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            connected
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
          animate={connected ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-4 h-4" />
          <span className="text-xs font-semibold">
            {connected ? 'Live' : 'Offline'}
          </span>
        </motion.div>
      </div>

      {/* Orders Feed */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                key={order._id || order.orderId}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="relative p-4 rounded-xl bg-white/50 dark:bg-dark-800/50 hover:bg-white/80 dark:hover:bg-dark-800/80 transition-all cursor-pointer group"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {/* New order indicator */}
                {order.isRecent && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Order Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    {/* Customer & Product */}
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {order.customerName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {order.product?.name || 'Product Name'}
                    </p>

                    {/* Status & Time */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatRelativeDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <motion.div
                      className="text-lg font-bold text-gray-900 dark:text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                    >
                      {formatCurrency(order.totalAmount)}
                    </motion.div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <DollarSign className="w-3 h-3" />
                      <span>x{order.product?.quantity || 1}</span>
                    </div>
                  </div>
                </div>

                {/* Animated bottom border */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500 dark:text-gray-400">
                Waiting for new orders...
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                New orders will appear here in real-time
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer stats */}
      <motion.div
        className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing last <span className="font-semibold text-gray-900 dark:text-white">{orders.length}</span> orders
        </div>
        
        <motion.div
          className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          whileHover={{ x: 5 }}
        >
          View All Orders
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RealtimeOrders;
