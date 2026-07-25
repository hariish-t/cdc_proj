/**
 * Utility functions for formatting data
 */

/**
 * Format bytes to human-readable size
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format uptime seconds to readable format
 */
export const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Get color based on percentage (for health indicators)
 */
export const getHealthColor = (percent) => {
  if (percent < 50) return 'text-emerald-400';
  if (percent < 75) return 'text-yellow-400';
  if (percent < 90) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Get CPU load interpretation
 */
export const interpretCPULoad = (usage) => {
  if (usage < 30) return { status: 'Low', color: 'emerald' };
  if (usage < 60) return { status: 'Moderate', color: 'cyan' };
  if (usage < 80) return { status: 'High', color: 'yellow' };
  return { status: 'Critical', color: 'red' };
};

/**
 * Get memory usage interpretation
 */
export const interpretMemory = (percent) => {
  if (percent < 50) return { status: 'Healthy', color: 'emerald' };
  if (percent < 75) return { status: 'Moderate', color: 'cyan' };
  if (percent < 90) return { status: 'High', color: 'yellow' };
  return { status: 'Critical', color: 'red' };
};

/**
 * Format network speed
 */
export const formatNetworkSpeed = (bytesPerSecond) => {
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond.toFixed(0)} B/s`;
  }
  if (bytesPerSecond < 1024 * 1024) {
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  }
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
};

/**
 * Animate number changes smoothly
 */
export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuad = progress * (2 - progress);
    const current = start + (end - start) * easeOutQuad;
    
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

export default {
  formatBytes,
  formatUptime,
  formatTimestamp,
  truncate,
  getHealthColor,
  interpretCPULoad,
  interpretMemory,
  formatNetworkSpeed,
  animateValue
};
