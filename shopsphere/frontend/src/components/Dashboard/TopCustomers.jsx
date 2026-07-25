import { motion } from 'framer-motion';
import { Crown, TrendingUp, Medal, Award } from 'lucide-react';
import { formatCurrency, getInitials, getAvatarColor } from '../../utils/formatters';

/**
 * Top Customers Component
 * Beautiful leaderboard displaying top spending customers
 * Features animated rankings, medals, and customer stats
 */
export const TopCustomers = ({ customers = [], loading = false }) => {
  // Medal icons for top 3
  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 1:
        return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/10' };
      case 2:
        return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/10' };
      default:
        return null;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="skeleton h-6 w-32 mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-16 w-full mb-4" />
        ))}
      </div>
    );
  }

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
            <Crown className="w-6 h-6 text-yellow-500" />
            Top Customers
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Highest spending customers this month
          </p>
        </div>

        <motion.div
          className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Top {customers.length}
        </motion.div>
      </div>

      {/* Customer List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {customers.map((customer, index) => {
          const medal = getMedalIcon(index);
          const isTopThree = index < 3;

          return (
            <motion.div
              key={customer.email}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`relative p-4 rounded-xl transition-all cursor-pointer ${
                isTopThree
                  ? 'bg-gradient-to-r from-yellow-500/5 to-transparent border-l-4 border-yellow-500'
                  : 'bg-white/50 dark:bg-dark-800/50 hover:bg-white/80 dark:hover:bg-dark-800/80'
              }`}
            >
              {/* Rank badge */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isTopThree
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {index + 1}
                </motion.div>
              </div>

              <div className="flex items-center gap-4 ml-6">
                {/* Avatar */}
                <motion.div
                  className={`w-12 h-12 rounded-full ${getAvatarColor(customer.name)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {getInitials(customer.name)}
                </motion.div>

                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {customer.name}
                    </h4>
                    {medal && (
                      <motion.div
                        className={`${medal.bg} p-1.5 rounded-full`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                      >
                        <medal.icon className={`w-4 h-4 ${medal.color}`} />
                      </motion.div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {customer.email}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Orders: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {customer.orderCount}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Avg: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(customer.avgOrderValue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Spent */}
                <div className="text-right">
                  <motion.div
                    className="text-xl font-display font-bold gradient-text"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {formatCurrency(customer.totalSpent)}
                  </motion.div>

                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 justify-end mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12%</span>
                  </div>
                </div>
              </div>

              {/* Animated progress bar */}
              {isTopThree && (
                <motion.div
                  className="mt-3 h-1 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - index * 15}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {customers.length === 0 && !loading && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Crown className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No customer data available
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopCustomers;
