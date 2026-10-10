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
    <div className={`theme-${theme} min-h-screen ${theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors antialiased`}>
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
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
              <span>AlgoVision</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-normal">See the Logic. Understand the Algorithm.</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-medium">
              <span>Designed & Built by</span>
              <strong className="text-white tracking-wide">SHIRO</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] text-zinc-500">
            <span className="hidden lg:inline">Shortcuts: [Space] Play/Pause • [← / →] Prev/Next • [R] Restart</span>
            <span className="hidden lg:inline text-zinc-700">•</span>
            <span className="text-zinc-400">100% Deterministic Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
