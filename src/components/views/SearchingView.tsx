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
      
      {/* Algorithm Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin max-w-full">
        {searchAlgos.map(algo => {
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

      {/* Header Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">{currentMeta.name}</h2>
            {currentMeta.requiresSortedInput && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800">
                Requires Sorted Input
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            {currentMeta.fullDescription}
          </p>
        </div>

        {/* Complexities */}
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
