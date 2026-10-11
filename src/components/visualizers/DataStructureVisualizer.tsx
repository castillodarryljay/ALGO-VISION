import React, { useState } from 'react';
import { DataStructureType, TreeNodeData, TrieNodeData, HashTableEntry } from '../../types/dataStructures';
import { insertAVL, insertBST, createEmptyTrie, insertTrie } from '../../engine/dataStructures/dataStructureEngine';
import { 
  Plus, 
  Trash2, 
  Layers, 
  ArrowRight, 
  ArrowLeftRight
} from 'lucide-react';

export const DataStructureVisualizer: React.FC = () => {
  const [selectedDs, setSelectedDs] = useState<DataStructureType>('singly-linked-list');
  const [inputValue, setInputValue] = useState<string>('42');
  const [logMessages, setLogMessages] = useState<string[]>([
    'Initialized data structure playground.',
  ]);

  // States for each data structure
  const [singlyList, setSinglyList] = useState<number[]>([15, 23, 42, 8]);
  const [doublyList, setDoublyList] = useState<number[]>([10, 20, 30, 40]);
  const [stackItems, setStackItems] = useState<number[]>([10, 25, 45, 70]);
  const [queueItems, setQueueItems] = useState<number[]>([12, 34, 56, 78]);

  const [hashTable, setHashTable] = useState<HashTableEntry[]>([
    { index: 0, items: [] },
    { index: 1, items: [{ key: 'apple', value: 5 }] },
    { index: 2, items: [] },
    { index: 3, items: [{ key: 'banana', value: 8 }, { key: 'orange', value: 12 }] },
    { index: 4, items: [] },
    { index: 5, items: [{ key: 'grape', value: 3 }] },
  ]);

  const [avlRoot, setAvlRoot] = useState<TreeNodeData | null>({
    id: 'root',
    value: 30,
    height: 2,
    left: { id: 'l1', value: 20, height: 1 },
    right: { id: 'r1', value: 40, height: 1 },
  });

  const [bstRoot, setBstRoot] = useState<TreeNodeData | null>({
    id: 'bst_root',
    value: 50,
    left: { id: 'b_l', value: 25 },
    right: { id: 'b_r', value: 75 },
  });

  const [heapArray, setHeapArray] = useState<number[]>([90, 80, 70, 50, 40, 60, 30]);
  const [trieRoot, setTrieRoot] = useState<TrieNodeData>(() => createEmptyTrie());

  const addLog = (msg: string) => {
    setLogMessages(prev => [msg, ...prev].slice(0, 10));
  };

  const handleInsert = () => {
    const num = parseInt(inputValue, 10);

    if (selectedDs === 'singly-linked-list') {
      if (isNaN(num)) return;
      setSinglyList([...singlyList, num]);
      addLog(`Appended node (${num}) to Singly Linked List.`);
    } else if (selectedDs === 'doubly-linked-list') {
      if (isNaN(num)) return;
      setDoublyList([...doublyList, num]);
      addLog(`Appended node (${num}) to Doubly Linked List.`);
    } else if (selectedDs === 'stack') {
      if (isNaN(num)) return;
      if (stackItems.length >= 8) {
        addLog('Stack Overflow! Maximum 8 items reached.');
        return;
      }
      setStackItems([...stackItems, num]);
      addLog(`Pushed ${num} onto the Stack.`);
    } else if (selectedDs === 'queue') {
      if (isNaN(num)) return;
      setQueueItems([...queueItems, num]);
      addLog(`Enqueued ${num} into the Queue.`);
    } else if (selectedDs === 'bst') {
      if (isNaN(num)) return;
      const steps: string[] = [];
      const newRoot = insertBST(bstRoot, num, steps);
      setBstRoot(newRoot);
      steps.forEach(s => addLog(s));
    } else if (selectedDs === 'avl-tree') {
      if (isNaN(num)) return;
      const steps: string[] = [];
      const newRoot = insertAVL(avlRoot, num, steps);
      setAvlRoot(newRoot);
      steps.forEach(s => addLog(s));
    } else if (selectedDs === 'min-heap' || selectedDs === 'max-heap') {
      if (isNaN(num)) return;
      const arr = [...heapArray, num];
      // Heapify up
      let idx = arr.length - 1;
      const isMax = selectedDs === 'max-heap';
      while (idx > 0) {
        const parent = Math.floor((idx - 1) / 2);
        if (isMax ? arr[idx] > arr[parent] : arr[idx] < arr[parent]) {
          [arr[idx], arr[parent]] = [arr[parent], arr[idx]];
          idx = parent;
        } else break;
      }
      setHeapArray(arr);
      addLog(`Inserted ${num} and restored Heap property.`);
    } else if (selectedDs === 'trie') {
      const word = inputValue.trim();
      if (!word) return;
      const clone = JSON.parse(JSON.stringify(trieRoot));
      const steps = insertTrie(clone, word);
      setTrieRoot(clone);
      steps.forEach(s => addLog(s));
    } else if (selectedDs === 'hash-table') {
      const key = inputValue.trim();
      if (!key) return;
      let hash = 0;
      for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i)) % hashTable.length;
      const updated = [...hashTable];
      updated[hash].items.push({ key, value: Math.floor(Math.random() * 90) + 10 });
      setHashTable(updated);
      addLog(`Inserted key "${key}" into bucket #${hash} with hash code ${hash}.`);
    }
  };

  const handleDelete = () => {
    if (selectedDs === 'singly-linked-list') {
      if (singlyList.length === 0) {
        addLog('List is already empty.');
        return;
      }
      const val = singlyList[0];
      setSinglyList(singlyList.slice(1));
      addLog(`Removed head node (${val}) from Singly Linked List.`);
    } else if (selectedDs === 'doubly-linked-list') {
      if (doublyList.length === 0) {
        addLog('List is already empty.');
        return;
      }
      const val = doublyList[0];
      setDoublyList(doublyList.slice(1));
      addLog(`Removed head node (${val}) from Doubly Linked List.`);
    } else if (selectedDs === 'stack') {
      if (stackItems.length === 0) {
        addLog('Stack Underflow! Cannot pop from empty stack.');
        return;
      }
      const popped = stackItems[stackItems.length - 1];
      setStackItems(stackItems.slice(0, -1));
      addLog(`Popped top element (${popped}) from Stack.`);
    } else if (selectedDs === 'queue') {
      if (queueItems.length === 0) {
        addLog('Queue is empty. Cannot dequeue.');
        return;
      }
      const deq = queueItems[0];
      setQueueItems(queueItems.slice(1));
      addLog(`Dequeued front element (${deq}) from Queue.`);
    } else if (selectedDs === 'min-heap' || selectedDs === 'max-heap') {
      if (heapArray.length === 0) return;
      const root = heapArray[0];
      const nextArr = [...heapArray];
      const last = nextArr.pop()!;
      if (nextArr.length > 0) {
        nextArr[0] = last;
        let i = 0;
        const isMax = selectedDs === 'max-heap';
        while (true) {
          let extremum = i;
          const left = 2 * i + 1;
          const right = 2 * i + 2;
          if (left < nextArr.length && (isMax ? nextArr[left] > nextArr[extremum] : nextArr[left] < nextArr[extremum])) {
            extremum = left;
          }
          if (right < nextArr.length && (isMax ? nextArr[right] > nextArr[extremum] : nextArr[right] < nextArr[extremum])) {
            extremum = right;
          }
          if (extremum !== i) {
            [nextArr[i], nextArr[extremum]] = [nextArr[extremum], nextArr[i]];
            i = extremum;
          } else break;
        }
      }
      setHeapArray(nextArr);
      addLog(`Extracted root (${root}) from Heap and rebalanced.`);
    }
  };

  // Tree render component
  const renderTreeSvg = (root: TreeNodeData | null) => {
    if (!root) return <div className="text-slate-400 dark:text-zinc-500 py-8 text-center font-mono">Empty Tree</div>;

    const nodes: { node: TreeNodeData; x: number; y: number; parentX?: number; parentY?: number }[] = [];

    function traverse(node: TreeNodeData | null | undefined, x: number, y: number, spread: number, px?: number, py?: number) {
      if (!node) return;
      nodes.push({ node, x, y, parentX: px, parentY: py });
      if (node.left) traverse(node.left, x - spread, y + 60, spread / 2, x, y);
      if (node.right) traverse(node.right, x + spread, y + 60, spread / 2, x, y);
    }

    traverse(root, 300, 40, 120);

    return (
      <svg className="w-full h-64 overflow-visible">
        {nodes.map((item, idx) => item.parentX !== undefined ? (
          <line
            key={`line-${idx}`}
            x1={item.parentX}
            y1={item.parentY}
            x2={item.x}
            y2={item.y}
            className="stroke-slate-300 dark:stroke-zinc-700"
            strokeWidth="2"
          />
        ) : null)}

        {nodes.map((item) => (
          <g key={item.node.id} transform={`translate(${item.x}, ${item.y})`}>
            <circle
              r="18"
              className="fill-white dark:fill-zinc-800 stroke-cyan-500"
              strokeWidth="2.5"
            />
            <text
              textAnchor="middle"
              dy="5"
              className="fill-slate-900 dark:fill-white font-mono text-xs font-bold"
            >
              {item.node.value}
            </text>
            {item.node.balanceFactor !== undefined && (
              <text
                textAnchor="middle"
                dy="28"
                className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px]"
              >
                BF:{item.node.balanceFactor}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Category selector & Control Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border border-white/80 dark:border-white/10 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Structure:
          </span>
          <select
            value={selectedDs}
            onChange={(e) => setSelectedDs(e.target.value as DataStructureType)}
            className="glass-input rounded-2xl px-3.5 py-1.5 font-medium text-xs outline-none"
          >
            <option value="singly-linked-list">Singly Linked List</option>
            <option value="doubly-linked-list">Doubly Linked List</option>
            <option value="stack">Stack (LIFO)</option>
            <option value="queue">Queue (FIFO)</option>
            <option value="hash-table">Hash Table (Chaining)</option>
            <option value="bst">Binary Search Tree (BST)</option>
            <option value="avl-tree">AVL Tree (Self-Balancing)</option>
            <option value="max-heap">Max-Heap</option>
            <option value="min-heap">Min-Heap</option>
            <option value="trie">Trie (Prefix Tree)</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value or Word"
            className="w-24 sm:w-32 glass-input rounded-2xl px-3 py-1.5 font-mono text-center outline-none"
          />
          <button
            onClick={handleInsert}
            className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-md shadow-cyan-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 font-semibold active:scale-95 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm min-h-[320px] flex flex-col justify-center items-center overflow-x-auto border border-white/80 dark:border-white/10">
        
        {/* Singly Linked List */}
        {selectedDs === 'singly-linked-list' && (
          <div className="flex items-center gap-2 py-8 overflow-x-auto max-w-full">
            <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs mr-2">HEAD →</span>
            {singlyList.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex rounded-2xl border border-cyan-500/40 glass-card shadow-md overflow-hidden">
                  <div className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {val}
                  </div>
                  <div className="px-2.5 py-2.5 bg-cyan-500/10 border-l border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs flex items-center">
                    •
                  </div>
                </div>
                {idx < singlyList.length - 1 ? (
                  <ArrowRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs ml-1">→ NULL</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Doubly Linked List */}
        {selectedDs === 'doubly-linked-list' && (
          <div className="flex items-center gap-2 py-8 overflow-x-auto max-w-full">
            <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs mr-2">HEAD ⇄</span>
            {doublyList.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex rounded-2xl border border-indigo-500/40 glass-card shadow-md overflow-hidden">
                  <div className="px-2 py-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] flex items-center">
                    prev
                  </div>
                  <div className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white text-sm border-x border-indigo-500/20">
                    {val}
                  </div>
                  <div className="px-2 py-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] flex items-center">
                    next
                  </div>
                </div>
                {idx < doublyList.length - 1 ? (
                  <ArrowLeftRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs ml-1">⇄ NULL</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Stack (LIFO) */}
        {selectedDs === 'stack' && (
          <div className="flex flex-col items-center py-4">
            <span className="text-slate-500 dark:text-zinc-400 font-mono text-xs mb-2">TOP OF STACK ↓</span>
            <div className="w-48 flex flex-col-reverse border-b-4 border-x-4 border-slate-300 dark:border-zinc-700 rounded-b-2xl p-2.5 gap-2 bg-black/[0.02] dark:bg-white/[0.03] min-h-[190px]">
              {stackItems.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-full py-2.5 rounded-xl font-mono font-bold text-center text-sm transition-all shadow-sm ${
                    idx === stackItems.length - 1
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-600/30'
                      : 'glass-card text-slate-800 dark:text-zinc-200'
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
            <span className="text-slate-500 dark:text-zinc-500 font-mono text-[11px] mt-2">Capacity: {stackItems.length}/8 items</span>
          </div>
        )}

        {/* Queue (FIFO) */}
        {selectedDs === 'queue' && (
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">DEQUEUE (FRONT) ←</span>
              <div className="flex items-center gap-2 border-y-2 border-slate-300 dark:border-zinc-700 p-2.5 bg-black/[0.02] dark:bg-white/[0.03] min-w-[280px] rounded-xl">
                {queueItems.map((val, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded-xl font-mono font-bold text-center text-sm shadow-sm ${
                      idx === 0 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/30' 
                        : 'glass-card text-slate-800 dark:text-zinc-200'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold">← ENQUEUE (REAR)</span>
            </div>
          </div>
        )}

        {/* Hash Table with Chaining */}
        {selectedDs === 'hash-table' && (
          <div className="w-full max-w-xl py-4 space-y-2">
            {hashTable.map(entry => (
              <div key={entry.index} className="flex items-center gap-2 font-mono text-xs">
                <span className="w-16 px-2 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-400 text-center font-bold">
                  [{entry.index}]
                </span>
                <span className="text-slate-400 dark:text-zinc-600">→</span>
                <div className="flex-1 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] min-h-[36px]">
                  {entry.items.length === 0 ? (
                    <span className="text-slate-400 dark:text-zinc-500 italic text-[11px] px-2">Empty bucket</span>
                  ) : (
                    entry.items.map((it, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-medium">
                        "{it.key}": {it.value}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trees: BST / AVL */}
        {(selectedDs === 'bst' || selectedDs === 'avl-tree') && (
          <div className="w-full overflow-x-auto flex justify-center py-4">
            {renderTreeSvg(selectedDs === 'avl-tree' ? avlRoot : bstRoot)}
          </div>
        )}

        {/* Heaps */}
        {(selectedDs === 'min-heap' || selectedDs === 'max-heap') && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap justify-center">
              <span className="text-slate-500 dark:text-zinc-400 mr-2 font-sans font-medium">Array Storage:</span>
              {heapArray.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`px-3 py-2 rounded-xl font-bold shadow-xs ${
                    idx === 0 
                      ? 'bg-amber-500 text-amber-950 font-extrabold shadow-amber-500/30' 
                      : 'glass-card text-slate-800 dark:text-zinc-200'
                  }`}>
                    {val}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trie */}
        {selectedDs === 'trie' && (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs mb-2 font-semibold">Trie Prefix Words: ["cat", "car", "dog"]</span>
            <div className="p-5 glass-subtle rounded-2xl font-mono text-xs text-slate-800 dark:text-zinc-200">
              Root (^) → [c] → [a] → [t]* | [r]*  &nbsp;|&nbsp;  [d] → [o] → [g]*
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 font-sans">* Indicates end-of-word terminal node</div>
            </div>
          </div>
        )}
      </div>

      {/* Operation Logs Banner */}
      <div className="glass-card rounded-3xl p-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
          Recent Operations Log
        </div>
        <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-zinc-300 max-h-24 overflow-y-auto">
          {logMessages.map((msg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">›</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
