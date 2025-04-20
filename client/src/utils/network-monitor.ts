/**
 * Network Performance Monitoring Utility
 * 
 * Environment-optimized version that only runs full monitoring in production
 * or when explicitly enabled in development.
 */
import { shouldMonitorInDev } from './env-aware-monitoring';

// Define types for network metrics
interface RequestMetric {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  size?: number;
  status?: number;
  initiator?: string;
  cached?: boolean;
  resourceType?: string;
}

// Define a global window property
declare global {
  interface Window {
    networkMetrics?: {
      requests: RequestMetric[];
      responseTimeSummary: {
        [key: string]: {
          count: number;
          totalTime: number;
          avgTime: number;
          minTime: number;
          maxTime: number;
        };
      };
      slowRequests?: RequestMetric[];
      waterfall?: any[];
    };
    __NETWORK_MONITORING_INITIALIZED__?: boolean;
  }
}

// Constants
const SLOW_REQUEST_THRESHOLD = 1000; // 1 second

/**
 * Initialize resource timing collection
 */
export function initResourceTiming() {
  if (typeof window === 'undefined' || !window.performance || !window.performance.getEntriesByType) {
    return;
  }
  
  const shouldCollect = process.env.NODE_ENV === 'production' || shouldMonitorInDev();
  
  if (!shouldCollect) {
    console.log('[DEV] Resource timing collection disabled in development');
    return;
  }
  
  console.log('Initializing resource timing collection');
  
  // Collect current resource timing entries
  collectResourceTiming();
  
  // Set up observer for future entries
  if (window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        processResourceEntries(entries);
      });
      
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.error('Failed to initialize PerformanceObserver:', e);
    }
  }
}

/**
 * Collect existing resource timing entries
 */
function collectResourceTiming() {
  if (!window.performance || !window.performance.getEntriesByType) return;
  
  const resources = window.performance.getEntriesByType('resource');
  processResourceEntries(resources);
}

/**
 * Process resource timing entries
 */
function processResourceEntries(entries: PerformanceEntry[]) {
  if (typeof window === 'undefined' || !window.networkMetrics) return;
  
  for (const entry of entries) {
    if (entry.entryType !== 'resource') continue;
    
    const resourceEntry = entry as PerformanceResourceTiming;
    const resourceType = getResourceType(resourceEntry);
    
    // Calculate times
    const startTime = resourceEntry.startTime;
    const duration = resourceEntry.duration;
    const endTime = startTime + duration;
    
    // Create metric object
    const metric: RequestMetric = {
      url: resourceEntry.name,
      startTime,
      endTime,
      duration,
      size: resourceEntry.transferSize || 0,
      resourceType,
      cached: resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize > 0,
      initiator: resourceEntry.initiatorType,
      method: 'GET', // Default to GET as resource timing doesn't provide method
    };
    
    // Track slow requests
    if (duration > SLOW_REQUEST_THRESHOLD) {
      window.networkMetrics.slowRequests = window.networkMetrics.slowRequests || [];
      window.networkMetrics.slowRequests.push(metric);
    }
    
    // Update response time summary for APIs
    if (resourceEntry.name.includes('/api/')) {
      // Extract API endpoint
      const apiPath = new URL(resourceEntry.name).pathname;
      
      window.networkMetrics.responseTimeSummary = window.networkMetrics.responseTimeSummary || {};
      
      if (!window.networkMetrics.responseTimeSummary[apiPath]) {
        window.networkMetrics.responseTimeSummary[apiPath] = {
          count: 0,
          totalTime: 0,
          avgTime: 0,
          minTime: Infinity,
          maxTime: 0
        };
      }
      
      const summary = window.networkMetrics.responseTimeSummary[apiPath];
      summary.count++;
      summary.totalTime += duration;
      summary.avgTime = summary.totalTime / summary.count;
      summary.minTime = Math.min(summary.minTime, duration);
      summary.maxTime = Math.max(summary.maxTime, duration);
    }
  }
}

/**
 * Get resource type from a resource timing entry
 */
