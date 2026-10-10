import { TraceEvent, AlgorithmMetrics } from '../types/algorithm';
import { generateBubbleSortTrace } from './sorting/bubbleSort';
import { generateSelectionSortTrace } from './sorting/selectionSort';
import { generateInsertionSortTrace } from './sorting/insertionSort';
import { generateMergeSortTrace } from './sorting/mergeSort';
import { generateQuickSortTrace } from './sorting/quickSort';
import { generateHeapSortTrace } from './sorting/heapSort';
import { generateCountingSortTrace } from './sorting/countingSort';
import { generateRadixSortTrace } from './sorting/radixSort';
import { generateShellSortTrace } from './sorting/shellSort';
import { generateBucketSortTrace } from './sorting/bucketSort';
import { 
  generateLinearSearchTrace, 
  generateBinarySearchTrace, 
  generateJumpSearchTrace, 
  generateInterpolationSearchTrace,
  generateSentinelSearchTrace
} from './searching/searchingAlgorithms';

export interface TraceResult {
  events: TraceEvent[];
  metrics: AlgorithmMetrics;
  error?: string;
}

export function executeAlgorithmTrace(
  algoId: string, 
  data: number[], 
  options: { ascending?: boolean; searchTarget?: number } = {}
): TraceResult {
  const { ascending = true, searchTarget = 42 } = options;
  const startTime = performance.now();
  let events: TraceEvent[] = [];
  let error: string | undefined;

  try {
    switch (algoId) {
      case 'bubble-sort':
        events = generateBubbleSortTrace(data, ascending);
        break;
      case 'selection-sort':
        events = generateSelectionSortTrace(data, ascending);
        break;
      case 'insertion-sort':
        events = generateInsertionSortTrace(data, ascending);
        break;
      case 'merge-sort':
        events = generateMergeSortTrace(data, ascending);
        break;
      case 'quick-sort':
        events = generateQuickSortTrace(data, ascending);
        break;
      case 'heap-sort':
        events = generateHeapSortTrace(data, ascending);
        break;
      case 'counting-sort':
        events = generateCountingSortTrace(data, ascending);
        break;
      case 'radix-sort':
        events = generateRadixSortTrace(data, ascending);
        break;
      case 'shell-sort':
        events = generateShellSortTrace(data, ascending);
        break;
      case 'bucket-sort':
        events = generateBucketSortTrace(data, ascending);
        break;
      case 'linear-search':
        events = generateLinearSearchTrace(data, searchTarget);
        break;
      case 'binary-search':
        events = generateBinarySearchTrace(data, searchTarget);
        break;
      case 'sentinel-search':
        events = generateSentinelSearchTrace(data, searchTarget);
        break;
      case 'jump-search':
        events = generateJumpSearchTrace(data, searchTarget);
        break;
      case 'interpolation-search':
        events = generateInterpolationSearchTrace(data, searchTarget);
        break;
      default:
        events = generateBubbleSortTrace(data, ascending);
    }
  } catch (err: any) {
    error = err.message || 'An error occurred during trace execution';
  }

  const endTime = performance.now();
  const lastEvent = events[events.length - 1];

  const metrics: AlgorithmMetrics = {
    comparisons: lastEvent ? lastEvent.comparisonsCount : 0,
    swaps: lastEvent ? lastEvent.swapsCount : 0,
    writes: lastEvent ? lastEvent.writesCount : 0,
    accesses: lastEvent ? lastEvent.accessesCount : 0,
    maxRecursionDepth: lastEvent?.recursionDepthCount ?? 0,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
  };

  return { events, metrics, error };
}
