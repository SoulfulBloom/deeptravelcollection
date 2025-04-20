import OpenAI from "openai";
import { db } from "./db";
import {
  destinations,
  enhancedExperiences,
  type InsertEnhancedExperience
} from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generate authentic local experiences for a destination
 */
async function generateAuthenticExperiences(name: string, country: string) {
  try {
    console.log(`Generating authentic experiences for ${name}, ${country}...`);
    
    const prompt = `
    Create 3 authentic local experiences for ${name}, ${country}.
    Provide information in the following JSON structure:
    
    {
      "experiences": [
        {
          "title": "Unique and specific experience name",
          "specificLocation": "Exact location within ${name} where this experience takes place",
          "description": "Concise 1-2 sentence description of the experience",
          "personalNarrative": "A first-person account of experiencing this, including sensory details and emotional reactions",
          "season": "Best season or year-round",
          "seasonalEvent": "Any seasonal event that enhances this experience (if applicable)",
          "bestTimeToVisit": "Specific time of day or conditions that make this experience optimal",
          "localTip": "An insider tip that most tourists wouldn't know about this experience"
        },
        ... 2 more experiences ...
      ]
    }
    
    Make each experience highly specific to ${name}, not generic.
    Include authentic local activities that reveal the true character of the destination.
    For personalNarrative, write as if you personally experienced it with specific details.
    Focus on experiences that are unique to the local culture, cuisine, or natural environment.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep local knowledge of destinations worldwide. You provide authentic, specific experiences that travelers can have in each location, complete with personal narratives that make them come alive. Your recommendations avoid tourist traps and focus on genuine cultural immersion."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content.experiences;
  } catch (error) {
    console.error(`Error generating experiences for ${name}:`, error);
    return null;
  }
}

/**
 * Add authentic local experiences for the next destination without any
 */
async function addNextExperience() {
  try {
    console.log("Finding next destination without experiences...");
    
    // Find the next destination without experiences
    const [destination] = await db.select({
      id: destinations.id,
      name: destinations.name,
      country: destinations.country
    })
    .from(destinations)
    .leftJoin(
      enhancedExperiences,
      eq(destinations.id, enhancedExperiences.destinationId)
    )
    .where(isNull(enhancedExperiences.id))
    .groupBy(destinations.id, destinations.name, destinations.country)
    .limit(1);
    
    if (!destination) {
      console.log("All destinations already have experiences!");
      return;
    }
    
    console.log(`Processing ${destination.name}, ${destination.country}...`);
    
    try {
      // Generate experiences
      const experiences = await generateAuthenticExperiences(destination.name, destination.country);
      
      if (!experiences || experiences.length === 0) {
        console.log(`Failed to generate experiences for ${destination.name}`);
        return;
      }
      
      console.log(`Generated ${experiences.length} experiences for ${destination.name}`);
      
      // Insert experiences
      for (const experience of experiences) {
        const insertExperience: InsertEnhancedExperience = {
          destinationId: destination.id,
          title: experience.title,
          specificLocation: experience.specificLocation,
          description: experience.description,
          personalNarrative: experience.personalNarrative,
          season: experience.season,
          seasonalEvent: experience.seasonalEvent || null,
          bestTimeToVisit: experience.bestTimeToVisit,
          localTip: experience.localTip
        };
        
        await db.insert(enhancedExperiences).values(insertExperience);
        
        console.log(`Added experience: ${experience.title} at ${experience.specificLocation}`);
      }
      
      console.log(`✅ Added experiences for ${destination.name}`);
      
    } catch (error) {
      console.error(`Error adding experiences for ${destination.name}:`, error);
    }
  } catch (error) {
    console.error("Error adding next experience:", error);
  }
}

// Run the function
addNextExperience().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add next experience:", error);
  process.exit(1);
});