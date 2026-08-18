import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useRedditAnalysis } from './hooks/useRedditAnalysis';
import { Header } from './components/Header';
import { SubredditSearch } from './components/SubredditSearch';
import { OverviewStats } from './components/OverviewStats';
import { OverallVibeCard } from './components/OverallVibeCard';
import { SentimentCharts } from './components/SentimentCharts';
import { PostsList } from './components/PostsList';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EmptyState } from './components/EmptyState';
import { MethodologyModal } from './components/MethodologyModal';
import { ExportModal } from './components/ExportModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sparkles, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    currentSubreddit,
    posts,
    filteredPosts,
    summary,
    isLoading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    postSearchQuery,
    setPostSearchQuery,
    recentSearches,
    searchSubreddit,
    refresh,
  } = useRedditAnalysis();

  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);

  const hasData = Boolean(summary && posts.length > 0);

  const exportPayload = hasData && summary
    ? {
        subreddit: currentSubreddit,
        posts,
        summary,
      }
    : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 transition-colors duration-200 flex flex-col selection:bg-indigo-600 selection:text-white">
        {/* Navigation Header */}
        <Header
          onOpenMethodology={() => setIsMethodologyOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenTests={() => setIsTestsOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          hasData={hasData}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {/* Prominent Search Section */}
          <SubredditSearch
            currentSubreddit={currentSubreddit}
            isLoading={isLoading}
            onSearch={searchSubreddit}
            recentSearches={recentSearches}
          />

          {/* Conditional View Rendering */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorDisplay
              error={error}
              onRetry={refresh}
              onSelectSuggested={(sub) => searchSubreddit(sub)}
            />
          ) : hasData && summary ? (
            <div id="analytics-dashboard-view" className="space-y-8 animate-in fade-in duration-300">
              {/* 1. Overview Statistics KPI Cards */}
              <OverviewStats summary={summary} />

              {/* 2. Hero Overall Vibe Card */}
              <OverallVibeCard
                summary={summary}
                onOpenMethodology={() => setIsMethodologyOpen(true)}
              />

              {/* 3. Recharts Visualizations */}
              <SentimentCharts
                summary={summary}
                posts={posts}
                isDark={isDark}
              />

              {/* 4. Filterable & Sortable Hot Posts List */}
              <PostsList
                posts={filteredPosts}
                summary={summary}
                filter={filter}
                onFilterChange={setFilter}
                sort={sort}
                onSortChange={setSort}
                postSearchQuery={postSearchQuery}
                onPostSearchChange={setPostSearchQuery}
                onRefresh={refresh}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <EmptyState onSelectSubreddit={(sub) => searchSubreddit(sub)} />
          )}
        </main>

        {/* Application Footer */}
        <footer className="border-t border-zinc-800 bg-[#09090b]/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">The Subreddit Vibe Check</span>
              <span>•</span>
              <span>Full Stack Developer Internship Assignment</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Methodology & Docs
              </button>
              <span>•</span>
              <button
                onClick={() => setIsTestsOpen(true)}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Run Unit Tests
              </button>
              <span>•</span>
              <a
                href="https://www.reddit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors"
              >
                <span>Reddit.com</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <MethodologyModal
          isOpen={isMethodologyOpen}
          onClose={() => setIsMethodologyOpen(false)}
        />

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={exportPayload}
        />

        <TestRunnerModal
          isOpen={isTestsOpen}
          onClose={() => setIsTestsOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
