import { TraceEvent } from '../../types/algorithm';

export function generateInsertionSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  let accesses = 0;
  const sortedIndices: number[] = [0];

  events.push({
    id: events.length,
    type: 'START',
    operationName: 'Start Insertion Sort',
    beginnerExplanation: `Starting Insertion Sort on ${n} elements. Like sorting playing cards in hand, each element is picked and inserted into its correct position among the already sorted items on its left.`,
    technicalExplanation: `Insertion Sort routine initialized. Size N = ${n}. In-place algorithm, adaptive O(n) best time for nearly sorted, O(n²) worst time.`,
    arraySnapshot: [...arr],
    codeLineKey: 'insert_start',
    variables: { n, activeIndex: 1 },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  if (n <= 1) {
    events.push({
      id: events.length,
      type: 'COMPLETE',
      operationName: 'Sorting Complete',
      beginnerExplanation: 'Array already sorted.',
      technicalExplanation: 'Trivially sorted for length <= 1.',
      arraySnapshot: [...arr],
      sortedIndices: [0],
      codeLineKey: 'insert_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    accesses++;
    let j = i - 1;

    events.push({
      id: events.length,
      type: 'PIVOT_SELECT',
      operationName: `Pick key element at index ${i}`,
      beginnerExplanation: `Picking element ${key} at index ${i} to insert into the sorted section [0..${i - 1}].`,
      technicalExplanation: `Key element key = arr[${i}] = ${key}. Examining backwards from index j = ${j}.`,
      pivotIndex: i,
      indices: [i],
      values: [key],
      arraySnapshot: [...arr],
      sortedIndices: [...sortedIndices],
      codeLineKey: 'insert_pick_key',
      variables: { i, j, key },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });

    while (j >= 0) {
      comparisons++;
      accesses++;
      const condition = ascending ? arr[j] > key : arr[j] < key;

      events.push({
        id: events.length,
        type: 'COMPARE',
        operationName: `Compare key (${key}) with arr[${j}] (${arr[j]})`,
        beginnerExplanation: `Comparing key ${key} with ${arr[j]}. ${condition ? `${arr[j]} is larger than key, so shift ${arr[j]} one position to the right.` : `${arr[j]} is smaller or equal, so key belongs immediately after index ${j}.`}`,
        technicalExplanation: `Testing while-loop condition: j >= 0 && arr[${j}] (${arr[j]}) ${ascending ? '>' : '<'} key (${key}). Evaluated to ${condition}.`,
        indices: [j, j + 1],
        pivotIndex: i,
        values: [arr[j], key],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        codeLineKey: 'insert_compare',
        variables: { i, j, key, 'arr[j]': arr[j], condition },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });

      if (!condition) {
        break;
      }

      // Shift element
      writes++;
      accesses++;
      swaps++;
      arr[j + 1] = arr[j];

      events.push({
        id: events.length,
        type: 'OVERWRITE',
        operationName: `Shift ${arr[j]} right into position ${j + 1}`,
        beginnerExplanation: `Shifted ${arr[j]} from position ${j} to position ${j + 1} to make room for key ${key}.`,
        technicalExplanation: `Assignment: arr[${j + 1}] = arr[${j}] (${arr[j]}). Decrementing j to ${j - 1}.`,
        indices: [j, j + 1],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        codeLineKey: 'insert_shift',
        variables: { i, j, key, shiftedValue: arr[j] },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });

      j--;
    }

    // Place key
    arr[j + 1] = key;
    writes++;

    events.push({
      id: events.length,
      type: 'OVERWRITE',
      operationName: `Insert key ${key} into index ${j + 1}`,
      beginnerExplanation: `Inserted key ${key} into its rightful position at index ${j + 1}.`,
      technicalExplanation: `Assignment: arr[${j + 1}] = key (${key}). Subarray [0..${i}] is now sorted.`,
      indices: [j + 1],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      codeLineKey: 'insert_place',
      variables: { i, insertedAt: j + 1, key },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });

    sortedIndices.push(i);
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Sorting Complete',
    beginnerExplanation: `Insertion Sort complete! Comparisons: ${comparisons}, Shifts/Swaps: ${swaps}.`,
    technicalExplanation: `Insertion Sort finished. Total comparisons: ${comparisons}, writes: ${writes}, shifts: ${swaps}.`,
    arraySnapshot: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    codeLineKey: 'insert_complete',
    variables: { completed: true, totalComparisons: comparisons, totalShaps: swaps },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
