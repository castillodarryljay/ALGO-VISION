import React, { useState } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { SupportedLanguage } from '../../types/algorithm';
import { getAlgorithmCode } from '../../codeRegistry/codeRegistry';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  EyeOff, 
  Terminal,
  AlertCircle
} from 'lucide-react';

export const CodePanel: React.FC = () => {
  const { 
    selectedAlgorithmId, 
    language, 
    setLanguage, 
    traceResult, 
    currentStepIndex,
    codeFontSize,
    setCodeFontSize,
    showComments,
    setShowComments
  } = useAlgoStore();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'viewer' | 'runner'>('viewer');

  // Sandbox runner state
  const [editableCode, setEditableCode] = useState<string>('');
  const [runnerOutput, setRunnerOutput] = useState<string>('');
  const [runnerError, setRunnerError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const codeData = getAlgorithmCode(selectedAlgorithmId, language);
  const currentEvent = traceResult.events[currentStepIndex];

  // Active highlighted line number
  const activeLineNumber = codeData && currentEvent ? codeData.lineMapping[currentEvent.codeLineKey] : null;

  const languages: { id: SupportedLanguage; label: string; ext: string }[] = [
    { id: 'javascript', label: 'JavaScript', ext: 'js' },
    { id: 'python', label: 'Python', ext: 'py' },
    { id: 'java', label: 'Java', ext: 'java' },
    { id: 'cpp', label: 'C++', ext: 'cpp' },
    { id: 'c', label: 'C', ext: 'c' },
    { id: 'csharp', label: 'C#', ext: 'cs' },
  ];

  const handleCopy = () => {
    if (!codeData) return;
    navigator.clipboard.writeText(codeData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!codeData) return;
    const currentLang = languages.find(l => l.id === language);
    const filename = `${selectedAlgorithmId}.${currentLang?.ext || 'txt'}`;
    const blob = new Blob([codeData.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunSandbox = () => {
    setIsRunning(true);
    setRunnerError(null);
    setRunnerOutput('');

    const capturedLogs: string[] = [];
    const originalLog = console.log;

    try {
      const codeToRun = editableCode || (codeData?.language === 'javascript' ? codeData.code : '');
      if (!codeToRun) {
        setRunnerError('No executable JavaScript code provided.');
        setIsRunning(false);
        return;
      }

      // Safe evaluation sandbox
      const testCode = `
        let output = [];
        const customLog = (...args) => output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        ${codeToRun}
        if (typeof bubbleSort === 'function') {
          customLog("Running bubbleSort([45, 12, 85, 32]):", bubbleSort([45, 12, 85, 32]));
        } else if (typeof mergeSort === 'function') {
          let testArr = [38, 27, 43, 3, 9];
          mergeSort(testArr, 0, testArr.length - 1);
          customLog("Running mergeSort on [38, 27, 43, 3, 9]:", testArr);
        } else if (typeof quickSort === 'function') {
          let testArr = [64, 25, 12, 22];
          quickSort(testArr, 0, testArr.length - 1);
          customLog("Running quickSort on [64, 25, 12, 22]:", testArr);
        } else if (typeof binarySearch === 'function') {
          customLog("Running binarySearch([4, 11, 19, 25, 33], 19):", binarySearch([4, 11, 19, 25, 33], 19));
        } else {
          customLog("Script executed successfully. Function defined.");
        }
        return output.join('\\n');
      `;

      const fn = new Function(testCode);
      const startTime = performance.now();
      const res = fn();
      const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
      setRunnerOutput(`${res}\n\n[Process completed in ${elapsed}ms]`);
    } catch (err: any) {
      setRunnerError(err.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const lines = codeData ? codeData.code.split('\n') : [];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm text-xs flex flex-col h-[520px]">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-950/80 rounded-t-xl">
        
        {/* Language Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors shrink-0 ${
                language === lang.id
                  ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/80 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Zoom In/Out */}
          <button
            onClick={() => setCodeFontSize(Math.min(18, codeFontSize + 1))}
            title="Increase font size"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCodeFontSize(Math.max(10, codeFontSize - 1))}
            title="Decrease font size"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy source code"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            title="Download source file"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Synchronized Line-Highlighting Code View */}
      {codeData ? (
        <div 
          style={{ fontSize: `${codeFontSize}px` }}
          className="flex-1 overflow-auto font-mono bg-zinc-950 p-2 sm:p-3 leading-relaxed text-zinc-300 select-text"
        >
          {lines.map((lineContent, lineIdx) => {
            const lineNum = lineIdx + 1;
            const isHighlighted = activeLineNumber === lineNum;

            return (
              <div
                key={lineIdx}
                className={`flex items-start transition-colors px-1 py-0.5 rounded ${
                  isHighlighted
                    ? 'bg-cyan-950/90 text-cyan-200 font-bold border-l-4 border-cyan-400 ring-1 ring-cyan-500/30'
                    : 'hover:bg-zinc-900/40 text-zinc-300'
                }`}
              >
                {/* Line number */}
                <span className={`w-8 shrink-0 text-right pr-3 select-none text-[11px] ${
                  isHighlighted ? 'text-cyan-400 font-bold' : 'text-zinc-600'
                }`}>
                  {lineNum}
                </span>

                {/* Line code */}
                <span className="flex-1 whitespace-pre">
                  {lineContent}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-zinc-500 font-mono text-center">
          <Code2 className="w-8 h-8 text-zinc-700 mb-2" />
          <span>Implementation in progress for {language} for this specific algorithm.</span>
        </div>
      )}

      {/* Sandbox Code Runner Footer bar */}
      <div className="p-2 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[11px] font-mono">Sync: Step #{currentStepIndex + 1} → Line {activeLineNumber ?? '–'}</span>
        </div>

        {language === 'javascript' && (
          <button
            onClick={handleRunSandbox}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700/80 font-medium"
          >
            <Play className="w-3 h-3 fill-cyan-300" />
            <span>Test Sandbox</span>
          </button>
        )}
      </div>

      {/* Runner Output Overlay if executed */}
      {runnerOutput && (
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 font-mono text-[11px] text-zinc-200 max-h-36 overflow-y-auto">
          <div className="text-zinc-500 uppercase text-[10px] font-sans font-semibold mb-1">Sandbox Console Output:</div>
          <pre className="whitespace-pre-wrap text-emerald-400">{runnerOutput}</pre>
        </div>
      )}
      {runnerError && (
        <div className="p-3 bg-rose-950/80 border-t border-rose-800 font-mono text-[11px] text-rose-300">
          <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-0.5">
            <AlertCircle className="w-3.5 h-3.5" /> Error
          </div>
          <pre className="whitespace-pre-wrap">{runnerError}</pre>
        </div>
      )}
    </div>
  );
};
