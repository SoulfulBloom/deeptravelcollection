import OpenAI from "openai";
import { db } from "./db";
import { 
  destinations, 
  collections,
  collectionItems
} from "../shared/schema";
import { eq } from "drizzle-orm";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Generate collection content for a specific collection and destination
async function generateCollectionContent(collectionName: string, destinationName: string, country: string) {
  try {
    console.log(`Generating ${collectionName} content for ${destinationName}, ${country}...`);
    
    const prompt = `
    Create content for ${destinationName}, ${country} that fits into a collection called "${collectionName}".
    Provide information in the following JSON format:
    
    {
      "highlight": "A compelling 1-2 sentence highlight about how this destination fits the ${collectionName} theme (max 100 chars)",
      "note": "A detailed insider tip related to the ${collectionName} theme for this destination (max 150 chars)"
    }
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a travel expert with deep knowledge about how destinations fit into various themed travel collections. You provide specific, authentic information that highlights the unique aspects of each destination."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error(`Error generating collection content for ${destinationName} in ${collectionName}:`, error);
    return null;
  }
}

// Main function to enrich all collections
async function enrichAllCollections() {
  try {
    console.log("Starting collection content enrichment...");
    
    // Get all collections
    const allCollections = await db.select().from(collections);
    console.log(`Found ${allCollections.length} collections to enrich`);
    
    // Get all destinations
    const allDestinations = await db.select().from(destinations);
    console.log(`Found ${allDestinations.length} destinations available`);
    
    // For each collection
    for (const collection of allCollections) {
      console.log(`\nProcessing collection: ${collection.name} (ID: ${collection.id})`);
      
      // Get current collection items
      const currentItems = await db.select()
        .from(collectionItems)
        .where(eq(collectionItems.collectionId, collection.id));
      
      console.log(`${collection.name} currently has ${currentItems.length} items`);
      
      // Get destinations not already in this collection
      const destinationsInCollection = currentItems.map(item => item.destinationId);
      
      // For each destination not already in the collection, limit to 3 per collection to avoid timeouts
      const destinationsToAdd = allDestinations
        .filter(dest => !destinationsInCollection.includes(dest.id))
        .slice(0, 3);
      
      console.log(`Adding ${destinationsToAdd.length} new destinations to ${collection.name}...`);
      
      // Add each destination to the collection
      let addedCount = 0;
      for (let i = 0; i < destinationsToAdd.length; i++) {
        const destination = destinationsToAdd[i];
        try {
          // Generate collection-specific content
          const collectionContent = await generateCollectionContent(
            collection.name,
            destination.name,
            destination.country
          );
          
          if (collectionContent) {
            // Insert collection item
            await db.insert(collectionItems).values({
              collectionId: collection.id,
              destinationId: destination.id,
              position: currentItems.length + i + 1,
              highlight: collectionContent.highlight,
              note: collectionContent.note
            });
            
            console.log(`✅ Added ${destination.name} to ${collection.name} collection`);
            addedCount++;
          }
        } catch (error) {
          console.error(`Error adding ${destination.name} to ${collection.name}:`, error);
        }
      }
      
      console.log(`Successfully added ${addedCount} destinations to ${collection.name}`);
    }
    
    console.log("\n✅ Collection enrichment completed successfully!");
  } catch (error) {
    console.error("Error enriching collections:", error);
  }
}

// Run the function
enrichAllCollections().then(() => {
  console.log('Enrichment completed');
  process.exit(0);
}).catch(error => {
  console.error('Enrichment failed:', error);
  process.exit(1);
});