import { useState } from 'react';
import { Sidebar, Header } from './components/Navigation';
import { Monitoring } from './components/Monitoring';
import { Pipelines } from './components/Pipelines';
import { Logs } from './components/Logs';
import { Deployments } from './components/Deployments';
import { Security } from './components/Security';
import { Layout, Box, Shield, Activity, Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from './context/NotificationContext';
import { useEffect, useRef } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const { addNotification } = useNotifications();
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkSecurity = async () => {
      try {
        const res = await fetch('/api/metrics');
        const data = await res.json();
        if (data.security && data.security.vulnerabilities) {
          data.security.vulnerabilities.forEach((v: any) => {
            if (v.severity === 'critical' && v.status === 'open' && !notifiedRef.current.has(v.id)) {
              addNotification(
                'Critical Security Threat',
                `A critical risk "${v.name}" was detected on ${v.target}. Mitigation required.`,
                'error'
              );
              notifiedRef.current.add(v.id);
            }
          });
        }
      } catch (e) {
        console.error("Global alert check failed", e);
      }
    };

    const interval = setInterval(checkSecurity, 10000);
    checkSecurity(); // Immediate check
    return () => clearInterval(interval);
  }, [addNotification]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'monitoring':
        return <Monitoring />;
      case 'pipelines':
        return <Pipelines />;
      case 'logs':
        return <Logs />;
      case 'deployments':
        return <Deployments />;
      case 'security':
        return <Security />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white selection:bg-green-500/30 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-grow"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Overview({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">YunOps Command Center</h1>
        <p className="text-zinc-500 text-lg">Cross-cluster telemetry and autonomous AI orchestration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard 
          icon={Activity} 
          title="System Health" 
          value="99.98%" 
          description="Global uptime across 12 availability zones."
          color="text-green-500"
          onClick={() => setActiveTab('monitoring')}
        />
        <OverviewCard 
          icon={Cpu} 
          title="Active Pipelines" 
          value="4" 
          description="Concurrent deployment workflows in progress."
          color="text-blue-500"
          onClick={() => setActiveTab('pipelines')}
        />
        <OverviewCard 
          icon={Terminal} 
          title="Anomalies" 
          value="2" 
          description="High-priority logs flagged by Sentinel AI."
          color="text-red-500"
          onClick={() => setActiveTab('logs')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Cluster Infrastructure</h3>
            <span className="text-[10px] font-mono text-zinc-600">PRODUCTION-READY v1.4.2</span>
          </div>
          
          <div className="data-grid bg-black rounded-xl p-8 border border-white/5 grid grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-1 bg-green-500/50 rounded-full w-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 60 + 40}%` }}
                    className="h-full bg-green-500"
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500">NODE-{i}0{i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-white/10 space-y-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { time: '2m ago', event: 'Deployment successful', sub: 'v1.4.2-stable' },
              { time: '14m ago', event: 'Scale up: api-gateway', sub: '+4 instances' },
              { time: '42m ago', event: 'Backup completed', sub: 'S3-East-Region' }
            ].map((e, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-px bg-white/10 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                </div>
                <div className="pb-4">
                  <p className="text-[11px] text-zinc-500">{e.time}</p>
                  <p className="text-sm font-semibold">{e.event}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{e.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, title, value, description, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="glass-panel rounded-2xl p-8 border border-white/10 text-left hover:border-white/20 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Activity className="w-3 h-3 text-zinc-500" />
        </div>
      </div>
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="text-4xl font-bold mt-1 tracking-tight">{value}</p>
      <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{description}</p>
    </button>
  );
}

function PlaceholderSection({ title, icon: Icon }: { title: string, icon: any }) {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
      <Icon className="w-16 h-16 opacity-10" />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-500">{title}</h2>
        <p className="text-sm tracking-[0.2em] mt-2 uppercase font-mono opacity-50 underline underline-offset-8">Module Initializing...</p>
      </div>
    </div>
  );
}

