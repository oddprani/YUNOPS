import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Cpu, Wand2, RefreshCcw, AlertTriangle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDebuggingSuggestion } from '../lib/gemini';

interface LogEntry {
  id: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(setLogs);
  }, []);

  const handleAiDebug = async (log: LogEntry) => {
    setSelectedLog(log);
    setIsAiLoading(true);
    setAiSuggestion(null);
    const suggestion = await getDebuggingSuggestion(log.message);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const filteredLogs = logs.filter(l => 
    l.message.toLowerCase().includes(filter.toLowerCase()) || 
    l.level.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-grow flex flex-col border-r border-white/5">
        <div className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-10 flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Filter logs by level or message..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500/50 transition-all font-mono"
            />
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            STREAMS
          </button>
        </div>

        <div className="flex-grow overflow-y-auto font-mono text-xs p-4 space-y-1 bg-black/40">
          {filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className={`group flex gap-4 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-white/5 border-l-2 border-green-500' : ''}`}
              onClick={() => handleAiDebug(log)}
            >
              <span className="text-zinc-600 flex-shrink-0 w-24">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`flex-shrink-0 w-12 font-bold uppercase ${
                log.level === 'error' ? 'text-red-500' : 
                log.level === 'warn' ? 'text-yellow-500' : 'text-blue-500'
              }`}>{log.level}</span>
              <span className="text-zinc-400 break-all">{log.message}</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Wand2 className="w-4 h-4 text-green-500" title="AI Debug" />
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      <AnimatePresence>
        {selectedLog && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 bg-zinc-900 border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Log Inspection</h3>
              <button onClick={() => setSelectedLog(null)} className="text-zinc-500 hover:text-white transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <LogLevelIcon level={selectedLog.level} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{selectedLog.level} event detected</span>
                </div>
                <p className="text-sm font-mono text-zinc-300 leading-relaxed">{selectedLog.message}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600 font-mono">Timestamp: {selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg w-fit">
                  <Wand2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI Debugging Insight</span>
                </div>

                {isAiLoading ? (
                  <div className="p-8 flex flex-col items-center justify-center gap-4 text-zinc-500 animate-pulse">
                    <RefreshCcw className="w-8 h-8 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Synthesizing metadata...</span>
                  </div>
                ) : aiSuggestion ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-green-500/5 rounded-xl border border-green-500/20"
                  >
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {aiSuggestion}
                    </p>
                    <div className="mt-6 flex gap-3">
                      <button className="flex-grow py-2 bg-green-500 text-black text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-green-400 transition-colors">
                        Apply Patch
                      </button>
                      <button className="px-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-zinc-500">
                        <RefreshCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-8 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                    Select a log to analyze with Sentinel AI
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LogLevelIcon({ level }: { level: LogEntry['level'] }) {
  switch (level) {
    case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info': return <Info className="w-4 h-4 text-blue-500" />;
  }
}
