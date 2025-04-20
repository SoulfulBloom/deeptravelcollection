/**
 * Test script to generate an enhanced Cuba snowbird guide
 * This script tests the new comprehensive template
 */

import { generateSnowbirdItinerary } from '../services/snowbirdItineraryGenerator';

async function main() {
  try {
    console.log("Starting test generation for Cuba guide...");
    
    // Cuba (Varadero) has ID 15 in the database
    const result = await generateSnowbirdItinerary(15);
    
    console.log("✅ Generation complete!");
    console.log(`PDF saved at: ${result.filePath}`);
    console.log(`Filename: ${result.filename}`);
    
  } catch (error) {
    console.error("Error generating Cuba guide:", error);
  }
}

main();