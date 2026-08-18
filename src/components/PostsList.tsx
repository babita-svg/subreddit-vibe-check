import React from 'react';
import { RedditPost, FilterOption, SortOption, AnalysisSummary } from '../types/reddit';
import { PostCard } from './PostCard';
import {
  Flame,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

interface PostsListProps {
  posts: RedditPost[];
  summary: AnalysisSummary;
  filter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  postSearchQuery: string;
  onPostSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PostsList: React.FC<PostsListProps> = ({
  posts,
  summary,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  postSearchQuery,
  onPostSearchChange,
  onRefresh,
  isLoading,
}) => {
  return (
    <section id="hot-posts-section" aria-label="Analyzed Hot Reddit Posts" className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Flame className="h-5 w-5 text-indigo-500" />
              <span>Hot Posts Analysis</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              {summary.totalPosts} Posts Analyzed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time top 50 posts from r/{summary.subreddit} evaluated client-side.
          </p>
        </div>

        {/* Refresh button */}
        <button
          id="refresh-posts-btn"
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-medium self-start md:self-auto transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Refresh hot posts"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Sentiment Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mr-1 hidden sm:inline flex-shrink-0">
              Filter:
            </span>

            {/* All Filter */}
            <button
              id="filter-all-btn"
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>All</span>
              <span className="text-[11px] opacity-75 font-mono">({summary.totalPosts})</span>
            </button>

            {/* Positive Filter */}
            <button
              id="filter-positive-btn"
              onClick={() => onFilterChange('Positive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                filter === 'Positive'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-zinc-700 border border-emerald-200/60 dark:border-zinc-700'
              }`}
            >
              <span>Positive</span>
              <span className="text-[11px] opacity-75 font-mono">({summary.positivePosts})</span>
            </button>

            {/* Neutral Filter */}
            <button
              id="filter-neutral-btn"
              onClick={() => onFilterChange('Neutral')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                filter === 'Neutral'
                  ? 'bg-zinc-600 dark:bg-zinc-500 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <span>Neutral</span>
              <span className="text-[11px] opacity-75 font-mono">({summary.neutralPosts})</span>
            </button>

            {/* Negative Filter */}
            <button
              id="filter-negative-btn"
              onClick={() => onFilterChange('Negative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                filter === 'Negative'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 dark:bg-zinc-800 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-zinc-700 border border-rose-200/60 dark:border-zinc-700'
              }`}
            >
              <span>Negative</span>
              <span className="text-[11px] opacity-75 font-mono">({summary.negativePosts})</span>
            </button>
          </div>

          {/* Right Search & Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search within posts */}
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                id="post-search-input"
                type="text"
                value={postSearchQuery}
                onChange={(e) => onPostSearchChange(e.target.value)}
                placeholder="Search post titles..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:inline" />
              <select
                id="post-sort-select"
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="py-1.5 pl-2.5 pr-7 text-xs font-medium rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                aria-label="Sort posts by"
              >
                <option value="rank">Sort: Reddit Rank (#1 - #50)</option>
                <option value="score">Sort: Reddit Score (Highest Upvotes)</option>
                <option value="sentiment-desc">Sort: Sentiment (Most Positive)</option>
                <option value="sentiment-asc">Sort: Sentiment (Most Negative)</option>
                <option value="comments">Sort: Most Comments</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid List */}
      {posts.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 space-y-2">
          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">
            No posts match your current filter criteria
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Try switching the sentiment filter or clearing your keyword search.
          </p>
          <button
            onClick={() => {
              onFilterChange('all');
              onPostSearchChange('');
            }}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};
