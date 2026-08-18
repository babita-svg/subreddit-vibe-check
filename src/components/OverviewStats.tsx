import React from 'react';
import { AnalysisSummary } from '../types/reddit';
import { Layers, ThumbsUp, Minus, ThumbsDown, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { formatSentimentScore } from '../utils/formatters';

interface OverviewStatsProps {
  summary: AnalysisSummary;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ summary }) => {
  const {
    totalPosts,
    positivePosts,
    neutralPosts,
    negativePosts,
    positivePercentage,
    neutralPercentage,
    negativePercentage,
    averageScore,
    highestSentimentScore,
    lowestSentimentScore,
  } = summary;

  return (
    <section id="overview-statistics" aria-label="Sentiment Statistics" className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Posts Analyzed */}
        <div
          id="stat-card-total-posts"
          className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Posts Analyzed</p>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalPosts}</span>
              <span className="text-[10px] text-zinc-400">Sample Size</span>
            </div>
            <p className="mt-1 text-[10px] text-zinc-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Reddit Hot 50
            </p>
          </div>
        </div>

        {/* Card 2: Average Sentiment */}
        <div
          id="stat-card-average-sentiment"
          className="p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Avg. Sentiment</p>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  averageScore > 0
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : averageScore < 0
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {formatSentimentScore(averageScore)}
              </span>
              <span
                className={`text-[10px] ${
                  averageScore > 0
                    ? 'text-emerald-500/70'
                    : averageScore < 0
                    ? 'text-rose-500/70'
                    : 'text-zinc-500'
                }`}
              >
                {averageScore > 0 ? 'Positive' : averageScore < 0 ? 'Negative' : 'Neutral'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span>+{highestSentimentScore} Max</span>
              <span>•</span>
              <span>{lowestSentimentScore} Min</span>
            </div>
          </div>
        </div>

        {/* Card 3: Positive Posts */}
        <div
          id="stat-card-positive-posts"
          className="p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Positive</p>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                {positivePercentage}%
              </span>
              <span className="text-[10px] text-zinc-400">{positivePosts} posts</span>
            </div>
            <p className="mt-1 text-[10px] text-zinc-500">score &gt; 0</p>
          </div>
        </div>

        {/* Card 4: Neutral Posts */}
        <div
          id="stat-card-neutral-posts"
          className="p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Neutral</p>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                {neutralPercentage}%
              </span>
              <span className="text-[10px] text-zinc-400">{neutralPosts} posts</span>
            </div>
            <p className="mt-1 text-[10px] text-zinc-500">score = 0</p>
          </div>
        </div>

        {/* Card 5: Negative Posts */}
        <div
          id="stat-card-negative-posts"
          className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Negative</p>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">
                {negativePercentage}%
              </span>
              <span className="text-[10px] text-zinc-400">{negativePosts} posts</span>
            </div>
            <p className="mt-1 text-[10px] text-zinc-500">score &lt; 0</p>
          </div>
        </div>
      </div>
    </section>
  );
};
