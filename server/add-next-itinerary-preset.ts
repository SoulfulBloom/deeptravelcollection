import { db } from "./db";
import { destinations, itineraries, days } from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

/**
 * This script adds a predefined itinerary for the next destination without one
 */
async function addNextItineraryPreset() {
  try {
    console.log("Starting to add the next destination itinerary with preset data...");
    
    // Find the next destination without an itinerary
    const [destination] = await db.select({
      id: destinations.id,
      name: destinations.name,
      country: destinations.country
    })
    .from(destinations)
    .leftJoin(
      itineraries,
      eq(destinations.id, itineraries.destinationId)
    )
    .where(isNull(itineraries.id))
    .limit(1);
    
    if (!destination) {
      console.log("No destinations without itineraries found!");
      return;
    }
    
    console.log(`Processing ${destination.name}, ${destination.country}...`);
    
    try {
      // Check if an itinerary already exists (shouldn't be the case based on our query, but just to be safe)
      const existingItinerary = await db.select({ id: itineraries.id })
        .from(itineraries)
        .where(eq(itineraries.destinationId, destination.id));
      
      if (existingItinerary.length > 0) {
        console.log(`${destination.name} already has an itinerary, skipping...`);
        return;
      }
      
      // Insert itinerary
      const [newItinerary] = await db.insert(itineraries)
        .values({
          destinationId: destination.id,
          title: `7 Days in ${destination.name}: Complete Experience`,
          duration: 7,
          description: `Experience the best of ${destination.name} with our comprehensive 7-day itinerary, crafted to showcase both iconic attractions and hidden gems.`,
          content: `Immerse yourself in ${destination.name}'s unique culture, cuisine, and attractions with our detailed 7-day guide, perfect for travelers who want to experience everything this destination has to offer.`
        })
        .returning();
        
      console.log(`Added itinerary: ${newItinerary.title} (ID: ${newItinerary.id}) for ${destination.name}`);
      
      // Predefined days data structure
      const daysData = [
        {
          dayNumber: 1,
          title: `Exploring ${destination.name}'s Iconic Landmarks`,
          activities: [
            `Morning: Visit the main historic district in ${destination.name} and explore its most famous landmark`,
            `Afternoon: Guided tour of the cultural heart of ${destination.name} with stops at major attractions`,
            `Evening: Dinner at a popular local restaurant in the central district offering authentic ${destination.country} cuisine`
          ]
        },
        {
          dayNumber: 2,
          title: "Cultural Immersion Day",
          activities: [
            `Morning: Visit the national or city museum to learn about ${destination.name}'s rich history`,
            `Afternoon: Explore the arts district with galleries, craft shops, and cultural performances`,
            `Evening: Attend a traditional cultural show or performance unique to ${destination.country}`
          ]
        },
        {
          dayNumber: 3,
          title: "Local Markets and Culinary Delights",
          activities: [
            `Morning: Tour the vibrant local markets and food stalls of ${destination.name}`,
            `Afternoon: Cooking class featuring traditional ${destination.country} dishes using fresh market ingredients`,
            `Evening: Street food tour sampling the best local specialties and hidden culinary gems`
          ]
        },
        {
          dayNumber: 4,
          title: "Nature and Outdoor Exploration",
          activities: [
            `Morning: Hiking or walking tour of the natural surroundings or best park in ${destination.name}`,
            `Afternoon: Visit scenic viewpoints offering panoramic views of ${destination.name}`,
            `Evening: Sunset dinner at a rooftop restaurant with spectacular views`
          ]
        },
        {
          dayNumber: 5,
          title: "Off the Beaten Path Adventures",
          activities: [
            `Morning: Explore a lesser-known neighborhood with a local guide to discover hidden gems`,
            `Afternoon: Visit unique specialty shops, bookstores, or local artisan workshops`,
            `Evening: Dinner at a neighborhood restaurant favored by locals rather than tourists`
          ]
        },
        {
          dayNumber: 6,
          title: "Day Trip to Surrounding Region",
          activities: [
            `Morning: Travel to a nearby town or natural landmark outside ${destination.name}`,
            `Afternoon: Explore the day trip destination's unique attractions and culture`,
            `Evening: Return to ${destination.name} for dinner at an upscale restaurant serving fusion cuisine`
          ]
        },
        {
          dayNumber: 7,
          title: "Relaxation and Farewell",
          activities: [
            `Morning: Leisure time for shopping and picking up souvenirs from ${destination.name}`,
            `Afternoon: Visit any remaining must-see attractions or revisit favorites`,
            `Evening: Farewell dinner at a signature restaurant that embodies the essence of ${destination.name}`
          ]
        }
      ];
      
      // Insert days
      for (const day of daysData) {
        await db.insert(days).values({
          itineraryId: newItinerary.id,
          dayNumber: day.dayNumber,
          title: day.title,
          activities: day.activities
        });
        
        console.log(`Added day ${day.dayNumber}: ${day.title}`);
      }
      
      console.log(`✅ Added 7-day itinerary for ${destination.name}`);
    } catch (error) {
      console.error(`Error adding itinerary for ${destination.name}:`, error);
    }
  } catch (error) {
    console.error("Error adding next destination itinerary:", error);
  }
}

// Run the function
addNextItineraryPreset().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add next destination itinerary:", error);
  process.exit(1);
});