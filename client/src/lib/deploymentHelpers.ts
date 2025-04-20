/**
 * Deployment Helpers Library
 * 
 * Provides utilities and functions to address common deployment issues
 * and help fix path resolution, asset loading, and routing in various
 * deployment environments.
 */

/**
 * Check if we're in a deployment environment with potential path issues.
 * This includes environments where the app is deployed to a non-root path.
 */
export const isDeploymentEnvironment = (): boolean => {
  // Check for direct indicators of deployment environment
  const isDeployment = 
    window.location.pathname.startsWith('/download') ||
    document.querySelector('meta[name="x-deployment-env"]') !== null ||
    import.meta.env.MODE === 'production';
  
  return isDeployment;
};

/**
 * Fix paths for static assets in a deployment environment
 */
export const getAssetPath = (assetPath: string): string => {
  if (!isDeploymentEnvironment()) {
    return assetPath;
  }
  
  // Remove leading slash if present
  const cleanPath = assetPath.startsWith('/') ? assetPath.substring(1) : assetPath;
  
  // In production builds, assets are in the assets directory
  return import.meta.env.MODE === 'production'
    ? `/assets/${cleanPath}`
    : `/${cleanPath}`;
};

/**
 * Get the correct base URL for API calls
 */
export const getApiBaseUrl = (): string => {
  // Always use relative paths for API calls to avoid CORS issues
  return '/api';
};

/**
 * Fix path for navigation in a deployment environment
 */
export const getRoutePath = (path: string): string => {
  if (!isDeploymentEnvironment()) {
    return path;
  }
  
  // For the home page
  if (path === '/') {
    return './';
  }
  
  // For other paths, ensure they have the right prefix
  return path.startsWith('/') ? '.' + path : path;
};

/**
 * Detect browser environment and capabilities
 */
export const getBrowserEnvironment = (): Record<string, any> => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    hasTouchScreen: 'ontouchstart' in window,
    storageAvailable: isStorageAvailable(),
    isIOSDevice: /iPad|iPhone|iPod/.test(navigator.userAgent),
  };
};

/**
 * Check if localStorage is available and working
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Utility to inject a script dynamically
 */
export const injectScript = (src: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (id && document.getElementById(id)) {
      return resolve();
    }
    
    const script = document.createElement('script');
    script.src = src;
    if (id) script.id = id;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
};

/**
 * Clear all browser storage (useful for troubleshooting)
 */
export const clearAllStorage = (): void => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    console.log('All storage cleared successfully');
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
};

/**
 * Log deployment information (helpful for debugging)
 */
export const logDeploymentInfo = (): void => {
  console.info('Deployment Information:', {
    environment: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL,
    appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
    buildTime: import.meta.env.VITE_BUILD_TIME || 'unknown',
    browser: getBrowserEnvironment(),
    location: window.location.toString(),
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  });
};

// Export default object with all helpers
export default {
  isDeploymentEnvironment,
  getAssetPath,
  getApiBaseUrl,
  getRoutePath,
  getBrowserEnvironment,
  isStorageAvailable,
  injectScript,
  clearAllStorage,
  logDeploymentInfo,
};