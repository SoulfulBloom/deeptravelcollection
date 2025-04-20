import OpenAI from "openai";
import { db } from "./db";
import {
  destinations,
  itineraries, 
  days,
  InsertItinerary,
  InsertDay
} from "../shared/schema";
import { eq } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Generate itinerary content for a destination
async function generateItineraryContent(name: string, country: string) {
  try {
    console.log(`Generating itinerary content for ${name}, ${country}...`);
    
    const prompt = `
    Create a 3-day itinerary for ${name}, ${country}.
    Provide information in the following JSON structure:
    
    {
      "title": "A catchy title for the itinerary (e.g. '${name} 3-Day Adventure')",
      "days": [
        {
          "day": 1,
          "title": "Day 1 title focusing on a unique aspect of ${name}",
          "description": "Detailed 200-word description of Day 1 activities, specific to ${name}",
          "morningActivity": "Specific morning activity with location name in ${name}",
          "afternoonActivity": "Specific afternoon activity with location name in ${name}",
          "eveningActivity": "Specific evening activity or dining with location name in ${name}"
        },
        {
          "day": 2,
          "title": "Day 2 title focusing on a different aspect of ${name}",
          "description": "Detailed 200-word description of Day 2 activities, specific to ${name}",
          "morningActivity": "Specific morning activity with location name in ${name}",
          "afternoonActivity": "Specific afternoon activity with location name in ${name}",
          "eveningActivity": "Specific evening activity or dining with location name in ${name}"
        },
        {
          "day": 3,
          "title": "Day 3 title focusing on a third aspect of ${name}",
          "description": "Detailed 200-word description of Day 3 activities, specific to ${name}",
          "morningActivity": "Specific morning activity with location name in ${name}",
          "afternoonActivity": "Specific afternoon activity with location name in ${name}",
          "eveningActivity": "Specific evening activity or dining with location name in ${name}"
        }
      ]
    }
    
    Be specific, authentic, and include location-specific activities. No placeholders.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep knowledge of destinations around the world. Provide accurate, specific itineraries for each location with authentic local experiences."
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

// Main function to add missing itineraries
async function addMissingItineraries() {
  try {
    console.log("Starting to add missing itineraries...");
    
    // Get destinations without itineraries
    const allDestinations = await db.select()
      .from(destinations)
      .leftJoin(itineraries, eq(destinations.id, itineraries.destinationId))
      .where(eq(itineraries.id, null));
    
    if (allDestinations.length === 0) {
      console.log("No destinations missing itineraries found");
      return;
    }
    
    console.log(`Found ${allDestinations.length} destinations without itineraries`);
    
    // Process each destination without an itinerary
    for (const { destinations: destination } of allDestinations) {
      console.log(`Processing ${destination.name}, ${destination.country}...`);
      
      // Generate itinerary content
      const content = await generateItineraryContent(destination.name, destination.country);
      
      // Insert itinerary
      const insertItinerary: InsertItinerary = {
        destinationId: destination.id,
        title: content.title,
        duration: 3,
      };
      
      const [newItinerary] = await db.insert(itineraries)
        .values(insertItinerary)
        .returning();
        
      console.log(`Added itinerary: ${newItinerary.title} (ID: ${newItinerary.id}) for ${destination.name}`);
      
      // Insert days
      for (const day of content.days) {
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
      
      console.log(`Added 3 days to itinerary for ${destination.name}`);
    }
    
    console.log("✅ Missing itineraries addition completed successfully!");
  } catch (error) {
    console.error("Error adding missing itineraries:", error);
  }
}

// Run the function
addMissingItineraries().then(() => process.exit(0)).catch(error => {
  console.error("Failed to add missing itineraries:", error);
  process.exit(1);
});