import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Vibe Check Dashboard:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertOctagon className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">Something went wrong.</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              An unexpected interface error occurred. You can reset and reload the dashboard.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

