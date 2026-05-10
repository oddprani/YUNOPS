import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Database, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '../lib/utils';

interface MetricData {
  cpu: { usage: number; history: { time: string; value: number }[] };
  memory: { usage: number; total: string; free: string; history: { time: string; value: number }[] };
  network: { 
    rx: string; 
    tx: string; 
    history: { time: string; rx: number; tx: number }[] 
  };
  latency: number;
  uptime: string;
  system: {
    hostname: string;
    platform: string;
    release: string;
    arch: string;
    cpus: number;
    type: string;
    manufacturer: string;
    brand: string;
  };
}

export function Monitoring() {
  const [data, setData] = useState<MetricData | null>(null);
  const [clientInfo, setClientInfo] = useState<{ os: string, browser: string } | null>(null);

  useEffect(() => {
    // Detect Client OS/Browser
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    if (ua.indexOf("Win") !== -1) os = "Windows";
    if (ua.indexOf("Mac") !== -1) os = "macOS";
    if (ua.indexOf("Linux") !== -1) os = "Linux";
    if (ua.indexOf("Android") !== -1) os = "Android";
    if (ua.indexOf("like Mac") !== -1) os = "iOS";

    setClientInfo({
      os,
      browser: navigator.vendor || "Standard Browser"
    });

    const fetchData = async () => {
      try {
        const response = await fetch('/api/metrics');
        const json = await response.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch metrics", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="p-8 text-zinc-500 font-mono animate-pulse">Initializing telemetry...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Cloud Infrastructure Monitoring</h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time telemetery from the active container environment.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Source: {data.system.type} (Remote)</span>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono italic">Client Sync: Active (1s interval)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="CPU LOAD" 
          value={`${data.cpu.usage}%`} 
          icon={Cpu} 
          trend={`${data.system.manufacturer} ${data.system.brand}`}
          color="text-green-500"
        />
        <StatCard 
          label="MEMORY USAGE" 
          value={`${data.memory.usage}%`} 
          icon={Database} 
          trend={`${data.memory.free} Free / ${data.memory.total}`}
          color="text-blue-500"
        />
        <StatCard 
          label="NETWORK LATENCY" 
          value={`${data.latency}ms`} 
          icon={Zap} 
          trend="Cloud Hub -> Client"
          color="text-yellow-500"
        />
        <StatCard 
          label="SYSTEM UPTIME" 
          value={data.uptime} 
          icon={Activity} 
          trend="Docker Container"
          color="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Real-time CPU Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.cpu.history}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10 }}
                />
                <YAxis 
                  hide
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#22C55E' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCpu)" 
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Memory Load Persistence</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.memory.history}>
                <defs>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10 }}
                />
                <YAxis 
                  hide
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMem)" 
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 lg:col-span-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Network Througput (Total Bytes In/Out)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.network.history}>
                <defs>
                  <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rx" 
                  name="Inbound (KB/s)"
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRx)" 
                  animationDuration={300}
                />
                <Area 
                  type="monotone" 
                  dataKey="tx" 
                  name="Outbound (KB/s)"
                  stroke="#EC4899" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTx)" 
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Node Summary</h3>
          <div className="space-y-6">
            <StatRow label="Ingress Rate" value={`${data.network.rx} KB/s`} color="text-purple-500" />
            <StatRow label="Egress Rate" value={`${data.network.tx} KB/s`} color="text-pink-500" />
            <StatRow label="Host Platform" value={data.system.platform} color="text-blue-400" />
            <StatRow label="Cluster Node" value={data.system.hostname} color="text-zinc-400" />
            <StatRow label="Instance Id" value="cr-7a2-f9" color="text-zinc-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
      <span className={cn("text-sm font-mono font-medium", color)}>{value}</span>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-mono text-zinc-300 truncate" title={value}>{value}</span>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-start gap-4"
    >
      <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace('text-', 'bg-'))}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl font-mono mt-1 font-semibold">{value}</p>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{trend}</p>
      </div>
    </motion.div>
  );
}
