/**
 * Graph data types for AlgoVision
 */

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  isDirected?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  isWeighted: boolean;
}

export type GraphAlgorithmType = 
  | 'bfs' 
  | 'dfs' 
  | 'dijkstra' 
  | 'astar' 
  | 'kruskal' 
  | 'prim' 
  | 'topological';

export interface GraphTraceStep {
  step: number;
  activeNodeId?: string;
  activeEdgeId?: string;
  visitedNodes: string[];
  visitedEdges: string[];
  mstEdges?: string[];
  distances?: Record<string, number>;
  previousNodes?: Record<string, string | null>;
  queueOrStack?: string[];
  inDegree?: Record<string, number>;
  topologicalOrder?: string[];
  description: string;
  technicalDescription: string;
  hasCycle?: boolean;
  codeLineKey: string;
}
