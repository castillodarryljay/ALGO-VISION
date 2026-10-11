import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';
import { CustomInputBar } from '../controls/CustomInputBar';
import { PlaybackControls } from '../controls/PlaybackControls';
import { SearchingVisualizer } from '../visualizers/SearchingVisualizer';
import { CurrentStepInspector } from '../inspector/CurrentStepInspector';
import { ExecutionConsole } from '../inspector/ExecutionConsole';
import { CodePanel } from '../codePanel/CodePanel';

export const SearchingView: React.FC = () => {
  const { selectedAlgorithmId, selectAlgorithm } = useAlgoStore();

  const searchAlgos = ALGORITHMS.filter(a => a.category === 'searching');
  const currentMeta = ALGORITHMS.find(a => a.id === selectedAlgorithmId) || searchAlgos[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Algorithm Tabs - Apple iOS Segmented Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin max-w-full">
        {searchAlgos.map(algo => {
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

      {/* Header Info Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{currentMeta.name}</h2>
            {currentMeta.requiresSortedInput && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 backdrop-blur-md">
                Requires Sorted Input
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            {currentMeta.fullDescription}
          </p>
        </div>

        {/* Complexities */}
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
        </div>
      </div>

      {/* Input bar */}
      <CustomInputBar />

      {/* Search Visualizer */}
      <SearchingVisualizer />

      {/* Controls */}
      <PlaybackControls />

      {/* Inspector */}
      <CurrentStepInspector />

      {/* Console & Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExecutionConsole />
        <CodePanel />
      </div>

    </div>
  );
};
