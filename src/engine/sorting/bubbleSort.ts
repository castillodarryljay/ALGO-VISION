import { TraceEvent } from '../../types/algorithm';

export function generateBubbleSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  // Initial event
  events.push({
    id: events.length,
    type: 'START',
    operationName: 'Start Bubble Sort',
    beginnerExplanation: `Starting Bubble Sort with ${n} elements. In each pass, adjacent elements are compared and swapped if they are in the wrong order.`,
    technicalExplanation: `Initialized Bubble Sort routine. Array size N = ${n}. Outer loop will run up to N-1 passes. Best time O(n), Worst time O(n²).`,
    arraySnapshot: [...arr],
    codeLineKey: 'bubble_start',
    variables: { n, pass: 0, swappedInPass: false },
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
      operationName: 'Sorted',
      beginnerExplanation: 'Array is trivially sorted because it has 1 or 0 elements.',
      technicalExplanation: 'Array size <= 1. Base condition satisfied immediately.',
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'bubble_complete',
      variables: { n, completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      accesses += 2;

      const shouldSwap = ascending ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1];

      // Comparison event
      events.push({
        id: events.length,
        type: 'COMPARE',
        operationName: `Compare elements at index ${j} and ${j + 1}`,
        beginnerExplanation: `Comparing ${arr[j]} and ${arr[j + 1]}. ${shouldSwap ? `${arr[j]} is larger than ${arr[j + 1]}, so they need to be swapped.` : `${arr[j]} is already in correct relative order with ${arr[j + 1]}, no swap needed.`}`,
        technicalExplanation: `Condition check: arr[${j}] (${arr[j]}) ${ascending ? '>' : '<'} arr[${j + 1}] (${arr[j + 1]}) evaluated to ${shouldSwap}.`,
        indices: [j, j + 1],
        values: [arr[j], arr[j + 1]],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        codeLineKey: 'bubble_compare',
        variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapped },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });

      if (shouldSwap) {
        swaps++;
        writes += 2;
        accesses += 2;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        events.push({
          id: events.length,
          type: 'SWAP',
          operationName: `Swap ${arr[j + 1]} and ${arr[j]}`,
          beginnerExplanation: `Swapping values: moving smaller element ${arr[j]} to the left and larger element ${arr[j + 1]} to the right.`,
          technicalExplanation: `Swap execution: swapped positions ${j} and ${j + 1}. Now arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}. Flag swapped set to true.`,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          codeLineKey: 'bubble_swap',
          variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapped: true },
          comparisonsCount: comparisons,
          swapsCount: swaps,
          writesCount: writes,
          accessesCount: accesses,
        });
      }
    }

    // Element at n - 1 - i is now in its final sorted position
    const sortedIdx = n - 1 - i;
    sortedIndices.push(sortedIdx);

    events.push({
      id: events.length,
      type: 'MARK_SORTED',
      operationName: `Index ${sortedIdx} sorted`,
      beginnerExplanation: `Value ${arr[sortedIdx]} has bubbled up to its correct final place at the end of the unsorted segment.`,
      technicalExplanation: `Pass ${i + 1} completed. Element at index ${sortedIdx} (${arr[sortedIdx]}) is confirmed in its final position.`,
      indices: [sortedIdx],
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'bubble_pass_done',
      variables: { i, sortedIndex: sortedIdx, swappedInPass: swapped },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });

    if (!swapped) {
      // Early termination optimization
      break;
    }
  }

  // Ensure all remaining elements are marked sorted
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) {
      sortedIndices.push(k);
    }
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Sorting Complete',
    beginnerExplanation: `All elements are sorted! Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    technicalExplanation: `Bubble Sort terminated. Array is fully sorted. Total comparisons: ${comparisons}, swaps: ${swaps}, array writes: ${writes}.`,
    arraySnapshot: [...arr],
    sortedIndices: [...sortedIndices],
    codeLineKey: 'bubble_complete',
    variables: { completed: true, totalComparisons: comparisons, totalSwaps: swaps },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
