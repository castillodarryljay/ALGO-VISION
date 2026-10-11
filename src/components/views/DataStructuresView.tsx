import React from 'react';
import { DataStructureVisualizer } from '../visualizers/DataStructureVisualizer';
import { Boxes, Info } from 'lucide-react';

export const DataStructuresView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Header Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Boxes className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Interactive Data Structures Lab</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 max-w-3xl leading-relaxed">
            Experiment with pointers, dynamic memory representations, and self-balancing operations.
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
