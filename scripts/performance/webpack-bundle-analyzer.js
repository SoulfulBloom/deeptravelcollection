/**
 * Webpack Bundle Analyzer Setup for Deep Travel Collections
 * 
 * This script analyzes the bundles produced by Vite/Rollup for size optimization.
 * It generates visual reports showing the size composition of bundles.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const reportsDir = path.join(rootDir, 'performance-reports');
const bundleReportDir = path.join(reportsDir, 'bundle-analysis');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

if (!fs.existsSync(bundleReportDir)) {
  fs.mkdirSync(bundleReportDir, { recursive: true });
}

console.log('===============================');
console.log('| WEBPACK BUNDLE ANALYZER     |');
console.log('===============================');
console.log(`Started: ${new Date().toISOString()}`);

// Format bytes to a human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Generate a stats.json file for the bundle analyzer
async function generateStatsJson() {
  console.log('\n📊 Generating bundle stats...');
  
  try {
    // To make it work with Vite builds, we'll need to use the rollup-plugin-visualizer
    // Check if we need to build the project
    if (!fs.existsSync(path.join(distDir, 'assets'))) {
      console.log('🏗️ No build found. Running build with stats generation...');
      
      // Create a temporary vite config with rollup-plugin-visualizer
      const tempConfigPath = path.join(rootDir, 'vite.stats.config.js');
      
      const configContent = `
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// Import existing config if it exists
let existingConfig = {};
try {
  existingConfig = await import('./vite.optimize.config.js');
  existingConfig = existingConfig.default || {};
} catch (e) {
  try {
    existingConfig = await import('./vite.config.js');
    existingConfig = existingConfig.default || {};
  } catch (e) {
    console.log('Could not import existing configuration, using defaults');
  }
}

// Merge configs
export default defineConfig({
  ...existingConfig,
  plugins: [
    ...(existingConfig.plugins || [react()]),
    visualizer({
      open: false,
      filename: 'performance-reports/bundle-analysis/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
    visualizer({
      open: false,
      filename: 'performance-reports/bundle-analysis/stats.json',
      gzipSize: true,
      brotliSize: true,
      json: true,
    }),
    visualizer({
      open: false,
      filename: 'performance-reports/bundle-analysis/network.html',
      template: 'network',
    }),
    visualizer({
      open: false,
      filename: 'performance-reports/bundle-analysis/sunburst.html',
      template: 'sunburst',
    }),
  ],
  build: {
    ...(existingConfig.build || {}),
    sourcemap: true,
    reportCompressedSize: true,
    rollupOptions: {
      ...(existingConfig.build?.rollupOptions || {}),
      output: {
        ...(existingConfig.build?.rollupOptions?.output || {}),
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui/') || id.includes('class-variance-authority/') ||
                id.includes('tailwind') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('@tanstack/') || id.includes('zod/') || 
                id.includes('drizzle-') || id.includes('openai')) {
              return 'vendor-data';
            }
            return 'vendor';
          }
          if (id.includes('/pages/') || id.includes('/routes/')) {
            return 'pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
        },
      },
    },
  },
});
      `;
      
      // Write the temporary config
      fs.writeFileSync(tempConfigPath, configContent);
      
      console.log('📝 Created temporary Vite config with bundle analysis plugins');
      
      // Build with the temporary config
      execSync(`npx vite build --config ${tempConfigPath}`, {
        stdio: 'inherit',
        cwd: rootDir,
        env: { ...process.env, NODE_ENV: 'production' }
      });
      
      // Clean up the temporary config
      fs.unlinkSync(tempConfigPath);
      console.log('🧹 Removed temporary Vite config');
      
      // Check if stats files were generated
      const statsHtmlPath = path.join(bundleReportDir, 'stats.html');
      const statsJsonPath = path.join(bundleReportDir, 'stats.json');
      
      if (fs.existsSync(statsHtmlPath) && fs.existsSync(statsJsonPath)) {
        console.log('✅ Successfully generated bundle stats');
      } else {
        console.error('❌ Failed to generate bundle stats');
      }
    } else {
      console.log('🏗️ Build already exists. Using the existing build.');
      
      // Generate stats from the existing build
      const assetsDir = path.join(distDir, 'assets');
      const files = fs.readdirSync(assetsDir);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      // Generate a basic stats file
      const stats = {
        timestamp: new Date().toISOString(),
        totalSize: 0,
        chunks: [],
      };
      
      // Analyze each JS file
      for (const file of jsFiles) {
        const filePath = path.join(assetsDir, file);
        const fileSize = fs.statSync(filePath).size;
        stats.totalSize += fileSize;
        
        stats.chunks.push({
          name: file,
          size: fileSize,
          formattedSize: formatBytes(fileSize),
        });
      }
      
      // Sort chunks by size (largest first)
      stats.chunks.sort((a, b) => b.size - a.size);
      
      // Add formatted total size
      stats.formattedTotalSize = formatBytes(stats.totalSize);
      
      // Generate timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
      const statsJsonPath = path.join(bundleReportDir, `stats-${timestamp}.json`);
      
      // Write stats to file
      fs.writeFileSync(statsJsonPath, JSON.stringify(stats, null, 2));
      
      // Generate HTML report
      const htmlReport = generateHtmlReport(stats);
      const htmlReportPath = path.join(bundleReportDir, `report-${timestamp}.html`);
      fs.writeFileSync(htmlReportPath, htmlReport);
      
      console.log(`✅ Generated bundle stats at ${statsJsonPath}`);
      console.log(`✅ Generated HTML report at ${htmlReportPath}`);
    }
    
    // Generate a comparative report if multiple stats files exist
    const statsFiles = fs.readdirSync(bundleReportDir)
      .filter(file => file.startsWith('stats-') && file.endsWith('.json'))
      .sort();
    
    if (statsFiles.length >= 2) {
      console.log('\n📊 Generating comparative bundle report...');
      
      const latestStats = JSON.parse(fs.readFileSync(path.join(bundleReportDir, statsFiles[statsFiles.length - 1])));
      const previousStats = JSON.parse(fs.readFileSync(path.join(bundleReportDir, statsFiles[statsFiles.length - 2])));
      
      const comparativeReport = generateComparativeReport(previousStats, latestStats);
      
      const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
      const comparativeReportPath = path.join(bundleReportDir, `comparative-report-${timestamp}.html`);
      
      fs.writeFileSync(comparativeReportPath, comparativeReport);
      
      console.log(`✅ Generated comparative report at ${comparativeReportPath}`);
    }
    
    console.log('\n📊 Bundle Analysis Summary:');
    const latestStatsFile = fs
      .readdirSync(bundleReportDir)
      .filter(file => file.startsWith('stats-') && file.endsWith('.json'))
      .sort()
      .pop();
    
    if (latestStatsFile) {
      const stats = JSON.parse(fs.readFileSync(path.join(bundleReportDir, latestStatsFile)));
      
      console.log(`Total bundle size: ${stats.formattedTotalSize}`);
      console.log('\nLargest chunks:');
      
      stats.chunks.slice(0, 5).forEach((chunk, index) => {
        console.log(`${index + 1}. ${chunk.name}: ${chunk.formattedSize}`);
      });
    }
  } catch (err) {
    console.error('❌ Error generating bundle stats:', err);
  }
}

// Generate a simple HTML report
function generateHtmlReport(stats) {
  const date = new Date().toLocaleDateString();
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bundle Size Report - ${date}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .metric { font-size: 24px; font-weight: bold; margin: 20px 0; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f8fafc; }
    .progress-bar { height: 20px; background-color: #e5e7eb; border-radius: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background-color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Bundle Size Report</h1>
  <p>Generated on: ${stats.timestamp}</p>
  
  <h2>Overview</h2>
  <div class="metric">Total Bundle Size: ${stats.formattedTotalSize}</div>
  
  <h2>Chunk Breakdown</h2>
  <table>
    <tr>
      <th>Chunk</th>
      <th>Size</th>
      <th>Percentage</th>
      <th>Visualization</th>
    </tr>
    ${stats.chunks.map(chunk => {
      const percentage = (chunk.size / stats.totalSize * 100).toFixed(2);
      return `
        <tr>
          <td>${chunk.name}</td>
          <td>${chunk.formattedSize}</td>
          <td>${percentage}%</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
          </td>
        </tr>
      `;
    }).join('')}
  </table>
  
  <h2>Recommendations</h2>
  <ul>
    ${stats.totalSize > 1000000 ? '<li>The total bundle size is over 1MB. Consider applying code splitting to reduce initial load time.</li>' : ''}
    ${stats.chunks.length === 1 ? '<li>No code splitting detected. Using React.lazy() with dynamic imports can improve initial load time.</li>' : ''}
    ${stats.chunks.some(chunk => chunk.name.includes('vendor') && chunk.size > 500000) ? '<li>Large vendor chunk detected. Consider splitting vendor libraries or using tree-shaking.</li>' : ''}
  </ul>
  
  <h2>Raw Data</h2>
  <pre>${JSON.stringify(stats, null, 2)}</pre>

  <script>
    // Add any interactive features here
  </script>
</body>
</html>
  `;
}

// Generate a comparative report
function generateComparativeReport(previousStats, latestStats) {
  const date = new Date().toLocaleDateString();
  const sizeDifference = latestStats.totalSize - previousStats.totalSize;
  const percentChange = (sizeDifference / previousStats.totalSize * 100).toFixed(2);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bundle Size Comparison - ${date}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .metric { font-size: 24px; font-weight: bold; margin: 20px 0; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f8fafc; }
    .positive { color: green; }
    .negative { color: red; }
    .progress-bar { height: 20px; background-color: #e5e7eb; border-radius: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background-color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Bundle Size Comparison Report</h1>
  <p>Generated on: ${latestStats.timestamp}</p>
  
  <h2>Overview</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Previous Build</th>
      <th>Current Build</th>
      <th>Change</th>
    </tr>
    <tr>
      <td>Total Bundle Size</td>
      <td>${formatBytes(previousStats.totalSize)}</td>
      <td>${formatBytes(latestStats.totalSize)}</td>
      <td class="${sizeDifference < 0 ? 'positive' : 'negative'}">
        ${sizeDifference < 0 ? '▼' : '▲'} ${formatBytes(Math.abs(sizeDifference))} (${percentChange}%)
      </td>
    </tr>
    <tr>
      <td>Number of Chunks</td>
      <td>${previousStats.chunks.length}</td>
      <td>${latestStats.chunks.length}</td>
      <td class="${latestStats.chunks.length > previousStats.chunks.length ? 'positive' : 'negative'}">
        ${latestStats.chunks.length - previousStats.chunks.length}
      </td>
    </tr>
  </table>
  
  <h2>Chunk Comparison</h2>
  <table>
    <tr>
      <th>Chunk</th>
      <th>Previous Size</th>
      <th>Current Size</th>
      <th>Change</th>
    </tr>
    ${latestStats.chunks.map(chunk => {
      const previousChunk = previousStats.chunks.find(c => c.name === chunk.name);
      if (previousChunk) {
        const diff = chunk.size - previousChunk.size;
        const percentDiff = (diff / previousChunk.size * 100).toFixed(2);
        return `
          <tr>
            <td>${chunk.name}</td>
            <td>${previousChunk.formattedSize}</td>
            <td>${chunk.formattedSize}</td>
            <td class="${diff < 0 ? 'positive' : 'negative'}">
              ${diff < 0 ? '▼' : '▲'} ${formatBytes(Math.abs(diff))} (${percentDiff}%)
            </td>
          </tr>
        `;
      } else {
        return `
          <tr>
            <td>${chunk.name}</td>
            <td>N/A (New)</td>
            <td>${chunk.formattedSize}</td>
            <td class="positive">New chunk</td>
          </tr>
        `;
      }
    }).join('')}
    ${previousStats.chunks
      .filter(chunk => !latestStats.chunks.some(c => c.name === chunk.name))
      .map(chunk => `
        <tr>
          <td>${chunk.name}</td>
          <td>${chunk.formattedSize}</td>
          <td>N/A (Removed)</td>
          <td class="positive">Removed</td>
        </tr>
      `).join('')}
  </table>
  
  <h2>Conclusion</h2>
  <div>
    ${sizeDifference < 0 
      ? `<p class="positive">Bundle size reduced by ${formatBytes(Math.abs(sizeDifference))} (${Math.abs(percentChange)}%). Good job!</p>` 
      : `<p class="${Math.abs(percentChange) < 1 ? '' : 'negative'}">Bundle size increased by ${formatBytes(sizeDifference)} (${percentChange}%).</p>`}
    
    ${latestStats.chunks.length > previousStats.chunks.length 
      ? `<p class="positive">Number of chunks increased from ${previousStats.chunks.length} to ${latestStats.chunks.length}, which may indicate better code splitting.</p>`
      : latestStats.chunks.length < previousStats.chunks.length
        ? `<p class="negative">Number of chunks decreased from ${previousStats.chunks.length} to ${latestStats.chunks.length}, which may indicate less code splitting.</p>`
        : `<p>Number of chunks remained the same at ${latestStats.chunks.length}.</p>`}
  </div>

  <script>
    // Add any interactive features here
  </script>
</body>
</html>
  `;
}

// Main function
async function analyzeBundles() {
  await generateStatsJson();

  console.log('\n✨ Bundle analysis completed!');
  console.log('===============================');
  console.log('Analysis reports are located in the "performance-reports/bundle-analysis" directory.');
  console.log(`Completed: ${new Date().toISOString()}`);
}

// Run the script
analyzeBundles().catch(err => {
  console.error('Error analyzing bundles:', err);
  process.exit(1);
});