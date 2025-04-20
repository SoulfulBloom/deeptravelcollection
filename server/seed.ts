import { db } from './db';
import { sql } from 'drizzle-orm';
import { 
  regions, destinations, itineraries, days, testimonials, enhancedExperiences,
  collections, collectionItems,
  InsertRegion, InsertDestination, InsertItinerary, InsertDay, InsertTestimonial
} from '../shared/schema';
import { seedEnhancedExperiences } from './seed-experiences';
import { seedCollections } from './seed-collections';

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in reverse order of dependencies)
  console.log('Clearing existing data...');
  
  // First handle tables with foreign keys
  try {
    console.log('Clearing enhanced_experiences...');
    await db.execute(sql`TRUNCATE TABLE enhanced_experiences CASCADE;`);
  } catch (error: any) {
    console.log('Error clearing enhanced_experiences:', error.message);
  }
  
  try {
    console.log('Clearing budget_categories...');
    await db.execute(sql`TRUNCATE TABLE budget_categories CASCADE;`);
  } catch (error: any) {
    console.log('Error clearing budget_categories:', error.message);
  }
  
  try {
    console.log('Clearing favorites...');
    await db.execute(sql`TRUNCATE TABLE favorites CASCADE;`);
  } catch (error: any) {
    console.log('Error clearing favorites:', error.message);
  }
  
  try {
    console.log('Clearing collection_items...');
    await db.execute(sql`TRUNCATE TABLE collection_items CASCADE;`);
  } catch (error: any) {
    console.log('Error clearing collection_items:', error.message);
  }
  
  try {
    console.log('Clearing collections...');
    await db.execute(sql`TRUNCATE TABLE collections CASCADE;`);
  } catch (error: any) {
    console.log('Error clearing collections:', error.message);
  }
  
  // Now clear the rest of the tables
  await db.delete(days);
  await db.delete(testimonials); 
  await db.delete(itineraries);
  await db.delete(destinations);
  await db.delete(regions);

  // Add regions
  console.log('Adding regions...');
  const regionsData: InsertRegion[] = [
    { name: "Europe" },
    { name: "Asia" },
    { name: "North America" },
    { name: "South America" },
    { name: "Africa" },
    { name: "Oceania" }
  ];
  
  const insertedRegions = await db.insert(regions).values(regionsData).returning();
  const regionMap = new Map(insertedRegions.map(r => [r.name, r.id]));

  // Add destinations
  console.log('Adding destinations...');
  const destinationsData: InsertDestination[] = [
    {
      name: "Tokyo",
      country: "Japan",
      regionId: regionMap.get("Asia")!,
      description: "Discover Tokyo's blend of traditional culture and modern innovation, from historic temples to vibrant neighborhoods.",
      imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      rating: "4.8",
      downloadCount: 1200,
      featured: true
    },
    {
      name: "Barcelona",
      country: "Spain",
      regionId: regionMap.get("Europe")!,
      description: "Experience Gaudí's masterpieces, stunning beaches, and tapas culture in this vibrant Catalan city.",
      imageUrl: "https://images.unsplash.com/photo-1499678329028-101435549a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      rating: "4.7",
      downloadCount: 990,
      featured: true
    },
    {
      name: "Bali",
      country: "Indonesia",
      regionId: regionMap.get("Asia")!,
      description: "Explore lush rice terraces, ancient temples, vibrant culture, and stunning beaches on this idyllic island.",
      imageUrl: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      rating: "4.9",
      downloadCount: 1500,
      featured: true
    },
    {
      name: "Paris",
      country: "France",
      regionId: regionMap.get("Europe")!,
      description: "Discover the City of Light with its iconic Eiffel Tower, world-class museums, and charming cafés.",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.6",
      downloadCount: 1300,
      featured: false
    },
    {
      name: "New York",
      country: "USA",
      regionId: regionMap.get("North America")!,
      description: "Experience the Big Apple's skyscrapers, diverse neighborhoods, and vibrant arts and food scene.",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.7",
      downloadCount: 1100,
      featured: false
    },
    {
      name: "Rome",
      country: "Italy",
      regionId: regionMap.get("Europe")!,
      description: "Explore the Eternal City's ancient ruins, Renaissance art, and lively piazzas.",
      imageUrl: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.8",
      downloadCount: 980,
      featured: false
    },
    {
      name: "Sydney",
      country: "Australia",
      regionId: regionMap.get("Oceania")!,
      description: "Discover the iconic harbor, beautiful beaches, and vibrant culture of Australia's largest city.",
      imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.7",
      downloadCount: 850,
      featured: false
    },
    {
      name: "Cairo",
      country: "Egypt",
      regionId: regionMap.get("Africa")!,
      description: "Explore ancient pyramids, bustling markets, and the rich history of this iconic Egyptian city.",
      imageUrl: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.5",
      downloadCount: 780,
      featured: false
    },
    {
      name: "Rio de Janeiro",
      country: "Brazil",
      regionId: regionMap.get("South America")!,
      description: "Experience stunning beaches, vibrant culture, and iconic landmarks in this Brazilian paradise.",
      imageUrl: "https://images.unsplash.com/photo-1619546952812-520e98064a52?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.6",
      downloadCount: 920,
      featured: false
    },
    {
      name: "Bangkok",
      country: "Thailand",
      regionId: regionMap.get("Asia")!,
      description: "Explore ancient temples, floating markets, and vibrant street life in Thailand's capital city.",
      imageUrl: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      rating: "4.5",
      downloadCount: 870,
      featured: false
    },
    {
      name: "Santorini",
      country: "Greece",
      regionId: regionMap.get("Europe")!,
      description: "Discover white-washed buildings, breathtaking caldera views, and stunning sunsets on this Greek island.",
      imageUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      rating: "4.9",
      downloadCount: 1600,
      featured: false
    }
  ];

  const insertedDestinations = await db.insert(destinations).values(destinationsData).returning();
  const destinationMap = new Map(insertedDestinations.map(d => [d.name, d.id]));

  // Add itineraries
  console.log('Adding itineraries...');
  const itinerariesData: InsertItinerary[] = [
    {
      destinationId: destinationMap.get("Tokyo")!,
      title: "Tokyo 5-Day Itinerary",
      duration: 5,
      description: "Experience the best of Tokyo in 5 days",
      content: "A comprehensive guide to exploring Tokyo's highlights in 5 days, including cultural landmarks, shopping districts, and food recommendations."
    },
    {
      destinationId: destinationMap.get("Barcelona")!,
      title: "Barcelona 7-Day Itinerary",
      duration: 7,
      description: "Architecture and Mediterranean vibes",
      content: "A week-long exploration of Barcelona's architectural wonders, beaches, and culinary delights."
    },
    {
      destinationId: destinationMap.get("Bali")!,
      title: "Bali 10-Day Itinerary",
      duration: 10,
      description: "Tropical paradise island experience",
      content: "An extensive guide to Bali's beaches, temples, rice terraces, and cultural experiences over 10 days."
    },
    {
      destinationId: destinationMap.get("Cairo")!,
      title: "Cairo 6-Day Itinerary",
      duration: 6,
      description: "Ancient wonders and vibrant culture",
      content: "A 6-day journey through Egypt's capital, exploring pyramids, museums, markets, and experiencing authentic Egyptian cuisine."
    },
    {
      destinationId: destinationMap.get("Santorini")!,
      title: "Santorini 5-Day Itinerary",
      duration: 5,
      description: "Island exploration and stunning sunsets",
      content: "A perfect 5-day plan to experience the beauty and culture of Santorini, Greece."
    }
  ];

  const insertedItineraries = await db.insert(itineraries).values(itinerariesData).returning();
  const itineraryMap = new Map<string, number>();
  
  // Map destination names to itinerary IDs for easier reference
  insertedItineraries.forEach(itinerary => {
    const destinationName = Array.from(destinationMap.entries())
      .find(([_, id]) => id === itinerary.destinationId)?.[0];
    if (destinationName) {
      itineraryMap.set(destinationName, itinerary.id);
    }
  });

  // Add Cairo days
  console.log('Adding itinerary days...');
  const cairoDays: InsertDay[] = [
    {
      itineraryId: itineraryMap.get("Cairo")!,
      dayNumber: 1,
      title: "Arrival & Giza Pyramids",
      activities: ["Arrival at Cairo International Airport", "Check-in at hotel", "Visit the Great Pyramids of Giza", "See the Sphinx", "Dinner with views of the pyramids"]
    },
    {
      itineraryId: itineraryMap.get("Cairo")!,
      dayNumber: 2,
      title: "Egyptian Museum & Old Cairo",
      activities: ["Visit the Egyptian Museum", "See the treasures of Tutankhamun", "Explore Coptic Cairo", "Visit the Hanging Church", "Shop at Khan el-Khalili bazaar"]
    },
    {
      itineraryId: itineraryMap.get("Cairo")!,
      dayNumber: 3,
      title: "Islamic Cairo",
      activities: ["Tour the Citadel of Saladin", "Visit the Alabaster Mosque", "Explore Al-Azhar Park", "See Sultan Hassan Mosque", "Evening Nile dinner cruise"]
    },
    {
      itineraryId: itineraryMap.get("Cairo")!,
      dayNumber: 4,
      title: "Memphis & Saqqara",
      activities: ["Day trip to Memphis, Egypt's ancient capital", "Visit the Step Pyramid at Saqqara", "See the Bent Pyramid", "Traditional Egyptian lunch experience"]
    },
    {
      itineraryId: itineraryMap.get("Cairo")!,
      dayNumber: 5,
      title: "Culinary & Cultural Day",
      activities: ["Egyptian cooking class", "Visit Al-Azhar Mosque", "Shop for spices and souvenirs", "Visit Cairo Tower for city views"]
    },
    {
      itineraryId: itineraryMap.get("Cairo")!,
      dayNumber: 6,
      title: "Alexandria Day Trip & Departure",
      activities: ["Optional day trip to Alexandria", "See Bibliotheca Alexandrina", "Visit the Roman Amphitheater", "Return to Cairo and departure preparations"]
    }
  ];

  await db.insert(days).values(cairoDays);

  // Add testimonials
  console.log('Adding testimonials...');
  const testimonialsData: InsertTestimonial[] = [
    {
      destinationName: "Tokyo",
      userName: "Sarah Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      comment: "The Tokyo itinerary was perfect! It had the perfect balance of must-see attractions and off-the-beaten-path spots. I wouldn't have discovered the amazing hidden ramen shop without this guide.",
      itineraryName: "Tokyo 5-Day Itinerary"
    },
    {
      destinationName: "Barcelona",
      userName: "Miguel Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      comment: "I've used several itineraries from this site and they're consistently excellent. The Barcelona guide helped me avoid tourist traps and experience the city like a local. Highly recommended!",
      itineraryName: "Barcelona 7-Day Itinerary"
    },
    {
      destinationName: "Cairo",
      userName: "James Taylor",
      userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      comment: "The Cairo itinerary was incredible! From the Pyramids to the Egyptian Museum, every day was perfectly planned. The local food recommendations were excellent, and the tips for navigating the markets saved us time and money.",
      itineraryName: "Cairo 6-Day Itinerary"
    },
    {
      destinationName: "Bali",
      userName: "Emma Wilson",
      userAvatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 4,
      comment: "The detailed day plans saved me so much time planning my Bali trip. I loved that it included both popular spots and hidden gems. The restaurant recommendations were spot on!",
      itineraryName: "Bali 10-Day Itinerary"
    }
  ];

  await db.insert(testimonials).values(testimonialsData);
  
  /* Enhanced experiences are seeded after destinations are added
   * However, since our seed-experiences script also handles cleaning and inserting
   * we'll let the experiences be seeded separately */
  console.log('Enhanced experiences will be seeded separately');
  
  // Budget categories seeding is handled separately
  console.log('Budget categories seeding is handled separately');

  // Collections seeding is handled separately
  console.log('Collections seeding is handled separately');

  console.log('✅ Database seeded successfully!');
}

// Run the seed function
seedDatabase().catch(e => {
  console.error('Failed to seed database:', e);
  process.exit(1);
});