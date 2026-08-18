import React from 'react';
import { Compass, Sparkles, Activity, ShieldCheck, Flame } from 'lucide-react';

interface EmptyStateProps {
  onSelectSubreddit: (name: string) => void;
}

const STARTER_PREVIEWS = [
  {
    name: 'technology',
    title: 'r/technology',
    tagline: 'AI releases, tech policy, hardware launches',
    icon: '💻',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/40',
  },
  {
    name: 'programming',
    title: 'r/programming',
    tagline: 'Software engineering, languages, architecture',
    icon: '⚡',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900/40',
  },
  {
    name: 'science',
    title: 'r/science',
    tagline: 'Peer-reviewed research, climate, space, medicine',
    icon: '🔬',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/40',
  },
  {
    name: 'gaming',
    title: 'r/gaming',
    tagline: 'Game releases, community discussions, industry news',
    icon: '🎮',
    color: 'from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-900/40',
  },
  {
    name: 'movies',
    title: 'r/movies',
    tagline: 'Box office reviews, cinema trailers, actor debates',
    icon: '🍿',
    color: 'from-rose-500/10 to-red-500/10 border-rose-200 dark:border-rose-900/40',
  },
  {
    name: 'space',
    title: 'r/space',
    tagline: 'Telescope discoveries, rocket launches, astrophysics',
    icon: '🚀',
    color: 'from-cyan-500/10 to-blue-500/10 border-cyan-200 dark:border-cyan-900/40',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectSubreddit }) => {
  return (
    <section
      id="empty-state-section"
      aria-label="Welcome and Getting Started"
      className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-10"
    >
      {/* Hero Welcome Card */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Real-time Reddit Community Pulse</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Ready to check the vibe?
        </h2>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Enter any public subreddit above to analyze the sentiment of its top 50 hottest posts in real time.
        </p>
      </div>

      {/* Suggested Subreddit Starter Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 px-1">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-indigo-500" />
            <span>Popular Subreddits to Explore</span>
          </span>
          <span>Click to analyze instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {STARTER_PREVIEWS.map((sub) => (
            <button
              key={sub.name}
              id={`starter-card-${sub.name}`}
              type="button"
              onClick={() => onSelectSubreddit(sub.name)}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 text-left shadow-sm hover:border-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl sm:text-3xl select-none">{sub.icon}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  Analyze 50
                </span>
              </div>
              <div className="mt-3">
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-400 transition-colors">
                  {sub.title}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                  {sub.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analytical Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Top 50 Hot Posts</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Directly queries Reddit's official <span className="font-mono text-zinc-300">/hot.json</span> feed for 50 active discussions.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">AFINN-165 Sentiment</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Evaluates emotional valence client-side using a validated lexicon without sending data to external AI servers.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex-shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Private & Transparent</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Fully explainable scoring threshold rules with no tracking, logins, or hidden algorithms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
