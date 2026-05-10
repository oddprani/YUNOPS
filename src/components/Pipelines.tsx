import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Play, MoreVertical, GitBranch, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

interface Pipeline {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: string;
  timestamp: string;
}

export function Pipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  useEffect(() => {
    fetch('/api/pipelines')
      .then(res => res.json())
      .then(setPipelines);
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Automation Pipelines</h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time status of CI/CD workflows across all clusters.</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-400 transition-colors">
          <Play className="w-4 h-4 fill-current" />
          RUN PIPELINE
        </button>
      </div>

      <div className="space-y-4">
        {pipelines.map((pipeline, index) => (
          <motion.div
            key={pipeline.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel rounded-xl p-5 border border-white/10 flex items-center gap-6 group hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex-shrink-0">
              <StatusIcon status={pipeline.status} />
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-3">
                <span className="font-bold tracking-tight">{pipeline.name}</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
                  <GitBranch className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-400">main</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {pipeline.duration}
                </div>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                  <Terminal className="w-3 h-3" />
                  ID: #{pipeline.id}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 px-8 border-x border-white/5">
              <PipelineSteps status={pipeline.status} />
            </div>

            <div className="flex-shrink-0 text-zinc-500">
              <MoreVertical className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: Pipeline['status'] }) {
  switch (status) {
    case 'success': return <div className="p-2 bg-green-500/10 rounded-full border border-green-500/20 text-green-500"><CheckCircle2 className="w-6 h-6" /></div>;
    case 'failed': return <div className="p-2 bg-red-500/10 rounded-full border border-red-500/20 text-red-500"><XCircle className="w-6 h-6" /></div>;
    case 'running': return <div className="p-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-500 animate-spin"><Clock className="w-6 h-6" /></div>;
    default: return <div className="p-2 bg-zinc-500/10 rounded-full border border-zinc-500/20 text-zinc-500"><Clock className="w-6 h-6" /></div>;
  }
}

function PipelineSteps({ status }: { status: Pipeline['status'] }) {
  const steps = ['Verify', 'Build', 'Test', 'Deploy'];
  return (
    <div className="flex items-center gap-3">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full border-2 ${
              status === 'success' ? 'bg-green-500 border-green-500/30' :
              status === 'failed' && i >= 2 ? 'bg-red-500 border-red-500/30' :
              status === 'running' && i === 1 ? 'bg-blue-500 border-blue-500/30 animate-pulse' :
              'bg-zinc-800 border-zinc-700'
            }`} />
            <span className="text-[8px] uppercase font-bold text-zinc-600 tracking-tighter">{step}</span>
          </div>
          {i < steps.length - 1 && <div className="w-4 h-px bg-white/5" />}
        </React.Fragment>
      ))}
    </div>
  );
}
