import { describe, it, expect } from 'vitest';
import { generateBubbleSortTrace } from '../sorting/bubbleSort';
import { generateSelectionSortTrace } from '../sorting/selectionSort';
import { generateInsertionSortTrace } from '../sorting/insertionSort';
import { generateMergeSortTrace } from '../sorting/mergeSort';
import { generateQuickSortTrace } from '../sorting/quickSort';
import { generateHeapSortTrace } from '../sorting/heapSort';
import { generateCountingSortTrace } from '../sorting/countingSort';
import { generateRadixSortTrace } from '../sorting/radixSort';
import { generateShellSortTrace } from '../sorting/shellSort';
import { generateBucketSortTrace } from '../sorting/bucketSort';
import { 
  generateLinearSearchTrace, 
  generateBinarySearchTrace 
} from '../searching/searchingAlgorithms';
import { runBFS, runDijkstra } from '../graphs/graphEngine';
import { insertAVL, getBalance } from '../dataStructures/dataStructureEngine';

describe('Sorting Algorithms - Real Execution Traces', () => {
  const testCases = [
    { name: 'Standard array', input: [45, 12, 85, 32, 89, 39, 44] },
    { name: 'Already sorted', input: [1, 2, 3, 4, 5] },
    { name: 'Reverse sorted', input: [9, 8, 7, 6, 5] },
    { name: 'Array with duplicates', input: [5, 2, 8, 2, 5, 1, 8] },
    { name: 'Single element', input: [42] },
    { name: 'Empty array', input: [] },
    { name: 'Negative numbers', input: [-5, 12, -20, 0, 8, -1] },
  ];

  const sortingGenerators = [
    { name: 'Bubble Sort', fn: generateBubbleSortTrace },
    { name: 'Selection Sort', fn: generateSelectionSortTrace },
    { name: 'Insertion Sort', fn: generateInsertionSortTrace },
    { name: 'Merge Sort', fn: generateMergeSortTrace },
    { name: 'Quick Sort', fn: generateQuickSortTrace },
    { name: 'Heap Sort', fn: generateHeapSortTrace },
    { name: 'Counting Sort', fn: generateCountingSortTrace },
    { name: 'Radix Sort', fn: generateRadixSortTrace },
    { name: 'Shell Sort', fn: generateShellSortTrace },
    { name: 'Bucket Sort', fn: generateBucketSortTrace },
  ];

  sortingGenerators.forEach(({ name, fn }) => {
    describe(`${name}`, () => {
      testCases.forEach(({ name: caseName, input }) => {
        it(`correctly sorts ${caseName}`, () => {
          const events = fn(input, true);
          expect(events.length).toBeGreaterThan(0);
          const finalEvent = events[events.length - 1];
          const finalArray = finalEvent.arraySnapshot;

          const expected = [...input].sort((a, b) => a - b);
          expect(finalArray).toEqual(expected);
        });

        it(`correctly sorts descending for ${caseName}`, () => {
          const events = fn(input, false);
          expect(events.length).toBeGreaterThan(0);
          const finalEvent = events[events.length - 1];
          const finalArray = finalEvent.arraySnapshot;

          const expected = [...input].sort((a, b) => b - a);
          expect(finalArray).toEqual(expected);
        });
      });
    });
  });
});

describe('Searching Algorithms', () => {
  it('Linear Search finds existing target', () => {
    const arr = [10, 50, 30, 70, 80, 20];
    const trace = generateLinearSearchTrace(arr, 70);
    const lastEvent = trace[trace.length - 1];
    expect(lastEvent.type).toBe('TARGET_FOUND');
    expect(lastEvent.indices).toEqual([3]);
  });

  it('Linear Search reports missing target', () => {
    const arr = [10, 50, 30, 70, 80, 20];
    const trace = generateLinearSearchTrace(arr, 999);
    const lastEvent = trace[trace.length - 1];
    expect(lastEvent.type).toBe('TARGET_NOT_FOUND');
  });

  it('Binary Search finds existing target in sorted array', () => {
    const arr = [5, 12, 19, 28, 35, 42, 59, 71];
    const trace = generateBinarySearchTrace(arr, 42);
    const lastEvent = trace[trace.length - 1];
    expect(lastEvent.type).toBe('TARGET_FOUND');
    expect(lastEvent.indices).toEqual([5]);
  });

  it('Binary Search reports absent target in sorted array', () => {
    const arr = [5, 12, 19, 28, 35, 42, 59, 71];
    const trace = generateBinarySearchTrace(arr, 30);
    const lastEvent = trace[trace.length - 1];
    expect(lastEvent.type).toBe('TARGET_NOT_FOUND');
  });
});

describe('Graph Algorithms', () => {
  const sampleGraph = {
    isDirected: false,
    isWeighted: true,
    nodes: [
      { id: 'A', label: 'A', x: 0, y: 0 },
      { id: 'B', label: 'B', x: 10, y: 0 },
      { id: 'C', label: 'C', x: 0, y: 10 },
      { id: 'D', label: 'D', x: 10, y: 10 },
    ],
    edges: [
      { id: 'e1', source: 'A', target: 'B', weight: 1 },
      { id: 'e2', source: 'B', target: 'D', weight: 2 },
      { id: 'e3', source: 'A', target: 'C', weight: 4 },
      { id: 'e4', source: 'C', target: 'D', weight: 1 },
    ],
  };

  it('BFS visits all connected components', () => {
    const steps = runBFS(sampleGraph, 'A');
    const last = steps[steps.length - 1];
    expect(last.visitedNodes.length).toBe(4);
  });

  it('Dijkstra finds shortest path from A to D', () => {
    const steps = runDijkstra(sampleGraph, 'A', 'D');
    const last = steps[steps.length - 1];
    expect(last.distances?.['D']).toBe(3); // A -> B (1) + B -> D (2) = 3
  });
});

describe('Data Structures - AVL Tree Self Balancing', () => {
  it('Balances after Left-Left insertion (Right Rotation)', () => {
    const steps: string[] = [];
    let root = insertAVL(null, 30, steps);
    root = insertAVL(root, 20, steps);
    root = insertAVL(root, 10, steps); // Triggers LL rotation

    expect(root.value).toBe(20);
    expect(root.left?.value).toBe(10);
    expect(root.right?.value).toBe(30);
    expect(Math.abs(getBalance(root))).toBeLessThanOrEqual(1);
  });
});

describe('Multi-Language Code Registry Coverage', () => {
  const allAlgorithmIds = [
    'bubble-sort',
    'selection-sort',
    'insertion-sort',
    'merge-sort',
    'quick-sort',
    'heap-sort',
    'counting-sort',
    'radix-sort',
    'shell-sort',
    'bucket-sort',
    'linear-search',
    'binary-search',
    'jump-search',
    'interpolation-search',
  ];

  const languages = ['javascript', 'python', 'java', 'cpp', 'c', 'csharp'] as const;

  allAlgorithmIds.forEach(algoId => {
    languages.forEach(lang => {
      it(`has authentic ${lang} implementation for ${algoId}`, async () => {
        const { getAlgorithmCode } = await import('../../codeRegistry/codeRegistry');
        const codeImpl = getAlgorithmCode(algoId, lang);
        expect(codeImpl).not.toBeNull();
        expect(codeImpl?.code.length).toBeGreaterThan(20);
        expect(Object.keys(codeImpl?.lineMapping || {}).length).toBeGreaterThan(0);
      });
    });
  });
});
