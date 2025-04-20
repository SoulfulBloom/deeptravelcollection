import { db } from './db';
import { destinations, regions } from '../shared/schema';
import { eq, gt, lt, and } from 'drizzle-orm';
import OpenAI from "openai";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This script finds destinations that need rich content
 * and updates them with AI-generated information
 * similar to what was done for Cusco
 */
async function populateAllDestinations() {
  try {
    console.log('Starting destination content population...');

    // Get all regions
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions`);
    
    // Get all destinations that need enhancement
    // We'll consider a destination to need enhancement if it has a short description
    const allDestinations = await db.select()
      .from(destinations)
      .where(gt(destinations.id, 33)); // All new destinations
    
    console.log(`Found ${allDestinations.length} destinations to check`);
    
    // Find the destinations that need enhancement (short description)
    const destinationsToEnhance = allDestinations.filter(dest => 
      !dest.description || dest.description.length < 500
    );
    
    console.log(`Found ${destinationsToEnhance.length} destinations that need enhancement`);
    
    if (destinationsToEnhance.length === 0) {
      console.log('All destinations have rich content!');
      return;
    }
    
    // Process a batch of destinations (up to 3 at a time to avoid timeout)
    const batch = destinationsToEnhance.slice(0, 3);
    console.log(`Processing a batch of ${batch.length} destinations`);
    
    // Process each destination in the batch
    for (const destination of batch) {
      try {
        console.log(`Processing ${destination.name}...`);
        
        // Set best time to visit based on region
        let bestTimeToVisit = '';
        const region = allRegions.find(r => r.id === destination.regionId);
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
        
        // Generate content with OpenAI - similar to what was done for Cusco
        const prompt = `
        Generate high-quality, detailed travel guide content for ${destination.name}, ${destination.country}, following this structure:
        
        1. An evocative, rich description (200-250 words) that captures the essence of ${destination.name} as a travel destination. Include sensory details, cultural significance, and what makes it special.
        
        2. Three specific, practical local tips for travelers that aren't obvious from guidebooks - insider advice about navigating the city, local customs, or hidden gems.
        
        3. A detailed description of the local geography (3-4 sentences) that paints a picture of the physical setting, notable landmarks, and natural features.
        
        4. A cultural overview (4-5 sentences) that captures the unique cultural identity, including historical context, traditions, arts, and the blend of influences that shape the destination.
        
        5. A description of the local cuisine (4-5 sentences) highlighting signature dishes, food culture, and dining experiences visitors shouldn't miss.
        
        Format the response as a JSON object with these keys:
        description, localTips (array of 3 strings), geography, culture, cuisine
        
        Make the content authentic, evocative, and specific to ${destination.name} - avoid generic travel writing. Think of this as premium travel guide content.
        `;
        
        console.log(`Generating content for ${destination.name}...`);
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          response_format: { type: "json_object" }
        });
        
        const content = JSON.parse(response.choices[0].message.content);
        console.log(`Successfully generated content for ${destination.name}`);
        
        // Update the destination
        await db.update(destinations)
          .set({
            description: content.description,
            bestTimeToVisit: bestTimeToVisit,
            localTips: content.localTips,
            geography: content.geography,
            culture: content.culture,
            cuisine: content.cuisine
          })
          .where(eq(destinations.id, destination.id));
          
        console.log(`Updated ${destination.name} with rich content`);
        
      } catch (destError) {
        console.error(`Error processing ${destination.name}:`, destError);
      }
    }
    
    console.log('Batch processing completed. Run this script again to process more destinations.');
    
  } catch (error) {
    console.error('Destination population failed:', error);
  }
}

// Run the function
populateAllDestinations().then(() => {
  console.log('Population script completed');
  process.exit(0);
}).catch(error => {
  console.error('Population script failed:', error);
  process.exit(1);
});