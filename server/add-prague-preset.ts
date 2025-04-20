import { db } from "./db";
import { destinations, itineraries, days } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * This script adds a predefined Prague 7-day itinerary to the database
 */
async function addPraguePreset() {
  try {
    console.log("Starting to add Prague 7-day itinerary with preset data...");
    
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
          title: "7 Days of Magic in Prague: History, Culture & Czech Charm",
          duration: 7,
          description: `Experience the best of Prague with our comprehensive 7-day itinerary, crafted to showcase both iconic attractions and hidden gems.`,
          content: `Immerse yourself in Prague's unique culture, cuisine, and attractions with our detailed 7-day guide, perfect for travelers who want to experience everything this destination has to offer.`
        })
        .returning();
        
      console.log(`Added itinerary: ${newItinerary.title} (ID: ${newItinerary.id}) for ${destination.name}`);
      
      // Predefined days data
      const daysData = [
        {
          dayNumber: 1,
          title: "Exploring the Heart of Old Town",
          activities: [
            "Morning: Old Town Square & Astronomical Clock - Witness the hourly show and admire Gothic architecture",
            "Afternoon: Charles Bridge & Lesser Quarter - Cross the iconic bridge adorned with 30 statues and explore the charming Lesser Quarter",
            "Evening: Dinner at U Fleků - Enjoy traditional Czech cuisine and house-brewed beer at this historic brewery operating since 1499"
          ]
        },
        {
          dayNumber: 2,
          title: "Castle District Wonders",
          activities: [
            "Morning: Prague Castle Complex - Visit St. Vitus Cathedral, Golden Lane, and Royal Palace",
            "Afternoon: Strahov Monastery & Library - Admire one of the world's most beautiful historical libraries and enjoy panoramic views",
            "Evening: Dinner at U Modré Kachničky - Savor upscale Czech cuisine in an elegant medieval setting near the castle"
          ]
        },
        {
          dayNumber: 3,
          title: "Jewish Quarter & Cultural Immersion",
          activities: [
            "Morning: Jewish Quarter (Josefov) - Tour the Old Jewish Cemetery, Spanish Synagogue, and Jewish Museum",
            "Afternoon: Municipal House & Powder Tower - Visit the Art Nouveau gem and climb the historic tower for city views",
            "Evening: Black Light Theatre Performance - Experience this uniquely Czech art form at either Ta Fantastika or Image Theatre"
          ]
        },
        {
          dayNumber: 4,
          title: "Artistic Prague & Local Flavors",
          activities: [
            "Morning: National Gallery at Veletržní Palace - Explore modern Czech and European art collections",
            "Afternoon: Letná Park & Beer Garden - Stroll through the park and enjoy Czech beer with stunning city views",
            "Evening: Food Tour in Karlín - Sample local delicacies in this up-and-coming neighborhood with Taste of Prague tours"
          ]
        },
        {
          dayNumber: 5,
          title: "Beyond the City Center",
          activities: [
            "Morning: Vyšehrad Fortress - Visit the historic fort with stunning views, cathedral and famous cemetery",
            "Afternoon: Petřín Hill & Rose Garden - Climb Petřín Tower (Prague's 'Eiffel Tower') and wander through beautiful gardens",
            "Evening: Dinner at Lokál Dlouhááá - Experience proper Czech pub culture with perfectly poured Pilsner Urquell and classic dishes"
          ]
        },
        {
          dayNumber: 6,
          title: "Day Trip to Karlštejn Castle",
          activities: [
            "Morning: Train to Karlštejn - Take the scenic 40-minute train ride to this impressive Gothic castle",
            "Afternoon: Karlštejn Castle Tour - Explore this 14th-century castle built by Emperor Charles IV to safeguard royal treasures",
            "Evening: Dinner at Restaurace U Kocoura - Return to Prague and enjoy traditional Czech fare in this cozy Old Town restaurant"
          ]
        },
        {
          dayNumber: 7,
          title: "Hidden Gems & Farewell",
          activities: [
            "Morning: Wallenstein Garden - Discover this hidden Baroque garden with peacocks and impressive sculptures",
            "Afternoon: Náplavka Riverbank Market - Browse local crafts and food stalls along the Vltava River (weekends only) or visit the Dancing House",
            "Evening: Sunset Cruise on Vltava River - Bid farewell to Prague with a dinner cruise offering spectacular views of illuminated landmarks"
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
    console.error("Error adding Prague 7-day itinerary:", error);
  }
}

// Run the function
addPraguePreset().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add Prague 7-day itinerary:", error);
  process.exit(1);
});