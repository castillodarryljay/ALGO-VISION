import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';
import { CustomInputBar } from '../controls/CustomInputBar';
import { PlaybackControls } from '../controls/PlaybackControls';
import { SortingVisualizer } from '../visualizers/SortingVisualizer';
import { MergeSortTreeVisualizer } from '../visualizers/MergeSortTreeVisualizer';
import { CurrentStepInspector } from '../inspector/CurrentStepInspector';
import { ExecutionConsole } from '../inspector/ExecutionConsole';
import { CodePanel } from '../codePanel/CodePanel';
import { ArrowUpDown, Info, ShieldCheck, Zap } from 'lucide-react';

export const SortingView: React.FC = () => {
  const { selectedAlgorithmId, selectAlgorithm } = useAlgoStore();

  const sortingAlgos = ALGORITHMS.filter(a => a.category === 'sorting');
  const currentMeta = ALGORITHMS.find(a => a.id === selectedAlgorithmId) || sortingAlgos[0];

  const isMergeSort = selectedAlgorithmId === 'merge-sort';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Algorithm Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin max-w-full">
        {sortingAlgos.map(algo => {
          const isSelected = selectedAlgorithmId === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => selectAlgorithm(algo.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 ring-1 ring-cyan-400'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {algo.name}
            </button>
          );
        })}
      </div>

      {/* Algorithm Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">{currentMeta.name}</h2>
            {currentMeta.complexity.stability && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                currentMeta.complexity.stability === 'Stable' 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
                  : 'bg-amber-950/80 text-amber-300 border-amber-800'
              }`}>
                {currentMeta.complexity.stability}
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              {currentMeta.complexity.inPlace ? 'In-Place' : 'Out-of-Place'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            {currentMeta.fullDescription}
          </p>
        </div>

        {/* Complexity Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] shrink-0">
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500">Best:</span> <span className="text-emerald-400">{currentMeta.complexity.bestTime}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500">Avg:</span> <span className="text-cyan-400">{currentMeta.complexity.averageTime}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500">Worst:</span> <span className="text-rose-400">{currentMeta.complexity.worstTime}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500">Space:</span> <span className="text-amber-400">{currentMeta.complexity.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Custom Input Bar */}
      <CustomInputBar />

      {/* Main Visualization Stage */}
      {isMergeSort ? <MergeSortTreeVisualizer /> : <SortingVisualizer />}

      {/* Playback Controls */}
      <PlaybackControls />

      {/* Current Step Inspector */}
      <CurrentStepInspector />

      {/* Bottom Grid: Execution Console & Synchronized Multi-Language Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExecutionConsole />
        <CodePanel />
      </div>

    </div>
  );
};
