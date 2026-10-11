import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { 
  X, 
  Sun, 
  Moon, 
  Sliders, 
  Eye, 
  Type, 
  SlidersHorizontal 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    playbackSpeed,
    setPlaybackSpeed,
    codeFontSize,
    setCodeFontSize,
    explanationMode,
    setExplanationMode,
    reducedMotion,
    setReducedMotion,
    showComments,
    setShowComments,
  } = useAlgoStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md">
      <div className="glass-panel rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-xs text-slate-800 dark:text-zinc-200 border border-white/80 dark:border-white/15 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04]">
          <div className="flex items-center gap-2.5 font-bold text-sm text-slate-900 dark:text-white">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span>AlgoVision Preferences</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-5">
          
          {/* Theme Option */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100">Appearance Theme</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Choose dark or light visual interface</div>
            </div>
            <div className="flex items-center bg-black/[0.03] dark:bg-white/[0.06] p-1 rounded-2xl border border-black/[0.05] dark:border-white/10">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/15 text-cyan-300 shadow-sm border border-white/10' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-cyan-600 shadow-sm border border-black/5' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Explanation Mode */}
          <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100">Explanation Depth</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Intuitive beginner concepts vs technical details</div>
            </div>
            <div className="flex items-center bg-black/[0.03] dark:bg-white/[0.06] p-1 rounded-2xl border border-black/[0.05] dark:border-white/10">
              <button
                onClick={() => setExplanationMode('beginner')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  explanationMode === 'beginner' 
                    ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setExplanationMode('technical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  explanationMode === 'technical' 
                    ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                Technical
              </button>
            </div>
          </div>

          {/* Code Font Size */}
          <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-cyan-500" />
                <span>Code Editor Font Size</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Current: {codeFontSize}px</div>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min={11}
                max={18}
                value={codeFontSize}
                onChange={(e) => setCodeFontSize(parseInt(e.target.value, 10))}
                className="w-24 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Playback Default Delay */}
          <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
                <span>Step Delay Interval</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Default step duration ({playbackSpeed}ms)</div>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min={100}
                max={1200}
                step={50}
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseInt(e.target.value, 10))}
                className="w-24 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-500" />
                <span>Reduce Motion & Animations</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Instant transitions without smooth tweening</div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                reducedMotion ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                reducedMotion ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-black/[0.02] dark:bg-white/[0.03] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
            AlgoVision • Created by <span className="text-cyan-600 dark:text-cyan-400 font-bold">SHIRO</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white font-semibold text-xs transition-all active:scale-95"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
