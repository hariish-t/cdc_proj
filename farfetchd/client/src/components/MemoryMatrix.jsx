import { useEffect, useState } from 'react';
import { MemoryStick, AlertCircle, Maximize2, Minimize2, Database, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { interpretMemory } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const MemoryMatrix = ({ memoryData, processData, isExpanded, onToggle }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (memoryData?.usedPercent !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedPercent(memoryData.usedPercent);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [memoryData?.usedPercent]);

  if (!memoryData) {
    return (
      <motion.div 
        layout
        className="glass-card p-6 col-span-12 md:col-span-6 lg:col-span-8"
      >
        <div className="shimmer h-96 w-full rounded"></div>
      </motion.div>
    );
  }

  const { total, used, available, cached, usedPercent, interpretation } = memoryData;
  const { status, color } = interpretMemory(usedPercent);

  const topProcesses = processData?.topByMemory?.slice(0, isExpanded ? 20 : 5) || [];

  // Memory breakdown chart data
  const memoryBreakdown = [
    { name: 'Used', value: parseFloat(used.split(' ')[0]), color: '#34d399' },
    { name: 'Cached', value: parseFloat(cached.split(' ')[0]), color: '#22d3ee' },
    { name: 'Available', value: parseFloat(available.split(' ')[0]), color: '#64748b' }
  ];

  return (
    <div 
      className={`glass-card p-6 hover:border-emerald-400/20 transition-all duration-200 ease-out cursor-pointer ${
        isExpanded 
          ? 'col-span-12' 
          : 'col-span-12 md:col-span-6 lg:col-span-8'
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MemoryStick className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Memory Matrix</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full bg-${color}-400/10 text-${color}-400 border border-${color}-400/20`}>
            {status}
          </span>
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
          ) : (
            <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
          )}
        </div>
      </div>

      {!isExpanded ? (
        // Compact View
        <>
          {/* Memory Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-emerald-400 counter-text">
                {Math.round(animatedPercent)}%
              </span>
              <span className="text-sm text-slate-400">
                {used} / {total}
              </span>
            </div>

            <div className="relative h-8 bg-slate-800/50 rounded-lg overflow-hidden border border-white/5">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${usedPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono text-white drop-shadow-lg">
                  {available} Available
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-sm">
                <span className="text-slate-400">Used: </span>
                <span className="text-emerald-400 font-mono">{used}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Cached: </span>
                <span className="text-cyan-400 font-mono">{cached}</span>
              </div>
            </div>

            {interpretation?.cacheHeavy && (
              <div className="mt-3 p-2 bg-cyan-400/10 border border-cyan-400/20 rounded text-xs text-cyan-400 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                {interpretation.message}
              </div>
            )}
          </div>

          {/* Top Processes */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Top Memory Consumers</h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {topProcesses.map((proc, index) => (
                  <motion.div
                    key={proc.pid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5 hover:border-emerald-400/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs font-mono text-slate-500 w-6">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-200 truncate font-mono">
                          {proc.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          PID: {proc.pid} • {proc.state}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-emerald-400">
                        {proc.memRss}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {proc.cpu}% CPU
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        // Expanded View
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-12 gap-6"
        >
          {/* Left: Memory Overview */}
          <div className="col-span-12 lg:col-span-4">
            {/* Main Stats */}
            <div className="mb-6 p-6 bg-slate-800/30 rounded-lg border border-emerald-400/20">
              <div className="text-center mb-4">
                <div className="text-6xl font-bold text-emerald-400 counter-text mb-2">
                  {Math.round(animatedPercent)}%
                </div>
                <div className="text-sm text-slate-400">Memory Usage</div>
              </div>
              
              <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${usedPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="text-center text-sm text-slate-300">
                {used} of {total} used
              </div>
            </div>

            {/* Memory Breakdown Chart */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Memory Breakdown
              </h4>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={memoryBreakdown}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      labelStyle={{ color: '#34d399', fontWeight: 'bold' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-sm text-slate-400">Total</span>
                <span className="text-sm font-mono text-white">{total}</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-sm text-slate-400">Used</span>
                <span className="text-sm font-mono text-emerald-400">{used}</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-sm text-slate-400">Cached</span>
                <span className="text-sm font-mono text-cyan-400">{cached}</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-sm text-slate-400">Available</span>
                <span className="text-sm font-mono text-purple-400">{available}</span>
              </div>
            </div>

            {interpretation?.cacheHeavy && (
              <div className="mt-4 p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-lg text-sm text-cyan-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{interpretation.message}</span>
              </div>
            )}
          </div>

          {/* Right: Full Process List */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                All Processes (Top {topProcesses.length})
              </h4>
              <div className="text-xs text-slate-400">
                Total: {processData?.total || 0} • Running: {processData?.running || 0}
              </div>
            </div>

            {/* Process Table Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-800/50 rounded-lg mb-2 text-xs text-slate-400 font-semibold">
              <div className="col-span-1">#</div>
              <div className="col-span-1">PID</div>
              <div className="col-span-4">Process</div>
              <div className="col-span-2">State</div>
              <div className="col-span-2 text-right">Memory</div>
              <div className="col-span-2 text-right">CPU</div>
            </div>

            {/* Scrollable Process List */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {topProcesses.map((proc, index) => (
                  <motion.div
                    key={proc.pid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="grid grid-cols-12 gap-2 px-3 py-3 bg-slate-800/20 rounded-lg hover:bg-slate-800/40 transition-colors border border-white/5"
                  >
                    <div className="col-span-1 text-xs text-slate-500 font-mono">
                      {index + 1}
                    </div>
                    <div className="col-span-1 text-xs text-slate-400 font-mono">
                      {proc.pid}
                    </div>
                    <div className="col-span-4 text-sm text-slate-200 font-mono truncate">
                      {proc.name}
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        proc.active 
                          ? 'bg-emerald-400/10 text-emerald-400' 
                          : 'bg-slate-700/30 text-slate-400'
                      }`}>
                        {proc.state}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-emerald-400 font-mono text-right">
                      {proc.memRss}
                    </div>
                    <div className="col-span-2 text-sm text-purple-400 font-mono text-right">
                      {proc.cpu}%
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryMatrix;
