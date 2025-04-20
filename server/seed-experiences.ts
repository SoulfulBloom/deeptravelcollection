import { enhancedExperiences, type InsertEnhancedExperience } from "../shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema";

/**
 * Seed the database with enhanced experiences data
 */
async function seedEnhancedExperiences() {
  console.log("Starting to seed enhanced experiences...");
  
  // Add enhanced experiences for Bali
  const baliEnhancedExperiences: InsertEnhancedExperience[] = [
    {
      destinationId: 3,
      title: "Sacred Monkey Forest Sanctuary",
      specificLocation: "Ubud",
      description: "A natural forest sanctuary and temple complex with over 700 monkeys roaming freely.",
      personalNarrative: "I spent an unforgettable morning watching playful macaques swing through ancient trees and exploring moss-covered temples. A monkey jumped on my shoulder trying to grab my water bottle - terrifying but hilarious in hindsight!",
      season: "Year-round",
      seasonalEvent: "Nyepi (Day of Silence) in March transforms the experience as locals prepare temple offerings",
      bestTimeToVisit: "Early morning (8-9am) to avoid crowds and when monkeys are most active",
      localTip: "Don't carry any food or shiny objects, and avoid direct eye contact with the monkeys"
    },
    {
      destinationId: 3,
      title: "Sunrise Trek at Mount Batur",
      specificLocation: "Kintamani",
      description: "Pre-dawn hike up an active volcano to witness a spectacular sunrise above the clouds.",
      personalNarrative: "The 2am wake-up call was brutal, but nothing compares to standing above the clouds as the first golden rays illuminated Bali. Our guide, Made, shared stories of volcanic eruptions that shaped his family's history in the region.",
      season: "Dry season (April-October)",
      seasonalEvent: null,
      bestTimeToVisit: "Departure at 3:30am to reach summit before sunrise (around 6am)",
      localTip: "Temperatures at the summit can be surprisingly cold - bring a light jacket even in summer"
    },
    {
      destinationId: 3,
      title: "Traditional Balinese Cooking Class",
      specificLocation: "Laplapan Village near Ubud",
      description: "Hands-on cooking experience beginning with a local market tour and harvesting ingredients from organic gardens.",
      personalNarrative: "The family that hosted us welcomed me into their traditional compound home. Grandmother Wayan showed me techniques passed down for generations. I still make their sambal recipe at home, though it never tastes quite as good as it did in that open-air kitchen with fresh-picked ingredients.",
      season: "Year-round",
      seasonalEvent: "During Galungan festival (occurs every 210 days), you might see special ceremonial dishes being prepared",
      bestTimeToVisit: "Morning classes include market tours, afternoon classes are shorter",
      localTip: "Ask to learn how to make ceremonial offerings from palm leaves - a skill few tourists get to experience"
    }
  ];
  
  // Add enhanced experiences for Tokyo
  const tokyoEnhancedExperiences: InsertEnhancedExperience[] = [
    {
      destinationId: 1,
      title: "Tsukiji Outer Market Food Tour",
      specificLocation: "Tsukiji, Chuo City",
      description: "A culinary exploration through the historic outer market area with dozens of food stalls and specialty shops.",
      personalNarrative: "I arrived jet-lagged at 7am and followed my nose through narrow alleys. An elderly vendor noticed my confusion and insisted I try his tamagoyaki (sweet egg omelet). We couldn't communicate with words, but that perfect bite broke all language barriers. He showed me photos of three generations working at the same stall.",
      season: "Year-round",
      seasonalEvent: "New Year period (early January) features special seasonal delicacies",
      bestTimeToVisit: "Early morning (7-9am) for the freshest seafood and to avoid crowds",
      localTip: "Most shops are closed on Wednesdays; bring cash as many vendors don't accept cards"
    },
    {
      destinationId: 1,
      title: "Teamlab Borderless Digital Art Museum",
      specificLocation: "Odaiba, Tokyo",
      description: "Immersive, interactive digital art installations that respond to visitor movements and create ever-changing environments.",
      personalNarrative: "I spent four hours wandering through rooms where light cascaded like waterfalls and flowers bloomed across my body. In the crystal room, I lay on the floor watching patterns shift overhead while ambient music synchronized with the moving images. It redefined what I thought art could be.",
      season: "Year-round (indoor attraction)",
      seasonalEvent: null,
      bestTimeToVisit: "Weekday mornings to avoid long lines",
      localTip: "Wear light-colored clothing to better reflect the projections, and download the museum app before visiting"
    }
  ];
  
  // Add enhanced experiences for Barcelona
  const barcelonaEnhancedExperiences: InsertEnhancedExperience[] = [
    {
      destinationId: 2,
      title: "Hidden Tapas Tour in El Raval",
      specificLocation: "El Raval neighborhood",
      description: "A walking tour through Barcelona's multicultural neighborhood to discover authentic, non-touristy tapas bars.",
      personalNarrative: "Our local guide Marc took us to his grandfather's favorite bodega where we squeezed around wine barrels used as tables. The patatas bravas were unlike any I'd tried before - crispy outside, fluffy inside, with a smoky sauce that I'm still dreaming about. Between bites, Marc explained how this once-notorious neighborhood transformed into a cultural hub.",
      season: "Year-round",
      seasonalEvent: "During La Mercè festival (September), many bars create special tapas to celebrate Barcelona's patron saint",
      bestTimeToVisit: "7-9pm when locals begin their evening tapas crawl",
      localTip: "Order 'vermut' (vermouth) as your aperitif to experience a true Catalan pre-dinner tradition"
    }
  ];
  
  try {
    // Clear existing enhanced experiences before inserting
    console.log("Clearing existing enhanced experiences...");
    await db.execute(sql`TRUNCATE TABLE enhanced_experiences CASCADE;`);
    
    // Get the correct destination IDs from the database
    console.log("Fetching destination IDs...");
    const destinationRecords = await db
      .select({ 
        id: schema.destinations.id, 
        name: schema.destinations.name 
      })
      .from(schema.destinations);
    
    const destinationMap = new Map<string, number>();
    destinationRecords.forEach((dest: { id: number, name: string }) => {
      destinationMap.set(dest.name.toLowerCase(), dest.id);
    });
    
    // Update destination IDs based on current database state
    const updateDestinationId = (experiences: InsertEnhancedExperience[]): InsertEnhancedExperience[] => {
      return experiences.map((exp: InsertEnhancedExperience) => {
        // Find matching destination
        let destinationId = null;
        
        if (exp.destinationId === 1) {
          // Tokyo
          destinationId = destinationMap.get('tokyo');
        } else if (exp.destinationId === 2) {
          // Barcelona
          destinationId = destinationMap.get('barcelona');
        } else if (exp.destinationId === 3) {
          // Bali
          destinationId = destinationMap.get('bali');
        }
        
        if (destinationId) {
          return {...exp, destinationId };
        }
        
        return exp;
      });
    };
    
    const updatedBaliExperiences = updateDestinationId(baliEnhancedExperiences);
    const updatedTokyoExperiences = updateDestinationId(tokyoEnhancedExperiences);
    const updatedBarcelonaExperiences = updateDestinationId(barcelonaEnhancedExperiences);
    
    // Insert with updated IDs
    console.log("Adding Bali enhanced experiences...");
    if (updatedBaliExperiences.length > 0) {
      await db.insert(enhancedExperiences).values(updatedBaliExperiences);
    }
    
    console.log("Adding Tokyo enhanced experiences...");
    if (updatedTokyoExperiences.length > 0) {
      await db.insert(enhancedExperiences).values(updatedTokyoExperiences);
    }
    
    console.log("Adding Barcelona enhanced experiences...");
    if (updatedBarcelonaExperiences.length > 0) {
      await db.insert(enhancedExperiences).values(updatedBarcelonaExperiences);
    }
    
    console.log("Enhanced experiences seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding enhanced experiences:", error);
  }
}

// Execute seed function
seedEnhancedExperiences()
  .then(() => console.log("Seeding completed successfully"))
  .catch((error) => {
    console.error("Error in seed script:", error);
  });

export { seedEnhancedExperiences };