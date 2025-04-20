/**
 * Routes for detailed itinerary generation
 */

import { Router } from 'express';
import OpenAI from 'openai';
import { PREMIUM_SYSTEM_PROMPT } from '../services/optimizedPrompts';
import { db } from '../db';
import { destinations } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { itineraryCache } from '../services/cacheService';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = 'gpt-4o';

// Cache TTL (7 days)
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

/**
 * Generate a detailed day itinerary for a specific destination
 * 
 * @route GET /api/detailed-itinerary/:destinationId/day/:dayNumber
 */
router.get('/:destinationId/day/:dayNumber', async (req, res) => {
  try {
    const destinationId = parseInt(req.params.destinationId);
    const dayNumber = parseInt(req.params.dayNumber);
    
    // Validate inputs
    if (isNaN(destinationId) || isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
      return res.status(400).json({ error: 'Invalid destination ID or day number' });
    }
    
    // Check if force refresh is requested
    const forceRefresh = req.query.refresh === 'true';
    
    // Get destination details
    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.id, destinationId),
    });
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Check cache first
    if (!forceRefresh) {
      const cachedItinerary = await itineraryCache.get<string>(
        { 
          type: 'detailed_day',
          destinationId,
          dayNumber
        }
      );
      
      if (cachedItinerary) {
        return res.json({ 
          content: cachedItinerary,
          cached: true,
          destination: {
            name: destination.name,
            country: destination.country
          }
        });
      }
    }
    
    // Generate detailed day itinerary
    const prompt = `
Create a detailed day itinerary for Day ${dayNumber} in ${destination.name}, ${destination.country}.

For each activity include:
1. Morning activity (specific location name, address, opening hours, entrance cost)
2. Afternoon activity (specific location name, address, opening hours, entrance cost)
3. Evening activity (specific location name, address, opening hours, entrance cost)

For each activity also include:
- One local insider tip
- Brief historical context (2-3 sentences)
- Exact transportation method with specific routes/lines
- Exact restaurant recommendation for each time period with cuisine type, price range ($$), and 1-2 dishes to try

Format with clear markdown headings (## for day, ### for time periods). Be extremely specific and detailed with EXACT names, addresses, and costs. Include websites where available.
`;

    // Start the generation
    console.log(`Generating detailed day itinerary for ${destination.name}, Day ${dayNumber}...`);
    
    // For longer generations, respond immediately that it's processing
    res.json({
      processing: true,
      message: 'Detailed itinerary generation started. Check back in a few seconds.',
      destination: {
        name: destination.name,
        country: destination.country
      },
      endpoint: `/api/detailed-itinerary/${destinationId}/day/${dayNumber}/status`
    });
    
    // Continue processing in the background
    setTimeout(async () => {
      try {
        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            { role: 'system', content: PREMIUM_SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        });
        
        const content = response.choices[0].message.content || '';
        
        // Cache the result
        await itineraryCache.set(
          { 
            type: 'detailed_day',
            destinationId,
            dayNumber
          },
          content,
          { ttl: CACHE_TTL }
        );
        
        console.log(`Completed day itinerary generation for ${destination.name}, Day ${dayNumber}`);
      } catch (error: any) {
        console.error(`Error generating detailed day itinerary for ${destination.name}, Day ${dayNumber}:`, error);
      }
    }, 0);
    
  } catch (error: any) {
    console.error('Error handling detailed day itinerary request:', error);
    res.status(500).json({ error: 'Failed to generate detailed day itinerary' });
  }
});

/**
 * Check the status of a detailed day itinerary generation
 * 
 * @route GET /api/detailed-itinerary/:destinationId/day/:dayNumber/status
 */
router.get('/:destinationId/day/:dayNumber/status', async (req, res) => {
  try {
    const destinationId = parseInt(req.params.destinationId);
    const dayNumber = parseInt(req.params.dayNumber);
    
    // Validate inputs
    if (isNaN(destinationId) || isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
      return res.status(400).json({ error: 'Invalid destination ID or day number' });
    }
    
    // Get destination details
    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.id, destinationId),
    });
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Check if the content is ready in cache
    const cachedItinerary = await itineraryCache.get<string>(
      { 
        type: 'detailed_day',
        destinationId,
        dayNumber
      }
    );
    
    if (cachedItinerary) {
      return res.json({ 
        content: cachedItinerary,
        ready: true,
        destination: {
          name: destination.name,
          country: destination.country
        }
      });
    } else {
      // Still processing
      return res.json({
        ready: false,
        message: 'Still generating content. Check back in a few seconds.',
        destination: {
          name: destination.name,
          country: destination.country
        }
      });
    }
    
  } catch (error: any) {
    console.error('Error checking detailed day itinerary status:', error);
    res.status(500).json({ error: 'Failed to check itinerary status' });
  }
});

export default router;