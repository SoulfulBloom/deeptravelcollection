// server/test-chunked-generator.ts
import { db } from './db';
import { destinations } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { itineraryGeneratorFactory } from './services/itineraryGeneratorFactory';
import fs from 'fs';
import path from 'path';

/**
 * Test script for the chunked itinerary generator
 * Usage: NODE_ENV=development tsx server/test-chunked-generator.ts
 */
async function testChunkedGenerator() {
  try {
    console.log('Starting test of chunked itinerary generator...');
    
    // Get a real destination to test with
    const destinationId = 35; // Amsterdam
    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.id, destinationId)
    });

    if (!destination) {
      console.error(`Destination with ID ${destinationId} not found`);
      return;
    }

    console.log(`Testing with destination: ${destination.name}, ${destination.country}`);
    
    // Generate itinerary using the factory to get the chunked generator
    console.time('Total generation time');
    const itinerary = await itineraryGeneratorFactory.generateItinerary(destination, 'chunked');
    console.timeEnd('Total generation time');
    
    console.log(`Generated itinerary with ${itinerary.length} characters`);
    
    // Save to file
    const outputDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `chunked-${destination.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    const outputPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(outputPath, itinerary);
    console.log(`Saved itinerary to: ${outputPath}`);
    
    // Output a preview
    console.log('\nContent Preview (first 500 chars):');
    console.log(itinerary.substring(0, 500) + '...');
    
  } catch (error: any) {
    console.error('Error testing chunked generator:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testChunkedGenerator().catch(console.error);