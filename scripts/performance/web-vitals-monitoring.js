/**
 * Web Vitals Monitoring for Deep Travel Collections
 * 
 * This script sets up monitoring for Core Web Vitals metrics and
 * creates a dashboard to visualize performance over time.
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
const webVitalsDir = path.join(reportsDir, 'web-vitals');
const clientDir = path.join(rootDir, 'client');
const clientSrcDir = path.join(clientDir, 'src');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

if (!fs.existsSync(webVitalsDir)) {
  fs.mkdirSync(webVitalsDir, { recursive: true });
}

// Performance budgets based on industry standards
const PERFORMANCE_BUDGETS = {
  LCP: 2500,   // Largest Contentful Paint: 2.5s
  FID: 100,    // First Input Delay: 100ms
  CLS: 0.1,    // Cumulative Layout Shift: 0.1
  FCP: 1800,   // First Contentful Paint: 1.8s
  TTI: 3800,   // Time to Interactive: 3.8s
  TTFB: 800,   // Time to First Byte: 800ms
  BUNDLE_SIZE: 1000000  // Bundle size: 1MB
};

console.log('===============================');
console.log('| WEB VITALS MONITORING       |');
console.log('===============================');
console.log(`Started: ${new Date().toISOString()}`);

// Function to install necessary packages for web vitals monitoring
async function installPackages() {
  console.log('\n📦 Checking required packages...');
  
  // Check if web-vitals is installed
  try {
    execSync('npm list web-vitals', { stdio: 'pipe', cwd: rootDir });
    console.log('✅ web-vitals package is already installed');
  } catch (err) {
    console.log('⚠️ web-vitals package is not installed, installing...');
    try {
      execSync('npm install web-vitals', { stdio: 'inherit', cwd: rootDir });
      console.log('✅ Successfully installed web-vitals package');
    } catch (err) {
      console.error('❌ Failed to install web-vitals package:', err);
    }
  }
  
  // Check if lighthouse is installed
  try {
    execSync('npx lighthouse --version', { stdio: 'pipe', cwd: rootDir });
    console.log('✅ lighthouse package is already installed');
  } catch (err) {
    console.log('⚠️ lighthouse package is not installed, installing...');
    try {
      execSync('npm install -g lighthouse', { stdio: 'inherit', cwd: rootDir });
      console.log('✅ Successfully installed lighthouse package');
    } catch (err) {
      console.error('❌ Failed to install lighthouse package:', err);
    }
  }
}

// Function to set up web vitals tracking in the React app
async function setupWebVitalsTracking() {
  console.log('\n🔧 Setting up web vitals tracking in React app...');
  
  // Check if web-vitals reporting exists
  const webVitalsPath = path.join(clientSrcDir, 'utils', 'web-vitals.ts');
  const webVitalsDir = path.dirname(webVitalsPath);
  
  if (!fs.existsSync(webVitalsDir)) {
    fs.mkdirSync(webVitalsDir, { recursive: true });
  }
  
  // Create web-vitals utility file if it doesn't exist
  if (!fs.existsSync(webVitalsPath)) {
    const webVitalsContent = `import { ReportHandler, getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

// Define a global window property for Replit environment
declare global {
  interface Window {
    webVitals?: {
      [key: string]: number;
    };
  }
}

// Initialize web vitals object on window for debugging
if (typeof window !== 'undefined') {
  window.webVitals = window.webVitals || {};
}

const saveToWindow = (name: string, value: number): void => {
  if (typeof window !== 'undefined' && window.webVitals) {
    window.webVitals[name] = value;
  }
};

const sendToAnalytics = (metric: any): void => {
  // Save to window for debugging
  saveToWindow(metric.name, metric.value);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric.name, metric.value);
  }
  
  // Send to server endpoint for storage
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
    });
  }
};

export const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (typeof onPerfEntry !== 'function') {
    onPerfEntry = sendToAnalytics;
  }
  
  // Only report web vitals in production or when explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_MEASURE_PERFORMANCE === 'true') {
    getCLS(onPerfEntry); // Cumulative Layout Shift
    getFID(onPerfEntry); // First Input Delay
    getFCP(onPerfEntry); // First Contentful Paint
    getLCP(onPerfEntry); // Largest Contentful Paint
    getTTFB(onPerfEntry); // Time to First Byte
  }
};

/**
 * Check web vitals against performance budgets
 * @returns Object with pass/fail status for each metric
 */
