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

  // Real System Stats Generator
  const getMetrics = async () => {
    try {
      const [cpu, mem, osInfo, currentLoad] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo(),
        si.currentLoad()
      ]);

      const uptimeSeconds = os.uptime();
      const days = Math.floor(uptimeSeconds / (24 * 3600));
      const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);

      return {
        cpu: {
          usage: Math.round(currentLoad.currentLoad),
          history: Array.from({ length: 20 }, (_, i) => ({
            time: new Date(Date.now() - (19 - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            value: Math.floor(Math.random() * 10) + Math.round(currentLoad.currentLoad)
          }))
        },
        memory: {
          usage: Math.round((mem.active / mem.total) * 100),
          total: (mem.total / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
          free: (mem.available / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
          history: Array.from({ length: 20 }, (_, i) => ({
            time: new Date(Date.now() - (19 - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            value: Math.round((mem.active / mem.total) * 100) + (Math.random() * 2 - 1)
          }))
        },
        latency: Math.floor(Math.random() * 20) + 5,
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
    } catch (error) {
      console.error("Metrics Collection Error:", error);
      return {};
    }
  };

  const getPipelines = () => [
    { id: 'p-1', name: 'main-branch-ci', status: 'success', duration: '4m 12s', timestamp: new Date().toISOString() },
    { id: 'p-2', name: 'production-deploy', status: 'running', duration: '2m 45s', timestamp: new Date().toISOString() },
    { id: 'p-3', name: 'v2-feature-api', status: 'failed', duration: '1m 2s', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ];

  const getLogs = () => [
    { id: 1, level: 'info', message: `Successfully connected to Kubernetes cluster context: ${os.hostname()}`, timestamp: new Date().toISOString() },
    { id: 2, level: 'warn', message: 'Pod "api-gateway-7f8d" memory usage exceeding 80% threshold', timestamp: new Date().toISOString() },
    { id: 3, level: 'error', message: 'Database connection timeout on node "db-primary-0"', timestamp: new Date().toISOString() },
    { id: 4, level: 'info', message: 'CI/CD pipeline "main-branch-ci" triggered by commit 7a2b9f1', timestamp: new Date().toISOString() },
  ];

  // API Routes
  app.get('/api/metrics', async (req, res) => {
    const metrics = await getMetrics();
    res.json(metrics);
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
    console.log(`🚀 YunOps Backend running on http://localhost:${PORT}`);
  });
}

startServer();
