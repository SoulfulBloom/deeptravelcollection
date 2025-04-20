// server/test-tiny-chunks.ts
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Configure OpenAI with shorter timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds
  maxRetries: 2
});

/**
 * Test tiny chunking approach for itinerary generation
 */
async function testTinyChunking() {
  try {
    // Use a fixed destination for testing
    const destinationName = "Amsterdam";
    const destinationCountry = "Netherlands";
    const durationDays = 3; // Shorter duration for testing
    
    console.log(`Testing tiny chunking approach for: ${destinationName}, ${destinationCountry} (${durationDays} days)`);
    
    // Base system prompt - keep it concise
    const baseSystemPrompt = `You are a travel guide expert. Provide specific details and recommendations.`;

    // Combined content for the full itinerary
    let fullItinerary = '';
    let totalTokensUsed = 0;

    // CHUNK 1: Introduction only (very small chunk)
    console.log('Generating chunk 1: Introduction...');
    const introPrompt = `Write a brief introduction to ${destinationName}, ${destinationCountry} as a travel destination. 
Include what makes it special, best times to visit, and 2-3 major highlights. Keep it under 200 words.`;

    const introCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: introPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const introduction = introCompletion.choices[0].message.content || '';
    fullItinerary += introduction;
    totalTokensUsed += introCompletion.usage?.total_tokens || 0;
    
    console.log(`Introduction generated: ${introduction.length} characters`);
    console.log(`Tokens used for introduction: ${introCompletion.usage?.total_tokens}`);
    
    // Add a delay between API calls
    console.log('Waiting 2 seconds before next API call...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // CHUNK 2: Day 1 itinerary
    console.log('Generating chunk 2: Day 1 itinerary...');
    
    const day1Prompt = `Create a detailed Day 1 itinerary for ${destinationName}, ${destinationCountry} with:
- Morning activity with a specific location name and address
- A recommended lunch spot with 1-2 dish recommendations 
- Afternoon activity with specific details
- Evening plans including dinner
Keep it under 200 words.`;

    const day1Completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: day1Prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const day1Content = day1Completion.choices[0].message.content || '';
    fullItinerary += '\n\n## Day 1\n' + day1Content;
    totalTokensUsed += day1Completion.usage?.total_tokens || 0;
    
    console.log(`Day 1 itinerary generated: ${day1Content.length} characters`);
    console.log(`Tokens used for Day 1: ${day1Completion.usage?.total_tokens}`);
    
    // Add a delay between API calls
    console.log('Waiting 2 seconds before next API call...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // CHUNK 3: Day 2 itinerary
    console.log('Generating chunk 3: Day 2 itinerary...');
    
    const day2Prompt = `Create a detailed Day 2 itinerary for ${destinationName}, ${destinationCountry} with:
- Morning activity with a specific location name and address
- A recommended lunch spot with 1-2 dish recommendations 
- Afternoon activity with specific details
- Evening plans including dinner
Keep it under 200 words.`;

    const day2Completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: day2Prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const day2Content = day2Completion.choices[0].message.content || '';
    fullItinerary += '\n\n## Day 2\n' + day2Content;
    totalTokensUsed += day2Completion.usage?.total_tokens || 0;
    
    console.log(`Day 2 itinerary generated: ${day2Content.length} characters`);
    console.log(`Tokens used for Day 2: ${day2Completion.usage?.total_tokens}`);
    
    // Add a delay between API calls
    console.log('Waiting 2 seconds before next API call...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // CHUNK 4: Day 3 itinerary
    console.log('Generating chunk 4: Day 3 itinerary...');
    
    const day3Prompt = `Create a detailed Day 3 itinerary for ${destinationName}, ${destinationCountry} with:
- Morning activity with a specific location name and address
- A recommended lunch spot with 1-2 dish recommendations 
- Afternoon activity with specific details
- Evening plans including dinner
Keep it under 200 words.`;

    const day3Completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: day3Prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const day3Content = day3Completion.choices[0].message.content || '';
    fullItinerary += '\n\n## Day 3\n' + day3Content;
    totalTokensUsed += day3Completion.usage?.total_tokens || 0;
    
    console.log(`Day 3 itinerary generated: ${day3Content.length} characters`);
    console.log(`Tokens used for Day 3: ${day3Completion.usage?.total_tokens}`);
    
    // Add a delay between API calls
    console.log('Waiting 2 seconds before next API call...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // CHUNK 5: Practical information
    console.log('Generating chunk 5: Practical information...');
    
    const practicalPrompt = `Provide practical travel information for ${destinationName}, ${destinationCountry} including:
- 2 accommodation recommendations (budget and luxury)
- How to get around the city
- 2-3 cultural etiquette tips
- 2-3 hidden gems not in most tourist guides
Keep it under 200 words.`;

    const practicalCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: baseSystemPrompt },
        { role: "user", content: practicalPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const practicalContent = practicalCompletion.choices[0].message.content || '';
    fullItinerary += '\n\n## Practical Information\n' + practicalContent;
    totalTokensUsed += practicalCompletion.usage?.total_tokens || 0;
    
    console.log(`Practical information generated: ${practicalContent.length} characters`);
    console.log(`Tokens used for practical info: ${practicalCompletion.usage?.total_tokens}`);
    
    // Add Deep Travel Collections footer
    fullItinerary += '\n\n---\n*Created by Deep Travel Collections - Premium Travel Itineraries*';

    // Save the result to a file
    const outputDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `tiny-chunks-${destinationName.toLowerCase().replace(/\s+/g, '-')}.md`);
    fs.writeFileSync(outputPath, fullItinerary);
    
    console.log(`\nFull itinerary generated successfully: ${fullItinerary.length} characters total`);
    console.log(`Total tokens used: ${totalTokensUsed}`);
    console.log(`Result saved to: ${outputPath}`);
    
    // Output a preview of the content
    console.log('\nContent Preview (first 500 chars):');
    console.log(fullItinerary.substring(0, 500) + '...');
    
  } catch (error: any) {
    console.error('Error testing tiny chunking approach:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
}

// Run the test function
testTinyChunking().catch(console.error);