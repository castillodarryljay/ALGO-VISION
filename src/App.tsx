/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAlgoStore } from './store/useAlgoStore';
import { Navbar } from './components/layout/Navbar';
import { HomeView } from './components/views/HomeView';
import { SortingView } from './components/views/SortingView';
import { SearchingView } from './components/views/SearchingView';
import { DataStructuresView } from './components/views/DataStructuresView';
import { GraphView } from './components/views/GraphView';
import { CompareView } from './components/views/CompareView';
import { LearningView } from './components/views/LearningView';
import { PlaygroundView } from './components/views/PlaygroundView';
import { SettingsModal } from './components/views/SettingsModal';
import { Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const { 
    currentSection, 
    theme, 
    isPlaying, 
    play, 
    pause, 
    stepForward, 
    stepBackward, 
    restart 
  } = useAlgoStore();

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) pause();
        else play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        restart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, play, pause, stepForward, stepBackward, restart]);

  // Sync theme class to html document element
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`${theme} theme-${theme} min-h-screen ${theme === 'dark' ? 'bg-[#090a0f] text-slate-100' : 'bg-[#f4f6fa] text-slate-900'} relative flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-cyan-500/25 selection:text-cyan-800 dark:selection:text-cyan-200`}>
      {/* iOS Liquid Glass Ambient Background Backlight Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/12 blur-[130px] transform-gpu" />
        <div className="absolute top-1/3 -left-36 w-[560px] h-[560px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[140px] transform-gpu" />
        <div className="absolute -bottom-36 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/12 dark:bg-teal-500/08 blur-[130px] transform-gpu" />
      </div>

      {/* Top Navbar with search and section switches */}
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentSection === 'home' && <HomeView />}
        {currentSection === 'sorting' && <SortingView />}
        {currentSection === 'searching' && <SearchingView />}
        {currentSection === 'data-structures' && <DataStructuresView />}
        {currentSection === 'graphs' && <GraphView />}
        {currentSection === 'compare' && <CompareView />}
        {currentSection === 'learning' && <LearningView />}
        {currentSection === 'playground' && <PlaygroundView />}
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />

      {/* Accessible Footer with creator attribution and keyboard hints */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl py-6 text-slate-500 dark:text-zinc-500 text-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-zinc-300">
              <span>AlgoVision</span>
              <span className="text-slate-400 dark:text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-zinc-400 font-normal">See the Logic. Understand the Algorithm.</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-medium backdrop-blur-md">
              <span>Designed & Built by</span>
              <strong className="text-slate-900 dark:text-white tracking-wide">SHIRO</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] text-slate-500 dark:text-zinc-500">
            <span className="hidden lg:inline">Shortcuts: [Space] Play/Pause • [← / →] Prev/Next • [R] Restart</span>
            <span className="hidden lg:inline text-slate-300 dark:text-zinc-700">•</span>
            <span className="text-slate-600 dark:text-zinc-400">100% Deterministic Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
