import { useEffect, useState } from 'react';
import { Activity, Shield, Cpu, Zap, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemHeader = ({ systemInfo, uptime }) => {
  const [displayUptime, setDisplayUptime] = useState('--:--:--');

  useEffect(() => {
    if (uptime?.formatted) setDisplayUptime(uptime.formatted);
  }, [uptime]);

  if (!systemInfo) {
    return (
      <div className="w-full h-20 bg-slate-950 flex items-center px-8 border-b border-white/5">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }

  const { cpu, os } = systemInfo;

  return (
    <header className="sticky top-0 z-[100] w-full px-6 py-4">
      {/* Main Container: Satin Glass Effect */}
      <div className="max-w-screen-2xl mx-auto relative group">
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xl rounded-3xl border border-white/10 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]" />
        
        <div className="relative z-10 flex items-center justify-between px-8 py-4">
          
          {/* Section 1: Identity & OS */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Activity className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <div className="absolute inset-0 bg-cyan-400/20 blur-lg animate-pulse" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                Farfetch'd
              </span>
            </div>

            <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Shield className="w-3 h-3" /> System Secure
              </div>
              <span className="text-sm font-mono font-medium text-slate-200">
                {os?.distro || 'Unknown'} <span className="text-cyan-600 opacity-50 px-1">/</span> {os?.kernel || 'N/A'}
              </span>
            </div>
          </div>

          {/* Section 2: Processor Core (Readability Focus) */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-3 h-3 text-cyan-500/70" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Neural Processor Unit</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-6 py-1.5 rounded-full border border-white/5 shadow-inner">
               <span className="text-xs font-mono font-bold text-slate-200">
                 {cpu?.model?.split(' ')[0]} <span className="text-cyan-400">{cpu?.model?.split(' ')[1]}</span>
               </span>
               <div className="h-3 w-px bg-white/10" />
               <div className="flex gap-3 text-[10px] font-mono">
                  <span className="text-slate-400"><b className="text-white">{cpu?.cores}</b> CORES</span>
                  <span className="text-slate-400"><b className="text-purple-400">{cpu?.threads}</b> THREADS</span>
               </div>
            </div>
          </div>

          {/* Section 3: High-Visibility Uptime */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" /> Active Session
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-emerald-400 tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                  {displayUptime}
                </span>
                <span className="text-[10px] font-black text-emerald-600/60 uppercase">Live</span>
              </div>
            </div>

            {/* Status Pulse */}
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
              <div className="relative w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
            </div>
          </div>
        </div>

        {/* Subtle Decorative Accents */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-4 left-8 right-8 h-[1px] bg-white/[0.03]" />
      </div>
    </header>
  );
};

export default SystemHeader;
