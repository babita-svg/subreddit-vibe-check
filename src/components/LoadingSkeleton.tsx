import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="loading-state" className="w-full space-y-6 animate-pulse">
      {/* Loading banner */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center gap-3 text-indigo-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm sm:text-base font-semibold">
          Analyzing the latest hot posts...
        </span>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-[#18181b] border border-zinc-800 p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-zinc-700/60 rounded" />
              <div className="h-7 w-7 bg-zinc-700/60 rounded-lg" />
            </div>
            <div className="h-6 w-16 bg-zinc-700/60 rounded" />
          </div>
        ))}
      </div>

      {/* Hero Vibe Card Skeleton */}
      <div className="h-48 rounded-xl bg-[#18181b] border border-zinc-800 p-6 flex flex-col justify-between" />

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 h-80 rounded-xl bg-[#18181b] border border-zinc-800" />
        <div className="lg:col-span-7 h-80 rounded-xl bg-[#18181b] border border-zinc-800" />
      </div>

      {/* Posts Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-36 rounded-xl bg-[#18181b] border border-zinc-800 p-4 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-zinc-700/60 rounded" />
              <div className="h-4 w-20 bg-zinc-700/60 rounded-full" />
            </div>
            <div className="h-4 w-full bg-zinc-700/60 rounded" />
            <div className="h-4 w-3/4 bg-zinc-700/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
