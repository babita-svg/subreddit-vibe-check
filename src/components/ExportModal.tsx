import React, { useState } from 'react';
import { X, Download, Copy, Check, FileJson, FileSpreadsheet } from 'lucide-react';
import { AnalysisResult } from '../types/reddit';
import { formatSentimentScore } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, analysis }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysis) return null;

  const { subreddit, summary, posts } = analysis;

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `subreddit_vibe_${subreddit}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCSV = () => {
    const headers = ['Rank', 'Title', 'Sentiment Label', 'Sentiment Score', 'Reddit Score', 'Comments', 'Author', 'Created At', 'URL'];
    const rows = posts.map((p) => [
      p.rank,
      `"${p.title.replace(/"/g, '""')}"`,
      p.sentiment.label,
      p.sentiment.score,
      p.score,
      p.comments,
      p.author,
      new Date(p.createdAt).toISOString(),
      p.url,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subreddit_vibe_${subreddit}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopySummary = async () => {
    const textSummary = `
📊 The Subreddit Vibe Check: r/${subreddit}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Overall Vibe: ${summary.overallVibe} (Average Score: ${formatSentimentScore(summary.averageScore)})
• Posts Analyzed: ${summary.totalPosts} hot posts
• Positive: ${summary.positivePosts} (${summary.positivePercentage}%)
• Neutral: ${summary.neutralPosts} (${summary.neutralPercentage}%)
• Negative: ${summary.negativePosts} (${summary.negativePercentage}%)
• Highest Score: +${summary.highestSentimentScore} | Lowest: ${summary.lowestSentimentScore}
• Summary: ${summary.overallVibeSummary}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via The Subreddit Vibe Check
    `.trim();

    try {
      await navigator.clipboard.writeText(textSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="export-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="export-modal-card"
        className="relative w-full max-w-md rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-lg">Export Vibe Data (r/{subreddit})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3 text-sm">
          {/* JSON */}
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-between p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileJson className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Download JSON</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Complete raw schema & statistics</div>
              </div>
            </div>
            <Download className="h-4 w-4 text-zinc-400" />
          </button>

          {/* CSV */}
          <button
            onClick={handleDownloadCSV}
            className="w-full flex items-center justify-between p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Download CSV</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Formatted for Excel & Google Sheets</div>
              </div>
            </div>
            <Download className="h-4 w-4 text-zinc-400" />
          </button>

          {/* Copy Markdown/Text Summary */}
          <button
            onClick={handleCopySummary}
            className="w-full flex items-center justify-between p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
              </div>
              <div className="text-left">
                <div className="font-bold">{copied ? 'Copied to Clipboard!' : 'Copy Summary Report'}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Quick shareable formatted text</div>
              </div>
            </div>
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
