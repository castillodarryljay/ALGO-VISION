import React, { useState, useRef } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { GraphNode, GraphEdge, GraphData } from '../../types/graphs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Network, 
  Compass, 
  ArrowRight,
  Layers,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const GraphVisualizer: React.FC = () => {
  const {
    graphData,
    setGraphData,
    selectedGraphAlgo,
    setSelectedGraphAlgo,
    graphStartNode,
    setGraphStartNode,
    graphTargetNode,
    setGraphTargetNode,
    graphTraceSteps,
    currentGraphStepIndex,
    stepGraphForward,
    stepGraphBackward,
    goToGraphStep,
    isGraphPlaying,
    playGraph,
    pauseGraph,
    resetGraph,
    runGraphAlgorithm
  } = useAlgoStore();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Adding edge / node state
  const [sourceForEdge, setSourceForEdge] = useState<string | null>(null);
  const [newEdgeWeight, setNewEdgeWeight] = useState<number>(3);

  const currentStep = graphTraceSteps[currentGraphStepIndex] || graphTraceSteps[0];

  // Drag and drop node positioning
  const handleMouseDownNode = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (svgRect) {
      setDragOffset({
        x: e.clientX - svgRect.left - node.x,
        y: e.clientY - svgRect.top - node.y,
      });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(30, Math.min(svgRect.width - 30, e.clientX - svgRect.left - dragOffset.x));
    const newY = Math.max(30, Math.min(svgRect.height - 30, e.clientY - svgRect.top - dragOffset.y));

    const updatedNodes = graphData.nodes.map(n => 
      n.id === draggingNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n
    );
    setGraphData({ ...graphData, nodes: updatedNodes });
  };

  const handleMouseUpCanvas = () => {
    setDraggingNodeId(null);
  };

  // Touch handlers for mobile and tablet screens
  const handleTouchStartNode = (e: React.TouchEvent, node: GraphNode) => {
    e.stopPropagation();
    if (e.touches.length === 1) {
      setDraggingNodeId(node.id);
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        setDragOffset({
          x: e.touches[0].clientX - svgRect.left - node.x,
          y: e.touches[0].clientY - svgRect.top - node.y,
        });
      }
    }
  };

  const handleTouchMoveCanvas = (e: React.TouchEvent) => {
    if (!draggingNodeId || !svgRef.current || e.touches.length === 0) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(25, Math.min(svgRect.width - 25, e.touches[0].clientX - svgRect.left - dragOffset.x));
    const newY = Math.max(25, Math.min(svgRect.height - 25, e.touches[0].clientY - svgRect.top - dragOffset.y));

    const updatedNodes = graphData.nodes.map(n => 
      n.id === draggingNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n
    );
    setGraphData({ ...graphData, nodes: updatedNodes });
  };

  // Node & Edge manipulation
  const handleAddNode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const usedLabels = new Set(graphData.nodes.map(n => n.label));
    let nextLabel = 'A';
    for (const char of letters) {
      if (!usedLabels.has(char)) {
        nextLabel = char;
        break;
      }
    }
    const newNode: GraphNode = {
      id: nextLabel,
      label: nextLabel,
      x: 100 + Math.floor(Math.random() * 300),
      y: 80 + Math.floor(Math.random() * 160),
    };
    setGraphData({ ...graphData, nodes: [...graphData.nodes, newNode] });
  };

  const handleDeleteNode = (nodeId: string) => {
    const filteredNodes = graphData.nodes.filter(n => n.id !== nodeId);
    const filteredEdges = graphData.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setGraphData({ ...graphData, nodes: filteredNodes, edges: filteredEdges });
    if (graphStartNode === nodeId && filteredNodes.length > 0) {
      setGraphStartNode(filteredNodes[0].id);
    }
  };

  const handleNodeClickForEdge = (nodeId: string) => {
    if (!sourceForEdge) {
      setSourceForEdge(nodeId);
    } else {
      if (sourceForEdge !== nodeId) {
        // Add edge
        const newEdge: GraphEdge = {
          id: `e_${sourceForEdge}_${nodeId}_${Date.now()}`,
          source: sourceForEdge,
          target: nodeId,
          weight: newEdgeWeight,
          isDirected: graphData.isDirected,
        };
        setGraphData({ ...graphData, edges: [...graphData.edges, newEdge] });
      }
      setSourceForEdge(null);
    }
  };

  // Preset graphs
  const loadPreset = (preset: 'dag' | 'mesh' | 'tree' | 'cycle') => {
    if (preset === 'dag') {
      const dagData: GraphData = {
        isDirected: true,
        isWeighted: false,
        nodes: [
          { id: '1', label: 'Task 1', x: 80, y: 120 },
          { id: '2', label: 'Task 2', x: 220, y: 60 },
          { id: '3', label: 'Task 3', x: 220, y: 180 },
          { id: '4', label: 'Task 4', x: 380, y: 60 },
          { id: '5', label: 'Task 5', x: 380, y: 180 },
          { id: '6', label: 'Task 6', x: 520, y: 120 },
        ],
        edges: [
          { id: 'e1', source: '1', target: '2' },
          { id: 'e2', source: '1', target: '3' },
          { id: 'e3', source: '2', target: '4' },
          { id: 'e4', source: '3', target: '5' },
          { id: 'e5', source: '4', target: '6' },
          { id: 'e6', source: '5', target: '6' },
        ],
      };
      setGraphData(dagData);
      setSelectedGraphAlgo('topological');
    } else if (preset === 'mesh') {
      resetGraph();
    }
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      
      {/* Algorithm Selector & Options Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Network className="w-4 h-4 text-cyan-400" />
            Graph Algorithm:
          </span>

          <select
            value={selectedGraphAlgo}
            onChange={(e) => setSelectedGraphAlgo(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-100 font-medium outline-none focus:border-cyan-500"
          >
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
            <option value="dijkstra">Dijkstra's Shortest Path</option>
            <option value="astar">A* Search</option>
            <option value="kruskal">Kruskal's MST (Spanning Tree)</option>
            <option value="topological">Topological Sort (DAG)</option>
          </select>

          {/* Directed / Undirected toggle */}
          <button
            onClick={() => {
              setGraphData({ ...graphData, isDirected: !graphData.isDirected });
            }}
            className={`px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              graphData.isDirected 
                ? 'bg-blue-950/80 border-blue-600 text-blue-300' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
          >
            {graphData.isDirected ? 'Directed →' : 'Undirected —'}
          </button>
        </div>

        {/* Start / Target node selection */}
        {(selectedGraphAlgo === 'bfs' || selectedGraphAlgo === 'dfs' || selectedGraphAlgo === 'dijkstra' || selectedGraphAlgo === 'astar') && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Start:</span>
            <select
              value={graphStartNode}
              onChange={(e) => setGraphStartNode(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
            >
              {graphData.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>

            {(selectedGraphAlgo === 'dijkstra' || selectedGraphAlgo === 'astar') && (
              <>
                <span className="text-zinc-400 ml-1">Target:</span>
                <select
                  value={graphTargetNode}
                  onChange={(e) => setGraphTargetNode(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
                >
                  {graphData.nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        {/* Presets & Reset */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => loadPreset('dag')}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Load DAG
          </button>
          <button
            onClick={resetGraph}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Sample Mesh
          </button>
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Vertex
          </button>
        </div>
      </div>

      {/* SVG Canvas & Editor */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 relative shadow-inner overflow-hidden min-h-[380px]">
        {/* Step Info Overlay */}
        {currentStep && (
          <div className="absolute top-4 left-4 z-10 max-w-sm bg-zinc-900/90 border border-zinc-700/80 rounded-lg p-3 shadow-lg backdrop-blur-xs">
            <div className="text-[11px] font-semibold text-cyan-400 mb-0.5">
              Step {currentGraphStepIndex + 1} / {graphTraceSteps.length}
            </div>
            <p className="text-zinc-200 text-xs font-medium">{currentStep.description}</p>
            {currentStep.hasCycle && (
              <div className="flex items-center gap-1 mt-1 text-rose-400 font-semibold text-[11px]">
                <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                Cycle Detected! DAG invalid.
              </div>
            )}
          </div>
        )}

        <svg
          ref={svgRef}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          onTouchMove={handleTouchMoveCanvas}
          onTouchEnd={handleMouseUpCanvas}
          className="w-full h-[380px] cursor-crosshair select-none touch-none"
        >
          {/* Arrow marker definition for directed edges */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Edges */}
          {graphData.edges.map(edge => {
            const src = graphData.nodes.find(n => n.id === edge.source);
            const tgt = graphData.nodes.find(n => n.id === edge.target);
            if (!src || !tgt) return null;

            const isMst = currentStep?.mstEdges?.includes(edge.id);
            const isActive = currentStep?.activeEdgeId === edge.id;
            const isVisited = currentStep?.visitedEdges?.includes(edge.id);

            let strokeColor = '#3f3f46';
            let strokeWidth = 2;

            if (isMst) {
              strokeColor = '#10b981';
              strokeWidth = 4;
            } else if (isActive) {
              strokeColor = '#06b6d4';
              strokeWidth = 3.5;
            } else if (isVisited) {
              strokeColor = '#38bdf8';
              strokeWidth = 2.5;
            }

            const midX = (src.x + tgt.x) / 2;
            const midY = (src.y + tgt.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={graphData.isDirected ? (isActive ? 'url(#arrow-active)' : 'url(#arrow)') : undefined}
                />
                {edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-10"
                      y="-9"
                      width="20"
                      height="18"
                      rx="4"
                      fill="#18181b"
                      stroke="#27272a"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#a1a1aa"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {graphData.nodes.map(node => {
            const isActive = currentStep?.activeNodeId === node.id;
            const isVisited = currentStep?.visitedNodes?.includes(node.id);
            const isConnecting = sourceForEdge === node.id;

            let fill = '#18181b';
            let stroke = '#52525b';
            let textColor = '#e4e4e7';

            if (isActive) {
              fill = '#0891b2';
              stroke = '#22d3ee';
              textColor = '#ffffff';
            } else if (isVisited) {
              fill = '#064e3b';
              stroke = '#10b981';
              textColor = '#a7f3d0';
            } else if (isConnecting) {
              stroke = '#f59e0b';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDownNode(e, node)}
                onTouchStart={(e) => handleTouchStartNode(e, node)}
                onClick={() => handleNodeClickForEdge(node.id)}
                className="cursor-grab active:cursor-grabbing"
              >
                <circle
                  r="20"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                  className="transition-colors drop-shadow"
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  fill={textColor}
                  fontSize="12"
                  fontWeight="bold"
                >
                  {node.label}
                </text>
                {/* Distance or In-degree badge */}
                {currentStep?.distances && currentStep.distances[node.id] !== undefined && (
                  <text
                    textAnchor="middle"
                    dy="32"
                    fill="#38bdf8"
                    fontSize="10"
                    fontWeight="mono"
                  >
                    d:{currentStep.distances[node.id] === Infinity ? '∞' : currentStep.distances[node.id]}
                  </text>
                )}
                {currentStep?.inDegree && currentStep.inDegree[node.id] !== undefined && (
                  <text
                    textAnchor="middle"
                    dy="32"
                    fill="#fbbf24"
                    fontSize="10"
                    fontWeight="mono"
                  >
                    in:{currentStep.inDegree[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tip helper */}
        <div className="absolute bottom-2 right-3 text-[10px] text-zinc-500 pointer-events-none">
          Click two nodes in sequence to create an edge. Drag nodes to reposition.
        </div>
      </div>

      {/* Playback bar for graph execution */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToGraphStep(0)}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepGraphBackward}
            disabled={currentGraphStepIndex <= 0}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepGraphForward}
            disabled={currentGraphStepIndex >= graphTraceSteps.length - 1}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-zinc-400 text-xs ml-1">
            Step {currentGraphStepIndex + 1} / {graphTraceSteps.length}
          </span>
        </div>

        {/* Traversal sequence or queue */}
        {currentStep?.queueOrStack && currentStep.queueOrStack.length > 0 && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Frontier Queue:</span>
            <span className="font-mono text-cyan-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              [{currentStep.queueOrStack.join(', ')}]
            </span>
          </div>
        )}

        {currentStep?.topologicalOrder && currentStep.topologicalOrder.length > 0 && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Topological Linear Order:</span>
            <span className="font-mono text-emerald-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              {currentStep.topologicalOrder.join(' → ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
