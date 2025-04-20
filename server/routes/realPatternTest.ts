import { Router } from "express";
import fs from "fs";
import path from "path";
import { storage } from "../storage";
import { itineraryGeneratorFactory } from "../services/itineraryGeneratorFactory";
import { normalizeContent } from "../utils/contentNormalizer";

const router = Router();

/**
 * Test pattern extraction with real premium content
 */
router.get("/", async (req, res) => {
  try {
    const destinationId = req.query.destinationId ? parseInt(req.query.destinationId as string) : 35; // Default to Amsterdam
    
    console.log(`Testing pattern extraction with real content for destination ID: ${destinationId}`);
    
    const destination = await storage.getDestinationById(destinationId);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    
    // Generate or get cached premium content
    const generator = itineraryGeneratorFactory.getGenerator("efficient");
    console.log(`Using destination: ${destination.name}, ${destination.country}`);
    // Pass the entire destination object as required by the interface
    const rawContent = await generator.generateItinerary(destination);
    
    if (!rawContent) {
      return res.status(500).json({ error: "Failed to generate content" });
    }
    
    // Normalize the content to standardize formatting
    const content = normalizeContent(rawContent);
    
    console.log("\n----- Testing Real Content Extraction -----");
    console.log(`Content length: ${content.length} characters`);
    
    // Save both raw and normalized content for comparison
    const rawOutputPath = path.join(process.cwd(), "tmp", "raw-content.md");
    fs.writeFileSync(rawOutputPath, rawContent);
    
    // Extract and test all days
    const results = [];
    
    // Test day patterns with various formats
    // Test for 7 days
    for (let day = 1; day <= 7; day++) {
      const dayPatterns = [
        new RegExp(`# Day ${day}: [\\s\\S]*?(?=# Day ${day+1}|$)`, 'i'),
        new RegExp(`# Day ${day}:[\\s\\S]*?(?=# Day ${day+1}|$)`, 'i'),
        new RegExp(`# Day ${day} [\\s\\S]*?(?=# Day ${day+1}|$)`, 'i'),
        new RegExp(`## Day ${day}: [\\s\\S]*?(?=## Day ${day+1}|$)`, 'i')
      ];
      
      let dayContent = null;
      let matchedPattern = "";
      
      for (const pattern of dayPatterns) {
        const match = content.match(pattern);
        if (match && match[0]) {
          dayContent = match[0];
          matchedPattern = pattern.toString();
          console.log(`✓ Found Day ${day} content using pattern: ${matchedPattern.substring(0, 50)}...`);
          break;
        }
      }
      
      if (!dayContent) {
        console.log(`✗ Could not extract Day ${day} - this day might be missing from the content`);
        // Check if the day exists in the content
        const dayCheck = content.includes(`# Day ${day}`) || content.includes(`# Day ${day}:`);
        
        results.push({
          day,
          extracted: false,
          exists: dayCheck
        });
        continue;
      }
      
      // Morning
      const morningPatterns = [
        /## Morning Activities[^#]*?(?=## Afternoon|## Lunch|## Evening|# Day|$)/is,
        /\*\*Morning Activities\*\*[^#]*?(?=\*\*Afternoon|\*\*Lunch|\*\*Evening|# Day|$)/is,
        /### Morning[^#]*?(?=### Afternoon|### Lunch|### Evening|## |# Day|$)/is
      ];
      
      let morningContent = null;
      for (const pattern of morningPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          morningContent = match[0];
          console.log(`✓ Found Morning section for Day ${day}`);
          break;
        }
      }
      
      // Lunch
      const lunchPatterns = [
        /## Lunch Recommendation[^#]*?(?=## Afternoon|## Evening|# Day|$)/is,
        /\*\*Lunch Recommendation\*\*[^#]*?(?=\*\*Afternoon|\*\*Evening|# Day|$)/is,
        /### Lunch[^#]*?(?=### Afternoon|### Evening|## |# Day|$)/is
      ];
      
      let lunchContent = null;
      for (const pattern of lunchPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          lunchContent = match[0];
          console.log(`✓ Found Lunch section for Day ${day}`);
          break;
        }
      }
      
      // Afternoon
      const afternoonPatterns = [
        /## Afternoon Activities[^#]*?(?=## Evening|## Dinner|# Day|$)/is,
        /\*\*Afternoon Activities\*\*[^#]*?(?=\*\*Evening|\*\*Dinner|# Day|$)/is,
        /### Afternoon[^#]*?(?=### Evening|### Dinner|## |# Day|$)/is
      ];
      
      let afternoonContent = null;
      for (const pattern of afternoonPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          afternoonContent = match[0];
          console.log(`✓ Found Afternoon section for Day ${day}`);
          break;
        }
      }
      
      // Evening
      const eveningPatterns = [
        /## Evening\/Dinner Plan[^#]*?(?=## Accommodation|# Day|$)/is,
        /## Evening Activities[^#]*?(?=## Accommodation|# Day|$)/is,
        /\*\*Evening\/Dinner Plan\*\*[^#]*?(?=\*\*Accommodation|# Day|$)/is,
        /\*\*Evening Activities\*\*[^#]*?(?=\*\*Accommodation|# Day|$)/is,
        /### Evening[^#]*?(?=### Accommodation|## |# Day|$)/is
      ];
      
      let eveningContent = null;
      for (const pattern of eveningPatterns) {
        const match = dayContent.match(pattern);
        if (match && match[0]) {
          eveningContent = match[0];
          console.log(`✓ Found Evening section for Day ${day}`);
          break;
        }
      }
      
      // Add results for this day
      results.push({
        day,
        extracted: true,
        pattern: matchedPattern,
        sections: {
          morning: !!morningContent,
          lunch: !!lunchContent,
          afternoon: !!afternoonContent,
          evening: !!eveningContent
        }
      });
    }
    
    // Save content sample to file for analysis
    const outputPath = path.join(process.cwd(), "tmp", "pattern-test-content.md");
    fs.writeFileSync(outputPath, content);
    console.log(`Content saved to ${outputPath} for further analysis`);
    
    // Return results
    res.json({
      success: true,
      message: "Real content pattern testing complete",
      destination: {
        id: destination.id,
        name: destination.name,
        country: destination.country
      },
      contentLength: content.length,
      results,
      outputPath
    });
    
  } catch (error) {
    console.error("Error testing real patterns:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

/**
 * Simple test extraction endpoint - uses predefined structured content
 */
router.get("/test-extraction", async (req, res) => {
  try {
    const destinationId = req.query.destinationId ? parseInt(req.query.destinationId as string) : 35; // Default to Amsterdam
    
    const destination = await storage.getDestinationById(destinationId);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    
    // Create sample content for testing
    let sampleContent = `# 7-Day Itinerary for ${destination.name}, ${destination.country}\n\n`;
    
    // Create sample content for 7 days
    for (let i = 1; i <= 7; i++) {
      sampleContent += `# Day ${i}: Exploring ${destination.name} - Day ${i}\n\n`;
      sampleContent += `## Morning Activities\nStart your day exploring ${destination.name}.\n\n`;
      sampleContent += `## Lunch Recommendation\nEnjoy a delicious meal at a local restaurant.\n\n`;
      sampleContent += `## Afternoon Activities\nVisit popular attractions in the area.\n\n`;
      sampleContent += `## Evening/Dinner Plan\nHave dinner and enjoy the evening atmosphere.\n\n`;
    }
    
    const normalizedContent = normalizeContent(sampleContent);
    
    // Test day patterns with various formats
    const results = [];
    for (let day = 1; day <= 7; day++) {
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
          break;
        }
      }
      
      results.push({
        day,
        extracted: !!dayContent,
        contentSample: dayContent ? dayContent.substring(0, 100) + "..." : null
      });
    }
    
    // Force JSON Content-Type
    res.header('Content-Type', 'application/json');
    res.json({
      success: true,
      destination: destination.name,
      results
    });
    
  } catch (error) {
    console.error("Error in real pattern test extraction:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error && process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

export default router;