import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ADDED THIS IMPORT
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import useAuth from '../hooks/useAuth'; // Ensure this path is correct

// Sophisticated animated dashboard illustration - Purple Edition
const AnimatedDashboard = () => {
  return (
    <div className="relative w-full max-w-[320px] h-[280px]">
      {/* Main Dashboard Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6"
      >
        {/* Header Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-slate-50 rounded-lg p-3 border border-slate-200"
          >
            <DollarSign className="w-4 h-4 text-emerald-600 mb-1" />
            <div className="h-1.5 w-12 bg-slate-200 rounded" />
            <div className="h-1 w-8 bg-slate-200 rounded mt-1" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="bg-slate-50 rounded-lg p-3 border border-slate-200"
          >
            <Users className="w-4 h-4 text-[#7C6FAA] mb-1" />
            <div className="h-1.5 w-10 bg-slate-200 rounded" />
            <div className="h-1 w-6 bg-slate-200 rounded mt-1" />
          </motion.div>
        </div>

        {/* Animated Chart Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-50 rounded-lg p-4 border border-slate-200 h-32 relative overflow-hidden"
        >
          {/* Chart Bars - Purple Tones */}
          <div className="flex items-end justify-between h-full gap-2">
            {[40, 65, 45, 80, 55, 70].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                className="flex-1 bg-[#9B8DC7] rounded-t relative"
              >
                <motion.div
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute inset-0 bg-white"
                />
              </motion.div>
            ))}
          </div>
          
          {/* Animated trend line */}
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="absolute top-4 left-4 right-4"
          >
            <svg className="w-full h-20" viewBox="0 0 200 60">
              <motion.path
                d="M 0 40 Q 30 35, 50 30 T 100 20 T 150 15 T 200 10"
                stroke="#10B981"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Bottom Info Row */}
        <div className="flex gap-2 mt-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="flex-1 bg-emerald-50 rounded-lg p-2 border border-emerald-200"
          >
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <div className="h-1 w-8 bg-emerald-300 rounded" />
            </div>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
            className="flex-1 bg-purple-50 rounded-lg p-2 border-purple-100"
          >
            <div className="flex items-center gap-1.5">
              <Package className="w-3 h-3 text-[#7C6FAA]" />
              <div className="h-1 w-6 bg-[#9B8DC7]/30 rounded" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl border-2 border-emerald-200 shadow-lg flex items-center justify-center"
      >
        <TrendingUp className="w-6 h-6 text-emerald-600" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-3 -left-3 w-14 h-14 bg-white rounded-lg border-2 border-purple-100 shadow-lg flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 border-2 border-[#7C6FAA] border-t-transparent rounded-full" />
        </motion.div>
      </motion.div>

      {/* Pulsing data dots - Purple */}
      {[
        { x: '20%', y: '15%', delay: 0 },
        { x: '75%', y: '25%', delay: 0.5 },
        { x: '50%', y: '70%', delay: 1 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          style={{ left: dot.x, top: dot.y }}
          className="absolute w-2 h-2 rounded-full bg-[#9B8DC7]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: dot.delay }}
        />
      ))}
    </div>
  );
};

const Login = () => {
  // --- ADDED THESE INITIALIZATIONS ---
  const navigate = useNavigate();
  const { login } = useAuth();
  // -----------------------------------

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const success = await login(formData.email, formData.password);
  
  if (success) {
    console.log("Login signal received! Redirecting...");
    // Force a small delay or use replace: true to ensure state is caught
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
  } else {
    setIsSubmitting(false);
    setError('Login failed. Please check credentials.');
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border-2 border-slate-200"
      >
        {/* Illustration Side */}
        <div className="hidden md:flex md:w-[48%] bg-slate-50 items-center justify-center p-12 border-r-2 border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-100 rounded-full blur-3xl opacity-30" />
          
          <div className="relative z-10 text-center">
            <AnimatedDashboard />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">ShopSphere Analytics</h3>
              <p className="text-slate-500 text-sm max-w-[260px] mx-auto leading-relaxed">
                Real-time insights and professional analytics for modern commerce.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-[52%] p-10 md:p-14 flex flex-col justify-center bg-white">
          <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500 font-medium">Access your administrative dashboard.</p>
          </motion.div>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7C6FAA] transition-colors" />
                <input
                  type="email"
                  className="w-full px-5 py-3.5 pl-11 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 font-medium focus:border-[#7C6FAA] focus:ring-4 focus:ring-purple-50 outline-none transition-all hover:border-slate-300"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-semibold text-[#7C6FAA] hover:text-[#6b5f96]">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7C6FAA] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-5 py-3.5 pl-11 pr-11 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 font-medium focus:border-[#7C6FAA] focus:ring-4 focus:ring-purple-50 outline-none transition-all hover:border-slate-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#7C6FAA]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div className="pt-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#7C6FAA] text-white font-bold py-4 rounded-xl hover:bg-[#6b5f96] hover:shadow-xl hover:shadow-purple-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isSubmitting ? <span>Processing...</span> : <><span>Continue to Dashboard</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </motion.div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-2 border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo</span>
              <div className="flex-grow border-t-2 border-slate-200"></div>
            </div>

            <motion.button
              type="button"
              onClick={() => setFormData({ email: 'admin@shopsphere.com', password: 'Admin@123456' })}
              className="w-full py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 text-xs font-bold hover:border-[#7C6FAA] hover:bg-slate-50 hover:text-[#7C6FAA] transition-all flex items-center justify-center gap-2 uppercase tracking-wide group"
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            >
              <ShieldCheck className="w-4 h-4 text-[#7C6FAA]" />
              Quick Fill Demo
            </motion.button>
          </div>

          <footer className="mt-10 pt-6 border-t-2 border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Happy</span>
            <span>© 2026 ShopSphere</span>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
