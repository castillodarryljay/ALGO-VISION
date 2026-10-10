import { GraphData, GraphTraceStep } from '../../types/graphs';

export function runBFS(graph: GraphData, startNodeId: string): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  visited.add(startNodeId);
  const visitedEdges: string[] = [];

  steps.push({
    step: 0,
    activeNodeId: startNodeId,
    visitedNodes: [startNodeId],
    visitedEdges: [],
    queueOrStack: [...queue],
    description: `Start BFS from node ${startNodeId}. Added to queue.`,
    technicalDescription: `Enqueued root vertex ${startNodeId}. Queue: [${queue.join(', ')}]. Visited set initialized.`,
    codeLineKey: 'graph_bfs_start',
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = graph.edges
      .filter(e => e.source === current || (!graph.isDirected && e.target === current))
      .map(e => ({
        neighborId: e.source === current ? e.target : e.source,
        edgeId: e.id,
      }));

    steps.push({
      step: steps.length,
      activeNodeId: current,
      visitedNodes: Array.from(visited),
      visitedEdges: [...visitedEdges],
      queueOrStack: [...queue],
      description: `Dequeued node ${current}. Inspecting its neighbors.`,
      technicalDescription: `Popped ${current} from front of queue. Exploring adjacency list of ${current}.`,
      codeLineKey: 'graph_bfs_dequeue',
    });

    for (const { neighborId, edgeId } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
        visitedEdges.push(edgeId);

        steps.push({
          step: steps.length,
          activeNodeId: neighborId,
          activeEdgeId: edgeId,
          visitedNodes: Array.from(visited),
          visitedEdges: [...visitedEdges],
          queueOrStack: [...queue],
          description: `Discovered unvisited neighbor ${neighborId}. Added to queue.`,
          technicalDescription: `Vertex ${neighborId} is unvisited. Marked visited and enqueued. Traverse edge ${edgeId}.`,
          codeLineKey: 'graph_bfs_visit_neighbor',
        });
      }
    }
  }

  steps.push({
    step: steps.length,
    visitedNodes: Array.from(visited),
    visitedEdges: [...visitedEdges],
    queueOrStack: [],
    description: `BFS traversal completed. Visited ${visited.size} connected nodes.`,
    technicalDescription: `Queue is empty. BFS completed in O(V + E) time.`,
    codeLineKey: 'graph_bfs_complete',
  });

  return steps;
}

export function runDFS(graph: GraphData, startNodeId: string): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const visited = new Set<string>();
  const visitedEdges: string[] = [];

  steps.push({
    step: 0,
    activeNodeId: startNodeId,
    visitedNodes: [],
    visitedEdges: [],
    description: `Start DFS from node ${startNodeId}.`,
    technicalDescription: `DFS recursive call stack initiated with start vertex ${startNodeId}.`,
    codeLineKey: 'graph_dfs_start',
  });

  function dfsVisit(u: string) {
    visited.add(u);
    steps.push({
      step: steps.length,
      activeNodeId: u,
      visitedNodes: Array.from(visited),
      visitedEdges: [...visitedEdges],
      description: `Visited node ${u}.`,
      technicalDescription: `Vertex ${u} pushed to call stack. Marking visited.`,
      codeLineKey: 'graph_dfs_visit',
    });

    const neighbors = graph.edges
      .filter(e => e.source === u || (!graph.isDirected && e.target === u))
      .map(e => ({
        neighborId: e.source === u ? e.target : e.source,
        edgeId: e.id,
      }));

    for (const { neighborId, edgeId } of neighbors) {
      if (!visited.has(neighborId)) {
        visitedEdges.push(edgeId);
        steps.push({
          step: steps.length,
          activeNodeId: neighborId,
          activeEdgeId: edgeId,
          visitedNodes: Array.from(visited),
          visitedEdges: [...visitedEdges],
          description: `Traversing edge from ${u} to unvisited neighbor ${neighborId}.`,
          technicalDescription: `Edge (${u} -> ${neighborId}) active. Recursing deeper into ${neighborId}.`,
          codeLineKey: 'graph_dfs_recurse',
        });
        dfsVisit(neighborId);
      }
    }

    steps.push({
      step: steps.length,
      activeNodeId: u,
      visitedNodes: Array.from(visited),
      visitedEdges: [...visitedEdges],
      description: `Finished exploring all branches from ${u}. Backtracking...`,
      technicalDescription: `Backtracking from ${u}. Returning up recursion stack.`,
      codeLineKey: 'graph_dfs_backtrack',
    });
  }

  dfsVisit(startNodeId);

  steps.push({
    step: steps.length,
    visitedNodes: Array.from(visited),
    visitedEdges: [...visitedEdges],
    description: `DFS traversal complete. Visited ${visited.size} nodes.`,
    technicalDescription: `DFS completed in O(V + E) time.`,
    codeLineKey: 'graph_dfs_complete',
  });

  return steps;
}

