import React from 'react';
import { AnalysisSummary } from '../types/reddit';
import { Sparkles, Smile, Meh, Frown, Compass, Info } from 'lucide-react';
import { formatSentimentScore } from '../utils/formatters';

interface OverallVibeCardProps {
  summary: AnalysisSummary;
  onOpenMethodology?: () => void;
}

export const OverallVibeCard: React.FC<OverallVibeCardProps> = ({
  summary,
  onOpenMethodology,
}) => {
  const {
    subreddit,
    overallVibe,
    averageScore,
    overallVibeSummary,
    positivePercentage,
    negativePercentage,
    neutralPercentage,
  } = summary;

  // Visual styling variants based on calculated vibe
  const config = {
    Positive: {
      label: 'Positive Vibe',
      emoji: '😊',
      icon: Smile,
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      accentColor: 'text-emerald-400',
    },
    Negative: {
      label: 'Negative Vibe',
      emoji: '🙁',
      icon: Frown,
      badgeBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      accentColor: 'text-rose-400',
    },
    Neutral: {
      label: 'Neutral Vibe',
      emoji: '😐',
      icon: Meh,
      badgeBg: 'bg-zinc-500/10 text-zinc-300 border border-zinc-500/20',
      accentColor: 'text-zinc-300',
    },
  }[overallVibe];

  const IconComponent = config.icon;

  return (
    <section
      id="overall-vibe-card"
      aria-label="Overall Community Vibe"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-[#18181b] dark:from-[#1e1e24] dark:to-[#18181b] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-sm transition-all duration-300"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Vibe Mood, Emoji & Narrative */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              Community Vibe Check
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-zinc-400">
              r/{subreddit}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 shadow-sm flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 select-none">
              <span>{config.emoji}</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Overall Vibe: <span className={config.accentColor}>{overallVibe}</span>
                </h2>
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeBg}`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                  <span>{config.label}</span>
                </div>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Average Sentiment: <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{formatSentimentScore(averageScore)}</span>
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-0.5">
            {overallVibeSummary}
          </p>

          {onOpenMethodology && (
            <button
              id="vibe-methodology-link"
              onClick={onOpenMethodology}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors pt-0.5 cursor-pointer"
            >
              <Info className="h-3 w-3" />
              <span>How is this vibe calculated? (Threshold &gt; +0.5 / &lt; -0.5)</span>
            </button>
          )}
        </div>

        {/* Right Side: Visual Vibe Gauge Spectrum */}
        <div className="w-full lg:w-80 p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Sentiment Spectrum
            </span>
            <span className="font-mono text-zinc-500 dark:text-zinc-400">
              {formatSentimentScore(averageScore)} / 5.0
            </span>
          </div>

          {/* Color Gradient Track */}
          <div className="relative pt-1.5 pb-1">
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-rose-500 via-zinc-600 to-emerald-500 relative">
              {/* Threshold tick marks */}
              <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-white/70" title="-0.5 Negative Threshold" />
              <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white/90" title="0.0 Neutral Center" />
              <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-white/70" title="+0.5 Positive Threshold" />

              {/* Indicator Pin */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-md flex items-center justify-center transition-all duration-500"
                style={{
                  left: `${Math.min(95, Math.max(5, ((averageScore + 2.5) / 5) * 100))}%`,
                }}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    overallVibe === 'Positive'
                      ? 'bg-emerald-500'
                      : overallVibe === 'Negative'
                      ? 'bg-rose-500'
                      : 'bg-zinc-400'
                  }`}
                />
              </div>
            </div>

            {/* Scale Labels */}
            <div className="flex justify-between text-[9px] font-medium text-zinc-500 mt-1.5">
              <span>-2.5 (Negative)</span>
              <span>0 (Neutral)</span>
              <span>+2.5 (Positive)</span>
            </div>
          </div>

          {/* Mini Percentage Composition Bar */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-1 flex justify-between">
              <span>Mood Composition</span>
              <span>{positivePercentage}% Pos • {neutralPercentage}% Neu • {negativePercentage}% Neg</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden flex bg-zinc-200 dark:bg-zinc-800">
              <div
                style={{ width: `${positivePercentage}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Positive: ${positivePercentage}%`}
              />
              <div
                style={{ width: `${neutralPercentage}%` }}
                className="bg-amber-500 dark:bg-amber-400 transition-all duration-500"
                title={`Neutral: ${neutralPercentage}%`}
              />
              <div
                style={{ width: `${negativePercentage}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Negative: ${negativePercentage}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
