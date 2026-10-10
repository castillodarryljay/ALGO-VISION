import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { isArraySortedAscending } from '../../engine/searching/searchingAlgorithms';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowDown, 
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
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-inner flex flex-col justify-between min-h-[360px]">
      
      {/* Top Banner & Warnings */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-300">Searching For Target:</span>
          <span className="px-2.5 py-1 rounded-md font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            {searchTarget}
          </span>
        </div>

        {/* Status result */}
        {isFound && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-semibold text-xs animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Target Found at index {indices[0]}!
          </div>
        )}

        {isNotFound && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-950/80 border border-rose-600 text-rose-300 font-semibold text-xs">
            <XCircle className="w-4 h-4 text-rose-400" />
            Target Absent from Array
          </div>
        )}
      </div>

      {/* Sorted Prerequisite Warning if unsorted */}
      {!isSorted && (
        <div className="flex items-center justify-between gap-3 p-3 mb-4 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Notice: Input array is not sorted. Binary, Jump, and Interpolation search require sorted input to guarantee correctness.</span>
          </div>
          <button
            onClick={handleSortCopy}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shrink-0 shadow-xs"
          >
            Sort Array Now
          </button>
        </div>
      )}

      {/* Array Elements Visualizer */}
      <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-6">
        {array.map((value, idx) => {
          const isExamined = indices.includes(idx);
          const isPivot = pivotIndex === idx;
          const isInRange = secondaryIndices.length === 2 && idx >= secondaryIndices[0] && idx <= secondaryIndices[1];
          const isTargetMatch = isFound && indices.includes(idx);

          let cellStyle = 'bg-zinc-900 border-zinc-800 text-zinc-300';
          let pointerLabel = null;

          if (isTargetMatch) {
            cellStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold ring-4 ring-emerald-500/40 scale-110';
            pointerLabel = 'TARGET';
          } else if (isPivot) {
            cellStyle = 'bg-cyan-600 border-cyan-400 text-white font-bold ring-2 ring-cyan-400/40 scale-105';
            pointerLabel = 'MID / PROBE';
          } else if (isExamined) {
            cellStyle = 'bg-amber-500 border-amber-400 text-zinc-950 font-bold ring-2 ring-amber-400/40 scale-105';
            pointerLabel = 'COMPARE';
          } else if (isInRange) {
            cellStyle = 'bg-zinc-800 border-zinc-700 text-zinc-200';
          } else if (secondaryIndices.length === 2) {
            cellStyle = 'bg-zinc-950/60 border-zinc-900 text-zinc-600 opacity-40';
          }

          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Pointer indicator */}
              <div className="h-6 flex flex-col items-center justify-end">
                {pointerLabel && (
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
                      {pointerLabel}
                    </span>
                    <ArrowDown className="w-3 h-3 text-cyan-400" />
                  </div>
                )}
              </div>

              {/* Box Element */}
              <div
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${cellStyle}`}
              >
                <span className="text-sm sm:text-base font-mono font-semibold">
                  {value}
                </span>
              </div>

              {/* Index label underneath */}
              <span className="mt-1 text-[11px] font-mono text-zinc-500">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Search Window Range Info */}
      {secondaryIndices.length === 2 && (
        <div className="mt-4 text-center text-xs text-zinc-400 font-mono">
          Current Search Window: Low = {secondaryIndices[0]}, High = {secondaryIndices[1]}
        </div>
      )}
    </div>
  );
};
