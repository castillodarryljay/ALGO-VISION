import { TraceEvent } from '../../types/algorithm';

export function isArraySortedAscending(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

export function generateLinearSearchTrace(initialArray: number[], target: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let accesses = 0;

  events.push({
    id: events.length,
    type: 'START',
    operationName: `Start Linear Search for Target = ${target}`,
    beginnerExplanation: `Looking for target value ${target} in an array of ${n} elements. Linear Search sequentially checks each element one by one from left to right.`,
    technicalExplanation: `Linear Search initialized. Target = ${target}, Array size = ${n}. Best case O(1), Worst/Average O(n). Does not require sorted input.`,
    arraySnapshot: [...arr],
    codeLineKey: 'linear_start',
    variables: { target, n, currentIndex: 0 },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: 0,
    accessesCount: accesses,
  });

  let foundIndex = -1;

  for (let i = 0; i < n; i++) {
    comparisons++;
    accesses++;
    const match = arr[i] === target;

    events.push({
      id: events.length,
      type: 'SEARCH_EXAMINE',
      operationName: `Check element at index ${i} (value ${arr[i]})`,
      beginnerExplanation: `Checking if element at index ${i} (${arr[i]}) matches target ${target}. ${match ? 'Yes! We found a match!' : 'No match, continue to next index.'}`,
      technicalExplanation: `Equality check: arr[${i}] (${arr[i]}) === target (${target}). Evaluated to ${match}.`,
      indices: [i],
      values: [arr[i], target],
      arraySnapshot: [...arr],
      codeLineKey: 'linear_compare',
      variables: { i, 'arr[i]': arr[i], target, match },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });

    if (match) {
      foundIndex = i;
      events.push({
        id: events.length,
        type: 'TARGET_FOUND',
        operationName: `Target ${target} found at index ${i}`,
        beginnerExplanation: `Success! Target value ${target} was found at index ${i}. Search terminates early.`,
        technicalExplanation: `Target found at index ${i}. Returning index ${i}. Total comparisons: ${comparisons}.`,
        indices: [i],
        values: [target],
        arraySnapshot: [...arr],
        sortedIndices: [i],
        codeLineKey: 'linear_found',
        variables: { target, foundIndex: i, comparisons },
        comparisonsCount: comparisons,
        swapsCount: 0,
        writesCount: 0,
        accessesCount: accesses,
      });
      break;
    }
  }

  if (foundIndex === -1) {
    events.push({
      id: events.length,
      type: 'TARGET_NOT_FOUND',
      operationName: `Target ${target} not found in array`,
      beginnerExplanation: `Reached the end of the array without finding ${target}. The target is absent from this dataset.`,
      technicalExplanation: `Exhausted search space of ${n} elements. Returning -1. Total comparisons: ${comparisons}.`,
      arraySnapshot: [...arr],
      codeLineKey: 'linear_not_found',
      variables: { target, foundIndex: -1, comparisons },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });
  }

  return events;
}

export function generateBinarySearchTrace(initialArray: number[], target: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let accesses = 0;

  const isSorted = isArraySortedAscending(arr);

  events.push({
    id: events.length,
    type: 'START',
    operationName: `Start Binary Search for Target = ${target}`,
    beginnerExplanation: `Binary Search finds target ${target} by repeatedly dividing the search interval in half. ${!isSorted ? 'WARNING: The input is not sorted! Binary Search requires sorted input to guarantee correctness.' : 'The array is sorted, ready to search.'}`,
    technicalExplanation: `Binary Search initialized. Target = ${target}. Array sorted check: ${isSorted}. Time complexity O(log n), Space O(1).`,
    arraySnapshot: [...arr],
    codeLineKey: 'binary_start',
    variables: { target, n, low: 0, high: n - 1, isSorted },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: 0,
    accessesCount: accesses,
  });

  let low = 0;
  let high = n - 1;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    accesses++;
    const midVal = arr[mid];

    events.push({
      id: events.length,
      type: 'SEARCH_BOUNDS',
      operationName: `Current range [${low}..${high}], Midpoint index ${mid} (${midVal})`,
      beginnerExplanation: `Narrowed search to indices ${low} through ${high}. Inspecting middle element at index ${mid} with value ${midVal}.`,
      technicalExplanation: `Search boundaries: low = ${low}, high = ${high}. Midpoint = floor((${low} + ${high}) / 2) = ${mid}, arr[mid] = ${midVal}.`,
      indices: [mid],
      secondaryIndices: [low, high],
      pivotIndex: mid,
      values: [midVal, target],
      arraySnapshot: [...arr],
      codeLineKey: 'binary_calc_mid',
      variables: { low, high, mid, midVal, target },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });

    comparisons++;
    if (midVal === target) {
      foundIndex = mid;
      events.push({
        id: events.length,
        type: 'TARGET_FOUND',
        operationName: `Target ${target} matches middle element at index ${mid}`,
        beginnerExplanation: `Bingo! Target value ${target} is equal to the middle element at index ${mid}!`,
        technicalExplanation: `arr[${mid}] === target (${target}). Match found. Returning index ${mid}.`,
        indices: [mid],
        sortedIndices: [mid],
        arraySnapshot: [...arr],
        codeLineKey: 'binary_found',
        variables: { foundIndex: mid, comparisons },
        comparisonsCount: comparisons,
        swapsCount: 0,
        writesCount: 0,
        accessesCount: accesses,
      });
      break;
    }

    comparisons++;
    if (midVal < target) {
      events.push({
        id: events.length,
        type: 'SEARCH_EXAMINE',
        operationName: `${midVal} is less than ${target} -> Discard left half`,
        beginnerExplanation: `Because middle value ${midVal} is less than ${target}, the target must be in the right half (if it exists). Moving low boundary to ${mid + 1}.`,
        technicalExplanation: `arr[${mid}] (${midVal}) < target (${target}). Shifting search window: low = mid + 1 = ${mid + 1}.`,
        indices: [mid],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        codeLineKey: 'binary_shift_right',
        variables: { oldLow: low, newLow: mid + 1, high },
        comparisonsCount: comparisons,
        swapsCount: 0,
        writesCount: 0,
        accessesCount: accesses,
      });
      low = mid + 1;
    } else {
      events.push({
        id: events.length,
        type: 'SEARCH_EXAMINE',
        operationName: `${midVal} is greater than ${target} -> Discard right half`,
        beginnerExplanation: `Because middle value ${midVal} is greater than ${target}, the target must be in the left half. Moving high boundary to ${mid - 1}.`,
        technicalExplanation: `arr[${mid}] (${midVal}) > target (${target}). Shifting search window: high = mid - 1 = ${mid - 1}.`,
        indices: [mid],
        secondaryIndices: [low, high],
        arraySnapshot: [...arr],
        codeLineKey: 'binary_shift_left',
        variables: { low, oldHigh: high, newHigh: mid - 1 },
        comparisonsCount: comparisons,
        swapsCount: 0,
        writesCount: 0,
        accessesCount: accesses,
      });
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    events.push({
      id: events.length,
      type: 'TARGET_NOT_FOUND',
      operationName: `Target ${target} not found`,
      beginnerExplanation: `The search boundaries crossed (low > high). Target ${target} does not exist in this array.`,
      technicalExplanation: `Search interval became empty (low ${low} > high ${high}). Returning -1. Total comparisons: ${comparisons}.`,
      arraySnapshot: [...arr],
      codeLineKey: 'binary_not_found',
      variables: { foundIndex: -1, comparisons },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });
  }

  return events;
}

export function generateJumpSearchTrace(initialArray: number[], target: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let accesses = 0;
  const isSorted = isArraySortedAscending(arr);

  events.push({
    id: events.length,
    type: 'START',
    operationName: `Start Jump Search for Target = ${target}`,
    beginnerExplanation: `Jump Search skips ahead by a block size of √n (${Math.floor(Math.sqrt(n))}) elements until it finds an element larger than target, then performs linear search within that block. ${!isSorted ? '(Requires sorted input)' : ''}`,
    technicalExplanation: `Jump Search initialized. Step size m = floor(sqrt(${n})) = ${Math.floor(Math.sqrt(n))}. Time complexity O(√n), Space O(1).`,
    arraySnapshot: [...arr],
    codeLineKey: 'jump_start',
    variables: { target, n, step: Math.floor(Math.sqrt(n)), isSorted },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: 0,
    accessesCount: accesses,
  });

  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0;
  let current = step;

  while (current < n && arr[Math.min(n, current) - 1] < target) {
    comparisons++;
    accesses++;
    events.push({
      id: events.length,
      type: 'SEARCH_BOUNDS',
      operationName: `Jump from index ${prev} to ${current}`,
      beginnerExplanation: `Element at index ${Math.min(n, current) - 1} (${arr[Math.min(n, current) - 1]}) is less than target ${target}. Jumping ahead by ${step} elements!`,
      technicalExplanation: `arr[${current - 1}] (${arr[current - 1]}) < target (${target}). Advancing block.`,
      indices: [Math.min(n, current) - 1],
      secondaryIndices: [prev, Math.min(n, current) - 1],
      arraySnapshot: [...arr],
      codeLineKey: 'jump_step',
      variables: { prev, current, step },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });

    prev = current;
    current += step;
  }

  events.push({
    id: events.length,
    type: 'SEARCH_BOUNDS',
    operationName: `Target in block [${prev}..${Math.min(n - 1, current - 1)}]`,
    beginnerExplanation: `Target is bounded within block from index ${prev} to ${Math.min(n - 1, current - 1)}. Beginning linear scan within this block.`,
    technicalExplanation: `Linear search within block [${prev}..${Math.min(n - 1, current - 1)}].`,
    secondaryIndices: [prev, Math.min(n - 1, current - 1)],
    arraySnapshot: [...arr],
    codeLineKey: 'jump_linear_scan',
    variables: { prev, bound: Math.min(n - 1, current - 1) },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: 0,
    accessesCount: accesses,
  });

  let foundIndex = -1;
  const limit = Math.min(n, current);

  for (let i = prev; i < limit; i++) {
    comparisons++;
    accesses++;
    if (arr[i] === target) {
      foundIndex = i;
      events.push({
        id: events.length,
        type: 'TARGET_FOUND',
        operationName: `Target ${target} found at index ${i}`,
        beginnerExplanation: `Found target ${target} at index ${i} inside the current block!`,
        technicalExplanation: `Linear scan matched at index ${i}. Total comparisons: ${comparisons}.`,
        indices: [i],
        sortedIndices: [i],
        arraySnapshot: [...arr],
        codeLineKey: 'jump_found',
        variables: { foundIndex: i, comparisons },
        comparisonsCount: comparisons,
        swapsCount: 0,
        writesCount: 0,
        accessesCount: accesses,
      });
      break;
    }
  }

  if (foundIndex === -1) {
    events.push({
      id: events.length,
      type: 'TARGET_NOT_FOUND',
      operationName: `Target ${target} not found`,
      beginnerExplanation: `Scanned the candidate block and target ${target} was not found.`,
      technicalExplanation: `Target absent from block. Returning -1. Total comparisons: ${comparisons}.`,
      arraySnapshot: [...arr],
      codeLineKey: 'jump_not_found',
      variables: { foundIndex: -1, comparisons },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });
  }

  return events;
}

export function generateInterpolationSearchTrace(initialArray: number[], target: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let accesses = 0;

  events.push({
    id: events.length,
    type: 'START',
    operationName: `Start Interpolation Search for Target = ${target}`,
    beginnerExplanation: `Interpolation Search estimates the probe position based on the value of the target relative to the endpoint values (like looking up a word in a physical dictionary). Requires uniformly distributed sorted data.`,
    technicalExplanation: `Interpolation Search initialized. Uses formula pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low])). Average O(log log n), worst case O(n).`,
    arraySnapshot: [...arr],
    codeLineKey: 'interp_start',
    variables: { target, n, low: 0, high: n - 1 },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: 0,
    accessesCount: accesses,
  });

  let low = 0;
  let high = n - 1;
  let foundIndex = -1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    accesses += 2;
    if (arr[high] === arr[low]) {
      comparisons++;
      if (arr[low] === target) foundIndex = low;
      break;
    }

    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
    accesses++;
    const posVal = arr[pos];

    events.push({
      id: events.length,
      type: 'SEARCH_BOUNDS',
      operationName: `Calculated probe position pos = ${pos} (value ${posVal})`,
      beginnerExplanation: `Using interpolation formula, probed position index ${pos} with value ${posVal}. Range is [${low}..${high}].`,
      technicalExplanation: `Formula probe at index ${pos}. arr[${pos}] = ${posVal}. Range arr[${low}]=${arr[low]} to arr[${high}]=${arr[high]}.`,
      indices: [pos],
      secondaryIndices: [low, high],
      pivotIndex: pos,
      arraySnapshot: [...arr],
      codeLineKey: 'interp_probe',
      variables: { low, high, pos, posVal, target },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });

    comparisons++;
    if (posVal === target) {
      foundIndex = pos;
      events.push({
        id: events.length,
        type: 'TARGET_FOUND',
        operationName: `Target ${target} found at probe index ${pos}`,
        beginnerExplanation: `Target ${target} matches the probed element at index ${pos}!`,
        technicalExplanation: `arr[${pos}] === target (${target}). Target found in ${comparisons} comparisons.`,
        indices: [pos],
        sortedIndices: [pos],
        arraySnapshot: [...arr],
        codeLineKey: 'interp_found',
        variables: { foundIndex: pos, comparisons },
        comparisonsCount: comparisons,
        swapsCount: 0,
        writesCount: 0,
        accessesCount: accesses,
      });
      break;
    }

    comparisons++;
    if (posVal < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }

  if (foundIndex === -1) {
    events.push({
      id: events.length,
      type: 'TARGET_NOT_FOUND',
      operationName: `Target ${target} not found`,
      beginnerExplanation: `Target ${target} fell outside the search bounds or was absent.`,
      technicalExplanation: `Search bounds exceeded. Returning -1. Total comparisons: ${comparisons}.`,
      arraySnapshot: [...arr],
      codeLineKey: 'interp_not_found',
      variables: { foundIndex: -1, comparisons },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: 0,
      accessesCount: accesses,
    });
  }

  return events;
}

export function generateSentinelSearchTrace(initialArray: number[], target: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let accesses = 0;
  let writes = 0;

  events.push({
    id: events.length,
    type: 'START',
    operationName: `Start Sentinel Linear Search for Target = ${target}`,
    beginnerExplanation: `Starting Sentinel Linear Search for ${target}. By placing the target at the end as a 'sentinel', the loop never has to check array bounds (i < n) at every step!`,
    technicalExplanation: `Sentinel Search initialized. Overwrites the last element arr[${n - 1}] with target ${target} to eliminate loop index condition check, reducing comparison operations by ~50%. Time O(n), Space O(1).`,
    arraySnapshot: [...arr],
    codeLineKey: 'sentinel_start',
    variables: { target, n },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: writes,
    accessesCount: accesses,
  });

  if (n === 0) {
    events.push({
      id: events.length,
      type: 'TARGET_NOT_FOUND',
      operationName: `Empty array: Target ${target} not found`,
      beginnerExplanation: `Array is empty, search terminated immediately.`,
      technicalExplanation: `Array size N = 0. Returning -1.`,
      arraySnapshot: [],
      codeLineKey: 'sentinel_not_found',
      variables: { foundIndex: -1 },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  // Save the last element
  const lastVal = arr[n - 1];
  accesses++;

  // Set sentinel
  arr[n - 1] = target;
  writes++;

  events.push({
    id: events.length,
    type: 'OVERWRITE',
    operationName: `Set Sentinel at index ${n - 1}: arr[${n - 1}] = ${target} (Original: ${lastVal})`,
    beginnerExplanation: `Temporarily replaced the last element (${lastVal}) with our target value (${target}). This guarantees the search loop will find ${target} without needing an 'i < n' boundary check.`,
    technicalExplanation: `Saved original last element (${lastVal}). Injected sentinel arr[${n - 1}] = ${target}. Loop condition simplifies to while (arr[i] !== target).`,
    indices: [n - 1],
    values: [target, lastVal],
    pivotIndex: n - 1,
    arraySnapshot: [...arr],
    codeLineKey: 'sentinel_place',
    variables: { lastVal, sentinelIndex: n - 1, target },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: writes,
    accessesCount: accesses,
  });

  let i = 0;
  while (arr[i] !== target) {
    comparisons++;
    accesses++;
    events.push({
      id: events.length,
      type: 'SEARCH_EXAMINE',
      operationName: `Check arr[${i}] (${arr[i]}) === target (${target}) [No bound check needed!]`,
      beginnerExplanation: `Inspecting index ${i} with value ${arr[i]}. It is not equal to ${target}. Moving to next index without checking if i < ${n}.`,
      technicalExplanation: `Only 1 comparison executed per iteration (value equality) rather than 2 (index bound check + value equality).`,
      indices: [i],
      values: [arr[i], target],
      pivotIndex: n - 1,
      arraySnapshot: [...arr],
      codeLineKey: 'sentinel_loop',
      variables: { i, 'arr[i]': arr[i], target },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: writes,
      accessesCount: accesses,
    });
    i++;
  }

  // Loop termination comparison
  comparisons++;
  accesses++;

  // Restore the original element
  arr[n - 1] = lastVal;
  writes++;

  events.push({
    id: events.length,
    type: 'OVERWRITE',
    operationName: `Loop stopped at index ${i}. Restore original arr[${n - 1}] = ${lastVal}`,
    beginnerExplanation: `The search hit ${target} at index ${i}! Now we restore the original element (${lastVal}) at the end.`,
    technicalExplanation: `Exited sentinel loop. Restored arr[${n - 1}] = original (${lastVal}). Now verifying if match was before sentinel or was the original last element.`,
    indices: [n - 1],
    values: [lastVal],
    arraySnapshot: [...arr],
    codeLineKey: 'sentinel_restore',
    variables: { stopIndex: i, restoredLastVal: lastVal },
    comparisonsCount: comparisons,
    swapsCount: 0,
    writesCount: writes,
    accessesCount: accesses,
  });

  // Verify match
  comparisons++;
  const found = i < n - 1 || lastVal === target;

  if (found) {
    events.push({
      id: events.length,
      type: 'TARGET_FOUND',
      operationName: `Target ${target} verified at index ${i}!`,
      beginnerExplanation: `Target ${target} was found at index ${i}! Sentinel Search succeeded in fewer CPU cycles.`,
      technicalExplanation: `Condition (i < n - 1 || lastVal === target) evaluated to true. Returning index ${i}. Total comparisons: ${comparisons}.`,
      indices: [i],
      sortedIndices: [i],
      values: [target],
      arraySnapshot: [...arr],
      codeLineKey: 'sentinel_found',
      variables: { foundIndex: i, comparisons, totalWrites: writes },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: writes,
      accessesCount: accesses,
    });
  } else {
    events.push({
      id: events.length,
      type: 'TARGET_NOT_FOUND',
      operationName: `Target ${target} not found in array`,
      beginnerExplanation: `The loop only stopped because it hit the sentinel we planted at the end. The original dataset does not contain ${target}.`,
      technicalExplanation: `Sentinel was reached at index ${n - 1} and original arr[${n - 1}] (${lastVal}) !== target (${target}). Target absent. Returning -1.`,
      arraySnapshot: [...arr],
      codeLineKey: 'sentinel_not_found',
      variables: { foundIndex: -1, comparisons },
      comparisonsCount: comparisons,
      swapsCount: 0,
      writesCount: writes,
      accessesCount: accesses,
    });
  }

  return events;
}

