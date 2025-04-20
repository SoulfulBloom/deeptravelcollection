/**
 * Runtime Performance Monitoring Utility
 * 
 * This module provides functions for monitoring runtime performance including:
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

// Constants
const LONG_TASK_THRESHOLD = 50; // 50ms

/**
 * Initialize metrics object on window
 */
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

/**
 * Initialize long tasks monitoring
 */
export function monitorLongTasks() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return;
  }
  
  console.log('Initializing long tasks monitoring');
  
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
              console.warn(`Long task detected: ${taskDuration.toFixed(2)}ms`);
            }
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    console.log('Long tasks monitoring initialized');
    
    return observer;
  } catch (e) {
    console.error('Failed to initialize long tasks monitoring:', e);
    return null;
  }
}

/**
 * Monitor memory usage
 */
export function monitorMemoryUsage(intervalMs: number = 10000) {
  if (typeof window === 'undefined' || !window.performance || !window.performance.memory) {
    return null;
  }
  
  console.log('Initializing memory usage monitoring');
  
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
    return null;
  }
  
  console.log('Initializing frame rate monitoring');
  
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
        console.warn(`Low frame rate detected: ${fps} FPS`);
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
    console.warn(`Slow function call: ${name} took ${duration.toFixed(2)}ms`);
  }
}

/**
 * Initialize all runtime monitoring
 */
let cleanupFunctions: Array<() => void> = [];

export function initRuntimeMonitoring() {
  if (typeof window !== 'undefined' && !window.__RUNTIME_MONITORING_INITIALIZED__) {
    console.log('Initializing runtime performance monitoring');
    
    window.__RUNTIME_MONITORING_INITIALIZED__ = true;
    
    // Initialize metrics object
    initRuntimeMetrics();
    
    // Start monitoring
    const longTasksObserver = monitorLongTasks();
    if (longTasksObserver) {
      cleanupFunctions.push(() => longTasksObserver.disconnect());
    }
    
    // Start memory monitoring and save cleanup function
    const memoryCleanup = monitorMemoryUsage();
    if (memoryCleanup) {
      cleanupFunctions.push(memoryCleanup);
    }
    
    // Start frame rate monitoring and save cleanup function
    const frameRateCleanup = monitorFrameRate();
    if (frameRateCleanup) {
      cleanupFunctions.push(frameRateCleanup);
    }
    
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

export default initRuntimeMonitoring;