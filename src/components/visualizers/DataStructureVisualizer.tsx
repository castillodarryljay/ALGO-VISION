import React, { useState } from 'react';
import { DataStructureType, TreeNodeData, TrieNodeData, HashTableEntry } from '../../types/dataStructures';
import { insertAVL, insertBST, createEmptyTrie, insertTrie, searchTrie } from '../../engine/dataStructures/dataStructureEngine';
import { 
  Plus, 
  Trash2, 
  Search, 
  RotateCcw, 
  Layers, 
  ArrowRight, 
  ArrowLeftRight,
  Sparkles,
  GitCommit,
  Hash,
  Binary
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
  const [circularQueue, setCircularQueue] = useState<(number | null)[]>([10, 20, 30, null, null, null]);
  const [circularFront, setCircularFront] = useState<number>(0);
  const [circularRear, setCircularRear] = useState<number>(2);

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
  const [trieRoot, setTrieRoot] = useState<TrieNodeData>(() => {
    const root = createEmptyTrie();
    insertTrie(root, 'cat');
    insertTrie(root, 'car');
    insertTrie(root, 'dog');
    return root;
  });

  const addLog = (msg: string) => {
    setLogMessages(prev => [msg, ...prev.slice(0, 15)]);
  };

  // Actions
  const handleInsert = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) && selectedDs !== 'trie' && selectedDs !== 'hash-table') {
      addLog('Please enter a valid integer.');
      return;
    }

    if (selectedDs === 'singly-linked-list') {
      setSinglyList([...singlyList, num]);
      addLog(`Appended node with value ${num} to Singly Linked List.`);
    } else if (selectedDs === 'doubly-linked-list') {
      setDoublyList([...doublyList, num]);
      addLog(`Appended node with value ${num} to Doubly Linked List.`);
    } else if (selectedDs === 'stack') {
      if (stackItems.length >= 8) {
        addLog('Stack Overflow! Stack has reached capacity limit.');
        return;
      }
      setStackItems([...stackItems, num]);
      addLog(`Pushed ${num} onto top of Stack.`);
    } else if (selectedDs === 'queue') {
      if (queueItems.length >= 8) {
        addLog('Queue capacity reached.');
        return;
      }
      setQueueItems([...queueItems, num]);
      addLog(`Enqueued ${num} at rear of Queue.`);
    } else if (selectedDs === 'avl-tree') {
      const steps: string[] = [];
      const newRoot = insertAVL(avlRoot ? JSON.parse(JSON.stringify(avlRoot)) : null, num, steps);
      setAvlRoot(newRoot);
      steps.forEach(s => addLog(s));
    } else if (selectedDs === 'bst') {
      const steps: string[] = [];
      const newRoot = insertBST(bstRoot ? JSON.parse(JSON.stringify(bstRoot)) : null, num, steps);
      setBstRoot(newRoot);
      steps.forEach(s => addLog(s));
    } else if (selectedDs === 'min-heap' || selectedDs === 'max-heap') {
      const arr = [...heapArray, num];
      // Heapify up
      let idx = arr.length - 1;
      const isMax = selectedDs === 'max-heap';
      while (idx > 0) {
        const parent = Math.floor((idx - 1) / 2);
        const shouldSwap = isMax ? arr[idx] > arr[parent] : arr[idx] < arr[parent];
        if (shouldSwap) {
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
      // Simple hash
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
        // Heapify down
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
    if (!root) return <div className="text-zinc-500 py-8 text-center font-mono">Empty Tree</div>;

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
            stroke="#52525b"
            strokeWidth="2"
          />
        ) : null)}

        {nodes.map((item, idx) => (
          <g key={`node-${idx}`} transform={`translate(${item.x}, ${item.y})`}>
            <circle
              r="18"
              fill="#0e7490"
              stroke="#22d3ee"
              strokeWidth="2"
              className="drop-shadow"
            />
            <text
              textAnchor="middle"
              dy="4"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              {item.node.value}
            </text>
            {item.node.balanceFactor !== undefined && (
              <text
                textAnchor="middle"
                dy="28"
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
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
      {/* Category selector */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            Structure:
          </span>
          <select
            value={selectedDs}
            onChange={(e) => setSelectedDs(e.target.value as DataStructureType)}
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-100 font-medium outline-none focus:border-cyan-500"
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
            className="w-24 sm:w-32 bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white font-mono text-center outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleInsert}
            className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Insert
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-medium shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-inner min-h-[300px] flex flex-col justify-center items-center overflow-x-auto">
        
        {/* Singly Linked List */}
        {selectedDs === 'singly-linked-list' && (
          <div className="flex items-center gap-2 py-8 overflow-x-auto max-w-full">
            <span className="text-zinc-500 font-mono text-xs mr-2">HEAD →</span>
            {singlyList.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex rounded-lg border border-cyan-700/80 bg-zinc-900 shadow-md">
                  <div className="px-3 py-2 font-mono font-bold text-white text-sm">
                    {val}
                  </div>
                  <div className="px-2 py-2 bg-zinc-800 border-l border-zinc-700 text-cyan-400 font-mono text-xs flex items-center">
                    •
                  </div>
                </div>
                {idx < singlyList.length - 1 ? (
                  <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <span className="text-zinc-500 font-mono text-xs ml-1">→ NULL</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Doubly Linked List */}
        {selectedDs === 'doubly-linked-list' && (
          <div className="flex items-center gap-2 py-8 overflow-x-auto max-w-full">
            <span className="text-zinc-500 font-mono text-xs mr-2">HEAD ⇄</span>
            {doublyList.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex rounded-lg border border-indigo-700/80 bg-zinc-900 shadow-md">
                  <div className="px-1.5 py-2 bg-zinc-800 text-indigo-400 font-mono text-xs flex items-center">
                    prev
                  </div>
                  <div className="px-3 py-2 font-mono font-bold text-white text-sm border-x border-zinc-700">
                    {val}
                  </div>
                  <div className="px-1.5 py-2 bg-zinc-800 text-indigo-400 font-mono text-xs flex items-center">
                    next
                  </div>
                </div>
                {idx < doublyList.length - 1 ? (
                  <ArrowLeftRight className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <span className="text-zinc-500 font-mono text-xs ml-1">⇄ NULL</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Stack (LIFO) */}
        {selectedDs === 'stack' && (
          <div className="flex flex-col items-center py-4">
            <span className="text-zinc-400 font-mono text-xs mb-2">TOP OF STACK ↓</span>
            <div className="w-44 flex flex-col-reverse border-b-4 border-x-4 border-zinc-700 rounded-b-xl p-2 gap-1.5 bg-zinc-900/50 min-h-[180px]">
              {stackItems.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-full py-2 rounded font-mono font-bold text-center text-sm transition-all ${
                    idx === stackItems.length - 1
                      ? 'bg-cyan-600 text-white ring-2 ring-cyan-400/40 shadow-sm'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
            <span className="text-zinc-600 font-mono text-[10px] mt-1.5">Capacity: {stackItems.length}/8 items</span>
          </div>
        )}

        {/* Queue (FIFO) */}
        {selectedDs === 'queue' && (
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-mono text-xs">DEQUEUE (FRONT) ←</span>
              <div className="flex items-center gap-1.5 border-y-2 border-zinc-700 p-2 bg-zinc-900/50 min-w-[280px]">
                {queueItems.map((val, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-3 rounded font-mono font-bold text-center text-sm ${
                      idx === 0 ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40' : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <span className="text-cyan-400 font-mono text-xs">← ENQUEUE (REAR)</span>
            </div>
          </div>
        )}

        {/* Hash Table with Chaining */}
        {selectedDs === 'hash-table' && (
          <div className="w-full max-w-xl py-4 space-y-1.5">
            {hashTable.map(entry => (
              <div key={entry.index} className="flex items-center gap-2 font-mono text-xs">
                <span className="w-16 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-center font-bold">
                  [{entry.index}]
                </span>
                <span className="text-zinc-600">→</span>
                <div className="flex-1 flex flex-wrap items-center gap-1.5 p-1 rounded bg-zinc-900/50 border border-zinc-800/80 min-h-[30px]">
                  {entry.items.length === 0 ? (
                    <span className="text-zinc-700 italic text-[11px] px-2">Empty bucket</span>
                  ) : (
                    entry.items.map((it, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-medium">
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
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-zinc-400 mr-2">Array View:</span>
              {heapArray.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`px-2.5 py-1.5 rounded font-bold ${idx === 0 ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-white'}`}>
                    {val}
                  </div>
                  <span className="text-[10px] text-zinc-600">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trie */}
        {selectedDs === 'trie' && (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="text-cyan-400 font-mono text-xs mb-2">Trie Prefix Words: ["cat", "car", "dog"]</span>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300">
              Root (^) → [c] → [a] → [t]* | [r]*  &nbsp;|&nbsp;  [d] → [o] → [g]*
              <div className="text-[11px] text-zinc-500 mt-2">* Indicates end-of-word terminal node</div>
            </div>
          </div>
        )}
      </div>

      {/* Operation Logs Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          Recent Operations Log
        </div>
        <div className="space-y-1 font-mono text-[11px] text-zinc-300 max-h-24 overflow-y-auto">
          {logMessages.map((msg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-cyan-500">›</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
