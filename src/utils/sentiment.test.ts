import {
  analyzePostSentiment,
  classifySentiment,
  calculateSentimentStats,
  getOverallVibe,
  normalizeSubreddit,
} from './sentiment';
import { RedditPost } from '../types/reddit';

/**
 * Self-contained test suite verifying sentiment logic, normalization, and aggregation rules.
 * Can be run in browser console or node runner.
 */
export function runSentimentTests(): { total: number; passed: number; failed: number; results: Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }> } {
  const results: Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }> = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, status: 'PASS' });
    } catch (err: any) {
      results.push({ name, status: 'FAIL', error: err?.message || String(err) });
    }
  }

  function expect(actual: any) {
    return {
      toBe(expected: any) {
        if (actual !== expected) {
          throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
      },
      toBeGreaterThan(expected: number) {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeLessThan(expected: number) {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toEqual(expected: any) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
      },
    };
  }

  // 1. Subreddit Normalization Tests
  test('Normalizes simple name "technology"', () => {
    expect(normalizeSubreddit('technology')).toBe('technology');
  });

  test('Normalizes "r/technology" prefix', () => {
    expect(normalizeSubreddit('r/technology')).toBe('technology');
  });

  test('Normalizes "/r/programming/" with leading/trailing slashes', () => {
    expect(normalizeSubreddit('/r/programming/')).toBe('programming');
  });

  test('Normalizes full URL "https://reddit.com/r/gaming"', () => {
    expect(normalizeSubreddit('https://reddit.com/r/gaming')).toBe('gaming');
  });

  test('Normalizes whitespace and uppercase "  R/Science  "', () => {
    expect(normalizeSubreddit('  R/Science  ')).toBe('Science');
  });

  // 2. Positive Sentiment Title
  test('Analyzes positive title accurately', () => {
    const res = analyzePostSentiment('Outstanding breakthrough! Scientists achieve incredible success with clean fusion energy');
    expect(res.score).toBeGreaterThan(0);
    expect(res.label).toBe('Positive');
    expect(res.positiveWords.length).toBeGreaterThan(0);
  });

  // 3. Negative Sentiment Title
  test('Analyzes negative title accurately', () => {
    const res = analyzePostSentiment('Horrible catastrophic crash destroys server infrastructure during terrible storm');
    expect(res.score).toBeLessThan(0);
    expect(res.label).toBe('Negative');
    expect(res.negativeWords.length).toBeGreaterThan(0);
  });

  // 4. Neutral Sentiment Title
  test('Analyzes neutral title accurately', () => {
    const res = analyzePostSentiment('Release notes for version 4.2.0 scheduled for Tuesday afternoon');
    expect(res.score).toBe(0);
    expect(res.label).toBe('Neutral');
  });

  // 5. Classification Rules
  test('Classifies positive score as Positive', () => {
    expect(classifySentiment(3)).toBe('Positive');
  });

  test('Classifies negative score as Negative', () => {
    expect(classifySentiment(-2)).toBe('Negative');
  });

  test('Classifies zero score as Neutral', () => {
    expect(classifySentiment(0)).toBe('Neutral');
  });

  // 6. Overall Vibe Determination Rules
  test('Determines positive overall vibe when average score > 0.5', () => {
    expect(getOverallVibe(0.85)).toBe('Positive');
  });

  test('Determines negative overall vibe when average score < -0.5', () => {
    expect(getOverallVibe(-0.65)).toBe('Negative');
  });

  test('Determines neutral overall vibe when average score is between -0.5 and 0.5', () => {
    expect(getOverallVibe(0.2)).toBe('Neutral');
    expect(getOverallVibe(-0.1)).toBe('Neutral');
  });

  // 7. Statistics calculation with empty posts
  test('Handles empty posts array gracefully without throwing', () => {
    const stats = calculateSentimentStats('empty', []);
    expect(stats.totalPosts).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.overallVibe).toBe('Neutral');
  });

  // 8. Statistics calculation with realistic mock dataset
  test('Calculates aggregated statistics and percentages correctly', () => {
    const mockPosts: RedditPost[] = [
      {
        id: '1',
        rank: 1,
        title: 'Awesome news!',
        author: 'u/alice',
        score: 1500,
        comments: 120,
        permalink: '/r/test/1',
        url: 'https://reddit.com/r/test/1',
        createdAt: Date.now(),
        isNsfw: false,
        isSpoiler: false,
        isPinned: false,
        sentiment: { score: 3, comparative: 1.5, label: 'Positive', positiveWords: ['awesome'], negativeWords: [] },
      },
      {
        id: '2',
        rank: 2,
        title: 'Terrible crash bug',
        author: 'u/bob',
        score: 800,
        comments: 95,
        permalink: '/r/test/2',
        url: 'https://reddit.com/r/test/2',
        createdAt: Date.now(),
        isNsfw: false,
        isSpoiler: false,
        isPinned: false,
        sentiment: { score: -3, comparative: -1.0, label: 'Negative', positiveWords: [], negativeWords: ['terrible', 'crash'] },
      },
      {
        id: '3',
        rank: 3,
        title: 'Weekly discussion thread',
        author: 'u/charlie',
        score: 200,
        comments: 40,
        permalink: '/r/test/3',
        url: 'https://reddit.com/r/test/3',
        createdAt: Date.now(),
        isNsfw: false,
        isSpoiler: false,
        isPinned: false,
        sentiment: { score: 0, comparative: 0, label: 'Neutral', positiveWords: [], negativeWords: [] },
      },
    ];

    const stats = calculateSentimentStats('test', mockPosts);
    expect(stats.totalPosts).toBe(3);
    expect(stats.positivePosts).toBe(1);
    expect(stats.negativePosts).toBe(1);
    expect(stats.neutralPosts).toBe(1);
    expect(stats.averageScore).toBe(0);
    expect(stats.overallVibe).toBe('Neutral');
  });

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}
