/**
 * Basic Itinerary Generator
 * A simple implementation that generates a complete itinerary in a single request
 */

import OpenAI from 'openai';
import type { Destination } from '@shared/schema';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const MODEL = 'gpt-4o';

class ItineraryGenerator {
  /**
   * Generate a complete itinerary for the given destination
   */
  public async generateItinerary(destination: Destination): Promise<string> {
    console.log(`Starting basic itinerary generation for: ${destination.name}, ${destination.country}`);
    
    try {
      const prompt = this.createPrompt(destination.name, destination.country);
      
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: this.createSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      
      const itinerary = response.choices[0].message.content || '';
      
      console.log(`Completed basic itinerary generation for ${destination.name}`);
      return itinerary;
    } catch (error: any) {
      console.error(`Error generating itinerary for ${destination.name}:`, error);
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
  }
  
  /**
   * Create the system prompt for the OpenAI model
   */
  private createSystemPrompt(): string {
    return `You are an expert travel itinerary creator who provides extremely detailed, practical, and immersive travel plans.

ESSENTIAL REQUIREMENTS:
1. ALWAYS include EXACT names of venues, attractions, streets, restaurants, and neighborhoods
2. NEVER suggest generic places like "a local café" - always provide specific names
3. For restaurants, include cuisine type, price range ($$), and 1-2 recommended dishes
4. For attractions, include address, opening hours, entry fees, and insider tips
5. Include specific transportation instructions between locations
6. Suggest 1-2 off-the-beaten-path experiences that typical tourists might miss
7. Write in an immersive style that captures the essence and atmosphere of the locale

Your responses should be comprehensive, practical, and specific enough that a traveler could follow them without needing additional research.`;
  }
  
  /**
   * Create the user prompt for the OpenAI model
   */
  private createPrompt(destinationName: string, country: string): string {
    return `Create a comprehensive 7-day travel itinerary for ${destinationName}, ${country}.

Format the itinerary in Markdown using this structure:
# 7-Day Itinerary for ${destinationName}, ${country}

[Introduction: Brief overview of the destination and what makes it special]

## Day 1: [Theme/Focus, e.g., "Historical Exploration"]
[Introduction to the day]

### Morning
- [Specific attraction/activity with exact name]
- [Address and location details]
- [Opening hours and entrance fees]
- [Insider tip]
- [Recommended breakfast spot with cuisine type and price range]

### Afternoon
[Similar detailed structure as Morning]

### Evening
[Similar detailed structure as Morning]

[Repeat for Days 2-7]

## Practical Information
### Getting Around
[Detailed transportation options with prices]

### Accommodation Tips
[2-3 specific neighborhood recommendations with pros/cons]

### Dining Etiquette
[Local customs, tipping practices]

### Local Customs
[Important cultural information travelers should know]

### Useful Phrases
[5-6 practical phrases in local language with pronunciation]

### Safety Tips
[Specific advice for the location]

IMPORTANT REQUIREMENTS:
1. Include EXACT names, addresses, and prices for all recommended places
2. For each day, include practical transportation instructions between sites
3. Recommend specific restaurants with cuisine type, price range, and 1-2 signature dishes
4. Include at least one off-the-beaten-path suggestion per day
5. Provide specific cultural insights that enhance the travel experience`;
  }
}

// Export a singleton instance
export const itineraryGenerator = new ItineraryGenerator();