export const checkWebVitalsBudgets = (): Record<string, { value: number; passes: boolean; budget: number }> => {
  if (typeof window === 'undefined' || !window.webVitals) return {};
  
  const budgets = {
    LCP: 2500,   // 2.5s
    FID: 100,    // 100ms
    CLS: 0.1,    // 0.1
    FCP: 1800,   // 1.8s
    TTFB: 800,   // 800ms
  };
  
  const results: Record<string, { value: number; passes: boolean; budget: number }> = {};
  
  for (const [metric, budget] of Object.entries(budgets)) {
    if (window.webVitals[metric]) {
      results[metric] = {
        value: window.webVitals[metric],
        passes: window.webVitals[metric] <= budget,
        budget,
      };
    }
  }
  
  return results;
};

export default reportWebVitals;
`;

    fs.writeFileSync(webVitalsPath, webVitalsContent);
    console.log(`✅ Created web-vitals utility at ${webVitalsPath}`);
  } else {
    console.log(`⚠️ Web vitals utility already exists at ${webVitalsPath}`);
  }
  
  // Create the API endpoint for web vitals
  const apiDir = path.join(rootDir, 'server', 'routes');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  const performanceRouteFile = path.join(apiDir, 'performance.ts');
  if (!fs.existsSync(performanceRouteFile)) {
    const performanceRouteContent = `import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const reportsDir = path.join(__dirname, '../../performance-reports/web-vitals');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

/**
 * Store web vitals metrics reported from the client
 */
