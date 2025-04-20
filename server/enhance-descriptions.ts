import { db } from './db';
import { destinations, regions } from '../shared/schema';
import { eq, gt } from 'drizzle-orm';
import OpenAI from "openai";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This script enhances all destination descriptions without timing out
 */
async function enhanceDescriptions() {
  try {
    console.log('Starting description enhancement...');

    // Get all regions
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions`);
    
    // Get all destinations with IDs > 33 that need enhancement (short description)
    const shortDescriptionThreshold = 150;
    const allDestinations = await db.select()
      .from(destinations)
      .where(gt(destinations.id, 33));
    
    const destinationsToEnhance = allDestinations.filter(dest => 
      !dest.description || dest.description.length < shortDescriptionThreshold
    );
    
    console.log(`Found ${destinationsToEnhance.length} destinations that need enhancement`);

    // Process each destination one by one (focus on one destination at a time)
    if (destinationsToEnhance.length === 0) {
      console.log('No destinations need enhancing!');
      return;
    }

    // Just pick the first one to process
    const destination = destinationsToEnhance[0];
    console.log(`Processing ${destination.name}...`);
    
    // Generate best time to visit based on region
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

    // Generate single enhanced content item with OpenAI
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
        .where(eq(destinations.id, destination.id));
        
      console.log(`Updated ${destination.name} with enhanced content`);
      console.log('Run this script again to process the next destination');

    } catch (aiError) {
      console.error(`Error generating content for ${destination.name}:`, aiError);
      
      // Still update the best time to visit even if OpenAI fails
      await db.update(destinations)
        .set({
          bestTimeToVisit: bestTimeToVisit
        })
        .where(eq(destinations.id, destination.id));
        
      console.log(`Updated ${destination.name} with basic information`);
    }
    
  } catch (error) {
    console.error('Description enhancement failed:', error);
  }
}

// Run the function
enhanceDescriptions().then(() => {
  console.log('Enhancement script completed');
  process.exit(0);
}).catch(error => {
  console.error('Enhancement script failed:', error);
  process.exit(1);
});