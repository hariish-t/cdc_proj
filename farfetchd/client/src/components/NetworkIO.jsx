import { useState, useEffect } from 'react';
import { Network, ArrowDown, ArrowUp, Maximize2, Minimize2, Radio, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, AreaChart, Area, XAxis } from 'recharts';
import { motion } from 'framer-motion';

const NetworkIO = ({ networkData, isExpanded, onToggle }) => {
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [combinedHistory, setCombinedHistory] = useState([]);

  useEffect(() => {
    if (networkData) {
      const timestamp = Date.now();
      const downloadSpeed = networkData.downloadRaw || 0;
      const uploadSpeed = networkData.uploadRaw || 0;

      // Keep last 20 for compact, 60 for expanded
      const maxPoints = isExpanded ? 60 : 20;
      
      setDownloadHistory(prev => 
        [...prev, { time: timestamp, value: downloadSpeed }].slice(-maxPoints)
      );
      setUploadHistory(prev => 
        [...prev, { time: timestamp, value: uploadSpeed }].slice(-maxPoints)
      );
      setCombinedHistory(prev =>
        [...prev, { 
          time: timestamp, 
          download: downloadSpeed / 1024, // Convert to KB
          upload: uploadSpeed / 1024 
        }].slice(-maxPoints)
      );
    }
  }, [networkData, isExpanded]);

  if (!networkData) {
    return (
      <motion.div 
        layout
        className="glass-card p-6 col-span-12 md:col-span-6 lg:col-span-6"
      >
        <div className="shimmer h-48 w-full rounded"></div>
      </motion.div>
    );
  }

  const { download, upload, interface: iface } = networkData;

  // Calculate peak speeds
  const peakDownload = Math.max(...downloadHistory.map(d => d.value), 0);
  const peakUpload = Math.max(...uploadHistory.map(d => d.value), 0);

  const formatSpeed = (bytes) => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B/s`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB/s`;
  };

  return (
    <div 
      className={`glass-card p-6 hover:border-indigo-400/20 transition-all duration-200 ease-out cursor-pointer ${
        isExpanded 
          ? 'col-span-12' 
          : 'col-span-12 md:col-span-6 lg:col-span-6'
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Network I/O</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">{iface || 'N/A'}</span>
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
          {/* Download Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-400">Download</span>
              </div>
              <span className="text-2xl font-bold text-purple-400 counter-text">
                {download || '0 B/s'}
              </span>
            </div>

            <div className="w-full bg-slate-800/30 rounded-lg border border-white/5 overflow-hidden" style={{ height: '64px' }}>
              <ResponsiveContainer width="100%" height={64}>
                <LineChart data={downloadHistory}>
                  <YAxis domain={[0, 'dataMax']} hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400">Upload</span>
              </div>
              <span className="text-2xl font-bold text-cyan-400 counter-text">
                {upload || '0 B/s'}
              </span>
            </div>

            <div className="w-full bg-slate-800/30 rounded-lg border border-white/5 overflow-hidden" style={{ height: '64px' }}>
              <ResponsiveContainer width="100%" height={64}>
                <LineChart data={uploadHistory}>
                  <YAxis domain={[0, 'dataMax']} hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
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
          {/* Left: Current Stats */}
          <div className="col-span-12 lg:col-span-4">
            {/* Interface Info */}
            <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-indigo-400/20">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-slate-400">Active Interface</span>
              </div>
              <div className="text-2xl font-mono text-white">{iface || 'Unknown'}</div>
            </div>

            {/* Current Speeds */}
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-400/10">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400">Download Speed</span>
                </div>
                <div className="text-3xl font-mono text-purple-400 mb-1">
                  {download || '0 B/s'}
                </div>
                <div className="text-xs text-slate-500">
                  Peak: {formatSpeed(peakDownload)}
                </div>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg border border-cyan-400/10">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">Upload Speed</span>
                </div>
                <div className="text-3xl font-mono text-cyan-400 mb-1">
                  {upload || '0 B/s'}
                </div>
                <div className="text-xs text-slate-500">
                  Peak: {formatSpeed(peakUpload)}
                </div>
              </div>
            </div>

            {/* Total Data (Mock) */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-sm text-slate-400">Total Downloaded</span>
                <span className="text-sm font-mono text-purple-400">1.2 GB</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg flex justify-between">
                <span className="text-sm text-slate-400">Total Uploaded</span>
                <span className="text-sm font-mono text-cyan-400">384 MB</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Charts */}
          <div className="col-span-12 lg:col-span-8">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Traffic History (Last 60 seconds)
            </h4>

            {/* Combined Area Chart */}
            <div className="mb-6" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={combinedHistory}>
                  <defs>
                    <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(129, 140, 248, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value) => `${value.toFixed(2)} KB/s`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="download" 
                    stroke="#a78bfa" 
                    fillOpacity={1} 
                    fill="url(#downloadGradient)" 
                    name="Download"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upload" 
                    stroke="#22d3ee" 
                    fillOpacity={1} 
                    fill="url(#uploadGradient)" 
                    name="Upload"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Individual Sparklines */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-2">Download Trend</div>
                <div style={{ height: '100px' }}>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={downloadHistory}>
                      <YAxis domain={[0, 'dataMax']} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-2">Upload Trend</div>
                <div style={{ height: '100px' }}>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={uploadHistory}>
                      <YAxis domain={[0, 'dataMax']} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NetworkIO;
