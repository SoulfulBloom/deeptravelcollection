import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import performanceRoutes from "./routes/performance";

export async function registerRoutes(app: Express): Promise<Server> {
  // Parse JSON request body
  app.use(express.json());
  
  // Performance monitoring routes
  app.use('/api/performance', performanceRoutes);
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Deep Travel Collections API is running', 
      time: new Date().toISOString() 
    });
  });
  
  // Example API route
  app.get('/api/info', (req, res) => {
    res.json({
      name: 'Deep Travel Collections',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timeStamp: new Date().toISOString()
    });
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}