// Ultra simple HTTP server (ES Module version)
import http from 'http';

// Create the server
const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  
  // Simple HTML page that's guaranteed to work
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
        <p>Server is running!</p>
        <p>Current time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `;
  
  res.end(html);
});

// Get port from environment or use 3000
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});

// Handle errors
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