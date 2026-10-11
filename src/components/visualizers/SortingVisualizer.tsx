import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ArrowLeftRight, Check, Target, Eye } from 'lucide-react';

export const SortingVisualizer: React.FC = () => {
  const { traceResult, currentStepIndex, reducedMotion } = useAlgoStore();
  const currentEvent = traceResult.events[currentStepIndex];

  if (!currentEvent) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 dark:text-zinc-500 font-mono text-sm glass-panel rounded-3xl border border-white/80 dark:border-white/10">
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
      const proportional = (value / maxVal) * 90;
      return Math.max(4, Math.round(proportional));
    } else {
      const range = maxVal - minVal;
      if (range === 0) return 50;
      return Math.max(4, Math.round(4 + ((value - minVal) / range) * 86));
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-sm relative flex flex-col justify-between min-h-[380px] overflow-hidden border border-white/80 dark:border-white/10">
      
      {/* Legend & Active status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-zinc-300">Operation:</span>
          <span className="px-3 py-1 rounded-full font-mono bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-medium backdrop-blur-md">
            {currentEvent.operationName}
          </span>
        </div>

        {/* Legend with Apple iOS glass capsules */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs"></span>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs"></span>
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-xs"></span>
            <span>Pivot / Key</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs"></span>
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/* Bars Canvas Container */}
      <div className="flex-1 flex items-end justify-center gap-1 sm:gap-2 px-1 sm:px-3 py-6 h-60 min-h-[240px] overflow-x-auto max-w-full">
        {array.map((value, idx) => {
          const isComparing = currentEvent.type === 'COMPARE' && indices.includes(idx);
          const isSwapping = (currentEvent.type === 'SWAP' || currentEvent.type === 'OVERWRITE') && indices.includes(idx);
          const isPivot = pivotIndex === idx;
          const isSorted = sortedIndices.includes(idx);
          const isInSecondaryRange = secondaryIndices.length === 2 && idx >= secondaryIndices[0] && idx <= secondaryIndices[1];

          // Accurate bar height directly proportional to value
          const heightPercent = calculateBarHeight(value);

          // Determine bar styling & status icon
          let barBg = 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-800 dark:text-white shadow-2xs';
          let statusBadge = null;

          if (isSwapping) {
            barBg = 'bg-gradient-to-t from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400/50 scale-[1.02]';
            statusBadge = <ArrowLeftRight className="w-3 h-3 text-white animate-pulse" />;
          } else if (isComparing) {
            barBg = 'bg-gradient-to-t from-amber-500 to-amber-400 text-amber-950 shadow-lg shadow-amber-400/30 ring-2 ring-amber-400/50 scale-[1.02] font-bold';
            statusBadge = <Eye className="w-3 h-3 text-amber-950" />;
          } else if (isPivot) {
            barBg = 'bg-gradient-to-t from-cyan-600 to-cyan-400 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50 scale-[1.02] font-bold';
            statusBadge = <Target className="w-3 h-3 text-white" />;
          } else if (isSorted) {
            barBg = 'bg-gradient-to-t from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20';
            statusBadge = <Check className="w-3 h-3 text-white" />;
          } else if (isInSecondaryRange) {
            barBg = 'bg-gradient-to-t from-indigo-500/70 to-indigo-400/70 text-white shadow-xs';
          }

          return (
            <div
              key={idx}
              className="flex-1 min-w-[14px] max-w-[52px] flex flex-col items-center justify-end h-full group"
            >
              {/* Value indicator on top */}
              <div className="mb-1.5 flex flex-col items-center">
                {statusBadge && <div className="mb-0.5">{statusBadge}</div>}
                <span className={`text-[10px] sm:text-xs font-mono font-semibold transition-all ${
                  isComparing ? 'text-amber-600 dark:text-amber-300 scale-110 font-bold' :
                  isSwapping ? 'text-rose-600 dark:text-rose-300 scale-110 font-bold' :
                  isPivot ? 'text-cyan-600 dark:text-cyan-300 scale-110 font-bold' :
                  isSorted ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-600 dark:text-zinc-400'
                }`}>
                  {value}
                </span>
              </div>

              {/* Bar Element with Apple Liquid Glass rounded pill-top */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-xl flex items-center justify-center transition-all ${
                  reducedMotion ? 'duration-0' : 'duration-300'
                } ${barBg}`}
              >
                {/* Embedded value for taller bars on desktop */}
                {heightPercent > 32 && (
                  <span className="text-[10px] font-mono font-bold select-none hidden sm:inline opacity-90">
                    {value}
                  </span>
                )}
              </div>

              {/* Index label underneath */}
              <div className="mt-1.5 text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-zinc-500 select-none">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Subarray Range Bounds indicator if present */}
      {secondaryIndices.length === 2 && (
        <div className="mt-2 text-center text-xs text-slate-500 dark:text-zinc-400 font-mono">
          Active Subarray Window: [{secondaryIndices[0]}..{secondaryIndices[1]}]
        </div>
      )}
    </div>
  );
};
