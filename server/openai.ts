import OpenAI from "openai";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate personalized travel recommendations based on destination and user preferences
 */
export async function generateTravelRecommendations(
  destination: string,
  interests: string[] = [],
  duration: number = 5
): Promise<string[]> {
  try {
    // Create a prompt for the OpenAI API
    const interestsText = interests.length > 0 
      ? `The traveler is interested in: ${interests.join(", ")}.` 
      : "Include a variety of activities for different interests.";
    
    const prompt = `Generate 5 personalized travel recommendations for a ${duration}-day trip to ${destination}. 
${interestsText}
Format each recommendation as a short, practical tip that would be useful for travelers.
Make recommendations specific to the destination.
Return your recommendations in JSON format with a 'recommendations' array containing the tips.`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a knowledgeable travel guide with expertise in destinations worldwide. Provide practical, specific travel recommendations in JSON format."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return ["Unable to generate recommendations at this time."];
    }

    // Parse the JSON response
    try {
      const parsed = JSON.parse(content);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed.recommendations;
      }
      // Fallback if JSON structure is unexpected
      return content.split("\n").filter(line => line.trim().length > 0);
    } catch (e) {
      // If JSON parsing fails, split by newlines as fallback
      return content.split("\n").filter(line => line.trim().length > 0);
    }
  } catch (error) {
    console.error("Error generating travel recommendations:", error);
    return ["Unable to generate recommendations at this time."];
  }
}

/**
 * Generate a more detailed description of a destination
 */
export async function enhanceDestinationDescription(
  destination: string,
  currentDescription: string
): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a travel writer who creates compelling and informative destination descriptions."
        },
        { 
          role: "user", 
          content: `Enhance this description of ${destination}: "${currentDescription}"
          Make it more engaging and detailed while maintaining the same general information.
          Keep it under 150 words.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content || currentDescription;
  } catch (error) {
    console.error("Error enhancing destination description:", error);
    return currentDescription;
  }
}