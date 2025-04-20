/**
 * Deep Travel Collections - Main Entry Point
 * This file is designed to be run by the Replit "Run index.js" workflow
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Deep Travel Collections - Main Server');
console.log('Current directory:', process.cwd());
console.log('PORT:', PORT);

// Check environment variables
const envVars = [
  'DATABASE_URL', 
  'STRIPE_SECRET_KEY', 
  'OPENAI_API_KEY', 
  'VITE_STRIPE_PUBLIC_KEY'
];

console.log('Environment variables status:');
envVars.forEach(key => {
  console.log(`- ${key}: ${process.env[key] ? '✓ Set' : '✗ Not set'}`);
});

// Check for dist directory
const distPath = path.join(process.cwd(), 'dist');
let distExists = false;

try {
  distExists = fs.existsSync(distPath) && fs.statSync(distPath).isDirectory();
  console.log('Dist directory status:', distExists ? 'Found' : 'Not found');
  
  if (distExists) {
    console.log('Dist directory contents:', fs.readdirSync(distPath));
  }
} catch (err) {
  console.error('Error checking dist directory:', err);
}

// Serve static files from dist if it exists
if (distExists) {
  app.use(express.static(distPath));
  console.log('Serving static files from:', distPath);
  
  // Also serve any assets directory at the project root
  const assetsPath = path.join(process.cwd(), 'assets');
  try {
    if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
      app.use('/assets', express.static(assetsPath));
      console.log('Serving additional assets from:', assetsPath);
    }
  } catch (err) {
    console.log('Note: No additional assets directory found');
  }
}

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: 'index.js',
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    distDirectoryExists: distExists
  });
});

// Special debug routes
app.get('/api/debug/environment', (req, res) => {
  // Safe version that doesn't expose actual values
  const safeEnv = {};
  Object.keys(process.env).forEach(key => {
    safeEnv[key] = process.env[key] ? '✓ Set' : '✗ Not set';
  });
  
  res.json({
    nodeEnv: process.env.NODE_ENV || 'not set',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    cwd: process.cwd(),
    envVars: safeEnv
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  if (distExists && fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Deep Travel Collections</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6;
            color: #333;
          }
          h1 { color: #2a5885; }
          .card { 
            background: #f8f9fa; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            padding: 20px; 
            margin-bottom: 20px; 
          }
          .success { color: #28a745; font-weight: bold; }
          .warning { color: #ffc107; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Deep Travel Collections</h1>
          <p class="success">✓ Server is running!</p>
          <p>Server time: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="card">
          <h2>Server Status</h2>
          <p>Check <a href="/api/status">/api/status</a> for server status</p>
          <p>Check <a href="/api/debug/environment">/api/debug/environment</a> for environment details</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});