import { db } from "./db";
import {
  destinations,
  enhancedExperiences,
  type InsertEnhancedExperience
} from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

/**
 * This script adds three preset authentic local experiences for each destination that doesn't have any
 */
async function addExperiencesPreset() {
  try {
    console.log("Finding destinations without experiences...");
    
    // Find destinations without experiences
    const destinationsWithoutExperiences = await db.select({
      id: destinations.id,
      name: destinations.name,
      country: destinations.country
    })
    .from(destinations)
    .leftJoin(
      enhancedExperiences,
      eq(destinations.id, enhancedExperiences.destinationId)
    )
    .where(isNull(enhancedExperiences.id))
    .groupBy(destinations.id, destinations.name, destinations.country);
    
    if (destinationsWithoutExperiences.length === 0) {
      console.log("All destinations already have experiences!");
      return;
    }
    
    console.log(`Found ${destinationsWithoutExperiences.length} destinations without experiences`);
    
    let successCount = 0;
    
    // Process each destination
    for (const destination of destinationsWithoutExperiences) {
      console.log(`Processing ${destination.name}, ${destination.country}...`);
      
      try {
        // Add cultural experience
        const culturalExperience: InsertEnhancedExperience = {
          destinationId: destination.id,
          title: getCulturalTitle(destination.name),
          specificLocation: getCulturalLocation(destination.name),
          description: `Explore the authentic cultural heart of ${destination.name} through local interactions that reveal the true character of the city.`,
          personalNarrative: `I wandered through narrow streets early in the morning before the crowds arrived. An elderly local invited me for coffee and shared stories about how the neighborhood had changed, offering a perspective I'd never find in guidebooks.`,
          season: "Year-round, though spring and fall offer the most pleasant temperatures",
          seasonalEvent: null,
          bestTimeToVisit: "Early morning (7-9am) to avoid crowds and see locals starting their day",
          localTip: `Visit on a weekday rather than weekend, and explore side streets at least 2-3 blocks away from major landmarks.`
        };
        
        // Add culinary experience
        const culinaryExperience: InsertEnhancedExperience = {
          destinationId: destination.id,
          title: getCulinaryTitle(destination.name),
          specificLocation: getCulinaryLocation(destination.name),
          description: `Immerse yourself in the authentic flavors of ${destination.country} at local markets and family-run eateries away from tourist areas.`,
          personalNarrative: `The aroma of freshly prepared local delicacies drew me into a tiny establishment without an English menu. Using hand gestures, I ordered what the family at the next table was enjoying. It was the most memorable meal of my trip.`,
          season: "Year-round",
          seasonalEvent: null,
          bestTimeToVisit: "During local mealtime hours (often different from tourist dining hours)",
          localTip: `Look for eateries filled with locals, not tourists. If there's a line of locals, it's worth the wait.`
        };
        
        // Add nature experience
        const natureExperience: InsertEnhancedExperience = {
          destinationId: destination.id,
          title: getNatureTitle(destination.name),
          specificLocation: getNatureLocation(destination.name),
          description: `Escape the urban environment to experience the breathtaking natural landscapes that locals treasure outside ${destination.name}.`,
          personalNarrative: `Away from tourist buses, I hired a local guide who took me to a viewpoint known mainly to photographers and locals. The hike was moderately challenging, but the sense of solitude and connection to the landscape was worth every step.`,
          season: "Best during spring or fall when the weather is mild",
          seasonalEvent: null,
          bestTimeToVisit: "Early morning or late afternoon for the best light and fewer people",
          localTip: `Bring appropriate footwear and water. Many tourists miss the best viewpoints that require a short hike.`
        };
        
        // Insert all three experiences
        await db.insert(enhancedExperiences).values(culturalExperience);
        console.log(`Added cultural experience: ${culturalExperience.title}`);
        
        await db.insert(enhancedExperiences).values(culinaryExperience);
        console.log(`Added culinary experience: ${culinaryExperience.title}`);
        
        await db.insert(enhancedExperiences).values(natureExperience);
        console.log(`Added nature experience: ${natureExperience.title}`);
        
        console.log(`✅ Successfully added 3 experiences for ${destination.name}`);
        successCount++;
      } catch (error) {
        console.error(`Error adding experiences for ${destination.name}:`, error);
      }
    }
    
    console.log(`✅ Added experiences to ${successCount} out of ${destinationsWithoutExperiences.length} destinations`);
  } catch (error) {
    console.error("Error in addExperiencesPreset:", error);
  }
}

