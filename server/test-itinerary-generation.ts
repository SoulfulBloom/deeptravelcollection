// server/test-itinerary-generation.ts
import OpenAI from 'openai';
import { db } from './db';
import { destinations } from '../shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Test function to directly debug the OpenAI prompt and response for itinerary generation
 * Usage: NODE_ENV=development tsx server/test-itinerary-generation.ts
 */
async function testItineraryGeneration() {
  // Get a real destination to test with
  const destinationId = 35; // Amsterdam
  const destination = await db.query.destinations.findFirst({
    where: eq(destinations.id, destinationId)
  });

  if (!destination) {
    console.error(`Destination with ID ${destinationId} not found`);
    return;
  }

  console.log(`Testing itinerary generation for: ${destination.name}, ${destination.country}`);
  console.log(`Token limit set to: 2000 tokens`);
  
  // Simplified system prompt for testing
  const systemPrompt = `You are an expert travel guide creator. Use specific names and details for all locations and activities. Provide detailed recommendations based on local knowledge.`;

  // Simplified user prompt for testing
  const prompt = `Create a 3-day travel itinerary for ${destination.name}, ${destination.country} with the following for each day:
  
1. Morning activity with specific location name and brief description
2. Lunch recommendation at a specific local restaurant with one dish to try
3. Afternoon activity with specific location name
4. Dinner recommendation at a specific restaurant
5. One practical travel tip

Include actual names for all locations - never generic descriptions.
  `;
  
  console.log('Starting API call to OpenAI...');
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system", 
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000 // Using a moderate token limit as a test
    });
    
    console.log(`Received response from OpenAI. Content length: ${completion.choices[0].message.content?.length || 0} characters`);
    console.log(`Completed tokens: ${completion.usage?.completion_tokens || 'unknown'}`);
    console.log(`Total tokens used: ${completion.usage?.total_tokens || 'unknown'}`);
    
    // Save the response to a file for inspection
    const content = completion.choices[0].message.content || '';
    const outputDir = path.join(__dirname, '..', 'tmp');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${destination.name.toLowerCase().replace(/\s+/g, '-')}-test-itinerary.txt`);
    fs.writeFileSync(outputPath, content);
    
    console.log(`Test itinerary saved to: ${outputPath}`);
    console.log('\nResponse preview (first 500 chars):');
    console.log(content.substring(0, 500) + '...');
    
  } catch (error: any) {
    console.error('Error generating content with OpenAI:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test function
testItineraryGeneration().catch(console.error);