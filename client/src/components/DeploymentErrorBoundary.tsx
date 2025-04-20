import React, { ErrorInfo, ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  diagnostics: Record<string, any>;
}

class DeploymentErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      diagnostics: {}
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture additional diagnostic information for deployment troubleshooting
    const diagnostics = {
      location: window.location.toString(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      windowKeys: Object.keys(window),
      documentReady: document.readyState,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack
    };

    // Log the error for analytics and debugging
    console.error("Deployment Error Boundary caught an error:", error, errorInfo);
    console.info("Deployment diagnostics:", diagnostics);

    this.setState({
      errorInfo,
      diagnostics
    });

    // Send error to analytics service if available
    try {
      if (typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify({
          type: 'deployment_error',
          error: error.toString(),
          diagnostics
        })], { type: 'application/json' });
        navigator.sendBeacon('/api/log-error', blob);
      }
    } catch (e) {
      console.warn('Error sending diagnostic data:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen bg-gray-100 flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
            <p className="mb-4">We're experiencing an issue with loading the application. Our team has been notified.</p>
            
            <div className="mb-4 space-y-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Reload Application
              </button>
              
              <button
                onClick={() => {
                  // Clear all storage and reload
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                    document.cookie.split(';').forEach(c => {
                      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
                    });
                    window.location.reload();
                  } catch (e) {
                    console.error('Error clearing storage:', e);
                  }
                }}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Clear Cache & Reload
              </button>
              
              <a 
                href="/diagnostic.html"
                className="block text-center w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
              >
                Run Diagnostics
              </a>
            </div>
            
            <details className="bg-gray-100 p-2 rounded text-sm">
              <summary className="cursor-pointer font-medium">Technical Details (for support)</summary>
              <div className="mt-2 overflow-auto max-h-48 text-xs font-mono whitespace-pre-wrap">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
                <pre>
                  {JSON.stringify(this.state.diagnostics, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const DeploymentMonitor: React.FC<Props> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    // Monitor page load performance
    if (window.performance) {
      const perfData = window.performance.timing;
      const loadTimeData = {
        total: perfData.loadEventEnd - perfData.navigationStart,
        network: perfData.responseEnd - perfData.requestStart,
        domProcessing: perfData.domComplete - perfData.domLoading,
        rendering: perfData.loadEventEnd - perfData.domComplete
      };
      setLoadTimes(loadTimeData);
      console.info('Page load performance:', loadTimeData);
    }

    // Monitor network connection status
    const handleOnline = () => {
      console.log('Connection restored');
      setIsConnected(true);
    };
    
    const handleOffline = () => {
      console.log('Connection lost');
      setIsConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Log deployment environment info
    console.info('Application deployment information:', {
      environment: import.meta.env.MODE,
      baseUrl: import.meta.env.BASE_URL,
      version: import.meta.env.VITE_APP_VERSION || 'unknown',
      buildTime: import.meta.env.VITE_BUILD_TIME || 'unknown'
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg">
        <p className="font-bold">Network Connection Lost</p>
        <p>Please check your internet connection and try again.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Combined component with both error boundary and performance monitoring
export const DeploymentWrapper: React.FC<Props> = ({ children }) => (
  <DeploymentErrorBoundary>
    <DeploymentMonitor>{children}</DeploymentMonitor>
  </DeploymentErrorBoundary>
);

export default DeploymentErrorBoundary;