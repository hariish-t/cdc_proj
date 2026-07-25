import { useEffect, useState } from 'react';
import { Cpu, Maximize2, Minimize2, Zap, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { interpretCPULoad } from '../utils/formatters';

const CPUEngine = ({ cpuData, systemInfo, isExpanded, onToggle }) => {
  const [animatedUsage, setAnimatedUsage] = useState(0);

  useEffect(() => {
    if (cpuData?.usage !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedUsage(cpuData.usage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cpuData?.usage]);

  if (!cpuData) {
    return (
      <motion.div 
        layout
        className="glass-card p-6 col-span-12 md:col-span-6 lg:col-span-4"
      >
        <div className="shimmer h-48 w-full rounded"></div>
      </motion.div>
    );
  }

  const { usage, user, system, loadAverage, cores, interpretation } = cpuData;
  const { status, color } = interpretCPULoad(usage);

  // Data for donut chart
  const chartData = [
    { name: 'User', value: user || 0 },
    { name: 'System', value: system || 0 },
    { name: 'Idle', value: Math.max(0, 100 - (usage || 0)) }
  ];

  const COLORS = {
    User: '#22d3ee',
    System: '#a78bfa',
    Idle: '#1e293b'
  };

  // Generate mock per-core data (in production, get this from backend)
  const perCoreData = Array.from({ length: cores || 4 }, (_, i) => ({
    core: `Core ${i}`,
    usage: Math.round(usage + (Math.random() - 0.5) * 20)
  }));

  return (
    <div 
      className={`glass-card p-6 hover:border-cyan-400/20 transition-all duration-200 ease-out cursor-pointer ${
        isExpanded 
          ? 'col-span-12' 
          : 'col-span-12 md:col-span-6 lg:col-span-4'
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">CPU Engine</h3>
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

      {/* Content */}
      {!isExpanded ? (
        // Compact View
        <>
          <div className="relative w-full mb-4" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-cyan-400 counter-text">
                {Math.round(animatedUsage)}%
              </span>
              <span className="text-xs text-slate-400 mt-1">Total Load</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">User</span>
              <span className="text-cyan-400 font-mono">{user?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">System</span>
              <span className="text-purple-400 font-mono">{system?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Load Average</span>
              <span className="text-emerald-400 font-mono">{loadAverage?.one || '0.00'}</span>
            </div>
            
            {interpretation?.saturated && (
              <div className="mt-3 p-2 bg-yellow-400/10 border border-yellow-400/20 rounded text-xs text-yellow-400">
                ⚠️ {interpretation.message}
              </div>
            )}
          </div>
        </>
      ) : (
        // Expanded View
        <div
          className="grid grid-cols-12 gap-6"
        >
          {/* Left: Main Stats */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative w-full mb-6" style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-bold text-cyan-400 counter-text">
                  {Math.round(animatedUsage)}%
                </span>
                <span className="text-sm text-slate-400 mt-2">Total Load</span>
              </div>
            </div>

            {/* CPU Info */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Processor</div>
                <div className="text-sm text-white font-mono truncate">
                  {systemInfo?.cpu?.model || 'Unknown'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Cores</div>
                  <div className="text-xl text-cyan-400 font-mono">{cores}</div>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Threads</div>
                  <div className="text-xl text-purple-400 font-mono">
                    {systemInfo?.cpu?.threads || cores}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Architecture</div>
                <div className="text-sm text-emerald-400 font-mono">
                  {systemInfo?.cpu?.architecture || 'x86_64'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Per-Core Breakdown */}
          <div className="col-span-12 lg:col-span-8">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Per-Core Usage
            </h4>
            
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={perCoreData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                  <YAxis type="category" dataKey="core" stroke="#64748b" width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(34, 211, 238, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
                  />
                  <Bar dataKey="usage" fill="#22d3ee" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-slate-400">User Time</span>
                </div>
                <div className="text-2xl text-cyan-400 font-mono">{user?.toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-slate-400">System Time</span>
                </div>
                <div className="text-2xl text-purple-400 font-mono">{system?.toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-slate-400">Load Avg</span>
                </div>
                <div className="text-2xl text-emerald-400 font-mono">{loadAverage?.one || '0.00'}</div>
              </div>
            </div>

            {interpretation?.saturated && (
              <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-sm text-yellow-400 flex items-center gap-2">
                ⚠️ <span>{interpretation.message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CPUEngine;
