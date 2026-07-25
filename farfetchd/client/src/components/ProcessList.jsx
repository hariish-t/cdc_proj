import { useEffect, useState, useMemo } from 'react';
import { List, Activity, Zap, HardDrive, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProcessList = ({ processData }) => {
  if (!processData) {
    return (
      <div className="col-span-12 p-12 bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-4">
        <Activity className="w-12 h-12 text-cyan-500/20 animate-spin" />
        <span className="text-xs font-black text-cyan-500/40 uppercase tracking-[0.5em]">Initializing_Telemetry</span>
      </div>
    );
  }

  const { total, running, sleeping, blocked, topByMemory } = processData;

  return (
    <div className="col-span-12 relative group">
      {/* BACKGROUND DEPTH LAYER */}
      <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
      
      <div className="relative bg-[#020617]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        
        {/* HEADER: MISSION CONTROL STYLE */}
        <div className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <List className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Process Monitor</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Bitstream Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatBadge label="Total" val={total} color="text-slate-400" />
            <StatBadge label="Running" val={running} color="text-emerald-400" glow />
            <StatBadge label="Sleeping" val={sleeping} color="text-cyan-400" />
            <StatBadge label="Blocked" val={blocked} color="text-red-500" />
          </div>
        </div>

        {/* TABLE HEAD: HUD DESIGN */}
        <div className="grid grid-cols-12 gap-4 px-10 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/[0.01]">
          <div className="col-span-1 flex items-center gap-2"><Terminal className="w-3 h-3"/> PID</div>
          <div className="col-span-4">Identifier</div>
          <div className="col-span-2 text-center">Execution_State</div>
          <div className="col-span-2 text-right">Physical_RSS</div>
          <div className="col-span-2 text-right">Virtual_MEM</div>
          <div className="col-span-1 text-right flex justify-end items-center gap-1"><Cpu className="w-3 h-3"/> Load</div>
        </div>

        {/* PROCESS ROWS: KINETIC DESIGN */}
        <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {topByMemory.map((proc, index) => (
              <motion.div
                layout
                key={proc.pid}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group/row relative overflow-hidden"
              >
                {/* Visual Background Memory Gauge */}
                <div 
                  className="absolute inset-y-0 left-0 bg-cyan-500/5 transition-all duration-1000"
                  style={{ width: `${Math.min(parseFloat(proc.cpu) * 5, 100)}%` }}
                />

                <div className="col-span-1 flex items-center">
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover/row:text-cyan-400 transition-colors">
                    {proc.pid}
                  </span>
                </div>

                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                  <span className="text-sm font-mono font-black text-slate-100 truncate tracking-tight">
                    {proc.name}
                  </span>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    proc.active 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-slate-800/40 text-slate-500 border-white/5'
                  }`}>
                    {proc.state}
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-end justify-center">
                   <span className="text-xs font-mono font-bold text-emerald-400/80">{proc.memRss}</span>
                   <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '70%' }} 
                        className="h-full bg-emerald-500/40" 
                      />
                   </div>
                </div>

                <div className="col-span-2 flex flex-col items-end justify-center">
                   <span className="text-xs font-mono font-bold text-cyan-400/80">{proc.memVirt}</span>
                   <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '40%' }} 
                        className="h-full bg-cyan-500/40" 
                      />
                   </div>
                </div>

                <div className="col-span-1 flex items-center justify-end">
                   <div className="relative">
                      <span className={`text-sm font-mono font-black ${parseFloat(proc.cpu) > 50 ? 'text-red-400' : 'text-purple-400'}`}>
                        {proc.cpu}%
                      </span>
                      {parseFloat(proc.cpu) > 10 && (
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="absolute inset-0 bg-purple-500/20 blur-md rounded-full"
                        />
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* FOOTER: SCANLINE EFFECT */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

const StatBadge = ({ label, val, color, glow }) => (
  <div className={`px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center min-w-[80px] ${glow ? 'shadow-[0_0_20px_rgba(16,185,129,0.05)] border-emerald-500/20' : ''}`}>
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1">{label}</span>
    <span className={`text-lg font-mono font-black leading-none ${color}`}>{val}</span>
  </div>
);

export default ProcessList;
