import React from 'react';
import { Activity, Server, Layout, Terminal, Box, Shield, Cpu, Zap, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: 'overview', icon: Layout, label: 'Overview' },
    { id: 'monitoring', icon: Activity, label: 'Monitoring' },
    { id: 'pipelines', icon: Cpu, label: 'CI/CD Pipelines' },
    { id: 'logs', icon: Terminal, label: 'Log Analytics' },
    { id: 'deployments', icon: Box, label: 'Deployments' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="w-64 border-r border-white/10 h-screen flex flex-col bg-black/50 backdrop-blur-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">YUNOPS</span>
        </div>
        
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold">DevOps Admin</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Production</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Cluster: k8s-prod-us</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Region: us-east-1</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-zinc-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
        </button>
        <div className="h-4 w-px bg-white/10" />
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Network Traffic</p>
          <p className="text-sm font-mono text-green-500 leading-none mt-0.5">142.2 GB/s</p>
        </div>
      </div>
    </header>
  );
}
