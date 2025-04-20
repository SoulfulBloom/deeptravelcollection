import { db } from "./db";
import { destinations, itineraries, days } from "../shared/schema";
import { eq, isNull, inArray } from "drizzle-orm";

/**
 * This script adds days for itineraries that don't have any
 */
async function addMissingDays() {
  try {
    console.log("Starting to add days for itineraries that don't have any...");
    
    // Get destinations that have itineraries but no days
    const destinationsWithoutDays = await db.select({
      id: destinations.id,
      name: destinations.name,
      country: destinations.country,
      itineraryId: itineraries.id
    })
    .from(destinations)
    .innerJoin(
      itineraries,
      eq(destinations.id, itineraries.destinationId)
    )
    .leftJoin(
      days,
      eq(itineraries.id, days.itineraryId)
    )
    .where(isNull(days.id))
    .groupBy(destinations.id, destinations.name, destinations.country, itineraries.id);
    
    if (destinationsWithoutDays.length === 0) {
      console.log("No itineraries without days found!");
      return;
    }
    
    console.log(`Processing ${destinationsWithoutDays.length} destinations with missing days...`);
    
    for (const destination of destinationsWithoutDays) {
      try {
        console.log(`Processing ${destination.name}, ${destination.country}...`);
        
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
            itineraryId: destination.itineraryId,
            dayNumber: day.dayNumber,
            title: day.title,
            activities: day.activities
          });
          
          console.log(`Added day ${day.dayNumber}: ${day.title}`);
        }
        
        console.log(`✅ Added 7 days for ${destination.name}'s itinerary`);
      } catch (error) {
        console.error(`Error adding days for ${destination.name}:`, error);
      }
    }
    
    console.log(`Processing completed!`);
  } catch (error) {
    console.error("Error adding missing days:", error);
  }
}

// Run the function
addMissingDays().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add missing days:", error);
  process.exit(1);
});