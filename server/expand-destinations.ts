import OpenAI from "openai";
import { db } from "./db";
import { 
  destinations, 
  regions,
  itineraries, 
  days,
  enhancedExperiences,
  collections,
  collectionItems,
  InsertDestination,
  InsertItinerary,
  InsertDay,
  InsertEnhancedExperience,
  InsertCollectionItem
} from "../shared/schema";
import { eq, desc, inArray } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// List of high-quality destinations to add grouped by region
const newDestinations = [
  // Europe
  {
    name: "Prague",
    country: "Czech Republic",
    region: "Europe",
    description: "Historic bridges, cobbled streets, and Gothic architecture make Prague one of Europe's most enchanting capitals.",
    imageUrl: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    description: "Picturesque canals, vibrant art scene, and rich cultural heritage draw visitors to this bicycle-friendly Dutch capital.",
    imageUrl: "https://images.unsplash.com/photo-1584003564968-4c17607a1c96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  {
    name: "Vienna",
    country: "Austria",
    region: "Europe",
    description: "Imperial palaces, classical music heritage, and cafe culture define this elegant Austrian capital.",
    imageUrl: "https://images.unsplash.com/photo-1589380804569-064daa49998c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  // Asia
  {
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    description: "Ancient temples, traditional tea houses, and peaceful gardens make Kyoto the cultural heart of Japan.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.9"
  },
  {
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    description: "Futuristic architecture, lush gardens, and diverse culinary scene blend in this modern city-state.",
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  {
    name: "Hanoi",
    country: "Vietnam",
    region: "Asia",
    description: "Ancient temples, colonial architecture, and bustling street markets create a sensory-rich experience in Vietnam's capital.",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  // North America
  {
    name: "San Francisco",
    country: "USA",
    region: "North America",
    description: "Iconic bridges, rolling hills, and diverse neighborhoods make this coastal California city uniquely charming.",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  {
    name: "Mexico City",
    country: "Mexico",
    region: "North America",
    description: "Ancient ruins, colonial architecture, and vibrant arts scene blend in this high-altitude metropolis.",
    imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.6"
  },
  {
    name: "Vancouver",
    country: "Canada",
    region: "North America",
    description: "Mountains meet the sea in this outdoor-lover's paradise with diverse neighborhoods and farm-to-table cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  // South America
  {
    name: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    description: "Passionate tango, impressive architecture, and vibrant nightlife make Buenos Aires the 'Paris of South America'.",
    imageUrl: "https://images.unsplash.com/photo-1612294037637-ec400b95cb8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  {
    name: "Cusco",
    country: "Peru",
    region: "South America",
    description: "Ancient Incan history, colonial architecture, and proximity to Machu Picchu make this high-altitude city a traveler's dream.",
    imageUrl: "https://images.unsplash.com/photo-1580968640749-a7fb02707f4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  {
    name: "Cartagena",
    country: "Colombia",
    region: "South America",
    description: "Colorful colonial buildings, Caribbean beaches, and rich history blend in this walled coastal city.",
    imageUrl: "https://images.unsplash.com/photo-1593465678160-f99a8371f9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  // Africa
  {
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    description: "Ancient medinas, vibrant souks, and Moorish architecture create a sensory-rich experience in this historic imperial city.",
    imageUrl: "https://images.unsplash.com/photo-1597212720489-a3064ec8a672?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  },
  {
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    description: "Dramatic mountains, pristine beaches, and vibrant culture converge in this stunning coastal city.",
    imageUrl: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.8"
  },
  {
    name: "Zanzibar",
    country: "Tanzania",
    region: "Africa",
    description: "White-sand beaches, historic Stone Town, and spice plantations create an exotic island paradise.",
    imageUrl: "https://images.unsplash.com/photo-1572431447238-425af66a273b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: "4.7"
  }
];

// Generate comprehensive itinerary
async function generateDestinationItinerary(name: string, country: string) {
  try {
    console.log(`Generating comprehensive itinerary for ${name}, ${country}...`);
    
    const prompt = `
    Create a detailed 3-day itinerary for ${name}, ${country}.
    Provide information in the following JSON structure:
    
    {
      "title": "A catchy title for the itinerary (e.g. '${name} 3-Day Adventure')",
      "days": [
        {
          "day": 1,
          "title": "Day 1 title focusing on a unique aspect of ${name}",
          "description": "Detailed 250-word description of Day 1 activities, with specific locations and insider knowledge",
          "morningActivity": "Specific morning activity with location name",
          "afternoonActivity": "Specific afternoon activity with location name",
          "eveningActivity": "Specific evening activity or dining with location name"
        },
        {
          "day": 2,
          "title": "Day 2 title focusing on a different aspect of ${name}",
          "description": "Detailed 250-word description of Day 2 activities, with specific locations and insider knowledge",
          "morningActivity": "Specific morning activity with location name",
          "afternoonActivity": "Specific afternoon activity with location name",
          "eveningActivity": "Specific evening activity or dining with location name"
        },
        {
          "day": 3,
          "title": "Day 3 title focusing on a third aspect of ${name}",
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
    return null;
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
          "description": "Detailed 150-word description of the first experience with specific locations and activities",
          "specificLocation": "The specific location name where this experience takes place",
          "season": "Best season for this experience (e.g., 'Spring', 'Year-round')",
          "localTip": "An insider tip that makes this experience special (one sentence)",
          "bestTimeToVisit": "Best time of day or specific month"
        },
        {
          "title": "Unique experience title 2",
          "description": "Detailed 150-word description of the second experience with specific locations and activities",
          "specificLocation": "The specific location name where this experience takes place",
          "season": "Best season for this experience (e.g., 'Summer', 'Year-round')",
          "localTip": "An insider tip that makes this experience special (one sentence)",
          "bestTimeToVisit": "Best time of day or specific month"
        },
        {
          "title": "Unique experience title 3",
          "description": "Detailed 150-word description of the third experience with specific locations and activities",
          "specificLocation": "The specific location name where this experience takes place",
          "season": "Best season for this experience (e.g., 'Fall', 'Year-round')",
          "localTip": "An insider tip that makes this experience special (one sentence)",
          "bestTimeToVisit": "Best time of day or specific month"
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
    return null;
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
    return null;
  }
}

// Main function to expand destinations
async function expandDestinations() {
  try {
    console.log("Starting comprehensive expansion of destinations...");
    
    // Get all regions from the database
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions in the database`);
    
    // 1. Add new destinations
    console.log("\nStep 1: Adding new destinations...");
    
    const addedDestinations = [];
    for (const destData of newDestinations) {
      // Check if destination already exists
      const [existingDest] = await db.select()
        .from(destinations)
        .where(eq(destinations.name, destData.name))
        .where(eq(destinations.country, destData.country));
      
      if (existingDest) {
        console.log(`Destination ${destData.name} already exists (ID: ${existingDest.id}), skipping...`);
        continue;
      }
      
      // Find region ID
      // Find existing region or use a safe default
      let regionId;
      const region = allRegions.find(r => r.name === destData.region);
      if (region) {
        regionId = region.id;
      } else {
        // Find any existing region as fallback
        const fallbackRegion = allRegions[0];
        if (!fallbackRegion) {
          console.log(`No regions found in database, skipping ${destData.name}...`);
          continue;
        }
        regionId = fallbackRegion.id;
        console.log(`Using fallback region (${fallbackRegion.name}) for ${destData.name}`);
      }
      
      // Insert destination
      const [newDestination] = await db.insert(destinations)
        .values({
          name: destData.name,
          country: destData.country,
          regionId: regionId,
          description: destData.description,
          imageUrl: destData.imageUrl,
          rating: destData.rating,
          featured: false
        })
        .returning();
      
      console.log(`Added destination: ${newDestination.name} (ID: ${newDestination.id})`);
      addedDestinations.push(newDestination);
    }
    
    console.log(`Successfully added ${addedDestinations.length} new destinations`);
    
    // 2. Generate itineraries for new destinations
    if (addedDestinations.length > 0) {
      console.log("\nStep 2: Generating itineraries for new destinations...");
      
      for (const destination of addedDestinations) {
        console.log(`Processing itinerary for ${destination.name}, ${destination.country}...`);
        
        try {
          // Generate detailed content with OpenAI
          const itineraryContent = await generateDestinationItinerary(destination.name, destination.country);
          
          if (!itineraryContent) {
            console.log(`Failed to generate itinerary for ${destination.name}, skipping...`);
            continue;
          }
          
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
              activities: [day.morningActivity, day.afternoonActivity, day.eveningActivity],
              morningActivity: day.morningActivity,
              afternoonActivity: day.afternoonActivity,
              eveningActivity: day.eveningActivity
            });
          }
          
          console.log(`Added 3 days to itinerary for ${destination.name}`);
        } catch (error) {
          console.error(`Error processing itinerary for ${destination.name}:`, error);
        }
      }
    }
    
    // 3. Generate enhanced experiences for new destinations
    if (addedDestinations.length > 0) {
      console.log("\nStep 3: Generating enhanced experiences for new destinations...");
      
      for (const destination of addedDestinations) {
        console.log(`Generating enhanced experiences for ${destination.name}...`);
        
        try {
          // Generate experiences with OpenAI
          const experiencesContent = await generateEnhancedExperiences(destination.name, destination.country);
          
          if (!experiencesContent) {
            console.log(`Failed to generate experiences for ${destination.name}, skipping...`);
            continue;
          }
          
          // Add experiences to database
          for (const exp of experiencesContent.experiences) {
            const insertExperience: InsertEnhancedExperience = {
              destinationId: destination.id,
              title: exp.title,
              description: exp.description,
              specificLocation: exp.specificLocation,
              season: exp.season,
              localTip: exp.localTip,
              bestTimeToVisit: exp.bestTimeToVisit
            };
            
            await db.insert(enhancedExperiences).values(insertExperience);
          }
          
          console.log(`Added ${experiencesContent.experiences.length} enhanced experiences for ${destination.name}`);
        } catch (error) {
          console.error(`Error adding experiences for ${destination.name}:`, error);
        }
      }
    }
    
    // 4. Add new destinations to collections
    if (addedDestinations.length > 0) {
      console.log("\nStep 4: Adding new destinations to collections...");
      
      // Get all collections
      const allCollections = await db.select().from(collections);
      
      // Process each new destination
      for (const destination of addedDestinations) {
        console.log(`Adding ${destination.name} to collections...`);
        
        // Choose 2 random collections for each destination
        const randomCollections = allCollections.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        for (const collection of randomCollections) {
          try {
            // Get current collection items
            const currentItems = await db.select()
              .from(collectionItems)
              .where(eq(collectionItems.collectionId, collection.id))
              .orderBy(desc(collectionItems.position));
            
            const nextPosition = currentItems.length > 0 ? currentItems[0].position + 1 : 1;
            
            // Generate collection-specific content
            const collectionContent = await generateCollectionContent(
              collection.name,
              destination.name,
              destination.country
            );
            
            if (!collectionContent) {
              console.log(`Failed to generate collection content for ${destination.name} in ${collection.name}, skipping...`);
              continue;
            }
            
            // Insert collection item
            const [newItem] = await db.insert(collectionItems)
              .values({
                collectionId: collection.id,
                destinationId: destination.id,
                position: nextPosition,
                highlight: collectionContent.highlight,
                note: collectionContent.note
              })
              .returning();
              
            console.log(`Added ${destination.name} to ${collection.name} collection (position: ${nextPosition})`);
          } catch (error) {
            console.error(`Error adding ${destination.name} to ${collection.name}:`, error);
          }
        }
      }
    }
    
    console.log("\n✅ Destination expansion completed successfully!");
    
    // 5. Make some new destinations featured
    if (addedDestinations.length > 0) {
      console.log("\nStep 5: Making some new destinations featured...");
      
      // Choose 2 random new destinations to feature
      const destinationsToFeature = addedDestinations
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
        
      for (const destination of destinationsToFeature) {
        await db.update(destinations)
          .set({ featured: true })
          .where(eq(destinations.id, destination.id));
          
        console.log(`Made ${destination.name} a featured destination`);
      }
    }
    
  } catch (error) {
    console.error("Error expanding destinations:", error);
  }
}

// Run the function
expandDestinations().then(() => {
  console.log('Expansion completed');
  process.exit(0);
}).catch(error => {
  console.error('Expansion failed:', error);
  process.exit(1);
});