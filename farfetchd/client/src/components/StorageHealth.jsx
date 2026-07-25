import { useEffect, useState } from 'react';
import { HardDrive, Maximize2, Minimize2, Disc, FolderTree } from 'lucide-react';
import { motion } from 'framer-motion';
import { getHealthColor } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const StorageHealth = ({ storageData, isExpanded, onToggle }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (storageData?.usedPercent !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedPercent(storageData.usedPercent);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [storageData?.usedPercent]);

  if (!storageData) {
    return (
      <motion.div 
        layout
        className="glass-card p-6 col-span-12 md:col-span-6 lg:col-span-6"
      >
        <div className="shimmer h-48 w-full rounded"></div>
      </motion.div>
    );
  }

  const { mount, total, used, free, usedPercent, filesystem } = storageData;
  const healthColor = getHealthColor(usedPercent);

  // Mock additional partitions (in production, get from backend)
  const allPartitions = [
    { name: '/', used: usedPercent, total: total, free: free, filesystem },
    { name: '/home', used: 45, total: '500 GB', free: '275 GB', filesystem: 'ext4' },
    { name: '/boot', used: 12, total: '512 MB', free: '450 MB', filesystem: 'ext4' },
  ];

  return (
    <div 
      className={`glass-card p-6 hover:border-yellow-400/20 transition-all duration-200 ease-out cursor-pointer ${
        isExpanded 
          ? 'col-span-12' 
          : 'col-span-12 md:col-span-6 lg:col-span-6'
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Storage Health</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">{mount || '/'}</span>
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
          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="85"
                  stroke="currentColor"
                  strokeWidth="14"
                  fill="transparent"
                  className="text-slate-800/50"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="85"
                  stroke="currentColor"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={534}
                  initial={{ strokeDashoffset: 534 }}
                  animate={{ strokeDashoffset: 534 - (534 * animatedPercent) / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={healthColor}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${healthColor} counter-text`}>
                  {Math.round(animatedPercent)}%
                </span>
                <span className="text-xs text-slate-400 mt-1">Used</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-sm text-slate-400">Total</span>
              <span className="text-sm font-mono text-slate-200">{total}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-sm text-slate-400">Used</span>
              <span className="text-sm font-mono text-yellow-400">{used}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-sm text-slate-400">Free</span>
              <span className="text-sm font-mono text-emerald-400">{free}</span>
            </div>
            
            {filesystem && (
              <div className="text-xs text-slate-500 text-center mt-2 font-mono">
                Filesystem: {filesystem}
              </div>
            )}
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
          {/* Left: Main Partition */}
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-6 p-6 bg-slate-800/30 rounded-lg border border-yellow-400/20">
              <div className="flex items-center gap-2 mb-4">
                <Disc className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-slate-400">Root Partition</span>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-yellow-400 counter-text mb-2">
                  {Math.round(animatedPercent)}%
                </div>
                <div className="text-sm text-slate-400">Disk Usage</div>
              </div>

              <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden mb-4">
                <motion.div
                  className={`absolute left-0 top-0 h-full ${
                    usedPercent > 90 ? 'bg-red-500' : 
                    usedPercent > 75 ? 'bg-yellow-500' : 
                    'bg-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${usedPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="text-center text-sm text-slate-300 mb-6">
                {used} of {total} used
              </div>

              <div className="space-y-2">
                <div className="p-2 bg-slate-800/50 rounded flex justify-between text-sm">
                  <span className="text-slate-400">Mount Point</span>
                  <span className="text-white font-mono">{mount}</span>
                </div>
                <div className="p-2 bg-slate-800/50 rounded flex justify-between text-sm">
                  <span className="text-slate-400">Filesystem</span>
                  <span className="text-cyan-400 font-mono">{filesystem}</span>
                </div>
                <div className="p-2 bg-slate-800/50 rounded flex justify-between text-sm">
                  <span className="text-slate-400">Available</span>
                  <span className="text-emerald-400 font-mono">{free}</span>
                </div>
              </div>
            </div>

            {/* I/O Stats (Mock) */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-xs text-slate-400">Read Speed</span>
                <span className="text-sm font-mono text-purple-400">42 MB/s</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-xs text-slate-400">Write Speed</span>
                <span className="text-sm font-mono text-cyan-400">38 MB/s</span>
              </div>
            </div>
          </div>

          {/* Right: All Partitions */}
          <div className="col-span-12 lg:col-span-8">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-yellow-400" />
              All Partitions
            </h4>

            {/* Partition Usage Chart */}
            <div className="mb-6" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={allPartitions} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                  <YAxis type="category" dataKey="name" stroke="#64748b" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#eab308', fontWeight: 'bold' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value) => `${value}% used`}
                    cursor={{ fill: 'rgba(234, 179, 8, 0.1)' }}
                  />
                  <Bar dataKey="used" radius={[0, 4, 4, 0]}>
                    {allPartitions.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.used > 90 ? '#ef4444' : 
                          entry.used > 75 ? '#eab308' : 
                          '#34d399'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Partition Details */}
            <div className="space-y-3">
              {allPartitions.map((partition, index) => (
                <motion.div
                  key={partition.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/30 rounded-lg border border-white/5 hover:border-yellow-400/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-yellow-400" />
                      <span className="font-mono text-white">{partition.name}</span>
                    </div>
                    <span className={`text-sm font-mono ${
                      partition.used > 90 ? 'text-red-400' :
                      partition.used > 75 ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {partition.used}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">Total: </span>
                      <span className="text-slate-200 font-mono">{partition.total}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Free: </span>
                      <span className="text-emerald-400 font-mono">{partition.free}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">FS: </span>
                      <span className="text-cyan-400 font-mono">{partition.filesystem}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StorageHealth;
