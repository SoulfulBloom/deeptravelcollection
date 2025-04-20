/**
 * Network Performance Monitoring for Deep Travel Collections
 * 
 * This script sets up network monitoring to track API response times,
 * waterfall charts, and identify blocking resources.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const reportsDir = path.join(rootDir, 'performance-reports');
const networkDir = path.join(reportsDir, 'network');
const clientDir = path.join(rootDir, 'client');
const clientSrcDir = path.join(clientDir, 'src');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

if (!fs.existsSync(networkDir)) {
  fs.mkdirSync(networkDir, { recursive: true });
}

console.log('===============================');
console.log('| NETWORK PERFORMANCE MONITOR |');
console.log('===============================');
console.log(`Started: ${new Date().toISOString()}`);

// Function to set up network monitoring
async function setupNetworkMonitoring() {
  console.log('\n🔧 Setting up network performance monitoring...');
  
  // Create utility for network performance monitoring
  const networkUtilPath = path.join(clientSrcDir, 'utils', 'network-monitor.ts');
  const networkUtilDir = path.dirname(networkUtilPath);
  
  if (!fs.existsSync(networkUtilDir)) {
    fs.mkdirSync(networkUtilDir, { recursive: true });
  }
  
  if (!fs.existsSync(networkUtilPath)) {
    const networkUtilContent = `/**
 * Network Performance Monitoring Utility
 * 
 * This utility provides tools to monitor network performance for:
 * - API response times
 * - Resource loading metrics
 * - Identifying slow requests
 */

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

interface WaterfallEntry {
  url: string;
  startTime: number;
  duration: number;
  type: string;
  size?: number;
  status?: number;
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
      performTiming?: any;
      resourceTiming?: any[];
      slowRequests?: RequestMetric[];
      waterfall?: WaterfallEntry[];
    };
  }
}

