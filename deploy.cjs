/**
 * Deep Travel Collections - Deployment Server (CommonJS version)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting Deep Travel Collections Deployment Server (CommonJS)');
console.log('Current directory:', process.cwd());
console.log('PORT:', PORT);

// Check if we have the main index.cjs file
if (!fs.existsSync('./index.cjs')) {
  console.log('index.cjs not found, creating it...');
  
  const indexJs = `
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Deep Travel Collections - Main Server');
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
  console.log(\`- \${key}: \${process.env[key] ? '✓ Set' : '✗ Not set'}\`);
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
    version: 'Deployment Server',
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    distDirectoryExists: distExists
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  if (distExists && fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.send(\`
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
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Deep Travel Collections</h1>
          <p class="success">✓ Server is running!</p>
          <p>Server time: \${new Date().toLocaleString()}</p>
        </div>
        
        <div class="card">
          <h2>Server Status</h2>
          <p>Check <a href="/api/status">/api/status</a> for server status</p>
        </div>
      </body>
      </html>
    \`);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running at http://0.0.0.0:\${PORT}/\`);
});
`;
  
  fs.writeFileSync('./index.cjs', indexJs);
  console.log('Created index.cjs successfully');
}

// Create API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: 'deploy.cjs',
    serverTime: new Date().toISOString()
  });
});

// Start the server using the index.cjs file
console.log('Starting server using index.cjs...');
const serverProcess = spawn('node', ['index.cjs'], {
  stdio: 'inherit'
});

// Handle server process events
serverProcess.on('error', (err) => {
  console.error('Failed to start server process:', err);
  
  // Start a fallback server if index.cjs fails
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fallback server running at http://0.0.0.0:${PORT}/`);
  });
});

// Keep this process alive
process.stdin.resume();

// Handle termination signals
process.on('SIGINT', () => {
  if (serverProcess) serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (serverProcess) serverProcess.kill('SIGTERM');
  process.exit(0);
});