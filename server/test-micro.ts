// server/test-micro.ts
import OpenAI from 'openai';

// Configure OpenAI with short timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds
  maxRetries: 2
});

/**
 * Very small test to verify API connectivity
 */
async function testMicroRequest() {
  console.log('Testing OpenAI API with a micro request...');
  
  try {
    const start = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "Write 3 bullet points about Amsterdam in less than 50 words."
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    
    const duration = Date.now() - start;
    
    console.log(`Request completed in ${duration}ms`);
    console.log('Response:', completion.choices[0].message.content);
    console.log(`Tokens used: ${completion.usage?.total_tokens || 'unknown'}`);
    
  } catch (error: any) {
    console.error('Error with OpenAI API:');
    console.error(error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
}

// Run the test function
testMicroRequest().catch(console.error);