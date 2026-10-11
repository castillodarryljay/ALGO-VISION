import React, { useState } from 'react';
import { 
  Sparkles, 
  Shuffle, 
  RotateCw, 
  Copy, 
  Check, 
  AlertCircle, 
  SlidersHorizontal,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Search
} from 'lucide-react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';

export const CustomInputBar: React.FC = () => {
  const { 
    data, 
    setData, 
    selectedAlgorithmId, 
    ascending, 
    setAscending,
    searchTarget,
    setSearchTarget
  } = useAlgoStore();

  const [rawText, setRawText] = useState(data.join(', '));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputSize, setInputSize] = useState<number>(12);

  const currentAlgo = ALGORITHMS.find(a => a.id === selectedAlgorithmId);
  const isSearching = currentAlgo?.category === 'searching';

  // Parser supporting commas, spaces, newlines, negatives, zeros
  const handleApplyInput = () => {
    setErrorMessage(null);
    if (!rawText.trim()) {
      setErrorMessage('Input cannot be empty. Please enter integers.');
      return;
    }

    const tokens = rawText.split(/[\s,]+/).filter(t => t.trim().length > 0);
    const parsed: number[] = [];

    for (const token of tokens) {
      const num = Number(token);
      if (isNaN(num) || !Number.isInteger(num)) {
        setErrorMessage(`Invalid input token "${token}". Only valid integers are permitted.`);
        return;
      }
      if (Math.abs(num) > 9999) {
        setErrorMessage(`Number ${num} is too large. Please keep values between -9999 and 9999.`);
        return;
      }
      parsed.push(num);
    }

    if (parsed.length === 0) {
      setErrorMessage('No valid numbers found in input.');
      return;
    }

    if (parsed.length > 50) {
      setErrorMessage('Maximum of 50 items allowed for clean visualization.');
      return;
    }

    setData(parsed);
  };

  // Preset generators
  const generateRandom = (size: number = inputSize) => {
    setErrorMessage(null);
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 95) + 5);
    }
    setRawText(arr.join(', '));
    setData(arr);
  };

  const generateNearlySorted = (size: number = inputSize) => {
    setErrorMessage(null);
    const arr = Array.from({ length: size }, (_, i) => (i + 1) * 7);
    if (size > 3) {
      const idx1 = Math.floor(Math.random() * (size - 1));
      const idx2 = idx1 + 1;
      [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }
    setRawText(arr.join(', '));
    setData(arr);
  };

  const generateReversed = (size: number = inputSize) => {
    setErrorMessage(null);
    const arr = Array.from({ length: size }, (_, i) => (size - i) * 8);
    setRawText(arr.join(', '));
    setData(arr);
  };

  const generateFewUnique = (size: number = inputSize) => {
    setErrorMessage(null);
    const uniques = [12, 38, 75, 90];
    const arr = Array.from({ length: size }, () => uniques[Math.floor(Math.random() * uniques.length)]);
    setRawText(arr.join(', '));
    setData(arr);
  };

  const generateWithNegatives = (size: number = inputSize) => {
    setErrorMessage(null);
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 120) - 50);
    }
    setRawText(arr.join(', '));
    setData(arr);
  };

  const generateWithDuplicates = (size: number = inputSize) => {
    setErrorMessage(null);
    const samples = [12, 45, 23, 88, 12, 45, 23, 7];
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(samples[i % samples.length]);
    }
    setRawText(arr.join(', '));
    setData(arr);
  };

  const handleSortCopy = () => {
    setErrorMessage(null);
    const sorted = [...data].sort((a, b) => a - b);
    setRawText(sorted.join(', '));
    setData(sorted);
  };

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 mb-4 text-xs border border-white/80 dark:border-white/10 shadow-sm">
      {/* Top Header with algorithm domain note */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="font-semibold text-slate-900 dark:text-zinc-200">Dataset & Input Controls</span>
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">({data.length} elements)</span>
        </div>

        {/* Ascending / Descending order - Apple iOS Segmented Control */}
        {!isSearching && (
          <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.06] p-1 rounded-2xl border border-black/[0.05] dark:border-white/10">
            <button
              onClick={() => setAscending(true)}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                ascending 
                  ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpNarrowWide className="w-3.5 h-3.5" />
              <span>Ascending</span>
            </button>
            <button
              onClick={() => setAscending(false)}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                !ascending 
                  ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownWideNarrow className="w-3.5 h-3.5" />
              <span>Descending</span>
            </button>
          </div>
        )}

        {/* Target search value */}
        {isSearching && (
          <div className="flex items-center gap-2 bg-black/[0.03] dark:bg-white/[0.06] px-3 py-1.5 rounded-2xl border border-black/[0.05] dark:border-white/10">
            <Search className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Target:</span>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(parseInt(e.target.value, 10) || 0)}
              className="w-16 glass-input rounded-xl px-2 py-0.5 text-slate-900 dark:text-white font-mono text-center outline-none"
            />
          </div>
        )}
      </div>

      {/* Input box & Apply button */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyInput();
            }}
            placeholder="Enter numbers (e.g. 45, 12, -8, 0, 89, 39, 44)"
            className="w-full glass-input rounded-2xl px-4 py-2.5 font-mono text-xs placeholder-slate-400 dark:placeholder-zinc-500 transition-all"
          />
        </div>
        <button
          onClick={handleApplyInput}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-md shadow-cyan-600/30 transition-all shrink-0 active:scale-95"
        >
          Apply Input
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs mb-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preset Generators Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-black/[0.05] dark:border-white/[0.08]">
        <span className="text-[11px] text-slate-500 dark:text-zinc-400 mr-1 flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-cyan-500" /> Presets:
        </span>
        <button
          onClick={() => generateRandom()}
          className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium active:scale-95 transition-all"
        >
          Random (12)
        </button>
        <button
          onClick={() => generateNearlySorted()}
          className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium active:scale-95 transition-all"
        >
          Nearly Sorted
        </button>
        <button
          onClick={() => generateReversed()}
          className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium active:scale-95 transition-all"
        >
          Reversed
        </button>
        <button
          onClick={() => generateFewUnique()}
          className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium active:scale-95 transition-all"
        >
          Few Unique
        </button>
        <button
          onClick={() => generateWithNegatives()}
          className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium active:scale-95 transition-all"
        >
          Negatives
        </button>
        {isSearching && (
          <button
            onClick={handleSortCopy}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-[11px] font-medium active:scale-95 transition-all ml-auto"
          >
            Sort Array for Search
          </button>
        )}
      </div>
    </div>
  );
};
