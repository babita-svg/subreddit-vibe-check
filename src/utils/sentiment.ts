import Sentiment from 'sentiment';
import {
  AnalysisSummary,
  KeywordImpact,
  OverallVibeType,
  PostSentiment,
  RedditPost,
  SentimentLabel,
} from '../types/reddit';

const sentiment = new Sentiment();

/**
 * Normalizes a subreddit input query.
 * Handles inputs like 'technology', 'r/technology', '/r/technology/', '  R/programming  '
 */
export function normalizeSubreddit(input: string): string {
  if (!input) return '';
  let cleaned = input.trim();
  // Remove leading slashes and r/ prefixes
  cleaned = cleaned.replace(/^\/?r\//i, '');
  // Remove trailing slashes and query params if pasted from a full URL
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?reddit\.com\/r\//i, '');
  cleaned = cleaned.replace(/\/.*$/, '');
  // Remove any non-alphanumeric/underscore characters standard to subreddit naming
  cleaned = cleaned.replace(/[^a-zA-Z0-9_]/g, '');
  return cleaned;
}

/**
 * Analyzes the sentiment of a single post title client-side using the `sentiment` package.
 */
export function analyzePostSentiment(title: string): PostSentiment {
  if (!title || typeof title !== 'string') {
    return {
      score: 0,
      comparative: 0,
      label: 'Neutral',
      positiveWords: [],
      negativeWords: [],
    };
  }

  const result = sentiment.analyze(title);
  const score = result.score;
  const comparative = result.comparative || 0;
  const label = classifySentiment(score);

  return {
    score,
    comparative,
    label,
    positiveWords: result.positive || [],
    negativeWords: result.negative || [],
  };
}

/**
 * Classifies an individual sentiment score into Positive, Neutral, or Negative.
 * Rule:
 *   score > 0 => Positive
 *   score === 0 => Neutral
 *   score < 0 => Negative
 */
export function classifySentiment(score: number): SentimentLabel {
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
}

/**
 * Determines the overall community vibe based on the average sentiment score across all hot posts.
 * Rule:
 *   average score > 0.5 => Positive
 *   average score < -0.5 => Negative
 *   otherwise => Neutral
 */
export function getOverallVibe(averageScore: number): OverallVibeType {
  if (averageScore > 0.5) return 'Positive';
  if (averageScore < -0.5) return 'Negative';
  return 'Neutral';
}

/**
 * Generates an analytical summary text explaining the vibe score.
 */
export function getVibeSummary(
  vibe: OverallVibeType,
  avgScore: number,
  posPct: number,
  negPct: number,
  subreddit: string
): string {
  const formattedScore = avgScore > 0 ? `+${avgScore.toFixed(2)}` : avgScore.toFixed(2);
  const subDisplay = `r/${subreddit}`;

  if (vibe === 'Positive') {
    return `${subDisplay} is leaning distinctly positive (avg score ${formattedScore}). ${posPct}% of hot post titles express enthusiasm, achievements, or constructive discussions.`;
  }
  if (vibe === 'Negative') {
    return `${subDisplay} is currently skewing negative (avg score ${formattedScore}). ${negPct}% of hot post titles feature concerns, critical reports, or frustrating developments.`;
  }
  return `${subDisplay} maintains a balanced, neutral conversation tone (avg score ${formattedScore}). Most hot discussions focus on objective news, inquiries, or informational sharing.`;
}

/**
 * Extracts and aggregates the most influential positive and negative keywords detected in post titles.
 */
export function extractTopKeywords(posts: RedditPost[]): KeywordImpact[] {
  const keywordMap = new Map<string, { type: 'positive' | 'negative'; count: number; sum: number }>();

  posts.forEach((post) => {
    post.sentiment.positiveWords.forEach((word) => {
      const lower = word.toLowerCase();
      const existing = keywordMap.get(lower);
      if (existing) {
        existing.count += 1;
        existing.sum += 1;
      } else {
        keywordMap.set(lower, { type: 'positive', count: 1, sum: 1 });
      }
    });

    post.sentiment.negativeWords.forEach((word) => {
      const lower = word.toLowerCase();
      const existing = keywordMap.get(lower);
      if (existing) {
        existing.count += 1;
        existing.sum -= 1;
      } else {
        keywordMap.set(lower, { type: 'negative', count: 1, sum: -1 });
      }
    });
  });

  const keywords: KeywordImpact[] = Array.from(keywordMap.entries())
    .map(([word, data]) => ({
      word,
      type: data.type,
      frequency: data.count,
      scoreSum: data.sum,
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 12);

  return keywords;
}

/**
 * Calculates aggregate sentiment metrics and statistics for a batch of analyzed Reddit posts.
 */
export function calculateSentimentStats(subreddit: string, posts: RedditPost[]): AnalysisSummary {
  const totalPosts = posts.length;

  if (totalPosts === 0) {
    return {
      subreddit,
      totalPosts: 0,
      positivePosts: 0,
      neutralPosts: 0,
      negativePosts: 0,
      positivePercentage: 0,
      neutralPercentage: 0,
      negativePercentage: 0,
      averageScore: 0,
      comparativeAverage: 0,
      highestSentimentScore: 0,
      lowestSentimentScore: 0,
      overallVibe: 'Neutral',
      overallVibeSummary: `No posts available to analyze for r/${subreddit}.`,
      analyzedAt: new Date().toISOString(),
      topKeywords: [],
    };
  }

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let scoreSum = 0;
  let comparativeSum = 0;
  let maxScore = -Infinity;
  let minScore = Infinity;

  posts.forEach((post) => {
    const score = post.sentiment.score;
    scoreSum += score;
    comparativeSum += post.sentiment.comparative;

    if (score > maxScore) maxScore = score;
    if (score < minScore) minScore = score;

    if (post.sentiment.label === 'Positive') {
      positiveCount++;
    } else if (post.sentiment.label === 'Negative') {
      negativeCount++;
    } else {
      neutralCount++;
    }
  });

  const averageScore = Number((scoreSum / totalPosts).toFixed(2));
  const comparativeAverage = Number((comparativeSum / totalPosts).toFixed(4));
  const positivePercentage = Math.round((positiveCount / totalPosts) * 100);
  const neutralPercentage = Math.round((neutralCount / totalPosts) * 100);
  // Ensure percentages sum close to 100
  const negativePercentage = 100 - positivePercentage - neutralPercentage;

  const overallVibe = getOverallVibe(averageScore);
  const overallVibeSummary = getVibeSummary(
    overallVibe,
    averageScore,
    positivePercentage,
    negativePercentage,
    subreddit
  );
  const topKeywords = extractTopKeywords(posts);

  return {
    subreddit,
    totalPosts,
    positivePosts: positiveCount,
    neutralPosts: neutralCount,
    negativePosts: negativeCount,
    positivePercentage,
    neutralPercentage,
    negativePercentage,
    averageScore,
    comparativeAverage,
    highestSentimentScore: maxScore === -Infinity ? 0 : maxScore,
    lowestSentimentScore: minScore === Infinity ? 0 : minScore,
    overallVibe,
    overallVibeSummary,
    analyzedAt: new Date().toISOString(),
    topKeywords,
  };
}
