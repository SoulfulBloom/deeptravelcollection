/**
 * Runtime Performance Monitoring for Deep Travel Collections
 * 
 * This script sets up runtime monitoring to track JavaScript execution time,
 * long tasks, and memory usage.
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
const runtimeDir = path.join(reportsDir, 'runtime');
const clientDir = path.join(rootDir, 'client');
const clientSrcDir = path.join(clientDir, 'src');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

if (!fs.existsSync(runtimeDir)) {
  fs.mkdirSync(runtimeDir, { recursive: true });
}

console.log('===============================');
console.log('| RUNTIME PERFORMANCE MONITOR |');
console.log('===============================');
console.log(`Started: ${new Date().toISOString()}`);

// Function to set up runtime monitoring
async function setupRuntimeMonitoring() {
  console.log('\n🔧 Setting up runtime performance monitoring...');
  
  // Create utility for runtime performance monitoring
  const runtimeUtilPath = path.join(clientSrcDir, 'utils', 'runtime-monitor.ts');
  const runtimeUtilDir = path.dirname(runtimeUtilPath);
  
  if (!fs.existsSync(runtimeUtilDir)) {
    fs.mkdirSync(runtimeUtilDir, { recursive: true });
  }
  
  if (!fs.existsSync(runtimeUtilPath)) {
    const runtimeUtilContent = `/**
 * Runtime Performance Monitoring Utility
 * 
 * This utility provides tools to monitor runtime performance for:
 * - JavaScript execution time
 * - Long tasks detection
 * - Memory usage tracking
 * - Frame rate monitoring
 */

// Define types for runtime metrics
interface RuntimeMetric {
  name: string;
  startTime: number;
  duration: number;
  timestamp: string;
}

interface LongTask {
  startTime: number;
  duration: number;
  url?: string;
  attribution?: string;
}

interface MemoryInfo {
  timestamp: string;
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  memoryUsage?: number;
}

interface FrameRateInfo {
  timestamp: string;
  fps: number;
}

interface ComponentProfile {
  componentName: string;
  renderCount: number;
  totalRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  avgRenderTime: number;
  lastRenderTimestamp: string;
}

// Define a global window property
declare global {
  interface Window {
    runtimeMetrics?: {
      longTasks: LongTask[];
      memoryInfo: MemoryInfo[];
      frameRates: FrameRateInfo[];
      functions: {
        [key: string]: {
          count: number;
          totalTime: number;
          maxTime: number;
          minTime: number;
        };
      };
      components: {
        [key: string]: ComponentProfile;
      };
      stats: {
        longTasksCount: number;
        totalBlockingTime: number;
        avgFrameRate: number;
        minFrameRate: number;
        maxMemoryUsage: number;
      };
    };
    runtimeMonitor?: any;
    __RUNTIME_MONITORING_INITIALIZED__?: boolean;
  }
  
  interface Performance {
    memory?: {
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
      usedJSHeapSize: number;
    };
  }
}

// Initialize metrics object on window
export function initRuntimeMetrics() {
  if (typeof window !== 'undefined') {
    window.runtimeMetrics = {
      longTasks: [],
      memoryInfo: [],
      frameRates: [],
      functions: {},
      components: {},
      stats: {
        longTasksCount: 0,
        totalBlockingTime: 0,
        avgFrameRate: 0,
        minFrameRate: 60,
        maxMemoryUsage: 0
      }
    };
  }
}

// Constants
const LONG_TASK_THRESHOLD = 50; // 50ms

/**
 * Initialize long tasks monitoring
 */