router.post('/web-vitals', async (req, res) => {
  try {
    const metrics = req.body;
    
    if (!metrics || !metrics.name) {
      return res.status(400).json({ error: 'Invalid metrics data' });
    }
    
    // Add timestamp if not provided
    if (!metrics.timestamp) {
      metrics.timestamp = new Date().toISOString();
    }
    
    // Get existing metrics file or create a new one
    const today = new Date().toISOString().split('T')[0];
    const metricsFilePath = path.join(reportsDir, \`metrics-\${today}.json\`);
    
    let allMetrics = [];
    if (fs.existsSync(metricsFilePath)) {
      const metricsData = fs.readFileSync(metricsFilePath, 'utf8');
      allMetrics = JSON.parse(metricsData);
    }
    
    // Add new metrics
    allMetrics.push(metrics);
    
    // Save metrics
    fs.writeFileSync(metricsFilePath, JSON.stringify(allMetrics, null, 2));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error storing web vitals:', error);
    res.status(500).json({ error: 'Failed to store metrics' });
  }
});

/**
 * Get performance metrics for dashboard visualization
 */
router.get('/metrics', async (req, res) => {
  try {
    const files = fs.readdirSync(reportsDir)
      .filter(file => file.startsWith('metrics-') && file.endsWith('.json'))
      .sort();
    
    if (files.length === 0) {
      return res.json({ metrics: [] });
    }
    
    // Get the date range from the query parameters
    const { start, end, limit } = req.query;
    const startDate = start ? new Date(start as string) : new Date(0);
    const endDate = end ? new Date(end as string) : new Date();
    const maxResults = limit ? parseInt(limit as string) : 100;
    
    // Collect metrics from files within the date range
    let allMetrics = [];
    for (const file of files) {
      const fileDate = new Date(file.replace('metrics-', '').replace('.json', ''));
      
      if (fileDate >= startDate && fileDate <= endDate) {
        const filePath = path.join(reportsDir, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const metrics = JSON.parse(fileData);
        allMetrics = [...allMetrics, ...metrics];
      }
    }
    
    // Sort by timestamp and limit results
    allMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    allMetrics = allMetrics.slice(0, maxResults);
    
    // Calculate averages for each metric type
    const metricTypes = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'];
    const averages = {};
    
    for (const type of metricTypes) {
      const values = allMetrics.filter(m => m.name === type).map(m => m.value);
      if (values.length > 0) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        averages[type] = Math.round(avg * 100) / 100;
      }
    }
    
    // Calculate pass rates for each metric type compared to performance budgets
    const budgets = {
      LCP: 2500,   // 2.5s
      FID: 100,    // 100ms
      CLS: 0.1,    // 0.1
      FCP: 1800,   // 1.8s
      TTFB: 800,   // 800ms
    };
    
    const passRates = {};
    for (const type of metricTypes) {
      if (budgets[type]) {
        const metrics = allMetrics.filter(m => m.name === type);
        if (metrics.length > 0) {
          const passing = metrics.filter(m => m.value <= budgets[type]).length;
          passRates[type] = Math.round((passing / metrics.length) * 100);
        }
      }
    }
    
    res.json({
      metrics: allMetrics,
      averages,
      passRates,
      budgets
    });
  } catch (error) {
    console.error('Error retrieving performance metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

/**
 * Generate a performance report based on collected metrics
 */
router.get('/report', async (req, res) => {
  try {
    // Generate report HTML
    const reportHtml = await generatePerformanceReport();
    res.setHeader('Content-Type', 'text/html');
    res.send(reportHtml);
  } catch (error) {
    console.error('Error generating performance report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * Generate a performance report HTML
 */
async function generatePerformanceReport() {
  // Get all metric files
  const files = fs.readdirSync(reportsDir)
    .filter(file => file.startsWith('metrics-') && file.endsWith('.json'))
    .sort();
  
  if (files.length === 0) {
    return '<h1>No performance data available</h1>';
  }
  
  // Collect metrics from files
  let allMetrics = [];
  for (const file of files) {
    const filePath = path.join(reportsDir, file);
    const fileData = fs.readFileSync(filePath, 'utf8');
    const metrics = JSON.parse(fileData);
    allMetrics = [...allMetrics, ...metrics];
  }
  
  // Sort by timestamp
  allMetrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Calculate averages by date and type
  const metricsByDate = {};
  for (const metric of allMetrics) {
    const date = metric.timestamp.split('T')[0];
    metricsByDate[date] = metricsByDate[date] || {};
    metricsByDate[date][metric.name] = metricsByDate[date][metric.name] || [];
    metricsByDate[date][metric.name].push(metric.value);
  }
  
  // Calculate average for each date and metric type
  const averages = {};
  for (const [date, metrics] of Object.entries(metricsByDate)) {
    averages[date] = {};
    for (const [type, values] of Object.entries(metrics)) {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      averages[date][type] = Math.round(avg * 100) / 100;
    }
  }
  
  // Generate report HTML
  return \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Performance Report - Deep Travel Collections</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .metric { font-size: 24px; font-weight: bold; margin: 20px 0; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f8fafc; }
    .good { color: green; }
    .warning { color: orange; }
    .poor { color: red; }
    .chart-container { height: 400px; margin: 20px 0; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Performance Report - Deep Travel Collections</h1>
  <p>Generated on: \${new Date().toISOString()}</p>
  
  <h2>Performance Overview</h2>
  <div class="chart-container">
    <canvas id="performanceChart"></canvas>
  </div>
  
  <h2>Performance Metrics by Date</h2>
  <table>
    <tr>
      <th>Date</th>
      <th>LCP (ms)</th>
      <th>FID (ms)</th>
      <th>CLS</th>
      <th>FCP (ms)</th>
      <th>TTFB (ms)</th>
    </tr>
    \${Object.entries(averages).map(([date, metrics]) => \`
      <tr>
        <td>\${date}</td>
        <td class="\${getPerformanceClass(metrics.LCP, 2500)}">\${metrics.LCP || '-'}</td>
        <td class="\${getPerformanceClass(metrics.FID, 100)}">\${metrics.FID || '-'}</td>
        <td class="\${getPerformanceClass(metrics.CLS, 0.1, true)}">\${metrics.CLS || '-'}</td>
        <td class="\${getPerformanceClass(metrics.FCP, 1800)}">\${metrics.FCP || '-'}</td>
        <td class="\${getPerformanceClass(metrics.TTFB, 800)}">\${metrics.TTFB || '-'}</td>
      </tr>
    \`).join('')}
  </table>
  
  <h2>Performance Budgets</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Budget</th>
      <th>Latest Average</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>Largest Contentful Paint (LCP)</td>
      <td>2500ms</td>
      <td>\${getLatestAverage('LCP', averages)}ms</td>
      <td class="\${getStatusClass('LCP', 2500, averages)}">
        \${getStatusText('LCP', 2500, averages)}
      </td>
    </tr>
    <tr>
      <td>First Input Delay (FID)</td>
      <td>100ms</td>
      <td>\${getLatestAverage('FID', averages)}ms</td>
      <td class="\${getStatusClass('FID', 100, averages)}">
        \${getStatusText('FID', 100, averages)}
      </td>
    </tr>
    <tr>
      <td>Cumulative Layout Shift (CLS)</td>
      <td>0.1</td>
      <td>\${getLatestAverage('CLS', averages)}</td>
      <td class="\${getStatusClass('CLS', 0.1, averages, true)}">
        \${getStatusText('CLS', 0.1, averages, true)}
      </td>
    </tr>
    <tr>
      <td>First Contentful Paint (FCP)</td>
      <td>1800ms</td>
      <td>\${getLatestAverage('FCP', averages)}ms</td>
      <td class="\${getStatusClass('FCP', 1800, averages)}">
        \${getStatusText('FCP', 1800, averages)}
      </td>
    </tr>
    <tr>
      <td>Time to First Byte (TTFB)</td>
      <td>800ms</td>
      <td>\${getLatestAverage('TTFB', averages)}ms</td>
      <td class="\${getStatusClass('TTFB', 800, averages)}">
        \${getStatusText('TTFB', 800, averages)}
      </td>
    </tr>
  </table>
  
  <h2>Recommendations</h2>
  <ul>
    \${getRecommendations(averages).map(rec => \`<li>\${rec}</li>\`).join('')}
  </ul>
  
  <script>
    // Chart.js setup
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Prepare data for chart
    const dates = \${JSON.stringify(Object.keys(averages))};
    
    const lcpData = dates.map(date => ({ x: date, y: \${JSON.stringify(averages)}[date].LCP || null }));
    const fidData = dates.map(date => ({ x: date, y: \${JSON.stringify(averages)}[date].FID || null }));
    const clsData = dates.map(date => ({ x: date, y: \${JSON.stringify(averages)}[date].CLS || null }));
    const fcpData = dates.map(date => ({ x: date, y: \${JSON.stringify(averages)}[date].FCP || null }));
    const ttfbData = dates.map(date => ({ x: date, y: \${JSON.stringify(averages)}[date].TTFB || null }));
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'LCP (ms)',
            data: lcpData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3
          },
          {
            label: 'FID (ms)',
            data: fidData,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.3
          },
          {
            label: 'CLS',
            data: clsData,
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.3,
            yAxisID: 'y1'
          },
          {
            label: 'FCP (ms)',
            data: fcpData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3
          },
          {
            label: 'TTFB (ms)',
            data: ttfbData,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Milliseconds'
            },
            suggestedMin: 0
          },
          y1: {
            position: 'right',
            title: {
              display: true,
              text: 'CLS Score'
            },
            suggestedMin: 0,
            suggestedMax: 0.5,
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Core Web Vitals Trends',
            font: {
              size: 16
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  </script>
</body>
</html>
  \`;
  
  // Helper function to get performance class
  function getPerformanceClass(value, threshold, isLowerBetter = false) {
    if (!value) return '';
    
    if (isLowerBetter) {
      if (value <= threshold) return 'good';
      if (value <= threshold * 2) return 'warning';
      return 'poor';
    } else {
      if (value <= threshold) return 'good';
      if (value <= threshold * 1.5) return 'warning';
      return 'poor';
    }
  }
  
  // Helper function to get latest average for a metric
  function getLatestAverage(metric, averages) {
    const dates = Object.keys(averages).sort();
    if (dates.length === 0) return '-';
    
    const latestDate = dates[dates.length - 1];
    return averages[latestDate][metric] || '-';
  }
  
  // Helper function to get status class
  function getStatusClass(metric, threshold, averages, isLowerBetter = false) {
    const value = getLatestAverage(metric, averages);
    if (value === '-') return '';
    
    return getPerformanceClass(value, threshold, isLowerBetter);
  }
  
  // Helper function to get status text
  function getStatusText(metric, threshold, averages, isLowerBetter = false) {
    const value = getLatestAverage(metric, averages);
    if (value === '-') return 'No data';
    
    const cls = getPerformanceClass(value, threshold, isLowerBetter);
    if (cls === 'good') return 'Good';
    if (cls === 'warning') return 'Needs Improvement';
    return 'Poor';
  }
  
  // Helper function to get recommendations
  function getRecommendations(averages) {
    const recs = [];
    const latest = Object.keys(averages).sort().pop();
    if (!latest) return recs;
    
    const metrics = averages[latest];
    
    if (metrics.LCP > 2500) {
      recs.push('Improve Largest Contentful Paint (LCP) by optimizing image loading, using a CDN, or implementing server-side rendering for critical content.');
    }
    
    if (metrics.FID > 100) {
      recs.push('Improve First Input Delay (FID) by breaking up long tasks, optimizing JavaScript execution, or implementing web workers for complex operations.');
    }
    
    if (metrics.CLS > 0.1) {
      recs.push('Reduce Cumulative Layout Shift (CLS) by setting explicit dimensions for images and embeds, and avoiding dynamic content insertions that cause layout shifts.');
    }
    
    if (metrics.FCP > 1800) {
      recs.push('Improve First Contentful Paint (FCP) by optimizing server response times, reducing render-blocking resources, or implementing critical CSS.');
    }
    
    if (metrics.TTFB > 800) {
      recs.push('Improve Time to First Byte (TTFB) by optimizing server performance, implementing caching, or using a CDN.');
    }
    
    return recs.length > 0 ? recs : ['All performance metrics are within acceptable ranges. Keep up the good work!'];
  }
}

export default router;
`;

    fs.writeFileSync(performanceRouteFile, performanceRouteContent);
    console.log(`✅ Created performance route at ${performanceRouteFile}`);
  } else {
    console.log(`⚠️ Performance route already exists at ${performanceRouteFile}`);
  }
  
  // Create the performance dashboard component
  const dashboardDir = path.join(clientSrcDir, 'components', 'performance');
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }
  
  const dashboardComponent = path.join(dashboardDir, 'PerformanceDashboard.tsx');
  if (!fs.existsSync(dashboardComponent)) {
    const dashboardContent = `import React, { useEffect, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  url: string;
}

interface Averages {
  [key: string]: number;
}

interface PassRates {
  [key: string]: number;
}

interface Budgets {
  [key: string]: number;
}

interface MetricsResponse {
  metrics: PerformanceMetric[];
  averages: Averages;
  passRates: PassRates;
  budgets: Budgets;
}

const metricTitles = {
  LCP: 'Largest Contentful Paint',
  FID: 'First Input Delay',
  CLS: 'Cumulative Layout Shift',
  FCP: 'First Contentful Paint',
  TTFB: 'Time to First Byte',
};

const metricUnits = {
  LCP: 'ms',
  FID: 'ms',
  CLS: '',
  FCP: 'ms',
  TTFB: 'ms',
};

const PerformanceDashboard: React.FC = () => {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('7d');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Calculate date range based on timeframe
        const end = new Date();
        let start = new Date();
        
        switch (timeframe) {
          case '1d':
            start.setDate(end.getDate() - 1);
            break;
          case '7d':
            start.setDate(end.getDate() - 7);
            break;
          case '30d':
            start.setDate(end.getDate() - 30);
            break;
          case '90d':
            start.setDate(end.getDate() - 90);
            break;
          default:
            start = new Date(0); // All time
        }
        
        const response = await fetch(\`/api/performance/metrics?start=\${start.toISOString()}&end=\${end.toISOString()}\`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch performance metrics');
        }
        
        const metricsData = await response.json();
        setData(metricsData);
      } catch (err) {
        setError('Failed to load performance metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeframe]);
  
  const getStatusClass = (metricName: string, value: number): string => {
    if (!data?.budgets || !data.budgets[metricName]) return '';
    
    const budget = data.budgets[metricName];
    const isGood = metricName === 'CLS' 
      ? value <= budget 
      : value <= budget;
      
    const isWarning = metricName === 'CLS'
      ? value <= budget * 2
      : value <= budget * 1.5;
    
    if (isGood) return 'text-green-600';
    if (isWarning) return 'text-amber-500';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="timeframe" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Timeframe:
          </label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(metricTitles).map(([key, title]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === 'CLS' ? 'Lower is better' : 'Faster is better'}
                    </p>
                  </div>
                  {data?.passRates && data.passRates[key] !== undefined && (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                      <span className="text-sm font-medium">
                        {data.passRates[key]}% pass
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="flex items-end space-x-1">
                    <span className={
                      \`text-3xl font-bold \${
                        data?.averages && data.averages[key] !== undefined
                          ? getStatusClass(key, data.averages[key])
                          : ''
                      }\`
                    }>
                      {data?.averages && data.averages[key] !== undefined
                        ? data.averages[key]
                        : 'N/A'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      {metricUnits[key as keyof typeof metricUnits]}
                    </span>
                  </div>
                  
                  {data?.budgets && data.budgets[key] && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={
                            \`h-full \${
                              data?.averages && data.averages[key] <= data.budgets[key]
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }\`
                          } 
                          style={{ 
                            width: data?.averages && data.averages[key] !== undefined
                              ? \`\${Math.min(data.averages[key] / data.budgets[key] * 100, 100)}%\`
                              : '0%'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>0</span>
                        <span>Budget: {data.budgets[key]}{metricUnits[key as keyof typeof metricUnits]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Measurements</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      URL
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.metrics && data.metrics.slice(0, 10).map((metric, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(metric.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {metricTitles[metric.name as keyof typeof metricTitles] || metric.name}
                      </td>
                      <td className={
                        \`px-6 py-4 whitespace-nowrap text-sm font-medium \${
                          getStatusClass(metric.name, metric.value)
                        }\`
                      }>
                        {metric.value}
                        {metricUnits[metric.name as keyof typeof metricUnits]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {metric.url ? new URL(metric.url).pathname : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  
                  {(!data?.metrics || data.metrics.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No performance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-8">
            <a
              href="/api/performance/report"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Full Performance Report
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceDashboard;
`;

    fs.writeFileSync(dashboardComponent, dashboardContent);
    console.log(`✅ Created performance dashboard component at ${dashboardComponent}`);
  } else {
    console.log(`⚠️ Performance dashboard component already exists at ${dashboardComponent}`);
  }
  
  // Update main.tsx to include web vitals reporting
  const mainTsxPath = path.join(clientSrcDir, 'main.tsx');
  if (fs.existsSync(mainTsxPath)) {
    let mainTsxContent = fs.readFileSync(mainTsxPath, 'utf8');
    
    if (!mainTsxContent.includes('reportWebVitals')) {
      console.log('📝 Adding web vitals reporting to main.tsx...');
      
      // Find import statements
      const lastImport = mainTsxContent.lastIndexOf('import');
      const lastImportEnd = mainTsxContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add web vitals import after the last import
        const webVitalsImport = `import { reportWebVitals } from './utils/web-vitals';\n`;
        mainTsxContent = mainTsxContent.slice(0, lastImportEnd + 1) + webVitalsImport + mainTsxContent.slice(lastImportEnd + 1);
        
        // Add reportWebVitals() call at the end of the file
        mainTsxContent += '\n\n// Report web vitals metrics\nreportWebVitals();\n';
        
        fs.writeFileSync(mainTsxPath, mainTsxContent);
        console.log('✅ Added web vitals reporting to main.tsx');
      } else {
        console.log('⚠️ Could not locate import statements in main.tsx');
      }
    } else {
      console.log('⚠️ Web vitals reporting already included in main.tsx');
    }
  } else {
    console.log(`⚠️ Could not find main.tsx at ${mainTsxPath}`);
  }
  
  // Update server routes to include performance routes
  const serverRoutesPath = path.join(rootDir, 'server', 'routes.ts');
  if (fs.existsSync(serverRoutesPath)) {
    let routesContent = fs.readFileSync(serverRoutesPath, 'utf8');
    
    if (!routesContent.includes('performance')) {
      console.log('📝 Adding performance routes to server routes...');
      
      // Find import statements
      const lastImport = routesContent.lastIndexOf('import');
      const lastImportEnd = routesContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add performance route import
        const performanceImport = `import performanceRoutes from './routes/performance';\n`;
        routesContent = routesContent.slice(0, lastImportEnd + 1) + performanceImport + routesContent.slice(lastImportEnd + 1);
        
        // Find app.use statements or registerRoutes function
        const appUseMatch = routesContent.match(/app\.use\(['"]\//);
        
        if (appUseMatch) {
          // Add performance routes before the first app.use
          const appUseIndex = appUseMatch.index;
          const performanceRoutes = `  app.use('/api/performance', performanceRoutes);\n  `;
          routesContent = routesContent.slice(0, appUseIndex) + performanceRoutes + routesContent.slice(appUseIndex);
        } else {
          console.log('⚠️ Could not locate app.use statements in routes.ts');
        }
        
        fs.writeFileSync(serverRoutesPath, routesContent);
        console.log('✅ Added performance routes to server routes');
      } else {
        console.log('⚠️ Could not locate import statements in routes.ts');
      }
    } else {
      console.log('⚠️ Performance routes already included in server routes');
    }
  } else {
    console.log(`⚠️ Could not find routes.ts at ${serverRoutesPath}`);
  }
}

// Function to run Lighthouse
async function runLighthouse() {
  console.log('\n🔍 Running Lighthouse audit...');
  
  const lighthouse = (await import('lighthouse')).default;
  const chromeLauncher = (await import('chrome-launcher')).default;
  
  try {
    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless']
    });
    
    // Run Lighthouse
    const options = {
      port: chrome.port,
      onlyCategories: ['performance'],
      output: 'html'
    };
    
    const runnerResult = await lighthouse('http://localhost:3000', options);
    
    // Save the report
    const reportHtml = runnerResult.report;
    const reportPath = path.join(webVitalsDir, `lighthouse-${new Date().toISOString().replace(/:/g, '-')}.html`);
    fs.writeFileSync(reportPath, reportHtml);
    
    // Extract performance metrics
    const performanceScore = runnerResult.lhr.categories.performance.score * 100;
    const metrics = runnerResult.lhr.audits;
    
    console.log(`✅ Lighthouse Performance Score: ${performanceScore.toFixed(0)}/100`);
    console.log('Core Web Vitals:');
    console.log(`- First Contentful Paint (FCP): ${metrics['first-contentful-paint'].displayValue}`);
    console.log(`- Largest Contentful Paint (LCP): ${metrics['largest-contentful-paint'].displayValue}`);
    console.log(`- Cumulative Layout Shift (CLS): ${metrics['cumulative-layout-shift'].displayValue}`);
    console.log(`- Total Blocking Time: ${metrics['total-blocking-time'].displayValue}`);
    
    console.log(`\n📋 Lighthouse report saved to: ${reportPath}`);
    
    // Stop Chrome
    await chrome.kill();
  } catch (error) {
    console.error('❌ Error running Lighthouse:', error);
  }
}

