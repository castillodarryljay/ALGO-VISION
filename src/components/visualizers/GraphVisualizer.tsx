import React, { useState, useRef } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { GraphNode } from '../../types/graphs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Network, 
  Compass, 
  AlertOctagon
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
    runGraphAlgorithm,
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

  // Edge creation logic
  const handleNodeClickForEdge = (nodeId: string) => {
    if (!sourceForEdge) {
      setSourceForEdge(nodeId);
    } else {
      if (sourceForEdge !== nodeId) {
        const edgeExists = graphData.edges.some(
          e => (e.source === sourceForEdge && e.target === nodeId) ||
               (!graphData.isDirected && e.source === nodeId && e.target === sourceForEdge)
        );

        if (!edgeExists) {
          const newEdge = {
            id: `e_${Date.now()}`,
            source: sourceForEdge,
            target: nodeId,
            weight: newEdgeWeight,
          };
          setGraphData({
            ...graphData,
            edges: [...graphData.edges, newEdge],
          });
        }
      }
      setSourceForEdge(null);
    }
  };

  const handleAddNode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextLabel = letters[graphData.nodes.length % letters.length] || `N${graphData.nodes.length}`;
    const nextId = nextLabel;
    
    const svgWidth = svgRef.current?.clientWidth || 500;
    const svgHeight = svgRef.current?.clientHeight || 350;
    
    const newNode: GraphNode = {
      id: nextId,
      label: nextLabel,
      x: Math.round(Math.random() * (svgWidth - 120) + 60),
      y: Math.round(Math.random() * (svgHeight - 120) + 60),
    };

    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes, newNode],
    });
  };

  const handleClearGraph = () => {
    setGraphData({
      isDirected: graphData.isDirected,
      isWeighted: graphData.isWeighted,
      nodes: [],
      edges: [],
    });
  };

  const loadPreset = (type: 'mesh' | 'tree' | 'dag') => {
    if (type === 'dag') {
      setGraphData({
        isDirected: true,
        isWeighted: false,
        nodes: [
          { id: '1', label: '1', x: 80, y: 150 },
          { id: '2', label: '2', x: 220, y: 80 },
          { id: '3', label: '3', x: 220, y: 220 },
          { id: '4', label: '4', x: 380, y: 80 },
          { id: '5', label: '5', x: 380, y: 220 },
          { id: '6', label: '6', x: 500, y: 150 },
        ],
        edges: [
          { id: 'e1', source: '1', target: '2', weight: 1 },
          { id: 'e2', source: '1', target: '3', weight: 1 },
          { id: 'e3', source: '2', target: '4', weight: 1 },
          { id: 'e4', source: '3', target: '5', weight: 1 },
          { id: 'e5', source: '4', target: '6', weight: 1 },
          { id: 'e6', source: '5', target: '6', weight: 1 },
        ],
      });
      setSelectedGraphAlgo('topological');
    }
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      
      {/* Top Toolbar - Apple iOS Liquid Glass Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border border-white/80 dark:border-white/10 shadow-sm">
        
        {/* Algo Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-zinc-200">
            <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Algorithm:</span>
          </div>

          <select
            value={selectedGraphAlgo}
            onChange={(e) => setSelectedGraphAlgo(e.target.value as any)}
            className="glass-input rounded-2xl px-3.5 py-1.5 font-medium text-xs outline-none"
          >
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
            <option value="dijkstra">Dijkstra's Shortest Path</option>
            <option value="astar">A* Heuristic Search</option>
            <option value="kruskal">Kruskal's MST</option>
            <option value="topological">Topological Sort (Kahn's)</option>
          </select>

          <button
            onClick={runGraphAlgorithm}
            className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-md shadow-cyan-600/30 active:scale-95 transition-all"
          >
            Run Algorithm
          </button>
        </div>

        {/* Start / Target Nodes Selection */}
        {selectedGraphAlgo !== 'kruskal' && (
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-500 dark:text-zinc-400 font-sans">Start:</span>
            <select
              value={graphStartNode}
              onChange={(e) => setGraphStartNode(e.target.value)}
              className="glass-input rounded-xl px-2.5 py-1 font-semibold text-xs outline-none"
            >
              {graphData.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>

            {(selectedGraphAlgo === 'dijkstra' || selectedGraphAlgo === 'astar') && (
              <>
                <span className="text-slate-500 dark:text-zinc-400 ml-1 font-sans">Target:</span>
                <select
                  value={graphTargetNode}
                  onChange={(e) => setGraphTargetNode(e.target.value)}
                  className="glass-input rounded-xl px-2.5 py-1 font-semibold text-xs outline-none"
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
            className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white font-medium active:scale-95 transition-all"
          >
            Load DAG
          </button>
          <button
            onClick={resetGraph}
            className="px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white font-medium active:scale-95 transition-all"
          >
            Sample Mesh
          </button>
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vertex</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas & Editor */}
      <div className="glass-card rounded-3xl p-2 relative shadow-sm overflow-hidden min-h-[400px] border border-white/80 dark:border-white/10">
        {/* Step Info Overlay */}
        {currentStep && (
          <div className="absolute top-4 left-4 z-10 max-w-sm glass-panel rounded-2xl p-4 shadow-lg border border-white/80 dark:border-white/10 backdrop-blur-md">
            <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mb-0.5">
              Step {currentGraphStepIndex + 1} / {graphTraceSteps.length}
            </div>
            <p className="text-slate-800 dark:text-zinc-200 text-xs font-medium leading-relaxed">{currentStep.description}</p>
            {currentStep.hasCycle && (
              <div className="flex items-center gap-1 mt-1.5 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                <span>Cycle Detected! DAG invalid.</span>
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
          className="w-full h-[400px] cursor-crosshair select-none touch-none"
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Edges */}
          {graphData.edges.map(edge => {
            const src = graphData.nodes.find(n => n.id === edge.source);
            const tgt = graphData.nodes.find(n => n.id === edge.target);
            if (!src || !tgt) return null;

            const isMst = currentStep?.mstEdges?.includes(edge.id);
            const isActive = currentStep?.activeEdgeId === edge.id;

            let strokeColor = '#cbd5e1';
            let strokeWidth = 2;
            let marker = graphData.isDirected ? 'url(#arrow)' : undefined;

            if (isActive) {
              strokeColor = '#0284c7';
              strokeWidth = 3.5;
              marker = graphData.isDirected ? 'url(#arrow-active)' : undefined;
            } else if (isMst) {
              strokeColor = '#059669';
              strokeWidth = 3.5;
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
                  strokeLinecap="round"
                  markerEnd={marker}
                  className="transition-colors duration-200"
                />
                {graphData.isWeighted && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-12"
                      y="-9"
                      width="24"
                      height="18"
                      rx="6"
                      className="fill-white/90 dark:fill-zinc-900/90 stroke-slate-300 dark:stroke-zinc-700"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      className="fill-slate-800 dark:fill-zinc-200 font-mono text-[10px] font-bold"
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
            const isVisited = currentStep?.visitedNodes?.includes(node.id);
            const isCurrent = currentStep?.activeNodeId === node.id;
            const isSourceForEdge = sourceForEdge === node.id;

            let circleFill = 'fill-white dark:fill-zinc-800';
            let strokeColor = '#94a3b8';
            let strokeW = 2.5;

            if (isCurrent) {
              circleFill = 'fill-cyan-500';
              strokeColor = '#0284c7';
              strokeW = 4;
            } else if (isVisited) {
              circleFill = 'fill-emerald-500';
              strokeColor = '#059669';
              strokeW = 3;
            } else if (isSourceForEdge) {
              circleFill = 'fill-amber-400';
              strokeColor = '#d97706';
              strokeW = 3.5;
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDownNode(e, node)}
                onTouchStart={(e) => handleTouchStartNode(e, node)}
                onClick={() => handleNodeClickForEdge(node.id)}
                className="cursor-grab active:cursor-grabbing group select-none"
              >
                <circle
                  r="20"
                  className={`${circleFill} transition-all duration-200 shadow-md`}
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                />
                <text
                  textAnchor="middle"
                  dy="5"
                  className={`${isCurrent || isVisited ? 'fill-white' : 'fill-slate-900 dark:fill-white'} font-mono text-xs font-bold pointer-events-none`}
                >
                  {node.label}
                </text>
                {/* Distance or In-degree badge */}
                {currentStep?.distances && currentStep.distances[node.id] !== undefined && (
                  <text
                    textAnchor="middle"
                    dy="34"
                    className="fill-cyan-600 dark:fill-cyan-400 font-mono text-[10px] font-bold"
                  >
                    d:{currentStep.distances[node.id] === Infinity ? '∞' : currentStep.distances[node.id]}
                  </text>
                )}
                {currentStep?.inDegree && currentStep.inDegree[node.id] !== undefined && (
                  <text
                    textAnchor="middle"
                    dy="34"
                    className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-bold"
                  >
                    in:{currentStep.inDegree[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tip helper */}
        <div className="absolute bottom-3 right-4 text-[10px] text-slate-400 dark:text-zinc-500 pointer-events-none font-medium">
          Click two vertices in sequence to add an edge. Drag vertices to reposition.
        </div>
      </div>

      {/* Playback bar for graph execution */}
      <div className="glass-panel rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 border border-white/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToGraphStep(0)}
            className="p-2 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepGraphBackward}
            disabled={currentGraphStepIndex <= 0}
            className="p-2 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepGraphForward}
            disabled={currentGraphStepIndex >= graphTraceSteps.length - 1}
            className="p-2 rounded-xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-600 dark:text-zinc-400 text-xs ml-2 font-medium">
            Step {currentGraphStepIndex + 1} / {graphTraceSteps.length}
          </span>
        </div>

        {/* Traversal sequence or queue */}
        {currentStep?.queueOrStack && currentStep.queueOrStack.length > 0 && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <span className="font-medium">Frontier Queue:</span>
            <span className="font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20 font-bold">
              [{currentStep.queueOrStack.join(', ')}]
            </span>
          </div>
        )}

        {currentStep?.topologicalOrder && currentStep.topologicalOrder.length > 0 && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <span className="font-medium">Topological Order:</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 font-bold">
              {currentStep.topologicalOrder.join(' → ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
