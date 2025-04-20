/**
 * Test script to generate a single day itinerary with enhanced formatting
 * Demonstrates the detailed day format with specific location information
 */

import OpenAI from 'openai';
import { PREMIUM_SYSTEM_PROMPT } from './services/optimizedPrompts';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = 'gpt-4o';

async function generateDetailedDayItinerary(destination: string, country: string, dayNumber: number = 1) {
  console.log(`Generating detailed day itinerary for ${destination}, ${country} (Day ${dayNumber})...`);
  
  const prompt = `
Create a detailed day itinerary for Day ${dayNumber} in ${destination}, ${country}.

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
    
    // Save to file
    const outputDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `detailed-day-${destination.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    const outputPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(outputPath, content);
    console.log(`Saved detailed day itinerary to: ${outputPath}`);
    
    // Output a preview
    console.log('\nContent Preview:');
    console.log(content);
    
    return content;
  } catch (error: any) {
    console.error('Error generating detailed day itinerary:', error);
    throw new Error(`Failed to generate detailed day itinerary: ${error.message}`);
  }
}

// Run the test for Amsterdam
const destination = 'Amsterdam';
const country = 'Netherlands';

generateDetailedDayItinerary(destination, country)
  .catch(error => {
    console.error('Failed to generate day itinerary:', error);
  });