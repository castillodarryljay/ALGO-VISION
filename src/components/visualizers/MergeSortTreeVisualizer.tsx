import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { SortingVisualizer } from './SortingVisualizer';
import { GitFork, Layers, Split, ArrowDown, ArrowUp, CheckCircle } from 'lucide-react';

interface TreeNodeViewProps {
  array: number[];
  range: [number, number];
  depth: number;
  isActive: boolean;
  isMerging: boolean;
  mid?: number;
}

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
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-zinc-200">Merge Sort Visualization Mode</span>
        </div>

        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setMergeSortViewMode('array')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mergeSortViewMode === 'array' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Array View
          </button>
          <button
            onClick={() => setMergeSortViewMode('tree')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mergeSortViewMode === 'tree' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Recursion Tree
          </button>
          <button
            onClick={() => setMergeSortViewMode('combined')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mergeSortViewMode === 'combined' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
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
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-zinc-200">Subarray Split & Merge Inspector</span>
              <span className="text-zinc-400 font-mono">Depth {recursionDepth}</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Left [{subarrays.leftRange[0]}..{subarrays.leftRange[1]}] | Right [{subarrays.rightRange[0]}..{subarrays.rightRange[1]}]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Left Subarray */}
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="text-[11px] font-semibold text-cyan-400 mb-1.5 flex items-center justify-between">
                <span>Left Half</span>
                <span className="font-mono text-zinc-500">{subarrays.left.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {subarrays.left.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 font-mono text-zinc-200 text-xs font-medium"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>

            {/* Merged Temporary Array */}
            <div className="bg-zinc-950 p-3 rounded-lg border border-cyan-800/60 shadow-inner">
              <div className="text-[11px] font-semibold text-emerald-400 mb-1.5 flex items-center justify-between">
                <span>Auxiliary Merged Buffer</span>
                <span className="font-mono text-zinc-500">{subarrays.merged.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[28px] items-center">
                {subarrays.merged.length === 0 ? (
                  <span className="text-[11px] text-zinc-600 italic">Gathering sorted elements...</span>
                ) : (
                  subarrays.merged.map((val, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-emerald-950/80 border border-emerald-700 font-mono text-emerald-300 text-xs font-bold"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Right Subarray */}
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="text-[11px] font-semibold text-cyan-400 mb-1.5 flex items-center justify-between">
                <span>Right Half</span>
                <span className="font-mono text-zinc-500">{subarrays.right.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {subarrays.right.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 font-mono text-zinc-200 text-xs font-medium"
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
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-inner overflow-x-auto">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800 text-xs">
            <span className="font-semibold text-zinc-200 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              Recursion Tree Breakdown
            </span>
            <span className="text-zinc-500 text-[11px] font-mono">
              Levels: {levels.length} (Depth 0 to {levels.length - 1})
            </span>
          </div>

          <div className="flex flex-col items-center gap-6 min-w-[500px] py-2">
            {levels.map((level, lvlIdx) => (
              <div key={lvlIdx} className="w-full flex flex-col items-center">
                <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1">
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
                        className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                          isNodeActive
                            ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950 ring-2 ring-cyan-500/30'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-zinc-500 mb-1">
                          [{node.start}..{node.end}]
                        </div>
                        <div className="flex gap-1 font-mono text-xs">
                          {slice.map((v, i) => (
                            <span 
                              key={i} 
                              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                isNodeActive ? 'bg-cyan-900/90 text-cyan-200' : 'bg-zinc-800 text-zinc-300'
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
