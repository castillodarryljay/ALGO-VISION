import React from 'react';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { Network, Info } from 'lucide-react';

export const GraphView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Graph Playground</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Construct custom graphs with draggable nodes, weighted edges, and directed/undirected topologies.
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
