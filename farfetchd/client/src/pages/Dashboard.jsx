import { useState, useEffect } from 'react';
import { subscribeToMetrics, subscribeToSystemInfo, connectSocket, disconnectSocket } from '../utils/socket';
import SystemHeader from '../components/SystemHeader';
import CPUEngine from '../components/CPUEngine';
import MemoryMatrix from '../components/MemoryMatrix';
import NetworkIO from '../components/NetworkIO';
import StorageHealth from '../components/StorageHealth';
import ProcessList from '../components/ProcessList';

const Dashboard = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [expandedTile, setExpandedTile] = useState(null); // 'cpu', 'memory', 'network', 'storage', null

  useEffect(() => {
    // Connect to WebSocket
    const socket = connectSocket();
    setIsConnected(true);

    // Subscribe to system info (static data)
    const unsubscribeInfo = subscribeToSystemInfo((data) => {
      setSystemInfo(data);
    });

    // Subscribe to metrics (live data)
    const unsubscribeMetrics = subscribeToMetrics((data) => {
      setMetrics(data);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeInfo();
      unsubscribeMetrics();
      disconnectSocket();
    };
  }, []);

  const toggleExpand = (tileName) => {
    setExpandedTile(prev => prev === tileName ? null : tileName);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* System Header */}
      <SystemHeader 
        systemInfo={systemInfo} 
        uptime={metrics?.uptime}
      />

      {/* Connection Status */}
      {!isConnected && (
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2 text-sm text-red-400">
            ⚠️ Disconnected from backend. Attempting to reconnect...
          </div>
        </div>
      )}

      {/* Bento Grid - NO LAYOUT ANIMATIONS */}
      <div className="max-w-screen-2xl mx-auto p-4">
        <div className="bento-grid transition-all duration-300 ease-out">
            
            {/* CPU Engine */}
            <CPUEngine 
              cpuData={metrics?.cpu}
              systemInfo={systemInfo}
              isExpanded={expandedTile === 'cpu'}
              onToggle={() => toggleExpand('cpu')}
            />
            
            {/* Memory Matrix */}
            <MemoryMatrix 
              memoryData={metrics?.memory}
              processData={metrics?.processes}
              isExpanded={expandedTile === 'memory'}
              onToggle={() => toggleExpand('memory')}
            />
            
            {/* Storage Health */}
            <StorageHealth 
              storageData={metrics?.storage}
              isExpanded={expandedTile === 'storage'}
              onToggle={() => toggleExpand('storage')}
            />
            
            {/* Network I/O */}
            <NetworkIO 
              networkData={metrics?.network}
              isExpanded={expandedTile === 'network'}
              onToggle={() => toggleExpand('network')}
            />
            
            {/* Process List (only show when nothing is expanded) */}
            {!expandedTile && (
              <ProcessList processData={metrics?.processes} />
            )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
