import React from 'react';
import { Box, Play, Square, RefreshCcw, MoreHorizontal, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const containers = [
  { id: 'c1', name: 'api-gateway', image: 'nginx:latest', status: 'running', cpu: '1.2%', mem: '124MB', uptime: '14d' },
  { id: 'c2', name: 'auth-service', image: 'node:18-alpine', status: 'running', cpu: '0.8%', mem: '256MB', uptime: '14d' },
  { id: 'c3', name: 'payment-worker', image: 'python:3.9', status: 'paused', cpu: '0%', mem: '45MB', uptime: '2d' },
  { id: 'c4', name: 'redis-cache', image: 'redis:6.2', status: 'running', cpu: '2.4%', mem: '512MB', uptime: '30d' },
  { id: 'c5', name: 'postgres-db', image: 'postgres:14', status: 'running', cpu: '5.1%', mem: '1.2GB', uptime: '30d' },
];

export function Deployments() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Container Orchestration</h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time Docker & Kubernetes resource monitoring.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 text-zinc-300">
            <RefreshCcw className="w-4 h-4" />
            PRUNE
          </button>
          <button className="px-4 py-2 bg-green-500 text-black rounded-lg text-sm font-bold hover:bg-green-400 transition-all">
            DEPLOY NEW
          </button>
        </div>
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Container</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resources</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Uptime</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {containers.map((container, i) => (
              <motion.tr 
                key={container.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5">
                      <Box className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{container.name}</span>
                      <span className="text-[10px] font-mono text-zinc-600">{container.image}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${container.status === 'running' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`} />
                    <span className="text-xs capitalize text-zinc-400">{container.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-zinc-600" />
                      <span className="text-xs font-mono text-zinc-400">{container.cpu}</span>
                    </div>
                    <div className="w-px h-3 bg-white/5" />
                    <span className="text-xs font-mono text-zinc-400">{container.mem}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-zinc-500">{container.uptime}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-zinc-500" title="Start/Pause">
                      {container.status === 'running' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 text-green-500" />}
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-zinc-500">
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-zinc-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
