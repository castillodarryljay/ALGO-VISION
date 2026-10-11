import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';
import { 
  Terminal, 
  ListOrdered, 
  Variable, 
  Gauge, 
  CheckCircle, 
  Clock, 
  Database
} from 'lucide-react';

export const ExecutionConsole: React.FC = () => {
  const { 
    traceResult, 
    currentStepIndex, 
    consoleTab, 
    setConsoleTab, 
    selectedAlgorithmId, 
    data,
    goToStep 
  } = useAlgoStore();

  const currentAlgo = ALGORITHMS.find(a => a.id === selectedAlgorithmId);
  const currentEvent = traceResult.events[currentStepIndex];
  const lastEvent = traceResult.events[traceResult.events.length - 1];
  const isFinished = currentStepIndex === traceResult.events.length - 1;

  const metrics = traceResult.metrics;

  return (
    <div className="glass-card rounded-3xl border border-white/80 dark:border-white/10 shadow-sm text-xs flex flex-col h-[520px] overflow-hidden">
      {/* Console Tab Header - Apple iOS Segmented Tabs */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]">
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] overflow-x-auto max-w-full backdrop-blur-md">
          <button
            onClick={() => setConsoleTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold text-xs transition-all ${
              consoleTab === 'output'
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>
          <button
            onClick={() => setConsoleTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold text-xs transition-all ${
              consoleTab === 'logs'
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Step Logs</span>
          </button>
          <button
            onClick={() => setConsoleTab('variables')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold text-xs transition-all ${
              consoleTab === 'variables'
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>
          <button
            onClick={() => setConsoleTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold text-xs transition-all ${
              consoleTab === 'performance'
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Performance</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-500 hidden sm:block">
          {traceResult.events.length} Events
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-800 dark:text-zinc-200">
        
        {/* OUTPUT TAB */}
        {consoleTab === 'output' && (
          <div className="space-y-4">
            <div>
              <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-sans font-semibold mb-1">
                Initial Dataset Input ({data.length} items):
              </div>
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.07] text-slate-800 dark:text-zinc-200">
                [{data.join(', ')}]
              </div>
            </div>

            <div>
              <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-sans font-semibold mb-1">
                Current Snapshot (at Step #{currentStepIndex + 1}):
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-900 dark:text-cyan-200 font-semibold">
                [{currentEvent?.arraySnapshot?.join(', ') || 'Processing'}]
              </div>
            </div>

            {isFinished && lastEvent && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold font-sans">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Execution Complete</span>
                </div>
                <div>Final Result: [{lastEvent.arraySnapshot.join(', ')}]</div>
              </div>
            )}
          </div>
        )}

        {/* LOGS TAB */}
        {consoleTab === 'logs' && (
          <div className="space-y-1">
            {traceResult.events.map((ev, idx) => {
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  onClick={() => goToStep(idx)}
                  className={`px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-cyan-500/15 text-cyan-950 dark:text-cyan-100 font-bold border border-cyan-500/30'
                      : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] opacity-60">#{idx + 1}</span>
                    <span className="truncate">{ev.operationName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0 font-sans">{ev.type}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* VARIABLES TAB */}
        {consoleTab === 'variables' && (
          <div className="space-y-3">
            <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-sans font-semibold">
              Engine Memory Stack (Step #{currentStepIndex + 1}):
            </div>
            {currentEvent?.variables && Object.keys(currentEvent.variables).length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentEvent.variables).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/10">
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans">{k}</div>
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{String(v)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 dark:text-zinc-500 italic py-4">No local memory registers for current operation.</div>
            )}
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {consoleTab === 'performance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl glass-subtle">
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Comparisons</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {metrics.comparisons}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl glass-subtle">
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Swaps & Writes</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {metrics.swaps}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-2 font-sans">
              <div className="font-semibold text-slate-800 dark:text-zinc-200">Asymptotic Complexity</div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div>
                  <div className="text-slate-400 dark:text-zinc-500">Best</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">{currentAlgo?.complexity.bestTime}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-zinc-500">Average</div>
                  <div className="text-cyan-600 dark:text-cyan-400 font-bold">{currentAlgo?.complexity.averageTime}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-zinc-500">Worst</div>
                  <div className="text-rose-600 dark:text-rose-400 font-bold">{currentAlgo?.complexity.worstTime}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
