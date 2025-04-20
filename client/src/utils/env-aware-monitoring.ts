/**
 * Environment-Aware Monitoring Utilities
 * 
 * This module provides optimized monitoring based on the current environment:
 * - Development: Minimal monitoring with console logs
 * - Production: Full monitoring with data collection
 */

// Local storage key for enabling dev monitoring
const DEV_MONITORING_KEY = 'DEEP_TRAVEL_DEV_MONITORING';

// Check if we should enable monitoring in development
export function shouldMonitorInDev(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NODE_ENV === 'production') return true;
  
  // Check for localStorage flag to enable dev monitoring
  try {
    return localStorage.getItem(DEV_MONITORING_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

// Enable/disable development monitoring
export function setDevMonitoring(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      localStorage.setItem(DEV_MONITORING_KEY, 'true');
    } else {
      localStorage.removeItem(DEV_MONITORING_KEY);
    }
    // Force page reload to apply changes
    window.location.reload();
  } catch (e) {
    console.error('Failed to update monitoring settings:', e);
  }
}

// Return current monitoring status
export function getMonitoringStatus(): { enabled: boolean, environment: string } {
  return {
    enabled: process.env.NODE_ENV === 'production' || shouldMonitorInDev(),
    environment: process.env.NODE_ENV || 'development'
  };
}

export default {
  shouldMonitorInDev,
  setDevMonitoring,
  getMonitoringStatus
};
