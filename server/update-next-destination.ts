import { db } from './db';
import { destinations, regions } from '../shared/schema';
import { eq, gt, lt, and, isNull } from 'drizzle-orm';
import OpenAI from "openai";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This script finds the next destination that needs rich content
 * and updates it with AI-generated information
 */
async function updateNextDestination() {
  try {
    console.log('Starting destination update...');

    // Get all regions
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions`);
    
    // Find the next destination needing update (has a region ID but short description)
    const shortDescriptionThreshold = 150; // Threshold to determine if content is generated
    // Get all destinations with IDs > 33
    const allDestinations = await db.select()
      .from(destinations)
      .where(
        and(
          gt(destinations.id, 33),
          gt(destinations.regionId, 0) // Ensure valid region ID
        )
      );
    
    // Find the first one with a short description
    const nextDestination = allDestinations.find(dest => 
      dest.description && dest.description.length < shortDescriptionThreshold
    );
    
    if (!nextDestination) {
      console.log('No more destinations need updating!');
      return;
    }
    
    console.log(`Processing ${nextDestination.name}...`);
    
    // Generate best time to visit based on region
    let bestTimeToVisit = '';
    
    const region = allRegions.find(r => r.id === nextDestination.regionId);
    if (region) {
      switch (region.name) {
        case 'Europe':
          bestTimeToVisit = 'May to September for warm weather, December for holiday markets';
          break;
        case 'Asia':
          bestTimeToVisit = 'October to April for pleasant temperatures and less rainfall';
          break;
        case 'North America':
          bestTimeToVisit = 'June to September for summer activities, October for fall colors';
          break;
        case 'South America':
          bestTimeToVisit = 'December to March for warm weather in most regions';
          break;
        case 'Africa':
          bestTimeToVisit = 'May to October for safaris, varies by specific region';
          break;
        case 'Oceania':
          bestTimeToVisit = 'December to February for summer activities, June to August for skiing';
          break;
        default:
          bestTimeToVisit = 'Varies throughout the year, check local advisories';
      }
    }

    // Generate enhanced content with OpenAI
    const prompt = `
    Provide detailed information about ${nextDestination.name}, ${nextDestination.country} for a travel guide. Include:
    1. A rich, evocative description (approx. 150 words)
    2. At least 3 practical local tips for travelers
    3. A brief overview of the local cuisine (3-4 sentences)
    4. A concise description of the geography (2-3 sentences)
    5. A summary of the local culture (3-4 sentences)

    Format as JSON with these keys: description, localTips, cuisine, geography, culture
    `;

    try {
      console.log(`Generating enhanced content for ${nextDestination.name}...`);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = JSON.parse(response.choices[0].message.content);
      console.log(`Successfully generated content for ${nextDestination.name}`);

      // Update the destination with the enhanced content
      await db.update(destinations)
        .set({
          description: content.description,
          bestTimeToVisit: bestTimeToVisit,
          localTips: content.localTips,
          geography: content.geography, 
          culture: content.culture,
          cuisine: content.cuisine
        })
        .where(eq(destinations.id, nextDestination.id));
        
      console.log(`Updated ${nextDestination.name} with enhanced content`);

    } catch (aiError) {
      console.error(`Error generating content for ${nextDestination.name}:`, aiError);
      
      // Still update the best time to visit even if OpenAI fails
      await db.update(destinations)
        .set({
          bestTimeToVisit: bestTimeToVisit
        })
        .where(eq(destinations.id, nextDestination.id));
        
      console.log(`Updated ${nextDestination.name} with basic information`);
    }
    
    console.log('Destination update completed');
    
  } catch (error) {
    console.error('Destination update failed:', error);
  }
}

// Run the function
updateNextDestination().then(() => {
  console.log('Update script completed');
  process.exit(0);
}).catch(error => {
  console.error('Update script failed:', error);
  process.exit(1);
});