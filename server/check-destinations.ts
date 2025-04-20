import { db } from './db';
import { destinations, regions } from '../shared/schema';
import { gt } from 'drizzle-orm';

/**
 * This script checks the status of all destinations
 */
async function checkDestinations() {
  try {
    console.log('Checking all destinations...');

    // Get all regions
    const allRegions = await db.select().from(regions);
    console.log(`Found ${allRegions.length} regions`);
    
    // Get all destinations with IDs > 33
    const allDestinations = await db.select()
      .from(destinations)
      .where(gt(destinations.id, 33));
    
    console.log(`Found ${allDestinations.length} new destinations`);
    
    // Check each destination
    for (const dest of allDestinations) {
      const region = allRegions.find(r => r.id === dest.regionId);
      const regionName = region ? region.name : 'Unknown';
      const descriptionLength = dest.description ? dest.description.length : 0;
      const hasCuisine = dest.cuisine ? 'Yes' : 'No';
      const hasGeography = dest.geography ? 'Yes' : 'No';
      const hasCulture = dest.culture ? 'Yes' : 'No';
      const hasLocalTips = dest.localTips ? 'Yes' : 'No';
      
      console.log(`Destination: ${dest.name}, ${dest.country} (${regionName})`);
      console.log(`  Description: ${descriptionLength} chars`);
      console.log(`  Cuisine: ${hasCuisine}, Geography: ${hasGeography}, Culture: ${hasCulture}, LocalTips: ${hasLocalTips}`);
      console.log(`  Best Time to Visit: ${dest.bestTimeToVisit || 'Not set'}`);
      console.log('---------------------------------');
    }
    
    console.log('Destination check completed');
    
  } catch (error) {
    console.error('Destination check failed:', error);
  }
}

// Run the function
checkDestinations().then(() => {
  console.log('Check script completed');
  process.exit(0);
}).catch(error => {
  console.error('Check script failed:', error);
  process.exit(1);
});