import { db } from './db';
import { destinations, regions } from '../shared/schema';
import { eq, gt } from 'drizzle-orm';

/**
 * This script ensures all new destinations have correct region information
 */
async function fixRegionDisplay() {
  try {
    console.log('Starting region display fix...');

    // Get all regions
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions`);
    
    // Get all destinations that were newly added (id > 33)
    const allNewDestinations = await db.select().from(destinations).where(gt(destinations.id, 33));
    console.log(`Found ${allNewDestinations.length} new destinations`);
    
    // Keep track of how many were updated
    let updatedCount = 0;
    
    // Define the region mappings with correct IDs from the database
    const regionMappings: Record<string, number> = {
      'Prague': 13, // Europe
      'Amsterdam': 13, // Europe
      'Vienna': 13, // Europe
      'Singapore': 14, // Asia
      'Hanoi': 14, // Asia
      'Mexico City': 15, // North America
      'Vancouver': 15, // North America  
      'Buenos Aires': 16, // South America
      'Cusco': 16, // South America
      'Cartagena': 16, // South America
      'Marrakech': 17, // Africa
      'Cape Town': 17, // Africa
      'Zanzibar': 17, // Africa
      'Cairo': 17, // Africa
    };
    
    // Update each destination with the correct region ID
    for (const destination of allNewDestinations) {
      if (!regionMappings[destination.name]) {
        console.log(`Region mapping not found for ${destination.name}, skipping...`);
        continue;
      }
      
      const regionId = regionMappings[destination.name];
      
      // Update the destination with the correct region ID
      await db.update(destinations)
        .set({
          regionId: regionId
        })
        .where(eq(destinations.id, destination.id));
      
      console.log(`Updated ${destination.name} with region ID ${regionId}`);
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} destinations with region information`);
  } catch (error) {
    console.error('Error fixing region display:', error);
  }
}

// Run the function
fixRegionDisplay().then(() => {
  console.log('Region display fix completed');
  process.exit(0);
}).catch(error => {
  console.error('Region display fix failed:', error);
  process.exit(1);
});