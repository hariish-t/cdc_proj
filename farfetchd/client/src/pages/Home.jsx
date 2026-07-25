import { useNavigate } from 'react-router-dom';
import { Activity, Cpu, Zap, Lock, ChevronRight, Sparkles,  } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * 3D Tilt Container for Hero Dashboard
 */
const TiltContainer = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
};

/**
 * Live CPU Graph Widget
 */
const LiveCpuGraph = () => {
  return (
    <div className="flex items-end gap-1 h-24 w-full px-4 pb-4">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-cyan-500/20 rounded-sm relative overflow-hidden"
          animate={{ 
            height: [
              `${Math.random() * 40 + 10}%`, 
              `${Math.random() * 90 + 10}%`, 
              `${Math.random() * 40 + 10}%`
            ] 
          }}
          transition={{ 
            duration: Math.random() * 2 + 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-cyan-500 to-transparent opacity-60" />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Terminal Logs Widget
 */
const TerminalLogs = () => {
  const [logs, setLogs] = useState([
    "> init_sequence_start",
    "> connecting_socket: 8080...",
  ]);

  useEffect(() => {
    const newLogs = [
      "verifying_handshake...",
      "stream_established (1ms)",
      "buffer_size: optimized",
      "monitoring_active: true",
      "collecting_metrics...",
      "cpu_idle: 98%",
      "mem_alloc: 2048MB",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < newLogs.length) {
        setLogs(prev => [...prev.slice(-5), `> ${newLogs[i]}`]);
        i++;
      } else {
        i = 0;
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] md:text-xs text-emerald-400/80 p-4 leading-relaxed">
      {logs.map((log, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
          {log}
        </motion.div>
      ))}
      <span className="inline-block w-2 h-3 bg-emerald-500 animate-pulse mt-1"/>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#030712] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex items-center justify-center relative">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#030712] to-[#030712]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Hero Text */}
        <div className="text-left">
          
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/30 text-cyan-400 text-xs font-medium mb-6 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Farfetch'd is Live
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            Your Hardware.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Visualized.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl"
          >
            Real-time Linux telemetry with <span className="text-white font-semibold">1ms precision</span>. 
            Monitor CPU, Memory, Network, and Storage with zero configuration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="flex flex-col sm:flex-row gap-6 mt-10"
>
  {/* PRIMARY BUTTON: THE "QUANTUM DRIVE" */}
  <button 
    onClick={() => navigate('/dashboard')}
    className="group relative px-10 py-5 bg-white text-black font-black text-lg rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_0_0_rgba(34,211,238,0)] hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.5)]"
  >
    {/* Animated Liquid Background Layer */}
    <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
    
    {/* Button Content */}
    <span className="relative z-10 flex items-center gap-3 justify-center group-hover:text-white transition-colors duration-300">
      <Activity className="w-5 h-5 animate-pulse" /> 
      <span className="tracking-tight">Launch Dashboard</span>
      <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
    </span>

    {/* Top Highlight Flare */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
  
  {/* SECONDARY BUTTON: THE "GHOST LINK" */}
  <button 
    onClick={() => navigate('/contact')}
    className="group relative px-10 py-5 bg-slate-900/40 text-slate-300 font-bold text-lg rounded-2xl border border-slate-700/50 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:text-white overflow-hidden"
  >
    {/* Radial Glow Follower (Static version of a mouse follower) */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),rgba(34,211,238,0.15)_0%,transparent_70%)] transition-opacity" />
    
    <span className="relative z-10 flex items-center gap-3 justify-center">
      <Sparkles className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
      <span className="tracking-wide">Explore Docs</span>
    </span>

    {/* Corner Accents - Makes it look like industrial hardware */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-700 group-hover:border-cyan-500 transition-colors" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-700 group-hover:border-cyan-500 transition-colors" />
  </button>
</motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8 mt-12 text-sm"
          >
            <div>
              <div className="text-2xl font-bold text-cyan-400">1ms</div>
              <div className="text-slate-500">Latency</div>
            </div>
            <div className="w-px h-12 bg-slate-800"></div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">Real-time</div>
              <div className="text-slate-500">WebSocket</div>
            </div>
            <div className="w-px h-12 bg-slate-800"></div>
            <div>
              <div className="text-2xl font-bold text-purple-400">Zero</div>
              <div className="text-slate-500">Config</div>
            </div>
          </motion.div>
        </div>

        {/* Right: 3D Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="w-full"
        >
          <TiltContainer>
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-900/20 overflow-hidden">
              
              {/* Header Chrome */}
              <div className="h-10 border-b border-slate-800 bg-slate-950/50 flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="ml-4 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                  <Lock className="w-3 h-3" /> system-stream-daemon
                </div>
              </div>

              {/* Dashboard Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: Main Graph */}
                <div className="md:col-span-2 bg-slate-950/50 rounded-lg border border-slate-800/50 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" /> Processor Load
                    </h3>
                    <span className="text-xs text-emerald-400 font-mono">LIVE</span>
                  </div>
                  <LiveCpuGraph />
                </div>

                {/* Card 2: Stats */}
                <div className="space-y-4">
                  <div className="bg-slate-950/50 rounded-lg border border-slate-800/50 p-4">
                    <h3 className="text-xs text-slate-400 mb-1">Memory Usage</h3>
                    <div className="text-2xl font-bold text-white mb-2">4.7 GB</div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[63%]" />
                    </div>
                  </div>
                  
                  <div className="bg-black/80 rounded-lg border border-slate-800/50 overflow-hidden h-32 relative">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-500">TERMINAL</div>
                    <TerminalLogs />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Stat Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 md:-right-12 p-4 bg-slate-900/90 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md z-20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Network I/O</div>
                  <div className="text-lg font-bold text-white">334 MB/s</div>
                </div>
              </div>
            </motion.div>
          </TiltContainer>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;
