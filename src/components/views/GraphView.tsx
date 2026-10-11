import React from 'react';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { Network } from 'lucide-react';

export const GraphView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Header Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Interactive Graph Playground</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 max-w-3xl leading-relaxed">
            Construct custom graphs with touch and drag-friendly nodes, weighted edges, and directed/undirected topologies.
            Execute Breadth-First Search, Depth-First Search, Dijkstra's Shortest Path, A* Heuristic Search, 
            Kruskal's Minimum Spanning Tree, and Kahn's Topological Sort with cycle detection.
          </p>
        </div>
      </div>

      {/* Main Canvas & Controls */}
      <GraphVisualizer />

    </div>
  );
};
