/**
 * Command-line script to generate an itinerary PDF using our standalone TypeScript generator
 * 
 * Usage:
 *   npx ts-node server/scripts/generate-itinerary.ts "Bali" "Indonesia"
 * 
 * Or compile and run:
 *   npx tsc
 *   node dist/server/scripts/generate-itinerary.js "Bali" "Indonesia"
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateItinerary } from '../utils/standaloneGeneratorTs';

async function main() {
  try {
    // Check if OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY environment variable is required');
      console.error('Please set it using:');
      console.error('  export OPENAI_API_KEY=your-api-key-here');
      process.exit(1);
    }

    // Get destination from command line arguments
    const destinationName = process.argv[2];
    const destinationCountry = process.argv[3];
    
    if (!destinationName || !destinationCountry) {
      console.error('Usage: ts-node generate-itinerary.ts "Destination Name" "Country"');
      console.error('Example: ts-node generate-itinerary.ts "Bali" "Indonesia"');
      process.exit(1);
    }
    
    console.log(`Starting generation for ${destinationName}, ${destinationCountry}...`);
    
    // Create a destination object with the minimal required fields
    const destination = {
      id: 1,
      name: destinationName,
      country: destinationCountry,
      description: `${destinationName} is a beautiful destination in ${destinationCountry}.`
    };
    
    // Generate the itinerary
    const pdfBuffer = await generateItinerary(destination);
    
    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'tmp', 'generated-itineraries');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save the PDF to the output directory
    const outputPath = path.join(outputDir, `${destinationName.toLowerCase().replace(/\s+/g, '-')}_itinerary.pdf`);
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`Successfully generated itinerary for ${destinationName}!`);
    console.log(`PDF saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating itinerary:', error);
    process.exit(1);
  }
}

// Run the script
main();