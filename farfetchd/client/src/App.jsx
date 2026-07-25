import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Contact from './pages/Contact';
import { Activity, LayoutDashboard, History as HistoryIcon, Mail, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <Router>
      {/* Increased contrast background to make elements pop */}
      <div className="min-h-screen bg-[#020617] selection:bg-cyan-500/30">
        <Navigation />
        
        {/* Main Content Area - Added padding top to account for floating nav */}
        <main className="relative z-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Navigation = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-8 px-6 py-3 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group"
      >
        {/* Animated Background Pulse inside Nav */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group/logo">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/40 blur-md rounded-full group-hover/logo:bg-cyan-400/60 transition-colors" />
            <Activity className="w-6 h-6 text-cyan-400 relative z-10" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tighter text-white uppercase"> Farfetch'd</span>
           
          </div>
        </Link>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-slate-700/50" />

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          <NavLink to="/dashboard" icon={<LayoutDashboard size={14} />}>Dashboard</NavLink>
          <NavLink to="/history" icon={<HistoryIcon size={14} />}>History</NavLink>
          <NavLink to="/contact" icon={<Mail size={14} />}>Contact</NavLink>
        </div>

        {/* System "Heartbeat" Indicator (Visual only) */}
        <div className="hidden md:flex items-center gap-4 ml-4 pl-4 border-l border-slate-700/50">
          <div className="flex flex-col items-end">
             <div className="text-[10px] font-mono text-slate-500">LATENCY</div>
             <div className="text-[10px] font-mono text-emerald-400">1.2ms</div>
          </div>
          <div className="flex gap-[1px] items-end h-4">
             {[0.4, 0.7, 0.3, 0.9].map((h, i) => (
               <motion.div 
                key={i}
                animate={{ height: [`${h*100}%`, "100%", `${h*100}%`] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 bg-cyan-500/50 rounded-full" 
               />
             ))}
          </div>
        </div>
      </motion.nav>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
};

const NavLink = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group/link ${
        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {/* Background Highlight for Active Link */}
      {isActive && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl z-0"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      {/* Icon & Label */}
      <span className={`relative z-10 transition-transform duration-300 group-hover/link:scale-110 ${isActive ? 'text-cyan-400' : ''}`}>
        {icon}
      </span>
      <span className="relative z-10">{children}</span>

      {/* Underline for Active Link */}
      {isActive && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute -bottom-1 left-4 right-4 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        />
      )}
    </Link>
  );
};

export default App;
