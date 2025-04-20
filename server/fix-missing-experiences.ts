import { db } from "./db";
import {
  destinations,
  enhancedExperiences,
  type InsertEnhancedExperience
} from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * This script adds missing experiences for destinations that have fewer than 3
 */
async function fixMissingExperiences() {
  try {
    console.log("Finding destinations with fewer than 3 experiences...");
    
    // Get all destinations with count of experiences
    const results = await db.execute(`
      SELECT d.id, d.name, d.country, COUNT(ee.id) as exp_count
      FROM destinations d
      LEFT JOIN enhanced_experiences ee ON d.id = ee.destination_id
      GROUP BY d.id, d.name, d.country
      HAVING COUNT(ee.id) < 3
      ORDER BY COUNT(ee.id), d.name
    `);
    
    const destinationsWithMissingExperiences = results.rows;
    
    if (destinationsWithMissingExperiences.length === 0) {
      console.log("All destinations have at least 3 experiences!");
      return;
    }
    
    console.log(`Found ${destinationsWithMissingExperiences.length} destinations with missing experiences`);
    
    for (const row of destinationsWithMissingExperiences) {
      const destination = {
        id: row.id,
        name: row.name,
        country: row.country,
        experienceCount: parseInt(row.exp_count)
      };
      
      console.log(`Processing ${destination.name}, ${destination.country} (has ${destination.experienceCount} experiences)...`);
      
      // Get existing experiences to know what's missing
      const existingExperiences = await db.select({ 
        title: enhancedExperiences.title 
      })
      .from(enhancedExperiences)
      .where(eq(enhancedExperiences.destinationId, destination.id));
      
      const existingTitles = existingExperiences.map(e => e.title);
      console.log(`Existing experience titles: ${existingTitles.join(', ')}`);
      
      try {
        // Check if we need to add cultural experience
        const hasCulturalExp = existingTitles.some(title => 
          title.includes('Tea Ceremony') || 
          title.includes('Cultural') || 
          title.includes('Gothic Quarter') ||
          title.includes('Art Nouveau')
        );
        
        if (!hasCulturalExp) {
          const culturalExp: InsertEnhancedExperience = {
            destinationId: destination.id,
            title: getCulturalTitle(destination.name),
            specificLocation: getCulturalLocation(destination.name),
            description: `Explore the authentic cultural heart of ${destination.name} through local interactions that reveal the true character of the city.`,
            personalNarrative: `I wandered through narrow streets early in the morning before the crowds arrived. An elderly local invited me for coffee and shared stories about how the neighborhood had changed, offering a perspective I'd never find in guidebooks.`,
            season: "Year-round, though spring and fall offer the most pleasant temperatures",
            seasonalEvent: null,
            bestTimeToVisit: "Early morning (7-9am) to avoid crowds and see locals starting their day",
            localTip: `Visit on a weekday rather than weekend, and explore side streets at least 2-3 blocks away from major landmarks.`
          };
          
          await db.insert(enhancedExperiences).values(culturalExp);
          console.log(`Added cultural experience: ${culturalExp.title}`);
        }
        
        // Check if we need to add culinary experience
        const hasCulinaryExp = existingTitles.some(title => 
          title.includes('Tsukiji') || 
          title.includes('Food') || 
          title.includes('Cooking') ||
          title.includes('Culinary')
        );
        
        if (!hasCulinaryExp) {
          const culinaryExp: InsertEnhancedExperience = {
            destinationId: destination.id,
            title: getCulinaryTitle(destination.name),
            specificLocation: getCulinaryLocation(destination.name),
            description: `Immerse yourself in the authentic flavors of ${destination.country} at local markets and family-run eateries away from tourist areas.`,
            personalNarrative: `The aroma of freshly prepared local delicacies drew me into a tiny establishment without an English menu. Using hand gestures, I ordered what the family at the next table was enjoying. It was the most memorable meal of my trip.`,
            season: "Year-round",
            seasonalEvent: null,
            bestTimeToVisit: "During local mealtime hours (often different from tourist dining hours)",
            localTip: `Look for eateries filled with locals, not tourists. If there's a line of locals, it's worth the wait.`
          };
          
          await db.insert(enhancedExperiences).values(culinaryExp);
          console.log(`Added culinary experience: ${culinaryExp.title}`);
        }
        
        // Check if we need to add nature experience
        const hasNatureExp = existingTitles.some(title => 
          title.includes('Gardens') || 
          title.includes('Nature') || 
          title.includes('Outdoor') ||
          title.includes('Mountain')
        );
        
        if (!hasNatureExp) {
          const natureExp: InsertEnhancedExperience = {
            destinationId: destination.id,
            title: getNatureTitle(destination.name),
            specificLocation: getNatureLocation(destination.name),
            description: `Escape the urban environment to experience the breathtaking natural landscapes that locals treasure outside ${destination.name}.`,
            personalNarrative: `Away from tourist buses, I hired a local guide who took me to a viewpoint known mainly to photographers and locals. The hike was moderately challenging, but the sense of solitude and connection to the landscape was worth every step.`,
            season: "Best during spring or fall when the weather is mild",
            seasonalEvent: null,
            bestTimeToVisit: "Early morning or late afternoon for the best light and fewer people",
            localTip: `Bring appropriate footwear and water. Many tourists miss the best viewpoints that require a short hike.`
          };
          
          await db.insert(enhancedExperiences).values(natureExp);
          console.log(`Added nature experience: ${natureExp.title}`);
        }
        
        console.log(`✅ Successfully filled missing experiences for ${destination.name}`);
      } catch (error) {
        console.error(`Error adding experiences for ${destination.name}:`, error);
      }
    }
    
    console.log(`✅ Fixed missing experiences for all destinations`);
  } catch (error) {
    console.error("Error in fixMissingExperiences:", error);
  }
}

