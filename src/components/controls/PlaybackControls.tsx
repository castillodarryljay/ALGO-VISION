import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FastForward, 
  Gauge
} from 'lucide-react';
import { useAlgoStore } from '../../store/useAlgoStore';

export const PlaybackControls: React.FC = () => {
  const {
    traceResult,
    currentStepIndex,
    isPlaying,
    playbackSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    restart,
    skipToEnd,
    goToStep,
    setPlaybackSpeed,
  } = useAlgoStore();

  const totalSteps = traceResult.events.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex >= totalSteps - 1) {
        pause();
        return;
      }

      timerRef.current = setTimeout(() => {
        stepForward();
      }, playbackSpeed);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, stepForward, pause]);

  // Speed presets
  const speedOptions = [
    { label: '0.25x', ms: 1200 },
    { label: '0.5x', ms: 800 },
    { label: '1x', ms: 500 },
    { label: '2x', ms: 250 },
    { label: '5x', ms: 100 },
  ];

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-lg border border-white/80 dark:border-white/10">
      {/* Timeline Slider & Step Count */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-slate-800 dark:text-zinc-200">
              Step <span className="text-cyan-600 dark:text-cyan-400 font-bold">{totalSteps > 0 ? currentStepIndex + 1 : 0}</span> / {totalSteps}
            </span>
            {totalSteps > 0 && currentStepIndex === totalSteps - 1 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium backdrop-blur-md">
                Completed
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-500 font-semibold">
            {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
          </span>
        </div>

        {/* Apple iOS Smooth Seekbar */}
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => {
            pause();
            goToStep(parseInt(e.target.value, 10));
          }}
          disabled={totalSteps <= 1}
          aria-label="Timeline seek"
          className="w-full h-2 bg-black/[0.06] dark:bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-cyan-500 focus:outline-none transition-all"
        />
      </div>

      {/* Control Buttons & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={restart}
            title="Restart from beginning"
            className="p-2.5 rounded-2xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-2xs"
            aria-label="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={stepBackward}
            disabled={currentStepIndex <= 0}
            title="Step Backward"
            className="p-2.5 rounded-2xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          {isPlaying ? (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-200 hover:bg-amber-500/25 border border-amber-500/40 font-semibold text-xs transition-all shadow-md active:scale-95"
              aria-label="Pause execution"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={play}
              disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-all shadow-lg shadow-cyan-600/30 active:scale-95"
              aria-label="Play execution"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentStepIndex >= totalSteps - 1 ? 'Finished' : 'Play'}</span>
            </button>
          )}

          {/* Next Step */}
          <button
            onClick={stepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Step Forward"
            className="p-2.5 rounded-2xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Skip to End */}
          <button
            onClick={skipToEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Skip to End"
            className="p-2.5 rounded-2xl glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
            aria-label="Skip to end"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls - Apple iOS Segmented Picker */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
            <Gauge className="w-3.5 h-3.5" />
            <span className="font-medium">Speed:</span>
          </div>

          <div className="inline-flex rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] p-1 border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
            {speedOptions.map(opt => {
              const isActive = playbackSpeed === opt.ms;
              return (
                <button
                  key={opt.label}
                  onClick={() => setPlaybackSpeed(opt.ms)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/5 dark:border-white/10'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
