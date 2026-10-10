import React, { useState, useEffect } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';
import { executeAlgorithmTrace, TraceResult } from '../../engine/traceEngine';
import { 
  GitCompare, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Gauge, 
  Shuffle,
  ShieldCheck,
  TrendingDown
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
      <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-32 px-1 sm:px-2 py-3 bg-zinc-950 rounded-lg border border-zinc-800 overflow-x-auto max-w-full">
        {arr.map((val, idx) => {
          const isComparing = event.type === 'COMPARE' && indices.includes(idx);
          const isSwapping = (event.type === 'SWAP' || event.type === 'OVERWRITE') && indices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const heightPercent = calculateMiniBarHeight(val);

          let bg = 'bg-zinc-800';
          if (isSwapping) bg = 'bg-rose-500';
          else if (isComparing) bg = 'bg-amber-400';
          else if (isSorted) bg = 'bg-emerald-500';

          return (
            <div
              key={idx}
              style={{ height: `${heightPercent}%` }}
              className={`flex-1 min-w-[8px] rounded-t-xs transition-all ${bg}`}
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Side-by-Side Algorithm Comparison</h2>
          </div>
          <p className="text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Run up to three sorting algorithms simultaneously on the identical input dataset ({data.length} elements).
            Observe how different internal strategies yield distinct operation counts.
          </p>
        </div>

        {/* Global Playback Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            title="Restart all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlayingAll(!isPlayingAll)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-colors shadow-sm ${
              isPlayingAll ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-600 text-white hover:bg-cyan-500'
            }`}
          >
            {isPlayingAll ? <Pause className="w-4 h-4 fill-amber-300" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlayingAll ? 'Pause All' : 'Run Simultaneous'}</span>
          </button>
          <button
            onClick={handleShuffleData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60"
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <select
              value={algoId1}
              onChange={(e) => setAlgoId1(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-semibold outline-none focus:border-cyan-500"
            >
              {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="font-mono text-zinc-400 text-[11px]">
              Step {step1 + 1}/{trace1.events.length}
            </span>
          </div>

          {renderMiniBars(ev1)}

          <div className="text-[11px] text-zinc-400 font-mono truncate">
            {ev1?.operationName || 'Ready'}
          </div>
        </div>

        {/* Slot 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <select
              value={algoId2}
              onChange={(e) => setAlgoId2(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-semibold outline-none focus:border-cyan-500"
            >
              {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="font-mono text-zinc-400 text-[11px]">
              Step {step2 + 1}/{trace2.events.length}
            </span>
          </div>

          {renderMiniBars(ev2)}

          <div className="text-[11px] text-zinc-400 font-mono truncate">
            {ev2?.operationName || 'Ready'}
          </div>
        </div>

        {/* Slot 3 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <select
              value={algoId3}
              onChange={(e) => setAlgoId3(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-semibold outline-none focus:border-cyan-500"
            >
              {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="font-mono text-zinc-400 text-[11px]">
              Step {step3 + 1}/{trace3.events.length}
            </span>
          </div>

          {renderMiniBars(ev3)}

          <div className="text-[11px] text-zinc-400 font-mono truncate">
            {ev3?.operationName || 'Ready'}
          </div>
        </div>

      </div>

      {/* Comprehensive Metric Comparison Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 font-semibold text-zinc-200">
          Empirical & Theoretical Metrics Matrix
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
              <tr>
                <th className="p-3 font-medium">Metric</th>
                <th className="p-3 font-medium text-cyan-400">{currentMeta1?.name}</th>
                <th className="p-3 font-medium text-amber-400">{currentMeta2?.name}</th>
                <th className="p-3 font-medium text-emerald-400">{currentMeta3?.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr className="hover:bg-zinc-850">
                <td className="p-3 font-sans text-zinc-400">Total Steps Recorded</td>
                <td className="p-3 font-bold">{trace1.events.length}</td>
                <td className="p-3 font-bold">{trace2.events.length}</td>
                <td className="p-3 font-bold">{trace3.events.length}</td>
              </tr>
              <tr className="hover:bg-zinc-850">
                <td className="p-3 font-sans text-zinc-400">Element Comparisons</td>
                <td className="p-3 font-bold text-amber-300">{trace1.metrics.comparisons}</td>
                <td className="p-3 font-bold text-amber-300">{trace2.metrics.comparisons}</td>
                <td className="p-3 font-bold text-amber-300">{trace3.metrics.comparisons}</td>
              </tr>
              <tr className="hover:bg-zinc-850">
                <td className="p-3 font-sans text-zinc-400">Swaps / Shifts</td>
                <td className="p-3 font-bold text-rose-300">{trace1.metrics.swaps}</td>
                <td className="p-3 font-bold text-rose-300">{trace2.metrics.swaps}</td>
                <td className="p-3 font-bold text-rose-300">{trace3.metrics.swaps}</td>
              </tr>
              <tr className="hover:bg-zinc-850">
                <td className="p-3 font-sans text-zinc-400">Array Writes</td>
                <td className="p-3 font-bold text-cyan-300">{trace1.metrics.writes}</td>
                <td className="p-3 font-bold text-cyan-300">{trace2.metrics.writes}</td>
                <td className="p-3 font-bold text-cyan-300">{trace3.metrics.writes}</td>
              </tr>
              <tr className="hover:bg-zinc-850">
                <td className="p-3 font-sans text-zinc-400">Element Accesses</td>
                <td className="p-3 font-bold">{trace1.metrics.accesses}</td>
                <td className="p-3 font-bold">{trace2.metrics.accesses}</td>
                <td className="p-3 font-bold">{trace3.metrics.accesses}</td>
              </tr>
              <tr className="hover:bg-zinc-850">
                <td className="p-3 font-sans text-zinc-400">Measured Trace Time</td>
                <td className="p-3 text-emerald-400">{trace1.metrics.executionTimeMs} ms</td>
                <td className="p-3 text-emerald-400">{trace2.metrics.executionTimeMs} ms</td>
                <td className="p-3 text-emerald-400">{trace3.metrics.executionTimeMs} ms</td>
              </tr>
              <tr className="hover:bg-zinc-850 bg-zinc-950/40">
                <td className="p-3 font-sans text-zinc-400">Time Complexity (Best / Avg / Worst)</td>
                <td className="p-3 text-zinc-400">{currentMeta1?.complexity.bestTime} / {currentMeta1?.complexity.averageTime} / {currentMeta1?.complexity.worstTime}</td>
                <td className="p-3 text-zinc-400">{currentMeta2?.complexity.bestTime} / {currentMeta2?.complexity.averageTime} / {currentMeta2?.complexity.worstTime}</td>
                <td className="p-3 text-zinc-400">{currentMeta3?.complexity.bestTime} / {currentMeta3?.complexity.averageTime} / {currentMeta3?.complexity.worstTime}</td>
              </tr>
              <tr className="hover:bg-zinc-850 bg-zinc-950/40">
                <td className="p-3 font-sans text-zinc-400">Auxiliary Space Complexity</td>
                <td className="p-3 text-amber-400">{currentMeta1?.complexity.spaceComplexity}</td>
                <td className="p-3 text-amber-400">{currentMeta2?.complexity.spaceComplexity}</td>
                <td className="p-3 text-amber-400">{currentMeta3?.complexity.spaceComplexity}</td>
              </tr>
              <tr className="hover:bg-zinc-850 bg-zinc-950/40">
                <td className="p-3 font-sans text-zinc-400">Stability & In-Place</td>
                <td className="p-3">{currentMeta1?.complexity.stability} / {currentMeta1?.complexity.inPlace ? 'In-Place' : 'Out-of-Place'}</td>
                <td className="p-3">{currentMeta2?.complexity.stability} / {currentMeta2?.complexity.inPlace ? 'In-Place' : 'Out-of-Place'}</td>
                <td className="p-3">{currentMeta3?.complexity.stability} / {currentMeta3?.complexity.inPlace ? 'In-Place' : 'Out-of-Place'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
