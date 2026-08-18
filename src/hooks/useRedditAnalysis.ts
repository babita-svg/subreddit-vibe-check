import { useState, useMemo, useCallback, useEffect } from 'react';
import { RedditPost, AnalysisSummary, FilterOption, SortOption } from '../types/reddit';
import { fetchSubredditHotPosts, RedditApiError } from '../services/redditApi';
import { calculateSentimentStats, normalizeSubreddit } from '../utils/sentiment';

const RECENT_SEARCHES_KEY = 'vibecheck_recent_subreddits';

export function useRedditAnalysis() {
  const [currentSubreddit, setCurrentSubreddit] = useState<string>('');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<RedditApiError | null>(null);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('rank');
  const [postSearchQuery, setPostSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['technology', 'programming', 'gaming', 'science', 'movies'];
    } catch {
      return ['technology', 'programming', 'gaming', 'science', 'movies'];
    }
  });

  const saveRecentSearch = useCallback((sub: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== sub.toLowerCase());
      const updated = [sub, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const searchSubreddit = useCallback(
    async (rawInput: string) => {
      const normalized = normalizeSubreddit(rawInput);

      if (!normalized) {
        setError(new RedditApiError('Please enter a subreddit name to check.', 'NOT_FOUND'));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedPosts = await fetchSubredditHotPosts(normalized);
        const stats = calculateSentimentStats(normalized, fetchedPosts);

        setCurrentSubreddit(normalized);
        setPosts(fetchedPosts);
        setSummary(stats);
        saveRecentSearch(normalized);
      } catch (err: unknown) {
        if (err instanceof RedditApiError) {
          setError(err);
        } else {
          setError(
            new RedditApiError(
              'Unable to connect to Reddit. Please check your connection and try again.',
              'NETWORK'
            )
          );
        }
        setPosts([]);
        setSummary(null);
      } finally {
        setIsLoading(false);
      }
    },
    [saveRecentSearch]
  );

  const refresh = useCallback(() => {
    if (currentSubreddit) {
      searchSubreddit(currentSubreddit);
    }
  }, [currentSubreddit, searchSubreddit]);

  // Client-side filtering & sorting of analyzed posts without re-fetching
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by sentiment label
    if (filter !== 'all') {
      result = result.filter((p) => p.sentiment.label === filter);
    }

    // Filter by post title/author search
    if (postSearchQuery.trim()) {
      const q = postSearchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.sentiment.positiveWords.some((w) => w.toLowerCase().includes(q)) ||
          p.sentiment.negativeWords.some((w) => w.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sort) {
      case 'score':
        result.sort((a, b) => b.score - a.score);
        break;
      case 'comments':
        result.sort((a, b) => b.comments - a.comments);
        break;
      case 'sentiment-desc':
        result.sort((a, b) => b.sentiment.score - a.sentiment.score);
        break;
      case 'sentiment-asc':
        result.sort((a, b) => a.sentiment.score - b.sentiment.score);
        break;
      case 'rank':
      default:
        result.sort((a, b) => a.rank - b.rank);
        break;
    }

    return result;
  }, [posts, filter, sort, postSearchQuery]);

  return {
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
  };
}
