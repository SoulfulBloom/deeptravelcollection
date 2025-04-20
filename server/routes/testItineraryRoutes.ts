/**
 * Test Itinerary Generator Routes
 * 
 * These routes allow testing different itinerary generator implementations
 * and collecting performance metrics.
 */

import { Router } from 'express';
import { itineraryGeneratorFactory } from '../services/itineraryGeneratorFactory';
import { GeneratorType } from '../config';

const router = Router();

// In-memory storage for test destinations
type TestDestination = {
  id: number;
  name: string;
  country: string;
  regionId: number;
  description: string;
  immersiveDescription: string | null;
  imageUrl: string;
  featured: boolean | null;
  downloadCount: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  cuisine: string | null;
};

const testDestinations: TestDestination[] = [];
let nextId = 1;

/**
 * Create a test destination
 */
router.post('/destinations', async (req, res) => {
  try {
    const { name, country } = req.body;
    
    if (!name || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields: name and country' 
      });
    }
    
    const destination: TestDestination = {
      id: nextId++,
      name,
      country,
      regionId: 1,
      description: `Test destination for ${name}, ${country}`,
      immersiveDescription: null,
      imageUrl: 'https://placehold.co/600x400',
      featured: null,
      downloadCount: null,
      createdAt: new Date(),
      updatedAt: null,
      latitude: null,
      longitude: null,
      timezone: null,
      cuisine: null
    };
    
    testDestinations.push(destination);
    
    res.status(201).json(destination);
  } catch (error: any) {
    console.error('Error creating test destination:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all test destinations
 */
router.get('/destinations', (req, res) => {
  res.json(testDestinations);
});

/**
 * Get a specific test destination
 */
router.get('/destinations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const destination = testDestinations.find(d => d.id === id);
  
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  
  res.json(destination);
});

/**
 * Generate a full itinerary using the specified generator
 */
router.post('/itinerary/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const destination = testDestinations.find(d => d.id === id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const { generatorType = 'efficient' } = req.body as { generatorType?: GeneratorType };
    
    // Validate generator type
    if (!['default', 'chunked', 'resilient', 'efficient'].includes(generatorType)) {
      return res.status(400).json({ error: 'Invalid generator type' });
    }
    
    const startTime = Date.now();
    
    // Generate itinerary
    const content = await itineraryGeneratorFactory.generateItinerary(
      destination, 
      generatorType
    );
    
    const endTime = Date.now();
    const generationTime = `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
    
    res.json({
      destination,
      generatorType,
      generationTime,
      content
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Generate a specific day using the specified generator
 */
router.post('/day/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const destination = testDestinations.find(d => d.id === id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const { 
      dayNumber = 1,
      generatorType = 'efficient' 
    } = req.body as { 
      dayNumber?: number;
      generatorType?: GeneratorType;
    };
    
    // Validate day number
    if (dayNumber < 1 || dayNumber > 7) {
      return res.status(400).json({ error: 'Day number must be between 1 and 7' });
    }
    
    // Validate generator type
    if (!['default', 'chunked', 'resilient', 'efficient'].includes(generatorType)) {
      return res.status(400).json({ error: 'Invalid generator type' });
    }
    
    const startTime = Date.now();
    
    // Generate day content
    const content = await itineraryGeneratorFactory.generateDay(
      destination, 
      dayNumber,
      generatorType
    );
    
    const endTime = Date.now();
    const generationTime = `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
    
    res.json({
      destination,
      dayNumber,
      generatorType,
      generationTime,
      content
    });
  } catch (error: any) {
    console.error('Error generating day content:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Compare multiple generators for the same destination
 */
router.post('/compare/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const destination = testDestinations.find(d => d.id === id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const { 
      generators = ['default', 'chunked', 'resilient', 'efficient'],
      dayNumber 
    } = req.body as { 
      generators?: GeneratorType[];
      dayNumber?: number;
    };
    
    // Validate generators
    for (const gen of generators) {
      if (!['default', 'chunked', 'resilient', 'efficient'].includes(gen)) {
        return res.status(400).json({ error: `Invalid generator type: ${gen}` });
      }
    }
    
    const results: Record<string, any> = {};
    
    // Generate content using each generator
    for (const gen of generators) {
      try {
        const startTime = Date.now();
        
        let content: string;
        if (dayNumber) {
          // Generate specific day
          content = await itineraryGeneratorFactory.generateDay(destination, dayNumber, gen);
        } else {
          // Generate full itinerary
          content = await itineraryGeneratorFactory.generateItinerary(destination, gen);
        }
        
        const endTime = Date.now();
        const generationTime = `${((endTime - startTime) / 1000).toFixed(2)} seconds`;
        
        results[gen] = {
          generationTime,
          contentLength: content.length,
          content
        };
      } catch (error: any) {
        results[gen] = {
          error: error.message,
          failed: true
        };
      }
    }
    
    res.json({
      destination,
      dayNumber,
      results
    });
  } catch (error: any) {
    console.error('Error comparing generators:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;