export function runDijkstra(graph: GraphData, startNodeId: string, targetNodeId?: string): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  
  // Validate non-negative edge weights
  const hasNegativeWeight = graph.edges.some(e => (e.weight ?? 1) < 0);
  if (hasNegativeWeight) {
    steps.push({
      step: 0,
      visitedNodes: [],
      visitedEdges: [],
      description: `ERROR: Negative edge weight detected! Dijkstra's algorithm cannot handle negative weights because greedy assumption of shortest prefix fails.`,
      technicalDescription: `Dijkstra precondition violation: Edge weight < 0. Use Bellman-Ford algorithm for negative edge weights.`,
      codeLineKey: 'graph_dijkstra_error',
    });
    return steps;
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const node of graph.nodes) {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }

  steps.push({
    step: 0,
    activeNodeId: startNodeId,
    visitedNodes: [],
    visitedEdges: [],
    distances: { ...distances },
    previousNodes: { ...previous },
    description: `Initialize Dijkstra: Distance to ${startNodeId} = 0, all other nodes = ∞.`,
    technicalDescription: `Initial distance table: dist[${startNodeId}] = 0, dist[v] = Inf. Priority queue initialized.`,
    codeLineKey: 'graph_dijkstra_init',
  });

  const visitedNodes: string[] = [];
  const visitedEdges: string[] = [];

  while (unvisited.size > 0) {
    // Find unvisited node with min distance
    let current: string | null = null;
    let minDist = Infinity;
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDist) {
        minDist = distances[nodeId];
        current = nodeId;
      }
    }

    if (!current || minDist === Infinity) break;

    unvisited.delete(current);
    visitedNodes.push(current);

    steps.push({
      step: steps.length,
      activeNodeId: current,
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      distances: { ...distances },
      previousNodes: { ...previous },
      description: `Selected closest unvisited node ${current} with shortest distance ${distances[current]}.`,
      technicalDescription: `Extracted min vertex ${current} with dist ${distances[current]}.`,
      codeLineKey: 'graph_dijkstra_extract_min',
    });

    if (targetNodeId && current === targetNodeId) {
      steps.push({
        step: steps.length,
        activeNodeId: current,
        visitedNodes: [...visitedNodes],
        visitedEdges: [...visitedEdges],
        distances: { ...distances },
        previousNodes: { ...previous },
        description: `Reached destination node ${targetNodeId}! Shortest distance is ${distances[current]}.`,
        technicalDescription: `Target reached. Terminating early. Total shortest cost: ${distances[current]}.`,
        codeLineKey: 'graph_dijkstra_target_reached',
      });
      break;
    }

    // Relax neighbors
    const outgoingEdges = graph.edges.filter(
      e => e.source === current || (!graph.isDirected && e.target === current)
    );

    for (const edge of outgoingEdges) {
      const neighborId = edge.source === current ? edge.target : edge.source;
      if (!unvisited.has(neighborId)) continue;

      const weight = edge.weight ?? 1;
      const alt = distances[current] + weight;

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = current;
        if (!visitedEdges.includes(edge.id)) visitedEdges.push(edge.id);

        steps.push({
          step: steps.length,
          activeNodeId: neighborId,
          activeEdgeId: edge.id,
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          distances: { ...distances },
          previousNodes: { ...previous },
          description: `Relax edge to ${neighborId}: Found shorter path (${distances[current]} + ${weight} = ${alt}). Previous distance was updated!`,
          technicalDescription: `Relaxation: dist[${neighborId}] updated to ${alt} via predecessor ${current}.`,
          codeLineKey: 'graph_dijkstra_relax',
        });
      }
    }
  }

  return steps;
}

