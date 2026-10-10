import { create } from 'zustand';
import { SupportedLanguage, ExplanationMode, TraceEvent } from '../types/algorithm';
import { GraphData, GraphTraceStep } from '../types/graphs';
import { ALGORITHMS } from '../engine/algorithmCatalog';
import { executeAlgorithmTrace, TraceResult } from '../engine/traceEngine';
import { runBFS, runDFS, runDijkstra, runAStar, runKruskal, runTopologicalSort } from '../engine/graphs/graphEngine';

export type NavigationSection = 
  | 'home' 
  | 'sorting' 
  | 'searching' 
  | 'data-structures' 
  | 'graphs' 
  | 'compare' 
  | 'learning' 
  | 'playground' 
  | 'settings';

export type MergeSortViewMode = 'array' | 'tree' | 'combined';

const DEFAULT_GRAPH: GraphData = {
  isDirected: false,
  isWeighted: true,
  nodes: [
    { id: 'A', label: 'A', x: 80, y: 120 },
    { id: 'B', label: 'B', x: 220, y: 60 },
    { id: 'C', label: 'C', x: 220, y: 200 },
    { id: 'D', label: 'D', x: 380, y: 60 },
    { id: 'E', label: 'E', x: 380, y: 200 },
    { id: 'F', label: 'F', x: 500, y: 130 },
  ],
  edges: [
    { id: 'e1', source: 'A', target: 'B', weight: 4 },
    { id: 'e2', source: 'A', target: 'C', weight: 2 },
    { id: 'e3', source: 'B', target: 'C', weight: 1 },
    { id: 'e4', source: 'B', target: 'D', weight: 5 },
    { id: 'e5', source: 'C', target: 'E', weight: 8 },
    { id: 'e6', source: 'C', target: 'D', weight: 8 },
    { id: 'e7', source: 'D', target: 'E', weight: 2 },
    { id: 'e8', source: 'D', target: 'F', weight: 6 },
    { id: 'e9', source: 'E', target: 'F', weight: 3 },
  ],
};

interface AlgoStoreState {
  currentSection: NavigationSection;
  selectedAlgorithmId: string;
  data: number[];
  ascending: boolean;
  searchTarget: number;
  
  // Trace execution state
  traceResult: TraceResult;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // in ms interval: e.g. 400ms default
  
  // UI preferences
  language: SupportedLanguage;
  explanationMode: ExplanationMode;
  consoleTab: 'output' | 'logs' | 'variables' | 'performance';
  mergeSortViewMode: MergeSortViewMode;
  theme: 'dark' | 'light';
  codeFontSize: number;
  showComments: boolean;
  reducedMotion: boolean;

  // Graph workspace state
  graphData: GraphData;
  selectedGraphAlgo: 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'kruskal' | 'topological';
  graphStartNode: string;
  graphTargetNode: string;
  graphTraceSteps: GraphTraceStep[];
  currentGraphStepIndex: number;
  isGraphPlaying: boolean;

