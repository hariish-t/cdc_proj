import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Database } from 'lucide-react';
import axios from 'axios';
import { formatTimestamp } from '../utils/formatters';

const History = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/history/snapshots');
      setSnapshots(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load history. Make sure MongoDB is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="shimmer h-12 w-48 mx-auto mb-4 rounded"></div>
          <p className="text-slate-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="glass-card p-8 max-w-md text-center">
          <Database className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No History Available</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchSnapshots}
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="glass-card p-8 max-w-md text-center">
          <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Snapshots Yet</h2>
          <p className="text-slate-400">
            Performance snapshots will appear here once you save them from the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Performance History</h1>
          <p className="text-slate-400">View saved system performance snapshots</p>
        </div>

        {/* Snapshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map((snapshot) => (
            <SnapshotCard key={snapshot._id} snapshot={snapshot} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SnapshotCard = ({ snapshot }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-6 cursor-pointer hover:border-cyan-400/20 transition-all">
      <div onClick={() => setExpanded(!expanded)}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span className="text-xs text-slate-400">
            {formatTimestamp(snapshot.startTime)}
          </span>
        </div>

        {/* Session ID */}
        <div className="mb-4">
          <span className="text-sm text-slate-400">Session</span>
          <p className="text-white font-mono text-sm truncate">
            {snapshot.sessionId}
          </p>
        </div>

        {/* Peaks */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Peak CPU</span>
            <span className="text-cyan-400 font-mono">
              {snapshot.peaks?.cpu?.usage?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Peak Memory</span>
            <span className="text-emerald-400 font-mono">
              {snapshot.peaks?.memory?.usedPercent?.toFixed(1) || 0}%
            </span>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="text-center text-xs text-slate-500">
          {expanded ? '▲ Less' : '▼ More'}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <div>
            <span className="text-xs text-slate-400">Duration</span>
            <p className="text-sm text-slate-200">
              {Math.round(snapshot.duration / 60)} minutes
            </p>
          </div>
          
          {snapshot.topProcesses && snapshot.topProcesses.length > 0 && (
            <div>
              <span className="text-xs text-slate-400 mb-2 block">Top Processes</span>
              <div className="space-y-1">
                {snapshot.topProcesses.slice(0, 3).map((proc, idx) => (
                  <div key={idx} className="text-xs text-slate-300 font-mono">
                    {proc.name} - {proc.peakMemory}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
