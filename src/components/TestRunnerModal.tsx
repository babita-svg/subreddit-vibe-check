import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Play, RefreshCw, ShieldCheck } from 'lucide-react';
import { runSentimentTests } from '../utils/sentiment.test';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [testOutput, setTestOutput] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }>;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runSentimentTests();
      setTestOutput(results);
      setIsRunning(false);
    }, 250);
  };

  useEffect(() => {
    if (isOpen) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="test-runner-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="test-runner-modal-card"
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Unit Test Suite Verification</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Testing normalization, sentiment rules, thresholds, and stats calculations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Banner */}
        {testOutput && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              testOutput.failed === 0
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {testOutput.failed === 0 ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {testOutput.failed === 0 ? 'All Unit Tests Passed!' : `${testOutput.failed} Tests Failed`}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {testOutput.passed} / {testOutput.total} assertions verified green
                </div>
              </div>
            </div>

            <button
              onClick={executeTests}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold shadow-sm border border-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Re-run</span>
            </button>
          </div>
        )}

        {/* Test Cases List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {testOutput?.results.map((res, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <span className="font-medium text-zinc-800 dark:text-zinc-200 block truncate">
                  {res.name}
                </span>
                {res.error && (
                  <span className="text-[11px] text-rose-400 font-mono block break-words">
                    {res.error}
                  </span>
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 ${
                  res.status === 'PASS'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {res.status}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs cursor-pointer hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