export function runAStar(graph: GraphData, startNodeId: string, targetNodeId: string): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const targetNode = graph.nodes.find(n => n.id === targetNodeId);
  if (!targetNode) return steps;

  function heuristic(nodeId: string): number {
    const node = graph.nodes.find(n => n.id === nodeId);
    if (!node) return 0;
    // Euclidean distance scaled
    const dx = node.x - targetNode!.x;
    const dy = node.y - targetNode!.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy) / 10);
  }

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const openSet = new Set<string>([startNodeId]);
  const closedSet = new Set<string>();

  for (const node of graph.nodes) {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    previous[node.id] = null;
  }

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(startNodeId);

  steps.push({
    step: 0,
    activeNodeId: startNodeId,
    visitedNodes: [startNodeId],
    visitedEdges: [],
    distances: { ...gScore },
    previousNodes: { ...previous },
    description: `Start A* Search towards target ${targetNodeId}. Heuristic h(${startNodeId}) = ${fScore[startNodeId]}.`,
    technicalDescription: `A* initialized with Euclidean distance heuristic. f(n) = g(n) + h(n). Open set: [${startNodeId}].`,
    codeLineKey: 'graph_astar_init',
  });

  const visitedEdges: string[] = [];

  while (openSet.size > 0) {
    // Current is node in openSet having lowest fScore
    let current: string | null = null;
    let lowestF = Infinity;
    for (const nodeId of openSet) {
      if (fScore[nodeId] < lowestF) {
        lowestF = fScore[nodeId];
        current = nodeId;
      }
    }

    if (!current) break;

    if (current === targetNodeId) {
      steps.push({
        step: steps.length,
        activeNodeId: current,
        visitedNodes: Array.from(closedSet),
        visitedEdges: [...visitedEdges],
        distances: { ...gScore },
        previousNodes: { ...previous },
        description: `Target ${targetNodeId} reached! Shortest path cost g = ${gScore[current]}.`,
        technicalDescription: `Optimal path verified to goal vertex ${targetNodeId}.`,
        codeLineKey: 'graph_astar_complete',
      });
      return steps;
    }

    openSet.delete(current);
    closedSet.add(current);

    steps.push({
      step: steps.length,
      activeNodeId: current,
      visitedNodes: Array.from(closedSet),
      visitedEdges: [...visitedEdges],
      distances: { ...gScore },
      previousNodes: { ...previous },
      description: `Examining node ${current} with lowest fScore = ${fScore[current]} (g = ${gScore[current]}, h = ${heuristic(current)}).`,
      technicalDescription: `Selected open set candidate ${current}. Expanding neighbors.`,
      codeLineKey: 'graph_astar_expand',
    });

    const neighbors = graph.edges
      .filter(e => e.source === current || (!graph.isDirected && e.target === current))
      .map(e => ({
        neighborId: e.source === current ? e.target : e.source,
        weight: e.weight ?? 1,
        edgeId: e.id,
      }));

    for (const { neighborId, weight, edgeId } of neighbors) {
      if (closedSet.has(neighborId)) continue;

      const tentativeG = gScore[current] + weight;
      if (!openSet.has(neighborId)) openSet.add(neighborId);

      if (tentativeG < gScore[neighborId]) {
        previous[neighborId] = current;
        gScore[neighborId] = tentativeG;
        fScore[neighborId] = tentativeG + heuristic(neighborId);
        if (!visitedEdges.includes(edgeId)) visitedEdges.push(edgeId);

        steps.push({
          step: steps.length,
          activeNodeId: neighborId,
          activeEdgeId: edgeId,
          visitedNodes: Array.from(closedSet),
          visitedEdges: [...visitedEdges],
          distances: { ...gScore },
          previousNodes: { ...previous },
          description: `Better path found to ${neighborId}: g = ${tentativeG}, h = ${heuristic(neighborId)}, f = ${fScore[neighborId]}.`,
          technicalDescription: `Updated gScore and fScore for ${neighborId}.`,
          codeLineKey: 'graph_astar_update',
        });
      }
    }
  }

  return steps;
}

export function runKruskal(graph: GraphData): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];
  const edges = [...graph.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
  const parent: Record<string, string> = {};

  for (const node of graph.nodes) {
    parent[node.id] = node.id;
  }

  function find(u: string): string {
    if (parent[u] === u) return u;
    parent[u] = find(parent[u]);
    return parent[u];
  }

  function union(u: string, v: string): boolean {
    const rootU = find(u);
    const rootV = find(v);
    if (rootU === rootV) return false;
    parent[rootU] = rootV;
    return true;
  }

  const mstEdges: string[] = [];
  let totalWeight = 0;

  steps.push({
    step: 0,
    visitedNodes: [],
    visitedEdges: [],
    mstEdges: [],
    description: `Start Kruskal's MST algorithm. Sorted all ${edges.length} edges by ascending weight.`,
    technicalDescription: `Kruskal initialized with Disjoint-Set (Union-Find). Greedy edge processing order.`,
    codeLineKey: 'graph_kruskal_init',
  });

  for (const edge of edges) {
    const w = edge.weight ?? 1;
    const canInclude = union(edge.source, edge.target);

    if (canInclude) {
      mstEdges.push(edge.id);
      totalWeight += w;
      steps.push({
        step: steps.length,
        activeEdgeId: edge.id,
        visitedNodes: graph.nodes.map(n => n.id),
        visitedEdges: [...mstEdges],
        mstEdges: [...mstEdges],
        description: `Edge (${edge.source} - ${edge.target}, weight ${w}) connects separate components. Added to MST! Total weight: ${totalWeight}.`,
        technicalDescription: `Union-find successful. Root components merged. Edge ${edge.id} added to MST.`,
        codeLineKey: 'graph_kruskal_add',
      });
    } else {
      steps.push({
        step: steps.length,
        activeEdgeId: edge.id,
        visitedNodes: graph.nodes.map(n => n.id),
        visitedEdges: [...mstEdges],
        mstEdges: [...mstEdges],
        description: `Edge (${edge.source} - ${edge.target}, weight ${w}) forms a cycle! Discarding edge.`,
        technicalDescription: `find(${edge.source}) === find(${edge.target}). Edge rejected to avoid cycle.`,
        codeLineKey: 'graph_kruskal_cycle_discard',
      });
    }

    if (mstEdges.length === graph.nodes.length - 1) break;
  }

  steps.push({
    step: steps.length,
    visitedNodes: graph.nodes.map(n => n.id),
    visitedEdges: [...mstEdges],
    mstEdges: [...mstEdges],
    description: `Kruskal completed! Minimum Spanning Tree has ${mstEdges.length} edges and total cost ${totalWeight}.`,
    technicalDescription: `MST successfully found with |V|-1 edges. Total weight: ${totalWeight}.`,
    codeLineKey: 'graph_kruskal_complete',
  });

  return steps;
}

