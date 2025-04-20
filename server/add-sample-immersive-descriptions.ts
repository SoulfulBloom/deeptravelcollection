import { db } from "./db";
import { destinations } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Add sample immersive descriptions to the first few destinations
 */
async function addSampleImmersiveDescriptions() {
  try {
    // Get the first 5 destinations
    const allDestinations = await db.select().from(destinations).limit(5);
    
    console.log(`Found ${allDestinations.length} destinations to update`);
    
    // Sample immersive descriptions
    const descriptions = [
      "In Barcelona, lose yourself among Gaudí's dreamlike architecture while savoring tapas with locals who share generations-old tales of Catalonian traditions. The city seamlessly blends Mediterranean warmth with artistic passion, inviting you to participate rather than observe.",
      "Sydney's sun-drenched beaches are just the beginning – dive into Aboriginal heritage tours led by indigenous elders who share 60,000 years of wisdom and connection to the land. Experience how multicultural influences create a uniquely Australian identity through food, art, and everyday interactions.",
      "Rome reveals itself through quiet morning rituals at neighborhood cafés and evening passeggiatas where generations mingle along cobblestone streets. Beyond the monuments, it's cooking with a nonna or joining locals for aperitivo that unlocks the city's authentic rhythms of life.",
      "Tokyo's dedication to perfection manifests in everything from meticulously crafted sushi to century-old craft shops where artisans welcome curious travelers. Experience the profound juxtaposition of ancient rituals and cutting-edge innovation that coexist in harmonious rhythm.",
      "Paris invites intimate cultural immersion beyond the iconic landmarks – join locals at neighborhood boulangeries, engage with bouquinistes along the Seine, and savor unhurried conversations at sidewalk cafés. Here, beauty and intention infuse everyday moments with profound meaning."
    ];
    
    // Update each destination with its description
    for (let i = 0; i < allDestinations.length; i++) {
      const dest = allDestinations[i];
      const description = descriptions[i];
      
      console.log(`Updating ${dest.name}, ${dest.country} with immersive description...`);
      
      await db.update(destinations)
        .set({ immersiveDescription: description })
        .where(eq(destinations.id, dest.id));
      
      console.log(`Updated ${dest.name}, ${dest.country}`);
    }
    
    console.log("✅ Sample immersive descriptions added successfully");
  } catch (error) {
    console.error("Failed to add sample immersive descriptions:", error);
  }
}

// Run the script
addSampleImmersiveDescriptions().then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});