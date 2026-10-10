import { TraceEvent } from '../../types/algorithm';

export interface MergeTreeNode {
  id: string;
  parentId?: string;
  start: number;
  end: number;
  depth: number;
  array: number[];
  leftId?: string;
  rightId?: string;
  status: 'pending' | 'splitting' | 'split_done' | 'merging' | 'merged';
}

export function generateMergeSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let writes = 0;
  let accesses = 0;
  let maxRecursionDepth = 0;

  events.push({
    id: events.length,
    type: 'START',
    operationName: 'Start Merge Sort',
    beginnerExplanation: `Merge Sort starts with ${n} elements. It uses Divide and Conquer: recursively dividing the array in halves until each subarray has 1 element, then merging them back in sorted order.`,
    technicalExplanation: `Merge Sort initialized. Array size N = ${n}. Recurrence relation T(n) = 2T(n/2) + O(n). Guaranteed O(n log n) time in all cases, O(n) auxiliary space.`,
    arraySnapshot: [...arr],
    codeLineKey: 'merge_start',
    variables: { n, low: 0, high: n - 1, depth: 0 },
    recursionDepth: 0,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
    recursionDepthCount: 0,
  });

  if (n <= 1) {
    events.push({
      id: events.length,
      type: 'COMPLETE',
      operationName: 'Sorting Complete',
      beginnerExplanation: 'Array already sorted (size <= 1).',
      technicalExplanation: 'Trivially sorted for length <= 1.',
      arraySnapshot: [...arr],
      sortedIndices: n === 1 ? [0] : [],
      codeLineKey: 'merge_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
      recursionDepthCount: 0,
    });
    return events;
  }

  function mergeSortHelper(low: number, high: number, depth: number, parentNodeId?: string): void {
    if (depth > maxRecursionDepth) maxRecursionDepth = depth;
    const nodeId = `node_${low}_${high}_${depth}`;

    if (low >= high) {
      events.push({
        id: events.length,
        type: 'SPLIT',
        operationName: `Base Case: Subarray [${low}..${high}] has 1 element`,
        beginnerExplanation: `Subarray has only 1 element (${arr[low]}). A single element is already sorted by definition, so we return it!`,
        technicalExplanation: `Base case reached at depth ${depth}: low (${low}) >= high (${high}). Subarray length = 1.`,
        indices: [low],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        recursionDepth: depth,
        treeNodeId: nodeId,
        codeLineKey: 'merge_base_case',
        variables: { low, high, depth, element: arr[low] },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });
      return;
    }

    const mid = Math.floor((low + high) / 2);

    events.push({
      id: events.length,
      type: 'SPLIT',
      operationName: `Calculate Midpoint & Divide [${low}..${high}]`,
      beginnerExplanation: `Dividing range [${low}..${high}] into two halves: Left half [${low}..${mid}] and Right half [${mid + 1}..${high}]. Midpoint is at index ${mid}.`,
      technicalExplanation: `Divide step: mid = floor((${low} + ${high}) / 2) = ${mid}. Left slice: arr[${low}..${mid}] (${arr.slice(low, mid + 1).join(', ')}), Right slice: arr[${mid + 1}..${high}] (${arr.slice(mid + 1, high + 1).join(', ')}).`,
      pivotIndex: mid,
      secondaryIndices: [low, high],
      arraySnapshot: [...arr],
      recursionDepth: depth,
      treeNodeId: nodeId,
      codeLineKey: 'merge_split',
      subarrays: {
        left: arr.slice(low, mid + 1),
        right: arr.slice(mid + 1, high + 1),
        merged: [],
        leftRange: [low, mid],
        rightRange: [mid + 1, high],
      },
      variables: { low, mid, high, depth, leftLen: mid - low + 1, rightLen: high - mid },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
      recursionDepthCount: depth,
    });

    // Recursively sort left half
    mergeSortHelper(low, mid, depth + 1, nodeId);

    // Recursively sort right half
    mergeSortHelper(mid + 1, high, depth + 1, nodeId);

    // Merge the two halves
    merge(low, mid, high, depth, nodeId);
  }

  function merge(low: number, mid: number, high: number, depth: number, nodeId: string): void {
    const leftPart = arr.slice(low, mid + 1);
    const rightPart = arr.slice(mid + 1, high + 1);
    const tempMerged: number[] = [];

    events.push({
      id: events.length,
      type: 'MERGE_START',
      operationName: `Start Merging [${low}..${mid}] and [${mid + 1}..${high}]`,
      beginnerExplanation: `Now merging the two sorted halves: Left [${leftPart.join(', ')}] and Right [${rightPart.join(', ')}] into a single sorted sequence.`,
      technicalExplanation: `Conquer step: merging sorted subarrays arr[${low}..${mid}] and arr[${mid + 1}..${high}]. Initializing pointers i = ${low}, j = ${mid + 1}.`,
      secondaryIndices: [low, high],
      arraySnapshot: [...arr],
      recursionDepth: depth,
      treeNodeId: nodeId,
      codeLineKey: 'merge_combine',
      subarrays: {
        left: leftPart,
        right: rightPart,
        merged: [],
        leftRange: [low, mid],
        rightRange: [mid + 1, high],
      },
      variables: { low, mid, high, depth, leftPart, rightPart },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
      recursionDepthCount: depth,
    });

    let i = low;
    let j = mid + 1;

    while (i <= mid && j <= high) {
      comparisons++;
      accesses += 2;
      const takeLeft = ascending ? arr[i] <= arr[j] : arr[i] >= arr[j];

      events.push({
        id: events.length,
        type: 'COMPARE',
        operationName: `Compare left element ${arr[i]} with right element ${arr[j]}`,
        beginnerExplanation: `Comparing left element ${arr[i]} at index ${i} with right element ${arr[j]} at index ${j}. ${takeLeft ? `Taking ${arr[i]} from the left half because it is ${ascending ? 'smaller or equal' : 'larger or equal'}.` : `Taking ${arr[j]} from the right half because it is ${ascending ? 'smaller' : 'larger'}.`}`,
        technicalExplanation: `Comparison: arr[${i}] (${arr[i]}) ${ascending ? '<=' : '>='} arr[${j}] (${arr[j]}). Condition is ${takeLeft}.`,
        indices: [i, j],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        recursionDepth: depth,
        treeNodeId: nodeId,
        codeLineKey: 'merge_compare',
        subarrays: {
          left: leftPart,
          right: rightPart,
          merged: [...tempMerged],
          leftRange: [low, mid],
          rightRange: [mid + 1, high],
        },
        variables: { i, j, 'arr[i]': arr[i], 'arr[j]': arr[j], takeLeft },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });

      if (takeLeft) {
        tempMerged.push(arr[i]);
        i++;
      } else {
        tempMerged.push(arr[j]);
        j++;
      }

      events.push({
        id: events.length,
        type: 'MERGE_STEP',
        operationName: `Append ${tempMerged[tempMerged.length - 1]} to temporary merged buffer`,
        beginnerExplanation: `Added ${tempMerged[tempMerged.length - 1]} to the merged buffer. Current buffer: [${tempMerged.join(', ')}].`,
        technicalExplanation: `Appended element to auxiliary array. Auxiliary buffer length: ${tempMerged.length}.`,
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        recursionDepth: depth,
        treeNodeId: nodeId,
        codeLineKey: 'merge_append',
        subarrays: {
          left: leftPart,
          right: rightPart,
          merged: [...tempMerged],
          leftRange: [low, mid],
          rightRange: [mid + 1, high],
        },
        variables: { tempMerged: [...tempMerged], i, j },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });
    }

    // Remainder from left
    while (i <= mid) {
      accesses++;
      tempMerged.push(arr[i]);
      events.push({
        id: events.length,
        type: 'MERGE_STEP',
        operationName: `Copy remaining left element ${arr[i]}`,
        beginnerExplanation: `Right half is exhausted. Copying remaining element ${arr[i]} from left half into the merged buffer.`,
        technicalExplanation: `Exhaustion copy: copying remaining arr[${i}] (${arr[i]}) into temporary buffer.`,
        indices: [i],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        recursionDepth: depth,
        treeNodeId: nodeId,
        codeLineKey: 'merge_copy_rem',
        subarrays: {
          left: leftPart,
          right: rightPart,
          merged: [...tempMerged],
          leftRange: [low, mid],
          rightRange: [mid + 1, high],
        },
        variables: { i, copiedValue: arr[i] },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });
      i++;
    }

    // Remainder from right
    while (j <= high) {
      accesses++;
      tempMerged.push(arr[j]);
      events.push({
        id: events.length,
        type: 'MERGE_STEP',
        operationName: `Copy remaining right element ${arr[j]}`,
        beginnerExplanation: `Left half is exhausted. Copying remaining element ${arr[j]} from right half into the merged buffer.`,
        technicalExplanation: `Exhaustion copy: copying remaining arr[${j}] (${arr[j]}) into temporary buffer.`,
        indices: [j],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        recursionDepth: depth,
        treeNodeId: nodeId,
        codeLineKey: 'merge_copy_rem',
        subarrays: {
          left: leftPart,
          right: rightPart,
          merged: [...tempMerged],
          leftRange: [low, mid],
          rightRange: [mid + 1, high],
        },
        variables: { j, copiedValue: arr[j] },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });
      j++;
    }

    // Write back to main array
    for (let k = 0; k < tempMerged.length; k++) {
      writes++;
      arr[low + k] = tempMerged[k];
      events.push({
        id: events.length,
        type: 'OVERWRITE',
        operationName: `Write back ${tempMerged[k]} to main array at index ${low + k}`,
        beginnerExplanation: `Writing the merged sorted value ${tempMerged[k]} back into main array slot ${low + k}.`,
        technicalExplanation: `In-place copy back: arr[${low + k}] = temp[${k}] (${tempMerged[k]}).`,
        indices: [low + k],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        recursionDepth: depth,
        treeNodeId: nodeId,
        codeLineKey: 'merge_write_back',
        subarrays: {
          left: leftPart,
          right: rightPart,
          merged: tempMerged,
          leftRange: [low, mid],
          rightRange: [mid + 1, high],
        },
        variables: { index: low + k, writtenValue: tempMerged[k] },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
        recursionDepthCount: depth,
      });
    }

    events.push({
      id: events.length,
      type: 'MERGE_COMPLETE',
      operationName: `Completed Merge for range [${low}..${high}]`,
      beginnerExplanation: `Merged range [${low}..${high}] is now sorted: [${arr.slice(low, high + 1).join(', ')}].`,
      technicalExplanation: `Merge step resolved for range [${low}..${high}]. Subarray slice is sorted and synchronized.`,
      secondaryIndices: [low, high],
      arraySnapshot: [...arr],
      sortedIndices: depth === 0 ? Array.from({ length: n }, (_, idx) => idx) : [],
      recursionDepth: depth,
      treeNodeId: nodeId,
      codeLineKey: 'merge_done',
      subarrays: {
        left: leftPart,
        right: rightPart,
        merged: tempMerged,
        leftRange: [low, mid],
        rightRange: [mid + 1, high],
      },
      variables: { low, high, sortedSlice: arr.slice(low, high + 1) },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
      recursionDepthCount: depth,
    });
  }

  mergeSortHelper(0, n - 1, 0);

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Merge Sort Complete',
    beginnerExplanation: `Merge Sort finished successfully! All recursive branches have merged back into the completely sorted array.`,
    technicalExplanation: `Merge Sort terminated. Total comparisons: ${comparisons}, writes: ${writes}, max depth: ${maxRecursionDepth}. Time complexity: Θ(n log n).`,
    arraySnapshot: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    codeLineKey: 'merge_complete',
    variables: { completed: true, totalComparisons: comparisons, maxDepth: maxRecursionDepth },
    recursionDepth: 0,
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
    recursionDepthCount: maxRecursionDepth,
  });

  return events;
}
