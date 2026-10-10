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

    if (parsed.length > 35) {
      setErrorMessage('Maximum input size is 35 elements for smooth interactive visualization.');
      return;
    }

    // Special validation for Counting Sort
    if (selectedAlgorithmId === 'counting-sort') {
      const minVal = Math.min(...parsed);
      const maxVal = Math.max(...parsed);
      if (maxVal - minVal > 500) {
        setErrorMessage(`Counting Sort range (${maxVal - minVal}) exceeds 500. Please enter numbers closer together.`);
        return;
      }
    }

    setData(parsed);
  };

  // Generators
  const generateRandom = (size: number = inputSize) => {
    setErrorMessage(null);
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 95) + 5);
    }
    setRawText(arr.join(', '));
    setData(arr);
  };

  const handleShuffle = () => {
    setErrorMessage(null);
    const arr = [...data];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setRawText(arr.join(', '));
    setData(arr);
  };

  const handleReverse = () => {
    setErrorMessage(null);
    const arr = [...data].reverse();
    setRawText(arr.join(', '));
    setData(arr);
  };

  const generateNearlySorted = (size: number = inputSize) => {
    setErrorMessage(null);
    const arr = Array.from({ length: size }, (_, i) => (i + 1) * 7);
    // Swap 2 random pairs
    if (size > 3) {
      const i1 = Math.floor(Math.random() * size);
      const i2 = (i1 + 1) % size;
      [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 mb-4 text-xs">
      {/* Top Header with algorithm domain note */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-zinc-200">Dataset & Input Controls</span>
          <span className="text-[11px] text-zinc-500 font-mono">({data.length} elements)</span>
        </div>

        {/* Ascending / Descending order */}
        {!isSearching && (
          <div className="flex items-center gap-1.5 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/50">
            <button
              onClick={() => setAscending(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                ascending ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ArrowUpNarrowWide className="w-3.5 h-3.5" />
              <span>Ascending</span>
            </button>
            <button
              onClick={() => setAscending(false)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                !ascending ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ArrowDownWideNarrow className="w-3.5 h-3.5" />
              <span>Descending</span>
            </button>
          </div>
        )}

        {/* Target search value */}
        {isSearching && (
          <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-lg border border-zinc-700/50">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-300">Target:</span>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(parseInt(e.target.value, 10) || 0)}
              className="w-16 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-white font-mono text-center outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* Input box & Apply button */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyInput();
            }}
            placeholder="Enter numbers (e.g. 45, 12, -8, 0, 89, 39, 44)"
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-zinc-100 font-mono text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <button
          onClick={handleApplyInput}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-sm transition-colors shrink-0"
        >
          Apply Input
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs mb-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick preset buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-zinc-400 mr-1 text-[11px]">Presets:</span>
        <button
          onClick={() => generateRandom()}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          Random
        </button>
        <button
          onClick={handleShuffle}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          Shuffle
        </button>
        <button
          onClick={handleReverse}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          Reverse
        </button>
        <button
          onClick={() => generateNearlySorted()}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          Nearly Sorted
        </button>
        <button
          onClick={() => generateWithDuplicates()}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          Duplicates
        </button>
        {isSearching && (
          <button
            onClick={handleSortCopy}
            className="px-2 py-1 rounded bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-800/80 transition-colors"
            title="Sort array to satisfy Binary Search requirements"
          >
            Sort Array (Prerequisite)
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span>Size:</span>
          {[8, 12, 16, 24].map(s => (
            <button
              key={s}
              onClick={() => {
                setInputSize(s);
                generateRandom(s);
              }}
              className={`px-1.5 py-0.5 rounded ${
                data.length === s ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
