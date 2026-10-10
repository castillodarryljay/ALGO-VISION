import React from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { 
  X, 
  Sun, 
  Moon, 
  Sliders, 
  Check, 
  Eye, 
  Sparkles, 
  Gauge, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-xs text-zinc-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>AlgoVision Preferences & Accessibility</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-4">
          
          {/* Theme Option */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-zinc-100">Appearance Theme</div>
              <div className="text-[11px] text-zinc-400">Choose dark or light visual interface</div>
            </div>
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  theme === 'dark' ? 'bg-cyan-600 text-white' : 'text-zinc-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  theme === 'light' ? 'bg-cyan-600 text-white' : 'text-zinc-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Explanation Mode */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <div>
              <div className="font-semibold text-zinc-100">Explanation Depth</div>
              <div className="text-[11px] text-zinc-400">Intuitive beginner concepts vs mathematical notation</div>
            </div>
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setExplanationMode('beginner')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  explanationMode === 'beginner' ? 'bg-cyan-600 text-white' : 'text-zinc-400'
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setExplanationMode('technical')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  explanationMode === 'technical' ? 'bg-cyan-600 text-white' : 'text-zinc-400'
                }`}
              >
                Technical
              </button>
            </div>
          </div>

          {/* Code Font Size */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <div>
              <div className="font-semibold text-zinc-100">Code Editor Font Size</div>
              <div className="text-[11px] text-zinc-400">Current: {codeFontSize}px</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={11}
                max={18}
                value={codeFontSize}
                onChange={(e) => setCodeFontSize(parseInt(e.target.value, 10))}
                className="w-24 accent-cyan-500"
              />
              <span className="font-mono text-zinc-400 w-6 text-center">{codeFontSize}</span>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <div>
              <div className="font-semibold text-zinc-100">Reduced Motion</div>
              <div className="text-[11px] text-zinc-400">Disable smooth transitions for accessibility</div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                reducedMotion ? 'bg-cyan-600' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500 font-mono">
            AlgoVision • Created by <span className="text-cyan-400 font-bold">SHIRO</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
