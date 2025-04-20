import OpenAI from "openai";
import { db } from "./db";
import { 
  collections, 
  collectionItems, 
  destinations, 
  itineraries, 
  days, 
  InsertDestination,
  InsertItinerary,
  InsertDay,
  InsertCollectionItem
} from "../shared/schema";
import { eq } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Wellness destinations to add
const wellnessDestinations = [
  {
    name: "Sedona",
    country: "USA",
    region: "North America",
    description: "Known for its energy vortexes and stunning red rock formations, Sedona is a spiritual wellness hub offering meditation retreats, spa treatments, and unique healing modalities.",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    name: "Tulum",
    country: "Mexico",
    region: "North America",
    description: "Tulum combines ancient Mayan wellness traditions with modern holistic practices against a backdrop of pristine beaches and jungle cenotes.",
    imageUrl: "https://images.unsplash.com/photo-1547458896-53bae6aaae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    name: "Rishikesh",
    country: "India",
    region: "Asia",
    description: "The birthplace of yoga and meditation, Rishikesh offers ashrams, Ayurvedic treatments, and spiritual retreats along the sacred Ganges River.",
    imageUrl: "https://images.unsplash.com/photo-1591777331058-d77299540c93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    description: "Beyond its iconic views, Santorini offers Mediterranean wellness retreats with sea therapy, volcanic hot springs, and nutrition-focused programs.",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d3c7c0f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    name: "Blue Lagoon",
    country: "Iceland",
    region: "Europe",
    description: "Iceland's geothermal spa destination combines mineral-rich waters with Scandinavian wellness philosophies in a stunning volcanic landscape.",
    imageUrl: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  }
];

// Generate detailed wellness content for a destination
async function generateWellnessContent(name: string, country: string) {
  try {
    console.log(`Generating wellness content for ${name}, ${country}...`);
    
    const prompt = `
    Create detailed wellness retreat content for ${name}, ${country}. 
    Provide information in the following JSON structure:
    
    {
      "highlights": [List of 5 wellness highlights/activities unique to this destination],
      "bestTimeToVisit": [Brief season recommendations, especially for wellness activities],
      "itinerary": {
        "title": [A catchy title for a 3-day wellness itinerary],
        "days": [
          {
            "day": 1,
            "title": [Day 1 title focusing on a wellness aspect],
            "description": [Detailed 250-word description of Day 1 wellness activities, specific to the location],
            "morningActivity": [Specific morning wellness activity with location name],
            "afternoonActivity": [Specific afternoon wellness activity with location name],
            "eveningActivity": [Specific evening wellness activity or relaxation with location name]
          },
          {
            "day": 2,
            "title": [Day 2 title focusing on a different wellness aspect],
            "description": [Detailed 250-word description of Day 2 wellness activities, specific to the location],
            "morningActivity": [Specific morning wellness activity with location name],
            "afternoonActivity": [Specific afternoon wellness activity with location name],
            "eveningActivity": [Specific evening wellness activity or relaxation with location name]
          },
          {
            "day": 3,
            "title": [Day 3 title focusing on a third wellness aspect],
            "description": [Detailed 250-word description of Day 3 wellness activities, specific to the location],
            "morningActivity": [Specific morning wellness activity with location name],
            "afternoonActivity": [Specific afternoon wellness activity with location name],
            "eveningActivity": [Specific evening wellness activity or relaxation with location name]
          }
        ]
      },
      "collectionHighlight": [A concise 15-word highlight about the destination's unique wellness offerings],
      "collectionNote": [A 30-word insider tip for wellness travelers to this destination]
    }
    
    Be specific, authentic, and include location-specific wellness offerings. No placeholders.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a wellness travel expert with deep knowledge of healing traditions, retreat centers, and holistic health practices around the world. Provide accurate, specific information for each location."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error(`Error generating content for ${name}:`, error);
    throw error;
  }
}

// Main function to add wellness destinations and content
async function addWellnessContent() {
  try {
    console.log("Starting to add wellness destinations and content...");
    
    // Get the wellness collection ID
    const [wellnessCollection] = await db.select()
      .from(collections)
      .where(eq(collections.slug, "wellness-retreats"));
      
    if (!wellnessCollection) {
      throw new Error("Wellness Retreats collection not found");
    }
    
    console.log(`Found Wellness Retreats collection with ID ${wellnessCollection.id}`);
    
    // Process each wellness destination
    for (const destinationData of wellnessDestinations) {
      console.log(`Processing ${destinationData.name}, ${destinationData.country}...`);
      
      // Check if destination already exists
      const [existingDestination] = await db.select()
        .from(destinations)
        .where(eq(destinations.name, destinationData.name))
        .where(eq(destinations.country, destinationData.country));
        
      if (existingDestination) {
        console.log(`Destination ${destinationData.name} already exists, skipping...`);
        continue;
      }
      
      // Generate detailed content with OpenAI
      const content = await generateWellnessContent(destinationData.name, destinationData.country);
      
      // Insert the destination
      const insertDestination: InsertDestination = {
        name: destinationData.name,
        country: destinationData.country,
        region: destinationData.region,
        description: destinationData.description,
        imageUrl: destinationData.imageUrl,
        bestTimeToVisit: content.bestTimeToVisit,
        featured: false,
      };
      
      const [newDestination] = await db.insert(destinations)
        .values(insertDestination)
        .returning();
        
      console.log(`Added destination: ${newDestination.name} (ID: ${newDestination.id})`);
      
      // Insert itinerary
      const insertItinerary: InsertItinerary = {
        destinationId: newDestination.id,
        title: content.itinerary.title,
        duration: 3,
      };
      
      const [newItinerary] = await db.insert(itineraries)
        .values(insertItinerary)
        .returning();
        
      console.log(`Added itinerary: ${newItinerary.title} (ID: ${newItinerary.id})`);
      
      // Insert days
      for (const day of content.itinerary.days) {
        const insertDay: InsertDay = {
          itineraryId: newItinerary.id,
          dayNumber: day.day,
          title: day.title,
          description: day.description,
          morningActivity: day.morningActivity,
          afternoonActivity: day.afternoonActivity,
          eveningActivity: day.eveningActivity,
        };
        
        await db.insert(days).values(insertDay);
      }
      
      console.log(`Added 3 days to itinerary`);
      
      // Insert collection item
      const insertCollectionItem: InsertCollectionItem = {
        collectionId: wellnessCollection.id,
        destinationId: newDestination.id,
        position: 0, // We'll update positions later
        highlight: content.collectionHighlight,
        note: content.collectionNote,
      };
      
      await db.insert(collectionItems).values(insertCollectionItem);
      
      console.log(`Added ${newDestination.name} to Wellness Retreats collection`);
    }
    
    // Update positions for all wellness collection items
    const wellnessItems = await db.select()
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, wellnessCollection.id));
      
    for (let i = 0; i < wellnessItems.length; i++) {
      await db.update(collectionItems)
        .set({ position: i + 1 })
        .where(eq(collectionItems.id, wellnessItems[i].id));
    }
    
    console.log("Successfully updated all wellness collection item positions");
    console.log("✅ Wellness content addition completed successfully!");
  } catch (error) {
    console.error("Error adding wellness content:", error);
  }
}

// Run the function
addWellnessContent().then(() => process.exit(0)).catch(error => {
  console.error("Failed to add wellness content:", error);
  process.exit(1);
});