// Cultural titles for major destinations
function getCulturalTitle(name: string): string {
  const culturalTitles: Record<string, string> = {
    'Paris': 'Morning with Artists in Montmartre',
    'Rome': 'Hidden Passages of Ancient Rome',
    'Tokyo': 'Traditional Tea Ceremony in Yanaka',
    'New York': 'Local Jazz in Harlem',
    'Barcelona': 'Gothic Quarter Architectural Secrets',
    'Mexico City': 'Frida Kahlo\'s Neighborhood Exploration',
    'Cairo': 'Old Islamic Quarter Artisan Workshops',
    'Bangkok': 'Dawn at the Flower Markets',
    'Amsterdam': 'Hidden Courtyard Gardens Tour',
    'Singapore': 'Peranakan Heritage in Joo Chiat',
    'Vienna': 'Classical Music in Historic Coffee Houses',
    'Prague': 'Lesser Known Art Nouveau Landmarks',
    'Rio de Janeiro': 'Bohemian Santa Teresa District',
    'Sydney': 'Aboriginal Heritage Walk',
    'Buenos Aires': 'Milonga Dance Halls of San Telmo',
    'Marrakech': 'Traditional Craft Workshops in the Medina',
    'Hanoi': 'Early Morning Tai Chi by Hoan Kiem Lake',
    'Cape Town': 'Bo-Kaap Cooking with Cape Malay Families',
    'Cusco': 'Traditional Weaving Demonstrations',
    'Cartagena': 'Afro-Colombian Drumming Circles',
    'Zanzibar': 'Spice Farm Tour with Local Farmers',
    'Vancouver': 'First Nations Art and Storytelling',
  };
  
  return culturalTitles[name] || `Cultural Immersion in ${name}'s Historic Quarter`;
}

// Culinary titles for major destinations
function getCulinaryTitle(name: string): string {
  const culinaryTitles: Record<string, string> = {
    'Paris': 'Market Shopping with Locals in Bastille',
    'Rome': 'Pasta Making with Roman Grandmothers',
    'Tokyo': 'Dawn at Tsukiji Outer Market',
    'New York': 'Ethnic Food Crawl Through Queens',
    'Barcelona': 'Catalan Cooking in Traditional Homes',
    'Mexico City': 'Street Taco Tour with Local Foodies',
    'Cairo': 'Egyptian Home Cooking Experience',
    'Bangkok': 'Canal-side Street Food by Boat',
    'Amsterdam': 'Dutch Cheese Tasting with Farmers',
    'Singapore': 'Hawker Center Culinary Deep Dive',
    'Vienna': 'Hidden Wine Taverns of Grinzing',
    'Prague': 'Homestyle Czech Brewing Traditions',
    'Rio de Janeiro': 'Feijoada Cooking in Local Homes',
    'Sydney': 'Aboriginal Bush Tucker Experience',
    'Buenos Aires': 'Asado Grilling with Local Families',
    'Marrakech': 'Spice Shopping and Tagine Workshop',
    'Hanoi': 'Early Morning Pho Breakfast Rituals',
    'Cape Town': 'South African Braai in Townships',
    'Cusco': 'Ancient Inca Cooking Techniques',
    'Cartagena': 'Caribbean Seafood Preparation with Fishermen',
    'Zanzibar': 'Swahili Cooking in Stone Town Homes',
    'Vancouver': 'Pacific Northwest Indigenous Foods',
  };
  
  return culinaryTitles[name] || `Local Food Exploration in ${name}`;
}

// Nature titles for major destinations
function getNatureTitle(name: string): string {
  const natureTitles: Record<string, string> = {
    'Paris': 'Hidden Gardens and Secret Passages Walk',
    'Rome': 'Appian Way Countryside Bike Tour',
    'Tokyo': 'Secluded Gardens and Shrines Walk',
    'New York': 'Urban Kayaking on the Hudson',
    'Barcelona': 'Bunkers del Carmel Sunset Experience',
    'Mexico City': 'Floating Gardens of Xochimilco',
    'Cairo': 'Desert Stargazing Outside the City',
    'Bangkok': 'Bang Krachao Green Lung Cycling',
    'Amsterdam': 'Wildlife Spotting in the Waterland',
    'Singapore': 'Secrets of the Southern Ridges',
    'Vienna': 'Vineyards and Heurigen of Vienna Woods',
    'Prague': 'Bohemian Paradise Sandstone Formations',
    'Rio de Janeiro': 'Hidden Beaches of Zona Oeste',
    'Sydney': 'Coastal Walks Beyond Bondi',
    'Buenos Aires': 'Tigre Delta Waterways Exploration',
    'Marrakech': 'Atlas Mountain Berber Villages',
    'Hanoi': 'Ninh Binh Countryside by Boat',
    'Cape Town': 'Fynbos Flora on Table Mountain',
    'Cusco': 'Sacred Valley Medicinal Plants Walk',
    'Cartagena': 'Mangrove Ecosystem by Canoe',
    'Zanzibar': 'Dolphin Swimming at Dawn',
    'Vancouver': 'Temperate Rainforest Meditation',
  };
  
  return natureTitles[name] || `Natural Beauty Near ${name}`;
}

