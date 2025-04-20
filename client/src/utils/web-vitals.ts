/**
 * Web Vitals Monitoring Utility
 * 
 * Environment-optimized version that only runs full monitoring in production
 * or when explicitly enabled in development.
 */
import { shouldMonitorInDev } from './env-aware-monitoring';

// Define a type for the measurement reporting function
export type ReportHandler = (metric: {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType?: string;
}) => void;

// Function to send metrics to an analytics endpoint
const sendToAnalytics = (metric: any): void => {
  // Save to window for debugging
  if (typeof window !== 'undefined') {
    window.webVitals = window.webVitals || {};
    window.webVitals[metric.name] = metric.value;
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric.name, metric.value);
    return; // Don't send to server in development unless enabled
  }
  
  // Only send to server in production or if explicitly enabled in development
  if (process.env.NODE_ENV !== 'production' && !shouldMonitorInDev()) {
    return;
  }
  
  // Send to server endpoint for storage
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      navigationType: metric.navigationType || 'navigate',
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });
    
    // Use Navigator.sendBeacon() if available, falling back to fetch()
    const url = '/api/performance/web-vitals';
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        body,
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        console.error('Error sending web vitals:', error);
      });
    }
  } catch (error) {
    console.error('Error sending web vitals:', error);
  }
};

// Define global window property for storing web vitals metrics
declare global {
  interface Window {
    webVitals?: {
      [key: string]: number;
    };
  }
}

// This is a placeholder that will be replaced by the actual web-vitals npm package in production
// For development, we'll use a lightweight version that doesn't impact performance
function getWebVitalsModule() {
  // In production, dynamically import the web-vitals library
  if (process.env.NODE_ENV === 'production' || shouldMonitorInDev()) {
    return import('web-vitals').then(vitals => ({
      getCLS: vitals.getCLS,
      getFID: vitals.getFID,
      getFCP: vitals.getFCP,
      getLCP: vitals.getLCP,
      getTTFB: vitals.getTTFB
    }));
  }
  
  // In development, use mock implementations to avoid impacting performance
  return Promise.resolve({
    getCLS: (cb: ReportHandler) => {
      console.log('[DEV] Web Vitals monitoring disabled in development');
      // No-op
    },
    getFID: (cb: ReportHandler) => {
      // No-op
    },
    getFCP: (cb: ReportHandler) => {
      // No-op
    },
    getLCP: (cb: ReportHandler) => {
      // No-op
    },
    getTTFB: (cb: ReportHandler) => {
      // No-op
    }
  });
}

// Main function to report web vitals
export async function reportWebVitals(onPerfEntry?: ReportHandler): Promise<void> {
  if (typeof onPerfEntry !== 'function') {
    onPerfEntry = sendToAnalytics;
  }
  
  if (process.env.NODE_ENV === 'development' && !shouldMonitorInDev()) {
    console.log('[DEV] Web Vitals monitoring disabled in development');
    return;
  }
  
  try {
    const vitals = await getWebVitalsModule();
    
    // Report all web vitals
    vitals.getCLS(onPerfEntry);
    vitals.getFID(onPerfEntry);
    vitals.getFCP(onPerfEntry);
    vitals.getLCP(onPerfEntry);
    vitals.getTTFB(onPerfEntry);
    
    console.log('Web vitals monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize web vitals monitoring:', error);
  }
}

export default reportWebVitals;
