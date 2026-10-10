/**
 * Data Structures definitions and trace types
 */

export type DataStructureType =
  | 'array'
  | 'singly-linked-list'
  | 'doubly-linked-list'
  | 'stack'
  | 'queue'
  | 'circular-queue'
  | 'hash-table'
  | 'bst'
  | 'avl-tree'
  | 'min-heap'
  | 'max-heap'
  | 'trie';

export interface TreeNodeData {
  id: string;
  value: number;
  height?: number;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
  highlight?: 'active' | 'comparing' | 'rotating' | 'inserted' | 'deleted' | null;
  balanceFactor?: number;
}

export interface TrieNodeData {
  char: string;
  isEndOfWord: boolean;
  children: Record<string, TrieNodeData>;
  highlight?: boolean;
}

export interface HashTableEntry {
  index: number;
  items: { key: string; value: number }[];
}

export interface DataStructureStep {
  step: number;
  operation: string;
  description: string;
  highlightIds?: string[];
  highlightIndices?: number[];
  stateSnapshot: any;
  error?: string;
}
