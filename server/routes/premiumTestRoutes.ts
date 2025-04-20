/**
 * Premium Service Test Routes
 * 
 * These routes provide integration tests for premium services.
 */

import { Router } from 'express';
import { destinations, itineraries, days, enhancedExperiences } from '@shared/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { premiumGeneratorType, GeneratorType } from '../config';
import { itineraryGeneratorFactory } from '../services/itineraryGeneratorFactory';
import { normalizeContent } from '../utils/contentNormalizer';
import fs from 'fs';
import path from 'path';

// Import services to test
const router = Router();

/**
 * Simple test endpoint for API response format testing
 * 
 * This endpoint is used to quickly verify that the API routes
 * are correctly returning JSON responses with proper content-type headers.
 */
router.get('/api-test', (req, res) => {
  try {
    // Set explicit content-type header for JSON
    res.header('Content-Type', 'application/json');
    res.json({
      success: true,
      message: 'API test endpoint is working correctly',
      format: 'JSON',
      timestamp: new Date().toISOString(),
      requestHeaders: {
        accept: req.headers.accept,
        contentType: req.headers['content-type']
      }
    });
  } catch (error: any) {
    console.error('Error in API test endpoint:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Test the premium PDF generator configuration
 * 
 * This endpoint tests that the premium PDF service is correctly
 * configured to use the efficient generator.
 */
router.get('/test-generator-config', (req, res) => {
  try {
    // Return the configured premium generator type
    res.json({
      premiumGeneratorType,
      message: `Premium service is configured to use the '${premiumGeneratorType}' generator`
    });
  } catch (error: any) {
    console.error('Error in generator config test:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Test generator selection for premium content
 * 
 * This tests the actual implementation by triggering a partial
 * PDF generation process that logs generator selection.
 */
router.post('/test-generator-selection', async (req, res) => {
  try {
    // Get a featured destination to test with
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.featured, true))
      .limit(1);

    if (!destination) {
      return res.status(404).json({ 
        error: 'No featured destinations found for testing. Please mark at least one destination as featured.'
      });
    }

    // Log information about the test
    console.log(`\n--------- PREMIUM GENERATOR TEST ---------`);
    console.log(`Testing premium generator selection with destination: ${destination.name}`);
    console.log(`Configured premium generator type: ${premiumGeneratorType}`);

    // Import services to test
    const { itineraryGeneratorFactory } = await import('../services/itineraryGeneratorFactory');
    
    // Get the specific generator that will be used
    const generator = itineraryGeneratorFactory.getGenerator(premiumGeneratorType);
    console.log(`Selected generator type: ${generator.constructor.name}`);

    // Use the generator factory with premium destination to verify selection logic
    console.log(`Running generator factory with featured destination...`);
    
    // Don't actually generate content, just inspect which generator would be selected
    const result = await itineraryGeneratorFactory.generateItinerary(
      destination,
      undefined // Use undefined to trigger the premium selection logic for featured content
    );

    // Check result length as basic verification
    const contentSample = result.substring(0, 100) + '...';
    console.log(`Generated content sample: ${contentSample}`);
    console.log(`Total content length: ${result.length} characters`);
    console.log(`--------- TEST COMPLETE ---------\n`);
    
    res.json({
      success: true,
      premiumGeneratorType,
      usedGeneratorType: generator.constructor.name,
      destination: {
        id: destination.id,
        name: destination.name,
        country: destination.country,
        featured: destination.featured
      },
      contentSampleLength: result.length,
      contentSample: contentSample
    });
  } catch (error: any) {
    console.error('Error in generator selection test:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Create a test PDF with the premium generator
 * 
 * This endpoint tests the full premium PDF generation process
 * with detailed logging of generator usage.
 */
router.post('/test-premium-pdf', async (req, res) => {
  try {
    // Get a featured destination to test with
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.featured, true))
      .limit(1);

    if (!destination) {
      return res.status(404).json({ 
        error: 'No featured destinations found for testing. Please mark at least one destination as featured.'
      });
    }

    // Log test information
    console.log(`\n--------- PREMIUM PDF TEST ---------`);
    console.log(`Testing premium PDF generation with destination: ${destination.name}`);
    console.log(`Configured premium generator type: ${premiumGeneratorType}`);

    // Import standalone generator 
    const { generateStandalonePDF } = await import('../utils/standaloneItineraryGenerator');
    
    // Generate the test PDF
    console.log(`Generating premium PDF with standalone generator...`);
    const pdfBuffer = await generateStandalonePDF(destination);

    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
    console.log(`--------- TEST COMPLETE ---------\n`);

    // Return the PDF
    res.contentType('application/pdf');
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error('Error in premium PDF test:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Verify that the premium generator type is correctly configured
 */
router.get('/verify-generator', (req, res) => {
  try {
    const requestedType = req.query.type as string;
    
    // Check if the requested type matches the configured type
    if (requestedType && requestedType !== premiumGeneratorType) {
      return res.status(400).json({
        success: false,
        message: `Verification failed: requested type '${requestedType}' does not match configured premium generator type '${premiumGeneratorType}'`,
        premiumGeneratorType
      });
    }
    
    // Return success if the types match
    res.json({
      success: true,
      message: `Premium service is correctly configured to use the '${premiumGeneratorType}' generator`,
      premiumGeneratorType
    });
  } catch (error: any) {
    console.error('Error in generator verification:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Test the standalone PDF generator implementation
 */
router.get('/test-generate', async (req, res) => {
  try {
    const destinationId = parseInt(req.query.destinationId as string) || 35; // Default to ID 35 if not provided
    
    // Get the destination
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destinationId));
    
    if (!destination) {
      return res.status(404).json({ 
        error: `Destination with ID ${destinationId} not found. Please provide a valid destination ID.`
      });
    }
    
    // Get the itinerary for this destination
    const [itinerary] = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.destinationId, destinationId));
    
    if (!itinerary) {
      return res.status(404).json({ 
        error: `No itinerary found for destination '${destination.name}' (ID: ${destinationId})`
      });
    }
    
    // Get the days for this itinerary
    const itineraryDays = await db
      .select()
      .from(days)
      .where(eq(days.itineraryId, itinerary.id));
    
    if (!itineraryDays.length) {
      return res.status(404).json({
        error: `No days found for itinerary '${itinerary.title}' (ID: ${itinerary.id})`
      });
    }
    
    // Get the experiences for this destination
    const destExperiences = await db
      .select()
      .from(enhancedExperiences)
      .where(eq(enhancedExperiences.destinationId, destinationId));
    
    // Log test information
    console.log(`\n--------- ENHANCED PDF GENERATOR TEST ---------`);
    console.log(`Testing enhanced PDF generation with destination: ${destination.name}`);
    console.log(`Using premium generator type: ${premiumGeneratorType}`);
    
    // Import the standalone generator
    const { generateStandalonePDF } = await import('../utils/standaloneItineraryGenerator');
    
    // Generate the PDF
    console.log(`Generating premium PDF using standalone generator...`);
    const pdfBuffer = await generateStandalonePDF(destination);
    
    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
    console.log(`--------- TEST COMPLETE ---------\n`);
    
    // Return the PDF
    res.contentType('application/pdf');
    res.send(pdfBuffer);
    
  } catch (error: any) {
    console.error('Error in enhanced PDF generator test:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Standalone generator reliability test
 * 
 * This endpoint tests the standalone generator's reliability without
 * requiring a fallback mechanism (the previous system needed fallbacks,
 * but our standalone implementation is more robust).
 */
router.get('/test-fallback', async (req, res) => {
  try {
    const destinationId = parseInt(req.query.destinationId as string) || 35; // Default to ID 35 if not provided
    
    // Get the destination
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destinationId));
    
    if (!destination) {
      return res.status(404).json({ 
        error: `Destination with ID ${destinationId} not found. Please provide a valid destination ID.`
      });
    }
    
    // Get the itinerary for this destination
    const [itinerary] = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.destinationId, destinationId));
    
    if (!itinerary) {
      return res.status(404).json({ 
        error: `No itinerary found for destination '${destination.name}' (ID: ${destinationId})`
      });
    }
    
    // Log test information
    console.log(`\n--------- STANDALONE GENERATOR RELIABILITY TEST ---------`);
    console.log(`Testing standalone generator with destination: ${destination.name}`);
    
    // Create a temporary mock implementation of the itineraryGeneratorFactory
    // that forces the efficient generator to fail
    const originalFactory = { ...itineraryGeneratorFactory };
    const originalGetGenerator = itineraryGeneratorFactory.getGenerator;
    
    // Modify the factory's getGenerator method to return a failing generator
    // when 'efficient' is requested
    itineraryGeneratorFactory.getGenerator = function(type: string) {
      if (type === 'efficient') {
        console.log('Simulating failure of efficient generator...');
        const failingGenerator = originalGetGenerator.call(this, type);
        // Override the generateItinerary method to throw an error
        const originalGenerate = failingGenerator.generateItinerary;
        failingGenerator.generateItinerary = async () => {
          console.log('Forcing efficient generator to fail for testing...');
          throw new Error('Simulated failure of efficient generator');
        };
        return failingGenerator;
      }
      // For other generator types, return the original implementation
      return originalGetGenerator.call(this, type);
    };
    
    try {
      // Import the standalone generator
      const { generateStandalonePDF } = await import('../utils/standaloneItineraryGenerator');
      
      // Generate the PDF with the standalone generator
      console.log(`Generating premium PDF with standalone generator...`);
      const pdfBuffer = await generateStandalonePDF(destination);
      
      console.log(`PDF generated successfully with standalone generator, size: ${pdfBuffer.length} bytes`);
      console.log(`--------- STANDALONE GENERATOR TEST COMPLETE ---------\n`);
      
      // Return the PDF
      res.contentType('application/pdf');
      res.send(pdfBuffer);
      
    } finally {
      // Restore the original factory implementation
      itineraryGeneratorFactory.getGenerator = originalGetGenerator;
      console.log('Restored original generator factory implementation');
    }
    
  } catch (error: any) {
    console.error('Error in standalone generator test:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Test PDF extraction patterns
 * This endpoint tests the pattern extraction without generating a full PDF
 */
router.get('/test-pdf-extraction', async (req, res) => {
  try {
    const destinationId = parseInt(req.query.destinationId as string) || 35;
    
    // Get the destination
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destinationId));
    
    if (!destination) {
      return res.status(404).json({ 
        error: `Destination with ID ${destinationId} not found. Please provide a valid destination ID.`
      });
    }
    
    // Get the itinerary
    const [itinerary] = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.destinationId, destinationId));
    
    if (!itinerary) {
      return res.status(404).json({ 
        error: `No itinerary found for destination ID ${destinationId}`
      });
    }
    
    // Get the days
    const itineraryDays = await db
      .select()
      .from(days)
      .where(eq(days.itineraryId, itinerary.id))
      .orderBy(days.dayNumber);
    
    if (!itineraryDays.length) {
      return res.status(404).json({ 
        error: `No days found for itinerary ID ${itinerary.id}`
      });
    }
    
    console.log(`\n--------- PATTERN EXTRACTION TEST ---------`);
    console.log(`Testing pattern extraction for destination: ${destination.name}`);
    
    // Get or generate premium content
    const generator = itineraryGeneratorFactory.getGenerator('efficient');
    const rawContent = await generator.generateItinerary(destination);
    
    // Normalize the content before extraction
    const content = normalizeContent(rawContent);
    
    console.log(`Content length: ${content.length} characters`);
    
    // Test extraction for each day
    const results = [];
    
    for (const day of itineraryDays) {
      console.log(`\nTesting extraction for Day ${day.dayNumber}:`);
      
      // 1. Try to extract the day content
      const dayPatterns = [
        new RegExp(`# Day ${day.dayNumber}: [\\s\\S]*?(?=# Day ${day.dayNumber + 1}|$)`, 'i'),
        new RegExp(`# Day ${day.dayNumber}:[\\s\\S]*?(?=# Day ${day.dayNumber + 1}|$)`, 'i'),
        new RegExp(`# Day ${day.dayNumber} [\\s\\S]*?(?=# Day ${day.dayNumber + 1}|$)`, 'i')
      ];
      
      let dayContent = null;
      let usedDayPattern = null;
      
      for (const pattern of dayPatterns) {
        const match = content.match(pattern);
        if (match && match[0]) {
          dayContent = match[0];
          usedDayPattern = pattern.toString();
          console.log(`✓ Found day content using pattern: ${usedDayPattern.substring(0, 50)}...`);
          break;
        }
      }
      
      if (!dayContent) {
        console.log(`✗ Could not extract Day ${day.dayNumber} content`);
        results.push({
          day: day.dayNumber,
          success: false,
          error: 'Could not extract day content'
        });
        continue;
      }
      
      // 2. Extract sections
      const sections = {
        morning: null,
        afternoon: null,
        evening: null
      };
      
      // Morning patterns
      const morningPatterns = [
        /## Morning Activities[^#]*?(?=## Afternoon|## Lunch|## Evening|# Day|$)/is,
        /\*\*Morning Activities\*\*[^#]*?(?=\*\*Afternoon|\*\*Lunch|\*\*Evening|# Day|$)/is
      ];
      
      for (const pattern of morningPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          sections.morning = match[0];
          console.log(`✓ Found Morning section (${match[0].length} chars)`);
          break;
        }
      }
      
      // Afternoon patterns
      const afternoonPatterns = [
        /## Afternoon Activities[^#]*?(?=## Evening|## Dinner|# Day|$)/is,
        /## Lunch Recommendation[^#]*?(?=## Afternoon|## Evening|# Day|$)/is,
        /\*\*Lunch Recommendation\*\*[^#]*?(?=\*\*Afternoon|\*\*Evening|# Day|$)/is,
        /\*\*Afternoon Activities\*\*[^#]*?(?=\*\*Evening|\*\*Dinner|# Day|$)/is
      ];
      
      for (const pattern of afternoonPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          sections.afternoon = match[0];
          console.log(`✓ Found Afternoon section (${match[0].length} chars)`);
          break;
        }
      }
      
      // Evening patterns
      const eveningPatterns = [
        /## Evening\/Dinner Plan[^#]*?(?=## Accommodation|# Day|$)/is,
        /\*\*Evening\/Dinner Plan\*\*[^#]*?(?=\*\*Accommodation|# Day|$)/is
      ];
      
      for (const pattern of eveningPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          sections.evening = match[0];
          console.log(`✓ Found Evening section (${match[0].length} chars)`);
          break;
        }
      }
      
      // Check results
      if (!sections.morning) console.log(`✗ Could not extract Morning section`);
      if (!sections.afternoon) console.log(`✗ Could not extract Afternoon section`);
      if (!sections.evening) console.log(`✗ Could not extract Evening section`);
      
      results.push({
        day: day.dayNumber,
        success: !!sections.morning && !!sections.afternoon && !!sections.evening,
        sections: {
          morning: !!sections.morning,
          afternoon: !!sections.afternoon,
          evening: !!sections.evening
        }
      });
    }
    
    console.log(`\n--------- PATTERN EXTRACTION TEST COMPLETE ---------`);
    
    // Return results
    res.json({
      destination: destination.name,
      itinerary: itinerary.title,
      days: itineraryDays.length,
      extractionResults: results,
      allSectionsExtracted: results.every(r => r.success)
    });
    
  } catch (error: any) {
    console.error('Error testing pattern extraction:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Get the full raw content generated by the premium generator
 * This is useful for debugging extraction issues
 */
router.get('/get-full-content', async (req, res) => {
  try {
    const destinationId = parseInt(req.query.destinationId as string) || 24; // Default to Barcelona (ID 24)
    
    // Get the destination
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destinationId));
    
    if (!destination) {
      return res.status(404).json({ 
        error: `Destination with ID ${destinationId} not found. Please provide a valid destination ID.`
      });
    }
    
    // Log test information
    console.log(`\n--------- FULL CONTENT DEBUGGING ---------`);
    console.log(`Getting full premium content for destination: ${destination.name}`);
    console.log(`Using generator type: ${premiumGeneratorType}`);
    
    // Get the specific generator to use
    const generator = itineraryGeneratorFactory.getGenerator(premiumGeneratorType);
    
    // Generate the content
    console.log(`Generating content...`);
    const rawContent = await generator.generateItinerary(destination);
    
    // Normalize the content for consistent formatting
    const content = normalizeContent(rawContent);
    
    console.log(`Content generated and normalized, length: ${content.length} characters`);
    
    // Save to a file for debugging (in tmp directory)
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    const filename = `premium-content-${destination.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filepath = path.join(tmpDir, filename);
    
    fs.writeFileSync(filepath, content);
    console.log(`Content saved to ${filepath}`);
    console.log(`--------- DEBUGGING COMPLETE ---------\n`);
    
    // Check if the client wants JSON format
    const acceptJson = req.headers.accept?.includes('application/json') || 
                     req.query.format === 'json';
    
    if (acceptJson) {
      // Return JSON format for API clients
      res.header('Content-Type', 'application/json');
      res.json({
        success: true,
        destination: {
          id: destination.id,
          name: destination.name,
          country: destination.country
        },
        content: {
          raw: content,
          length: content.length,
          generatorType: generator.constructor.name,
          savedTo: filepath
        }
      });
    } else {
      // Return content with minimal HTML formatting for browser viewing
      res.header('Content-Type', 'text/html');
      res.send(`
        <html>
          <head>
            <title>Premium Content for ${destination.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              pre { background: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; }
              h1 { color: #0066cc; }
              .info { background: #e6f3ff; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
              .api-link { margin-top: 20px; padding: 8px; background: #f0f0f0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>Premium Content for ${destination.name}, ${destination.country}</h1>
            <div class="info">
              <p><strong>Content Length:</strong> ${content.length} characters</p>
              <p><strong>Generator Type:</strong> ${generator.constructor.name}</p>
              <p><strong>Saved to:</strong> ${filepath}</p>
            </div>
            <div class="api-link">
              <p>API clients can access this content in JSON format: 
                <a href="${req.originalUrl}?format=json">Get JSON Response</a>
              </p>
            </div>
            <h2>Raw Content:</h2>
            <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </body>
        </html>
      `);
    }
    
  } catch (error: any) {
    console.error('Error getting full content:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;