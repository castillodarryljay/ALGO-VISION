import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { isArraySortedAscending } from '../../engine/searching/searchingAlgorithms';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Target
} from 'lucide-react';

export const SearchingVisualizer: React.FC = () => {
  const { traceResult, currentStepIndex, data, searchTarget, setData } = useAlgoStore();
  const currentEvent = traceResult.events[currentStepIndex];

  if (!currentEvent) return null;

  const array = currentEvent.arraySnapshot;
  const indices = currentEvent.indices || [];
  const secondaryIndices = currentEvent.secondaryIndices || [];
  const pivotIndex = currentEvent.pivotIndex;
  const isSorted = isArraySortedAscending(data);

  const isFound = currentEvent.type === 'TARGET_FOUND';
  const isNotFound = currentEvent.type === 'TARGET_NOT_FOUND';

  const handleSortCopy = () => {
    const sorted = [...data].sort((a, b) => a - b);
    setData(sorted);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[380px] border border-white/80 dark:border-white/10">
      
      {/* Top Banner & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-zinc-300">Searching For Target:</span>
          <span className="px-3 py-1 rounded-full font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5 backdrop-blur-md">
            <Target className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            {searchTarget}
          </span>
        </div>

        {/* Status result */}
        {isFound && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 font-semibold text-xs animate-bounce shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Target Found at index [{indices[0]}]!</span>
          </div>
        )}

        {isNotFound && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 font-semibold text-xs shadow-md">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Target Absent from Array</span>
          </div>
        )}
      </div>

      {/* Sorted Prerequisite Warning if unsorted */}
      {!isSorted && (
        <div className="flex items-center justify-between gap-3 p-3.5 mb-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Notice: Input array is not sorted. Binary, Jump, and Interpolation search require sorted inputs.</span>
          </div>
          <button
            onClick={handleSortCopy}
            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shrink-0 shadow-xs active:scale-95 transition-all"
          >
            Sort Array Now
          </button>
        </div>
      )}

      {/* Array Elements Visualizer */}
      <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-8">
        {array.map((value, idx) => {
          const isExamined = indices.includes(idx);
          const isPivot = pivotIndex === idx;
          const isInRange = secondaryIndices.length === 2 && idx >= secondaryIndices[0] && idx <= secondaryIndices[1];
          const isTargetMatch = isFound && indices.includes(idx);

          let cellStyle = 'glass-card text-slate-800 dark:text-zinc-200';
          let pointerLabel = null;

          if (isTargetMatch) {
            cellStyle = 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white font-bold ring-4 ring-emerald-500/40 scale-110 shadow-lg shadow-emerald-500/30';
            pointerLabel = 'TARGET';
          } else if (isPivot) {
            cellStyle = 'bg-gradient-to-tr from-cyan-600 to-cyan-500 text-white font-bold ring-2 ring-cyan-400/50 scale-105 shadow-md shadow-cyan-500/30';
            pointerLabel = 'MID / PROBE';
          } else if (isExamined) {
            cellStyle = 'bg-gradient-to-tr from-amber-500 to-amber-400 text-amber-950 font-bold ring-2 ring-amber-400/50 scale-105 shadow-md shadow-amber-400/30';
            pointerLabel = 'COMPARE';
          } else if (isInRange) {
            cellStyle = 'glass-card border-indigo-500/40 text-slate-900 dark:text-white shadow-xs';
          } else if (secondaryIndices.length === 2) {
            cellStyle = 'opacity-35 glass-card';
          }

          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Pointer indicator */}
              <div className="h-5 flex items-center justify-center mb-1 text-[9px] font-mono font-bold">
                {pointerLabel && (
                  <span className={`px-2 py-0.5 rounded-full ${
                    isTargetMatch ? 'bg-emerald-500 text-white' :
                    isPivot ? 'bg-cyan-500 text-white' :
                    'bg-amber-400 text-amber-950'
                  }`}>
                    {pointerLabel}
                  </span>
                )}
              </div>

              {/* Number Card */}
              <div
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-200 border ${cellStyle}`}
              >
                {value}
              </div>

              {/* Index label underneath */}
              <div className="mt-1.5 text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Interval Bounds footer */}
      {secondaryIndices.length === 2 && (
        <div className="mt-3 text-center text-xs text-slate-500 dark:text-zinc-400 font-mono">
          Search Interval: low = [{secondaryIndices[0]}], high = [{secondaryIndices[1]}]
        </div>
      )}
    </div>
  );
};
