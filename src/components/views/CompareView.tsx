import React, { useState, useEffect } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';
import { executeAlgorithmTrace, TraceResult } from '../../engine/traceEngine';
import { 
  GitCompare, 
  Play, 
  Pause, 
  RotateCcw, 
  Shuffle
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const { data, setData, ascending } = useAlgoStore();

  const sortingAlgos = ALGORITHMS.filter(a => a.category === 'sorting');

  const [algoId1, setAlgoId1] = useState<string>('bubble-sort');
  const [algoId2, setAlgoId2] = useState<string>('merge-sort');
  const [algoId3, setAlgoId3] = useState<string>('quick-sort');

  const [trace1, setTrace1] = useState<TraceResult>(() => executeAlgorithmTrace(algoId1, data, { ascending }));
  const [trace2, setTrace2] = useState<TraceResult>(() => executeAlgorithmTrace(algoId2, data, { ascending }));
  const [trace3, setTrace3] = useState<TraceResult>(() => executeAlgorithmTrace(algoId3, data, { ascending }));

  const [step1, setStep1] = useState(0);
  const [step2, setStep2] = useState(0);
  const [step3, setStep3] = useState(0);

  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(300);

  // Recalculate on data change or algorithm selection change
  useEffect(() => {
    const t1 = executeAlgorithmTrace(algoId1, data, { ascending });
    const t2 = executeAlgorithmTrace(algoId2, data, { ascending });
    const t3 = executeAlgorithmTrace(algoId3, data, { ascending });
    setTrace1(t1);
    setTrace2(t2);
    setTrace3(t3);
    setStep1(0);
    setStep2(0);
    setStep3(0);
    setIsPlayingAll(false);
  }, [algoId1, algoId2, algoId3, data, ascending]);

  // Synchronized playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlayingAll) {
      const allDone = 
        step1 >= trace1.events.length - 1 &&
        step2 >= trace2.events.length - 1 &&
        step3 >= trace3.events.length - 1;

      if (allDone) {
        setIsPlayingAll(false);
        return;
      }

      timer = setTimeout(() => {
        setStep1(prev => Math.min(prev + 1, trace1.events.length - 1));
        setStep2(prev => Math.min(prev + 1, trace2.events.length - 1));
        setStep3(prev => Math.min(prev + 1, trace3.events.length - 1));
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlayingAll, step1, step2, step3, trace1, trace2, trace3, playbackSpeed]);

  const handleRestart = () => {
    setStep1(0);
    setStep2(0);
    setStep3(0);
    setIsPlayingAll(false);
  };

  const handleShuffleData = () => {
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setData(shuffled);
  };

  const currentMeta1 = ALGORITHMS.find(a => a.id === algoId1);
  const currentMeta2 = ALGORITHMS.find(a => a.id === algoId2);
  const currentMeta3 = ALGORITHMS.find(a => a.id === algoId3);

  const ev1 = trace1.events[step1] || trace1.events[0];
  const ev2 = trace2.events[step2] || trace2.events[0];
  const ev3 = trace3.events[step3] || trace3.events[0];

  const minDataVal = data.length > 0 ? Math.min(...data) : 0;
  const maxDataVal = data.length > 0 ? Math.max(...data) : 1;

  const calculateMiniBarHeight = (val: number): number => {
    if (minDataVal >= 0) {
      if (maxDataVal <= 0) return 30;
      return Math.max(3, Math.round((val / maxDataVal) * 92));
    } else {
      const range = maxDataVal - minDataVal;
      if (range === 0) return 50;
      return Math.max(3, Math.round(3 + ((val - minDataVal) / range) * 89));
    }
  };

  const renderMiniBars = (event: typeof ev1) => {
    if (!event) return null;
    const arr = event.arraySnapshot;
    const indices = event.indices || [];
    const sortedIndices = event.sortedIndices || [];

    return (
      <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-32 px-1 sm:px-2 py-3 bg-black/[0.03] dark:bg-black/30 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto max-w-full backdrop-blur-md">
        {arr.map((val, idx) => {
          const isComparing = event.type === 'COMPARE' && indices.includes(idx);
          const isSwapping = (event.type === 'SWAP' || event.type === 'OVERWRITE') && indices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const heightPercent = calculateMiniBarHeight(val);

          let bg = 'bg-slate-300 dark:bg-zinc-700';
          if (isSwapping) bg = 'bg-rose-500 shadow-xs shadow-rose-500/50';
          else if (isComparing) bg = 'bg-amber-400 shadow-xs shadow-amber-400/50';
          else if (isSorted) bg = 'bg-emerald-500 shadow-xs shadow-emerald-500/50';

          return (
            <div
              key={idx}
              style={{ height: `${heightPercent}%` }}
              className={`flex-1 min-w-[8px] rounded-t-xs transition-all duration-200 ${bg}`}
              title={`[${idx}]: ${val}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 text-xs">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <GitCompare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Side-by-Side Algorithm Comparison</h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Run up to three sorting algorithms simultaneously on the identical input dataset ({data.length} elements).
            Observe how different internal strategies yield distinct operation counts.
          </p>
        </div>

        {/* Global Playback Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="p-2.5 rounded-2xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
            title="Restart all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlayingAll(!isPlayingAll)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all shadow-md active:scale-95 ${
              isPlayingAll 
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-600/30'
            }`}
          >
            {isPlayingAll ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlayingAll ? 'Pause All' : 'Run Simultaneous'}</span>
          </button>
          <button
            onClick={handleShuffleData}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
            title="Shuffle input array"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Data</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Visualizers Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Slot 1 */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col gap-3 border border-white/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <select
              value={algoId1}
              onChange={(e) => setAlgoId1(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 font-semibold text-xs outline-none"
            >
              {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="font-mono text-slate-500 dark:text-zinc-400 text-[11px]">
              Step {step1 + 1}/{trace1.events.length}
            </span>
          </div>

          {renderMiniBars(ev1)}

          <div className="text-[11px] text-slate-600 dark:text-zinc-400 font-mono truncate">
            {ev1?.operationName || 'Ready'}
          </div>
        </div>

        {/* Slot 2 */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col gap-3 border border-white/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <select
              value={algoId2}
              onChange={(e) => setAlgoId2(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 font-semibold text-xs outline-none"
            >
              {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="font-mono text-slate-500 dark:text-zinc-400 text-[11px]">
              Step {step2 + 1}/{trace2.events.length}
            </span>
          </div>

          {renderMiniBars(ev2)}

          <div className="text-[11px] text-slate-600 dark:text-zinc-400 font-mono truncate">
            {ev2?.operationName || 'Ready'}
          </div>
        </div>

        {/* Slot 3 */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col gap-3 border border-white/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <select
              value={algoId3}
              onChange={(e) => setAlgoId3(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 font-semibold text-xs outline-none"
            >
              {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="font-mono text-slate-500 dark:text-zinc-400 text-[11px]">
              Step {step3 + 1}/{trace3.events.length}
            </span>
          </div>

          {renderMiniBars(ev3)}

          <div className="text-[11px] text-slate-600 dark:text-zinc-400 font-mono truncate">
            {ev3?.operationName || 'Ready'}
          </div>
        </div>

      </div>

      {/* Metrics Comparison Table Card */}
      <div className="glass-card rounded-3xl p-5 border border-white/80 dark:border-white/10 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Live Execution Metrics</h3>
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-slate-500 dark:text-zinc-400 text-[11px]">
              <th className="pb-2">Algorithm</th>
              <th className="pb-2">Comparisons</th>
              <th className="pb-2">Swaps / Writes</th>
              <th className="pb-2">Total Events</th>
              <th className="pb-2">Time Complexity</th>
              <th className="pb-2">Space Complexity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04] text-slate-700 dark:text-zinc-300">
            <tr>
              <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white">{currentMeta1?.name}</td>
              <td className="py-2.5 text-cyan-600 dark:text-cyan-400 font-semibold">{trace1.metrics.comparisons}</td>
              <td className="py-2.5 text-rose-600 dark:text-rose-400 font-semibold">{trace1.metrics.swaps}</td>
              <td className="py-2.5">{trace1.events.length}</td>
              <td className="py-2.5">{currentMeta1?.complexity.averageTime}</td>
              <td className="py-2.5">{currentMeta1?.complexity.spaceComplexity}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white">{currentMeta2?.name}</td>
              <td className="py-2.5 text-cyan-600 dark:text-cyan-400 font-semibold">{trace2.metrics.comparisons}</td>
              <td className="py-2.5 text-rose-600 dark:text-rose-400 font-semibold">{trace2.metrics.swaps}</td>
              <td className="py-2.5">{trace2.events.length}</td>
              <td className="py-2.5">{currentMeta2?.complexity.averageTime}</td>
              <td className="py-2.5">{currentMeta2?.complexity.spaceComplexity}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white">{currentMeta3?.name}</td>
              <td className="py-2.5 text-cyan-600 dark:text-cyan-400 font-semibold">{trace3.metrics.comparisons}</td>
              <td className="py-2.5 text-rose-600 dark:text-rose-400 font-semibold">{trace3.metrics.swaps}</td>
              <td className="py-2.5">{trace3.events.length}</td>
              <td className="py-2.5">{currentMeta3?.complexity.averageTime}</td>
              <td className="py-2.5">{currentMeta3?.complexity.spaceComplexity}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
