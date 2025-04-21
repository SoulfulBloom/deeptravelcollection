/**
 * Web Vitals Monitoring Utility
 * 
 * Stub implementation that doesn't rely on the external web-vitals package
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

// DIRECT STUB IMPLEMENTATIONS - No dynamic import
export function getCLS(onReport: ReportHandler): void {
  // Stub implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] getCLS called (stub implementation)');
  }
}

export function getFID(onReport: ReportHandler): void {
  // Stub implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] getFID called (stub implementation)');
  }
}

export function getFCP(onReport: ReportHandler): void {
  // Stub implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] getFCP called (stub implementation)');
  }
}

export function getLCP(onReport: ReportHandler): void {
  // Stub implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] getLCP called (stub implementation)');
  }
}

export function getTTFB(onReport: ReportHandler): void {
  // Stub implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV] getTTFB called (stub implementation)');
  }
}

// Main function to report web vitals - MODIFIED to use the stub functions directly
export async function reportWebVitals(onPerfEntry?: ReportHandler): Promise<void> {
  if (typeof onPerfEntry !== 'function') {
    onPerfEntry = sendToAnalytics;
  }
  
  if (process.env.NODE_ENV === 'development' && !shouldMonitorInDev()) {
    console.log('[DEV] Web Vitals monitoring disabled in development');
    return;
  }
  
  try {
    // Report all web vitals using our stub implementations
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
    
    console.log('Web vitals monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize web vitals monitoring:', error);
  }
}

export default reportWebVitals;
