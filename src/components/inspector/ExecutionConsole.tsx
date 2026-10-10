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
  ArrowRight,
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm text-xs flex flex-col h-[360px]">
      {/* Console Tab Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-950/60 rounded-t-xl overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setConsoleTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
              consoleTab === 'output'
                ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>
          <button
            onClick={() => setConsoleTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
              consoleTab === 'logs'
                ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Step Logs</span>
          </button>
          <button
            onClick={() => setConsoleTab('variables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
              consoleTab === 'variables'
                ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>
          <button
            onClick={() => setConsoleTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
              consoleTab === 'performance'
                ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Performance</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
          {traceResult.events.length} Trace Events Recorded
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-zinc-300">
        
        {/* OUTPUT TAB */}
        {consoleTab === 'output' && (
          <div className="space-y-3 font-mono">
            <div>
              <div className="text-zinc-500 text-[10px] uppercase font-sans font-semibold mb-1">
                Initial Dataset Input ({data.length} items):
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-zinc-300">
                [{data.join(', ')}]
              </div>
            </div>

            <div>
              <div className="text-zinc-500 text-[10px] uppercase font-sans font-semibold mb-1">
                Current Array State (Step {currentStepIndex + 1}):
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-cyan-300">
                [{currentEvent?.arraySnapshot.join(', ')}]
              </div>
            </div>

            <div>
              <div className="text-zinc-500 text-[10px] uppercase font-sans font-semibold mb-1">
                Final Result Status:
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-300">
                  {isFinished ? 'Execution Complete' : 'Execution In Progress...'}
                </span>
                {isFinished && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP LOGS TAB */}
        {consoleTab === 'logs' && (
          <div className="space-y-1">
            <div className="text-[11px] font-sans text-zinc-500 mb-2">
              Click any log entry to jump to that exact execution step:
            </div>
            {traceResult.events.map((ev, idx) => {
              const isSelected = idx === currentStepIndex;
              return (
                <div
                  key={ev.id}
                  onClick={() => goToStep(idx)}
                  className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-800/60 font-medium'
                      : 'hover:bg-zinc-800/60 text-zinc-400'
                  }`}
                >
                  <span className="w-8 shrink-0 text-right text-zinc-500 select-none">
                    #{idx + 1}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[10px] shrink-0 uppercase">
                    {ev.type}
                  </span>
                  <span className="truncate">{ev.operationName}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* VARIABLES TAB */}
        {consoleTab === 'variables' && (
          <div className="space-y-2">
            <div className="text-[11px] font-sans text-zinc-500 mb-2">
              Active memory state snapshot for current step:
            </div>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
                  <tr>
                    <th className="p-2 font-medium">Identifier</th>
                    <th className="p-2 font-medium">Value</th>
                    <th className="p-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {currentEvent && Object.entries(currentEvent.variables).map(([k, v]) => (
                    <tr key={k} className="hover:bg-zinc-850">
                      <td className="p-2 text-cyan-400">{k}</td>
                      <td className="p-2 font-bold">{Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}</td>
                      <td className="p-2 text-zinc-500 text-[10px]">{Array.isArray(v) ? 'Array' : typeof v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {consoleTab === 'performance' && (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Comparisons</div>
                <div className="text-base font-bold text-amber-400">{metrics.comparisons}</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Swaps / Shifts</div>
                <div className="text-base font-bold text-rose-400">{metrics.swaps}</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Array Writes</div>
                <div className="text-base font-bold text-cyan-400">{metrics.writes}</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Element Accesses</div>
                <div className="text-base font-bold text-indigo-400">{metrics.accesses}</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Execution Time</div>
                <div className="text-base font-bold text-emerald-400">{metrics.executionTimeMs} ms</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Max Recursion Depth</div>
                <div className="text-base font-bold text-purple-400">{metrics.maxRecursionDepth}</div>
              </div>
            </div>

            {currentAlgo && (
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs">
                <div className="font-semibold text-zinc-200">Theoretical Complexities:</div>
                <div className="grid grid-cols-2 gap-2 text-zinc-400 font-mono text-[11px]">
                  <div>Best Case: <span className="text-emerald-400">{currentAlgo.complexity.bestTime}</span></div>
                  <div>Average Case: <span className="text-cyan-400">{currentAlgo.complexity.averageTime}</span></div>
                  <div>Worst Case: <span className="text-rose-400">{currentAlgo.complexity.worstTime}</span></div>
                  <div>Auxiliary Space: <span className="text-amber-400">{currentAlgo.complexity.spaceComplexity}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
