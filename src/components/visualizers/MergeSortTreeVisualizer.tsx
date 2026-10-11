import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { SortingVisualizer } from './SortingVisualizer';
import { GitFork, Layers } from 'lucide-react';

export const MergeSortTreeVisualizer: React.FC = () => {
  const { traceResult, currentStepIndex, mergeSortViewMode, setMergeSortViewMode, data } = useAlgoStore();
  const currentEvent = traceResult.events[currentStepIndex];

  if (!currentEvent) return null;

  const subarrays = currentEvent.subarrays;
  const recursionDepth = currentEvent.recursionDepth ?? 0;
  const secondaryRange = currentEvent.secondaryIndices ?? [0, data.length - 1];

  // Helper to construct binary tree representation of Merge Sort intervals
  function getTreeLevels(n: number) {
    const levels: { start: number; end: number; depth: number }[][] = [];

    function divide(low: number, high: number, depth: number) {
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push({ start: low, end: high, depth });
      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        divide(low, mid, depth + 1);
        divide(mid + 1, high, depth + 1);
      }
    }

    divide(0, n - 1, 0);
    return levels;
  }

  const levels = getTreeLevels(data.length);

  return (
    <div className="flex flex-col gap-4">
      {/* View Switcher Bar - Apple iOS Segmented Bar */}
      <div className="flex items-center justify-between glass-panel rounded-3xl px-5 py-3 text-xs border border-white/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="font-semibold text-slate-800 dark:text-zinc-200">Merge Sort Visualization Mode</span>
        </div>

        <div className="flex items-center bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          <button
            onClick={() => setMergeSortViewMode('array')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mergeSortViewMode === 'array' 
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Array View
          </button>
          <button
            onClick={() => setMergeSortViewMode('tree')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mergeSortViewMode === 'tree' 
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Recursion Tree
          </button>
          <button
            onClick={() => setMergeSortViewMode('combined')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mergeSortViewMode === 'combined' 
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Combined View
          </button>
        </div>
      </div>

      {/* Render selected view(s) */}
      {(mergeSortViewMode === 'array' || mergeSortViewMode === 'combined') && (
        <SortingVisualizer />
      )}

      {/* Auxiliary Merged Buffer Banner (when in merge phase) */}
      {subarrays && (
        <div className="glass-card rounded-3xl p-5 shadow-sm border border-white/80 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-semibold text-slate-800 dark:text-zinc-200">Subarray Split & Merge Inspector</span>
              <span className="text-slate-500 dark:text-zinc-400 font-mono">Depth {recursionDepth}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
              Left [{subarrays.leftRange[0]}..{subarrays.leftRange[1]}] | Right [{subarrays.rightRange[0]}..{subarrays.rightRange[1]}]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Left Subarray */}
            <div className="glass-subtle p-3.5 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
              <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 mb-1.5 flex items-center justify-between">
                <span>Left Half</span>
                <span className="font-mono text-slate-500 dark:text-zinc-500">{subarrays.left.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {subarrays.left.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl glass-card font-mono text-slate-800 dark:text-zinc-200 text-xs font-semibold"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>

            {/* Merged Temporary Array */}
            <div className="glass-subtle p-3.5 rounded-2xl border border-emerald-500/30">
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center justify-between">
                <span>Auxiliary Merged Buffer</span>
                <span className="font-mono text-slate-500 dark:text-zinc-500">{subarrays.merged.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[28px] items-center">
                {subarrays.merged.length === 0 ? (
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">Gathering sorted elements...</span>
                ) : (
                  subarrays.merged.map((val, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 font-mono text-emerald-800 dark:text-emerald-200 text-xs font-bold"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Right Subarray */}
            <div className="glass-subtle p-3.5 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
              <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 mb-1.5 flex items-center justify-between">
                <span>Right Half</span>
                <span className="font-mono text-slate-500 dark:text-zinc-500">{subarrays.right.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {subarrays.right.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl glass-card font-mono text-slate-800 dark:text-zinc-200 text-xs font-semibold"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recursion Tree View */}
      {(mergeSortViewMode === 'tree' || mergeSortViewMode === 'combined') && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 shadow-sm overflow-x-auto border border-white/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
            <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Recursion Tree Breakdown
            </span>
            <span className="text-slate-500 dark:text-zinc-500 text-[11px] font-mono">
              Levels: {levels.length} (Depth 0 to {levels.length - 1})
            </span>
          </div>

          <div className="flex flex-col items-center gap-6 min-w-[500px] py-3">
            {levels.map((level, lvlIdx) => (
              <div key={lvlIdx} className="w-full flex flex-col items-center">
                <div className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 mb-1.5 font-semibold">
                  Level {lvlIdx} {lvlIdx === 0 ? '(Root)' : lvlIdx === levels.length - 1 ? '(Base Cases)' : ''}
                </div>
                <div className="flex items-center justify-around w-full gap-2">
                  {level.map((node, nodeIdx) => {
                    const slice = data.slice(node.start, node.end + 1);
                    const isNodeActive = secondaryRange.length === 2 && 
                      node.start === secondaryRange[0] && 
                      node.end === secondaryRange[1] &&
                      recursionDepth === lvlIdx;

                    return (
                      <div
                        key={nodeIdx}
                        className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all ${
                          isNodeActive
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-950 dark:text-cyan-100 shadow-md shadow-cyan-500/20 ring-2 ring-cyan-500/40'
                            : 'glass-card text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mb-1">
                          [{node.start}..{node.end}]
                        </div>
                        <div className="flex gap-1 font-mono text-xs">
                          {slice.map((v, i) => (
                            <span 
                              key={i} 
                              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                                isNodeActive ? 'bg-cyan-600 text-white shadow-xs' : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-800 dark:text-zinc-200'
                              }`}
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