// Function to set up performance budget alerts
function setupPerformanceBudgets() {
  console.log('\n📊 Setting up performance budgets...');
  
  const budgetsFilePath = path.join(reportsDir, 'performance-budgets.json');
  
  // Write performance budgets to file
  fs.writeFileSync(budgetsFilePath, JSON.stringify(PERFORMANCE_BUDGETS, null, 2));
  
  console.log(`✅ Performance budgets saved to: ${budgetsFilePath}`);
  console.log('Performance Budgets:');
  console.log(`- Largest Contentful Paint (LCP): ${PERFORMANCE_BUDGETS.LCP}ms`);
  console.log(`- First Input Delay (FID): ${PERFORMANCE_BUDGETS.FID}ms`);
  console.log(`- Cumulative Layout Shift (CLS): ${PERFORMANCE_BUDGETS.CLS}`);
  console.log(`- First Contentful Paint (FCP): ${PERFORMANCE_BUDGETS.FCP}ms`);
  console.log(`- Time to Interactive (TTI): ${PERFORMANCE_BUDGETS.TTI}ms`);
  console.log(`- Time to First Byte (TTFB): ${PERFORMANCE_BUDGETS.TTFB}ms`);
  console.log(`- Bundle Size: ${PERFORMANCE_BUDGETS.BUNDLE_SIZE / 1000} KB`);
}

