import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { ordersAPI, analyticsAPI } from '../services/api';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Star,
  Award,
  TrendingDown as TrendDown
} from 'lucide-react';

const Dashboard = () => {
  const { dashboardData, loading, error } = useAnalytics();
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  //~ const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });



  // Fetch additional data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartsLoading(true);
        const [ordersRes, salesRes, customersRes] = await Promise.all([
          ordersAPI.getRecentOrders(8),
          analyticsAPI.getMonthlySales(2026),
          analyticsAPI.getTopCustomers(5)
        ]);
        setRecentOrders(ordersRes?.orders || ordersRes || []);
        setMonthlySales(salesRes || []);
        setTopCustomers(customersRes || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setChartsLoading(false);
      }
    };
    if (dashboardData) fetchData();
  }, [dashboardData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden flex items-center justify-center">
        <AnimatedBackground />
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-[#D4C5F9] mx-auto mb-8 flex items-center justify-center relative"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-[#C5B3F0]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Sparkles className="w-16 h-16 text-[#7C5CDB]" />
          </motion.div>
          <motion.h3 
            className="text-3xl font-bold text-[#4A4458] mb-3"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading ShopSphere
          </motion.h3>
          <motion.p 
            className="text-[#6B6B6B] text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Preparing your analytics dashboard...
          </motion.p>
          <div className="flex gap-2 justify-center mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-[#A393D8]"
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden flex items-center justify-center p-6">
        <AnimatedBackground />
        <motion.div 
          className="text-center max-w-md bg-[#FFDEDE] rounded-3xl border-2 border-[#FFB3B3] p-12 relative z-10 shadow-2xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <XCircle className="w-20 h-20 text-[#FF6B6B] mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[#4A4458] mb-4">Oops!</h2>
          <p className="text-[#6B6B6B] mb-8 text-lg">{error || 'Unable to load dashboard'}</p>
          <motion.button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-[#D4C5F9] text-[#4A4458] rounded-2xl font-bold shadow-lg"
            whileHover={{ scale: 1.05, backgroundColor: '#C5B3F0' }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden w-full">
      <AnimatedBackground />
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        <FloatingParticles />
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div>
            <motion.h1 
              className="text-5xl font-bold text-[#4A4458] mb-3 flex items-center gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Dashboard
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10 text-[#A393D8]" />
              </motion.div>
            </motion.h1>
            <motion.p 
              className="text-[#6B6B6B] text-xl flex items-center gap-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back! Your business is thriving
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.p>
          </div>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <div className="px-6 py-4 bg-[#E8DFF5] rounded-2xl border-2 border-[#D4C5F9] relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-[#D4C5F9] opacity-0"
                whileHover={{ opacity: 0.3 }}
              />
              <p className="text-xs text-[#6B6B6B] mb-1 uppercase tracking-wider font-semibold">Total Revenue</p>
              <CountUpNumber 
                value={dashboardData.totalRevenue} 
                format={formatCurrency}
                className="text-3xl font-bold text-[#7C5CDB]"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumStatCard	
            title="Total Orders"
            value={dashboardData.totalOrders}
            icon={ShoppingCart}
            bgColor="bg-[#E8DFF5]"
            borderColor="border-[#D4C5F9]"
            iconColor="text-[#7C5CDB]"
            trend={dashboardData.orderGrowth}
            delay={0}
          />
          <PremiumStatCard
            title="Completed"
            value={dashboardData.completedOrders}
            icon={CheckCircle}
            bgColor="bg-[#D4F4DD]"
            borderColor="border-[#B3E6C0]"
            iconColor="text-[#4CAF50]"
            subtitle={`${((dashboardData.completedOrders/dashboardData.totalOrders)*100).toFixed(1)}% success rate`}
            delay={0.1}
          />
          <PremiumStatCard
            title="Processing"
            value={dashboardData.processingOrders}
            icon={Clock}
            bgColor="bg-[#D4ECFA]"
            borderColor="border-[#B3DBF2]"
            iconColor="text-[#2196F3]"
            subtitle={`${dashboardData.pendingOrders} pending`}
            delay={0.2}
          />
          <PremiumStatCard
            title="Avg Order Value"
            value={dashboardData.averageOrderValue}
            icon={TrendingUp}
            bgColor="bg-[#FFE8D4]"
            borderColor="border-[#FFD4B3]"
            iconColor="text-[#FF9800]"
            trend={dashboardData.revenueGrowth}
            delay={0.3}
            isCurrency={true}
          />
        </div>

        {/* Charts & Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <GlassCard bgColor="bg-[#FFEEF8]" borderColor="border-[#FFD4EC]">
              <CardHeader 
                title="Sales Performance" 
                subtitle="Monthly revenue trends across the year"
                icon={TrendingUp}
                iconColor="text-[#E91E63]"
              />
              <MiniSalesChart data={monthlySales} loading={chartsLoading} />
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <GlassCard bgColor="bg-[#FFF8E1]" borderColor="border-[#FFEAA7]">
              <CardHeader 
                title="Top Customers" 
                subtitle="Highest value customers" 
                icon={Award}
                iconColor="text-[#FFA726]"
              />
              <div className="space-y-3 mt-6">
                {chartsLoading ? (
                  [...Array(5)].map((_, i) => (
                    <ShimmerLoading key={i} delay={i * 0.1} />
                  ))
                ) : topCustomers.length > 0 ? (
                  topCustomers.map((customer, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border-2 border-white hover:border-[#FFEAA7] transition-all cursor-pointer group relative overflow-hidden"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-[#FFF8E1] opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="flex items-center gap-3 relative z-10">
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-[#FFE082] flex items-center justify-center text-[#F57C00] font-bold text-lg border-2 border-[#FFEAA7]"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {customer.name.charAt(0)}
                        </motion.div>
                        <div>
                          <p className="font-bold text-[#4A4458] group-hover:text-[#F57C00] transition-colors">
                            {customer.name}
                          </p>
                          <p className="text-xs text-[#6B6B6B] flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#FFA726] text-[#FFA726]" />
                            {customer.orderCount} orders
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-[#4A4458] text-lg relative z-10">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-[#6B6B6B] py-12">No customer data yet</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Order Status Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <GlassCard bgColor="bg-[#E0F2F1]" borderColor="border-[#B2DFDB]">
            <CardHeader 
              title="Order Distribution" 
              subtitle="Real-time status breakdown" 
              icon={PieChart}
              iconColor="text-[#00897B]"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <StatusPill
                label="Completed"
                count={dashboardData.completedOrders}
                total={dashboardData.totalOrders}
                bgColor="bg-[#D4F4DD]"
                barColor="bg-[#4CAF50]"
                icon={CheckCircle}
                iconColor="text-[#4CAF50]"
                delay={0}
              />
              <StatusPill
                label="Processing"
                count={dashboardData.processingOrders}
                total={dashboardData.totalOrders}
                bgColor="bg-[#D4ECFA]"
                barColor="bg-[#2196F3]"
                icon={Activity}
                iconColor="text-[#2196F3]"
                delay={0.1}
              />
              <StatusPill
                label="Pending"
                count={dashboardData.pendingOrders}
                total={dashboardData.totalOrders}
                bgColor="bg-[#FFE8D4]"
                barColor="bg-[#FF9800]"
                icon={AlertCircle}
                iconColor="text-[#FF9800]"
                delay={0.2}
              />
              <StatusPill
                label="Cancelled"
                count={dashboardData.cancelledOrders}
                total={dashboardData.totalOrders}
                bgColor="bg-[#FFDEDE]"
                barColor="bg-[#FF6B6B]"
                icon={XCircle}
                iconColor="text-[#FF6B6B]"
                delay={0.3}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: "spring" }}
        >
          <GlassCard bgColor="bg-[#F3E5F5]" borderColor="border-[#E1BEE7]">
            <CardHeader 
              title="Recent Orders" 
              subtitle="Latest transactions from your store" 
              icon={Package}
              iconColor="text-[#9C27B0]"
            />
            <div className="mt-6 space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, i) => (
                  <motion.div
                    key={order._id}
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/50 border-2 border-white hover:border-[#E1BEE7] transition-all cursor-pointer group relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.08, type: "spring" }}
                    whileHover={{ scale: 1.01, x: 5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-[#F3E5F5] opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="flex items-center gap-4 flex-1 relative z-10">
                      <motion.div 
                        className="w-14 h-14 rounded-2xl bg-[#E1BEE7] flex items-center justify-center border-2 border-[#CE93D8]"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Package className="w-7 h-7 text-[#9C27B0]" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#4A4458]">{order.customerName}</p>
                          <span className="text-xs text-[#6B6B6B]">•</span>
                          <p className="text-xs text-[#6B6B6B] font-mono">{order.orderId}</p>
                        </div>
                        <p className="text-sm text-[#6B6B6B]">{order.product?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="text-right">
                        <p className="font-bold text-[#4A4458] text-lg">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-xs text-[#6B6B6B]">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <OrderBadge status={order.status} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Package className="w-16 h-16 text-[#E1BEE7] mx-auto mb-4" />
                  <p className="text-[#6B6B6B] text-lg">No recent orders</p>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
};

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-[#E8DFF5] opacity-50 blur-3xl"
        style={{
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-[#D4F4DD] opacity-40 blur-3xl"
        style={{
          top: '20%',
          right: '-10%',
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-[#FFE8D4] opacity-50 blur-3xl"
        style={{
          bottom: '10%',
          left: '30%',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Geometric Shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 border-2 border-[#D4C5F9] opacity-30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            borderRadius: i % 2 === 0 ? '50%' : '20%',
          }}
          animate={{
            rotate: 360,
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7C5CDB" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

// Floating Particles
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#D4C5F9', '#B3E6C0', '#FFD4B3', '#FFD4EC'][i % 4],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = '', bgColor = 'bg-white', borderColor = 'border-gray-200' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      className={`${bgColor} backdrop-blur-xl rounded-3xl border-2 ${borderColor} shadow-xl p-6 ${className} relative overflow-hidden`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.4 }}
      whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {children}
    </motion.div>
  );
};

// Card Header
const CardHeader = ({ title, subtitle, icon: Icon, iconColor = 'text-purple-500' }) => (
  <div className="flex items-start justify-between mb-2">
    <div className="flex-1">
      <motion.h3 
        className="text-xl font-bold text-[#4A4458] flex items-center gap-3 mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {Icon && (
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </motion.div>
        )}
        {title}
      </motion.h3>
      {subtitle && (
        <motion.p 
          className="text-sm text-[#6B6B6B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </div>
);

// Count Up Animation Hook
const useCountUp = (end, duration = 2) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// Count Up Number Component
const CountUpNumber = ({ value, format, className }) => {
  const count = useCountUp(value);
  return <span className={className}>{format ? format(count) : count}</span>;
};

// Premium Stat Card
const PremiumStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  bgColor, 
  borderColor, 
  iconColor, 
  trend, 
  subtitle, 
  delay,
  isCurrency = false
}) => {
  const isPositive = trend >= 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, type: "spring", bounce: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <motion.div 
        className={`relative ${bgColor} backdrop-blur-xl rounded-3xl border-2 ${borderColor} p-6 shadow-lg overflow-hidden`}
        whileHover={{ shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <motion.div 
              className={`w-16 h-16 rounded-2xl ${bgColor} border-2 ${borderColor} flex items-center justify-center shadow-md`}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </motion.div>
            {trend !== undefined && (
              <motion.div 
                className={`flex items-center gap-1 px-3 py-2 rounded-xl ${
                  isPositive 
                    ? 'bg-[#D4F4DD] text-[#4CAF50] border-2 border-[#B3E6C0]' 
                    : 'bg-[#FFDEDE] text-[#FF6B6B] border-2 border-[#FFB3B3]'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.3, type: "spring" }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ y: isPositive ? [-2, 0, -2] : [2, 0, 2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </motion.div>
                <span className="text-sm font-bold">{Math.abs(trend).toFixed(1)}%</span>
              </motion.div>
            )}
          </div>
          
          <motion.p 
            className="text-sm text-[#6B6B6B] mb-2 uppercase tracking-wider font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.1 }}
          >
            {title}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
          >
            {isCurrency ? (
              <CountUpNumber 
                value={value} 
                format={(v) => new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(v)}
                className="text-4xl font-bold text-[#4A4458] mb-2"
              />
            ) : (
              <p className="text-4xl font-bold text-[#4A4458] mb-2">
                <CountUpNumber value={value} />
              </p>
            )}
          </motion.div>
          
          {subtitle && (
            <motion.p 
              className="text-xs text-[#6B6B6B]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.4 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Status Pill
const StatusPill = ({ label, count, total, bgColor, barColor, icon: Icon, iconColor, delay }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div 
      ref={ref}
      className={`p-5 rounded-2xl ${bgColor} border-2 border-white shadow-md relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.8 + delay, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className={`w-10 h-10 rounded-xl ${bgColor} border-2 border-white flex items-center justify-center shadow-sm`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </motion.div>
          <p className="text-sm font-bold text-[#4A4458]">{label}</p>
        </div>
        
        <motion.p 
          className="text-3xl font-bold text-[#4A4458] mb-3"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.9 + delay, type: "spring" }}
        >
          <CountUpNumber value={count} />
        </motion.p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border-2 border-white shadow-inner">
              <motion.div 
                className={`h-full ${barColor} rounded-full`}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${percentage}%` } : {}}
                transition={{ delay: 1 + delay, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          <motion.span 
            className="text-xs text-[#6B6B6B] font-bold block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 + delay }}
          >
            {percentage.toFixed(1)}% of total
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

// Order Badge with Animation
const OrderBadge = ({ status }) => {
  const config = {
    completed: { bg: 'bg-[#D4F4DD]', text: 'text-[#4CAF50]', border: 'border-[#B3E6C0]', label: 'Completed' },
    processing: { bg: 'bg-[#D4ECFA]', text: 'text-[#2196F3]', border: 'border-[#B3DBF2]', label: 'Processing' },
    pending: { bg: 'bg-[#FFE8D4]', text: 'text-[#FF9800]', border: 'border-[#FFD4B3]', label: 'Pending' },
    cancelled: { bg: 'bg-[#FFDEDE]', text: 'text-[#FF6B6B]', border: 'border-[#FFB3B3]', label: 'Cancelled' },
  };
  const { bg, text, border, label } = config[status] || config.pending;
  
  return (
    <motion.span 
      className={`px-4 py-2 rounded-xl text-xs font-bold ${bg} ${text} border-2 ${border}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.6 }}
      whileHover={{ scale: 1.1 }}
    >
      {label}
    </motion.span>
  );
};

// Shimmer Loading Component
const ShimmerLoading = ({ delay = 0 }) => (
  <motion.div
    className="flex items-center gap-3 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    <div className="relative w-12 h-12 rounded-full bg-[#E8E3DD] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{ x: [-200, 200] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="flex-1 space-y-2">
      <div className="relative h-4 bg-[#E8E3DD] rounded w-3/4 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ x: [-200, 200] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="relative h-3 bg-[#E8E3DD] rounded w-1/2 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ x: [-200, 200] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
        />
      </div>
    </div>
  </motion.div>
);

// Mini Sales Chart
const MiniSalesChart = ({ data, loading }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  if (loading) {
    return (
      <div className="h-80 mt-6 relative rounded-2xl overflow-hidden bg-white/40">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ x: [-500, 500] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  
  const maxSales = Math.max(...(data?.map(d => d.sales) || [0]));
  const maxOrders = Math.max(...(data?.map(d => d.orderCount) || [0]));
  
  return (
    <div ref={ref} className="mt-6 space-y-6">
      <div>
        <p className="text-xs text-[#6B6B6B] mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Revenue
        </p>
        <div className="h-64 flex items-end justify-between gap-2">
          {data?.map((item, i) => {
            const height = (item.sales / maxSales) * 100 || 0;
            return (
              <motion.div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, type: "spring" }}
              >
                <motion.div 
                  className="w-full relative"
                  style={{ height: `${height}%`, minHeight: '12px' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-[#E91E63] rounded-t-xl shadow-lg" />
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 rounded-t-xl"
                    whileHover={{ opacity: 0.3 }}
                  />
                  
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-[#4A4458] text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-xl"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    ₹{new Intl.NumberFormat('en-IN').format(item.sales)}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4A4458] rotate-45" />
                  </motion.div>
                </motion.div>
                <motion.span 
                  className="text-xs text-[#6B6B6B] font-semibold"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.08 + 0.3 }}
                >
                  {item.month}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs text-[#6B6B6B] mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Order Count
        </p>
        <div className="h-24 flex items-end justify-between gap-2 relative">
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            <motion.path
              d={data?.map((item, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - (item.orderCount / maxOrders) * 100;
                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
              }).join(' ')}
              fill="none"
              stroke="#7C5CDB"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          {data?.map((item, i) => {
            const height = (item.orderCount / maxOrders) * 100 || 0;
            return (
              <motion.div
                key={i}
                className="flex-1 flex flex-col items-center justify-end group"
                style={{ height: '100%' }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#7C5CDB] border-2 border-white shadow-lg cursor-pointer relative"
                  style={{ marginBottom: height + '%' }}
initial={{ scale: 0 }}
animate={isInView ? { scale: 1 } : {}}
transition={{ delay: i * 0.08 + 0.5, type: "spring" }}
whileHover={{ scale: 1.8 }}
>
<motion.div
className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#7C5CDB] text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
initial={{ y: 5 }}
whileHover={{ y: 0 }}
>
{item.orderCount} orders
</motion.div>
</motion.div>
</motion.div>
);
})}
</div>
</div>
</div>
);
};
export default Dashboard;