  // Actions
  setSection: (section: NavigationSection) => void;
  selectAlgorithm: (algoId: string) => void;
  setData: (data: number[]) => void;
  setAscending: (ascending: boolean) => void;
  setSearchTarget: (target: number) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setExplanationMode: (mode: ExplanationMode) => void;
  setConsoleTab: (tab: 'output' | 'logs' | 'variables' | 'performance') => void;
  setMergeSortViewMode: (mode: MergeSortViewMode) => void;
  setPlaybackSpeed: (speed: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCodeFontSize: (size: number) => void;
  setShowComments: (show: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;

  // Playback engine
  generateTrace: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  restart: () => void;
  skipToEnd: () => void;

  // Graph actions
  setGraphData: (data: GraphData) => void;
  setSelectedGraphAlgo: (algo: 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'kruskal' | 'topological') => void;
  setGraphStartNode: (nodeId: string) => void;
  setGraphTargetNode: (nodeId: string) => void;
  runGraphAlgorithm: () => void;
  stepGraphForward: () => void;
  stepGraphBackward: () => void;
  goToGraphStep: (index: number) => void;
  playGraph: () => void;
  pauseGraph: () => void;
  resetGraph: () => void;
}

const initialAlgorithm = 'bubble-sort';
const initialData = ALGORITHMS.find(a => a.id === initialAlgorithm)?.defaultData || [45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 99, 18];
const initialTrace = executeAlgorithmTrace(initialAlgorithm, initialData, { ascending: true });

export const useAlgoStore = create<AlgoStoreState>((set, get) => ({
  currentSection: 'home',
  selectedAlgorithmId: initialAlgorithm,
  data: initialData,
  ascending: true,
  searchTarget: 47,

  traceResult: initialTrace,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 500,

  language: 'javascript',
  explanationMode: 'beginner',
  consoleTab: 'output',
  mergeSortViewMode: 'combined',
  theme: 'dark',
  codeFontSize: 13,
  showComments: true,
  reducedMotion: false,

  // Graph initial state
  graphData: DEFAULT_GRAPH,
  selectedGraphAlgo: 'bfs',
  graphStartNode: 'A',
  graphTargetNode: 'F',
  graphTraceSteps: runBFS(DEFAULT_GRAPH, 'A'),
  currentGraphStepIndex: 0,
  isGraphPlaying: false,

  setSection: (section) => set({ currentSection: section, isPlaying: false }),

  selectAlgorithm: (algoId) => {
    const meta = ALGORITHMS.find(a => a.id === algoId);
    const newData = meta?.defaultData || get().data;
    const isSearching = meta?.category === 'searching';
    const target = isSearching && meta?.defaultData ? meta.defaultData[Math.floor(meta.defaultData.length / 2)] : get().searchTarget;
    const newTrace = executeAlgorithmTrace(algoId, newData, {
      ascending: get().ascending,
      searchTarget: target,
    });
    set({
      selectedAlgorithmId: algoId,
      data: newData,
      searchTarget: target,
      traceResult: newTrace,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setData: (data) => {
    const trace = executeAlgorithmTrace(get().selectedAlgorithmId, data, {
      ascending: get().ascending,
      searchTarget: get().searchTarget,
    });
    set({
      data,
      traceResult: trace,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setAscending: (ascending) => {
    const trace = executeAlgorithmTrace(get().selectedAlgorithmId, get().data, {
      ascending,
      searchTarget: get().searchTarget,
    });
    set({
      ascending,
      traceResult: trace,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setSearchTarget: (searchTarget) => {
    const trace = executeAlgorithmTrace(get().selectedAlgorithmId, get().data, {
      ascending: get().ascending,
      searchTarget,
    });
    set({
      searchTarget,
      traceResult: trace,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setLanguage: (language) => set({ language }),
  setExplanationMode: (explanationMode) => set({ explanationMode }),
  setConsoleTab: (consoleTab) => set({ consoleTab }),
  setMergeSortViewMode: (mergeSortViewMode) => set({ mergeSortViewMode }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setTheme: (theme) => set({ theme }),
  setCodeFontSize: (codeFontSize) => set({ codeFontSize }),
  setShowComments: (showComments) => set({ showComments }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  generateTrace: () => {
    const trace = executeAlgorithmTrace(get().selectedAlgorithmId, get().data, {
      ascending: get().ascending,
      searchTarget: get().searchTarget,
    });
    set({
      traceResult: trace,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  stepForward: () => {
    const { currentStepIndex, traceResult } = get();
    if (currentStepIndex < traceResult.events.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1, isPlaying: false });
    }
  },

  goToStep: (index) => {
    const { traceResult } = get();
    const clamped = Math.max(0, Math.min(index, traceResult.events.length - 1));
    set({ currentStepIndex: clamped });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  restart: () => {
    set({ currentStepIndex: 0, isPlaying: false });
  },

  skipToEnd: () => {
    const { traceResult } = get();
    set({
      currentStepIndex: Math.max(0, traceResult.events.length - 1),
      isPlaying: false,
    });
  },

  // Graph actions
  setGraphData: (graphData) => {
    set({ graphData, isGraphPlaying: false });
    get().runGraphAlgorithm();
  },

  setSelectedGraphAlgo: (selectedGraphAlgo) => {
    set({ selectedGraphAlgo, isGraphPlaying: false });
    get().runGraphAlgorithm();
  },

  setGraphStartNode: (graphStartNode) => {
    set({ graphStartNode, isGraphPlaying: false });
    get().runGraphAlgorithm();
  },

  setGraphTargetNode: (graphTargetNode) => {
    set({ graphTargetNode, isGraphPlaying: false });
    get().runGraphAlgorithm();
  },

  runGraphAlgorithm: () => {
    const { graphData, selectedGraphAlgo, graphStartNode, graphTargetNode } = get();
    let steps: GraphTraceStep[] = [];
    switch (selectedGraphAlgo) {
      case 'bfs':
        steps = runBFS(graphData, graphStartNode);
        break;
      case 'dfs':
        steps = runDFS(graphData, graphStartNode);
        break;
      case 'dijkstra':
        steps = runDijkstra(graphData, graphStartNode, graphTargetNode);
        break;
      case 'astar':
        steps = runAStar(graphData, graphStartNode, graphTargetNode);
        break;
      case 'kruskal':
        steps = runKruskal(graphData);
        break;
      case 'topological':
        steps = runTopologicalSort(graphData);
        break;
      default:
        steps = runBFS(graphData, graphStartNode);
    }
    set({
      graphTraceSteps: steps,
      currentGraphStepIndex: 0,
      isGraphPlaying: false,
    });
  },

  stepGraphForward: () => {
    const { currentGraphStepIndex, graphTraceSteps } = get();
    if (currentGraphStepIndex < graphTraceSteps.length - 1) {
      set({ currentGraphStepIndex: currentGraphStepIndex + 1 });
    } else {
      set({ isGraphPlaying: false });
    }
  },

  stepGraphBackward: () => {
    const { currentGraphStepIndex } = get();
    if (currentGraphStepIndex > 0) {
      set({ currentGraphStepIndex: currentGraphStepIndex - 1, isGraphPlaying: false });
    }
  },

  goToGraphStep: (index) => {
    const { graphTraceSteps } = get();
    const clamped = Math.max(0, Math.min(index, graphTraceSteps.length - 1));
    set({ currentGraphStepIndex: clamped });
  },

  playGraph: () => set({ isGraphPlaying: true }),
  pauseGraph: () => set({ isGraphPlaying: false }),

  resetGraph: () => {
    set({ graphData: DEFAULT_GRAPH });
    get().runGraphAlgorithm();
  },
}));
