import { Router } from 'express';
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
    const metricsFilePath = path.join(reportsDir, `metrics-${today}.json`);
    
    let allMetrics = [];
    if (fs.existsSync(metricsFilePath)) {
      const metricsData = fs.readFileSync(metricsFilePath, 'utf8');
      try {
        allMetrics = JSON.parse(metricsData);
      } catch (e) {
        console.error('Error parsing metrics file:', e);
        // If file is corrupt, start with an empty array
      }
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
      return res.json({ metrics: [], averages: {}, passRates: {} });
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
        try {
          const metrics = JSON.parse(fileData);
          allMetrics = [...allMetrics, ...metrics];
        } catch (e) {
          console.error(`Error parsing metrics file ${file}:`, e);
          // Skip corrupt files
        }
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
 * Run performance tools
 */
router.post('/run-tool', async (req, res) => {
  try {
    const { tool } = req.body;
    
    if (!tool) {
      return res.status(400).json({ error: 'Tool name is required' });
    }
    
    let command = '';
    switch (tool) {
      case 'bundle-analyzer':
        command = 'node scripts/performance/webpack-bundle-analyzer.js';
        break;
      case 'web-vitals':
        command = 'node scripts/performance/web-vitals-monitoring.js';
        break;
      case 'network':
        command = 'node scripts/performance/network-monitor.js';
        break;
      case 'runtime':
        command = 'node scripts/performance/runtime-monitor.js';
        break;
      case 'all':
        command = 'node scripts/performance-dashboard.js';
        break;
      default:
        return res.status(400).json({ error: 'Invalid tool name' });
    }
    
    // Execute command (in a real implementation, we'd use child_process properly)
    // This is just a placeholder as we'd need proper handling for long-running processes
    res.json({ success: true, message: `Executing ${tool} tool` });
    
    // In a real implementation, we'd start the command here as a background process
    // And potentially track its progress
    
  } catch (error) {
    console.error('Error running performance tool:', error);
    res.status(500).json({ error: 'Failed to run performance tool' });
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
    try {
      const metrics = JSON.parse(fileData);
      allMetrics = [...allMetrics, ...metrics];
    } catch (e) {
      console.error(`Error parsing metrics file ${file}:`, e);
      // Skip corrupt files
    }
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
  return `<!DOCTYPE html>
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
  <p>Generated on: ${new Date().toISOString()}</p>
  
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
    ${Object.entries(averages).map(([date, metrics]) => `
      <tr>
        <td>${date}</td>
        <td class="${getPerformanceClass(metrics.LCP, 2500)}">${metrics.LCP || '-'}</td>
        <td class="${getPerformanceClass(metrics.FID, 100)}">${metrics.FID || '-'}</td>
        <td class="${getPerformanceClass(metrics.CLS, 0.1, true)}">${metrics.CLS || '-'}</td>
        <td class="${getPerformanceClass(metrics.FCP, 1800)}">${metrics.FCP || '-'}</td>
        <td class="${getPerformanceClass(metrics.TTFB, 800)}">${metrics.TTFB || '-'}</td>
      </tr>
    `).join('')}
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
      <td>${getLatestAverage('LCP', averages)}ms</td>
      <td class="${getStatusClass('LCP', 2500, averages)}">
        ${getStatusText('LCP', 2500, averages)}
      </td>
    </tr>
    <tr>
      <td>First Input Delay (FID)</td>
      <td>100ms</td>
      <td>${getLatestAverage('FID', averages)}ms</td>
      <td class="${getStatusClass('FID', 100, averages)}">
        ${getStatusText('FID', 100, averages)}
      </td>
    </tr>
    <tr>
      <td>Cumulative Layout Shift (CLS)</td>
      <td>0.1</td>
      <td>${getLatestAverage('CLS', averages)}</td>
      <td class="${getStatusClass('CLS', 0.1, averages, true)}">
        ${getStatusText('CLS', 0.1, averages, true)}
      </td>
    </tr>
    <tr>
      <td>First Contentful Paint (FCP)</td>
      <td>1800ms</td>
      <td>${getLatestAverage('FCP', averages)}ms</td>
      <td class="${getStatusClass('FCP', 1800, averages)}">
        ${getStatusText('FCP', 1800, averages)}
      </td>
    </tr>
    <tr>
      <td>Time to First Byte (TTFB)</td>
      <td>800ms</td>
      <td>${getLatestAverage('TTFB', averages)}ms</td>
      <td class="${getStatusClass('TTFB', 800, averages)}">
        ${getStatusText('TTFB', 800, averages)}
      </td>
    </tr>
  </table>
  
  <h2>Recommendations</h2>
  <ul>
    ${getRecommendations(averages).map(rec => `<li>${rec}</li>`).join('')}
  </ul>
  
  <script>
    // Chart.js setup
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Prepare data for chart
    const dates = ${JSON.stringify(Object.keys(averages))};
    
    const lcpData = dates.map(date => ({ x: date, y: ${JSON.stringify(averages)}[date].LCP || null }));
    const fidData = dates.map(date => ({ x: date, y: ${JSON.stringify(averages)}[date].FID || null }));
    const clsData = dates.map(date => ({ x: date, y: ${JSON.stringify(averages)}[date].CLS || null }));
    const fcpData = dates.map(date => ({ x: date, y: ${JSON.stringify(averages)}[date].FCP || null }));
    const ttfbData = dates.map(date => ({ x: date, y: ${JSON.stringify(averages)}[date].TTFB || null }));
    
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
  `;
  
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