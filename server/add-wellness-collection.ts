import { db } from './db';
import { collections, collectionItems, destinations } from '../shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from "openai";

/**
 * Add a new Wellness Retreats collection to the database
 */
async function generateWellnessContent(destination: string, country: string) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    
    console.log(`Generating wellness content for ${destination}, ${country}...`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a wellness travel expert with deep knowledge of healing traditions, wellness practices, and rejuvenating destinations worldwide. Provide accurate, detailed information about wellness offerings in various locations."
        },
        {
          role: "user",
          content: `Create detailed wellness-focused content for ${destination}, ${country} for a travel collection called "Wellness Retreats". 
          
          Please return a JSON object with these fields:
          1. "highlight": A compelling 1-2 sentence highlight about what makes this destination special for wellness travel (max 150 chars)
          2. "detail": A deeper explanation about the wellness offerings (200-250 chars)
          3. "traditionalPractices": Brief description of local healing or wellness traditions unique to this location
          4. "bestTimeToVisit": The optimal season for wellness activities
          5. "insiderTip": One specific insider recommendation for wellness travelers
          
          Focus on authentic wellness aspects like: traditional healing practices, natural hot springs, meditation retreats, yoga, mindfulness centers, thermal baths, or nature immersion opportunities.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    if (response.choices && response.choices[0]?.message.content) {
      try {
        return JSON.parse(response.choices[0].message.content);
      } catch (e) {
        console.error("Failed to parse OpenAI response as JSON:", e);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating wellness content with OpenAI:", error);
    return null;
  }
}

async function addWellnessCollection() {
  try {
    console.log('Creating Wellness Retreats collection...');

    // First, check if the collection already exists
    const existingCollection = await db.query.collections.findFirst({
      where: eq(collections.slug, 'wellness-retreats')
    });

    if (existingCollection) {
      console.log('Wellness Retreats collection already exists. Skipping creation.');
      return;
    }

    // Create the collection
    const [collection] = await db.insert(collections).values({
      name: 'Wellness Retreats',
      slug: 'wellness-retreats',
      description: 'Discover destinations known for rejuvenation, mindfulness, and natural healing. From yoga retreats to hot springs, these places offer the perfect escape to recharge your mind, body, and soul.',
      imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      themeColor: '#2dd4bf', // Teal color for wellness theme
      icon: 'spa', // Will map to an appropriate icon
      featured: true
    }).returning();

    console.log('Wellness collection created:', collection);

    // Get all available destinations from database
    const allDestinations = await db.query.destinations.findMany();
    console.log(`Found ${allDestinations.length} destinations to evaluate for wellness collection`);

    // Choose destinations known for wellness
    const wellnessDestinations = [
      {name: 'Bali', position: 1},
      {name: 'Bangkok', position: 2}, 
      {name: 'Rome', position: 3},
      {name: 'Tokyo', position: 4},
      {name: 'Santorini', position: 5}
    ];
    
    // Add items to the collection
    const collectionItemsData = [];
    
    // Process each wellness destination
    for (const wellnessDest of wellnessDestinations) {
      const destination = allDestinations.find(d => d.name === wellnessDest.name);
      
      if (destination) {
        console.log(`Processing wellness content for ${destination.name}, ${destination.country}`);
        
        // Generate content with OpenAI
        const wellnessContent = await generateWellnessContent(destination.name, destination.country);
        
        if (wellnessContent) {
          collectionItemsData.push({
            collectionId: collection.id,
            destinationId: destination.id,
            position: wellnessDest.position,
            highlight: wellnessContent.highlight || `${destination.name} offers unique wellness experiences that blend local traditions with modern practices.`,
            note: wellnessContent.insiderTip || `Best experienced during shoulder seasons when you can enjoy wellness activities without crowds.`
          });
          
          console.log(`Added AI-generated wellness content for ${destination.name}`);
        } else {
          // Fallback if AI generation fails
          collectionItemsData.push({
            collectionId: collection.id,
            destinationId: destination.id,
            position: wellnessDest.position,
            highlight: `${destination.name} offers unique wellness experiences that blend local traditions with modern practices.`,
            note: `Experience the local wellness traditions that have been practiced for generations.`
          });
          
          console.log(`Added fallback wellness content for ${destination.name}`);
        }
      }
    }

    if (collectionItemsData.length > 0) {
      const insertedItems = await db.insert(collectionItems).values(collectionItemsData).returning();
      console.log(`Added ${insertedItems.length} destinations to the Wellness Retreats collection`);
    }

    console.log('Wellness Retreats collection added successfully');
  } catch (error) {
    console.error('Error adding Wellness Retreats collection:', error);
  }
}

// Run the function
addWellnessCollection()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });