import React, { useEffect, useState } from 'react';
import { Shield, AlertCircle, CheckCircle2, Lock, Eye, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface Vulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  name: string;
  target: string;
  status: 'open' | 'fixed';
}

export function Security() {
  const [data, setData] = useState<{ score: number, vulnerabilities: Vulnerability[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/metrics');
        const metrics = await response.json();
        if (metrics.security) {
          setData(metrics.security);
        }
      } catch (error) {
        console.error("Security Fetch Error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Security & Compliance</h2>
          <p className="text-sm text-zinc-500 mt-1">Vulnerability scanning and real-time threat detection.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Fleet Security Score</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${data.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{data.score}%</span>
              <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${data.score}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecurityCard 
          icon={Lock} 
          label="Access Control" 
          value="RBAC Active" 
          status="Compliant" 
          color="text-blue-500"
        />
        <SecurityCard 
          icon={Shield} 
          label="Encryption" 
          value="AES-256-GCM" 
          status="Encrypted" 
          color="text-purple-500"
        />
        <SecurityCard 
          icon={Eye} 
          label="Audit Logs" 
          value="14.2k Events" 
          status="Monitoring" 
          color="text-green-500"
        />
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-400">Open Vulnerabilities</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded">LIVE SCAN</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Severity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vulnerability</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Resource</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.vulnerabilities.map((v, i) => (
              <motion.tr 
                key={v.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:bg-white/[0.01] transition-colors"
              >
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    v.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    v.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {v.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{v.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 font-mono">
                  {v.target}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {v.status === 'fixed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs ${v.status === 'fixed' ? 'text-green-500' : 'text-red-500'}`}>
                      {v.status === 'fixed' ? 'Resolved' : 'Attention Required'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">
                    PATCH NOW
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityCard({ icon: Icon, label, value, status, color }: any) {
  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-[0.03] group-hover:opacity-[0.05] transition-opacity`}>
        <Icon className="w-full h-full" />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight mb-1">{value}</span>
        <span className="text-xs text-zinc-500 font-medium">{status}</span>
      </div>
    </div>
  );
}
