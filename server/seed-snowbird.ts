import { db } from './db';
import { 
  snowbirdDestinations,
  InsertSnowbirdDestination
} from '../shared/schema';

/**
 * Seed the database with initial snowbird destination data
 */
async function seedSnowbirdDestinations() {
  console.log('Starting to seed snowbird destinations...');
  
  try {
    // Clear existing snowbird destinations
    console.log('Clearing existing snowbird destinations...');
    await db.delete(snowbirdDestinations);
    
    // Sample snowbird destinations
    const destinationsData: InsertSnowbirdDestination[] = [
      {
        name: "Puerto Vallarta",
        country: "Mexico",
        region: "North America",
        imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        avgWinterTemp: "25°C (77°F)",
        costComparison: "30-40% lower than Canada",
        description: "A vibrant coastal city with beautiful beaches, rich cultural heritage, and a thriving expat community.",
        visaRequirements: "Tourist visa for 180 days, easy to obtain",
        healthcareAccess: "Good quality private hospitals, many catering to international patients",
        avgAccommodationCost: "$800-1,500 USD/month for a 1-2 bedroom",
        flightTime: "5-6 hours from Toronto",
        languageBarrier: "Low to moderate",
        canadianExpats: "Large community",
        bestTimeToVisit: "November to April",
        localTips: "The 5 de Diciembre neighborhood offers a good balance of local culture and modern amenities.",
        costOfLiving: "Affordable with many options for all budgets"
      },
      {
        name: "Lisbon",
        country: "Portugal",
        region: "Europe",
        imageUrl: "https://images.unsplash.com/photo-1558370781-d6196949e317?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        avgWinterTemp: "15°C (59°F)",
        costComparison: "20-30% lower than Canada",
        description: "A charming coastal European capital with mild winters, rich history, and excellent cuisine.",
        visaRequirements: "Schengen visa for 90 days, D7 visa available for longer stays",
        healthcareAccess: "Excellent public and private healthcare system",
        avgAccommodationCost: "€900-1,800/month for a 1-2 bedroom",
        flightTime: "7-8 hours from Toronto",
        languageBarrier: "Moderate, English widely spoken in tourist areas",
        canadianExpats: "Medium-sized and growing community",
        bestTimeToVisit: "October to April",
        localTips: "Consider the Principe Real or Estrela neighborhoods for quieter living with good amenities.",
        costOfLiving: "Moderate, with affordable dining and transportation options"
      },
      {
        name: "Chiang Mai",
        country: "Thailand",
        region: "Asia",
        imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        avgWinterTemp: "28°C (82°F)",
        costComparison: "50-60% lower than Canada",
        description: "A cultural hub in Northern Thailand with a relaxed atmosphere, ancient temples, and modern amenities.",
        visaRequirements: "60-day tourist visa with extensions available, retirement visa option",
        healthcareAccess: "High-quality international hospitals at affordable prices",
        avgAccommodationCost: "$300-800 USD/month for a 1-2 bedroom",
        flightTime: "18-22 hours from Toronto (with connections)",
        languageBarrier: "High, but manageable in tourist areas",
        canadianExpats: "Large established expat community",
        bestTimeToVisit: "November to February (cool season)",
        localTips: "The Nimman area offers a good balance of local and western amenities.",
        costOfLiving: "Very affordable, with excellent value for money"
      },
      {
        name: "Malaga",
        country: "Spain",
        region: "Europe",
        imageUrl: "https://images.unsplash.com/photo-1555992457-b8fefdd70bef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        avgWinterTemp: "17°C (63°F)",
        costComparison: "25-35% lower than Canada",
        description: "A sunny coastal city in southern Spain with rich history, beautiful beaches, and excellent food.",
        visaRequirements: "Schengen visa for 90 days, Non-lucrative visa for longer stays",
        healthcareAccess: "Excellent public healthcare system, good private options",
        avgAccommodationCost: "€700-1,400/month for a 1-2 bedroom",
        flightTime: "8-9 hours from Toronto",
        languageBarrier: "Moderate to high, English common in tourist areas",
        canadianExpats: "Large international community with growing Canadian presence",
        bestTimeToVisit: "October to May",
        localTips: "Consider areas like Pedregalejo for a beachside location with local character.",
        costOfLiving: "Very reasonable compared to major Canadian cities"
      },
      {
        name: "Medellin",
        country: "Colombia",
        region: "South America",
        imageUrl: "https://images.unsplash.com/photo-1562572159-4efc207f5aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        avgWinterTemp: "22°C (72°F) year-round",
        costComparison: "40-50% lower than Canada",
        description: "Known as the 'City of Eternal Spring' for its pleasant climate, with modern infrastructure and scenic surroundings.",
        visaRequirements: "90-day tourist visa, retirement visa available",
        healthcareAccess: "High-quality healthcare at affordable prices",
        avgAccommodationCost: "$500-1,000 USD/month for a 1-2 bedroom",
        flightTime: "6-8 hours from Toronto",
        languageBarrier: "High, Spanish knowledge recommended",
        canadianExpats: "Growing expat community, smaller Canadian presence",
        bestTimeToVisit: "December to March (dry season)",
        localTips: "El Poblado is popular with expats, while Laureles offers a more authentic experience.",
        costOfLiving: "Very affordable, approximately 40-50% less than Canada"
      }
    ];
    
    // Insert destinations
    console.log('Adding snowbird destinations...');
    const inserted = await db.insert(snowbirdDestinations).values(destinationsData).returning();
    
    console.log(`Added ${inserted.length} snowbird destinations`);
    console.log('✅ Snowbird destinations seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding snowbird destinations:', error);
  }
}

// Run the seeding function
seedSnowbirdDestinations().catch(e => {
  console.error('Seeding script error:', e);
  process.exit(1);
});