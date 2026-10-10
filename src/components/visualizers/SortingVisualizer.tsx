import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ArrowLeftRight, Check, Target, Eye } from 'lucide-react';

export const SortingVisualizer: React.FC = () => {
  const { traceResult, currentStepIndex, reducedMotion } = useAlgoStore();
  const currentEvent = traceResult.events[currentStepIndex];

  if (!currentEvent) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 font-mono text-sm bg-zinc-950 rounded-xl border border-zinc-800">
        No trace events available. Apply input or select an algorithm.
      </div>
    );
  }

  const array = currentEvent.arraySnapshot;
  const indices = currentEvent.indices || [];
  const secondaryIndices = currentEvent.secondaryIndices || [];
  const sortedIndices = currentEvent.sortedIndices || [];
  const pivotIndex = currentEvent.pivotIndex;

  // Min and max value calculation for accurate proportional bar height
  const minVal = array.length > 0 ? Math.min(...array) : 0;
  const maxVal = array.length > 0 ? Math.max(...array) : 1;

  const calculateBarHeight = (value: number): number => {
    if (minVal >= 0) {
      if (maxVal <= 0) return 30;
      // Proportional to value relative to maximum value
      const proportional = (value / maxVal) * 90;
      return Math.max(3, Math.round(proportional));
    } else {
      // Linear scaling across range for negative numbers
      const range = maxVal - minVal;
      if (range === 0) return 50;
      return Math.max(3, Math.round(3 + ((value - minVal) / range) * 87));
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-inner relative flex flex-col justify-between min-h-[360px] overflow-hidden">
      
      {/* Legend & Active status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/80 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-300">Operation:</span>
          <span className="px-2 py-0.5 rounded-md font-mono bg-zinc-800 text-cyan-300 border border-zinc-700/60">
            {currentEvent.operationName}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400"></span>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>
            <span>Swapping / Shift</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400"></span>
            <span>Pivot / Key</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/* Bars Canvas Container */}
      <div className="flex-1 flex items-end justify-center gap-0.5 sm:gap-2 px-1 sm:px-2 py-4 h-56 min-h-[220px] overflow-x-auto max-w-full">
        {array.map((value, idx) => {
          const isComparing = currentEvent.type === 'COMPARE' && indices.includes(idx);
          const isSwapping = (currentEvent.type === 'SWAP' || currentEvent.type === 'OVERWRITE') && indices.includes(idx);
          const isPivot = pivotIndex === idx;
          const isSorted = sortedIndices.includes(idx);
          const isInSecondaryRange = secondaryIndices.length === 2 && idx >= secondaryIndices[0] && idx <= secondaryIndices[1];

          // Accurate bar height directly proportional to value
          const heightPercent = calculateBarHeight(value);

          // Determine bar styling & status icon
          let barBg = 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border-zinc-700';
          let statusBadge = null;

          if (isSwapping) {
            barBg = 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-950/50 ring-2 ring-rose-400/40';
            statusBadge = <ArrowLeftRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white animate-pulse" />;
          } else if (isComparing) {
            barBg = 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-950/50 ring-2 ring-amber-400/40 font-bold';
            statusBadge = <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-950" />;
          } else if (isPivot) {
            barBg = 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-md shadow-cyan-950/50 ring-2 ring-cyan-400/40 font-bold';
            statusBadge = <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-950" />;
          } else if (isSorted) {
            barBg = 'bg-emerald-500/80 text-white border-emerald-400/60 shadow-xs shadow-emerald-950/30';
            statusBadge = <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />;
          } else if (isInSecondaryRange) {
            barBg = 'bg-zinc-700 text-zinc-200 border-zinc-600';
          }

          return (
            <div
              key={idx}
              className="flex-1 min-w-[12px] max-w-[48px] flex flex-col items-center justify-end h-full group"
            >
              {/* Value indicator on top */}
              <div className="mb-1 flex flex-col items-center">
                {statusBadge && <div className="mb-0.5">{statusBadge}</div>}
                <span className={`text-[9px] sm:text-xs font-mono font-semibold transition-colors ${
                  isComparing ? 'text-amber-400 scale-110' :
                  isSwapping ? 'text-rose-400 scale-110' :
                  isPivot ? 'text-cyan-400 scale-110' :
                  isSorted ? 'text-emerald-400' : 'text-zinc-400'
                }`}>
                  {value}
                </span>
              </div>

              {/* Bar Element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-md border-t border-x flex items-center justify-center transition-all ${
                  reducedMotion ? 'duration-0' : 'duration-300'
                } ${barBg}`}
              >
                {/* Embedded value for taller bars on desktop */}
                {heightPercent > 35 && (
                  <span className="text-[9px] font-mono opacity-80 select-none hidden sm:inline">
                    {value}
                  </span>
                )}
              </div>

              {/* Index label underneath */}
              <div className="mt-1 text-[9px] sm:text-[11px] font-mono text-zinc-500 select-none">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Subarray Range Bounds indicator if present */}
      {secondaryIndices.length === 2 && (
        <div className="mt-2 text-center text-xs text-zinc-400 font-mono">
          Active Subarray Window: [{secondaryIndices[0]}..{secondaryIndices[1]}]
        </div>
      )}
    </div>
  );
};