// Cultural locations for major destinations
function getCulturalLocation(name: string): string {
  const culturalLocations: Record<string, string> = {
    'Paris': 'Montmartre and Place du Tertre',
    'Rome': 'Trastevere and Jewish Quarter',
    'Tokyo': 'Yanaka and Nezu neighborhoods',
    'New York': 'Harlem and Lower East Side',
    'Barcelona': 'Gothic Quarter and El Born',
    'Mexico City': 'Coyoacán and San Ángel',
    'Cairo': 'Khan el-Khalili and Al-Muizz Street',
    'Bangkok': 'Pak Khlong Talat and Thonburi',
    'Amsterdam': 'Jordaan and Begijnhof',
    'Singapore': 'Joo Chiat and Katong',
    'Vienna': 'Spittelberg and Neubau',
    'Prague': 'Malá Strana and Vinohrady',
    'Rio de Janeiro': 'Santa Teresa and Lapa',
    'Sydney': 'The Rocks and Newtown',
    'Buenos Aires': 'San Telmo and La Boca',
    'Marrakech': 'The Medina and Mellah',
    'Hanoi': 'Old Quarter and French Quarter',
    'Cape Town': 'Bo-Kaap and Woodstock',
    'Cusco': 'San Blas and Plaza de Armas',
    'Cartagena': 'Getsemaní and Ciudad Amurallada',
    'Zanzibar': 'Stone Town and Forodhani Gardens',
    'Vancouver': 'Granville Island and Gastown',
  };
  
  return culturalLocations[name] || `Historic District of ${name}`;
}

// Culinary locations for major destinations
function getCulinaryLocation(name: string): string {
  const culinaryLocations: Record<string, string> = {
    'Paris': 'Marché d\'Aligre and Rue Mouffetard',
    'Rome': 'Testaccio Market and Trastevere eateries',
    'Tokyo': 'Tsukiji Outer Market and Omoide Yokocho',
    'New York': 'Jackson Heights and Flushing',
    'Barcelona': 'Mercat de Sant Antoni and El Poble Sec',
    'Mexico City': 'Mercado de la Merced and Roma Norte',
    'Cairo': 'El Sayeda Zeinab and Khan el-Khalili food stalls',
    'Bangkok': 'Or Tor Kor Market and Chinatown',
    'Amsterdam': 'Albert Cuyp Market and De Pijp',
    'Singapore': 'Maxwell Food Centre and Geylang Serai Market',
    'Vienna': 'Naschmarkt and Grinzing',
    'Prague': 'Jiřák Farmers Market and Karlín',
    'Rio de Janeiro': 'Feira de São Cristóvão and Cadeg Market',
    'Sydney': 'Fish Market and Marrickville',
    'Buenos Aires': 'Mercado de San Telmo and Palermo Viejo',
    'Marrakech': 'Jemaa el-Fnaa food stalls and Mellah Spice Souk',
    'Hanoi': 'Dong Xuan Market and Old Quarter street vendors',
    'Cape Town': 'Neighbourgoods Market and Mzoli\'s',
    'Cusco': 'San Pedro Market and San Blas neighborhood',
    'Cartagena': 'Mercado Bazurto and Getsemaní',
    'Zanzibar': 'Forodhani Gardens night market and Darajani Market',
    'Vancouver': 'Granville Island Market and Commercial Drive',
  };
  
  return culinaryLocations[name] || `Local Markets and Restaurants in ${name}`;
}

// Nature locations for major destinations
function getNatureLocation(name: string): string {
  const natureLocations: Record<string, string> = {
    'Paris': 'Bois de Vincennes and Canal Saint-Martin',
    'Rome': 'Via Appia Antica and Villa Borghese Gardens',
    'Tokyo': 'Shinjuku Gyoen and Mount Takao',
    'New York': 'Hudson River and Governors Island',
    'Barcelona': 'Bunkers del Carmel and Montjuïc',
    'Mexico City': 'Xochimilco and Desierto de los Leones',
    'Cairo': 'Al-Azhar Park and Wadi Degla Protectorate',
    'Bangkok': 'Bang Krachao and Lumpini Park',
    'Amsterdam': 'Waterland and Amsterdamse Bos',
    'Singapore': 'Southern Ridges and Sungei Buloh',
    'Vienna': 'Vienna Woods and Kahlenberg',
    'Prague': 'Divoká Šárka and Prokopské údolí',
    'Rio de Janeiro': 'Tijuca Forest and Prainha Beach',
    'Sydney': 'Royal National Park and Ku-ring-gai Chase',
    'Buenos Aires': 'Tigre Delta and Costanera Sur Ecological Reserve',
    'Marrakech': 'Ourika Valley and Agafay Desert',
    'Hanoi': 'Ninh Binh and Perfume Pagoda',
    'Cape Town': 'Table Mountain and Cape Point',
    'Cusco': 'Sacred Valley and Humantay Lake',
    'Cartagena': 'Rosario Islands and La Boquilla Mangroves',
    'Zanzibar': 'Mnemba Atoll and Jozani Forest',
    'Vancouver': 'Stanley Park and Lynn Canyon',
  };
  
  return natureLocations[name] || `Natural Areas Surrounding ${name}`;
}

// Run the function
addExperiencesPreset().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add experiences:", error);
  process.exit(1);
});