export function monitorLongTasks() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return;
  }
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        if (entry.entryType === 'longtask') {
          const taskDuration = entry.duration;
          
          // Only track tasks longer than the threshold
          if (taskDuration >= LONG_TASK_THRESHOLD) {
            const longTask = {
              startTime: entry.startTime,
              duration: taskDuration,
              url: window.location.href
            };
            
            if (window.runtimeMetrics) {
              window.runtimeMetrics.longTasks.push(longTask);
              window.runtimeMetrics.stats.longTasksCount++;
              
              // Total Blocking Time = sum of (task duration - 50ms) for all tasks > 50ms
              window.runtimeMetrics.stats.totalBlockingTime += (taskDuration - 50);
              
              // If we have too many long tasks, keep only the most recent ones
              if (window.runtimeMetrics.longTasks.length > 100) {
                window.runtimeMetrics.longTasks = window.runtimeMetrics.longTasks.slice(-100);
              }
            }
            
            // Log long tasks in development
            if (process.env.NODE_ENV === 'development' && taskDuration > 100) {
              console.warn(\`Long task detected: \${taskDuration.toFixed(2)}ms\`);
            }
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    console.log('Long tasks monitoring initialized');
  } catch (e) {
    console.error('Failed to initialize long tasks monitoring:', e);
  }
}

/**
 * Monitor memory usage
 */
export function monitorMemoryUsage(intervalMs: number = 10000) {
  if (typeof window === 'undefined' || !window.performance || !window.performance.memory) {
    return;
  }
  
  const trackMemoryUsage = () => {
    try {
      const memory = window.performance.memory;
      
      if (memory) {
        const timestamp = new Date().toISOString();
        const memoryInfo: MemoryInfo = {
          timestamp,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          totalJSHeapSize: memory.totalJSHeapSize,
          usedJSHeapSize: memory.usedJSHeapSize,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
        };
        
        if (window.runtimeMetrics) {
          window.runtimeMetrics.memoryInfo.push(memoryInfo);
          
          // Update max memory usage
          if (memoryInfo.memoryUsage) {
            window.runtimeMetrics.stats.maxMemoryUsage = Math.max(
              window.runtimeMetrics.stats.maxMemoryUsage,
              memoryInfo.memoryUsage
            );
          }
          
          // Keep only the most recent memory info entries
          if (window.runtimeMetrics.memoryInfo.length > 100) {
            window.runtimeMetrics.memoryInfo = window.runtimeMetrics.memoryInfo.slice(-100);
          }
        }
      }
    } catch (e) {
      console.error('Error tracking memory usage:', e);
    }
  };
  
  // Track immediately and then at intervals
  trackMemoryUsage();
  const intervalId = setInterval(trackMemoryUsage, intervalMs);
  
  console.log('Memory usage monitoring initialized');
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}

/**
 * Monitor frame rate
 */
export function monitorFrameRate() {
  if (typeof window === 'undefined' || !window.requestAnimationFrame) {
    return;
  }
  
  let frames = 0;
  let lastTime = performance.now();
  let frameRateUpdateInterval: number | null = null;
  
  const countFrame = () => {
    frames++;
    window.requestAnimationFrame(countFrame);
  };
  
  const calculateFPS = () => {
    const now = performance.now();
    const elapsed = now - lastTime;
    const fps = Math.round((frames * 1000) / elapsed);
    
    if (window.runtimeMetrics) {
      const frameRateInfo: FrameRateInfo = {
        timestamp: new Date().toISOString(),
        fps
      };
      
      window.runtimeMetrics.frameRates.push(frameRateInfo);
      
      // Update average frame rate
      const count = window.runtimeMetrics.frameRates.length;
      const totalFps = window.runtimeMetrics.frameRates.reduce((sum, info) => sum + info.fps, 0);
      window.runtimeMetrics.stats.avgFrameRate = Math.round(totalFps / count);
      
      // Update min frame rate
      window.runtimeMetrics.stats.minFrameRate = Math.min(
        window.runtimeMetrics.stats.minFrameRate,
        fps
      );
      
      // Keep only the most recent frame rate entries
      if (window.runtimeMetrics.frameRates.length > 100) {
        window.runtimeMetrics.frameRates = window.runtimeMetrics.frameRates.slice(-100);
      }
      
      // Log frame drops in development
      if (process.env.NODE_ENV === 'development' && fps < 30) {
        console.warn(\`Low frame rate detected: \${fps} FPS\`);
      }
    }
    
    frames = 0;
    lastTime = now;
  };
  
  // Start counting frames
  window.requestAnimationFrame(countFrame);
  
  // Calculate FPS every second
  frameRateUpdateInterval = window.setInterval(calculateFPS, 1000);
  
  console.log('Frame rate monitoring initialized');
  
  // Return cleanup function
  return () => {
    if (frameRateUpdateInterval !== null) {
      clearInterval(frameRateUpdateInterval);
    }
  };
}

/**
 * Create a function performance wrapper
 */
export function measureFunction<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  if (typeof window === 'undefined') return fn;
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    
    // If result is a Promise, measure when it resolves
    if (result instanceof Promise) {
      return result.then((value) => {
        const end = performance.now();
        const duration = end - start;
        
        recordFunctionPerformance(name, duration);
        
        return value;
      }) as ReturnType<T>;
    }
    
    // For synchronous functions
    const end = performance.now();
    const duration = end - start;
    
    recordFunctionPerformance(name, duration);
    
    return result;
  }) as T;
}

/**
 * Record function performance metrics
 */
function recordFunctionPerformance(name: string, duration: number) {
  if (typeof window === 'undefined' || !window.runtimeMetrics) return;
  
  window.runtimeMetrics.functions = window.runtimeMetrics.functions || {};
  
  if (!window.runtimeMetrics.functions[name]) {
    window.runtimeMetrics.functions[name] = {
      count: 0,
      totalTime: 0,
      maxTime: 0,
      minTime: Infinity
    };
  }
  
  const stats = window.runtimeMetrics.functions[name];
  stats.count++;
  stats.totalTime += duration;
  stats.maxTime = Math.max(stats.maxTime, duration);
  stats.minTime = Math.min(stats.minTime, duration);
  
  // Log slow function calls in development
  if (process.env.NODE_ENV === 'development' && duration > 100) {
    console.warn(\`Slow function call: \${name} took \${duration.toFixed(2)}ms\`);
  }
}

/**
 * Higher-order component to measure React component render time
 */
export function withPerformanceTracking<P>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  // Return a wrapped component
  const WrappedComponent: React.FC<P> = (props) => {
    // Using React hooks for performance measurement
    const React = require('react');
    const { useRef, useEffect } = React;
    
    // Ref to store render start time
    const renderStartTimeRef = useRef<number>(0);
    
    // Set render start time before render
    renderStartTimeRef.current = performance.now();
    
    // Measure render time after component has rendered
    useEffect(() => {
      const renderEndTime = performance.now();
      const renderDuration = renderEndTime - renderStartTimeRef.current;
      
      // Record component performance
      recordComponentPerformance(componentName, renderDuration);
    });
    
    // Render the original component
    return <Component {...props} />;
  };
  
  // Set display name for debugging
  WrappedComponent.displayName = \`withPerformanceTracking(\${componentName})\`;
  
  return WrappedComponent;
}

/**
 * Record component performance metrics
 */
function recordComponentPerformance(componentName: string, renderDuration: number) {
  if (typeof window === 'undefined' || !window.runtimeMetrics) return;
  
  window.runtimeMetrics.components = window.runtimeMetrics.components || {};
  
  if (!window.runtimeMetrics.components[componentName]) {
    window.runtimeMetrics.components[componentName] = {
      componentName,
      renderCount: 0,
      totalRenderTime: 0,
      maxRenderTime: 0,
      minRenderTime: Infinity,
      avgRenderTime: 0,
      lastRenderTimestamp: new Date().toISOString()
    };
  }
  
  const stats = window.runtimeMetrics.components[componentName];
  stats.renderCount++;
  stats.totalRenderTime += renderDuration;
  stats.maxRenderTime = Math.max(stats.maxRenderTime, renderDuration);
  stats.minRenderTime = Math.min(stats.minRenderTime, renderDuration);
  stats.avgRenderTime = stats.totalRenderTime / stats.renderCount;
  stats.lastRenderTimestamp = new Date().toISOString();
  
  // Log slow renders in development
  if (process.env.NODE_ENV === 'development' && renderDuration > 16) {
    console.warn(\`Slow render in component \${componentName}: \${renderDuration.toFixed(2)}ms\`);
  }
}

/**
 * Generate a performance report
 */
export function generatePerformanceReport() {
  if (typeof window === 'undefined' || !window.runtimeMetrics) {
    return 'No runtime metrics available';
  }
  
  const { longTasks, memoryInfo, frameRates, functions, components, stats } = window.runtimeMetrics;
  
  // Sort components by average render time (slowest first)
  const sortedComponents = Object.values(components || {})
    .sort((a, b) => b.avgRenderTime - a.avgRenderTime);
  
  // Sort functions by average execution time (slowest first)
  const sortedFunctions = Object.entries(functions || {})
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      totalTime: stats.totalTime,
      avgTime: stats.totalTime / stats.count,
      maxTime: stats.maxTime,
      minTime: stats.minTime
    }))
    .sort((a, b) => b.avgTime - a.avgTime);
  
  // Format memory sizes
  const formatBytes = (bytes?: number) => {
    if (bytes === undefined) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return \`\${mb.toFixed(2)} MB\`;
  };
  
  return \`
    <div style="font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 10px;">Runtime Performance Report</h1>
      <p style="margin-bottom: 20px;">Generated on: \${new Date().toISOString()}</p>
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Performance Summary</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Long Tasks</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px; \${stats.longTasksCount > 10 ? 'color: #dc2626;' : stats.longTasksCount > 5 ? 'color: #ca8a04;' : ''}">\${stats.longTasksCount}</div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Total Blocking Time</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px; \${stats.totalBlockingTime > 300 ? 'color: #dc2626;' : stats.totalBlockingTime > 100 ? 'color: #ca8a04;' : ''}">\${stats.totalBlockingTime.toFixed(0)} ms</div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Average Frame Rate</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px; \${stats.avgFrameRate < 30 ? 'color: #dc2626;' : stats.avgFrameRate < 50 ? 'color: #ca8a04;' : ''}">\${stats.avgFrameRate} FPS</div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px;">
          <div style="font-size: 14px; color: #64748b;">Max Memory Usage</div>
          <div style="font-size: 24px; font-weight: bold; margin-top: 5px; \${stats.maxMemoryUsage > 0.8 ? 'color: #dc2626;' : stats.maxMemoryUsage > 0.6 ? 'color: #ca8a04;' : ''}">\${(stats.maxMemoryUsage * 100).toFixed(0)}%</div>
        </div>
      </div>
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Slow Components</h2>
      \${sortedComponents.length > 0 ? \`
        <div style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Component</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Renders</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Avg Render Time</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Max Render Time</th>
              </tr>
            </thead>
            <tbody>
              \${sortedComponents.slice(0, 10).map((comp, index) => \`
                <tr style="\${index % 2 === 0 ? '' : 'background-color: #f1f5f9;'}">
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${comp.componentName}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${comp.renderCount}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; \${comp.avgRenderTime > 16 ? 'color: #dc2626;' : comp.avgRenderTime > 8 ? 'color: #ca8a04;' : ''}">\${comp.avgRenderTime.toFixed(2)} ms</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; \${comp.maxRenderTime > 50 ? 'color: #dc2626;' : comp.maxRenderTime > 16 ? 'color: #ca8a04;' : ''}">\${comp.maxRenderTime.toFixed(2)} ms</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \` : '<p>No component render metrics available</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Slow Functions</h2>
      \${sortedFunctions.length > 0 ? \`
        <div style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Function</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Calls</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Avg Time</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Max Time</th>
              </tr>
            </thead>
            <tbody>
              \${sortedFunctions.slice(0, 10).map((func, index) => \`
                <tr style="\${index % 2 === 0 ? '' : 'background-color: #f1f5f9;'}">
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${func.name}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${func.count}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; \${func.avgTime > 100 ? 'color: #dc2626;' : func.avgTime > 50 ? 'color: #ca8a04;' : ''}">\${func.avgTime.toFixed(2)} ms</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; \${func.maxTime > 200 ? 'color: #dc2626;' : func.maxTime > 100 ? 'color: #ca8a04;' : ''}">\${func.maxTime.toFixed(2)} ms</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \` : '<p>No function performance metrics available</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Long Tasks</h2>
      \${longTasks.length > 0 ? \`
        <div style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Start Time</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Duration</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">URL</th>
              </tr>
            </thead>
            <tbody>
              \${longTasks.slice(0, 10).map((task, index) => \`
                <tr style="\${index % 2 === 0 ? '' : 'background-color: #f1f5f9;'}">
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${task.startTime.toFixed(0)} ms</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; \${task.duration > 200 ? 'color: #dc2626;' : task.duration > 100 ? 'color: #ca8a04;' : ''}">\${task.duration.toFixed(2)} ms</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${task.url || 'N/A'}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \` : '<p>No long tasks detected</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Memory Usage</h2>
      \${memoryInfo.length > 0 ? \`
        <div style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Time</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Used Heap</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Total Heap</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Heap Limit</th>
                <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Usage</th>
              </tr>
            </thead>
            <tbody>
              \${memoryInfo.slice(-5).map((info, index) => \`
                <tr style="\${index % 2 === 0 ? '' : 'background-color: #f1f5f9;'}">
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${new Date(info.timestamp).toLocaleTimeString()}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${formatBytes(info.usedJSHeapSize)}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${formatBytes(info.totalJSHeapSize)}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">\${formatBytes(info.jsHeapSizeLimit)}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; \${info.memoryUsage && info.memoryUsage > 0.8 ? 'color: #dc2626;' : info.memoryUsage && info.memoryUsage > 0.6 ? 'color: #ca8a04;' : ''}">\${info.memoryUsage ? (info.memoryUsage * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \` : '<p>No memory usage data available</p>'}
      
      <h2 style="color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Recommendations</h2>
      <ul style="margin-top: 10px; margin-bottom: 20px;">
        \${stats.longTasksCount > 10 ? '<li>There are many long tasks (' + stats.longTasksCount + ') blocking the main thread. Consider breaking up long operations using Web Workers or chunking work.</li>' : ''}
        \${stats.totalBlockingTime > 300 ? '<li>High total blocking time (' + stats.totalBlockingTime.toFixed(0) + 'ms). This can lead to poor user experience and input delay.</li>' : ''}
        \${stats.avgFrameRate < 30 ? '<li>Low average frame rate (' + stats.avgFrameRate + ' FPS). Consider optimizing animations and reducing layout thrashing.</li>' : ''}
        \${stats.maxMemoryUsage > 0.8 ? '<li>High memory usage (over ' + (stats.maxMemoryUsage * 100).toFixed(0) + '%). Check for memory leaks or reduce the size of cached data.</li>' : ''}
        \${sortedComponents.length > 0 && sortedComponents[0].avgRenderTime > 16 ? '<li>Component "' + sortedComponents[0].componentName + '" has high render times (' + sortedComponents[0].avgRenderTime.toFixed(2) + 'ms). Consider memoization or code splitting.</li>' : ''}
        \${sortedFunctions.length > 0 && sortedFunctions[0].avgTime > 100 ? '<li>Function "' + sortedFunctions[0].name + '" is slow (' + sortedFunctions[0].avgTime.toFixed(2) + 'ms). Consider optimizing or making it asynchronous.</li>' : ''}
        \${stats.longTasksCount <= 5 && stats.totalBlockingTime <= 100 && stats.avgFrameRate >= 50 && stats.maxMemoryUsage <= 0.6 ? '<li>Overall runtime performance is good. Keep up the good work!</li>' : ''}
      </ul>
    </div>
  \`;
}

/**
 * Save runtime metrics to server
 */
export function saveRuntimeMetrics() {
  if (typeof window === 'undefined' || !window.runtimeMetrics) {
    return Promise.reject('No runtime metrics available');
  }
  
  return fetch('/api/runtime-performance/metrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...window.runtimeMetrics,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })
  });
}

/**
 * Initialize all runtime monitoring
 */
let cleanupFunctions: Array<() => void> = [];

export function initRuntimeMonitoring() {
  if (typeof window !== 'undefined' && !window.__RUNTIME_MONITORING_INITIALIZED__) {
    console.log('Initializing runtime performance monitoring...');
    window.__RUNTIME_MONITORING_INITIALIZED__ = true;
    
    // Initialize metrics object
    initRuntimeMetrics();
    
    // Start monitoring
    monitorLongTasks();
    
    // Start memory monitoring and save cleanup function
    const memoryCleanup = monitorMemoryUsage();
    if (memoryCleanup) cleanupFunctions.push(memoryCleanup);
    
    // Start frame rate monitoring and save cleanup function
    const frameRateCleanup = monitorFrameRate();
    if (frameRateCleanup) cleanupFunctions.push(frameRateCleanup);
    
    // Set up periodic saving of metrics
    const saveInterval = setInterval(() => {
      if (typeof window.runtimeMetrics !== 'undefined') {
        saveRuntimeMetrics().catch(err => {
          console.error('Failed to save runtime metrics:', err);
        });
      }
    }, 60000); // Save every minute
    
    cleanupFunctions.push(() => clearInterval(saveInterval));
    
    // Save metrics before unload
    window.addEventListener('beforeunload', () => {
      saveRuntimeMetrics().catch(() => {
        // Ignore errors during unload
      });
    });
    
    // Add monitoring object to window for debugging
    window.runtimeMonitor = {
      metrics: window.runtimeMetrics,
      measureFunction,
      withPerformanceTracking,
      generateReport: generatePerformanceReport
    };
    
    console.log('Runtime performance monitoring initialized');
  }
  
  // Return function to clean up all monitoring
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
    cleanupFunctions = [];
    
    if (typeof window !== 'undefined') {
      window.__RUNTIME_MONITORING_INITIALIZED__ = false;
    }
  };
}
`;

    fs.writeFileSync(runtimeUtilPath, runtimeUtilContent);
    console.log(`✅ Created runtime monitoring utility at ${runtimeUtilPath}`);
  } else {
    console.log(`⚠️ Runtime monitoring utility already exists at ${runtimeUtilPath}`);
  }
  
  // Create API endpoint for runtime performance
  const apiDir = path.join(rootDir, 'server', 'routes');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  const runtimeRouteFile = path.join(apiDir, 'runtime-performance.ts');
  if (!fs.existsSync(runtimeRouteFile)) {
    const runtimeRouteContent = `import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const reportsDir = path.join(__dirname, '../../performance-reports/runtime');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

/**
 * Save runtime performance metrics from client
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
    const filePath = path.join(reportsDir, \`runtime-metrics-\${timestamp}.json\`);
    
    // Save metrics
    fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));
    
    res.status(200).json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error storing runtime metrics:', error);
    res.status(500).json({ error: 'Failed to store metrics' });
  }
});

/**
 * Get runtime performance report
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
  <title>Runtime Performance Report</title>
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
  <h1>Runtime Performance Report</h1>
  <p>Generated on: \${new Date().toISOString()}</p>
  
  <div id="loading">Loading runtime metrics...</div>
  <div id="error" style="display: none; color: #dc2626;"></div>
  <div id="report-container" style="display: none;"></div>
  
  <script>
    // Function to load client-side runtime metrics
    async function loadRuntimeReport() {
      try {
        // Check if window.runtimeMetrics exists in the main window
        if (window.opener && window.opener.runtimeMonitor) {
          // Use metrics from opener window (if opened from main app)
          const report = window.opener.runtimeMonitor.generateReport();
          document.getElementById('loading').style.display = 'none';
          document.getElementById('report-container').style.display = 'block';
          document.getElementById('report-container').innerHTML = report;
        } else {
          // Otherwise, try to generate a report from any saved data
          const reportResponse = await fetch('/api/runtime-performance/saved-reports');
          
          if (reportResponse.ok) {
            const reports = await reportResponse.json();
            generateReportFromSaved(reports);
          } else {
            showNoDataMessage();
          }
        }
      } catch (error) {
        console.error('Error loading runtime metrics:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'Error loading runtime metrics: ' + error.message;
      }
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
              <a href="/api/runtime-performance/report/\${report.id}" target="_blank">
                \${new Date(report.timestamp).toLocaleString()} - \${report.url || 'Unknown page'}
              </a>
            </li>
          \`).join('')}
        </ul>
        
        <p>
          Note: To generate a new report, visit your application and interact with it 
          while the runtime monitoring is active, then return here to see the results.
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
          <h2 style="margin-top: 0;">No Runtime Metrics Available</h2>
          <p>
            Runtime metrics haven't been collected yet. To collect metrics:
          </p>
          <ol style="text-align: left; display: inline-block;">
            <li>Make sure runtime monitoring is initialized in your application</li>
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
    
    // Load runtime report when page loads
    window.addEventListener('DOMContentLoaded', loadRuntimeReport);
  </script>
</body>
</html>
    \`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(reportHtml);
  } catch (error) {
    console.error('Error generating runtime report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * Get a list of saved runtime reports
 */
router.get('/saved-reports', async (req, res) => {
  try {
    const files = fs.readdirSync(reportsDir)
      .filter(file => file.startsWith('runtime-metrics-') && file.endsWith('.json'))
      .sort();
    
    const reports = [];
    
    for (const file of files) {
      const filePath = path.join(reportsDir, file);
      const timestamp = file.replace('runtime-metrics-', '').replace('.json', '');
      
      try {
        const fileStats = fs.statSync(filePath);
        const reportData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        reports.push({
          id: file,
          timestamp: new Date(timestamp.replace(/-/g, ':')).toISOString(),
          size: fileStats.size,
          url: reportData.url || '',
          stats: reportData.stats || {}
        });
      } catch (err) {
        console.error(\`Error reading report file \${file}:\`, err);
      }
    }
    
    res.json(reports);
  } catch (error) {
    console.error('Error retrieving runtime reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

/**
 * Get a specific saved runtime report
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
  <title>Runtime Performance Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { color: #4338ca; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
  </style>
</head>
<body>
  <h1>Runtime Performance Report</h1>
  <p>Generated on: \${reportData.timestamp || new Date().toISOString()}</p>
  <p>URL: \${reportData.url || 'Unknown'}</p>
  
  <h2>Raw Report Data</h2>
  <pre>\${JSON.stringify(reportData, null, 2)}</pre>
</body>
</html>
    \`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(reportHtml);
  } catch (error) {
    console.error('Error retrieving runtime report:', error);
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
});

export default router;
`;

    fs.writeFileSync(runtimeRouteFile, runtimeRouteContent);
    console.log(`✅ Created runtime performance route at ${runtimeRouteFile}`);
  } else {
    console.log(`⚠️ Runtime performance route already exists at ${runtimeRouteFile}`);
  }
  
  // Add runtime monitoring to client
  const appTsxPath = path.join(clientSrcDir, 'App.tsx');
  if (fs.existsSync(appTsxPath)) {
    let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    
    if (!appTsxContent.includes('initRuntimeMonitoring')) {
      console.log('📝 Adding runtime monitoring initialization to App.tsx...');
      
      // Find the import section
      const lastImport = appTsxContent.lastIndexOf('import');
      const lastImportEnd = appTsxContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add import for runtime monitoring
        const runtimeImport = `import { initRuntimeMonitoring } from './utils/runtime-monitor';\n`;
        appTsxContent = appTsxContent.slice(0, lastImportEnd + 1) + runtimeImport + appTsxContent.slice(lastImportEnd + 1);
        
        // Find the App function or component
        const appComponentMatch = appTsxContent.match(/function\s+App|const\s+App\s*=/);
        
        if (appComponentMatch) {
          const appComponentStart = appComponentMatch.index;
          const openBraceIndex = appTsxContent.indexOf('{', appComponentStart);
          
          if (openBraceIndex !== -1) {
            // Add runtime monitoring initialization
            const runtimeInit = `\n  // Initialize runtime monitoring\n  React.useEffect(() => {\n    const cleanup = initRuntimeMonitoring();\n    return () => cleanup();\n  }, []);\n\n`;
            appTsxContent = appTsxContent.slice(0, openBraceIndex + 1) + runtimeInit + appTsxContent.slice(openBraceIndex + 1);
            
            fs.writeFileSync(appTsxPath, appTsxContent);
            console.log('✅ Added runtime monitoring initialization to App.tsx');
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
      console.log('⚠️ Runtime monitoring initialization already exists in App.tsx');
    }
  } else {
    console.log(`⚠️ Could not find App.tsx at ${appTsxPath}`);
  }
}

// Function to create runtime performance dashboard
function createRuntimeDashboard() {
  console.log('\n📊 Creating runtime performance dashboard component...');
  
  const dashboardDir = path.join(clientSrcDir, 'components', 'performance');
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }
  
  const runtimeDashboardPath = path.join(dashboardDir, 'RuntimeDashboard.tsx');
  if (!fs.existsSync(runtimeDashboardPath)) {
    const runtimeDashboardContent = `import React, { useState, useEffect } from 'react';

interface ComponentProfile {
  componentName: string;
  renderCount: number;
  totalRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  avgRenderTime: number;
  lastRenderTimestamp: string;
}

interface FunctionStats {
  count: number;
  totalTime: number;
  maxTime: number;
  minTime: number;
}

interface LongTask {
  startTime: number;
  duration: number;
  url?: string;
}

interface MemoryInfo {
  timestamp: string;
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  memoryUsage?: number;
}

interface FrameRateInfo {
  timestamp: string;
  fps: number;
}

interface RuntimeMetrics {
  longTasks: LongTask[];
  memoryInfo: MemoryInfo[];
  frameRates: FrameRateInfo[];
  functions: {
    [key: string]: FunctionStats;
  };
  components: {
    [key: string]: ComponentProfile;
  };
  stats: {
    longTasksCount: number;
    totalBlockingTime: number;
    avgFrameRate: number;
    minFrameRate: number;
    maxMemoryUsage: number;
  };
}

declare global {
  interface Window {
    runtimeMetrics?: RuntimeMetrics;
  }
}

const RuntimeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RuntimeMetrics | null>(null);
  const [functionProfiles, setFunctionProfiles] = useState<{name: string, avgTime: number, count: number, maxTime: number}[]>([]);
  const [componentProfiles, setComponentProfiles] = useState<ComponentProfile[]>([]);
  
  useEffect(() => {
    // Load metrics from window object
    if (typeof window !== 'undefined' && window.runtimeMetrics) {
      setMetrics(window.runtimeMetrics);
      
      // Process function profiles
      processFunctionProfiles();
      
      // Process component profiles
      processComponentProfiles();
    }
    
    // Set up polling to update metrics every 2 seconds
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && window.runtimeMetrics) {
        setMetrics({...window.runtimeMetrics});
        processFunctionProfiles();
        processComponentProfiles();
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const processFunctionProfiles = () => {
    if (typeof window === 'undefined' || !window.runtimeMetrics || !window.runtimeMetrics.functions) {
      return;
    }
    
    const profiles = Object.entries(window.runtimeMetrics.functions).map(([name, stats]) => ({
      name,
      avgTime: stats.count > 0 ? stats.totalTime / stats.count : 0,
      count: stats.count,
      maxTime: stats.maxTime
    }));
    
    // Sort by average time (slowest first)
    profiles.sort((a, b) => b.avgTime - a.avgTime);
    
    setFunctionProfiles(profiles);
  };
  
  const processComponentProfiles = () => {
    if (typeof window === 'undefined' || !window.runtimeMetrics || !window.runtimeMetrics.components) {
      return;
    }
    
    const profiles = Object.values(window.runtimeMetrics.components);
    
    // Sort by average render time (slowest first)
    profiles.sort((a, b) => b.avgRenderTime - a.avgRenderTime);
    
    setComponentProfiles(profiles);
  };
  
  // Format duration with color coding
  const formatDuration = (duration: number) => {
    let colorClass = 'text-green-600';
    if (duration > 100) colorClass = 'text-red-600';
    else if (duration > 50) colorClass = 'text-amber-500';
    
    return (
      <span className={colorClass}>
        {duration.toFixed(1)} ms
      </span>
    );
  };
  
  // Format memory size
  const formatBytes = (bytes?: number) => {
    if (bytes === undefined) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return \`\${mb.toFixed(2)} MB\`;
  };
  
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Runtime Performance</h2>
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Collecting runtime metrics...
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Interact with the application to generate runtime activity
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Runtime Performance</h2>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Long Tasks</div>
          <div className={\`text-2xl font-bold mt-1 \${metrics.stats.longTasksCount > 10 ? 'text-red-600' : metrics.stats.longTasksCount > 5 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}\`}>
            {metrics.stats.longTasksCount}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Blocking Time</div>
          <div className={\`text-2xl font-bold mt-1 \${metrics.stats.totalBlockingTime > 300 ? 'text-red-600' : metrics.stats.totalBlockingTime > 100 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}\`}>
            {metrics.stats.totalBlockingTime.toFixed(0)} ms
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Frame Rate</div>
          <div className={\`text-2xl font-bold mt-1 \${metrics.stats.avgFrameRate < 30 ? 'text-red-600' : metrics.stats.avgFrameRate < 50 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}\`}>
            {metrics.stats.avgFrameRate} FPS
          </div>
        </div>
      </div>
      
      {/* Tabs for different metrics */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <a href="#components" className="inline-block p-4 border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500 rounded-t-lg">
                Components
              </a>
            </li>
            <li className="mr-2">
              <a href="#functions" className="inline-block p-4 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-t-lg">
                Functions
              </a>
            </li>
            <li className="mr-2">
              <a href="#longtasks" className="inline-block p-4 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-t-lg">
                Long Tasks
              </a>
            </li>
            <li>
              <a href="#memory" className="inline-block p-4 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-t-lg">
                Memory
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Component Render Times */}
      <div id="components" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Slow Components</h3>
        
        {componentProfiles.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Component
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Renders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Max Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {componentProfiles.slice(0, 10).map((component, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {component.componentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {component.renderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={\`\${component.avgRenderTime > 16 ? 'text-red-600' : component.avgRenderTime > 8 ? 'text-amber-500' : 'text-green-600'}\`}>
                          {component.avgRenderTime.toFixed(2)} ms
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={\`\${component.maxRenderTime > 50 ? 'text-red-600' : component.maxRenderTime > 16 ? 'text-amber-500' : 'text-green-600'}\`}>
                          {component.maxRenderTime.toFixed(2)} ms
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
            No component rendering metrics available
          </div>
        )}
      </div>
      
      {/* Function Execution Times */}
      <div id="functions" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Slow Functions</h3>
        
        {functionProfiles.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Function
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Calls
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Max Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {functionProfiles.slice(0, 10).map((func, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {func.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {func.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDuration(func.avgTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={\`\${func.maxTime > 200 ? 'text-red-600' : func.maxTime > 100 ? 'text-amber-500' : 'text-green-600'}\`}>
                          {func.maxTime.toFixed(1)} ms
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
            No function performance metrics available
          </div>
        )}
      </div>
      
      {/* Long Tasks */}
      <div id="longtasks" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Long Tasks (>50ms)</h3>
        
        {metrics.longTasks && metrics.longTasks.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Start Time (ms)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      URL
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {metrics.longTasks.slice(0, 10).map((task, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {task.startTime.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={\`\${task.duration > 200 ? 'text-red-600' : task.duration > 100 ? 'text-amber-500' : 'text-yellow-500'}\`}>
                          {task.duration.toFixed(1)} ms
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {task.url ? new URL(task.url).pathname : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No long tasks detected
          </div>
        )}
      </div>
      
      {/* Memory Usage */}
      <div id="memory" className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Memory Usage</h3>
        
        {metrics.memoryInfo && metrics.memoryInfo.length > 0 ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Used Heap
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Heap
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Heap Limit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Usage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {metrics.memoryInfo.slice(-5).map((mem, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(mem.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatBytes(mem.usedJSHeapSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatBytes(mem.totalJSHeapSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatBytes(mem.jsHeapSizeLimit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={\`\${mem.memoryUsage && mem.memoryUsage > 0.8 ? 'text-red-600' : mem.memoryUsage && mem.memoryUsage > 0.6 ? 'text-amber-500' : 'text-green-600'}\`}>
                            {mem.memoryUsage ? (mem.memoryUsage * 100).toFixed(1) + '%' : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Memory Usage Chart Placeholder */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg h-64 flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400 text-center">
                <p>Memory usage trend visualization would be displayed here.</p>
                <p className="text-sm mt-2">Use a charting library like Chart.js to visualize memory usage over time.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400">
            No memory usage data available. Memory monitoring may not be supported in this browser.
          </div>
        )}
      </div>
      
      {/* Export Button */}
      <div className="mt-6">
        <a
          href="/api/runtime-performance/report"
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

export default RuntimeDashboard;
`;

    fs.writeFileSync(runtimeDashboardPath, runtimeDashboardContent);
    console.log(`✅ Created runtime dashboard component at ${runtimeDashboardPath}`);
  } else {
    console.log(`⚠️ Runtime dashboard component already exists at ${runtimeDashboardPath}`);
  }
  
  // Update performance page to include runtime dashboard
  const performancePagePath = path.join(clientSrcDir, 'pages', 'PerformancePage.tsx');
  if (fs.existsSync(performancePagePath)) {
    let performancePageContent = fs.readFileSync(performancePagePath, 'utf8');
    
    if (!performancePageContent.includes('RuntimeDashboard')) {
      console.log('📝 Adding runtime dashboard to performance page...');
      
      // Find import section
      const lastImport = performancePageContent.lastIndexOf('import');
      const lastImportEnd = performancePageContent.indexOf('\n', lastImport);
      
      if (lastImport !== -1 && lastImportEnd !== -1) {
        // Add import for RuntimeDashboard
        const runtimeImport = `import RuntimeDashboard from '../components/performance/RuntimeDashboard';\n`;
        performancePageContent = performancePageContent.slice(0, lastImportEnd + 1) + runtimeImport + performancePageContent.slice(lastImportEnd + 1);
        
        // Find the end of the page content
        const lastDashboardMatch = performancePageContent.match(/<NetworkDashboard\s*\/>/);
        
        if (lastDashboardMatch) {
          const dashboardIndex = lastDashboardMatch.index + lastDashboardMatch[0].length;
          
          // Add RuntimeDashboard after last dashboard
          const runtimeDashboard = `\n\n      <div className="mt-8"></div>\n      <RuntimeDashboard />`;
          performancePageContent = performancePageContent.slice(0, dashboardIndex) + runtimeDashboard + performancePageContent.slice(dashboardIndex);
          
          fs.writeFileSync(performancePagePath, performancePageContent);
          console.log('✅ Added runtime dashboard to performance page');
        } else {
          // If NetworkDashboard is not found, try to find PerformanceDashboard
          const perfDashboardMatch = performancePageContent.match(/<PerformanceDashboard\s*\/>/);
          
          if (perfDashboardMatch) {
            const dashboardIndex = perfDashboardMatch.index + perfDashboardMatch[0].length;
            
            // Add RuntimeDashboard after PerformanceDashboard
            const runtimeDashboard = `\n\n      <div className="mt-8"></div>\n      <RuntimeDashboard />`;
            performancePageContent = performancePageContent.slice(0, dashboardIndex) + runtimeDashboard + performancePageContent.slice(dashboardIndex);
            
            fs.writeFileSync(performancePagePath, performancePageContent);
            console.log('✅ Added runtime dashboard to performance page');
          } else {
            console.log('⚠️ Could not locate dashboard components in performance page');
          }
        }
      } else {
        console.log('⚠️ Could not locate import statements in performance page');
      }
    } else {
      console.log('⚠️ Runtime dashboard already included in performance page');
    }
  } else {
    console.log(`⚠️ Could not find performance page at ${performancePagePath}`);
  }
}

// Main function
async function setupRuntimeMonitoring() {
  try {
    // 1. Set up runtime monitoring
    await setupRuntimeMonitoring();
    
    // 2. Create runtime dashboard
    createRuntimeDashboard();

    console.log('\n✨ Runtime performance monitoring setup completed!');
    console.log('===============================');
    console.log(`Visit the "/performance" route in your application to view the runtime performance dashboard.`);
    console.log(`Runtime performance reports are located in the "performance-reports/runtime" directory.`);
    console.log(`Completed: ${new Date().toISOString()}`);
  } catch (err) {
    console.error('❌ Error setting up runtime monitoring:', err);
  }
}

// Run the script
setupRuntimeMonitoring();