/**
 * Type definitions for The Subreddit Vibe Check
 */

export type SentimentLabel = 'Positive' | 'Neutral' | 'Negative';

export type OverallVibeType = 'Positive' | 'Neutral' | 'Negative';

export interface PostSentiment {
  score: number;
  comparative: number;
  label: SentimentLabel;
  positiveWords: string[];
  negativeWords: string[];
}

export interface RedditPost {
  id: string;
  rank: number;
  title: string;
  author: string;
  score: number;
  comments: number;
  permalink: string;
  url: string;
  createdAt: number; // UTC timestamp in ms
  thumbnail?: string | null;
  isNsfw: boolean;
  isSpoiler: boolean;
  isPinned: boolean;
  selftext?: string;
  sentiment: PostSentiment;
}

export interface SentimentDistribution {
  positiveCount: number;
  positivePercent: number;
  neutralCount: number;
  neutralPercent: number;
  negativeCount: number;
  negativePercent: number;
}

export interface KeywordImpact {
  word: string;
  type: 'positive' | 'negative';
  frequency: number;
  scoreSum: number;
}

export interface AnalysisSummary {
  subreddit: string;
  totalPosts: number;
  positivePosts: number;
  neutralPosts: number;
  negativePosts: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  averageScore: number;
  comparativeAverage: number;
  highestSentimentScore: number;
  lowestSentimentScore: number;
  overallVibe: OverallVibeType;
  overallVibeSummary: string;
  analyzedAt: string;
  topKeywords: KeywordImpact[];
}

export interface AnalysisResult {
  subreddit: string;
  posts: RedditPost[];
  summary: AnalysisSummary;
}

export type SortOption = 'rank' | 'score' | 'sentiment-desc' | 'sentiment-asc' | 'comments';
export type FilterOption = 'all' | 'Positive' | 'Neutral' | 'Negative';
