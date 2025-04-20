import OpenAI from "openai";
import { db } from "./db";
import { 
  destinations, 
  itineraries, 
  days,
  collections,
  collectionItems,
  enhancedExperiences,
  InsertItinerary,
  InsertDay,
  InsertEnhancedExperience
} from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Add more destinations to enrich the database
const additionalDestinations = [
  {
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    description: "Ancient temples, traditional tea houses, and serene gardens make Kyoto the cultural heart of Japan.",
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.9"
  },
  {
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    description: "A vibrant city where ancient traditions blend with modern influences in a labyrinth of souks and medinas.",
    imageUrl: "https://images.unsplash.com/photo-1597212720489-a3064ec8a672?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  {
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    description: "Colorful hillside neighborhoods, historic trams, and delicious seafood make Lisbon a charming European gem.",
    imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  {
    name: "Vancouver",
    country: "Canada",
    region: "North America",
    description: "Mountains meet the sea in this outdoor-lover's paradise with diverse neighborhoods and farm-to-table cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  {
    name: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    description: "Passionate tango, impressive architecture, and vibrant nightlife make Buenos Aires the 'Paris of South America'.",
    imageUrl: "https://images.unsplash.com/photo-1612294037637-ec400b95cb8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  }
];

// Generate detailed destination itinerary
async function generateDestinationItinerary(name: string, country: string) {
  try {
    console.log(`Generating comprehensive itinerary for ${name}, ${country}...`);
    
    const prompt = `
    Create a detailed 3-day itinerary for ${name}, ${country}.
    Provide information in the following JSON structure:
    
    {
      "title": "A catchy title for the 3-day itinerary",
      "days": [
        {
          "day": 1,
          "title": "Day 1 title focusing on a main theme",
          "description": "Detailed 250-word description of Day 1 activities, with specific locations and insider knowledge",
          "morningActivity": "Specific morning activity with location name",
          "afternoonActivity": "Specific afternoon activity with location name",
          "eveningActivity": "Specific evening activity or dining with location name"
        },
        {
          "day": 2,
          "title": "Day 2 title focusing on a different theme",
          "description": "Detailed 250-word description of Day 2 activities, with specific locations and insider knowledge",
          "morningActivity": "Specific morning activity with location name",
          "afternoonActivity": "Specific afternoon activity with location name",
          "eveningActivity": "Specific evening activity or dining with location name"
        },
        {
          "day": 3,
          "title": "Day 3 title focusing on a third theme",
          "description": "Detailed 250-word description of Day 3 activities, with specific locations and insider knowledge",
          "morningActivity": "Specific morning activity with location name",
          "afternoonActivity": "Specific afternoon activity with location name",
          "eveningActivity": "Specific evening activity or dining with location name"
        }
      ]
    }
    
    Be specific, authentic, and include location-specific activities. No placeholders.
    Include detailed insider knowledge that would make the itinerary special.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep local knowledge of destinations around the world. You provide specific, authentic travel recommendations with insider tips that go beyond typical tourist experiences."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error(`Error generating itinerary for ${name}:`, error);
    throw error;
  }
}

// Generate enhanced experiences for a destination
async function generateEnhancedExperiences(name: string, country: string) {
  try {
    console.log(`Generating enhanced experiences for ${name}, ${country}...`);
    
    const prompt = `
    Create 3 unique enhanced experiences for travelers visiting ${name}, ${country}.
    Provide information in the following JSON format:
    
    {
      "experiences": [
        {
          "title": "Unique experience title 1",
          "description": "Detailed 200-word description of the first experience with specific locations and activities",
          "price": A realistic price in USD (number only, no currency symbol),
          "duration": "Duration in hours or days (e.g., '3 hours' or '2 days')"
        },
        {
          "title": "Unique experience title 2",
          "description": "Detailed 200-word description of the second experience with specific locations and activities",
          "price": A realistic price in USD (number only, no currency symbol),
          "duration": "Duration in hours or days (e.g., '3 hours' or '2 days')"
        },
        {
          "title": "Unique experience title 3",
          "description": "Detailed 200-word description of the third experience with specific locations and activities",
          "price": A realistic price in USD (number only, no currency symbol),
          "duration": "Duration in hours or days (e.g., '3 hours' or '2 days')"
        }
      ]
    }
    
    Focus on authentic local experiences that provide deep cultural immersion or unique activities that travelers can't easily find on their own.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep local knowledge who specializes in creating unique, authentic experiences for travelers that connect them with local culture, nature, and traditions."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error(`Error generating enhanced experiences for ${name}:`, error);
    throw error;
  }
}

// Generate collection content for a specific collection and destination
async function generateCollectionContent(collectionName: string, destinationName: string, country: string) {
  try {
    console.log(`Generating ${collectionName} content for ${destinationName}, ${country}...`);
    
    const prompt = `
    Create content for ${destinationName}, ${country} that fits into a collection called "${collectionName}".
    Provide information in the following JSON format:
    
    {
      "highlight": "A compelling 1-2 sentence highlight about how this destination fits the ${collectionName} theme (max 100 chars)",
      "note": "A detailed insider tip related to the ${collectionName} theme for this destination (max 150 chars)"
    }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep knowledge about how destinations fit into various themed travel collections. You provide specific, authentic information that highlights the unique aspects of each destination."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error(`Error generating collection content for ${destinationName} in ${collectionName}:`, error);
    throw error;
  }
}

// Main function to enhance all content
async function enhanceAllContent() {
  try {
    console.log("Starting comprehensive content enhancement...");
    
    // 1. Add missing destinations
    console.log("Step 1: Adding new destinations...");
    for (const destData of additionalDestinations) {
      // Check if destination already exists
      const [existingDest] = await db.select()
        .from(destinations)
        .where(eq(destinations.name, destData.name))
        .where(eq(destinations.country, destData.country));
      
      if (existingDest) {
        console.log(`Destination ${destData.name} already exists, skipping...`);
        continue;
      }
      
      // Get region ID by name
      const regionName = destData.region;
      // First find a destination with this region to get the regionId
      const [destWithRegion] = await db.select()
        .from(destinations)
        .where(eq(destinations.country, destData.country))
        .limit(1);
        
      if (!destWithRegion) {
        console.log(`No existing destination found for region reference, skipping ${destData.name}...`);
        continue;
      }
      
      // Insert new destination
      const [newDestination] = await db.insert(destinations)
        .values({
          name: destData.name,
          country: destData.country,
          // Use regionId from the existing destination with similar region
          regionId: destWithRegion.regionId,
          description: destData.description,
          imageUrl: destData.imageUrl,
          rating: destData.rating,
          featured: false
        })
        .returning();
      
      console.log(`Added new destination: ${newDestination.name} (ID: ${newDestination.id})`);
    }
    
    // 2. Generate itineraries for destinations that don't have them
    console.log("\nStep 2: Generating missing itineraries...");
    
    const destinationsWithoutItineraries = await db.select()
      .from(destinations)
      .leftJoin(itineraries, eq(destinations.id, itineraries.destinationId))
      .where(eq(itineraries.id, null));
    
    console.log(`Found ${destinationsWithoutItineraries.length} destinations without itineraries`);
    
    for (const { destinations: destination } of destinationsWithoutItineraries) {
      console.log(`Processing itinerary for ${destination.name}, ${destination.country}...`);
      
      try {
        // Generate detailed content with OpenAI
        const itineraryContent = await generateDestinationItinerary(destination.name, destination.country);
        
        // Insert the itinerary
        const [newItinerary] = await db.insert(itineraries)
          .values({
            destinationId: destination.id,
            title: itineraryContent.title,
            duration: 3,
            description: `Explore the best of ${destination.name} in this carefully crafted 3-day itinerary.`,
            content: `Experience the highlights of ${destination.name} through local culture, cuisine, and attractions.`
          })
          .returning();
          
        console.log(`Added itinerary: ${newItinerary.title} (ID: ${newItinerary.id})`);
        
        // Insert days
        for (const day of itineraryContent.days) {
          await db.insert(days).values({
            itineraryId: newItinerary.id,
            dayNumber: day.day,
            title: day.title,
            morningActivity: day.morningActivity,
            afternoonActivity: day.afternoonActivity,
            eveningActivity: day.eveningActivity,
            activities: [day.morningActivity, day.afternoonActivity, day.eveningActivity]
          });
        }
        
        console.log(`Added 3 days to itinerary for ${destination.name}`);
      } catch (error) {
        console.error(`Error processing ${destination.name}:`, error);
      }
    }
    
    // 3. Generate enhanced experiences for all destinations
    console.log("\nStep 3: Generating enhanced experiences...");
    
    const allDestinations = await db.select().from(destinations);
    
    for (const destination of allDestinations) {
      // Check if destination already has enhanced experiences
      const existingExperiences = await db.select()
        .from(enhancedExperiences)
        .where(eq(enhancedExperiences.destinationId, destination.id));
      
      if (existingExperiences.length > 0) {
        console.log(`${destination.name} already has ${existingExperiences.length} enhanced experiences, skipping...`);
        continue;
      }
      
      console.log(`Generating enhanced experiences for ${destination.name}...`);
      
      try {
        // Generate experiences with OpenAI
        const experiencesContent = await generateEnhancedExperiences(destination.name, destination.country);
        
        // Add experiences to database
        for (const exp of experiencesContent.experiences) {
          const insertExperience: InsertEnhancedExperience = {
            destinationId: destination.id,
            title: exp.title,
            description: exp.description,
            price: parseInt(exp.price.toString()),
            duration: exp.duration,
          };
          
          await db.insert(enhancedExperiences).values(insertExperience);
        }
        
        console.log(`Added ${experiencesContent.experiences.length} enhanced experiences for ${destination.name}`);
      } catch (error) {
        console.error(`Error adding experiences for ${destination.name}:`, error);
      }
    }
    
    // 4. Add destinations to collections they're not already in
    console.log("\nStep 4: Enriching collection items...");
    
    const allCollections = await db.select().from(collections);
    
    // For each collection
    for (const collection of allCollections) {
      console.log(`Processing collection: ${collection.name}`);
      
      // Get current collection items
      const currentItems = await db.select()
        .from(collectionItems)
        .where(eq(collectionItems.collectionId, collection.id));
      
      console.log(`${collection.name} currently has ${currentItems.length} items`);
      
      // Limit to at most 8 items per collection
      if (currentItems.length >= 8) {
        console.log(`${collection.name} already has ${currentItems.length} items, skipping...`);
        continue;
      }
      
      // Get destinations not already in this collection
      const destinationsInCollection = currentItems.map(item => item.destinationId);
      
      // Find destinations that aren't already in this collection, limit to what we need
      const destinationsToAdd = allDestinations
        .filter(dest => !destinationsInCollection.includes(dest.id))
        .slice(0, 8 - currentItems.length);
      
      console.log(`Adding ${destinationsToAdd.length} destinations to ${collection.name}...`);
      
      // Add each destination to the collection
      for (const [index, destination] of destinationsToAdd.entries()) {
        try {
          // Generate collection-specific content
          const collectionContent = await generateCollectionContent(
            collection.name,
            destination.name,
            destination.country
          );
          
          // Insert collection item
          await db.insert(collectionItems).values({
            collectionId: collection.id,
            destinationId: destination.id,
            position: currentItems.length + index + 1,
            highlight: collectionContent.highlight,
            note: collectionContent.note
          });
          
          console.log(`Added ${destination.name} to ${collection.name} collection with AI-generated content`);
        } catch (error) {
          console.error(`Error adding ${destination.name} to ${collection.name}:`, error);
        }
      }
    }
    
    console.log("\n✅ All content enhancement completed successfully!");
  } catch (error) {
    console.error("Error enhancing content:", error);
  }
}

// Run the function
enhanceAllContent().then(() => {
  console.log('Enhancement completed');
  process.exit(0);
}).catch(error => {
  console.error('Enhancement failed:', error);
  process.exit(1);
});