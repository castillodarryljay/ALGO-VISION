import { TraceEvent } from '../../types/algorithm';

export function generateRadixSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
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
    operationName: 'Start Radix Sort (LSD)',
    beginnerExplanation: `Starting Radix Sort (LSD) on ${n} elements. Radix Sort processes integer numbers digit-by-digit, starting from the least significant digit (units place) to the most significant digit.`,
    technicalExplanation: `Radix Sort (Least Significant Digit) initialized. Handles signed integers by partitioning negatives and non-negatives. Time complexity O(d * (n + b)), where d is number of digits, b is base (10).`,
    arraySnapshot: [...arr],
    codeLineKey: 'radix_start',
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
      technicalExplanation: 'Trivially sorted for length <= 1.',
      arraySnapshot: [...arr],
      sortedIndices: n === 1 ? [0] : [],
      codeLineKey: 'radix_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  // Handle negatives by splitting into negative and non-negative
  const negatives = arr.filter(x => x < 0).map(x => -x);
  const nonNegatives = arr.filter(x => x >= 0);

  function sortNonNegatives(list: number[], isNegativePart: boolean): number[] {
    if (list.length === 0) return [];
    let max = Math.max(...list);
    let exp = 1;

    while (Math.floor(max / exp) > 0) {
      const output = new Array(list.length).fill(0);
      const count = new Array(10).fill(0);

      events.push({
        id: events.length,
        type: 'BUCKET_DISTRIBUTE',
        operationName: `Bucket pass for ${exp}'s digit position`,
        beginnerExplanation: `Examining digit at place value ${exp} for each number and placing them into buckets (0 through 9).`,
        technicalExplanation: `LSD counting sort pass with exp = ${exp}. Buckets 0-9 allocated.`,
        arraySnapshot: [...arr],
        codeLineKey: 'radix_bucket',
        variables: { exp, 'digitPlace': exp === 1 ? 'Units' : exp === 10 ? 'Tens' : exp === 100 ? 'Hundreds' : `${exp}s` },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });

      for (let i = 0; i < list.length; i++) {
        const digit = Math.floor(list[i] / exp) % 10;
        count[digit]++;
        accesses++;
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }

      for (let i = list.length - 1; i >= 0; i--) {
        const digit = Math.floor(list[i] / exp) % 10;
        output[count[digit] - 1] = list[i];
        count[digit]--;
        writes++;
        accesses++;
      }

      for (let i = 0; i < list.length; i++) {
        list[i] = output[i];
        writes++;
      }

      exp *= 10;
    }
    return list;
  }

  const sortedNegatives = sortNonNegatives([...negatives], true).reverse().map(x => -x);
  const sortedPositives = sortNonNegatives([...nonNegatives], false);

  const combined = ascending 
    ? [...sortedNegatives, ...sortedPositives]
    : [...sortedPositives.reverse(), ...sortedNegatives.reverse()];

  for (let i = 0; i < n; i++) {
    arr[i] = combined[i];
    writes++;
    events.push({
      id: events.length,
      type: 'OVERWRITE',
      operationName: `Collect value ${arr[i]} into final array`,
      beginnerExplanation: `Placed ${arr[i]} in position ${i} after digit aggregation.`,
      technicalExplanation: `Reconstructed array: arr[${i}] = ${arr[i]}.`,
      indices: [i],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      codeLineKey: 'radix_collect',
      variables: { i, value: arr[i] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Radix Sort Complete',
    beginnerExplanation: `Radix Sort complete! Elements sorted digit-by-digit.`,
    technicalExplanation: `Radix sort complete. Handled signed integers with stability.`,
    arraySnapshot: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    codeLineKey: 'radix_complete',
    variables: { completed: true, totalWrites: writes },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
