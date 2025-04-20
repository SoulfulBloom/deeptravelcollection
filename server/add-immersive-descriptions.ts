import { db } from "./db";
import { destinations } from "../shared/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate an immersive description for a destination
 */
async function generateImmersiveDescription(name: string, country: string): Promise<string> {
  try {
    const prompt = `Create a compelling cultural immersion description for ${name}, ${country} that explains why a traveler would want to experience this destination from a cultural perspective. Focus on authentic local connections, cultural insights, and meaningful experiences that would leave a lasting impact. Keep it to 2-3 sentences, rich with specific cultural details but concise (max 50 words). Make it evocative and inspiring, focusing on human connections and personal transformation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a cultural anthropologist and travel writer specializing in immersive, authentic travel experiences. Your descriptions help travelers connect with the soul of a destination."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating immersive description:", error);
    return "";
  }
}

/**
 * Add immersive descriptions to destinations
 */
async function addImmersiveDescriptions() {
  try {
    // Get destinations without immersive descriptions
    const allDestinations = await db.select().from(destinations);
    
    console.log(`Found ${allDestinations.length} destinations`);
    
    // Process destinations in batches to avoid overwhelming the OpenAI API
    const batchSize = 5;
    
    for (let i = 0; i < allDestinations.length; i += batchSize) {
      const batch = allDestinations.slice(i, i + batchSize);
      
      console.log(`Processing batch ${i / batchSize + 1}/${Math.ceil(allDestinations.length / batchSize)}`);
      
      // Process destinations in this batch concurrently
      await Promise.all(batch.map(async (dest) => {
        if (!dest.immersiveDescription) {
          console.log(`Generating immersive description for ${dest.name}, ${dest.country}...`);
          
          const immersiveDescription = await generateImmersiveDescription(dest.name, dest.country);
          
          if (immersiveDescription) {
            // Update the destination with the immersive description
            await db.update(destinations)
              .set({ immersiveDescription })
              .where(eq(destinations.id, dest.id));
            
            console.log(`Updated ${dest.name}, ${dest.country} with immersive description`);
          }
        } else {
          console.log(`${dest.name}, ${dest.country} already has an immersive description`);
        }
      }));
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < allDestinations.length) {
        console.log("Waiting between batches...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log("✅ Immersive descriptions added successfully");
  } catch (error) {
    console.error("Failed to add immersive descriptions:", error);
  }
}

// Run the script
addImmersiveDescriptions().then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});