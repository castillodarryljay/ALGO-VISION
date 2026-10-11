import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Code2, 
  AlertCircle, 
  Copy, 
  Check
} from 'lucide-react';

const PRESETS: Record<string, string> = {
  'Custom Quick Sort': `// Custom Quick Sort Benchmark
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    let pi = i + 1;
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

// Test with 100 random integers
const dataset = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
console.log("Original array snippet:", dataset.slice(0, 10).join(", ") + "...");

const startTime = performance.now();
const sorted = quickSort(dataset);
const duration = (performance.now() - startTime).toFixed(3);

console.log("Sorted array snippet:  ", sorted.slice(0, 10).join(", ") + "...");
console.log(\`Successfully sorted \${dataset.length} items in \${duration}ms\`);
`,
  'Binary Search Matrix': `// Binary Search in a Sorted Array
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  let iterations = 0;
  while (low <= high) {
    iterations++;
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return { index: mid, iterations };
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return { index: -1, iterations };
}

const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 105, 142];
const targets = [23, 91, 404];

targets.forEach(t => {
  const res = binarySearch(numbers, t);
  if (res.index !== -1) {
    console.log(\`Found \${t} at index \${res.index} in \${res.iterations} steps.\`);
  } else {
    console.log(\`Target \${t} not found in array after \${res.iterations} steps.\`);
  }
});
`,
  'Fibonacci Dynamic Programming': `// Fibonacci DP: Top-down Memoization vs Bottom-up Tabulation
function fibTabulation(n) {
  if (n <= 1) return n;
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log("Calculating Fibonacci sequence up to n=20:");
for (let i = 0; i <= 20; i++) {
  console.log(\`Fib(\${i}) = \${fibTabulation(i)}\`);
}
`
};

export const PlaygroundView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom Quick Sort');
  const [code, setCode] = useState<string>(PRESETS['Custom Quick Sort']);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setOutputLogs([]);
    setExecutionError(null);
    setExecutionTime(null);

    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      }
    };

    try {
      const runner = new Function('console', code);
      const start = performance.now();
      runner(customConsole);
      const elapsed = parseFloat((performance.now() - start).toFixed(3));
      setExecutionTime(elapsed);
      setOutputLogs(logs.length > 0 ? logs : ['Execution completed with no console output.']);
    } catch (err: any) {
      setExecutionError(err.message || 'Unknown runtime error');
    }
  };

  const handleSelectPreset = (name: string) => {
    setSelectedPreset(name);
    setCode(PRESETS[name]);
    setOutputLogs([]);
    setExecutionError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 text-xs">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Code Playground & Sandboxed Runner</h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Write or edit custom algorithm logic and execute it directly in an isolated client-side sandbox.
            Inspect standard output, execution time benchmarks, and runtime safety limits.
          </p>
        </div>

        {/* Preset Selector & Run */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPreset}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="glass-input rounded-2xl px-4 py-2 font-medium text-xs outline-none"
          >
            {Object.keys(PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>

          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Execute Code</span>
          </button>
        </div>
      </div>

      {/* Code Editor & Console Output split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Editor Card */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[520px] border border-white/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04]">
            <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Source Code (JavaScript Sandbox)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-5 bg-transparent text-slate-800 dark:text-zinc-200 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-cyan-500/20"
          />
        </div>

        {/* Output Console Card */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[520px] border border-white/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04]">
            <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Execution Console Output
            </span>
            {executionTime !== null && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-mono text-[11px] backdrop-blur-md">
                {executionTime} ms
              </span>
            )}
          </div>

          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2">
            {executionError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Execution Runtime Error</span>
                </div>
                <div>{executionError}</div>
              </div>
            )}

            {outputLogs.length === 0 && !executionError && (
              <div className="text-slate-400 dark:text-zinc-500 italic py-8 text-center">
                Click "Execute Code" above to run the script and inspect logs.
              </div>
            )}

            {outputLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-800 dark:text-zinc-200">
                <span className="text-slate-400 dark:text-zinc-600 select-none">&gt;</span>
                <span className="whitespace-pre-wrap">{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
