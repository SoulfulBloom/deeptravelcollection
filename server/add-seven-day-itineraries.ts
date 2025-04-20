import OpenAI from "openai";
import { db } from "./db";
import {
  destinations,
  itineraries, 
  days
} from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Generate itinerary content for a destination
async function generateItineraryContent(name: string, country: string) {
  try {
    console.log(`Generating 7-day itinerary content for ${name}, ${country}...`);
    
    const prompt = `
    Create a comprehensive 7-day itinerary for ${name}, ${country}.
    Provide information in the following JSON structure:
    
    {
      "title": "A catchy title for the itinerary (e.g. '${name} 7-Day Complete Experience')",
      "days": [
        {
          "day": 1,
          "title": "Day 1 title focusing on a unique aspect of ${name}",
          "description": "Detailed 150-word description of Day 1 activities, specific to ${name}",
          "morningActivity": "Specific morning activity with location name in ${name}",
          "afternoonActivity": "Specific afternoon activity with location name in ${name}",
          "eveningActivity": "Specific evening activity or dining with location name in ${name}"
        },
        
        ... Days 2-6 following same format ...
        
        {
          "day": 7,
          "title": "Day 7 title focusing on a final aspect of ${name}",
          "description": "Detailed 150-word description of Day 7 activities, specific to ${name}",
          "morningActivity": "Specific morning activity with location name in ${name}",
          "afternoonActivity": "Specific afternoon activity with location name in ${name}",
          "eveningActivity": "Specific evening activity or dining with location name in ${name}"
        }
      ]
    }
    
    Be specific, authentic, and include location-specific activities. Each day should focus on different aspects of the destination.
    Include iconic landmarks, local food experiences, cultural activities, and off-the-beaten-path recommendations.
    No placeholders. All activities must be real and specific to ${name}.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep knowledge of destinations around the world. Provide accurate, specific itineraries for each location with authentic local experiences. Include a mix of popular attractions and hidden gems. Suggest specific restaurants, museums, neighborhoods, and activities that truly represent the destination."
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

// Main function to add missing itineraries
async function addSevenDayItineraries() {
  try {
    console.log("Starting to add 7-day itineraries...");
    
    // Get destinations that don't have itineraries or have fewer than 7 days
    const destinationsWithoutCompleteItineraries = await db.select({
      id: destinations.id,
      name: destinations.name,
      country: destinations.country
    })
    .from(destinations)
    .leftJoin(
      itineraries,
      eq(destinations.id, itineraries.destinationId)
    )
    .where(isNull(itineraries.id));
    
    console.log(`Found ${destinationsWithoutCompleteItineraries.length} destinations without complete itineraries`);
    
    // Process each destination without an itinerary
    let addedCount = 0;
    for (const destination of destinationsWithoutCompleteItineraries) {
      console.log(`Processing ${destination.name}, ${destination.country}...`);
      
      try {
        // Generate itinerary content
        const content = await generateItineraryContent(destination.name, destination.country);
        
        if (!content) {
          console.log(`Failed to generate content for ${destination.name}, skipping...`);
          continue;
        }
        
        // Insert itinerary
        const [newItinerary] = await db.insert(itineraries)
          .values({
            destinationId: destination.id,
            title: content.title,
            duration: 7,
            description: `Experience the best of ${destination.name} with our comprehensive 7-day itinerary, crafted to showcase both iconic attractions and hidden gems.`,
            content: `Immerse yourself in ${destination.name}'s unique culture, cuisine, and attractions with our detailed 7-day guide, perfect for travelers who want to experience everything this destination has to offer.`
          })
          .returning();
          
        console.log(`Added itinerary: ${newItinerary.title} (ID: ${newItinerary.id}) for ${destination.name}`);
        
        // Insert days
        for (const day of content.days) {
          const dayActivities = [day.morningActivity, day.afternoonActivity, day.eveningActivity];
          
          await db.insert(days).values({
            itineraryId: newItinerary.id,
            dayNumber: day.day,
            title: day.title,
            activities: dayActivities
          });
          
          console.log(`Added day ${day.day}: ${day.title}`);
        }
        
        console.log(`✅ Added 7-day itinerary for ${destination.name}`);
        addedCount++;
      } catch (error) {
        console.error(`Error adding itinerary for ${destination.name}:`, error);
      }
    }
    
    console.log(`✅ Added 7-day itineraries to ${addedCount} destinations successfully!`);
  } catch (error) {
    console.error("Error adding 7-day itineraries:", error);
  }
}

// Run the function
addSevenDayItineraries().then(() => process.exit(0)).catch(error => {
  console.error("Failed to add 7-day itineraries:", error);
  process.exit(1);
});