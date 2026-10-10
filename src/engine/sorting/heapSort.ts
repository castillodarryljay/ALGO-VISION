import { TraceEvent } from '../../types/algorithm';

export function generateHeapSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  events.push({
    id: events.length,
    type: 'START',
    operationName: 'Start Heap Sort',
    beginnerExplanation: `Starting Heap Sort on ${n} elements. Heap Sort transforms the array into a Binary Max-Heap (where every parent is >= its children), then repeatedly moves the root (maximum) to the end and restores the heap property.`,
    technicalExplanation: `Heap Sort initialized. Array size N = ${n}. Phase 1: Build ${ascending ? 'Max' : 'Min'}-Heap in O(n) time. Phase 2: N-1 extractions each taking O(log n) time. Total time O(n log n), Auxiliary space O(1).`,
    arraySnapshot: [...arr],
    codeLineKey: 'heap_start',
    variables: { n },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  if (n <= 1) {
    if (n === 1) sortedIndices.push(0);
    events.push({
      id: events.length,
      type: 'COMPLETE',
      operationName: 'Sorting Complete',
      beginnerExplanation: 'Array already sorted.',
      technicalExplanation: 'Trivially sorted for length <= 1.',
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'heap_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  function heapify(size: number, rootIdx: number) {
    let extremum = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < size) {
      comparisons++;
      accesses += 2;
      const leftBetter = ascending ? arr[left] > arr[extremum] : arr[left] < arr[extremum];
      if (leftBetter) extremum = left;
    }

    if (right < size) {
      comparisons++;
      accesses += 2;
      const rightBetter = ascending ? arr[right] > arr[extremum] : arr[right] < arr[extremum];
      if (rightBetter) extremum = right;
    }

    if (extremum !== rootIdx) {
      swaps++;
      writes += 2;
      accesses += 2;
      const temp = arr[rootIdx];
      arr[rootIdx] = arr[extremum];
      arr[extremum] = temp;

      events.push({
        id: events.length,
        type: 'HEAPIFY',
        operationName: `Heapify: Swap parent ${temp} at index ${rootIdx} with child ${arr[rootIdx]} at index ${extremum}`,
        beginnerExplanation: `Parent value ${temp} violated heap property with child ${arr[rootIdx]}. Swapped them to maintain heap order.`,
        technicalExplanation: `Heap violation detected at node ${rootIdx}. Swapped arr[${rootIdx}] with child arr[${extremum}]. Recursing down branch.`,
        indices: [rootIdx, extremum],
        values: [arr[rootIdx], arr[extremum]],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        codeLineKey: 'heap_heapify',
        variables: { size, rootIdx, extremum, 'newRoot': arr[rootIdx] },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });

      heapify(size, extremum);
    }
  }

  // Phase 1: Build Heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  events.push({
    id: events.length,
    type: 'MARK_SORTED',
    operationName: 'Heap Construction Complete',
    beginnerExplanation: `The array is now a valid ${ascending ? 'Max' : 'Min'}-Heap! Root element at index 0 (${arr[0]}) is the ${ascending ? 'largest' : 'smallest'} element.`,
    technicalExplanation: `Phase 1 complete. Array represents a complete binary ${ascending ? 'max' : 'min'}-heap in-place.`,
    indices: [0],
    arraySnapshot: [...arr],
    sortedIndices: [...sortedIndices],
    codeLineKey: 'heap_built',
    variables: { rootValue: arr[0], heapSize: n },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  // Phase 2: Extract elements
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    writes += 2;
    accesses += 2;
    const maxVal = arr[0];
    arr[0] = arr[i];
    arr[i] = maxVal;
    sortedIndices.push(i);

    events.push({
      id: events.length,
      type: 'SWAP',
      operationName: `Extract root ${maxVal} and swap with end position ${i}`,
      beginnerExplanation: `Moved ${ascending ? 'maximum' : 'minimum'} element ${maxVal} from the heap top to its final sorted index ${i}.`,
      technicalExplanation: `Extracted root: swap arr[0] (${maxVal}) with arr[${i}] (${arr[0]}). Reduced heap boundary to size ${i}.`,
      indices: [0, i],
      values: [arr[0], maxVal],
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'heap_extract',
      variables: { extractedValue: maxVal, sortedIndex: i, newHeapSize: i },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });

    heapify(i, 0);
  }

  sortedIndices.push(0);

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Heap Sort Complete',
    beginnerExplanation: `Heap Sort complete! All elements extracted into their sorted positions.`,
    technicalExplanation: `Heap Sort terminated. Total comparisons: ${comparisons}, swaps: ${swaps}. Time complexity: O(n log n).`,
    arraySnapshot: [...arr],
    sortedIndices: [...sortedIndices],
    codeLineKey: 'heap_complete',
    variables: { completed: true, totalComparisons: comparisons, totalSwaps: swaps },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
