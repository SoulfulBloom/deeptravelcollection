// server/test-openai-basic.ts
import OpenAI from 'openai';

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Test function to check if the OpenAI API key is working
 * Usage: NODE_ENV=development tsx server/test-openai-basic.ts
 */
async function testOpenAIConnection() {
  console.log('Testing OpenAI API connection with a simple prompt...');
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "user",
          content: "Generate a short 2-sentence greeting for a travel website."
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    
    console.log('OpenAI API connection successful!');
    console.log('Response:', completion.choices[0].message.content);
    console.log(`Tokens used: ${completion.usage?.total_tokens || 'unknown'}`);
    
  } catch (error: any) {
    console.error('Error connecting to OpenAI API:');
    console.error(error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
}

// Run the test function
testOpenAIConnection().catch(console.error);