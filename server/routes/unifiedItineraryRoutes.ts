/**
 * Unified Itinerary Routes
 * 
 * This file contains routes for the unified itinerary API, which provides
 * a standardized interface to multiple itinerary generator implementations.
 */

import { Router } from 'express';
import { storage } from '../storage';
import { 
  itineraryGeneratorFactory, 
  type GeneratorType 
} from '../services/itineraryGeneratorFactory';

const router = Router();

// In-memory cache for itineraries to reduce API calls
// key: `${destinationId}-${generatorType}`
const itineraryCache = new Map<string, { content: string, timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate a new itinerary or retrieve from cache
 */
router.post('/generate', async (req, res) => {
  try {
    const { destinationId, generator = 'resilient', forceRefresh = false, useCache = true } = req.body;
    
    if (!destinationId) {
      return res.status(400).json({ error: 'Missing required parameter: destinationId' });
    }
    
    // Validate generator type
    if (generator && !['basic', 'chunked', 'resilient', 'efficient'].includes(generator)) {
      return res.status(400).json({ error: 'Invalid generator type. Supported types: basic, chunked, resilient, efficient' });
    }
    
    const destination = await storage.getDestinationById(Number(destinationId));
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Check cache if we're not forcing a refresh
    const cacheKey = `${destinationId}-${generator}`;
    if (useCache && !forceRefresh && itineraryCache.has(cacheKey)) {
      const cached = itineraryCache.get(cacheKey)!;
      
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({
          destination,
          content: cached.content,
          generator,
          cached: true
        });
      }
    }
    
    // For quick response, we'll generate this asynchronously
    // For production, consider using a queue system like Bull
    res.json({
      destination,
      processing: true,
      generator,
      statusEndpoint: `/api/v2/itinerary/status/${destinationId}/${generator}`
    });
    
    // Start generation in the background
    setTimeout(async () => {
      try {
        console.log(`Starting itinerary generation for ${destination.name} using ${generator} generator`);
        const content = await itineraryGeneratorFactory.generateItinerary(
          destination,
          generator as GeneratorType
        );
        
        // Cache the result
        if (useCache) {
          itineraryCache.set(cacheKey, {
            content,
            timestamp: Date.now()
          });
        }
        
        console.log(`Completed itinerary generation for ${destination.name}`);
      } catch (error: any) {
        console.error(`Error generating itinerary:`, error);
      }
    }, 0);
    
  } catch (error: any) {
    console.error('Error in itinerary generation request:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      message: error.message
    });
  }
});

/**
 * Check the status of an in-progress itinerary generation
 */
router.get('/status/:destinationId/:generator', async (req, res) => {
  try {
    const { destinationId, generator } = req.params;
    
    // Check if the itinerary is in the cache
    const cacheKey = `${destinationId}-${generator}`;
    if (itineraryCache.has(cacheKey)) {
      const cached = itineraryCache.get(cacheKey)!;
      
      // Get the destination info
      const destination = await storage.getDestinationById(Number(destinationId));
      
      if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
      }
      
      return res.json({
        ready: true,
        destination,
        content: cached.content,
        generator,
        cached: true,
        timestamp: cached.timestamp,
        timestampFormatted: new Date(cached.timestamp).toLocaleString()
      });
    }
    
    // If not in cache, assume it's still processing
    return res.json({
      ready: false,
      processing: true,
      generator
    });
    
  } catch (error: any) {
    console.error('Error checking itinerary status:', error);
    res.status(500).json({
      error: 'Failed to check itinerary status',
      message: error.message
    });
  }
});

/**
 * Generate or retrieve a specific day from an itinerary
 */
router.get('/:destinationId/day/:dayNumber', async (req, res) => {
  try {
    const { destinationId, dayNumber } = req.params;
    const { generator = 'resilient', refresh = false } = req.query;
    
    const destination = await storage.getDestinationById(Number(destinationId));
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Check cache first unless refresh is requested
    const cacheKey = `${destinationId}-${generator}-day${dayNumber}`;
    if (refresh !== 'true' && itineraryCache.has(cacheKey)) {
      const cached = itineraryCache.get(cacheKey)!;
      
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({
          destination,
          content: cached.content,
          generator,
          day: Number(dayNumber),
          cached: true
        });
      }
    }
    
    // Generate the day content
    const dayContent = await itineraryGeneratorFactory.generateDay(
      destination,
      Number(dayNumber),
      generator as GeneratorType
    );
    
    // Cache the result
    itineraryCache.set(cacheKey, {
      content: dayContent,
      timestamp: Date.now()
    });
    
    return res.json({
      destination,
      content: dayContent,
      generator,
      day: Number(dayNumber),
      cached: false
    });
    
  } catch (error: any) {
    console.error('Error generating day content:', error);
    res.status(500).json({
      error: 'Failed to generate day content',
      message: error.message
    });
  }
});

/**
 * Configure the default generator type
 */
router.post('/config/default-generator', (req, res) => {
  try {
    const { generator } = req.body;
    
    if (!generator) {
      return res.status(400).json({ error: 'Missing required parameter: generator' });
    }
    
    // Validate generator type
    if (!['basic', 'chunked', 'resilient', 'efficient'].includes(generator)) {
      return res.status(400).json({ error: 'Invalid generator type. Supported types: basic, chunked, resilient, efficient' });
    }
    
    // Set the default generator
    itineraryGeneratorFactory.setDefaultGeneratorType(generator as GeneratorType);
    
    return res.json({
      success: true,
      message: `Default generator set to: ${generator}`,
      generator
    });
    
  } catch (error: any) {
    console.error('Error setting default generator:', error);
    res.status(500).json({
      error: 'Failed to set default generator',
      message: error.message
    });
  }
});

/**
 * Get current configuration
 */
router.get('/config', (req, res) => {
  try {
    const defaultGenerator = itineraryGeneratorFactory.getDefaultGeneratorType();
    
    return res.json({
      defaultGenerator
    });
    
  } catch (error: any) {
    console.error('Error getting configuration:', error);
    res.status(500).json({
      error: 'Failed to get configuration',
      message: error.message
    });
  }
});

/**
 * Clear the cache for all or specific itineraries
 */
router.post('/cache/clear', (req, res) => {
  try {
    const { destinationId, generator } = req.body;
    
    if (destinationId && generator) {
      // Clear specific cache entry
      const cacheKey = `${destinationId}-${generator}`;
      itineraryCache.delete(cacheKey);
      
      // Also clear individual day caches
      for (let day = 1; day <= 7; day++) {
        itineraryCache.delete(`${destinationId}-${generator}-day${day}`);
      }
      
      return res.json({
        success: true,
        message: `Cache cleared for destination ${destinationId} with generator ${generator}`
      });
    } else {
      // Clear entire cache
      itineraryCache.clear();
      
      return res.json({
        success: true,
        message: 'Entire cache cleared'
      });
    }
    
  } catch (error: any) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

export default router;