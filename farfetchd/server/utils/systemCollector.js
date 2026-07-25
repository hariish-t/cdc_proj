const si = require('systeminformation');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

/**
 * SystemCollector - Reads real Linux metrics
 * This is where we interpret the OS, not just display numbers
 */
class SystemCollector {
  
  /**
   * Get CPU metrics with interpretation
   */
async getCPU() {
  try {
    const [load, cpuInfo] = await Promise.all([
      si.currentLoad(),
      si.cpu()
    ]);

    const cores = cpuInfo.cores;
    const loadAvg = load.avgLoad; // 1-minute load average

    // INTERPRETATION: Load avg > cores = saturation
    const isSaturated = loadAvg > cores;

    return {
      usage: Math.round(load.currentLoad),
      user: Math.round(load.currentLoadUser),
      system: Math.round(load.currentLoadSystem),
      loadAverage: {
        one: loadAvg.toFixed(2),
        five: null,     // Not provided by systeminformation
        fifteen: null
      },
      cores: cores,
      threads: cpuInfo.processors || cores,
      model: cpuInfo.brand,
      speed: cpuInfo.speed,
      // SYSTEM INSIGHT
      interpretation: {
        saturated: isSaturated,
        message: isSaturated
          ? `CPU saturated: load (${loadAvg.toFixed(2)}) > cores (${cores})`
          : 'CPU operating normally'
      }
    };
  } catch (error) {
    console.error('CPU collection error:', error);
    return null;
  }
}


  /**
   * Get Memory metrics with RSS vs VIRT distinction
   */
  async getMemory() {
    try {
      const mem = await si.mem();
      
      const total = mem.total;
      const used = mem.used;
      const free = mem.free;
      const available = mem.available;
      const cached = mem.cached;
      const buffers = mem.buffers;

      // INTERPRETATION: High cache is GOOD, not bad
      const cachePercent = ((cached + buffers) / total) * 100;
      const isHealthy = available > (total * 0.2); // 20% available = healthy

      return {
        total: this._formatBytes(total),
        used: this._formatBytes(used),
        free: this._formatBytes(free),
        available: this._formatBytes(available),
        cached: this._formatBytes(cached + buffers),
        usedPercent: Math.round((used / total) * 100),
        availablePercent: Math.round((available / total) * 100),
        // SYSTEMS INSIGHT
        interpretation: {
          cacheHeavy: cachePercent > 30,
          healthy: isHealthy,
          message: cachePercent > 30
            ? `${Math.round(cachePercent)}% is cache (reclaimable)`
            : 'Memory pressure normal'
        }
      };
    } catch (error) {
      console.error('Memory collection error:', error);
      return null;
    }
  }

  /**
   * Get top processes sorted by memory (like ps aux --sort=-rss)
   */
  async getProcesses() {
    try {
      const processes = await si.processes();
      
      // Sort by memory, take top 10
      const topProcs = processes.list
        .sort((a, b) => b.memRss - a.memRss)
        .slice(0, 10)
        .map(p => ({
          pid: p.pid,
          name: p.name,
          command: p.command.substring(0, 50), // Truncate long commands
          cpu: p.cpu.toFixed(1),
          memRss: this._formatBytes(p.memRss * 1024), // Convert KB to bytes
          memVirt: this._formatBytes(p.memVsz * 1024),
          state: p.state,
          // INTERPRETATION: Is this process doing work or sleeping?
          active: p.state === 'running' || p.state === 'disk sleep'
        }));

      return {
        total: processes.all,
        running: processes.running,
        sleeping: processes.sleeping,
        blocked: processes.blocked,
        topByMemory: topProcs
      };
    } catch (error) {
      console.error('Process collection error:', error);
      return null;
    }
  }

  /**
   * Get network I/O (upload/download speeds)
   */
  async getNetwork() {
    try {
      const netStats = await si.networkStats();
      
      if (!netStats || netStats.length === 0) {
        return null;
      }

      // Primary interface (usually first one with traffic)
      const primary = netStats[0];

      return {
        interface: primary.iface,
        upload: this._formatBytes(primary.tx_sec) + '/s',
        download: this._formatBytes(primary.rx_sec) + '/s',
        uploadRaw: primary.tx_sec,
        downloadRaw: primary.rx_sec
      };
    } catch (error) {
      console.error('Network collection error:', error);
      return null;
    }
  }

  /**
   * Get storage/disk usage
   */
  async getStorage() {
    try {
      const fsSize = await si.fsSize();
      
      // Focus on root partition
      const root = fsSize.find(fs => fs.mount === '/') || fsSize[0];

      if (!root) return null;

      const usedPercent = ((root.used / root.size) * 100).toFixed(1);

      return {
        mount: root.mount,
        total: this._formatBytes(root.size),
        used: this._formatBytes(root.used),
        free: this._formatBytes(root.available),
        usedPercent: parseFloat(usedPercent),
        filesystem: root.fs
      };
    } catch (error) {
      console.error('Storage collection error:', error);
      return null;
    }
  }

  /**
   * Get static system info (run once on startup)
   */
  async getSystemInfo() {
    try {
      const [cpu, os, system] = await Promise.all([
        si.cpu(),
        si.osInfo(),
        si.system()
      ]);

      return {
        cpu: {
          model: cpu.brand,
          cores: cpu.cores,
          threads: cpu.processors || cpu.cores,
          architecture: cpu.architecture || 'x86_64',
          cache: {
            l1: cpu.cache?.l1d || 'Unknown',
            l2: cpu.cache?.l2 || 'Unknown',
            l3: cpu.cache?.l3 || 'Unknown'
          }
        },
        os: {
          distro: os.distro,
          release: os.release,
          kernel: os.kernel,
          arch: os.arch,
          platform: os.platform
        },
        system: {
          manufacturer: system.manufacturer,
          model: system.model
        }
      };
    } catch (error) {
      console.error('System info error:', error);
      return null;
    }
  }

  /**
   * Get system uptime
   */
  async getUptime() {
    try {
      const time = await si.time();
      return {
        uptime: time.uptime,
        formatted: this._formatUptime(time.uptime)
      };
    } catch (error) {
      console.error('Uptime error:', error);
      return null;
    }
  }

  /**
   * Collect ALL metrics at once (called every 1 second)
   */
  async collectAll() {
    try {
      const [cpu, memory, processes, network, storage, uptime] = await Promise.all([
        this.getCPU(),
        this.getMemory(),
        this.getProcesses(),
        this.getNetwork(),
        this.getStorage(),
        this.getUptime()
      ]);

      return {
        timestamp: Date.now(),
        cpu,
        memory,
        processes,
        network,
        storage,
        uptime
      };
    } catch (error) {
      console.error('Collection error:', error);
      return null;
    }
  }

  // === HELPER FUNCTIONS ===

  /**
   * Format bytes to human-readable (GB, MB, KB)
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format uptime seconds to HH:MM:SS
   */
  _formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

module.exports = new SystemCollector();
