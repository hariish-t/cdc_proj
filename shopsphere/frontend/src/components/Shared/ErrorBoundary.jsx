import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-dark-900 dark:to-dark-800">
          <div className="glass-card max-w-2xl w-full p-8 text-center">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-left">
                <p className="font-semibold text-red-800 dark:text-red-400 mb-2">
                  Error Details:
                </p>
                <code className="text-sm text-red-700 dark:text-red-300 block overflow-auto">
                  {this.state.error.toString()}
                </code>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-400">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-dark-600 transition-all"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              If this problem persists, please contact support or refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
