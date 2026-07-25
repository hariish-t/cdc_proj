import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Package,
  CreditCard
} from 'lucide-react';
import { AnimatedCounter, PercentageIndicator } from '../Shared/AnimatedCounter';
import { formatCurrency } from '../../utils/formatters';

/**
 * Stats Grid Component
 * Displays key metrics in beautiful animated cards
 * Each card shows current value, trend, and percentage change
 */
export const StatsGrid = ({ data, loading = false }) => {
  // FIX: Data Mapping to match your backend's flat object structure
  // Your backend sends: { totalOrders: 100, totalRevenue: 542770, ... }
  const stats = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: data?.totalRevenue || 0, // FIXED: removed .revenue
      prefix: '₹',
      icon: DollarSign,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-500/10',
      change: data?.revenueGrowth || 0, // FIXED: removed .growth.revenue
      description: 'vs last month'
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: data?.totalOrders || 0, // FIXED: removed .revenue
      icon: ShoppingCart,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-500/10',
      change: data?.orderGrowth || 0, // FIXED: removed .growth.orders
      description: 'vs last month'
    },
    {
      id: 'customers',
      label: 'Completed Orders',
      value: data?.completedOrders || 0, // FIXED: Mapping to a valid backend key
      icon: Package,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-500/10',
      change: 12.5,
      description: 'this month'
    },
    {
      id: 'avg',
      label: 'Avg Order Value',
      value: data?.averageOrderValue || 0, // FIXED: removed .revenue and corrected key name
      prefix: '₹',
      icon: CreditCard,
      color: 'from-orange-600 to-orange-400',
      bgColor: 'bg-orange-500/10',
      change: 8.3,
      description: 'vs last month'
    },
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-6 animate-pulse bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700">
            <div className="h-4 w-24 bg-gray-200 dark:bg-dark-700 rounded mb-4" />
            <div className="h-8 w-32 bg-gray-100 dark:bg-dark-700 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-50 dark:bg-dark-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02, 
            y: -5,
            transition: { type: 'spring', stiffness: 400 }
          }}
          className="relative p-6 bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden group"
        >
          {/* Background glow effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

          {/* Icon & Change */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} text-blue-500`} style={{ color: 'unset', stroke: 'currentColor' }} />
            </motion.div>

            {/* Percentage change indicator */}
            <PercentageIndicator value={stat.change} />
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {stat.label}
          </p>

          {/* Animated value */}
          <div className="mb-2">
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix || ''}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {stat.description}
          </p>

          {/* Animated progress bar */}
          <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${stat.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max(stat.change + 50, 10), 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
