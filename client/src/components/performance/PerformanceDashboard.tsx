import React, { useState, useEffect } from 'react';
import MonitoringToggle from './debug/MonitoringToggle';

// Define types for our metrics
interface BundleMetrics {
  totalSize: number;
  formattedTotalSize: string;
  chunks: {
    name: string;
    size: number;
    formattedSize: string;
  }[];
}

interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  timestamp: string;
  url: string;
}

interface MetricsAverages {
  [key: string]: number;
}

interface WebVitalsMetrics {
  metrics: WebVitalsMetric[];
  averages: MetricsAverages;
  passRates: {
    [key: string]: number;
  };
}

const PerformanceDashboard: React.FC = () => {
  const [bundleMetrics, setBundleMetrics] = useState<BundleMetrics | null>(null);
  const [webVitalsMetrics, setWebVitalsMetrics] = useState<WebVitalsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Performance budgets
  const PERFORMANCE_BUDGETS = {
    LCP: 2500,   // Largest Contentful Paint: 2.5s
    FID: 100,    // First Input Delay: 100ms
    CLS: 0.1,    // Cumulative Layout Shift: 0.1
    FCP: 1800,   // First Contentful Paint: 1.8s
    TTI: 3800,   // Time to Interactive: 3.8s
    TTFB: 800,   // Time to First Byte: 800ms
    BUNDLE_SIZE: 1000000  // Bundle size: 1MB
  };

  useEffect(() => {
    // Fetch metrics from API
    async function fetchMetrics() {
      setIsLoading(true);
      try {
        // Fetch web vitals metrics
        const webVitalsResponse = await fetch('/api/performance/metrics');
        if (webVitalsResponse.ok) {
          const webVitalsData = await webVitalsResponse.json();
          setWebVitalsMetrics(webVitalsData);
        }

        // Fetch bundle metrics if available
        try {
          const bundleResponse = await fetch('/api/performance/bundle');
          if (bundleResponse.ok) {
            const bundleData = await bundleResponse.json();
            setBundleMetrics(bundleData);
          } else {
            // Use mock data for development
            if (process.env.NODE_ENV === 'development') {
              const mockBundleMetrics: BundleMetrics = {
                totalSize: 1240000,
                formattedTotalSize: '1.24 MB',
                chunks: [
                  { name: 'vendor.js', size: 820000, formattedSize: '820 KB' },
                  { name: 'main.js', size: 320000, formattedSize: '320 KB' },
                  { name: 'pages.js', size: 100000, formattedSize: '100 KB' },
                ]
              };
              setBundleMetrics(mockBundleMetrics);
            }
          }
        } catch (error) {
          console.error('Error fetching bundle metrics:', error);
        }
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();

    // Poll for updated metrics (less frequently in development)
    const interval = process.env.NODE_ENV === 'production' ? 30000 : 60000;
    const intervalId = setInterval(fetchMetrics, interval);
    return () => clearInterval(intervalId);
  }, []);

  // Format bytes to a human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };

  // Get status class based on metric value
  const getStatusClass = (metric: string, value: number | undefined) => {
    if (value === undefined) return '';
    
    const budget = PERFORMANCE_BUDGETS[metric as keyof typeof PERFORMANCE_BUDGETS];
    if (!budget) return '';
    
    // CLS is better when lower
    if (metric === 'CLS') {
      if (value <= budget) return 'text-green-600';
      if (value <= 0.25) return 'text-amber-500';
      return 'text-red-600';
    }
    
    // Other metrics (all are time-based)
    if (value <= budget) return 'text-green-600';
    if (value <= budget * 1.5) return 'text-amber-500';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 w-full max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Dashboard</h2>
        {process.env.NODE_ENV === 'development' && <MonitoringToggle />}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Dashboard</h2>
      
      {/* Development Controls */}
      {process.env.NODE_ENV === 'development' && <MonitoringToggle />}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('webVitals')}
            className={`${
              activeTab === 'webVitals'
                ? 'border-blue-500 text-blue-600 dark:text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Web Vitals
          </button>
          <button
            onClick={() => setActiveTab('bundle')}
            className={`${
              activeTab === 'bundle'
                ? 'border-blue-500 text-blue-600 dark:text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Bundle Analysis
          </button>
        </nav>
      </div>
      
      {/* Main content based on active tab */}
      <div className="mt-4">
        {/* Placeholder for tab content */}
        {activeTab === 'overview' && (
          <div className="text-center py-12 text-gray-500">
            Overview content will be displayed here
          </div>
        )}
        
        {activeTab === 'webVitals' && (
          <div className="text-center py-12 text-gray-500">
            Web Vitals metrics will be displayed here
          </div>
        )}
        
        {activeTab === 'bundle' && (
          <div className="text-center py-12 text-gray-500">
            Bundle analysis will be displayed here
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
