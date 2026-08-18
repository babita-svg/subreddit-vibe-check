import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Loader2, X, Flame } from 'lucide-react';
import { normalizeSubreddit } from '../utils/sentiment';

interface SubredditSearchProps {
  currentSubreddit: string;
  isLoading: boolean;
  onSearch: (subreddit: string) => void;
  recentSearches?: string[];
}

const PRIMARY_SUGGESTIONS = [
  { name: 'technology', label: 'r/technology', icon: '💻' },
  { name: 'programming', label: 'r/programming', icon: '⚡' },
  { name: 'gaming', label: 'r/gaming', icon: '🎮' },
  { name: 'movies', label: 'r/movies', icon: '🍿' },
  { name: 'science', label: 'r/science', icon: '🔬' },
];

const SECONDARY_SUGGESTIONS = [
  { name: 'space', label: 'r/space', icon: '🚀' },
  { name: 'worldnews', label: 'r/worldnews', icon: '🌍' },
  { name: 'webdev', label: 'r/webdev', icon: '🌐' },
  { name: 'gadgets', label: 'r/gadgets', icon: '📱' },
];

export const SubredditSearch: React.FC<SubredditSearchProps> = ({
  currentSubreddit,
  isLoading,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState(currentSubreddit || '');

  // Keep input in sync when currentSubreddit changes externally (e.g. from suggestions)
  useEffect(() => {
    if (currentSubreddit) {
      setInputValue(currentSubreddit);
    }
  }, [currentSubreddit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizeSubreddit(inputValue);
    if (cleaned && !isLoading) {
      onSearch(cleaned);
    }
  };

  const handleSuggestionClick = (subName: string) => {
    setInputValue(subName);
    if (!isLoading) {
      onSearch(subName);
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div id="subreddit-search-section" className="w-full max-w-4xl mx-auto space-y-3">
      {/* Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center rounded-lg bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 p-1.5 sm:p-2 transition-all focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          {/* Subreddit Prefix Icon */}
          <div className="flex items-center pl-3 pr-2 text-zinc-400 dark:text-zinc-500 select-none">
            <span className="text-sm sm:text-base font-medium text-zinc-500">r/</span>
          </div>

          {/* Subreddit Input */}
          <input
            id="subreddit-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="technology, programming, gaming, science..."
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm sm:text-base font-medium focus:outline-none disabled:opacity-50 py-1.5"
            aria-label="Enter subreddit name"
          />

          {/* Clear Button */}
          {inputValue && !isLoading && (
            <button
              id="search-clear-btn"
              type="button"
              onClick={handleClear}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mr-1 cursor-pointer"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Submit / Check Vibe Button */}
          <button
            id="check-vibe-btn"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
            aria-label="Check Vibe"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Check Vibe</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Quick Selection Tags */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 pl-1">
          Quick Select:
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {PRIMARY_SUGGESTIONS.map((item) => {
            const isActive = currentSubreddit.toLowerCase() === item.name.toLowerCase();
            return (
              <button
                key={item.name}
                id={`suggestion-btn-${item.name}`}
                type="button"
                onClick={() => handleSuggestionClick(item.name)}
                disabled={isLoading}
                className={`inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Secondary Suggestions on wider screens */}
          {SECONDARY_SUGGESTIONS.map((item) => {
            const isActive = currentSubreddit.toLowerCase() === item.name.toLowerCase();
            return (
              <button
                key={item.name}
                id={`suggestion-secondary-btn-${item.name}`}
                type="button"
                onClick={() => handleSuggestionClick(item.name)}
                disabled={isLoading}
                className={`hidden md:inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
