import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, DollarSign, ShoppingCart, BarChart3, Zap, Shield, Clock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Animated counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        revenue: prev.revenue < 847293 ? prev.revenue + 3847 : 847293,
        orders: prev.orders < 12584 ? prev.orders + 89 : 12584,
        customers: prev.customers < 8432 ? prev.customers + 34 : 8432
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] overflow-hidden flex items-center">
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #7C6FAA 1px, transparent 1px),
            linear-gradient(to bottom, #7C6FAA 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-[#C4B5E0] rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-[#A7C796] rounded-full blur-[140px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F2FF] border-2 border-[#D4C5E8] mb-6"
            >
              <Zap className="w-4 h-4 text-[#7C6FAA]" />
              <span className="text-sm font-bold text-[#7C6FAA] uppercase tracking-wide">
                Real-Time Analytics
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold text-[#2B2621] mb-6 leading-tight"
            >
              Transform Data Into
              <span className="block text-[#7C6FAA] mt-2">Actionable Insights</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-[#706864] mb-8 leading-relaxed max-w-xl"
            >
              Monitor your e-commerce performance in real-time. Make data-driven decisions with professional analytics built for modern businesses.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <button 
                onClick={() => navigate('/login')}
                className="group px-8 py-4 bg-[#7C6FAA] text-white font-bold rounded-xl hover:bg-[#8B7AA3] hover:shadow-xl hover:shadow-[#7C6FAA]/30 transition-all flex items-center gap-2"
              >
                <span>Log In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white border-2 border-[#E8E3DD] text-[#706864] font-bold rounded-xl hover:border-[#7C6FAA] hover:text-[#7C6FAA] hover:shadow-lg transition-all"
              >
                View Demo
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              <div>
                <div className="text-3xl font-bold text-[#2B2621] mb-1">
                  ${(stats.revenue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm font-semibold text-[#B4ABA5] uppercase tracking-wide">
                  Revenue
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2B2621] mb-1">
                  {stats.orders.toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-[#B4ABA5] uppercase tracking-wide">
                  Orders
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2B2621] mb-1">
                  {stats.customers.toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-[#B4ABA5] uppercase tracking-wide">
                  Customers
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Floating Dashboard */}
          <motion.div
            style={{ y: y1 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative w-full max-w-[480px] bg-white rounded-2xl border-2 border-[#E8E3DD] shadow-2xl p-6"
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7C6FAA] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2B2621]">Analytics Dashboard</div>
                    <div className="text-xs text-[#B4ABA5]">Live Data</div>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-[#A7C796] rounded-full"
                />
              </div>

              {/* Chart Area */}
              <div className="bg-[#FAF8F5] rounded-xl p-4 mb-4 h-48 relative overflow-hidden border-2 border-[#E8E3DD]">
                <div className="flex items-end justify-between h-full gap-2">
                  {[45, 70, 55, 85, 65, 90, 75, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.5 + i * 0.1,
                        ease: "easeOut"
                      }}
                      className="flex-1 bg-[#9B8DC7] rounded-t relative"
                    >
                      <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                        className="absolute inset-0 bg-white"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Trend Line Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path
                    d="M 20 140 Q 80 120, 120 110 T 220 85 T 320 70 T 420 55"
                    stroke="#A7C796"
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
                  />
                </svg>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-4 bg-[#FAF8F5] rounded-lg border-2 border-[#A7C796]/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#A7C796]" />
                    <span className="text-xs font-bold text-[#A7C796] uppercase">Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-[#2B2621]">+24.5%</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-4 bg-[#F5F2FF] rounded-lg border-2 border-[#D4C5E8]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-[#7C6FAA]" />
                    <span className="text-xs font-bold text-[#7C6FAA] uppercase">Active</span>
                  </div>
                  <div className="text-2xl font-bold text-[#2B2621]">1,847</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Card - Revenue */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{ y: y2 }}
              className="absolute top-12 -left-8 bg-white rounded-xl border-2 border-[#E8E3DD] shadow-xl p-4 w-48"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FAF8F5] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#A7C796]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#B4ABA5] uppercase">Revenue</div>
                  <div className="text-xl font-bold text-[#2B2621]">$94.2K</div>
                </div>
              </div>
              <motion.div
                animate={{ width: ['0%', '85%'] }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="h-2 bg-[#A7C796] rounded-full"
              />
            </motion.div>

            {/* Floating Card - Orders */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ y: y2 }}
              className="absolute top-24 -right-8 bg-white rounded-xl border-2 border-[#E8E3DD] shadow-xl p-4 w-44"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-[#F5F2FF] rounded-lg flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 text-[#7C6FAA]" />
                </motion.div>
                <div>
                  <div className="text-xs font-bold text-[#B4ABA5] uppercase">Orders</div>
                  <div className="text-xl font-bold text-[#2B2621]">2,847</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge - Processing */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [-2, 2, -2]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 -left-4 bg-white rounded-lg border-2 border-[#E8E3DD] shadow-xl px-4 py-3 flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-5 h-5 text-[#7C6FAA]" />
              </motion.div>
              <div>
                <div className="text-xs font-bold text-[#B4ABA5]">Processing</div>
                <div className="text-sm font-bold text-[#2B2621]">47 orders</div>
              </div>
            </motion.div>

            {/* Floating Badge - Security */}
            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [2, -2, 2]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-12 -right-6 bg-[#FAF8F5] rounded-lg border-2 border-[#A7C796] shadow-lg px-3 py-2 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#A7C796]" />
              <span className="text-xs font-bold text-[#A7C796] uppercase">Secured</span>
            </motion.div>

            {/* Pulsing Dots */}
            {[
              { x: '15%', y: '20%', delay: 0 },
              { x: '85%', y: '35%', delay: 0.5 },
              { x: '50%', y: '75%', delay: 1 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                style={{ left: dot.x, top: dot.y }}
                className="absolute w-3 h-3 bg-[#9B8DC7] rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: dot.delay
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
     
    </div>
  );
};

export default HeroSection;
