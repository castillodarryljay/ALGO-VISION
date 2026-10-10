/**
 * AlgoVision - Core Algorithm Trace & Visualization Types
 */

export type AlgorithmCategory = 
  | 'sorting' 
  | 'searching' 
  | 'data-structures' 
  | 'graphs' 
  | 'comparison' 
  | 'learning' 
  | 'playground';

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp';

export type ExplanationMode = 'beginner' | 'technical';

// Trace event types as Discriminated Union
export type TraceEventType =
  | 'START'
  | 'COMPARE'
  | 'SWAP'
  | 'OVERWRITE'
  | 'PIVOT_SELECT'
  | 'PARTITION_RANGE'
  | 'SPLIT'
  | 'MERGE_START'
  | 'MERGE_STEP'
  | 'MERGE_COMPLETE'
  | 'HEAPIFY'
  | 'COUNT_UPDATE'
  | 'BUCKET_DISTRIBUTE'
  | 'BUCKET_GATHER'
  | 'MARK_SORTED'
  | 'SEARCH_EXAMINE'
  | 'SEARCH_BOUNDS'
  | 'TARGET_FOUND'
  | 'TARGET_NOT_FOUND'
  | 'VISIT_VERTEX'
  | 'EXAMINE_EDGE'
  | 'UPDATE_DISTANCE'
  | 'RELAX_EDGE'
  | 'GRAPH_QUEUE_UPDATE'
  | 'MST_EDGE_ADD'
  | 'CYCLE_DETECTED'
  | 'COMPLETE';

export interface TraceEvent {
  id: number;
  type: TraceEventType;
  operationName: string;
  beginnerExplanation: string;
  technicalExplanation: string;
  // Visual states
  indices?: number[]; // e.g., compared or swapped indices
  secondaryIndices?: number[]; // e.g., range bounds [start, end]
  pivotIndex?: number;
  values?: (number | string)[];
  arraySnapshot: number[];
  sortedIndices?: number[];
  // Merge sort specific
  recursionDepth?: number;
  subarrays?: {
    left: number[];
    right: number[];
    merged: number[];
    leftRange: [number, number];
    rightRange: [number, number];
  };
  treeNodeId?: string;
  // Code mapping
  codeLineKey: string; // Key mapped to line numbers across all 6 languages
  // Variables inspector snapshot
  variables: Record<string, string | number | boolean | null | number[]>;
  // Counters delta or absolute
  comparisonsCount: number;
  swapsCount: number;
  writesCount: number;
  accessesCount: number;
  recursionDepthCount?: number;
}

export interface AlgorithmMetrics {
  comparisons: number;
  swaps: number;
  writes: number;
  accesses: number;
  maxRecursionDepth: number;
  executionTimeMs: number;
}

export interface ComplexityInfo {
  bestTime: string;
  averageTime: string;
  worstTime: string;
  spaceComplexity: string;
  stability?: 'Stable' | 'Unstable';
  inPlace?: boolean;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  shortDescription: string;
  fullDescription: string;
  complexity: ComplexityInfo;
  requiresSortedInput?: boolean;
  minElements?: number;
  maxElements?: number;
  defaultData?: number[];
  inputDomainDescription?: string;
}

export interface CodeImplementation {
  language: SupportedLanguage;
  code: string;
  lineMapping: Record<string, number>; // codeLineKey -> 1-based line number
}
