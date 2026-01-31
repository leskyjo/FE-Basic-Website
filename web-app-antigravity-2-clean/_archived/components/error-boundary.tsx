"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (only in dev)
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong</h2>
            <p className="mb-6 text-slate-400">The page encountered an error. This sometimes happens in development mode.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
