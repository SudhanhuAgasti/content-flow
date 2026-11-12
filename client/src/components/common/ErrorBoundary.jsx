import React, { Component } from 'react';
import { Button } from './Button.jsx';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Enterprise React Error Boundary
 * Catches runtime JavaScript errors anywhere in the child component tree,
 * logs the error telemetry, and displays a graceful fallback UI.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ContentFlow Client Runtime Error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian-950 text-white flex items-center justify-center p-6 selection:bg-emperor-500 selection:text-obsidian-950">
          <div className="max-w-md w-full p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 shadow-surface-card text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-white">
                Application Interruption
              </h2>
              <p className="text-xs text-obsidian-400 leading-relaxed">
                An unexpected interface error occurred. The application state has been preserved.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 text-left font-mono text-[11px] text-rose-300 break-words">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Home}
                onClick={this.handleReset}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

