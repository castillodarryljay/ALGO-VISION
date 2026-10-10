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
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-12 text-center flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Computer Science Education Platform</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700 text-zinc-200 text-xs font-mono font-medium shadow-sm">
            <span>Created by</span>
            <strong className="text-cyan-400 font-bold tracking-wide">SHIRO</strong>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl">
          See the Logic. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Understand the Algorithm.
          </span>
        </h1>

        <p className="mt-4 text-xs sm:text-base text-zinc-400 max-w-2xl leading-relaxed px-2">
          AlgoVision provides genuine execution traces, synchronized multi-language source code, 
          recursion trees, and real-time complexity metrics. Engineered by <strong>SHIRO</strong> for students, developers, and educators.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handleLaunchAlgorithm('merge-sort', 'sorting')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-950/50 hover:scale-105"
          >
            <span>Launch Merge Sort Tree</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSection('compare')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-sm transition-all hover:scale-105"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Compare Algorithms</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-3xl border-t border-zinc-800/80 pt-8 text-left">
          <div>
            <div className="text-2xl font-bold text-white font-mono">10</div>
            <div className="text-xs text-zinc-400">Sorting Algorithms</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">6</div>
            <div className="text-xs text-zinc-400">Code Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">11</div>
            <div className="text-xs text-zinc-400">Data Structures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 font-mono">100%</div>
            <div className="text-xs text-zinc-400">Deterministic Traces</div>
          </div>
        </div>
      </div>

      {/* Featured Algorithms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Featured Algorithms & Highlights</h2>
            <p className="text-xs text-zinc-400">Jump right into advanced interactive visualizations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map(item => (
            <div
              key={item.id}
              onClick={() => handleLaunchAlgorithm(item.id, item.section)}
              className={`p-5 rounded-xl bg-gradient-to-br ${item.color} border border-zinc-800 hover:border-cyan-700/60 transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-900/80 text-cyan-300 font-mono border border-zinc-700">
                    {item.badge}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs text-cyan-400 font-medium">
                Launch Interactive Trace →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Categories Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">Explore AlgoVision Modules</h2>
          <p className="text-xs text-zinc-400">Select any section to start experimenting with custom inputs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSection(cat.id as any)}
              className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono">{cat.tag}</span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Philosophy & Creator Credit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 sm:p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-xs text-zinc-300 space-y-1">
            <h4 className="font-semibold text-white">Genuine Execution-Trace Engine</h4>
            <p className="text-zinc-400 leading-relaxed">
              AlgoVision runs true algorithms in memory. Every comparison, swap, pivot choice, recursion branch, 
              and memory write generates a structured event in an immutable timeline. This ensures 100% deterministic 
              forward and backward navigation, accurate operation counters, and perfect synchronization with 
              idiomatic source code in 6 programming languages.
            </p>
          </div>
        </div>

        {/* Creator SHIRO Card */}
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-cyan-900/60 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold">Creator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">Lead Architect</span>
            </div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <span>SHIRO</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Designed and engineered to bring algorithms to life with tactile visual intuition, synchronized code, and educational depth.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>AlgoVision v1.0</span>
            <span className="text-cyan-400">Crafted with Precision</span>
          </div>
        </div>
      </div>

    </div>
  );
};
