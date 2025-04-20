import { getEnv, getServiceStatuses, getSafeEnvInfo } from './config';

/**
 * Service to handle diagnostic functionality
 */
export function getDiagnosticInfo() {
  return {
    environment: getEnv('NODE_ENV', 'production'),
    timestamp: new Date().toISOString(),
    serviceStatus: getServiceStatuses(),
    envInfo: getSafeEnvInfo(),
    systemInfo: {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage().rss / 1024 / 1024 + ' MB'
    }
  };
}

/**
 * Test all external services connectivity
 */
export async function testExternalConnectivity() {
  const results = {
    stripe: false,
    openai: false,
    sendgrid: false,
    database: false
  };
  
  // Test Stripe
  if (getEnv('STRIPE_SECRET_KEY')) {
    try {
      const Stripe = require('stripe');
      const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'));
      await stripe.customers.list({ limit: 1 });
      results.stripe = true;
    } catch (error) {
      console.error('Stripe connectivity test failed:', error);
    }
  }
  
  // Test OpenAI
  if (getEnv('OPENAI_API_KEY')) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: getEnv('OPENAI_API_KEY') });
      await openai.models.list();
      results.openai = true;
    } catch (error) {
      console.error('OpenAI connectivity test failed:', error);
    }
  }
  
  // Test Database
  if (getEnv('DATABASE_URL')) {
    try {
      // Just check if db variable exists from db module
      const { db } = require('../db');
      if (db) {
        results.database = true;
      }
    } catch (error) {
      console.error('Database connectivity test failed:', error);
    }
  }
  
  return results;
}