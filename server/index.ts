// Import environment setup first
import './envSetup';

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve files from the public directory
app.use('/downloads', express.static(path.join(process.cwd(), 'public/downloads')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

// Serve generated PDF files from temp directory
app.use('/downloads/test-pdfs', express.static(path.join(process.cwd(), 'tmp/test-pdfs')));
app.use('/downloads/itineraries', express.static(path.join(process.cwd(), 'tmp/itineraries')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Express error handler:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Make sure this sends JSON for API routes
    if (req.path.startsWith('/api')) {
      return res.status(status).json({ 
        error: message,
        status,
        path: req.path
      });
    }
    
    // HTML for other routes
    res.status(status).send('Server Error');
  });

  // API-specific middleware to ensure proper JSON format for all API routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Only apply to paths that start with /api
    if (req.path.startsWith('/api')) {
      // Override the res.send method to ensure proper content-type for API routes
      const originalSend = res.send;
      res.send = function(body) {
        // Always set JSON content type for API routes unless it's explicitly something else
        // like a PDF or image
        if (typeof body === 'object' && !Buffer.isBuffer(body) && 
            !res.headersSent && 
            !res.getHeader('Content-Type')) {
          res.header('Content-Type', 'application/json');
        }
        return originalSend.call(this, body);
      };
      
      // Override res.json to ensure proper Content-Type header
      const originalJson = res.json;
      res.json = function(body) {
        if (!res.headersSent) {
          res.header('Content-Type', 'application/json');
        }
        return originalJson.call(this, body);
      };
    }
    
    next();
  });

  // Add a special middleware that explicitly serves API routes
  // This must be added AFTER all API routes are registered but BEFORE the Vite middleware
  app.use('/api/*', (req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
      // If we reach this point for an API route, it means no route handler caught it
      // Send a 404 JSON response instead of letting it fall through to the SPA handler
      res.status(404).header('Content-Type', 'application/json').json({
        status: 404,
        error: 'API endpoint not found',
        path: req.originalUrl
      });
    } else {
      next();
    }
  });
  
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
