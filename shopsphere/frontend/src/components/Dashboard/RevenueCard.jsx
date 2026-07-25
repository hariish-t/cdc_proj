import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { AnimatedCounter } from '../Shared/AnimatedCounter';
import { formatCurrency } from '../../utils/formatters';

/**
 * Revenue Card Component
 * Hero card showcasing total revenue with stunning visuals
 * Features animated numbers, trend indicators, and comparison data
 */
export const RevenueCard = ({ data, loading = false }) => {
  // FIX: Mapping to your backend's flat object structure
  // Based on your logs: { totalRevenue: 542770, revenueGrowth: -11.5, ... }
  const currentRevenue = data?.totalRevenue || 0;
  
  // Note: Since the current API doesn't provide 'lastMonth' explicitly in the flat dashboard call,
  // we calculate a placeholder for the UI comparison.
  const growthPercent = data?.revenueGrowth || 0;
  const lastMonthRevenue = currentRevenue / (1 + (growthPercent / 100));
  const isPositiveGrowth = growthPercent >= 0;

  if (loading) {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#E8E3DD] rounded-2xl p-8 animate-pulse">
        <div className="bg-[#F0EEEB] h-6 w-32 mb-6 rounded" />
        <div className="bg-[#F0EEEB] h-16 w-48 mb-4 rounded" />
        <div className="bg-[#F0EEEB] h-4 w-64 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-[#FFFFFF] border-2 border-[#E8E3DD] p-8 relative overflow-hidden group rounded-2xl shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated background gradient using Primary Purple Scale */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#7C6FAA]/10 via-[#9B8DC7]/10 to-[#F5F2FF]/10 -z-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#7C6FAA]/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C6FAA] to-[#9B8DC7] flex items-center justify-center shadow-lg shadow-[#7C6FAA]/20"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <DollarSign className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-sm font-medium text-[#706864]">
                Total Revenue
              </h3>
              <p className="text-xs text-[#B4ABA5] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Annual Forecast 2026
              </p>
            </div>
          </div>

          {/* Growth badge using Status Colors */}
          <motion.div
            className={`px-4 py-2 rounded-full ${
              isPositiveGrowth
                ? 'bg-[#F1F8ED] text-[#A7C796]'
                : 'bg-[#FFF5F5] text-[#D4A5A5]'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="flex items-center gap-2">
              {isPositiveGrowth ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-bold">
                {Math.abs(growthPercent).toFixed(1)}%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Main revenue display */}
        <div className="mb-6">
          <motion.div
            className="text-5xl font-display font-bold text-[#2B2621] mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedCounter
              value={currentRevenue}
              prefix="₹"
              className="text-5xl font-display font-bold text-[#2B2621]"
            />
          </motion.div>

          <motion.p
            className="text-[#706864] flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>Current performance vs. historical average</span>
          </motion.p>
        </div>

        {/* Comparison stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DD]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-[#B4ABA5] mb-1">
              Current Revenue
            </p>
            <p className="text-xl font-bold text-[#2B2621]">
              {formatCurrency(currentRevenue)}
            </p>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DD]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-[#B4ABA5] mb-1">
              Estimated Growth
            </p>
            <p className={`text-xl font-bold ${isPositiveGrowth ? 'text-[#A7C796]' : 'text-[#D4A5A5]'}`}>
              {growthPercent}%
            </p>
          </motion.div>
        </div>

        {/* Animated progress indicator using Primary Gradient */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between text-xs text-[#706864] mb-2">
            <span>Revenue Target</span>
            <span className="font-bold text-[#7C6FAA]">Active Session</span>
          </div>
          <div className="h-2 bg-[#F0EEEB] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7C6FAA] via-[#9B8DC7] to-[#B5A8D8]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RevenueCard;
