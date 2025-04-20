/**
 * Deep Travel Collections Production Server
 * 
 * This is a simple production server that serves the static files
 * from the dist directory.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log available environment variables (only names, not values for security)
console.log('Available environment variables:', Object.keys(process.env).join(', '));

// Check for critical environment variables
const requiredEnvVars = ['STRIPE_SECRET_KEY', 'VITE_STRIPE_PUBLIC_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. Some features may not work properly.`);
  } else {
    console.log(`✓ ${envVar} is available`);
  }
});

const app = express();

// Check for client directory
const publicDir = path.join(__dirname, 'dist', 'public');
const distDir = path.join(__dirname, 'dist');

console.log('Checking for static files directory...');
console.log('Public directory exists:', fs.existsSync(publicDir));
console.log('Dist directory exists:', fs.existsSync(distDir));

// First try to serve from dist/public if it exists
if (fs.existsSync(publicDir)) {
  console.log('Serving static files from dist/public');
  app.use(express.static(publicDir));
}

// Also serve from dist directory
console.log('Serving static files from dist');
app.use(express.static(distDir));

// Log all available paths for debugging
app.get('/api/debug-paths', (req, res) => {
  const scanDirectory = (dir, result = [], base = '') => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.join(base, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        scanDirectory(filePath, result, relativePath);
      } else {
        result.push(relativePath);
      }
    });
    return result;
  };
  
  let distFiles = [];
  try {
    distFiles = scanDirectory(distDir);
  } catch (err) {
    console.error('Error scanning dist directory:', err);
  }
  
  let publicFiles = [];
  try {
    if (fs.existsSync(publicDir)) {
      publicFiles = scanDirectory(publicDir);
    }
  } catch (err) {
    console.error('Error scanning public directory:', err);
  }
  
  res.json({
    distDirectory: distDir,
    publicDirectory: publicDir,
    distFiles,
    publicFiles,
    env: Object.keys(process.env)
  });
});

// For any other request, try sending the index.html file for SPA routing
app.get('*', (req, res) => {
  // First try dist/public/index.html
  const publicIndexPath = path.join(publicDir, 'index.html');
  const distIndexPath = path.join(distDir, 'index.html');
  
  if (fs.existsSync(publicIndexPath)) {
    console.log('Serving index.html from public directory');
    return res.sendFile(publicIndexPath);
  } else if (fs.existsSync(distIndexPath)) {
    console.log('Serving index.html from dist directory');
    return res.sendFile(distIndexPath);
  } else {
    // Fallback to a simple HTML response
    console.log('No index.html found, sending fallback response');
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Deep Travel Collections</title></head>
        <body>
          <h1>Deep Travel Collections</h1>
          <p>Application is running but index.html is missing.</p>
        </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Debug information available at: http://localhost:${PORT}/api/debug-paths`);
});