import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { AnalysisSummary, RedditPost } from '../types/reddit';
import { PieChart as PieIcon, BarChart3, MessageSquareText, TrendingUp } from 'lucide-react';
import { truncateString, formatSentimentScore } from '../utils/formatters';

interface SentimentChartsProps {
  summary: AnalysisSummary;
  posts: RedditPost[];
  isDark: boolean;
}

export const SentimentCharts: React.FC<SentimentChartsProps> = ({
  summary,
  posts,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'keywords'>('overview');

  // Distribution data for Pie/Donut Chart
  const pieData = [
    {
      name: 'Positive',
      value: summary.positivePosts,
      percentage: summary.positivePercentage,
      color: '#10b981', // emerald-500
    },
    {
      name: 'Neutral',
      value: summary.neutralPosts,
      percentage: summary.neutralPercentage,
      color: isDark ? '#71717a' : '#a1a1aa', // zinc-500 / zinc-400
    },
    {
      name: 'Negative',
      value: summary.negativePosts,
      percentage: summary.negativePercentage,
      color: '#f43f5e', // rose-500
    },
  ].filter((item) => item.value > 0);

  // Top 15 posts sorted by rank or absolute sentiment score for readable bar chart
  const barData = posts.slice(0, 15).map((post) => ({
    rank: `#${post.rank}`,
    title: post.title,
    truncatedTitle: truncateString(post.title, 24),
    score: post.sentiment.score,
    label: post.sentiment.label,
    redditScore: post.score,
    comments: post.comments,
    fill:
      post.sentiment.score > 0
        ? '#10b981'
        : post.sentiment.score < 0
        ? '#f43f5e'
        : isDark
        ? '#71717a'
        : '#a1a1aa',
  }));

  // Top emotional keywords data
  const keywordData = summary.topKeywords.slice(0, 10).map((k) => ({
    word: k.word,
    frequency: k.frequency,
    type: k.type,
    fill: k.type === 'positive' ? '#10b981' : '#f43f5e',
  }));

  const tooltipBg = isDark ? '#18181b' : '#ffffff';
  const tooltipBorder = isDark ? '#27272a' : '#e4e4e7';
  const tooltipText = isDark ? '#f4f4f5' : '#09090b';

  return (
    <section id="sentiment-visualizations" aria-label="Visual Analytics" className="w-full space-y-4">
      {/* Visualizations Section Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            <span>Sentiment Visualizations</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Interactive distribution and sentiment score breakdowns across hot posts.
          </p>
        </div>

        {/* Chart View Toggle Tabs */}
        <div className="flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold">
          <button
            id="tab-chart-overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            <span>Distribution & Posts</span>
          </button>

          <button
            id="tab-chart-keywords"
            onClick={() => setActiveTab('keywords')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'keywords'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            <span>Keywords ({summary.topKeywords.length})</span>
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Chart 1: Donut Distribution (5 cols) */}
          <div
            id="chart-sentiment-distribution"
            className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Sentiment Distribution
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {summary.totalPosts} Posts
              </span>
            </div>

            {/* Donut Chart Container */}
            <div className="h-64 sm:h-72 w-full my-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              color: tooltipText,
                            }}
                            className="p-3 rounded-lg shadow-xl border text-xs space-y-1 z-50"
                          >
                            <div className="font-bold flex items-center gap-1.5">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span>{data.name} Posts</span>
                            </div>
                            <div className="text-sm font-extrabold">{data.value} posts ({data.percentage}%)</div>
                            <div className="text-zinc-400">
                              {data.name === 'Positive' && 'Titles expressing positive emotion'}
                              {data.name === 'Neutral' && 'Objective, news, or neutral titles'}
                              {data.name === 'Negative' && 'Titles expressing critical/negative emotion'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Vibe
                </span>
                <span
                  className={`text-base font-bold ${
                    summary.overallVibe === 'Positive'
                      ? 'text-emerald-400'
                      : summary.overallVibe === 'Negative'
                      ? 'text-rose-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {summary.overallVibe}
                </span>
              </div>
            </div>

            {/* Quick Summary Footnote */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{summary.positivePercentage}%</div>
                <div className="text-zinc-500 text-[10px]">Positive</div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/40">
                <div className="font-bold text-zinc-700 dark:text-zinc-300">{summary.neutralPercentage}%</div>
                <div className="text-zinc-500 text-[10px]">Neutral</div>
              </div>
              <div className="p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
                <div className="font-bold text-rose-600 dark:text-rose-400">{summary.negativePercentage}%</div>
                <div className="text-zinc-500 text-[10px]">Negative</div>
              </div>
            </div>
          </div>

          {/* Chart 2: Sentiment by Post Bar Chart (7 cols) */}
          <div
            id="chart-sentiment-by-post"
            className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Sentiment by Post (Top 15 Hot Posts)
                </h4>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Hover bar for post details
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} opacity={0.6} />
                  <XAxis
                    dataKey="rank"
                    tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
                    interval={0}
                    label={{
                      value: 'Hot Post Rank',
                      position: 'insideBottom',
                      offset: -15,
                      fill: isDark ? '#71717a' : '#a1a1aa',
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
                    domain={[-5, 5]}
                    allowDecimals={false}
                  />
                  <ReferenceLine y={0} stroke={isDark ? '#52525b' : '#a1a1aa'} strokeWidth={1.5} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              color: tooltipText,
                            }}
                            className="p-3.5 rounded-lg shadow-xl border text-xs max-w-xs space-y-2 z-50"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-700 pb-1.5">
                              <span className="font-bold text-indigo-400">{data.rank} Hot Post</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  data.label === 'Positive'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : data.label === 'Negative'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : 'bg-zinc-500/20 text-zinc-400'
                                }`}
                              >
                                {data.label} ({formatSentimentScore(data.score, 0)})
                              </span>
                            </div>
                            <p className="font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2">
                              "{data.title}"
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                              <span>↑ {data.redditScore.toLocaleString()} upvotes</span>
                              <span>💬 {data.comments.toLocaleString()} comments</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 4, 4]} animationDuration={800}>
                    {barData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Positive Score (&gt; 0)
              </span>
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-zinc-500"></span> Neutral (0)
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> Negative (&lt; 0)
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Keywords Influence Bar Chart Tab */
        <div
          id="chart-keywords-breakdown"
          className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-indigo-500" />
                <span>Most Influential Sentiment Keywords in Titles</span>
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Frequency of emotional words detected across all 50 hot posts via AFINN lexicon.
              </p>
            </div>
          </div>

          {keywordData.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No strong emotional keywords detected in current post titles (predominantly factual/neutral titles).
            </div>
          ) : (
            <div className="h-72 w-full my-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={keywordData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} opacity={0.6} />
                  <XAxis
                    type="number"
                    tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="word"
                    type="category"
                    tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              color: tooltipText,
                            }}
                            className="p-3 rounded-lg shadow-xl border text-xs space-y-1 z-50"
                          >
                            <div className="font-bold capitalize">{data.word}</div>
                            <div>Appeared in <span className="font-bold">{data.frequency}</span> post titles</div>
                            <div
                              className={`font-semibold ${
                                data.type === 'positive' ? 'text-emerald-500' : 'text-rose-500'
                              }`}
                            >
                              {data.type === 'positive' ? 'Positive influence' : 'Negative influence'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
                    {keywordData.map((entry, index) => (
                      <Cell key={`kw-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
