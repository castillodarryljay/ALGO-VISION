import { TraceEvent } from '../../types/algorithm';

export function generateShellSortTrace(initialArray: number[], ascending: boolean = true): TraceEvent[] {
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
    operationName: 'Start Shell Sort',
    beginnerExplanation: `Starting Shell Sort on ${n} elements. Shell Sort is a generalized version of Insertion Sort that allows exchanges of elements far apart using a diminishing 'gap' sequence.`,
    technicalExplanation: `Shell Sort initialized using floor(n/2) gap sequence. Reduces inversion distance quickly. Time complexity depends on gap sequence (O(n log² n) to O(n^(3/2))), In-place O(1) space.`,
    arraySnapshot: [...arr],
    codeLineKey: 'shell_start',
    variables: { n, initialGap: Math.floor(n / 2) },
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
      codeLineKey: 'shell_complete',
      variables: { completed: true },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });
    return events;
  }

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    events.push({
      id: events.length,
      type: 'PIVOT_SELECT',
      operationName: `Set gap distance = ${gap}`,
      beginnerExplanation: `Now sorting sub-lists separated by a gap of ${gap}.`,
      technicalExplanation: `Entering outer pass with gap = ${gap}. Performing gapped insertion sort.`,
      arraySnapshot: [...arr],
      codeLineKey: 'shell_gap_step',
      variables: { gap },
      comparisonsCount: comparisons,
      swapsCount: swaps,
      writesCount: writes,
      accessesCount: accesses,
    });

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      accesses++;
      let j = i;

      while (j >= gap) {
        comparisons++;
        accesses++;
        const condition = ascending ? arr[j - gap] > temp : arr[j - gap] < temp;

        events.push({
          id: events.length,
          type: 'COMPARE',
          operationName: `Compare arr[${j - gap}] (${arr[j - gap]}) with temp (${temp}) across gap ${gap}`,
          beginnerExplanation: `Comparing elements separated by distance ${gap}: ${arr[j - gap]} and ${temp}. ${condition ? `Shifting ${arr[j - gap]} forward.` : `No shift needed.`}`,
          technicalExplanation: `Check: arr[${j - gap}] (${arr[j - gap]}) ${ascending ? '>' : '<'} temp (${temp}). Result: ${condition}.`,
          indices: [j - gap, j],
          values: [arr[j - gap], temp],
          arraySnapshot: [...arr],
          codeLineKey: 'shell_compare',
          variables: { gap, i, j, temp, 'arr[j - gap]': arr[j - gap] },
          comparisonsCount: comparisons,
          swapsCount: swaps,
          writesCount: writes,
          accessesCount: accesses,
        });

        if (!condition) break;

        arr[j] = arr[j - gap];
        writes++;
        swaps++;

        events.push({
          id: events.length,
          type: 'OVERWRITE',
          operationName: `Shift arr[${j - gap}] to arr[${j}] across gap ${gap}`,
          beginnerExplanation: `Shifted value ${arr[j]} forward by ${gap} spots.`,
          technicalExplanation: `Gapped shift: arr[${j}] = arr[${j - gap}] (${arr[j]}).`,
          indices: [j - gap, j],
          arraySnapshot: [...arr],
          codeLineKey: 'shell_shift',
          variables: { gap, j, shiftedValue: arr[j] },
          comparisonsCount: comparisons,
          swapsCount: swaps,
          writesCount: writes,
          accessesCount: accesses,
        });

        j -= gap;
      }

      arr[j] = temp;
      writes++;

      events.push({
        id: events.length,
        type: 'OVERWRITE',
        operationName: `Place temp (${temp}) at index ${j}`,
        beginnerExplanation: `Placed value ${temp} at index ${j}.`,
        technicalExplanation: `Insertion: arr[${j}] = temp (${temp}).`,
        indices: [j],
        arraySnapshot: [...arr],
        codeLineKey: 'shell_place',
        variables: { j, placedValue: temp },
        comparisonsCount: comparisons,
        swapsCount: swaps,
        writesCount: writes,
        accessesCount: accesses,
      });
    }
  }

  events.push({
    id: events.length,
    type: 'COMPLETE',
    operationName: 'Shell Sort Complete',
    beginnerExplanation: `Shell Sort complete! The array is now fully sorted.`,
    technicalExplanation: `Shell Sort terminated. Total comparisons: ${comparisons}, swaps/shifts: ${swaps}, writes: ${writes}.`,
    arraySnapshot: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    codeLineKey: 'shell_complete',
    variables: { completed: true, totalComparisons: comparisons, totalWrites: writes },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    writesCount: writes,
    accessesCount: accesses,
  });

  return events;
}
