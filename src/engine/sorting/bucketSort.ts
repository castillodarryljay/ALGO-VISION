import { TraceEvent } from '../../types/algorithm';

export function generateBucketSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
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
    operationName: 'Start Bucket Sort',
    beginnerExplanation: `Starting Bucket Sort on ${n} elements. Elements are distributed into a set of buckets based on their values. Each bucket is individually sorted, then all buckets are concatenated together.`,
    technicalExplanation: `Bucket Sort initialized. Assumes reasonably uniform distribution. Average time O(n + k), worst time O(n²), Space O(n + k).`,
    arraySnapshot: [...arr],
    codeLineKey: 'bucket_start',
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
      codeLineKey: 'bucket_complete',
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
  const bucketCount = Math.max(3, Math.min(n, 7));
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  const range = (maxVal - minVal) || 1;

  events.push({
    id: events.length,
    type: 'BUCKET_DISTRIBUTE',
    operationName: `Create ${bucketCount} buckets for range [${minVal}..${maxVal}]`,
    beginnerExplanation: `Initialized ${bucketCount} empty buckets to partition the numbers across value intervals.`,
    technicalExplanation: `Allocated ${bucketCount} buckets. Range = ${range}. Bucket width = ${(range / bucketCount).toFixed(2)}.`,
    arraySnapshot: [...arr],
    codeLineKey: 'bucket_allocate',
    variables: { bucketCount, minVal, maxVal, range },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  // Distribute
  for (let i = 0; i < n; i++) {
    accesses++;
    const val = arr[i];
    let bucketIdx = Math.floor(((val - minVal) / range) * (bucketCount - 1));
    if (bucketIdx >= bucketCount) bucketIdx = bucketCount - 1;
    buckets[bucketIdx].push(val);
    writes++;

    events.push({
      id: events.length,
      type: 'BUCKET_DISTRIBUTE',
      operationName: `Distribute element ${val} into Bucket ${bucketIdx}`,
      beginnerExplanation: `Placed element ${val} from index ${i} into Bucket #${bucketIdx}.`,
      technicalExplanation: `Calculated bucket index for ${val}: Math.floor(((${val} - ${minVal}) / ${range}) * ${bucketCount - 1}) = ${bucketIdx}.`,
      indices: [i],
      arraySnapshot: [...arr],
      codeLineKey: 'bucket_insert',
      variables: { i, value: val, bucketIdx, bucketContents: [...buckets[bucketIdx]] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  // Sort each bucket and gather
  const gathered: number[] = [];
  for (let b = 0; b < bucketCount; b++) {
    buckets[b].sort((a, bVal) => a - bVal);
    for (const val of buckets[b]) {
      gathered.push(val);
    }
  }

  const finalOrder = ascending ? gathered : [...gathered].reverse();

  for (let i = 0; i < n; i++) {
    arr[i] = finalOrder[i];
    writes++;

    events.push({
      id: events.length,
      type: 'BUCKET_GATHER',
      operationName: `Gather sorted element ${arr[i]} into main array at index ${i}`,
      beginnerExplanation: `Extracted sorted element ${arr[i]} from buckets and written to output index ${i}.`,
      technicalExplanation: `Gather pass: arr[${i}] = ${arr[i]}.`,
      indices: [i],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      codeLineKey: 'bucket_gather',
      variables: { i, gatheredValue: arr[i] },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Bucket Sort Complete',
    beginnerExplanation: `Bucket Sort finished! All buckets merged into the sorted array.`,
    technicalExplanation: `Bucket Sort terminated. Total writes: ${writes}. Time complexity: O(n + k).`,
    arraySnapshot: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    codeLineKey: 'bucket_complete',
    variables: { completed: true, totalWrites: writes },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
