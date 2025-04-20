/**
 * Deep Travel Collections Production Deployment Runner
 * 
 * This is the entry point for Replit deployment.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting deployment process...');

// Build the application if not already built
try {
  if (!fs.existsSync('./dist') || !fs.existsSync('./dist/index.html')) {
    console.log('Building the application...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully.');
  } else {
    console.log('Using existing build.');
  }

  // Start the production server
  console.log('Starting production server...');
  // Use prod-server.js which is already set up to serve the application
  const prodServer = import('./prod-server.js');
  
  console.log('Deep Travel Collections is now running!');
  console.log('Access your application at the URL provided by Replit.');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}