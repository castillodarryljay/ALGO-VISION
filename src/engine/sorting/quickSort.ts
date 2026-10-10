import { TraceEvent } from '../../types/algorithm';

export function generateQuickSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  let accesses = 0;
  let maxRecursionDepth = 0;
  const sortedIndices: number[] = [];

  events.push({
    id: events.length,
    type: 'START',
    operationName: 'Start Quick Sort',
    beginnerExplanation: `Starting Quick Sort on ${n} elements. Quick Sort picks an element as 'pivot' and partitions the array around the pivot so that smaller elements go to the left and larger elements go to the right.`,
    technicalExplanation: `Quick Sort initialized using Lomuto partition scheme. Pivot selected at high index. Average time O(n log n), worst case O(n²), auxiliary space O(log n) call stack.`,
    arraySnapshot: [...arr],
    codeLineKey: 'quick_start',
    variables: { n, low: 0, high: n - 1 },
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
      codeLineKey: 'quick_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  function quickSortHelper(low: number, high: number, depth: number): void {
    if (depth > maxRecursionDepth) maxRecursionDepth = depth;

    if (low >= high) {
      if (low === high && !sortedIndices.includes(low)) {
        sortedIndices.push(low);
        events.push({
          id: events.length,
          type: 'MARK_SORTED',
          operationName: `Base case: element at index ${low} is sorted`,
          beginnerExplanation: `Single element at index ${low} (${arr[low]}) has no neighbors to partition with and is now in sorted position.`,
          technicalExplanation: `Subarray [${low}..${high}] has length <= 1. Element at index ${low} marked sorted.`,
          indices: [low],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          recursionDepth: depth,
          codeLineKey: 'quick_base_case',
          variables: { low, high, depth },
          comparisonsCount: comparisons,
          swapsCount: swaps,
          writesCount: writes,
          accessesCount: accesses,
          recursionDepthCount: depth,
        });
      }
      return;
    }

    const pivotIdx = high;
    const pivotVal = arr[pivotIdx];
    accesses++;

    events.push({
      id: events.length,
      type: 'PIVOT_SELECT',
      operationName: `Select Pivot = ${pivotVal} at index ${pivotIdx}`,
      beginnerExplanation: `Chosen ${pivotVal} at index ${pivotIdx} as the pivot element for range [${low}..${high}]. We will partition all elements around it.`,
      technicalExplanation: `Selected pivot = arr[${pivotIdx}] = ${pivotVal}. Range to partition: [${low}..${high}]. Initializing partition boundary pointer i = ${low - 1}.`,
      pivotIndex: pivotIdx,
      secondaryIndices: [low, high],
      values: [pivotVal],
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      recursionDepth: depth,
      codeLineKey: 'quick_pivot_select',
      variables: { low, high, depth, pivotIndex: pivotIdx, pivotValue: pivotVal },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
      recursionDepthCount: depth,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses += 2;
      const condition = ascending ? arr[j] <= pivotVal : arr[j] >= pivotVal;

      events.push({
        id: events.length,
        type: 'COMPARE',
        operationName: `Compare arr[${j}] (${arr[j]}) with Pivot (${pivotVal})`,
        beginnerExplanation: `Checking if ${arr[j]} belongs to the ${ascending ? 'left (smaller)' : 'left (larger)'} side of the pivot. Condition is ${condition ? 'met' : 'not met'}.`,
        technicalExplanation: `Compare arr[${j}] (${arr[j]}) ${ascending ? '<=' : '>='} pivot (${pivotVal}) evaluated to ${condition}.`,
        indices: [j, pivotIdx],
        pivotIndex: pivotIdx,
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        recursionDepth: depth,
        codeLineKey: 'quick_compare',
        variables: { j, i, 'arr[j]': arr[j], pivotVal, condition },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });

      if (condition) {
        i++;
        if (i !== j) {
          swaps++;
          writes += 2;
          accesses += 2;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          events.push({
            id: events.length,
            type: 'SWAP',
            operationName: `Swap arr[${i}] and arr[${j}]`,
            beginnerExplanation: `Swapped ${arr[i]} and ${arr[j]} to expand the left partition of elements smaller than the pivot.`,
            technicalExplanation: `Incremented i to ${i}. Swapped arr[${i}] with arr[${j}]. Partition boundary moved right.`,
            indices: [i, j],
            pivotIndex: pivotIdx,
            secondaryIndices: [low, high],
            values: [arr[i], arr[j]],
            arraySnapshot: [...arr],
            sortedIndices: [...sortedIndices],
            recursionDepth: depth,
            codeLineKey: 'quick_swap_elements',
            variables: { i, j, 'arr[i]': arr[i], 'arr[j]': arr[j] },
            comparisonsCount: comparisons,
            swapsCount: swaps,
            writesCount: writes,
            accessesCount: accesses,
            recursionDepthCount: depth,
          });
        }
      }
    }

    // Place pivot at i + 1
    const finalPivotIdx = i + 1;
    swaps++;
    writes += 2;
    accesses += 2;
    const tempPivot = arr[finalPivotIdx];
    arr[finalPivotIdx] = arr[high];
    arr[high] = tempPivot;

    if (!sortedIndices.includes(finalPivotIdx)) {
      sortedIndices.push(finalPivotIdx);
    }

    events.push({
      id: events.length,
      type: 'SWAP',
      operationName: `Place Pivot ${arr[finalPivotIdx]} at index ${finalPivotIdx}`,
      beginnerExplanation: `Pivot ${arr[finalPivotIdx]} is moved between the smaller and larger elements! It is now in its exact final sorted position!`,
      technicalExplanation: `Pivot swap: placed pivot at partition point i + 1 = ${finalPivotIdx}. Pivot is now permanently in place.`,
      indices: [finalPivotIdx, high],
      pivotIndex: finalPivotIdx,
      secondaryIndices: [low, high],
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      recursionDepth: depth,
      codeLineKey: 'quick_pivot_place',
      variables: { finalPivotIdx, pivotValue: arr[finalPivotIdx] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
      recursionDepthCount: depth,
    });

    // Recurse left
    quickSortHelper(low, finalPivotIdx - 1, depth + 1);

    // Recurse right
    quickSortHelper(finalPivotIdx + 1, high, depth + 1);
  }

  quickSortHelper(0, n - 1, 0);

  // Mark all sorted
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Quick Sort Complete',
    beginnerExplanation: `Quick Sort completed! All partitions are sorted and pivot positions aligned.`,
    technicalExplanation: `Quick Sort finished. Total comparisons: ${comparisons}, swaps: ${swaps}, max call stack depth: ${maxRecursionDepth}.`,
    arraySnapshot: [...arr],
    sortedIndices: [...sortedIndices],
    codeLineKey: 'quick_complete',
    variables: { completed: true, totalComparisons: comparisons, totalSwaps: swaps },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
    recursionDepthCount: maxRecursionDepth,
  });

  return events;
}
