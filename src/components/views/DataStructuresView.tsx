import React from 'react';
import { DataStructureVisualizer } from '../visualizers/DataStructureVisualizer';
import { Boxes, Info } from 'lucide-react';

export const DataStructuresView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Data Structures Lab</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Experiment with pointers, nodes, dynamic memory concepts, and self-balancing trees.
            Supports Singly/Doubly Linked Lists, Stacks, Queues, Hash Tables with Chaining, 
            Binary Search Trees, self-balancing AVL Trees (LL, RR, LR, RL rotations), Heaps, and Trie prefix trees.
          </p>
        </div>
      </div>

      {/* Interactive Canvas & Operation Controls */}
      <DataStructureVisualizer />

    </div>
  );
};
