import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Sun, 
  Moon, 
  Sliders, 
  GitCompare, 
  BookOpen, 
  Code2, 
  Network, 
  Binary, 
  ArrowUpDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAlgoStore, NavigationSection } from '../../store/useAlgoStore';
import { ALGORITHMS } from '../../engine/algorithmCatalog';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const { currentSection, setSection, theme, setTheme, selectAlgorithm } = useAlgoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredAlgos = searchQuery.trim() === '' ? [] : ALGORITHMS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems: { id: NavigationSection; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Boxes className="w-4 h-4" /> },
    { id: 'sorting', label: 'Sorting', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'searching', label: 'Searching', icon: <Binary className="w-4 h-4" /> },
    { id: 'data-structures', label: 'Data Structures', icon: <Boxes className="w-4 h-4" /> },
    { id: 'graphs', label: 'Graphs', icon: <Network className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning Lab', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'playground', label: 'Playground', icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/75 dark:bg-[#090a0f]/75 backdrop-blur-2xl text-slate-900 dark:text-zinc-100 transition-colors duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        
        {/* Brand */}
        <div 
          onClick={() => setSection('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-slate-900 dark:text-white">
              Algo<span className="text-cyan-600 dark:text-cyan-400">Vision</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/90 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-700/80 font-mono font-semibold tracking-wide backdrop-blur-md">by SHIRO</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">See the Logic. Understand the Algorithm.</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          {navItems.map(item => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/[0.05] dark:border-white/10' 
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.06]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 focus-within:ring-2 focus-within:ring-cyan-500/30 transition-all w-44 lg:w-56 backdrop-blur-md">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent border-none outline-none w-full placeholder-slate-400 dark:placeholder-zinc-500 text-xs text-slate-800 dark:text-zinc-200"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {searchOpen && filteredAlgos.length > 0 && (
              <div 
                className="absolute right-0 mt-2 w-72 glass-card rounded-2xl shadow-2xl p-2 z-50 text-xs max-h-80 overflow-y-auto border border-white/80 dark:border-white/10"
                onMouseLeave={() => setSearchOpen(false)}
              >
                <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-500 px-2 py-1">Matching Algorithms</div>
                {filteredAlgos.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      selectAlgorithm(a.id);
                      setSection(a.category === 'sorting' ? 'sorting' : 'searching');
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex flex-col gap-0.5 transition-colors"
                  >
                    <div className="flex items-center justify-between font-medium text-slate-800 dark:text-zinc-200">
                      <span>{a.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 capitalize">{a.category}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">{a.shortDescription}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all duration-200 active:scale-95 shadow-2xs backdrop-blur-md"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            title="Visualizer Settings"
            className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all duration-200 active:scale-95 shadow-2xs backdrop-blur-md"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white lg:hidden active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-2xl px-4 py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Mobile search bar */}
          <div className="relative mb-2">
            <div className="flex items-center bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-zinc-300">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search any algorithm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-slate-800 dark:text-zinc-200"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && filteredAlgos.length > 0 && (
              <div className="mt-1 glass-card rounded-xl shadow-xl p-2 text-xs space-y-1">
                {filteredAlgos.slice(0, 4).map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      selectAlgorithm(a.id);
                      setSection(a.category === 'sorting' ? 'sorting' : 'searching');
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-slate-800 dark:text-zinc-200 flex justify-between"
                  >
                    <span>{a.name}</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono capitalize">{a.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive 
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30' 
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Creator Attribution */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500">
            <span>Created by <strong className="text-cyan-600 dark:text-cyan-400">SHIRO</strong></span>
            <span className="font-mono text-[10px]">AlgoVision v1.0</span>
          </div>
        </div>
      )}
    </header>
  );
};
