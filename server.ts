import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

import si from 'systeminformation';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Metric Buffer for History
  let historicalData: any = {
    cpu: [],
    memory: [],
    network: []
  };

  const MAX_HISTORY = 30;

  const updateMetrics = async () => {
    try {
      const [cpu, mem, osInfo, currentLoad, network] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo(),
        si.currentLoad(),
        si.networkStats()
      ]);

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const netStats = network[0] || { rx_sec: 0, tx_sec: 0 };

      const cpuUsage = Math.round(currentLoad.currentLoad);
      const memUsage = Math.round((mem.active / mem.total) * 100);
      const rx = netStats.rx_sec / 1024;
      const tx = netStats.tx_sec / 1024;

      historicalData.cpu.push({ time, value: cpuUsage });
      historicalData.memory.push({ time, value: memUsage });
      historicalData.network.push({ time, rx, tx });

      if (historicalData.cpu.length > MAX_HISTORY) historicalData.cpu.shift();
      if (historicalData.memory.length > MAX_HISTORY) historicalData.memory.shift();
      if (historicalData.network.length > MAX_HISTORY) historicalData.network.shift();

      const uptimeSeconds = os.uptime();
      const days = Math.floor(uptimeSeconds / (24 * 3600));
      const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);

      const latestMetrics = {
        cpu: {
          usage: cpuUsage,
          history: historicalData.cpu
        },
        memory: {
          usage: memUsage,
          total: (mem.total / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
          free: (mem.available / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
          history: historicalData.memory
        },
        network: {
          rx: rx.toFixed(2),
          tx: tx.toFixed(2),
          history: historicalData.network
        },
        security: {
          score: 84,
          vulnerabilities: [
            { id: 'v-1', severity: 'high', name: 'Outdated SSL Lib', target: 'api-gateway', status: 'open' },
            { id: 'v-2', severity: 'medium', name: 'Open SSH Port', target: 'bastion-host', status: 'fixed' },
            { id: 'v-3', severity: 'critical', name: 'SQL Injection Risk', target: 'auth-service', status: 'open' }
          ]
        },
        latency: Math.floor(Math.random() * 5) + 2,
        uptime: `${days}d ${hours}h ${minutes}m`,
        system: {
          hostname: osInfo.hostname,
          platform: osInfo.platform,
          release: osInfo.release,
          arch: osInfo.arch,
          cpus: cpu.cores,
          type: osInfo.distro,
          manufacturer: cpu.manufacturer,
          brand: cpu.brand
        }
      };

      return latestMetrics;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  let cachedMetrics: any = null;
  setInterval(async () => {
    cachedMetrics = await updateMetrics();
  }, 1000);

  // API Routes
  app.get('/api/metrics', async (req, res) => {
    if (!cachedMetrics) {
      cachedMetrics = await updateMetrics();
    }
    res.json(cachedMetrics);
  });

  app.get('/api/pipelines', (req, res) => {
    res.json(getPipelines());
  });

  app.get('/api/logs', (req, res) => {
    res.json(getLogs());
  });

  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 YUNOPS Server running on http://localhost:${PORT}`);
  });
}

startServer();
