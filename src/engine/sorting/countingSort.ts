import { TraceEvent } from '../../types/algorithm';

export function generateCountingSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  let accesses = 0;

  events.push({
    id: events.length,
    type: 'START',
    operationName: 'Start Counting Sort',
    beginnerExplanation: `Starting Counting Sort on ${n} elements. Unlike comparison-based sorts, Counting Sort counts the occurrences of each distinct value, computes cumulative counts, and places items directly into their final positions in O(n + k) time.`,
    technicalExplanation: `Counting Sort initialized. Non-comparison integer sorting algorithm. Time complexity O(n + k), Auxiliary Space O(k) where k is range (max - min + 1). Stable sort.`,
    arraySnapshot: [...arr],
    codeLineKey: 'counting_start',
    variables: { n },
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
      technicalExplanation: 'Trivially sorted for size <= 1.',
      arraySnapshot: [...arr],
      sortedIndices: n === 1 ? [0] : [],
      codeLineKey: 'counting_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  const minVal = Math.min(...arr);
  const maxVal = Math.max(...arr);
  const range = maxVal - minVal + 1;

  if (range > 500) {
    events.push({
      id: events.length,
      type: 'COMPLETE',
      operationName: 'Range Limit Exceeded',
      beginnerExplanation: `Counting Sort range (${range} from ${minVal} to ${maxVal}) exceeds practical memory limit (500). Please use a dataset with values closer together.`,
      technicalExplanation: `Range k = max - min + 1 = ${range} exceeds interactive limit of 500. Space complexity O(k) would degrade browser memory.`,
      arraySnapshot: [...arr],
      codeLineKey: 'counting_start',
      variables: { minVal, maxVal, range, error: 'Range exceeds 500' },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  // Count frequencies
  const count = new Array(range).fill(0);

  events.push({
    id: events.length,
    type: 'COUNT_UPDATE',
    operationName: `Initialize frequency count array of size ${range}`,
    beginnerExplanation: `Created frequency counter from ${minVal} to ${maxVal} (size ${range}).`,
    technicalExplanation: `Allocated frequency array count[0..${range - 1}]. Range offset min = ${minVal}.`,
    arraySnapshot: [...arr],
    codeLineKey: 'counting_init_freq',
    variables: { minVal, maxVal, range, countLength: range },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  for (let i = 0; i < n; i++) {
    accesses++;
    const val = arr[i];
    const countIndex = val - minVal;
    count[countIndex]++;
    writes++;

    events.push({
      id: events.length,
      type: 'COUNT_UPDATE',
      operationName: `Tally value ${val} at index ${i}`,
      beginnerExplanation: `Saw number ${val}. Increased count for ${val} to ${count[countIndex]}.`,
      technicalExplanation: `Updated count[${val} - ${minVal}] to ${count[countIndex]}.`,
      indices: [i],
      arraySnapshot: [...arr],
      codeLineKey: 'counting_tally',
      variables: { i, value: val, currentTally: count[countIndex] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  // Cumulative counts
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
    writes++;
  }

  // Build output array
  const output = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    accesses += 2;
    const val = arr[i];
    const countIndex = val - minVal;
    const outPos = count[countIndex] - 1;
    output[outPos] = val;
    count[countIndex]--;
    writes += 2;
  }

  // Reverse if descending
  const finalSorted = ascending ? output : [...output].reverse();

  // Copy to arr with trace events
  for (let k = 0; k < n; k++) {
    arr[k] = finalSorted[k];
    writes++;
    events.push({
      id: events.length,
      type: 'OVERWRITE',
      operationName: `Place element ${arr[k]} into position ${k}`,
      beginnerExplanation: `Placed sorted number ${arr[k]} into its final position at index ${k}.`,
      technicalExplanation: `Written to arr[${k}] = ${arr[k]} from cumulative placement index.`,
      indices: [k],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: k + 1 }, (_, idx) => idx),
      codeLineKey: 'counting_place',
      variables: { k, placedValue: arr[k] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Counting Sort Complete',
    beginnerExplanation: `Counting Sort complete! All values positioned without comparing elements directly against each other.`,
    technicalExplanation: `Counting Sort finished. Total writes: ${writes}, accesses: ${accesses}. Time complexity: O(n + k).`,
    arraySnapshot: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    codeLineKey: 'counting_complete',
    variables: { completed: true, totalWrites: writes },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
