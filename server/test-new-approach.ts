// server/test-new-approach.ts
import OpenAI from 'openai';
import { db } from './db';
import { destinations } from '../shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Configure OpenAI with new settings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 seconds timeout
  maxRetries: 3 // Retry failed requests up to 3 times
});

/**
 * Test function to verify the phased approach for itinerary generation
 * Usage: NODE_ENV=development tsx server/test-new-approach.ts
 */
async function testPhasedItineraryGeneration() {
  try {
    // Get a real destination to test with
    const destinationId = 35; // Amsterdam
    const destination = await db.query.destinations.findFirst({
      where: eq(destinations.id, destinationId)
    });

    if (!destination) {
      console.error(`Destination with ID ${destinationId} not found`);
      return;
    }

    const destinationName = destination.name;
    const destinationCountry = destination.country;
    const durationDays = 3; // Shortened for testing

    console.log(`Testing phased itinerary generation for: ${destinationName}, ${destinationCountry}`);
    
    // Base system prompt for all requests
    const baseSystemPrompt = `You are an expert travel guide creator, specializing in immersive, highly detailed itineraries. 
    Use specific names and provide detailed recommendations based on local knowledge.`;

    // PHASE 1: Generate introduction and overview
    console.log('Phase 1: Generating introduction and overview...');
    const introPrompt = `Create a brief introduction to ${destinationName}, ${destinationCountry} for a travel itinerary.`;

    const introCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: introPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const introduction = introCompletion.choices[0].message.content || '';
    console.log(`Introduction generated (${introduction.length} chars)`);
    console.log(`Tokens used: ${introCompletion.usage?.total_tokens}`);
    
    // Add a delay between API calls
    console.log('Waiting 2 seconds before next API call...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // PHASE 2: Generate a sample day itinerary
    console.log('\nPhase 2: Generating day 1 itinerary...');
    const dayPrompt = `Create a brief Day 1 itinerary for ${destinationName}, ${destinationCountry} with a morning activity, lunch, and afternoon activity. Include specific location names.`;

    const dayCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: dayPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300 // Reduced token count for testing
    });
    
    const dayItinerary = dayCompletion.choices[0].message.content || '';
    console.log(`Day 1 itinerary generated (${dayItinerary.length} chars)`);
    console.log(`Tokens used: ${dayCompletion.usage?.total_tokens}`);
    
    // Output test results to a file
    const outputDir = path.join(__dirname, '..', 'tmp');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `phased-test-${destinationName.toLowerCase().replace(/\s+/g, '-')}.txt`);
    const combinedContent = `# Test Results for Phased Itinerary Generation
    
## Introduction
${introduction}

## Day 1 Itinerary
${dayItinerary}

## API Response Metrics
- Introduction tokens: ${introCompletion.usage?.total_tokens}
- Day 1 tokens: ${dayCompletion.usage?.total_tokens}
- Total character count: ${introduction.length + dayItinerary.length}
    `;
    
    fs.writeFileSync(outputPath, combinedContent);
    console.log(`\nTest results saved to: ${outputPath}`);
    console.log('Phased approach test completed successfully!');
    
  } catch (error: any) {
    console.error('Error testing phased itinerary generation:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
}

// Run the test function
testPhasedItineraryGeneration().catch(console.error);