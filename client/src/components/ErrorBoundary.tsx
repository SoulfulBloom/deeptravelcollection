import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-6">
              We apologize for the inconvenience. The application encountered an error.
            </p>
            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded text-left overflow-auto text-sm">
                <p className="font-semibold mb-2">Error details:</p>
                <p className="text-red-700">{this.state.error.toString()}</p>
              </div>
            )}
            <Button 
              onClick={() => window.location.href = '/'}
              className="mr-2"
            >
              Go to Home
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;