import OpenAI from "openai";
import { db } from "./db";
import { destinations, itineraries, days, eq } from "../shared/schema";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Function to generate content for a destination
async function generatePragueItineraryContent() {
  try {
    console.log(`Generating 7-day itinerary content for Prague, Czech Republic...`);
    
    const name = "Prague";
    const country = "Czech Republic";
    
    const prompt = `
    Create a detailed 7-day itinerary for ${name}, ${country}.
    
    For each day, provide:
    - day: Day number (1-7)
    - title: A catchy title for the day's activities
    - description: A 150-word description of the day's highlights and itinerary
    - morningActivity: A specific morning activity or sight with location name
    - afternoonActivity: A specific afternoon activity or sight with location name
    - eveningActivity: A specific evening activity or restaurant with location name
    
    Response must be in valid JSON format as follows:
    {
      "title": "7 Days of Magic in ${name}",
      "days": [
        {
          "day": 1,
          "title": "Day 1 Title",
          "description": "Day 1 description...",
          "morningActivity": "Morning activity with location",
          "afternoonActivity": "Afternoon activity with location",
          "eveningActivity": "Evening activity with location"
        },
        ...etc for all 7 days
      ]
    }
    
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
      max_tokens: 2000 // Limit token length to ensure completion
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error(`Error generating itinerary for Prague:`, error);
    return null;
  }
}

// Function to add the Prague itinerary to the database
async function addPragueItinerary() {
  try {
    console.log("Starting to add Prague 7-day itinerary...");
    
    // Find Prague destination
    const [destination] = await db.select({
      id: destinations.id,
      name: destinations.name,
      country: destinations.country
    })
    .from(destinations)
    .where(eq(destinations.name, "Prague"));
    
    if (!destination) {
      console.log("Prague destination not found");
      return;
    }
    
    console.log(`Processing ${destination.name}, ${destination.country}...`);
    
    try {
      // Generate itinerary content
      const content = await generatePragueItineraryContent();
      
      if (!content) {
        console.log(`Failed to generate content for ${destination.name}, skipping...`);
        return;
      }
      
      // Check if an itinerary already exists and delete it
      const existingItinerary = await db.select({ id: itineraries.id })
        .from(itineraries)
        .where(eq(itineraries.destinationId, destination.id));
      
      if (existingItinerary.length > 0) {
        console.log(`Deleting existing itinerary for ${destination.name}...`);
        await db.delete(days).where(eq(days.itineraryId, existingItinerary[0].id));
        await db.delete(itineraries).where(eq(itineraries.id, existingItinerary[0].id));
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
      
      // Insert days individually instead of all at once
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
    } catch (error) {
      console.error(`Error adding itinerary for ${destination.name}:`, error);
    }
  } catch (error) {
    console.error("Error adding Prague 7-day itinerary:", error);
  }
}

// Run the function
addPragueItinerary().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add Prague 7-day itinerary:", error);
  process.exit(1);
});