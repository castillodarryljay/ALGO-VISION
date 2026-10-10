import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { 
  Info, 
  Code, 
  Terminal, 
  Variable, 
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-500">
        No active trace event to inspect.
      </div>
    );
  }

  const isBeginner = explanationMode === 'beginner';
  const explanationText = isBeginner ? currentEvent.beginnerExplanation : currentEvent.technicalExplanation;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm text-xs flex flex-col gap-3">
      {/* Header & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-zinc-200">Current Step Inspector</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[11px]">
            Step #{currentStepIndex + 1}
          </span>
        </div>

        {/* Beginner vs Technical Toggle */}
        <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setExplanationMode('beginner')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              isBeginner ? 'bg-cyan-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>Beginner</span>
          </button>
          <button
            onClick={() => setExplanationMode('technical')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              !isBeginner ? 'bg-cyan-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Technical</span>
          </button>
        </div>
      </div>

      {/* Operation Title Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-400">Operation:</span>
        <span className="px-2.5 py-1 rounded-md font-mono font-medium bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">
          {currentEvent.operationName}
        </span>
        {currentEvent.recursionDepth !== undefined && (
          <span className="ml-auto px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[11px] flex items-center gap-1">
            <GitFork className="w-3 h-3 text-cyan-400" />
            Depth: {currentEvent.recursionDepth}
          </span>
        )}
      </div>

      {/* Narrative Explanation Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 leading-relaxed text-[12px]">
        {explanationText}
      </div>

      {/* Inspected Parameters & Active Variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Indices & Values */}
        <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80 space-y-1 font-mono text-[11px]">
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-sans flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-400" /> Target Elements
          </div>
          <div className="flex justify-between text-zinc-300">
            <span className="text-zinc-400">Indices:</span>
            <span>{currentEvent.indices ? `[${currentEvent.indices.join(', ')}]` : 'None'}</span>
          </div>
          {currentEvent.pivotIndex !== undefined && (
            <div className="flex justify-between text-zinc-300">
              <span className="text-cyan-400">Pivot Index:</span>
              <span className="text-cyan-300 font-bold">{currentEvent.pivotIndex}</span>
            </div>
          )}
          {currentEvent.values && (
            <div className="flex justify-between text-zinc-300">
              <span className="text-zinc-400">Values:</span>
              <span>{currentEvent.values.join(', ')}</span>
            </div>
          )}
        </div>

        {/* State Variables Watcher */}
        <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80 space-y-1 font-mono text-[11px] max-h-28 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-sans flex items-center gap-1">
            <Variable className="w-3 h-3 text-cyan-400" /> Variable Watcher
          </div>
          {Object.entries(currentEvent.variables).map(([k, v]) => (
            <div key={k} className="flex justify-between text-zinc-300">
              <span className="text-zinc-400">{k}:</span>
              <span className="text-cyan-300 font-semibold">{Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
