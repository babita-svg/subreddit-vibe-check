import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, ShieldAlert, Cpu, Sparkles, Scale } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="methodology-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="methodology-modal-title"
    >
      <div
        id="methodology-modal-card"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="methodology-modal-title" className="text-lg sm:text-xl font-bold">
                Methodology & System Architecture
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Transparent documentation on data ingestion, sentiment scoring, and limitations.
              </p>
            </div>
          </div>

          <button
            id="close-methodology-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Data Ingestion */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-500 dark:text-indigo-400">
            <Layers className="h-4 w-4" />
            <span>1. Data Source & Endpoint Specification</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The application queries Reddit's public endpoint:
          </p>
          <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 font-mono text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 break-all">
            https://www.reddit.com/r/&#123;subreddit&#125;/hot.json?limit=50
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Input subreddit strings (e.g. <code className="font-mono font-semibold">r/technology</code> or <code className="font-mono font-semibold">technology</code>) are normalized to strip prefixes and query parameters. Exactly the first 50 hot posts returned by Reddit are extracted without any mock or fabricated data.
          </p>
        </div>

        {/* Section 2: Client-Side Sentiment Engine */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-500 dark:text-emerald-400">
            <Cpu className="h-4 w-4" />
            <span>2. Client-Side Sentiment Analysis (AFINN-165)</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Sentiment evaluation runs strictly in the browser using the <code className="font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">sentiment</code> npm package based on the AFINN-165 wordlist (Finn Årup Nielsen). Titles are tokenized and scored word-by-word with integer valence weights from -5 to +5.
          </p>
        </div>

        {/* Section 3: Classification Rules */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-500 dark:text-indigo-400">
            <Scale className="h-4 w-4" />
            <span>3. Mathematical Classification & Vibe Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Post Level */}
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="font-bold text-zinc-900 dark:text-zinc-100">Individual Post Classification</div>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>score &gt; 0 &rarr; Positive</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                  <span>score === 0 &rarr; Neutral</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span>score &lt; 0 &rarr; Negative</span>
                </li>
              </ul>
            </div>

            {/* Subreddit Level */}
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="font-bold text-zinc-900 dark:text-zinc-100">Overall Community Vibe</div>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>avg score &gt; +0.5 &rarr; Positive</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span>avg score &lt; -0.5 &rarr; Negative</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                  <span>otherwise &rarr; Neutral</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Transparency & Limitations */}
        <div className="space-y-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-400">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Methodology Transparency & Known Limitations</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            This tool uses a deterministic <strong>lexicon-based model (AFINN-165)</strong>, not a generative Large Language Model. While it guarantees zero external server latency, total privacy, and reproducible math:
          </p>
          <ul className="list-disc list-inside text-xs text-amber-200/80 space-y-1 pt-1">
            <li>It evaluates post titles only, not whole comment threads.</li>
            <li>Subtle sarcasm, irony, gaming slang, or context-specific phrases may register as neutral or inverted.</li>
            <li>Headlines quoting negative events neutrally might score negatively due to tragedy/crash keywords.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            id="close-modal-footer-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