function getResourceType(entry: PerformanceResourceTiming): string {
  const { name, initiatorType } = entry;
  
  if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') {
    return 'xhr';
  }
  
  const extension = name.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
  
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(extension || '')) {
    return 'image';
  }
  
  if (['css'].includes(extension || '')) {
    return 'stylesheet';
  }
  
  if (['js'].includes(extension || '')) {
    return 'script';
  }
  
  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension || '')) {
    return 'font';
  }
  
  if (['json'].includes(extension || '')) {
    return 'json';
  }
  
  return initiatorType || 'other';
}

/**
 * Create a fetch wrapper that tracks performance metrics
 */
export function createInstrumentedFetch() {
  if (typeof window === 'undefined') return window.fetch;
  
  const shouldInstrument = process.env.NODE_ENV === 'production' || shouldMonitorInDev();
  
  if (!shouldInstrument) {
    console.log('[DEV] Fetch instrumentation disabled in development');
    return window.fetch;
  }
  
  console.log('Creating instrumented fetch');
  
  const originalFetch = window.fetch;
  
  window.fetch = function instrumentedFetch(resource, options = {}) {
    const startTime = performance.now();
    const method = options.method || 'GET';
    const url = resource.toString();
    
    return originalFetch.apply(this, arguments)
      .then(response => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (typeof window === 'undefined' || !window.networkMetrics) return response;
        
        // Record metrics
        const metric = {
          url,
          method,
          startTime,
          endTime,
          duration,
          status: response.status,
        };
        
        window.networkMetrics.requests.push(metric);
        
        // Track slow requests
        if (duration > SLOW_REQUEST_THRESHOLD) {
          window.networkMetrics.slowRequests = window.networkMetrics.slowRequests || [];
          window.networkMetrics.slowRequests.push(metric);
        }
        
        // Update response time summary for APIs
        if (url.includes('/api/')) {
          // Extract API endpoint
          const apiPath = new URL(url, window.location.origin).pathname;
          
          window.networkMetrics.responseTimeSummary = window.networkMetrics.responseTimeSummary || {};
          
          if (!window.networkMetrics.responseTimeSummary[apiPath]) {
            window.networkMetrics.responseTimeSummary[apiPath] = {
              count: 0,
              totalTime: 0,
              avgTime: 0,
              minTime: Infinity,
              maxTime: 0
            };
          }
          
          const summary = window.networkMetrics.responseTimeSummary[apiPath];
          summary.count++;
          summary.totalTime += duration;
          summary.avgTime = summary.totalTime / summary.count;
          summary.minTime = Math.min(summary.minTime, duration);
          summary.maxTime = Math.max(summary.maxTime, duration);
        }
        
        // Report very slow requests to console
        if (duration > 3000) {
          console.warn(`Slow request: ${method} ${url} took ${duration.toFixed(0)}ms`);
        }
        
        return response;
      })
      .catch(error => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (window.networkMetrics) {
          window.networkMetrics.requests.push({
            url,
            method,
            startTime,
            endTime,
            duration,
            error: error.message,
          });
        }
        
        throw error;
      });
  };
  
  return window.fetch;
}

/**
 * Initialize all network monitoring
 */
export function initNetworkMonitoring() {
  if (typeof window !== 'undefined' && !window.__NETWORK_MONITORING_INITIALIZED__) {
    const shouldMonitor = process.env.NODE_ENV === 'production' || shouldMonitorInDev();
    
    if (!shouldMonitor) {
      console.log('[DEV] Network monitoring disabled in development');
      return;
    }
    
    console.log('Initializing network performance monitoring');
    
    // Initialize metrics object
    window.networkMetrics = {
      requests: [],
      responseTimeSummary: {},
      slowRequests: [],
      waterfall: []
    };
    
    window.__NETWORK_MONITORING_INITIALIZED__ = true;
    
    // Initialize resource timing collection
    initResourceTiming();
    
    // Instrument fetch
    createInstrumentedFetch();
  }
}

export default initNetworkMonitoring;
