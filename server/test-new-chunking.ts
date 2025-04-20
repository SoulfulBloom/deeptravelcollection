// server/test-new-chunking.ts
import OpenAI from 'openai';
import { db } from './db';
import { destinations } from '../shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Configure OpenAI with timeout and retries
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 3
});

/**
 * Test function for the new chunking approach
 * Usage: NODE_ENV=development tsx server/test-new-chunking.ts
 */
async function testChunkingApproach() {
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
    const durationDays = 5; // Use a shorter duration for testing
    const theme = 'authentic local';

    console.log(`Testing chunking approach for: ${destinationName}, ${destinationCountry} (${durationDays} days)`);
    
    // Base system prompt - keep it concise
    const baseSystemPrompt = `You are an expert travel guide creator specializing in immersive, detailed itineraries. 
Use specific names, addresses, and practical information. NEVER use generic descriptions.
Imagine you are a local expert who has lived in ${destinationName}, ${destinationCountry} for 20+ years.`;

    let fullItinerary = '';

    // CHUNK 1: Introduction + first part of itinerary
    console.log('Generating chunk 1: Introduction + first part of itinerary...');
    
    const chunkDays = durationDays <= 5 ? 3 : Math.ceil(durationDays / 2);
    const chunk1Prompt = `Create the first part of a premium ${durationDays}-day travel itinerary for ${destinationName}, ${destinationCountry}, focusing on ${theme} experiences.

Begin with:
1. A captivating introduction to ${destinationName}, including:
   - What makes this destination special
   - Geography, climate, and best times to visit
   - Cultural significance and unique characteristics

2. Detailed daily itineraries for Days 1-${chunkDays} with:
   - Morning, lunch, afternoon, and evening recommendations with specific location names and addresses
   - Costs in local currency and time estimates for each activity
   - Specific restaurant recommendations with dish names
   - Historical context and insider tips for each location
   - One off-the-beaten-path experience each day

Format with clear headings for the Introduction and each day. Use specific names for all attractions, restaurants, and activities.`;

    console.time('Chunk 1 generation time');
    const chunk1Completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: chunk1Prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    console.timeEnd('Chunk 1 generation time');
    
    const chunk1Content = chunk1Completion.choices[0].message.content || '';
    fullItinerary += chunk1Content;
    console.log(`Chunk 1 generated: ${chunk1Content.length} characters`);
    console.log(`Tokens used for chunk 1: ${chunk1Completion.usage?.total_tokens}`);
    
    // Add a small delay between API calls
    console.log('Waiting 1 second before next API call...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // CHUNK 2: Remaining days + practical information
    console.log('Generating chunk 2: Remaining days + practical information...');
    
    const remainingDaysStr = chunkDays < durationDays 
      ? `3. Continuing the itinerary, provide detailed daily plans for Days ${chunkDays + 1}-${durationDays} with the same level of detail as above.` 
      : '';
      
    const chunk2Prompt = `Create the second part of a premium travel itinerary for ${destinationName}, ${destinationCountry}.

Include:
${remainingDaysStr}

4. Essential practical information:
   - Accommodation recommendations: Three specific hotels in different price ranges with neighborhood details
   - Transportation: Best ways to get around with specific options and costs
   - Cultural etiquette: Local customs, tipping practices, and dress code considerations
   - Essential local phrases with pronunciations
   - At least 5 hidden gems not already mentioned in the daily itineraries

Format with clear section headings and maintain the same detailed style as the first part of the itinerary.`;

    console.time('Chunk 2 generation time');
    const chunk2Completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: chunk1Content.slice(-1000) }, // Pass the end of previous chunk for context
        { role: "user", content: chunk2Prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    console.timeEnd('Chunk 2 generation time');
    
    const chunk2Content = chunk2Completion.choices[0].message.content || '';
    fullItinerary += '\n\n' + chunk2Content;
    console.log(`Chunk 2 generated: ${chunk2Content.length} characters`);
    console.log(`Tokens used for chunk 2: ${chunk2Completion.usage?.total_tokens}`);
    
    // Add Deep Travel Collections footer
    fullItinerary += '\n\n---\n*Created by Deep Travel Collections - Premium Travel Itineraries*';

    // Save the result to a file
    const outputDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `chunking-test-${destinationName.toLowerCase().replace(/\s+/g, '-')}.md`);
    fs.writeFileSync(outputPath, fullItinerary);
    
    console.log(`\nFull itinerary generated successfully: ${fullItinerary.length} characters total`);
    console.log(`Total tokens used: ${(chunk1Completion.usage?.total_tokens || 0) + (chunk2Completion.usage?.total_tokens || 0)}`);
    console.log(`Result saved to: ${outputPath}`);
    
    // Output a preview of the content
    console.log('\nContent Preview (first 500 chars):');
    console.log(fullItinerary.substring(0, 500) + '...');
    
  } catch (error: any) {
    console.error('Error testing chunking approach:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
}

// Run the test function
testChunkingApproach().catch(console.error);