import React from 'react';
import { RedditPost } from '../types/reddit';
import {
  ExternalLink,
  ArrowBigUp,
  MessageSquare,
  User,
  Clock,
  ThumbsUp,
  Minus,
  ThumbsDown,
  AlertOctagon,
  Pin,
} from 'lucide-react';
import { formatCompactNumber, formatRelativeTime, formatSentimentScore } from '../utils/formatters';

interface PostCardProps {
  post: RedditPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    id,
    rank,
    title,
    author,
    score,
    comments,
    permalink,
    createdAt,
    thumbnail,
    isNsfw,
    isSpoiler,
    isPinned,
    sentiment,
  } = post;

  const sentimentStyle = {
    Positive: {
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      icon: ThumbsUp,
      scoreColor: 'text-emerald-400',
    },
    Negative: {
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      icon: ThumbsDown,
      scoreColor: 'text-rose-400',
    },
    Neutral: {
      badge: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
      icon: Minus,
      scoreColor: 'text-zinc-400',
    },
  }[sentiment.label];

  const SentimentIcon = sentimentStyle.icon;

  return (
    <article
      id={`post-card-${id}`}
      className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all group flex flex-col justify-between gap-3"
    >
      <div className="space-y-2.5">
        {/* Top Meta Line: Rank, Badges, Sentiment */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Rank badge */}
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              #{rank < 10 ? `0${rank}` : rank}
            </span>

            {/* Pinned Tag */}
            {isPinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Pin className="h-2.5 w-2.5" /> Pinned
              </span>
            )}

            {/* NSFW Tag */}
            {isNsfw && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertOctagon className="h-2.5 w-2.5" /> NSFW
              </span>
            )}

            {/* Spoiler Tag */}
            {isSpoiler && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Spoiler
              </span>
            )}
          </div>

          {/* Sentiment Badge & Score */}
          <div className="flex items-center gap-1.5">
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sentimentStyle.badge}`}
            >
              <SentimentIcon className="h-3 w-3" />
              <span>{sentiment.label}</span>
              <span className="font-mono font-bold ml-0.5">
                ({formatSentimentScore(sentiment.score, 0)})
              </span>
            </div>
          </div>
        </div>

        {/* Post Title & Thumbnail */}
        <div className="flex items-start gap-3">
          {thumbnail && (
            <img
              src={thumbnail}
              alt=""
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800 flex-shrink-0"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}

          <div className="min-w-0 flex-1">
            <a
              id={`post-link-${id}`}
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-3 leading-snug group-hover:underline inline"
            >
              {title}
            </a>
          </div>
        </div>

        {/* Detected Sentiment Token Words */}
        {(sentiment.positiveWords.length > 0 || sentiment.negativeWords.length > 0) && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] font-semibold uppercase text-zinc-400 dark:text-zinc-500">
              Keywords:
            </span>
            {sentiment.positiveWords.map((w, idx) => (
              <span
                key={`pos-${idx}`}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                +{w}
              </span>
            ))}
            {sentiment.negativeWords.map((w, idx) => (
              <span
                key={`neg-${idx}`}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20"
              >
                -{w}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Metadata Bar: Score, Comments, Author, Time, Reddit Link */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Upvotes */}
          <span
            className="flex items-center gap-0.5 font-semibold text-zinc-700 dark:text-zinc-300"
            title={`${score.toLocaleString()} upvotes`}
          >
            <ArrowBigUp className="h-4 w-4 text-orange-500 fill-orange-500/20" />
            <span>{formatCompactNumber(score)}</span>
          </span>

          {/* Comments */}
          <span
            className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400"
            title={`${comments.toLocaleString()} comments`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
            <span>{formatCompactNumber(comments)}</span>
          </span>

          {/* Author */}
          <span className="hidden sm:inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">{author}</span>
          </span>

          {/* Time */}
          <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatRelativeTime(createdAt)}</span>
          </span>
        </div>

        {/* Direct Reddit Action Link */}
        <a
          id={`view-reddit-btn-${id}`}
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400 hover:underline p-1 rounded transition-colors"
          aria-label={`Open post on Reddit: ${title}`}
        >
          <span>Reddit</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
};
