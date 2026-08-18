import { RedditPost } from '../types/reddit';
import { normalizeSubreddit, analyzePostSentiment } from '../utils/sentiment';

export class RedditApiError extends Error {
  statusCode?: number;
  code: 'NOT_FOUND' | 'FORBIDDEN' | 'RATE_LIMITED' | 'EMPTY' | 'NETWORK' | 'UNKNOWN';

  constructor(message: string, code: 'NOT_FOUND' | 'FORBIDDEN' | 'RATE_LIMITED' | 'EMPTY' | 'NETWORK' | 'UNKNOWN', statusCode?: number) {
    super(message);
    this.name = 'RedditApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

interface RawRedditPostChild {
  kind: string;
  data: {
    id: string;
    title: string;
    author: string;
    score: number;
    num_comments: number;
    permalink: string;
    url: string;
    created_utc: number;
    thumbnail?: string;
    over_18: boolean;
    spoiler: boolean;
    stickied?: boolean;
    selftext?: string;
    post_hint?: string;
  };
}

interface RawRedditResponse {
  kind: string;
  data: {
    after: string | null;
    dist: number;
    children: RawRedditPostChild[];
  };
  error?: number;
  message?: string;
}

/**
 * Validates thumbnail URL to ensure it's a real image and not Reddit placeholder string
 */
function cleanThumbnail(thumb?: string): string | null {
  if (!thumb) return null;
  if (['self', 'default', 'nsfw', 'spoiler', 'image', ''].includes(thumb)) return null;
  if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
    return thumb;
  }
  return null;
}

/**
 * Dedicated API service to fetch and normalize top 50 HOT posts from Reddit.
 * Adheres strictly to the Reddit hot endpoint specification.
 */
export async function fetchSubredditHotPosts(rawSubredditInput: string): Promise<RedditPost[]> {
  const normalized = normalizeSubreddit(rawSubredditInput);

  if (!normalized) {
    throw new RedditApiError('Please enter a valid subreddit name.', 'NOT_FOUND');
  }

  // Target endpoint as specified in requirements
  const primaryUrl = `https://www.reddit.com/r/${normalized}/hot.json?limit=50&raw_json=1`;
  const fallbackUrls = [
    `https://api.reddit.com/r/${normalized}/hot.json?limit=50&raw_json=1`,
    `https://corsproxy.io/?url=${encodeURIComponent(`https://www.reddit.com/r/${normalized}/hot.json?limit=50&raw_json=1`)}`,
  ];

  let rawData: RawRedditResponse | null = null;
  let lastStatus = 0;
  let fetchFailed = false;

  // Try primary endpoint first
  try {
    const response = await fetch(primaryUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    lastStatus = response.status;

    if (response.status === 404) {
      throw new RedditApiError(
        "We couldn't find that subreddit. Check the name and try again.",
        'NOT_FOUND',
        404
      );
    }

    if (response.status === 403) {
      throw new RedditApiError(
        'This subreddit is private, restricted, or banned.',
        'FORBIDDEN',
        403
      );
    }

    if (response.status === 429) {
      throw new RedditApiError(
        'Reddit API rate limit exceeded. Please wait a moment and try again.',
        'RATE_LIMITED',
        429
      );
    }

    if (response.ok) {
      rawData = await response.json();
    } else {
      fetchFailed = true;
    }
  } catch (err: any) {
    if (err instanceof RedditApiError) {
      throw err;
    }
    fetchFailed = true;
  }

  // If primary fetch was blocked by CORS or network, attempt fallbacks
  if (fetchFailed || !rawData) {
    for (const url of fallbackUrls) {
      try {
        const fallbackRes = await fetch(url);
        if (fallbackRes.ok) {
          rawData = await fallbackRes.json();
          break;
        } else if (fallbackRes.status === 404) {
          throw new RedditApiError(
            "We couldn't find that subreddit. Check the name and try again.",
            'NOT_FOUND',
            404
          );
        } else if (fallbackRes.status === 403) {
          throw new RedditApiError(
            'This subreddit is private, restricted, or banned.',
            'FORBIDDEN',
            403
          );
        }
      } catch (fbErr: any) {
        if (fbErr instanceof RedditApiError) throw fbErr;
        // Continue to next fallback
      }
    }
  }

  // Check if all attempts failed
  if (!rawData || !rawData.data || !Array.isArray(rawData.data.children)) {
    if (lastStatus === 404) {
      throw new RedditApiError(
        "We couldn't find that subreddit. Check the name and try again.",
        'NOT_FOUND',
        404
      );
    }
    if (lastStatus === 429) {
      throw new RedditApiError(
        'Reddit API rate limit exceeded. Please wait a moment and try again.',
        'RATE_LIMITED',
        429
      );
    }
    throw new RedditApiError(
      'Unable to connect to Reddit. Please check your connection and try again.',
      'NETWORK',
      lastStatus || 500
    );
  }

  const children = rawData.data.children;

  if (children.length === 0) {
    throw new RedditApiError('This subreddit returned no hot posts.', 'EMPTY');
  }

  // Filter out any non-post entries and cap strictly at top 50
  const normalizedPosts: RedditPost[] = children
    .filter((child) => child && child.data && child.data.id)
    .slice(0, 50)
    .map((child, index) => {
      const d = child.data;
      const title = d.title || 'Untitled Post';
      const sentiment = analyzePostSentiment(title);

      return {
        id: d.id,
        rank: index + 1,
        title,
        author: d.author ? `u/${d.author}` : '[deleted]',
        score: typeof d.score === 'number' ? d.score : 0,
        comments: typeof d.num_comments === 'number' ? d.num_comments : 0,
        permalink: d.permalink ? `https://reddit.com${d.permalink}` : `https://reddit.com/r/${normalized}`,
        url: d.url || (d.permalink ? `https://reddit.com${d.permalink}` : ''),
        createdAt: d.created_utc ? d.created_utc * 1000 : Date.now(),
        thumbnail: cleanThumbnail(d.thumbnail),
        isNsfw: Boolean(d.over_18),
        isSpoiler: Boolean(d.spoiler),
        isPinned: Boolean(d.stickied),
        selftext: d.selftext || '',
        sentiment,
      };
    });

  return normalizedPosts;
}
