import { db } from './db';
import { collections, collectionItems, destinations } from '../shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from "openai";

/**
 * Add destinations to the Wellness Retreats collection with basic content
 */
async function addWellnessItems() {
  try {
    console.log('Adding destinations to Wellness Retreats collection...');

    // First, check if the collection exists
    const [wellnessCollection] = await db.select()
      .from(collections)
      .where(eq(collections.slug, 'wellness-retreats'));

    if (!wellnessCollection) {
      console.log('Wellness Retreats collection not found');
      return;
    }

    console.log(`Found Wellness Collection with ID: ${wellnessCollection.id}`);

    // Get current wellness collection items
    const currentItems = await db.select()
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, wellnessCollection.id));

    console.log(`Current wellness collection has ${currentItems.length} items`);

    // Get all destinations
    const allDestinations = await db.select().from(destinations);
    
    // Wellness-focused destinations to add (if they exist)
    const wellnessDestinations = [
      { name: 'Santorini', position: 2 },
      { name: 'Bangkok', position: 3 },
      { name: 'Rome', position: 4 },
      { name: 'Tokyo', position: 5 },
    ];

    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
    const MODEL = "gpt-4o";

    // Function to generate wellness content
    async function generateWellnessContent(name: string, country: string) {
      try {
        console.log(`Generating wellness content for ${name}, ${country}...`);
        
        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are a wellness travel expert with deep knowledge of healing traditions, wellness practices, and rejuvenating destinations worldwide. Provide accurate, detailed information about wellness offerings in various locations."
            },
            {
              role: "user",
              content: `Create detailed wellness-focused content for ${name}, ${country} for a travel collection called "Wellness Retreats". 
              
              Please return a JSON object with these fields:
              1. "highlight": A compelling 1-2 sentence highlight about what makes this destination special for wellness travel (max 100 chars)
              2. "note": A deeper insider tip about the wellness offerings (max 100 chars)
              
              Focus on authentic wellness aspects like: traditional healing practices, natural hot springs, meditation retreats, yoga, mindfulness centers, thermal baths, or nature immersion opportunities.`
            }
          ],
          response_format: { type: "json_object" }
        });
        
        const content = JSON.parse(response.choices[0].message.content);
        return content;
      } catch (error) {
        console.error(`Error generating wellness content for ${name}:`, error);
        return null;
      }
    }

    // Process each wellness destination
    const addedDestinations = [];
    for (const wellnessDest of wellnessDestinations) {
      // Check if this destination is already in the collection
      const existingItem = currentItems.find(item => {
        const destination = allDestinations.find(d => d.id === item.destinationId);
        return destination && destination.name === wellnessDest.name;
      });

      if (existingItem) {
        console.log(`${wellnessDest.name} is already in the wellness collection, skipping...`);
        continue;
      }

      // Find the destination in our database
      const destination = allDestinations.find(d => d.name === wellnessDest.name);
      
      if (!destination) {
        console.log(`${wellnessDest.name} not found in the database, skipping...`);
        continue;
      }

      console.log(`Processing ${destination.name}, ${destination.country}...`);
      
      // Generate wellness content with OpenAI
      const wellnessContent = await generateWellnessContent(destination.name, destination.country);
      
      if (wellnessContent) {
        const [newItem] = await db.insert(collectionItems)
          .values({
            collectionId: wellnessCollection.id,
            destinationId: destination.id,
            position: wellnessDest.position,
            highlight: wellnessContent.highlight,
            note: wellnessContent.note
          })
          .returning();
          
        console.log(`Added ${destination.name} to wellness collection with AI-generated content`);
        addedDestinations.push(destination.name);
      } else {
        console.log(`Failed to generate content for ${destination.name}, skipping...`);
      }
    }

    // Update positions for all items
    const allItems = await db.select()
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, wellnessCollection.id))
      .orderBy(collectionItems.position);
      
    // Reorder positions to be sequential
    for (let i = 0; i < allItems.length; i++) {
      await db.update(collectionItems)
        .set({ position: i + 1 })
        .where(eq(collectionItems.id, allItems[i].id));
    }

    console.log(`Successfully added ${addedDestinations.length} destinations to Wellness Retreats collection`);
    console.log('Added destinations:', addedDestinations.join(', '));
  } catch (error) {
    console.error('Error adding wellness items:', error);
  }
}

// Run the function
addWellnessItems()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });