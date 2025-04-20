// server/test-simple.ts
import OpenAI from 'openai';

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 3
});

/**
 * Simple test to verify the OpenAI connection
 */
async function testOpenAIConnection() {
  console.log('Testing OpenAI API connection with new key...');
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "Write a short 3-sentence travel tip for Amsterdam."
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