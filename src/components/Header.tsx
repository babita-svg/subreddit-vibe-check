import React from 'react';
import { Sparkles, BookOpen, Sun, Moon, Github, CheckCircle2, Download } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology: () => void;
  onOpenExport?: () => void;
  onOpenTests?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMethodology,
  onOpenExport,
  onOpenTests,
  isDark,
  onToggleTheme,
  hasData,
}) => {
  return (
    <header
      id="app-header"
      className="border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-30 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                The Subreddit Vibe Check
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                Reddit Hot API • Live 50
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 truncate">
              Analyze the mood of Reddit's hottest conversations
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* GitHub Repo Link */}
          <a
            id="github-repo-link"
            href="https://github.com/babita-svg/subreddit-vibe-check"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mr-1"
            title="View Repository on GitHub"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a>

          {/* Test Runner Button */}
          {onOpenTests && (
            <button
              id="test-runner-btn"
              onClick={onOpenTests}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-zinc-800 border border-emerald-200 dark:border-zinc-700 hover:bg-emerald-100 dark:hover:bg-zinc-700 transition-colors"
              title="Run Sentiment Unit Tests"
              aria-label="Run Unit Tests"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Unit Tests</span>
            </button>
          )}

          {/* Methodology / About Button */}
          <button
            id="methodology-modal-btn"
            onClick={onOpenMethodology}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors"
            aria-label="View Analysis Methodology and About"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Methodology</span>
          </button>

          {/* Export Data Button */}
          {hasData && onOpenExport && (
            <button
              id="export-data-btn"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors"
              title="Export Sentiment Data"
              aria-label="Export Data"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Data</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