export function runTopologicalSort(graph: GraphData): GraphTraceStep[] {
  const steps: GraphTraceStep[] = [];

  if (!graph.isDirected) {
    steps.push({
      step: 0,
      visitedNodes: [],
      visitedEdges: [],
      description: `ERROR: Topological Sort requires a Directed Acyclic Graph (DAG). Current graph is undirected.`,
      technicalDescription: `Topological ordering is only well-defined on directed graphs.`,
      codeLineKey: 'graph_topo_error',
    });
    return steps;
  }

  // Calculate in-degrees
  const inDegree: Record<string, number> = {};
  for (const node of graph.nodes) inDegree[node.id] = 0;
  for (const edge of graph.edges) inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;

  const queue: string[] = [];
  for (const node of graph.nodes) {
    if (inDegree[node.id] === 0) queue.push(node.id);
  }

  const result: string[] = [];

  steps.push({
    step: 0,
    visitedNodes: [],
    visitedEdges: [],
    inDegree: { ...inDegree },
    queueOrStack: [...queue],
    topologicalOrder: [],
    description: `Initialize Kahn's algorithm: Computed in-degrees. Nodes with in-degree 0: [${queue.join(', ')}].`,
    technicalDescription: `Kahn's algorithm: Initialized in-degree table and queue of zero-indegree vertices.`,
    codeLineKey: 'graph_topo_init',
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);

    steps.push({
      step: steps.length,
      activeNodeId: u,
      visitedNodes: [...result],
      visitedEdges: [],
      inDegree: { ...inDegree },
      queueOrStack: [...queue],
      topologicalOrder: [...result],
      description: `Removed node ${u} with 0 incoming dependencies. Added to topological ordering.`,
      technicalDescription: `Popped ${u}. Current linear ordering: [${result.join(', ')}]. Decrementing outgoing neighbors' in-degrees.`,
      codeLineKey: 'graph_topo_pop',
    });

    const outgoing = graph.edges.filter(e => e.source === u);
    for (const edge of outgoing) {
      const v = edge.target;
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
        steps.push({
          step: steps.length,
          activeNodeId: v,
          activeEdgeId: edge.id,
          visitedNodes: [...result],
          visitedEdges: [],
          inDegree: { ...inDegree },
          queueOrStack: [...queue],
          topologicalOrder: [...result],
          description: `Dependency satisfied for node ${v}! In-degree reached 0. Added to queue.`,
          technicalDescription: `inDegree[${v}] became 0. Enqueued ${v}.`,
          codeLineKey: 'graph_topo_enqueue',
        });
      }
    }
  }

  const hasCycle = result.length !== graph.nodes.length;
  steps.push({
    step: steps.length,
    visitedNodes: [...result],
    visitedEdges: [],
    inDegree: { ...inDegree },
    topologicalOrder: [...result],
    hasCycle,
    description: hasCycle
      ? `Cycle detected in directed graph! Cannot form a valid topological order because cyclic dependencies exist.`
      : `Topological Sort complete! Valid execution order: ${result.join(' → ')}.`,
    technicalDescription: hasCycle
      ? `Graph has cycle: processed ${result.length}/${graph.nodes.length} vertices. DAG property violated.`
      : `Topological ordering computed successfully in O(V + E) time.`,
    codeLineKey: hasCycle ? 'graph_topo_cycle' : 'graph_topo_complete',
  });

  return steps;
}
