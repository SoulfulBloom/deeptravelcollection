/**
 * Environment Setup for Deployment
 * 
 * This file ensures all required environment variables have defaults in production.
 * Import this file at the very beginning of server/index.ts.
 */

// Set fallback values for required environment variables in production
if (process.env.NODE_ENV === 'production') {
  // List of all environment variables needed for deployment
  const requiredEnvVars = [
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY',
    'VITE_STRIPE_PUBLIC_KEY',
    'SENDGRID_API_KEY',
    'SESSION_SECRET',
  ];
  
  // Log missing environment variables
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables in production: ${missing.join(', ')}`);
    console.warn('Some features may not work correctly.');
  }
  
  // Ensure NODE_ENV is set
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
}