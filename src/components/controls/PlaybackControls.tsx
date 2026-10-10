import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FastForward, 
  Gauge, 
  Sliders
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
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 sm:p-4 shadow-lg backdrop-blur-sm">
      {/* Timeline Slider & Step Count */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-zinc-200">
              Step <span className="text-cyan-400">{totalSteps > 0 ? currentStepIndex + 1 : 0}</span> / {totalSteps}
            </span>
            {totalSteps > 0 && currentStepIndex === totalSteps - 1 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80">Completed</span>
            )}
          </div>
          <span className="font-mono text-[11px] text-zinc-500">
            {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
          </span>
        </div>

        {/* Timeline Slider */}
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
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
        />
      </div>

      {/* Control Buttons & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Restart */}
          <button
            onClick={restart}
            title="Restart from beginning"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
            aria-label="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={stepBackward}
            disabled={currentStepIndex <= 0}
            title="Step Backward"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-700/60"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          {isPlaying ? (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/50 font-medium text-xs transition-colors shadow-sm"
              aria-label="Pause execution"
            >
              <Pause className="w-4 h-4 fill-amber-300" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={play}
              disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition-colors shadow-sm shadow-cyan-950"
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
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-700/60"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Skip to End */}
          <button
            onClick={skipToEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Skip to End"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-700/60"
            aria-label="Skip to end"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
            <Gauge className="w-3.5 h-3.5" />
            <span>Speed:</span>
          </div>

          <div className="inline-flex rounded-lg bg-zinc-800/80 p-0.5 border border-zinc-700/60">
            {speedOptions.map(opt => {
              const isSelected = playbackSpeed === opt.ms;
              return (
                <button
                  key={opt.label}
                  onClick={() => setPlaybackSpeed(opt.ms)}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
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
