import React, { useState } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { SupportedLanguage } from '../../types/algorithm';
import { getAlgorithmCode } from '../../codeRegistry/codeRegistry';
import { 
  Copy, 
  Check, 
  Download, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';

export const CodePanel: React.FC = () => {
  const { 
    selectedAlgorithmId, 
    language, 
    setLanguage, 
    traceResult, 
    currentStepIndex,
    codeFontSize,
    setCodeFontSize
  } = useAlgoStore();

  const [copied, setCopied] = useState(false);

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

  const lines = codeData ? codeData.code.split('\n') : [];

  return (
    <div className="glass-card rounded-3xl border border-white/80 dark:border-white/10 shadow-sm text-xs flex flex-col h-[520px] overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]">
        
        {/* Language Tabs - Apple iOS Segmented Picker */}
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] overflow-x-auto max-w-full backdrop-blur-md">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-3 py-1 rounded-xl font-semibold text-xs transition-all shrink-0 active:scale-95 ${
                language === lang.id
                  ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
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
            className="p-1.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCodeFontSize(Math.max(10, codeFontSize - 1))}
            title="Decrease font size"
            className="p-1.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy source code"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-subtle text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-medium">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            title="Download source file"
            className="p-1.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Synchronized Line-Highlighting Code View */}
      {codeData ? (
        <div 
          style={{ fontSize: `${codeFontSize}px` }}
          className="flex-1 overflow-auto font-mono bg-white/60 dark:bg-black/40 p-3 sm:p-4 leading-relaxed text-slate-800 dark:text-zinc-200 select-text backdrop-blur-sm"
        >
          {lines.map((lineContent, lineIdx) => {
            const lineNum = lineIdx + 1;
            const isHighlighted = activeLineNumber === lineNum;

            return (
              <div
                key={lineIdx}
                className={`flex items-start transition-colors px-2 py-0.5 rounded-lg ${
                  isHighlighted
                    ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-950 dark:text-cyan-100 font-bold border-l-3 border-cyan-500 shadow-xs'
                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                {/* Line number */}
                <span className={`w-8 shrink-0 text-right pr-3 select-none text-[11px] ${
                  isHighlighted ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-400 dark:text-zinc-600'
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
        <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-zinc-500">
          No code available for this algorithm.
        </div>
      )}

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <span>Language: <strong className="text-slate-800 dark:text-zinc-200 uppercase">{language}</strong></span>
        <span>Line Highlight: {activeLineNumber ? `Line #${activeLineNumber}` : 'Idle'}</span>
      </div>

    </div>
  );
};
