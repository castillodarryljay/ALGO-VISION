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

export const SortingView: React.FC = () => {
  const { selectedAlgorithmId, selectAlgorithm } = useAlgoStore();

  const sortingAlgos = ALGORITHMS.filter(a => a.category === 'sorting');
  const currentMeta = ALGORITHMS.find(a => a.id === selectedAlgorithmId) || sortingAlgos[0];

  const isMergeSort = selectedAlgorithmId === 'merge-sort';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Algorithm Tabs Strip - Apple iOS Segmented Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin max-w-full">
        {sortingAlgos.map(algo => {
          const isSelected = selectedAlgorithmId === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => selectAlgorithm(algo.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 border border-white/20'
                  : 'glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-white/10'
              }`}
            >
              {algo.name}
            </button>
          );
        })}
      </div>

      {/* Algorithm Header Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{currentMeta.name}</h2>
            {currentMeta.complexity.stability && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border backdrop-blur-md ${
                currentMeta.complexity.stability === 'Stable' 
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
              }`}>
                {currentMeta.complexity.stability}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300 border border-black/[0.06] dark:border-white/10 backdrop-blur-md">
              {currentMeta.complexity.inPlace ? 'In-Place' : 'Out-of-Place'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            {currentMeta.fullDescription}
          </p>
        </div>

        {/* Complexity Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] shrink-0">
          <div className="px-3 py-1.5 rounded-xl glass-subtle text-slate-700 dark:text-zinc-300">
            <span className="text-slate-500 dark:text-zinc-500">Best:</span> <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentMeta.complexity.bestTime}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl glass-subtle text-slate-700 dark:text-zinc-300">
            <span className="text-slate-500 dark:text-zinc-500">Avg:</span> <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{currentMeta.complexity.averageTime}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl glass-subtle text-slate-700 dark:text-zinc-300">
            <span className="text-slate-500 dark:text-zinc-500">Worst:</span> <span className="text-rose-600 dark:text-rose-400 font-semibold">{currentMeta.complexity.worstTime}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl glass-subtle text-slate-700 dark:text-zinc-300">
            <span className="text-slate-500 dark:text-zinc-500">Space:</span> <span className="text-indigo-600 dark:text-purple-400 font-semibold">{currentMeta.complexity.spaceComplexity}</span>
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
