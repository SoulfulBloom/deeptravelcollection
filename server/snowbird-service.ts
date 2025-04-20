import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export interface SnowbirdDestinationInfo {
  name: string;
  country: string;
  region: string;
  description: string;
  visaRequirements: string;
  healthcareInfo: string;
  costOfLiving: string;
  canadianCommunity: string;
  bestTimeToVisit: string;
  localTips: string;
}

/**
 * Generate detailed information about snowbird destinations using OpenAI
 */
export async function generateSnowbirdDestinationInfo(
  destination: string,
  country: string
): Promise<SnowbirdDestinationInfo | null> {
  try {
    const prompt = `
      Please generate detailed information about ${destination}, ${country} as a potential winter destination for Canadian snowbirds.
      
      Focus on the following aspects:
      - Brief description of the destination
      - Geographic region
      - Visa requirements for Canadians
      - Healthcare access and quality
      - Cost of living compared to Canada
      - Canadian expat community presence
      - Best time of year to visit (focusing on winter months)
      - Local tips and important information
      
      Format your response as a JSON object with the following structure:
      {
        "name": "${destination}",
        "country": "${country}",
        "region": "Geographic region",
        "description": "Brief description",
        "visaRequirements": "Visa information",
        "healthcareInfo": "Healthcare details",
        "costOfLiving": "Cost comparison",
        "canadianCommunity": "Info about Canadian expats",
        "bestTimeToVisit": "Optimal months",
        "localTips": "Insider tips"
      }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(content) as SnowbirdDestinationInfo;
  } catch (error) {
    console.error("Error generating snowbird destination info:", error);
    return null;
  }
}

/**
 * Generate personalized recommendations for a Canadian snowbird based on preferences
 */
export async function generatePersonalizedSnowbirdRecommendation(
  budget: string,
  healthNeeds: string,
  interests: string,
  preferredClimate: string
): Promise<string | null> {
  try {
    const prompt = `
      Please generate personalized recommendations for Canadian snowbird destinations based on the following preferences:
      
      Budget: ${budget}
      Health needs: ${healthNeeds}
      Interests: ${interests}
      Preferred climate: ${preferredClimate}
      
      Provide 3-4 destination recommendations with:
      1. A brief explanation of why each destination matches their preferences
      2. Any special considerations for their specific needs
      3. Best time to visit each destination during winter months
      4. Estimated monthly cost of living
      
      Format your response as conversational paragraphs, not bulleted lists. Make it personal and engaging.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content || null;
  } catch (error) {
    console.error("Error generating personalized snowbird recommendation:", error);
    return null;
  }
}

/**
 * Generate a comparison of two snowbird destinations
 */
export async function compareSnowbirdDestinations(
  destination1: string,
  destination2: string
): Promise<string | null> {
  try {
    const prompt = `
      Please create a detailed comparison between ${destination1} and ${destination2} as winter destinations for Canadian snowbirds.
      
      Compare the following aspects:
      - Climate and typical winter weather
      - Cost of living and affordability
      - Healthcare quality and accessibility
      - Visa requirements and length of stay allowed
      - Canadian presence and community
      - Cultural adjustment and language barriers
      - Safety and security considerations
      - Entertainment and lifestyle options
      
      Format your response as a conversational analysis, highlighting the strengths and weaknesses of each location. Conclude with a summary of which destination might be better for different types of snowbirds (budget-conscious, luxury-seekers, health-focused, etc.).
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content || null;
  } catch (error) {
    console.error("Error comparing snowbird destinations:", error);
    return null;
  }
}