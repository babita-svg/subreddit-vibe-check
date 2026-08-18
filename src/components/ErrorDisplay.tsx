import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle, WifiOff, Ban, Clock } from 'lucide-react';
import { RedditApiError } from '../services/redditApi';

interface ErrorDisplayProps {
  error: RedditApiError | Error;
  onRetry: () => void;
  onSelectSuggested?: (subName: string) => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onSelectSuggested,
}) => {
  const isRedditError = error instanceof RedditApiError;
  const errorCode = isRedditError ? error.code : 'UNKNOWN';

  const getIcon = () => {
    switch (errorCode) {
      case 'NETWORK':
        return WifiOff;
      case 'FORBIDDEN':
        return Ban;
      case 'RATE_LIMITED':
        return Clock;
      case 'NOT_FOUND':
        return HelpCircle;
      default:
        return AlertTriangle;
    }
  };

  const IconComponent = getIcon();

  return (
    <section
      id="error-display-section"
      aria-label="Error Alert"
      className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-xl bg-white dark:bg-[#18181b] border border-rose-500/30 shadow-lg text-center space-y-4"
    >
      {/* Icon */}
      <div className="h-12 w-12 rounded-lg bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
        <IconComponent className="h-6 w-6" />
      </div>

      {/* Error Headline & Message */}
      <div className="space-y-1.5">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {errorCode === 'NOT_FOUND' && 'Subreddit Not Found'}
          {errorCode === 'NETWORK' && 'Connection Issue'}
          {errorCode === 'RATE_LIMITED' && 'Rate Limit Reached'}
          {errorCode === 'EMPTY' && 'No Hot Posts Found'}
          {errorCode === 'FORBIDDEN' && 'Subreddit Access Restricted'}
          {errorCode === 'UNKNOWN' && 'Something Went Wrong'}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          {error.message || "We couldn't process this request. Please try again."}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id="error-retry-btn"
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>

        {onSelectSuggested && (
          <button
            type="button"
            onClick={() => onSelectSuggested('technology')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-colors w-full sm:w-auto border border-zinc-200 dark:border-zinc-700 cursor-pointer"
          >
            <span>Try r/technology</span>
          </button>
        )}
      </div>

      {/* Helper Tips */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        Tip: Make sure the subreddit exists, is public, and is spelled correctly (e.g. <span className="font-mono text-zinc-700 dark:text-zinc-300">r/programming</span>, <span className="font-mono text-zinc-700 dark:text-zinc-300">r/gaming</span>).
      </div>
    </section>
  );
};
