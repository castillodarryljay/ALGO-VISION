import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { 
  Info, 
  GitFork, 
  Activity, 
  HelpCircle,
  Cpu
} from 'lucide-react';

export const CurrentStepInspector: React.FC = () => {
  const { 
    traceResult, 
    currentStepIndex, 
    explanationMode, 
    setExplanationMode 
  } = useAlgoStore();

  const currentEvent = traceResult.events[currentStepIndex];

  if (!currentEvent) {
    return (
      <div className="glass-card rounded-3xl p-5 text-xs text-slate-500 dark:text-zinc-500 border border-white/80 dark:border-white/10">
        No active trace event to inspect.
      </div>
    );
  }

  const isBeginner = explanationMode === 'beginner';
  const explanationText = isBeginner ? currentEvent.beginnerExplanation : currentEvent.technicalExplanation;

  return (
    <div className="glass-card rounded-3xl p-5 shadow-sm text-xs flex flex-col gap-3.5 border border-white/80 dark:border-white/10">
      {/* Header & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="font-semibold text-slate-900 dark:text-zinc-200">Current Step Inspector</span>
          <span className="px-2.5 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.06] text-slate-600 dark:text-zinc-400 font-mono text-[11px] border border-black/[0.04] dark:border-white/10">
            Step #{currentStepIndex + 1}
          </span>
        </div>

        {/* Beginner vs Technical Toggle - Apple iOS Segmented Control */}
        <div className="flex items-center bg-black/[0.03] dark:bg-white/[0.06] p-1 rounded-2xl border border-black/[0.05] dark:border-white/10">
          <button
            onClick={() => setExplanationMode('beginner')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
              isBeginner 
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>Beginner</span>
          </button>
          <button
            onClick={() => setExplanationMode('technical')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
              !isBeginner 
                ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Technical</span>
          </button>
        </div>
      </div>

      {/* Operation Title Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Operation:</span>
        <span className="px-3 py-1 rounded-full font-mono font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 backdrop-blur-md">
          {currentEvent.operationName}
        </span>
        {currentEvent.recursionDepth !== undefined && (
          <span className="ml-auto px-2.5 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.06] text-slate-600 dark:text-zinc-400 font-mono text-[11px] flex items-center gap-1 border border-black/[0.04] dark:border-white/10">
            <GitFork className="w-3 h-3 text-cyan-500" />
            Depth: {currentEvent.recursionDepth}
          </span>
        )}
      </div>

      {/* Narrative Explanation Box */}
      <div className="bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.07] rounded-2xl p-4 text-slate-800 dark:text-zinc-200 leading-relaxed text-[12px] backdrop-blur-sm">
        {explanationText}
      </div>

      {/* Inspected Parameters & Active Variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Indices & Values */}
        <div className="bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] space-y-1 font-mono text-[11px]">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-sans flex items-center gap-1 mb-1">
            <Info className="w-3 h-3 text-cyan-500" /> Target Elements
          </div>
          <div className="flex justify-between text-slate-700 dark:text-zinc-300">
            <span className="text-slate-500 dark:text-zinc-500 font-sans">Indices:</span>
            <span>{currentEvent.indices ? `[${currentEvent.indices.join(', ')}]` : 'None'}</span>
          </div>
          {currentEvent.pivotIndex !== undefined && (
            <div className="flex justify-between text-cyan-700 dark:text-cyan-300">
              <span className="text-slate-500 dark:text-zinc-500 font-sans">Pivot Index:</span>
              <span className="font-bold">{currentEvent.pivotIndex}</span>
            </div>
          )}
          {currentEvent.secondaryIndices && (
            <div className="flex justify-between text-slate-700 dark:text-zinc-300">
              <span className="text-slate-500 dark:text-zinc-500 font-sans">Subarray Window:</span>
              <span>[{currentEvent.secondaryIndices.join('..')}]</span>
            </div>
          )}
        </div>

        {/* Local Variables Snapshot */}
        <div className="bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] space-y-1 font-mono text-[11px]">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-sans flex items-center gap-1 mb-1">
            <Cpu className="w-3 h-3 text-cyan-500" /> State Variables
          </div>
          {currentEvent.variables && Object.keys(currentEvent.variables).length > 0 ? (
            Object.entries(currentEvent.variables).map(([k, v]) => (
              <div key={k} className="flex justify-between text-slate-700 dark:text-zinc-300">
                <span className="text-slate-500 dark:text-zinc-500 font-sans">{k}:</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">{String(v)}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 dark:text-zinc-500 italic font-sans text-[11px]">No local registers active</div>
          )}
        </div>
      </div>
    </div>
  );
};
