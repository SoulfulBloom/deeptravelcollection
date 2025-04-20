import { Router } from "express";
import { normalizeContent } from "../utils/contentNormalizer";
import { destinations, itineraries, days } from '@shared/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { itineraryGeneratorFactory } from '../services/itineraryGeneratorFactory';
import fs from 'fs';
import path from 'path';

const router = Router();

/**
 * Test pattern matching for premium PDF generation
 */
router.get("/test-patterns", async (req, res) => {
  // Force proper JSON content type
  res.header('Content-Type', 'application/json');
  try {
    const rawContent = `
# Day 1: Exploring Amsterdam's Historic Center

## Morning Activities
Start your day with a visit to the iconic Dam Square, the historic heart of Amsterdam. Explore the Royal Palace and the National Monument.

## Lunch Recommendation
For lunch, try Restaurant Greetje for authentic Dutch cuisine.

## Afternoon Activities
After lunch, take a leisurely walk to the Jordaan district, known for its narrow streets, charming buildings, and cozy cafes.

## Evening/Dinner Plan
End your day with dinner at Restaurant Kantjil & de Tijger, known for its Indonesian cuisine which is widely popular in the Netherlands.

# Day 2: Museums and Culture

## Morning Activities
Begin your day at the world-famous Rijksmuseum, home to masterpieces by Rembrandt and Vermeer.

## Lunch Recommendation
Enjoy lunch at the museum's café or at one of the restaurants in the Museumplein area.

## Afternoon Activities
Continue your cultural exploration at the Van Gogh Museum, which houses the largest collection of Van Gogh's works in the world.

## Evening/Dinner Plan
Dine at Restaurant De Kas, set in a beautiful greenhouse with farm-to-table cuisine.
`;

    // Normalize content to ensure consistent formatting
    const content = normalizeContent(rawContent);

    // Test extraction for Day 1
    console.log("\n----- Testing Day 1 Extraction -----");
    const day1Patterns = [
      new RegExp(`# Day 1: [\\s\\S]*?(?=# Day 2|$)`, 'i'),
      new RegExp(`# Day 1:[\\s\\S]*?(?=# Day 2|$)`, 'i'),
      new RegExp(`# Day 1 [\\s\\S]*?(?=# Day 2|$)`, 'i')
    ];
    
    let day1Content = null;
    for (const pattern of day1Patterns) {
      const match = content.match(pattern);
      if (match && match[0]) {
        day1Content = match[0];
        console.log(`✓ Found Day 1 content using pattern: ${pattern.toString().substring(0, 50)}...`);
        break;
      }
    }
    
    // Test Morning Activities extraction
    if (day1Content) {
      // Morning
      const morningPatterns = [
        /## Morning Activities[^#]*?(?=## Afternoon|## Lunch|## Evening|# Day|$)/is,
        /\*\*Morning Activities\*\*[^#]*?(?=\*\*Afternoon|\*\*Lunch|\*\*Evening|# Day|$)/is
      ];
      
      let morningContent = null;
      for (const pattern of morningPatterns) {
        const match = day1Content.match(pattern);
        if (match && match[0]) {
          morningContent = match[0];
          console.log(`✓ Found Morning section: ${match[0].substring(0, 50).trim()}...`);
          break;
        }
      }
      
      if (!morningContent) {
        console.log(`✗ Could not extract Morning section`);
      }
      
      // Afternoon
      const afternoonPatterns = [
        /## Afternoon Activities[^#]*?(?=## Evening|## Dinner|# Day|$)/is,
        /## Lunch Recommendation[^#]*?(?=## Afternoon|## Evening|# Day|$)/is,
        /\*\*Lunch Recommendation\*\*[^#]*?(?=\*\*Afternoon|\*\*Evening|# Day|$)/is,
        /\*\*Afternoon Activities\*\*[^#]*?(?=\*\*Evening|\*\*Dinner|# Day|$)/is
      ];
      
      let afternoonContent = null;
      for (const pattern of afternoonPatterns) {
        const match = day1Content.match(pattern);
        if (match && match[0]) {
          afternoonContent = match[0];
          console.log(`✓ Found Afternoon section: ${match[0].substring(0, 50).trim()}...`);
          break;
        }
      }
      
      if (!afternoonContent) {
        console.log(`✗ Could not extract Afternoon section`);
      }
      
      // Evening
      const eveningPatterns = [
        /## Evening\/Dinner Plan[^#]*?(?=## Accommodation|# Day|$)/is,
        /\*\*Evening\/Dinner Plan\*\*[^#]*?(?=\*\*Accommodation|# Day|$)/is
      ];
      
      let eveningContent = null;
      for (const pattern of eveningPatterns) {
        const match = day1Content.match(pattern);
        if (match && match[0]) {
          eveningContent = match[0];
          console.log(`✓ Found Evening section: ${match[0].substring(0, 50).trim()}...`);
          break;
        }
      }
      
      if (!eveningContent) {
        console.log(`✗ Could not extract Evening section`);
      }
    }
    
    // Test extraction for Day 2
    console.log("\n----- Testing Day 2 Extraction -----");
    const day2Patterns = [
      new RegExp(`# Day 2: [\\s\\S]*?(?=# Day 3|$)`, 'i'),
      new RegExp(`# Day 2:[\\s\\S]*?(?=# Day 3|$)`, 'i'),
      new RegExp(`# Day 2 [\\s\\S]*?(?=# Day 3|$)`, 'i')
    ];
    
    let day2Content = null;
    for (const pattern of day2Patterns) {
      const match = content.match(pattern);
      if (match && match[0]) {
        day2Content = match[0];
        console.log(`✓ Found Day 2 content using pattern: ${pattern.toString().substring(0, 50)}...`);
        break;
      }
    }
    
    // Return results
    res.json({
      success: true,
      message: "Pattern testing complete, see server logs for details",
      extractedDay1: !!day1Content,
      extractedDay2: !!day2Content,
      sampleTestContent: content.substring(0, 200) + "..."
    });
    
  } catch (error) {
    console.error("Error testing patterns:", error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

/**
 * Test pattern extraction with real-world content
 * This endpoint tests pattern extraction on dynamic content
 */
router.get("/test-extraction", async (req, res) => {
  try {
    const destinationId = parseInt(req.query.destinationId as string) || 35; // Default to Amsterdam
    
    // Get the destination
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destinationId));
    
    if (!destination) {
      return res.status(404).json({ 
        error: `Destination with ID ${destinationId} not found. Please provide a valid destination ID.`
      });
    }
    
    // Get the itinerary
    const [itinerary] = await db
      .select()
      .from(itineraries)
      .where(eq(itineraries.destinationId, destinationId));
    
    if (!itinerary) {
      return res.status(404).json({ 
        error: `No itinerary found for destination ID ${destinationId}`
      });
    }
    
    console.log(`\n----- PATTERN EXTRACTION TEST for ${destination.name} -----`);
    
    // Get days from the database
    const dbDays = await db
      .select()
      .from(days)
      .where(eq(days.itineraryId, itinerary.id))
      .orderBy(days.dayNumber);
    
    // Create sample content for testing
    let sampleContent = `# 7-Day Itinerary for ${destination.name}, ${destination.country}\n\n`;
    
    // If we have days in the database, use those
    if (dbDays && dbDays.length > 0) {
      for (const day of dbDays) {
        sampleContent += `# Day ${day.dayNumber}: ${day.title}\n\n`;
        
        // Add some dummy content for each section
        sampleContent += `## Morning Activities\nStart your day exploring ${destination.name}.\n\n`;
        sampleContent += `## Lunch Recommendation\nEnjoy a delicious meal at a local restaurant.\n\n`;
        sampleContent += `## Afternoon Activities\nVisit popular attractions in the area.\n\n`;
        sampleContent += `## Evening/Dinner Plan\nHave dinner and enjoy the evening atmosphere.\n\n`;
      }
    } else {
      // Create sample content for 7 days
      for (let i = 1; i <= 7; i++) {
        sampleContent += `# Day ${i}: Exploring ${destination.name} - Day ${i}\n\n`;
        sampleContent += `## Morning Activities\nStart your day exploring ${destination.name}.\n\n`;
        sampleContent += `## Lunch Recommendation\nEnjoy a delicious meal at a local restaurant.\n\n`;
        sampleContent += `## Afternoon Activities\nVisit popular attractions in the area.\n\n`;
        sampleContent += `## Evening/Dinner Plan\nHave dinner and enjoy the evening atmosphere.\n\n`;
      }
    }
    
    const normalizedContent = normalizeContent(sampleContent);
    
    // Save content to file for analysis
    const outputPath = path.join(process.cwd(), "tmp", "extraction-test-content.md");
    fs.writeFileSync(outputPath, normalizedContent);
    
    // Test extraction for all days
    const results = [];
    
    for (let day = 1; day <= 7; day++) {
      console.log(`\n----- Testing Day ${day} Extraction -----`);
      const dayPatterns = [
        new RegExp(`# Day ${day}: [\\s\\S]*?(?=# Day ${day+1}|$)`, 'i'),
        new RegExp(`# Day ${day}:[\\s\\S]*?(?=# Day ${day+1}|$)`, 'i'),
        new RegExp(`# Day ${day} [\\s\\S]*?(?=# Day ${day+1}|$)`, 'i')
      ];
      
      let dayContent = null;
      for (const pattern of dayPatterns) {
        const match = normalizedContent.match(pattern);
        if (match && match[0]) {
          dayContent = match[0];
          console.log(`✓ Found Day ${day} content`);
          break;
        }
      }
      
      results.push({
        day,
        extracted: !!dayContent,
        contentSample: dayContent ? dayContent.substring(0, 100) + "..." : null
      });
    }
    
    // Return the results as JSON with explicit content type
    res.header('Content-Type', 'application/json');
    res.json({
      success: true,
      destination: destination.name,
      results,
      contentSaved: outputPath,
      contentSampleLength: normalizedContent.length
    });
    
  } catch (error) {
    console.error("Error in pattern extraction test:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error && process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

export default router;