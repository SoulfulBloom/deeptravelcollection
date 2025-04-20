import OpenAI from "openai";
import { db } from "./db";
import { snowbirdDestinations } from "../shared/schema";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * This script adds new snowbird destination alternatives to the database
 */
async function addSnowbirdAlternatives() {
  try {
    console.log('Adding Snowbird Alternatives...');
    
    // Define the destinations we want to add
    const newDestinations = [
      {
        name: "Mérida",
        country: "Mexico",
        region: "North America",
        imageUrl: "https://images.unsplash.com/photo-1582225632302-772578827d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        avgWinterTemp: "24°C (75°F)",
        costComparison: "30-40% savings compared to Florida",
      },
      {
        name: "Lagos",
        country: "Portugal",
        region: "Europe",
        imageUrl: "https://images.unsplash.com/photo-1593696954577-9c754e8f57b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        avgWinterTemp: "17°C (63°F)",
        costComparison: "25-35% lower cost than Florida",
      },
      {
        name: "Chiang Mai",
        country: "Thailand",
        region: "Asia",
        imageUrl: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        avgWinterTemp: "25°C (77°F)",
        costComparison: "50-60% savings compared to Florida",
      },
      {
        name: "Valencia",
        country: "Spain",
        region: "Europe",
        imageUrl: "https://images.unsplash.com/photo-1599826853960-083b5a498eb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        avgWinterTemp: "16°C (61°F)",
        costComparison: "15-25% lower cost than Florida",
      },
      {
        name: "Cuenca",
        country: "Ecuador",
        region: "South America",
        imageUrl: "https://images.unsplash.com/photo-1598964356156-f88ea51c73c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        avgWinterTemp: "19°C (66°F)",
        costComparison: "45-55% savings compared to Florida",
      },
      {
        name: "Oaxaca",
        country: "Mexico",
        region: "North America",
        imageUrl: "https://images.unsplash.com/photo-1591108572702-0ad6641ccc82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        avgWinterTemp: "23°C (73°F)",
        costComparison: "35-45% savings compared to Florida",
      }
    ];
    
    for (const dest of newDestinations) {
      try {
        console.log(`Generating content for ${dest.name}, ${dest.country}...`);
        
        // Generate detailed content using OpenAI
        const prompt = `
          Generate detailed information about ${dest.name}, ${dest.country} as a Canadian snowbird destination alternative to Florida.
          
          Provide the following information in a JSON format:
          
          {
            "description": "A detailed 100-word description of ${dest.name} highlighting why it's perfect for Canadian snowbirds",
            "visaRequirements": "Detailed visa information for Canadians staying for extended periods",
            "healthcareAccess": "Information about healthcare quality, facilities, and insurance options for Canadians",
            "avgAccommodationCost": "Average monthly cost range for 1-2 bedroom accommodations",
            "flightTime": "Typical flight duration from Toronto or Vancouver",
            "languageBarrier": "Level of difficulty and English prevalence",
            "canadianExpats": "Size and presence of Canadian community",
            "bestTimeToVisit": "Optimal months for Canadian snowbirds",
            "localTips": "2-3 specific insider tips for Canadians living there",
            "costOfLiving": "Detailed breakdown of monthly expenses compared to Florida"
          }
          
          Be specific, accurate, and focus on aspects most relevant to Canadian retirees.
        `;
        
        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are a travel expert specializing in long-term stay destinations for Canadian snowbirds. Provide detailed, accurate information that would help Canadians make informed decisions about winter destinations outside the US."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        });
        
        const content = JSON.parse(response.choices[0].message.content);
        
        // Insert the snowbird destination
        const insertDestination = {
          name: dest.name,
          country: dest.country,
          region: dest.region,
          image_url: dest.imageUrl,
          avg_winter_temp: dest.avgWinterTemp,
          cost_comparison: dest.costComparison,
          description: content.description || "",
          visa_requirements: content.visaRequirements || "",
          healthcare_access: content.healthcareAccess || "",
          avg_accommodation_cost: content.avgAccommodationCost || "",
          flight_time: content.flightTime || "",
          language_barrier: content.languageBarrier || "",
          canadian_expats: content.canadianExpats || "",
          best_time_to_visit: content.bestTimeToVisit || "",
          local_tips: content.localTips || "",
          cost_of_living: content.costOfLiving || ""
        };
        
        await db.insert(snowbirdDestinations).values(insertDestination);
        
        console.log(`✅ Added ${dest.name}, ${dest.country} to snowbird destinations`);
        
      } catch (error) {
        console.error(`Error generating or inserting content for ${dest.name}:`, error);
      }
    }
    
    console.log('Snowbird Alternatives added successfully!');
    
  } catch (error) {
    console.error('Failed to add snowbird alternatives:', error);
  }
}

// Run the function
addSnowbirdAlternatives().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});