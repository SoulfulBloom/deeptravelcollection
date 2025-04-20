import { db } from './db';
import { destinations, regions } from '../shared/schema';
import { eq, gt } from 'drizzle-orm';
import OpenAI from "openai";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This script updates the newly added destinations with region information
 * and generates basic content for them.
 */
async function updateNewDestinations() {
  try {
    console.log('Starting destination update...');

    // Get all regions
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions`);
    
    // Get all new destinations (id > 33)
    const allDestinations = await db.select().from(destinations).where(gt(destinations.id, 33));
    console.log(`Found ${allDestinations.length} new destinations`);
    
    // Map of region IDs with correct IDs from the database
    const regionMappings: Record<string, number> = {
      'Prague': 13, // Europe
      'Amsterdam': 13, // Europe
      'Vienna': 13, // Europe
      'Singapore': 14, // Asia
      'Hanoi': 14, // Asia
      'Mexico City': 15, // North America
      'Vancouver': 15, // North America  
      'Buenos Aires': 16, // South America
      'Cusco': 16, // South America
      'Cartagena': 16, // South America
      'Marrakech': 17, // Africa
      'Cape Town': 17, // Africa
      'Zanzibar': 17, // Africa
      'Cairo': 17, // Africa
    };
    
    // For each destination
    for (const destination of allDestinations) {
      try {
        console.log(`Processing ${destination.name}...`);
        
        // Generate best time to visit based on region
        const regionId = regionMappings[destination.name] || destination.regionId;
        let bestTimeToVisit = '';
        
        const region = allRegions.find(r => r.id === regionId);
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
        // We'll use OpenAI to generate a richer description and local tips
        const prompt = `
        Provide detailed information about ${destination.name}, ${destination.country} for a travel guide. Include:
        1. A rich, evocative description (approx. 150 words)
        2. At least 3 practical local tips for travelers
        3. A brief overview of the local cuisine (3-4 sentences)
        4. A concise description of the geography (2-3 sentences)
        5. A summary of the local culture (3-4 sentences)

        Format as JSON with these keys: description, localTips, cuisine, geography, culture
        `;

        try {
          console.log(`Generating enhanced content for ${destination.name}...`);
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
          });

          const content = JSON.parse(response.choices[0].message.content);
          console.log(`Successfully generated content for ${destination.name}`);

          // Update the destination with the enhanced content and the correct region ID
          await db.update(destinations)
            .set({
              regionId: regionId,
              description: content.description,
              bestTimeToVisit: bestTimeToVisit,
              localTips: content.localTips,
              geography: content.geography, 
              culture: content.culture,
              cuisine: content.cuisine
            })
            .where(eq(destinations.id, destination.id));
            
          console.log(`Updated ${destination.name} with enhanced content`);

        } catch (aiError) {
          console.error(`Error generating content for ${destination.name}:`, aiError);
          
          // Still update the region ID even if OpenAI fails
          await db.update(destinations)
            .set({
              regionId: regionId,
              bestTimeToVisit: bestTimeToVisit
            })
            .where(eq(destinations.id, destination.id));
            
          console.log(`Updated ${destination.name} with basic region information`);
        }
        
      } catch (destError) {
        console.error(`Error processing ${destination.name}:`, destError);
      }
    }
    
    console.log('Destination update completed');
    
  } catch (error) {
    console.error('Destination update failed:', error);
  }
}

// Run the function
updateNewDestinations().then(() => {
  console.log('Update script completed');
  process.exit(0);
}).catch(error => {
  console.error('Update script failed:', error);
  process.exit(1);
});