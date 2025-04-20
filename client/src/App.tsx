import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Switch } from 'wouter';
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
import { initNetworkMonitoring } from './utils/network-monitor';
import { initRuntimeMonitoring } from './utils/runtime-monitor';
import { reportWebVitals } from './utils/web-vitals';
import { shouldMonitorInDev } from './utils/env-aware-monitoring';

// Placeholder for a homepage component
const HomePage: React.FC = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold mb-6">Deep Travel Collections</h1>
    <p className="mb-4">
      Welcome to the Deep Travel Collections platform. This is the main dashboard for our travel planning application.
    </p>
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">Performance Monitoring</h2>
      <p className="mb-3">
        We've implemented comprehensive performance monitoring for this application. Visit the performance dashboard to view metrics.
      </p>
      <a 
        href="/performance" 
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        View Performance Dashboard
      </a>
    </div>
  </div>
);

function App() {
  // Initialize performance monitoring conditionally
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldMonitor = isProduction || shouldMonitorInDev();
    
    if (shouldMonitor) {
      console.log(`Initializing performance monitoring in ${process.env.NODE_ENV} mode`);
      
      // Report web vitals
      reportWebVitals();
      
      // Initialize network monitoring
      initNetworkMonitoring();
      
      // Initialize runtime monitoring
      const cleanup = initRuntimeMonitoring();
      
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    } else {
      console.log('Performance monitoring disabled in development. Enable it from the Performance Dashboard.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Deep Travel Collections
            </a>
            <div className="space-x-4">
              <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Home
              </a>
              <a href="/performance" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Performance
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Switch>
          <Suspense fallback={<div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>}>
            <Route path="/" component={HomePage} />
            <Route path="/performance" component={PerformancePage} />
            <Route>
              {/* 404 - Not Found */}
              <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="mb-8">The page you are looking for does not exist.</p>
                <a href="/" className="text-blue-600 hover:underline">Go back to homepage</a>
              </div>
            </Route>
          </Suspense>
        </Switch>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Deep Travel Collections. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