// Function to create dashboard page
function createDashboardPage() {
  console.log('\n📊 Creating performance dashboard page...');
  
  const pagesDir = path.join(clientSrcDir, 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  const dashboardPagePath = path.join(pagesDir, 'PerformancePage.tsx');
  if (!fs.existsSync(dashboardPagePath)) {
    const dashboardPageContent = `import React from 'react';
import PerformanceDashboard from '../components/performance/PerformanceDashboard';

const PerformancePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Performance Monitoring
      </h1>
      <PerformanceDashboard />
    </div>
  );
};

export default PerformancePage;
`;

    fs.writeFileSync(dashboardPagePath, dashboardPageContent);
    console.log(`✅ Created performance dashboard page at ${dashboardPagePath}`);
  } else {
    console.log(`⚠️ Performance dashboard page already exists at ${dashboardPagePath}`);
  }
  
  // Check if the page is included in routing
  const appTsxPath = path.join(clientSrcDir, 'App.tsx');
  if (fs.existsSync(appTsxPath)) {
    let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    
    if (!appTsxContent.includes('PerformancePage')) {
      console.log('📝 Adding performance page to App.tsx routing...');
      
      // Find the import section
      const lastImport = appTsxContent.lastIndexOf('import');
      const lastImportEnd = appTsxContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add import for PerformancePage
        const perfImport = `import PerformancePage from './pages/PerformancePage';\n`;
        appTsxContent = appTsxContent.slice(0, lastImportEnd + 1) + perfImport + appTsxContent.slice(lastImportEnd + 1);
        
        // Find the Routes or Switch component
        const routesMatch = appTsxContent.match(/<(Routes|Switch)[^>]*>/);
        
        if (routesMatch) {
          const routesEndIndex = appTsxContent.indexOf('>', routesMatch.index) + 1;
          
          // Add performance route
          const perfRoute = `\n        <Route path="/performance" element={<PerformancePage />} />\n      `;
          
          // Check if we need to adjust for different router syntax
          if (routesMatch[1] === 'Switch') {
            const perfRouteSwitch = `\n        <Route path="/performance">\n          <PerformancePage />\n        </Route>\n      `;
            appTsxContent = appTsxContent.slice(0, routesEndIndex) + perfRouteSwitch + appTsxContent.slice(routesEndIndex);
          } else {
            appTsxContent = appTsxContent.slice(0, routesEndIndex) + perfRoute + appTsxContent.slice(routesEndIndex);
          }
          
          fs.writeFileSync(appTsxPath, appTsxContent);
          console.log('✅ Added performance page to routing');
        } else {
          // Try to find wouter usage instead
          const routeMatch = appTsxContent.match(/<Route\s+path/);
          
          if (routeMatch) {
            // Find a good insertion point
            const routeIndex = routeMatch.index;
            const lineStart = appTsxContent.lastIndexOf('\n', routeIndex);
            
            // Add performance route
            const perfRouteWouter = `\n      <Route path="/performance" component={PerformancePage} />\n      `;
            appTsxContent = appTsxContent.slice(0, lineStart) + perfRouteWouter + appTsxContent.slice(lineStart);
            
            fs.writeFileSync(appTsxPath, appTsxContent);
            console.log('✅ Added performance page to wouter routing');
          } else {
            console.log('⚠️ Could not locate Routes or Switch component in App.tsx');
          }
        }
      } else {
        console.log('⚠️ Could not locate import statements in App.tsx');
      }
    } else {
      console.log('⚠️ Performance page already included in App.tsx routing');
    }
  } else {
    console.log(`⚠️ Could not find App.tsx at ${appTsxPath}`);
  }
}

// Main function
async function setupWebVitalsMonitoring() {
  try {
    // 1. Install necessary packages
    await installPackages();
    
    // 2. Set up web vitals tracking in React app
    await setupWebVitalsTracking();
    
    // 3. Set up performance budgets
    setupPerformanceBudgets();
    
    // 4. Create dashboard page
    createDashboardPage();
    
    // 5. Try to run Lighthouse (this may not work in all environments)
    try {
      await runLighthouse();
    } catch (err) {
      console.log('⚠️ Lighthouse could not be run automatically. You can run it manually with:');
      console.log('npx lighthouse http://your-url --only-categories=performance --output=html --output-path=./performance-reports/web-vitals/lighthouse-report.html');
    }

    console.log('\n✨ Web vitals monitoring setup completed!');
    console.log('===============================');
    console.log(`Visit the "/performance" route in your application to view the performance dashboard.`);
    console.log(`Performance reports are located in the "performance-reports/web-vitals" directory.`);
    console.log(`Completed: ${new Date().toISOString()}`);
  } catch (err) {
    console.error('❌ Error setting up web vitals monitoring:', err);
  }
}

// Run the script
setupWebVitalsMonitoring();