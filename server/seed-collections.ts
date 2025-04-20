import { collections, collectionItems, type InsertCollection, type InsertCollectionItem } from "../shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema";

/**
 * Seed the database with themed collections data
 */
async function seedCollections() {
  console.log("Starting to seed themed collections...");
  
  // Define our themed collections
  const themedCollections: InsertCollection[] = [
    {
      name: "Culinary Journeys",
      slug: "culinary-journeys",
      description: "Experience the world through its flavors. These destinations offer extraordinary food markets, authentic cooking classes, and opportunities to dine with locals.",
      imageUrl: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?q=80&w=1180",
      themeColor: "#FF6B35",
      icon: "utensils",
      featured: true,
    },
    {
      name: "Cultural Immersion",
      slug: "cultural-immersion",
      description: "Go beyond sightseeing with destinations known for traditional arts, hands-on crafts workshops, and vibrant local festivals.",
      imageUrl: "https://images.unsplash.com/photo-1531331022685-b920b44e7b14?q=80&w=1170",
      themeColor: "#5271FF",
      icon: "palette",
      featured: true,
    },
    {
      name: "Community Connections",
      slug: "community-connections",
      description: "Make a positive impact while traveling with ethical volunteer opportunities and community-based tourism experiences.",
      imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1170",
      themeColor: "#28A745",
      icon: "users",
      featured: false,
    },
    {
      name: "Hidden Gems",
      slug: "hidden-gems",
      description: "Explore off-the-beaten-path locations known primarily to locals that offer authentic experiences away from tourist crowds.",
      imageUrl: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1170",
      themeColor: "#9C6ADE",
      icon: "gem",
      featured: true,
    },
    {
      name: "Wellness Retreats",
      slug: "wellness-retreats",
      description: "Discover destinations known for rejuvenation, mindfulness, and natural healing. From yoga retreats to hot springs, these places offer the perfect escape to recharge your mind, body, and soul.",
      imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      themeColor: "#2dd4bf",
      icon: "spa",
      featured: true,
    }
  ];
  
  try {
    // Clear existing collections and items
    console.log("Clearing existing collections and items...");
    await db.execute(sql`TRUNCATE TABLE collection_items CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE collections CASCADE;`);
    
    // Insert collections
    console.log("Adding collections...");
    const insertedCollections = await db.insert(collections).values(themedCollections).returning();
    
    // Create a map of collection slugs to IDs for easier reference
    const collectionMap = new Map();
    insertedCollections.forEach(collection => {
      collectionMap.set(collection.slug, collection.id);
    });
    
    // Get destination IDs from the database
    console.log("Fetching destination IDs...");
    const destinationRecords = await db
      .select({
        id: schema.destinations.id,
        name: schema.destinations.name,
        country: schema.destinations.country
      })
      .from(schema.destinations);
    
    const destinationMap = new Map();
    destinationRecords.forEach(dest => {
      // Use a composite key of name-country for uniqueness
      const key = `${dest.name.toLowerCase()}-${dest.country.toLowerCase()}`;
      destinationMap.set(key, dest.id);
    });
    
    // Define collection items with appropriate destinations
    
    // Culinary Journeys Collection Items
    const culinaryItems: InsertCollectionItem[] = [
      {
        collectionId: collectionMap.get("culinary-journeys"),
        destinationId: destinationMap.get("tokyo-japan"),
        position: 1,
        highlight: "World-class sushi, ramen, and izakaya experiences",
        note: "Don't miss the Tsukiji Outer Market food tour for an authentic taste of Tokyo's culinary heritage"
      },
      {
        collectionId: collectionMap.get("culinary-journeys"),
        destinationId: destinationMap.get("barcelona-spain"),
        position: 2,
        highlight: "Tapas crawls and world-renowned food markets",
        note: "La Boqueria market is a must-visit, but venture to smaller neighborhood markets for a more authentic experience"
      },
      {
        collectionId: collectionMap.get("culinary-journeys"),
        destinationId: destinationMap.get("bangkok-thailand"),
        position: 3,
        highlight: "Street food paradise with vibrant flavors",
        note: "The street food tours in Chinatown (Yaowarat) offer an incredible variety of authentic Thai dishes"
      },
    ];
    
    // Cultural Immersion Collection Items
    const culturalItems: InsertCollectionItem[] = [
      {
        collectionId: collectionMap.get("cultural-immersion"),
        destinationId: destinationMap.get("bali-indonesia"),
        position: 1,
        highlight: "Traditional dance performances and temple ceremonies",
        note: "Participate in a traditional offering-making workshop to understand Balinese spiritual practices"
      },
      {
        collectionId: collectionMap.get("cultural-immersion"),
        destinationId: destinationMap.get("cairo-egypt"),
        position: 2,
        highlight: "Ancient history and traditional craftsmanship",
        note: "Visit Khan el-Khalili bazaar to see traditional crafts being made and take a pottery workshop"
      },
      {
        collectionId: collectionMap.get("cultural-immersion"),
        destinationId: destinationMap.get("tokyo-japan"),
        position: 3,
        highlight: "Traditional tea ceremonies and cultural arts",
        note: "Book a traditional kimono wearing experience and tea ceremony for deep cultural immersion"
      },
    ];
    
    // Community Connections Collection Items
    const communityItems: InsertCollectionItem[] = [
      {
        collectionId: collectionMap.get("community-connections"),
        destinationId: destinationMap.get("bali-indonesia"),
        position: 1,
        highlight: "Sustainable tourism initiatives and community-based tours",
        note: "Visit the Bali Pulina coffee plantation to learn about traditional coffee production that supports local communities"
      },
      {
        collectionId: collectionMap.get("community-connections"),
        destinationId: destinationMap.get("bangkok-thailand"),
        position: 2,
        highlight: "Ethical elephant sanctuaries and community projects",
        note: "Support organizations focused on ethical animal tourism rather than exploitative attractions"
      },
    ];
    
    // Hidden Gems Collection Items
    const hiddenGemItems: InsertCollectionItem[] = [
      {
        collectionId: collectionMap.get("hidden-gems"),
        destinationId: destinationMap.get("barcelona-spain"),
        position: 1,
        highlight: "Lesser-known Gaudí works and local neighborhoods",
        note: "Skip Park Güell crowds and visit Colònia Güell for Gaudí's hidden masterpiece without the tourist masses"
      },
      {
        collectionId: collectionMap.get("hidden-gems"),
        destinationId: destinationMap.get("tokyo-japan"),
        position: 2,
        highlight: "Hidden shrines and local neighborhood izakayas",
        note: "Explore Yanaka, one of Tokyo's oldest neighborhoods with traditional atmosphere and local craftsmen"
      },
      {
        collectionId: collectionMap.get("hidden-gems"),
        destinationId: destinationMap.get("rome-italy"),
        position: 3,
        highlight: "Secret viewpoints and local trattorias",
        note: "Visit Aventine Hill's 'Keyhole' view of St. Peter's Basilica for a truly hidden Roman experience"
      },
    ];
    
    // Wellness Retreats Collection Items
    const wellnessItems: InsertCollectionItem[] = [
      {
        collectionId: collectionMap.get("wellness-retreats"),
        destinationId: destinationMap.get("bali-indonesia"),
        position: 1,
        highlight: "Yoga retreats, meditation centers, and holistic healing",
        note: "Ubud is the wellness capital of Bali, with dozens of yoga studios and holistic healing centers"
      },
      {
        collectionId: collectionMap.get("wellness-retreats"),
        destinationId: destinationMap.get("kyoto-japan"),
        position: 2,
        highlight: "Traditional onsen (hot springs) and Zen meditation",
        note: "Experience Zazen meditation at authentic Zen temples for true mindfulness"
      },
      {
        collectionId: collectionMap.get("wellness-retreats"),
        destinationId: destinationMap.get("costa-rica-costa rica"),
        position: 3,
        highlight: "Eco-wellness retreats in lush rainforest settings",
        note: "The Nicoya Peninsula is one of the world's Blue Zones where people live longer, healthier lives"
      }
    ];
    
    // Combine all collection items
    const allCollectionItems = [
      ...culinaryItems.filter(item => item.destinationId), 
      ...culturalItems.filter(item => item.destinationId),
      ...communityItems.filter(item => item.destinationId),
      ...hiddenGemItems.filter(item => item.destinationId),
      ...wellnessItems.filter(item => item.destinationId)
    ];
    
    // Insert collection items if we have valid ones
    if (allCollectionItems.length > 0) {
      console.log("Adding collection items...");
      await db.insert(collectionItems).values(allCollectionItems);
    }
    
    console.log("Themed collections seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding collections:", error);
  }
}

// This is now handled by setup-collections.ts

export { seedCollections };