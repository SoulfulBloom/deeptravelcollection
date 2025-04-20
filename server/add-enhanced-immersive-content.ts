import { db } from "./db";
import { destinations } from "../shared/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate enriched immersive content for a destination
 */
async function generateEnhancedImmersiveContent(name: string, country: string): Promise<string> {
  try {
    const prompt = `
    As a cultural anthropologist and experienced travel advisor, create a rich, soul-enriching description for ${name}, ${country} that goes far beyond typical tourist experiences. Focus specifically on:

    1. Authentic local experiences not found in typical tourist guides
    2. Hidden gems and off-the-beaten-path locations known only to locals
    3. Cultural immersion opportunities with local communities
    4. Specific local dining recommendations at family-owned establishments
    5. Practical insider tips that only experienced travelers would know
    6. Seasonal variations and timing recommendations to avoid crowds
    7. Opportunities for meaningful cultural exchange and personal transformation

    The response should be 3-4 paragraphs (200-300 words) and written in a warm, inviting tone that inspires deep, meaningful travel. Include specific details that make the destination unique, with an emphasis on human connections and experiences that transform travelers. Avoid generic travel clichés.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a cultural anthropologist and travel advisor specializing in immersive, authentic travel experiences. Your deep knowledge of local cultures helps travelers connect with the soul of a destination through meaningful human interactions rather than superficial tourist experiences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating enhanced immersive content:", error);
    return "";
  }
}

/**
 * Add enhanced immersive content to destinations
 */
async function addEnhancedImmersiveContent() {
  try {
    // Get all destinations
    const allDestinations = await db.select().from(destinations);
    
    console.log(`Found ${allDestinations.length} destinations`);
    
    // Process destinations in batches to avoid overwhelming the OpenAI API
    const batchSize = 2;
    
    for (let i = 0; i < allDestinations.length; i += batchSize) {
      const batch = allDestinations.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allDestinations.length / batchSize)}`);
      
      // Process destinations in this batch sequentially to avoid rate limits
      for (const dest of batch) {
        console.log(`Generating enhanced immersive content for ${dest.name}, ${dest.country}...`);
        
        const immersiveContent = await generateEnhancedImmersiveContent(dest.name, dest.country);
        
        if (immersiveContent) {
          // Update the destination with the enhanced immersive content
          await db.update(destinations)
            .set({ immersiveDescription: immersiveContent })
            .where(eq(destinations.id, dest.id));
          
          console.log(`Updated ${dest.name}, ${dest.country} with enhanced immersive content`);
        }
        
        // Add a small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      // Add a delay between batches
      if (i + batchSize < allDestinations.length) {
        console.log("Waiting between batches...");
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    console.log("✅ Enhanced immersive content added successfully");
  } catch (error) {
    console.error("Failed to add enhanced immersive content:", error);
  }
}

// Process specific destinations first (can be modified based on priority)
async function processSpecificDestinations() {
  const priorityDestinations = [
    { name: "Barcelona", country: "Spain" },
    { name: "Paris", country: "France" },
    { name: "Kyoto", country: "Japan" },
    { name: "Marrakech", country: "Morocco" },
    { name: "Athens", country: "Greece" }
  ];
  
  for (const dest of priorityDestinations) {
    console.log(`Processing priority destination: ${dest.name}, ${dest.country}`);
    
    // Find destination in database
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.name, dest.name))
      .where(eq(destinations.country, dest.country));
    
    if (destination) {
      console.log(`Generating enhanced immersive content...`);
      const immersiveContent = await generateEnhancedImmersiveContent(dest.name, dest.country);
      
      if (immersiveContent) {
        await db.update(destinations)
          .set({ immersiveDescription: immersiveContent })
          .where(eq(destinations.id, destination.id));
        
        console.log(`Updated ${dest.name}, ${dest.country} with enhanced immersive content`);
      }
      
      // Add a small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log(`Destination ${dest.name}, ${dest.country} not found in database`);
    }
  }
}

// Run the script for specific destinations first
processSpecificDestinations().then(() => {
  console.log("Priority destinations processed");
  
  // Uncomment to process all destinations
  // return addEnhancedImmersiveContent();
}).then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});