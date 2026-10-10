import { TraceEvent } from '../../types/algorithm';

export function generateSelectionSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
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
    operationName: 'Start Selection Sort',
    beginnerExplanation: `Starting Selection Sort on ${n} elements. The algorithm repeatedly scans the unsorted region to find the ${ascending ? 'minimum' : 'maximum'} element and places it at the front.`,
    technicalExplanation: `Selection Sort routine initialized. Size N = ${n}. Outer loop runs N-1 times. Time complexity: O(n²) in all cases (comparisons = n(n-1)/2), Space O(1).`,
    arraySnapshot: [...arr],
    codeLineKey: 'select_start',
    variables: { n, currentPass: 0 },
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
      codeLineKey: 'select_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  for (let i = 0; i < n - 1; i++) {
    let targetIdx = i;

    events.push({
      id: events.length,
      type: 'PIVOT_SELECT',
      operationName: `Set initial candidate at index ${i}`,
      beginnerExplanation: `Starting pass ${i + 1}. Assume candidate ${ascending ? 'minimum' : 'maximum'} is at index ${i} with value ${arr[i]}.`,
      technicalExplanation: `Setting min/max index targetIdx = ${i} (value ${arr[i]}). Will compare against elements from index ${i + 1} to ${n - 1}.`,
      pivotIndex: i,
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'select_find_min',
      variables: { i, targetIdx, 'candidateValue': arr[i] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2;
      const isNewTarget = ascending ? arr[j] < arr[targetIdx] : arr[j] > arr[targetIdx];

      events.push({
        id: events.length,
        type: 'COMPARE',
        operationName: `Compare candidate at ${targetIdx} with element at ${j}`,
        beginnerExplanation: `Comparing current candidate ${arr[targetIdx]} with ${arr[j]}. ${isNewTarget ? `Found a new candidate! ${arr[j]} is smaller.` : `${arr[j]} is not smaller, keep current candidate.`}`,
        technicalExplanation: `Comparing arr[${j}] (${arr[j]}) against arr[targetIdx] (${arr[targetIdx]}). Result: ${isNewTarget ? 'new extremum found' : 'keep current extremum'}.`,
        indices: [targetIdx, j],
        pivotIndex: targetIdx,
        values: [arr[targetIdx], arr[j]],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        codeLineKey: 'select_compare',
        variables: { i, j, targetIdx, isNewTarget },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });

      if (isNewTarget) {
        targetIdx = j;
      }
    }

    if (targetIdx !== i) {
      swaps++;
      writes += 2;
      accesses += 2;
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;

      events.push({
        id: events.length,
        type: 'SWAP',
        operationName: `Swap candidate into position ${i}`,
        beginnerExplanation: `Placing the smallest element found (${arr[i]}) into its correct spot at index ${i}.`,
        technicalExplanation: `Swapped arr[${i}] (${temp}) with arr[${targetIdx}] (${arr[i]}).`,
        indices: [i, targetIdx],
        values: [arr[i], arr[targetIdx]],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        codeLineKey: 'select_swap',
        variables: { i, swappedWith: targetIdx },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });
    }

    sortedIndices.push(i);
    events.push({
      id: events.length,
      type: 'MARK_SORTED',
      operationName: `Position ${i} sorted`,
      beginnerExplanation: `Index ${i} (${arr[i]}) is now permanently sorted.`,
      technicalExplanation: `Subarray [0..${i}] is now ordered.`,
      indices: [i],
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'select_mark_sorted',
      variables: { i, sortedValue: arr[i] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  sortedIndices.push(n - 1);
  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Sorting Complete',
    beginnerExplanation: `Selection Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    technicalExplanation: `Algorithm finished. Final array is sorted. Comparisons: ${comparisons}, Swaps: ${swaps}.`,
    arraySnapshot: [...arr],
    sortedIndices: [...sortedIndices],
    codeLineKey: 'select_complete',
    variables: { completed: true, totalComparisons: comparisons, totalSwaps: swaps },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