// Initialize metrics object on window
if (typeof window !== 'undefined') {
  window.networkMetrics = {
    requests: [],
    responseTimeSummary: {},
    slowRequests: [],
    waterfall: []
  };
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
      console.log('Resource timing observer initialized');
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
function processResourceEntries(entries) {
  if (!window.networkMetrics) return;
  
  for (const entry of entries) {
    if (entry.entryType !== 'resource') continue;
    
    const resourceType = getResourceType(entry);
    
    // Calculate times
    const startTime = entry.startTime;
    const duration = entry.duration;
    const endTime = startTime + duration;
    
    // Create metric object
    const metric = {
      url: entry.name,
      startTime,
      endTime,
      duration,
      size: entry.transferSize || 0,
      resourceType,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
      initiator: entry.initiatorType,
    };
    
    // Add to waterfall
    window.networkMetrics.waterfall = window.networkMetrics.waterfall || [];
    window.networkMetrics.waterfall.push({
      url: entry.name,
      startTime,
      duration,
      type: resourceType,
      size: entry.transferSize,
    });
    
    // Track slow requests
    if (duration > SLOW_REQUEST_THRESHOLD) {
      window.networkMetrics.slowRequests = window.networkMetrics.slowRequests || [];
      window.networkMetrics.slowRequests.push(metric);
    }
    
    // Update response time summary for APIs
    if (entry.name.includes('/api/')) {
      // Extract API endpoint
      const apiPath = new URL(entry.name).pathname;
      
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
function getResourceType(entry) {
  const { name, initiatorType } = entry;
  
  if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') {
    return 'xhr';
  }
  
  const extension = name.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
  
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(extension)) {
    return 'image';
  }
  
  if (['css'].includes(extension)) {
    return 'stylesheet';
  }
  
  if (['js'].includes(extension)) {
    return 'script';
  }
  
  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) {
    return 'font';
  }
  
  if (['json'].includes(extension)) {
    return 'json';
  }
  
  return initiatorType || 'other';
}

/**
 * Create a fetch wrapper that tracks performance metrics
 */
export function createInstrumentedFetch() {
  if (typeof window === 'undefined') return window.fetch;
  
  const originalFetch = window.fetch;
  
  window.fetch = function instrumentedFetch(resource, options = {}) {
    const startTime = performance.now();
    const method = options.method || 'GET';
    const url = resource.toString();
    
    return originalFetch.apply(this, arguments)
      .then(response => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (!window.networkMetrics) return response;
        
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
        
        // Report very slow requests to console in development
        if (process.env.NODE_ENV === 'development' && duration > 3000) {
          console.warn(\`Slow request: \${method} \${url} took \${duration.toFixed(0)}ms\`);
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
 * Generate a waterfall chart of resource loading
 */
export function generateWaterfallChart() {
  if (
    typeof window === 'undefined' || 
    !window.networkMetrics || 
    !window.networkMetrics.waterfall || 
    window.networkMetrics.waterfall.length === 0
  ) {
    return null;
  }
  
  const waterfall = [...window.networkMetrics.waterfall];
  
  // Sort by start time
  waterfall.sort((a, b) => a.startTime - b.startTime);
  
  // Adjust times to be relative to the first resource
  const firstStartTime = waterfall[0].startTime;
  waterfall.forEach(entry => {
    entry.startTime = entry.startTime - firstStartTime;
  });
  
  // Find the latest endTime to determine the chart width
  const maxEndTime = waterfall.reduce((max, entry) => 
    Math.max(max, entry.startTime + entry.duration), 0);
  
  // Generate HTML for the waterfall chart
  return {
    waterfall,
    maxTime: maxEndTime,
    html: generateWaterfallHtml(waterfall, maxEndTime)
  };
}

/**
 * Generate HTML for the waterfall chart
 */
function generateWaterfallHtml(waterfall, maxTime) {
  const typeColors = {
    'image': '#4f46e5',
    'stylesheet': '#16a34a',
    'script': '#ca8a04',
    'xhr': '#db2777',
    'font': '#9333ea',
    'other': '#64748b'
  };
  
  return \`
    <div class="waterfall-chart" style="font-family: system-ui, sans-serif; width: 100%; max-width: 1000px;">
      <style>
        .waterfall-chart .resource-row {
          display: flex;
          margin-bottom: 2px;
          align-items: center;
          font-size: 12px;
        }
        .waterfall-chart .resource-label {
          width: 30%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-right: 10px;
        }
        .waterfall-chart .resource-bar-container {
          width: 70%;
          height: 20px;
          position: relative;
          background-color: #f1f5f9;
          border-radius: 3px;
        }
        .waterfall-chart .resource-bar {
          height: 100%;
          position: absolute;
          border-radius: 3px;
        }
        .waterfall-chart .time-marker {
          position: absolute;
          top: 0;
          width: 1px;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
        }
        .waterfall-chart .time-label {
          position: absolute;
          top: -15px;
          transform: translateX(-50%);
          font-size: 10px;
          color: #64748b;
        }
        .waterfall-chart .legend {
          display: flex;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .waterfall-chart .legend-item {
          display: flex;
          align-items: center;
          margin-right: 15px;
          margin-bottom: 5px;
        }
        .waterfall-chart .legend-color {
          width: 12px;
          height: 12px;
          margin-right: 5px;
          border-radius: 2px;
        }
      </style>
      
      <h3 style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Resource Loading Waterfall</h3>
      
      <div style="position: relative; margin-top: 20px;">
        <!-- Time markers -->
        \${[0, 250, 500, 1000, 2000, 3000, 5000].filter(time => time <= maxTime).map(time => \`
          <div class="time-marker" style="left: \${time / maxTime * 100}%;">
            <div class="time-label">\${time}ms</div>
          </div>
        \`).join('')}
        
        <!-- Resources -->
        \${waterfall.map(entry => {
          const startPercent = (entry.startTime / maxTime) * 100;
          const widthPercent = (entry.duration / maxTime) * 100;
          const url = entry.url.split('/').pop().split('?')[0];
          const type = entry.type;
          const color = typeColors[type] || typeColors.other;
          
          return \`
            <div class="resource-row">
              <div class="resource-label" title="\${entry.url}">\${url}</div>
              <div class="resource-bar-container">
                <div class="resource-bar" style="left: \${startPercent}%; width: \${widthPercent}%; background-color: \${color};" 
                  title="\${entry.url}\\nStart: \${entry.startTime.toFixed(0)}ms\\nDuration: \${entry.duration.toFixed(0)}ms">
                </div>
              </div>
            </div>
          \`;
        }).join('')}
      </div>
      
      <!-- Legend -->
      <div class="legend">
        \${Object.entries(typeColors).map(([type, color]) => \`
          <div class="legend-item">
            <div class="legend-color" style="background-color: \${color};"></div>
            <div>\${type.charAt(0).toUpperCase() + type.slice(1)}</div>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;
}

/**
 * Get network performance summary
 */
export function getNetworkSummary() {
  if (typeof window === 'undefined' || !window.networkMetrics) {
    return null;
  }
  
  const { requests, responseTimeSummary, slowRequests } = window.networkMetrics;
  
  // Calculate overall stats
  const totalRequests = requests.length;
  const totalTime = requests.reduce((sum, req) => sum + req.duration, 0);
  const avgResponseTime = totalRequests > 0 ? totalTime / totalRequests : 0;
  const slowRequestCount = slowRequests?.length || 0;
  const slowRequestPercentage = totalRequests > 0 ? (slowRequestCount / totalRequests) * 100 : 0;
  
  // Calculate API-specific stats
  const apiStats = Object.entries(responseTimeSummary || {}).map(([path, stats]) => ({
    path,
    count: stats.count,
    avgTime: stats.avgTime,
    minTime: stats.minTime,
    maxTime: stats.maxTime
  })).sort((a, b) => b.avgTime - a.avgTime);
  
  return {
    totalRequests,
    totalTime,
    avgResponseTime,
    slowRequestCount,
    slowRequestPercentage,
    apiStats,
    slowRequests: slowRequests || []
  };
}

/**
 * Detect duplicate requests
 */
export function detectDuplicateRequests() {
  if (typeof window === 'undefined' || !window.networkMetrics || !window.networkMetrics.requests) {
    return [];
  }
  
  const { requests } = window.networkMetrics;
  const urlCount = {};
  
  // Count requests by URL
  for (const request of requests) {
    // Remove query parameters for comparison
    const baseUrl = request.url.split('?')[0];
    urlCount[baseUrl] = (urlCount[baseUrl] || 0) + 1;
  }
  
  // Find URLs with multiple requests
  return Object.entries(urlCount)
    .filter(([_, count]) => count > 1)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate a report of network performance
 */
export function generateNetworkReport() {
  if (typeof window === 'undefined' || !window.networkMetrics) {
    return 'No network metrics available';
  }
  
  const summary = getNetworkSummary();
  const duplicates = detectDuplicateRequests();
  const waterfallData = generateWaterfallChart();
  
  if (!summary) return 'No network data available';
  
  return \`
    <div style="font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 10px;">Network Performance Report</h1>
      <p style="margin-bottom: 20px;">Generated on: \${new Date().toISOString()}</p>
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Summary</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Total Requests</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px;">\${summary.totalRequests}</div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Average Response Time</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px;">\${summary.avgResponseTime.toFixed(0)} ms</div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Slow Requests (>1s)</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px; \${summary.slowRequestCount > 0 ? 'color: #dc2626;' : ''}">\${summary.slowRequestCount}</div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Duplicate Requests</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px; \${duplicates.length > 0 ? 'color: #ca8a04;' : ''}">\${duplicates.length}</div>
        </div>
      </div>
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Resource Loading Waterfall</h2>
      \${waterfallData ? waterfallData.html : '<p>No waterfall data available</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">API Response Times</h2>
      \${summary.apiStats.length > 0 ? \`
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8fafc;">
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Endpoint</th>
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Count</th>
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Avg Time (ms)</th>
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Min Time (ms)</th>
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Max Time (ms)</th>
          </tr>
          \${summary.apiStats.map(api => \`
            <tr>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">\${api.path}</td>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">\${api.count}</td>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; \${api.avgTime > 1000 ? 'color: #dc2626;' : api.avgTime > 500 ? 'color: #ca8a04;' : ''}">\${api.avgTime.toFixed(0)}</td>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">\${api.minTime.toFixed(0)}</td>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">\${api.maxTime.toFixed(0)}</td>
            </tr>
          \`).join('')}
        </table>
      \` : '<p>No API requests recorded</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Slow Requests (>1s)</h2>
      \${summary.slowRequests.length > 0 ? \`
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8fafc;">
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">URL</th>
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Duration (ms)</th>
          </tr>
          \${summary.slowRequests.map(req => \`
            <tr>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">\${req.url}</td>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; \${req.duration > 3000 ? 'color: #dc2626;' : 'color: #ca8a04;'}">\${req.duration.toFixed(0)}</td>
            </tr>
          \`).join('')}
        </table>
      \` : '<p>No slow requests detected</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Duplicate Requests</h2>
      \${duplicates.length > 0 ? \`
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8fafc;">
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">URL</th>
            <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Count</th>
          </tr>
          \${duplicates.map(dup => \`
            <tr>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">\${dup.url}</td>
              <td style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; \${dup.count > 5 ? 'color: #dc2626;' : 'color: #ca8a04;'}">\${dup.count}</td>
            </tr>
          \`).join('')}
        </table>
      \` : '<p>No duplicate requests detected</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Recommendations</h2>
      <ul style="margin-top: 10px; margin-bottom: 20px;">
        \${summary.avgResponseTime > 500 ? '<li>The average response time is high (' + summary.avgResponseTime.toFixed(0) + 'ms). Consider optimizing API endpoints or implementing caching.</li>' : ''}
        \${summary.slowRequestCount > 0 ? '<li>There are ' + summary.slowRequestCount + ' slow requests that take more than 1 second. Investigate and optimize these endpoints.</li>' : ''}
        \${duplicates.length > 0 ? '<li>There are ' + duplicates.length + ' duplicate requests. Consider implementing request deduplication or caching.</li>' : ''}
        \${summary.apiStats.some(api => api.avgTime > 1000) ? '<li>Some API endpoints have very high average response times. Consider optimizing these endpoints.</li>' : ''}
        \${summary.apiStats.length === 0 ? '<li>No API requests were recorded. Make sure the network monitoring is properly integrated.</li>' : ''}
        \${summary.totalRequests === 0 ? '<li>No requests were recorded. Make sure the network monitoring is properly integrated.</li>' : ''}
        \${summary.avgResponseTime <= 500 && summary.slowRequestCount === 0 && duplicates.length === 0 ? '<li>Overall network performance is good. Keep up the good work!</li>' : ''}
      </ul>
    </div>
  \`;
}

// Initialize monitoring on module import
let initialized = false;

export function initNetworkMonitoring() {
  if (typeof window !== 'undefined' && !initialized) {
    console.log('Initializing network performance monitoring...');
    initialized = true;
    
    // Initialize resource timing collection
    initResourceTiming();
    
    // Instrument fetch
    createInstrumentedFetch();
    
    // Setup logging of network metrics
    console.log('Network performance monitoring initialized');
  }
}
`;

    fs.writeFileSync(networkUtilPath, networkUtilContent);
    console.log(`✅ Created network monitoring utility at ${networkUtilPath}`);
  } else {
    console.log(`⚠️ Network monitoring utility already exists at ${networkUtilPath}`);
  }
  
  // Create API endpoint for network performance
  const apiDir = path.join(rootDir, 'server', 'routes');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  const networkRouteFile = path.join(apiDir, 'network-performance.ts');
  if (!fs.existsSync(networkRouteFile)) {
    const networkRouteContent = `import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const reportsDir = path.join(__dirname, '../../performance-reports/network');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

/**
 * Save network performance metrics from client
 */
router.post('/metrics', async (req, res) => {
  try {
    const metrics = req.body;
    
    if (!metrics) {
      return res.status(400).json({ error: 'Invalid metrics data' });
    }
    
    // Add timestamp if not provided
    if (!metrics.timestamp) {
      metrics.timestamp = new Date().toISOString();
    }
    
    // Generate filename based on timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(reportsDir, \`network-metrics-\${timestamp}.json\`);
    
    // Save metrics
    fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));
    
    res.status(200).json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error storing network metrics:', error);
    res.status(500).json({ error: 'Failed to store metrics' });
  }
});

/**
 * Get network performance report
 */
router.get('/report', async (req, res) => {
  try {
    // Generate report HTML
    // In a real implementation, this would analyze saved metrics
    // and generate a comprehensive report.
    // For now, we'll return a simple page that loads client-side
    // metrics and displays them.
    
    const reportHtml = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Network Performance Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f8fafc; }
    .card { background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .card-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
    .text-red { color: #dc2626; }
    .text-yellow { color: #ca8a04; }
    .text-green { color: #16a34a; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    #report-container { margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Network Performance Report</h1>
  <p>Generated on: \${new Date().toISOString()}</p>
  
  <div id="loading">Loading network metrics...</div>
  <div id="error" style="display: none; color: #dc2626;"></div>
  <div id="report-container" style="display: none;"></div>
  
  <script>
    // Function to load client-side network metrics
    async function loadNetworkReport() {
      try {
        // Check if window.networkMetrics exists in the main window
        if (window.opener && window.opener.networkMetrics) {
          // Use metrics from opener window (if opened from main app)
          generateReport(window.opener.networkMetrics);
        } else {
          // Otherwise, try to generate a report from any saved data
          const reportResponse = await fetch('/api/network-performance/saved-reports');
          
          if (reportResponse.ok) {
            const reports = await reportResponse.json();
            generateReportFromSaved(reports);
          } else {
            showNoDataMessage();
          }
        }
      } catch (error) {
        console.error('Error loading network metrics:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'Error loading network metrics: ' + error.message;
      }
    }
    
    // Function to generate report from metrics
    function generateReport(metrics) {
      if (!metrics) {
        showNoDataMessage();
        return;
      }
      
      const reportContainer = document.getElementById('report-container');
      
      // Basic stats
      const totalRequests = metrics.requests ? metrics.requests.length : 0;
      const totalTime = metrics.requests ? metrics.requests.reduce((sum, req) => sum + req.duration, 0) : 0;
      const avgResponseTime = totalRequests > 0 ? totalTime / totalRequests : 0;
      const slowRequests = metrics.slowRequests || [];
      const slowRequestCount = slowRequests.length;
      
      // Generate HTML
      reportContainer.innerHTML = \`
        <div class="grid">
          <div class="card">
            <div style="font-size: 14px; color: #64748b;">Total Requests</div>
            <div class="card-value">\${totalRequests}</div>
          </div>
          
          <div class="card">
            <div style="font-size: 14px; color: #64748b;">Average Response Time</div>
            <div class="card-value \${avgResponseTime > 1000 ? 'text-red' : avgResponseTime > 500 ? 'text-yellow' : 'text-green'}">\${avgResponseTime.toFixed(0)} ms</div>
          </div>
          
          <div class="card">
            <div style="font-size: 14px; color: #64748b;">Slow Requests (>1s)</div>
            <div class="card-value \${slowRequestCount > 0 ? 'text-red' : 'text-green'}">\${slowRequestCount}</div>
          </div>
        </div>
        
        <h2>Slow Requests</h2>
        <div id="slow-requests-container">
          \${generateSlowRequestsTable(slowRequests)}
        </div>
        
        <h2>API Response Times</h2>
        <div id="api-stats-container">
          \${generateApiStatsTable(metrics.responseTimeSummary || {})}
        </div>
        
        <h2>Resource Loading Waterfall</h2>
        <div id="waterfall-container">
          \${generateWaterfallChart(metrics.waterfall || [])}
        </div>
      \`;
      
      document.getElementById('loading').style.display = 'none';
      reportContainer.style.display = 'block';
    }
    
    // Function to generate report from saved data
    function generateReportFromSaved(reports) {
      if (!reports || reports.length === 0) {
        showNoDataMessage();
        return;
      }
      
      // For now, just show the reports list
      const reportContainer = document.getElementById('report-container');
      
      reportContainer.innerHTML = \`
        <h2>Saved Reports</h2>
        <ul>
          \${reports.map(report => \`
            <li>
              <a href="/api/network-performance/report/\${report.id}" target="_blank">
                \${new Date(report.timestamp).toLocaleString()} - \${report.pages} pages analyzed
              </a>
            </li>
          \`).join('')}
        </ul>
        
        <p>
          Note: To generate a new report, visit your application and interact with it 
          while the network monitoring is active, then return here to see the results.
        </p>
      \`;
      
      document.getElementById('loading').style.display = 'none';
      reportContainer.style.display = 'block';
    }
    
    // Function to show no data message
    function showNoDataMessage() {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('report-container').style.display = 'block';
      document.getElementById('report-container').innerHTML = \`
        <div style="padding: 20px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
          <h2 style="margin-top: 0;">No Network Metrics Available</h2>
          <p>
            Network metrics haven't been collected yet. To collect metrics:
          </p>
          <ol style="text-align: left; display: inline-block;">
            <li>Make sure network monitoring is initialized in your application</li>
            <li>Navigate and interact with your application</li>
            <li>Return to this page to view the collected metrics</li>
          </ol>
          <p>
            <a href="/" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
              Visit Application
            </a>
          </p>
        </div>
      \`;
    }
    
    // Function to generate slow requests table
    function generateSlowRequestsTable(slowRequests) {
      if (!slowRequests || slowRequests.length === 0) {
        return '<p>No slow requests detected.</p>';
      }
      
      return \`
        <table>
          <tr>
            <th>URL</th>
            <th>Method</th>
            <th>Duration</th>
          </tr>
          \${slowRequests.map(req => \`
            <tr>
              <td>\${req.url}</td>
              <td>\${req.method || 'GET'}</td>
              <td class="\${req.duration > 3000 ? 'text-red' : 'text-yellow'}">\${req.duration.toFixed(0)} ms</td>
            </tr>
          \`).join('')}
        </table>
      \`;
    }
    
    // Function to generate API stats table
    function generateApiStatsTable(apiStats) {
      if (!apiStats || Object.keys(apiStats).length === 0) {
        return '<p>No API requests recorded.</p>';
      }
      
      return \`
        <table>
          <tr>
            <th>Endpoint</th>
            <th>Count</th>
            <th>Avg Time</th>
            <th>Min Time</th>
            <th>Max Time</th>
          </tr>
          \${Object.entries(apiStats).map(([path, stats]) => \`
            <tr>
              <td>\${path}</td>
              <td>\${stats.count}</td>
              <td class="\${stats.avgTime > 1000 ? 'text-red' : stats.avgTime > 500 ? 'text-yellow' : 'text-green'}">\${stats.avgTime.toFixed(0)} ms</td>
              <td>\${stats.minTime.toFixed(0)} ms</td>
              <td>\${stats.maxTime.toFixed(0)} ms</td>
            </tr>
          \`).join('')}
        </table>
      \`;
    }
    
    // Function to generate waterfall chart
    function generateWaterfallChart(waterfall) {
      if (!waterfall || waterfall.length === 0) {
        return '<p>No resource loading data available.</p>';
      }
      
      // Sort by start time
      waterfall.sort((a, b) => a.startTime - b.startTime);
      
      // Adjust times to be relative to the first resource
      const firstStartTime = waterfall[0].startTime;
      waterfall.forEach(entry => {
        entry.startTime = entry.startTime - firstStartTime;
      });
      
      // Find the latest endTime to determine the chart width
      const maxEndTime = waterfall.reduce((max, entry) => 
        Math.max(max, entry.startTime + entry.duration), 0);
      
      // Define colors for different resource types
      const typeColors = {
        'image': '#4f46e5',
        'stylesheet': '#16a34a',
        'script': '#ca8a04',
        'xhr': '#db2777',
        'font': '#9333ea',
        'other': '#64748b'
      };
      
      return \`
        <div class="waterfall-chart" style="width: 100%;">
          <style>
            .waterfall-chart .resource-row {
              display: flex;
              margin-bottom: 2px;
              align-items: center;
              font-size: 12px;
            }
            .waterfall-chart .resource-label {
              width: 30%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding-right: 10px;
            }
            .waterfall-chart .resource-bar-container {
              width: 70%;
              height: 20px;
              position: relative;
              background-color: #f1f5f9;
              border-radius: 3px;
            }
            .waterfall-chart .resource-bar {
              height: 100%;
              position: absolute;
              border-radius: 3px;
            }
            .waterfall-chart .time-marker {
              position: absolute;
              top: 0;
              width: 1px;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.2);
            }
            .waterfall-chart .time-label {
              position: absolute;
              top: -15px;
              transform: translateX(-50%);
              font-size: 10px;
              color: #64748b;
            }
            .waterfall-chart .legend {
              display: flex;
              margin-top: 20px;
              flex-wrap: wrap;
            }
            .waterfall-chart .legend-item {
              display: flex;
              align-items: center;
              margin-right: 15px;
              margin-bottom: 5px;
            }
            .waterfall-chart .legend-color {
              width: 12px;
              height: 12px;
              margin-right: 5px;
              border-radius: 2px;
            }
          </style>
          
          <div style="position: relative; margin-top: 20px;">
            <!-- Time markers -->
            \${[0, 250, 500, 1000, 2000, 3000, 5000].filter(time => time <= maxEndTime).map(time => \`
              <div class="time-marker" style="left: \${time / maxEndTime * 100}%;">
                <div class="time-label">\${time}ms</div>
              </div>
            \`).join('')}
            
            <!-- Resources -->
            \${waterfall.map(entry => {
              const startPercent = (entry.startTime / maxEndTime) * 100;
              const widthPercent = (entry.duration / maxEndTime) * 100;
              const url = entry.url.split('/').pop().split('?')[0];
              const type = entry.type || 'other';
              const color = typeColors[type] || typeColors.other;
              
              return \`
                <div class="resource-row">
                  <div class="resource-label" title="\${entry.url}">\${url}</div>
                  <div class="resource-bar-container">
                    <div class="resource-bar" style="left: \${startPercent}%; width: \${widthPercent}%; background-color: \${color};" 
                      title="\${entry.url}\\nStart: \${entry.startTime.toFixed(0)}ms\\nDuration: \${entry.duration.toFixed(0)}ms">
                    </div>
                  </div>
                </div>
              \`;
            }).join('')}
          </div>
          
          <!-- Legend -->
          <div class="legend">
            \${Object.entries(typeColors).map(([type, color]) => \`
              <div class="legend-item">
                <div class="legend-color" style="background-color: \${color};"></div>
                <div>\${type.charAt(0).toUpperCase() + type.slice(1)}</div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }
    
    // Load network report when page loads
    window.addEventListener('DOMContentLoaded', loadNetworkReport);
  </script>
</body>
</html>
    \`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(reportHtml);
  } catch (error) {
    console.error('Error generating network report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * Get a list of saved network reports
 */
router.get('/saved-reports', async (req, res) => {
  try {
    const files = fs.readdirSync(reportsDir)
      .filter(file => file.startsWith('network-metrics-') && file.endsWith('.json'))
      .sort();
    
    const reports = [];
    
    for (const file of files) {
      const filePath = path.join(reportsDir, file);
      const timestamp = file.replace('network-metrics-', '').replace('.json', '');
      
      try {
        const fileStats = fs.statSync(filePath);
        const reportData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        reports.push({
          id: file,
          timestamp: new Date(timestamp.replace(/-/g, ':')).toISOString(),
          size: fileStats.size,
          pages: reportData.pages || 1,
          metrics: reportData.summary || {}
        });
      } catch (err) {
        console.error(\`Error reading report file \${file}:\`, err);
      }
    }
    
    res.json(reports);
  } catch (error) {
    console.error('Error retrieving network reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

/**
 * Get a specific saved network report
 */
router.get('/report/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    const reportPath = path.join(reportsDir, reportId);
    
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Generate HTML report from the data
    // You could implement a more sophisticated HTML report here
    const reportHtml = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Network Performance Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
  </style>
</head>
<body>
  <h1>Network Performance Report</h1>
  <p>Generated on: \${new Date().toISOString()}</p>
  
  <h2>Raw Report Data</h2>
  <pre>\${JSON.stringify(reportData, null, 2)}</pre>
</body>
</html>
    \`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(reportHtml);
  } catch (error) {
    console.error('Error retrieving network report:', error);
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
});

export default router;
`;

    fs.writeFileSync(networkRouteFile, networkRouteContent);
    console.log(`✅ Created network performance route at ${networkRouteFile}`);
  } else {
    console.log(`⚠️ Network performance route already exists at ${networkRouteFile}`);
  }
  
  // Add network monitoring to client
  const appTsxPath = path.join(clientSrcDir, 'App.tsx');
  if (fs.existsSync(appTsxPath)) {
    let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    
    if (!appTsxContent.includes('initNetworkMonitoring')) {
      console.log('📝 Adding network monitoring initialization to App.tsx...');
      
      // Find the import section
      const lastImport = appTsxContent.lastIndexOf('import');
      const lastImportEnd = appTsxContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add import for network monitoring
        const networkImport = `import { initNetworkMonitoring } from './utils/network-monitor';\n`;
        appTsxContent = appTsxContent.slice(0, lastImportEnd + 1) + networkImport + appTsxContent.slice(lastImportEnd + 1);
        
        // Find the App function or component
        const appComponentMatch = appTsxContent.match(/function\s+App|const\s+App\s*=/);
        
        if (appComponentMatch) {
          const appComponentStart = appComponentMatch.index;
          const openBraceIndex = appTsxContent.indexOf('{', appComponentStart);
          
          if (openBraceIndex !== -1) {
            // Add network monitoring initialization
            const networkInit = `\n  // Initialize network monitoring\n  React.useEffect(() => {\n    initNetworkMonitoring();\n  }, []);\n\n`;
            appTsxContent = appTsxContent.slice(0, openBraceIndex + 1) + networkInit + appTsxContent.slice(openBraceIndex + 1);
            
            fs.writeFileSync(appTsxPath, appTsxContent);
            console.log('✅ Added network monitoring initialization to App.tsx');
          } else {
            console.log('⚠️ Could not locate App component body in App.tsx');
          }
        } else {
          console.log('⚠️ Could not locate App component in App.tsx');
        }
      } else {
        console.log('⚠️ Could not locate import statements in App.tsx');
      }
    } else {
      console.log('⚠️ Network monitoring initialization already exists in App.tsx');
    }
  } else {
    console.log(`⚠️ Could not find App.tsx at ${appTsxPath}`);
  }
}

// Function to create network performance dashboard
function createNetworkDashboard() {
  console.log('\n📊 Creating network performance dashboard component...');
  
  const dashboardDir = path.join(clientSrcDir, 'components', 'performance');
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }
  
  const networkDashboardPath = path.join(dashboardDir, 'NetworkDashboard.tsx');
  if (!fs.existsSync(networkDashboardPath)) {
    const networkDashboardContent = `import React, { useState, useEffect } from 'react';

interface RequestMetric {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  status?: number;
}

interface ApiSummary {
  [key: string]: {
    count: number;
    totalTime: number;
    avgTime: number;
    minTime: number;
    maxTime: number;
  };
}

interface WaterfallEntry {
  url: string;
  startTime: number;
  duration: number;
  type: string;
}

interface NetworkMetrics {
  requests: RequestMetric[];
  responseTimeSummary: ApiSummary;
  slowRequests?: RequestMetric[];
  waterfall?: WaterfallEntry[];
}

declare global {
  interface Window {
    networkMetrics?: NetworkMetrics;
  }
}

const NetworkDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [waterfallHtml, setWaterfallHtml] = useState<string>('');
  const [duplicates, setDuplicates] = useState<{url: string, count: number}[]>([]);
  
  useEffect(() => {
    // Load metrics from window object
    if (typeof window !== 'undefined' && window.networkMetrics) {
      setMetrics(window.networkMetrics);
      
      // Generate waterfall chart
      generateWaterfallChart();
      
      // Detect duplicate requests
      detectDuplicateRequests();
    }
    
    // Set up polling to update metrics every 2 seconds
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && window.networkMetrics) {
        setMetrics({...window.networkMetrics});
        generateWaterfallChart();
        detectDuplicateRequests();
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const generateWaterfallChart = () => {
    if (
      typeof window === 'undefined' || 
      !window.networkMetrics || 
      !window.networkMetrics.waterfall || 
      window.networkMetrics.waterfall.length === 0
    ) {
      return;
    }
    
    const waterfall = [...window.networkMetrics.waterfall];
    
    // Sort by start time
    waterfall.sort((a, b) => a.startTime - b.startTime);
    
    // Adjust times to be relative to the first resource
    const firstStartTime = waterfall[0].startTime;
    waterfall.forEach(entry => {
      entry.startTime = entry.startTime - firstStartTime;
    });
    
    // Find the latest endTime to determine the chart width
    const maxEndTime = waterfall.reduce((max, entry) => 
      Math.max(max, entry.startTime + entry.duration), 0);
    
    // Define colors for different resource types
    const typeColors = {
      'image': '#4f46e5',
      'stylesheet': '#16a34a',
      'script': '#ca8a04',
      'xhr': '#db2777',
      'font': '#9333ea',
      'other': '#64748b'
    };
    
    // Generate HTML
    const html = \`
      <div style="width: 100%;">
        <div style="position: relative; margin-top: 20px;">
          <!-- Time markers -->
          \${[0, 250, 500, 1000, 2000, 3000, 5000]
            .filter(time => time <= maxEndTime)
            .map(time => \`
              <div style="position: absolute; top: 0; left: \${time / maxEndTime * 100}%; width: 1px; height: 100%; background-color: rgba(0, 0, 0, 0.2);">
                <div style="position: absolute; top: -15px; transform: translateX(-50%); font-size: 10px; color: #64748b;">\${time}ms</div>
              </div>
            \`).join('')}
          
          <!-- Resources -->
          \${waterfall.map((entry, index) => {
            const startPercent = (entry.startTime / maxEndTime) * 100;
            const widthPercent = (entry.duration / maxEndTime) * 100;
            const url = entry.url.split('/').pop().split('?')[0];
            const type = entry.type || 'other';
            const color = typeColors[type as keyof typeof typeColors] || typeColors.other;
            
            return \`
              <div style="display: flex; margin-bottom: 2px; align-items: center; font-size: 12px;">
                <div style="width: 30%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 10px;" title="\${entry.url}">\${url}</div>
                <div style="width: 70%; height: 20px; position: relative; background-color: #f1f5f9; border-radius: 3px;">
                  <div style="height: 100%; position: absolute; left: \${startPercent}%; width: \${widthPercent}%; background-color: \${color}; border-radius: 3px;"
                    title="\${entry.url}\\nStart: \${entry.startTime.toFixed(0)}ms\\nDuration: \${entry.duration.toFixed(0)}ms">
                  </div>
                </div>
              </div>
            \`;
          }).join('')}
        </div>
        
        <!-- Legend -->
        <div style="display: flex; margin-top: 20px; flex-wrap: wrap;">
          \${Object.entries(typeColors).map(([type, color]) => \`
            <div style="display: flex; align-items: center; margin-right: 15px; margin-bottom: 5px;">
              <div style="width: 12px; height: 12px; margin-right: 5px; background-color: \${color}; border-radius: 2px;"></div>
              <div>\${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            </div>
          \`).join('')}
        </div>
      </div>
    \`;
    
    setWaterfallHtml(html);
  };
  
  const detectDuplicateRequests = () => {
    if (typeof window === 'undefined' || !window.networkMetrics || !window.networkMetrics.requests) {
      return;
    }
    
    const { requests } = window.networkMetrics;
    const urlCount: Record<string, number> = {};
    
    // Count requests by URL
    for (const request of requests) {
      // Remove query parameters for comparison
      const baseUrl = request.url.split('?')[0];
      urlCount[baseUrl] = (urlCount[baseUrl] || 0) + 1;
    }
    
    // Find URLs with multiple requests
    const dups = Object.entries(urlCount)
      .filter(([_, count]) => count > 1)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count);
    
    setDuplicates(dups);
  };
  
  // Format duration with color coding
  const formatDuration = (duration: number) => {
    let colorClass = 'text-green-600';
    if (duration > 1000) colorClass = 'text-red-600';
    else if (duration > 500) colorClass = 'text-amber-500';
    
    return (
      <span className={colorClass}>
        {duration.toFixed(0)} ms
      </span>
    );
  };
  
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Network Performance</h2>
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Collecting network metrics...
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Interact with the application to generate network activity
          </p>
        </div>
      </div>
    );
  }
  
  const totalRequests = metrics.requests.length;
  const totalDuration = metrics.requests.reduce((sum, req) => sum + req.duration, 0);
  const avgDuration = totalRequests > 0 ? totalDuration / totalRequests : 0;
  
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Network Performance</h2>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {totalRequests}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Average Response Time</div>
          <div className="text-2xl font-bold mt-1">
            {formatDuration(avgDuration)}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Slow Requests (>1s)</div>
          <div className={\`text-2xl font-bold mt-1 \${metrics.slowRequests && metrics.slowRequests.length > 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}\`}>
            {metrics.slowRequests?.length || 0}
          </div>
        </div>
      </div>
      
      {/* Tabs for different metrics */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <a href="#waterfall" className="inline-block p-4 border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500 rounded-t-lg">
                Waterfall
              </a>
            </li>
            <li className="mr-2">
              <a href="#api" className="inline-block p-4 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-t-lg">
                API Metrics
              </a>
            </li>
            <li className="mr-2">
              <a href="#slow" className="inline-block p-4 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-t-lg">
                Slow Requests
              </a>
            </li>
            <li>
              <a href="#duplicates" className="inline-block p-4 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-t-lg">
                Duplicates
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Waterfall Chart */}
      <div id="waterfall" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resource Loading Waterfall</h3>
        {waterfallHtml ? (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto" 
               dangerouslySetInnerHTML={{ __html: waterfallHtml }}>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No resource loading data available
          </div>
        )}
      </div>
      
      {/* API Response Times */}
      <div id="api" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API Response Times</h3>
        
        {Object.keys(metrics.responseTimeSummary).length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Count
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Min Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Max Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(metrics.responseTimeSummary).map(([path, stats], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {stats.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDuration(stats.avgTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {stats.minTime.toFixed(0)} ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {stats.maxTime.toFixed(0)} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No API requests recorded
          </div>
        )}
      </div>
      
      {/* Slow Requests */}
      <div id="slow" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Slow Requests (>1s)</h3>
        
        {metrics.slowRequests && metrics.slowRequests.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {metrics.slowRequests.map((request, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {request.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {request.method || 'GET'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDuration(request.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {request.status || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No slow requests detected
          </div>
        )}
      </div>
      
      {/* Duplicate Requests */}
      <div id="duplicates" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Duplicate Requests</h3>
        
        {duplicates.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {duplicates.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {item.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={item.count > 5 ? 'text-red-600' : 'text-amber-500'}>
                          {item.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No duplicate requests detected
          </div>
        )}
      </div>
      
      {/* Export Button */}
      <div className="mt-6">
        <a
          href="/api/network-performance/report"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Full Report
        </a>
      </div>
    </div>
  );
};

export default NetworkDashboard;
`;

    fs.writeFileSync(networkDashboardPath, networkDashboardContent);
    console.log(`✅ Created network dashboard component at ${networkDashboardPath}`);
  } else {
    console.log(`⚠️ Network dashboard component already exists at ${networkDashboardPath}`);
  }
  
  // Update performance page to include network dashboard
  const performancePagePath = path.join(clientSrcDir, 'pages', 'PerformancePage.tsx');
  if (fs.existsSync(performancePagePath)) {
    let performancePageContent = fs.readFileSync(performancePagePath, 'utf8');
    
    if (!performancePageContent.includes('NetworkDashboard')) {
      console.log('📝 Adding network dashboard to performance page...');
      
      // Find import section
      const lastImport = performancePageContent.lastIndexOf('import');
      const lastImportEnd = performancePageContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add import for NetworkDashboard
        const networkImport = `import NetworkDashboard from '../components/performance/NetworkDashboard';\n`;
        performancePageContent = performancePageContent.slice(0, lastImportEnd + 1) + networkImport + performancePageContent.slice(lastImportEnd + 1);
        
        // Find the PerformanceDashboard component in the JSX
        const dashboardMatch = performancePageContent.match(/<PerformanceDashboard\s*\/>/);
        
        if (dashboardMatch) {
          const dashboardIndex = dashboardMatch.index + dashboardMatch[0].length;
          
          // Add NetworkDashboard after PerformanceDashboard
          const networkDashboard = `\n\n      <div className="mt-8"></div>\n      <NetworkDashboard />`;
          performancePageContent = performancePageContent.slice(0, dashboardIndex) + networkDashboard + performancePageContent.slice(dashboardIndex);
          
          fs.writeFileSync(performancePagePath, performancePageContent);
          console.log('✅ Added network dashboard to performance page');
        } else {
          console.log('⚠️ Could not locate PerformanceDashboard component in performance page');
        }
      } else {
        console.log('⚠️ Could not locate import statements in performance page');
      }
    } else {
      console.log('⚠️ Network dashboard already included in performance page');
    }
  } else {
    console.log(`⚠️ Could not find performance page at ${performancePagePath}`);
  }
}

// Main function
async function setupNetworkMonitoring() {
  try {
    // 1. Set up network monitoring
    await setupNetworkMonitoring();
    
    // 2. Create network dashboard
    createNetworkDashboard();

    console.log('\n✨ Network performance monitoring setup completed!');
    console.log('===============================');
    console.log(`Visit the "/performance" route in your application to view the network performance dashboard.`);
    console.log(`Network performance reports are located in the "performance-reports/network" directory.`);
    console.log(`Completed: ${new Date().toISOString()}`);
  } catch (err) {
    console.error('❌ Error setting up network monitoring:', err);
  }
}

// Run the script
setupNetworkMonitoring();