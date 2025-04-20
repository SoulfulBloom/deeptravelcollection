// Ultra simple HTTP server (CommonJS version)
const http = require('http');

// Create the server with comprehensive error handling
const server = http.createServer((req, res) => {
  try {
    console.log('Request received:', req.url);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    // Simple HTML page 
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Deep Travel Collections</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2a5885; }
          </style>
        </head>
        <body>
          <h1>Deep Travel Collections</h1>
          <p>Server is running successfully!</p>
          <p>Current time: ${new Date().toLocaleString()}</p>
          <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
          
          <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
            <h3>Deployment Success</h3>
            <p>This confirms that your application can be deployed to Replit.</p>
          </div>
        </body>
      </html>
    `;
    
    res.end(html);
  } catch (err) {
    console.error('Error handling request:', err);
    res.writeHead(500);
    res.end('Server error');
  }
});

// Get port from environment or use 3000
const PORT = process.env.PORT || 3000;

// Start the server with error handling
try {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
}

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Log any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

// Log any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});