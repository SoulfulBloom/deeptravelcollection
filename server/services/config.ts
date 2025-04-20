/**
 * Configuration Service
 * 
 * Provides environment variables with fallbacks for deployment.
 * This ensures services can operate even if environment variables
 * aren't passed through to deployment.
 */

// Function to get environment variable with a fallback
export function getEnv(key: string, fallback: string = ''): string {
  return process.env[key] || fallback;
}

// Service status tracking
const serviceStatus: Record<string, boolean> = {};

// Log service initialization with fallback handling
export function initService(name: string, requiredEnvVar: string): boolean {
  const isAvailable = !!process.env[requiredEnvVar];
  serviceStatus[name] = isAvailable;
  
  console.log(`${name} service initialization: ${isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`);
  
  if (!isAvailable) {
    console.log(`${requiredEnvVar} not found, ${name} service will not be fully functional`);
    console.log(`Fallback handlers will be used for ${name} functionality`);
  }
  
  return isAvailable;
}

// Check if a service is available
export function isServiceAvailable(name: string): boolean {
  return !!serviceStatus[name];
}

// Get all service statuses
export function getServiceStatuses(): Record<string, boolean> {
  return { ...serviceStatus };
}

// Get a copy of all relevant environment variables (safe to expose)
export function getSafeEnvInfo(): Record<string, string> {
  return {
    NODE_ENV: getEnv('NODE_ENV', 'production'),
    DATABASE_URL: getEnv('DATABASE_URL') ? 'Available (value hidden)' : 'Not Available',
    STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY') ? 'Available (value hidden)' : 'Not Available',
    VITE_STRIPE_PUBLIC_KEY: getEnv('VITE_STRIPE_PUBLIC_KEY') ? 'Available (value hidden)' : 'Not Available',
    OPENAI_API_KEY: getEnv('OPENAI_API_KEY') ? 'Available (value hidden)' : 'Not Available',
    SENDGRID_API_KEY: getEnv('SENDGRID_API_KEY') ? 'Available (value hidden)' : 'Not Available',
  };
}

// Create a diagnostic route handler
export function getDiagnosticInfo(): Record<string, any> {
  return {
    environment: getEnv('NODE_ENV', 'production'),
    serviceStatus: getServiceStatuses(),
    envInfo: getSafeEnvInfo(),
    systemInfo: {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    }
  };
}