import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ [ErrorBoundary] Caught error:', error);
    console.error('❌ [ErrorBoundary] Error info:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Only show detailed error info in development mode
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-8">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Wystąpił błąd
            </h1>
            <p className="text-foreground mb-4">
              Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
            </p>
            {isDev && (
              <>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Komunikat błędu (tylko dev):</p>
                  <pre className="bg-secondary p-4 rounded text-sm overflow-auto">
                    {this.state.error?.toString()}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Stack trace:</p>
                    <pre className="bg-secondary p-4 rounded text-xs overflow-auto max-h-64">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