// Cultural titles for major destinations
function getCulturalTitle(name: string): string {
  const culturalTitles: Record<string, string> = {
    'Tokyo': 'Traditional Tea Ceremony in Yanaka',
    'Barcelona': 'Gothic Quarter Architectural Secrets',
  };
  
  return culturalTitles[name] || `Cultural Immersion in ${name}'s Historic Quarter`;
}

// Culinary titles for major destinations
function getCulinaryTitle(name: string): string {
  const culinaryTitles: Record<string, string> = {
    'Tokyo': 'Dawn at Tsukiji Outer Market',
    'Barcelona': 'Catalan Cooking in Traditional Homes',
  };
  
  return culinaryTitles[name] || `Local Food Exploration in ${name}`;
}

// Nature titles for major destinations
function getNatureTitle(name: string): string {
  const natureTitles: Record<string, string> = {
    'Tokyo': 'Secluded Gardens and Shrines Walk',
    'Barcelona': 'Bunkers del Carmel Sunset Experience',
  };
  
  return natureTitles[name] || `Natural Beauty Near ${name}`;
}

// Cultural locations for major destinations
function getCulturalLocation(name: string): string {
  const culturalLocations: Record<string, string> = {
    'Tokyo': 'Yanaka and Nezu neighborhoods',
    'Barcelona': 'Gothic Quarter and El Born',
  };
  
  return culturalLocations[name] || `Historic District of ${name}`;
}

// Culinary locations for major destinations
function getCulinaryLocation(name: string): string {
  const culinaryLocations: Record<string, string> = {
    'Tokyo': 'Tsukiji Outer Market and Omoide Yokocho',
    'Barcelona': 'Mercat de Sant Antoni and El Poble Sec',
  };
  
  return culinaryLocations[name] || `Local Markets and Restaurants in ${name}`;
}

// Nature locations for major destinations
function getNatureLocation(name: string): string {
  const natureLocations: Record<string, string> = {
    'Tokyo': 'Shinjuku Gyoen and Mount Takao',
    'Barcelona': 'Bunkers del Carmel and Montjuïc',
  };
  
  return natureLocations[name] || `Natural Areas Surrounding ${name}`;
}

// Run the function
fixMissingExperiences().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
}).catch(error => {
  console.error("Failed to fix missing experiences:", error);
  process.exit(1);
});