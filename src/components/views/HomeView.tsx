import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { 
  Sparkles, 
  ArrowUpDown, 
  Binary, 
  Boxes, 
  Network, 
  GitCompare, 
  BookOpen, 
  Code2, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import { ALGORITHMS } from '../../engine/algorithmCatalog';

export const HomeView: React.FC = () => {
  const { setSection, selectAlgorithm } = useAlgoStore();

  const handleLaunchAlgorithm = (algoId: string, section: any) => {
    selectAlgorithm(algoId);
    setSection(section);
  };

  const categories = [
    {
      id: 'sorting',
      title: 'Sorting Algorithms',
      count: '10 Algorithms',
      description: 'Observe Bubble, Merge, Quick, Heap, Counting, Radix, Shell, and Bucket Sort in action with deterministic step-by-step traces.',
      icon: <ArrowUpDown className="w-5 h-5 text-cyan-400" />,
      tag: 'Interactive Bars & Trees',
    },
    {
      id: 'searching',
      title: 'Searching Algorithms',
      count: '4 Algorithms',
      description: 'Explore Linear, Binary, Jump, and Interpolation searches with boundary indicators and sorted prerequisite validation.',
      icon: <Binary className="w-5 h-5 text-amber-400" />,
      tag: 'Logarithmic Probing',
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      count: '11 Structures',
      description: 'Inspect Linked Lists, Stacks, Queues, Hash Tables, BSTs, self-balancing AVL Trees, Heaps, and Trie prefix trees.',
      icon: <Boxes className="w-5 h-5 text-emerald-400" />,
      tag: 'Pointers & Trees',
    },
    {
      id: 'graphs',
      title: 'Graph Algorithms',
      count: '6 Algorithms',
      description: 'Interactive canvas editor: BFS, DFS, Dijkstra, A*, Kruskal MST, and Topological Sort with cycle detection.',
      icon: <Network className="w-5 h-5 text-purple-400" />,
      tag: 'Draggable Canvas',
    },
    {
      id: 'compare',
      title: 'Algorithm Comparison',
      count: 'Multi-Runner',
      description: 'Benchmark algorithms side-by-side on identical datasets. Compare real operation counts, swaps, writes, and complexity.',
      icon: <GitCompare className="w-5 h-5 text-rose-400" />,
      tag: 'Side-by-Side Analysis',
    },
    {
      id: 'learning',
      title: 'Learning Lab',
      count: 'Interactive Courses',
      description: 'Deep dives with beginner-to-advanced lessons, common pitfalls, complexity intuition, and interactive practice questions.',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      tag: 'Quizzes & Theory',
    },
  ];

  const featured = [
    {
      id: 'merge-sort',
      section: 'sorting',
      title: 'Merge Sort Recursion Tree',
      desc: 'Visualize recursive divide-and-conquer splitting down to base cases and merging back with temporary buffer tracking.',
      badge: 'Divide & Conquer',
      color: 'from-cyan-900/50 to-blue-900/30',
    },
    {
      id: 'quick-sort',
      section: 'sorting',
      title: 'Quick Sort In-Place',
      desc: 'Watch Lomuto partitioning place pivots permanently into position while subdividing left and right partitions.',
      badge: 'O(n log n) In-Place',
      color: 'from-amber-900/50 to-orange-900/30',
    },
    {
      id: 'binary-search',
      section: 'searching',
      title: 'Binary Search Halving',
      desc: 'Watch the search interval cut in half at every comparison step with low, mid, and high pointers.',
      badge: 'Logarithmic Search',
      color: 'from-emerald-900/50 to-teal-900/30',
    },
    {
      id: 'bfs',
      section: 'graphs',
      title: 'Graph Shortest Paths',
      desc: 'Drag graph vertices on a canvas and run Dijkstra or Breadth-First Search to find optimal routes.',
      badge: 'Pathfinding',
      color: 'from-purple-900/50 to-indigo-900/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* Hero Section - Apple iOS Liquid Glass Container */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-12 text-center flex flex-col items-center">
        {/* Specular highlights & ambient internal glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/80 border border-cyan-500/20 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Computer Science Education Platform</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10 text-slate-700 dark:text-zinc-200 text-xs font-mono font-medium backdrop-blur-md shadow-xs">
            <span>Created by</span>
            <strong className="text-cyan-600 dark:text-cyan-400 font-bold tracking-wide">SHIRO</strong>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl relative z-10">
          See the Logic. <br />
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
            Understand the Algorithm.
          </span>
        </h1>

        <p className="mt-4 text-xs sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed px-2 relative z-10">
          AlgoVision provides genuine execution traces, synchronized multi-language source code, 
          recursion trees, and real-time complexity metrics. Engineered by <strong className="text-slate-900 dark:text-zinc-200">SHIRO</strong> for students, developers, and educators.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => handleLaunchAlgorithm('merge-sort', 'sorting')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] border border-white/20"
          >
            <span>Launch Merge Sort Tree</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSection('compare')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/70 hover:bg-white text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border border-slate-200/90 dark:border-white/10 font-semibold text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
          >
            <GitCompare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Compare Algorithms</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-3xl border-t border-black/[0.06] dark:border-white/[0.08] pt-8 text-left relative z-10">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">10</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Sorting Algorithms</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">6</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Code Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">11</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Data Structures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-purple-400 font-mono">100%</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Deterministic Traces</div>
          </div>
        </div>
      </div>

      {/* Featured Algorithms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Featured Algorithms & Highlights</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Jump right into advanced interactive visualizations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map(item => (
            <div
              key={item.id}
              onClick={() => handleLaunchAlgorithm(item.id, item.section)}
              className="p-5 rounded-2xl glass-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between border border-white/80 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-mono border border-cyan-500/20 dark:border-cyan-800 backdrop-blur-md">
                    {item.badge}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Launch Interactive Trace →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Categories Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Explore AlgoVision Modules</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Select any section to start experimenting with custom inputs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSection(cat.id as any)}
              className="p-5 rounded-2xl glass-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between border border-white/80 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/10 backdrop-blur-md">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-black/[0.03] dark:bg-white/[0.06] px-2.5 py-1 rounded-full border border-black/[0.05] dark:border-white/10">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-zinc-500 font-mono">{cat.tag}</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Philosophy & Creator Credit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl glass-card flex items-start gap-4 border border-white/80 dark:border-white/10">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shrink-0 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Genuine Execution-Trace Engine</h4>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              AlgoVision runs true algorithms in memory. Every comparison, swap, pivot choice, recursion branch, 
              and memory write generates a structured event in an immutable timeline. This ensures 100% deterministic 
              forward and backward navigation, accurate operation counters, and perfect synchronization with 
              idiomatic source code in 6 programming languages.
            </p>
          </div>
        </div>

        {/* Creator SHIRO Card */}
        <div className="p-5 sm:p-6 rounded-2xl glass-card border border-cyan-500/30 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">Creator</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-mono">Lead Architect</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>SHIRO</span>
              <Sparkles className="w-4 h-4 text-cyan-500" />
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Designed and engineered to bring algorithms to life with tactile visual intuition, synchronized code, and educational depth.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
            <span>AlgoVision v1.0</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">Crafted with Precision</span>
          </div>
        </div>
      </div>

    </div>
  );
};
