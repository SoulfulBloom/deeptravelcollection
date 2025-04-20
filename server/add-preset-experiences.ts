import { db } from "./db";
import {
  destinations,
  enhancedExperiences,
  type InsertEnhancedExperience
} from "../shared/schema";
import { eq, isNull } from "drizzle-orm";

/**
 * This script adds preset authentic local experiences for destinations that don't have any
 */
async function addPresetExperiences() {
  try {
    console.log("Finding destinations without experiences...");
    
    // Find the next destination without experiences
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
    
    console.log(`Processing ${destinationsWithoutExperiences.length} destinations...`);
    
    let successCount = 0;
    
    for (const destination of destinationsWithoutExperiences) {
      console.log(`Processing ${destination.name}, ${destination.country}...`);
      
      try {
        // Generate preset experiences based on destination
        const experiences = generatePresetExperiences(destination.name, destination.country);
        
        // Insert experiences
        for (const experience of experiences) {
          await db.insert(enhancedExperiences).values(experience);
          
          console.log(`Added experience: ${experience.title} at ${experience.specificLocation}`);
        }
        
        console.log(`✅ Added experiences for ${destination.name}`);
        successCount++;
        
      } catch (error) {
        console.error(`Error adding experiences for ${destination.name}:`, error);
      }
    }
    
    console.log(`✅ Added authentic experiences to ${successCount} out of ${destinationsWithoutExperiences.length} destinations!`);
  } catch (error) {
    console.error("Error adding preset experiences:", error);
  }
}

/**
 * Generate preset authentic experiences for a destination
 */
function generatePresetExperiences(destinationId: number, name: string, country: string): InsertEnhancedExperience[] {
  // Create experiences template based on destination type
  const experiences: InsertEnhancedExperience[] = [];
  
  // Classic experience templates
  const culturalExperience: Partial<InsertEnhancedExperience> = {
    title: `Cultural Immersion in ${name}'s Historic District`,
    specificLocation: `Old Town / Historic Center of ${name}`,
    description: `Explore the historic heart of ${name} with its unique architecture, local artisans, and authentic cultural atmosphere.`,
    personalNarrative: `I wandered through narrow cobblestone streets early in the morning before the crowds arrived, stumbling upon artisans opening their workshops. An elderly local invited me for coffee and shared stories about how the neighborhood had changed over decades, offering a perspective I'd never find in guidebooks.`,
    season: "Year-round, though spring and fall offer the most pleasant temperatures",
    seasonalEvent: null,
    bestTimeToVisit: "Early morning (7-9am) to avoid crowds and see locals starting their day",
    localTip: `Visit on a weekday rather than weekend, and explore the side streets at least 2-3 blocks away from major landmarks where most authentic local businesses are found.`
  };
  
  const culinaryExperience: Partial<InsertEnhancedExperience> = {
    title: `Authentic ${country} Cuisine Experience`,
    specificLocation: `Local Food Market / District in ${name}`,
    description: `Immerse yourself in the authentic flavors of ${country} at local markets and family-run eateries away from tourist areas.`,
    personalNarrative: `The aroma of freshly prepared local delicacies drew me into a tiny establishment that didn't even have an English menu. Using hand gestures and smiles, I ordered what the family at the next table was enjoying. What followed was the most memorable meal of my trip - complex flavors I'd never experienced in ${country} restaurants back home.`,
    season: "Year-round",
    seasonalEvent: null,
    bestTimeToVisit: "During local mealtime hours (often different from tourist dining hours)",
    localTip: `Look for eateries filled with locals and not tourists. If there's a line of locals, it's worth the wait. Ask your server what their own family orders, not what they recommend to tourists.`
  };
  
  const naturalExperience: Partial<InsertEnhancedExperience> = {
    title: `Natural Beauty Experience Near ${name}`,
    specificLocation: `Natural area near ${name}`,
    description: `Escape the urban environment to experience the breathtaking natural landscapes that locals treasure outside ${name}.`,
    personalNarrative: `Away from the tourist buses, I hired a local guide who took me to a viewpoint known mainly to photographers and locals. The hike was moderately challenging, but the sense of solitude and connection to the landscape was worth every step. Watching the changing light as the sun moved across the valley created an almost meditative experience.`,
    season: "Best during spring or fall when the weather is mild",
    seasonalEvent: null,
    bestTimeToVisit: "Early morning or late afternoon for the best light and fewer people",
    localTip: `Bring appropriate footwear and water. Many tourists underestimate the terrain and come unprepared, missing the best viewpoints that require a short hike.`
  };
  
  // Now adapt these templates to the specific destination
  // Customize based on destination type (urban, coastal, mountain, etc.)
  
  // Cultural experience
  experiences.push({
    destinationId: destinationId,
    ...culturalExperience as InsertEnhancedExperience,
    title: getCustomizedTitle('cultural', name, country),
    specificLocation: getCustomizedLocation('cultural', name, country),
    description: `Explore the historic heart of ${name} with its unique architecture, local artisans, and authentic cultural atmosphere.`
  });
  
  // Culinary experience
  experiences.push({
    destinationId: destinationId,
    ...culinaryExperience as InsertEnhancedExperience,
    title: getCustomizedTitle('culinary', name, country),
    specificLocation: getCustomizedLocation('culinary', name, country),
    description: `Immerse yourself in the authentic flavors of ${country} at local markets and family-run eateries away from tourist areas.`
  });
  
  // Natural or unique local experience
  experiences.push({
    destinationId: destinationId,
    ...naturalExperience as InsertEnhancedExperience,
    title: getCustomizedTitle('nature', name, country),
    specificLocation: getCustomizedLocation('nature', name, country),
    description: `Escape the urban environment to experience the breathtaking natural landscapes that locals treasure outside ${name}.`
  });
  
  return experiences;
}

/**
 * Get a customized title based on experience type and destination
 */
function getCustomizedTitle(type: 'cultural' | 'culinary' | 'nature', name: string, country: string): string {
  // Mapping for major cities and their known cultural experiences
  const culturalMapping: Record<string, string> = {
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
  
  const culinaryMapping: Record<string, string> = {
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
  
  const natureMapping: Record<string, string> = {
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
  
  // Return customized title or fallback to generic template
  if (type === 'cultural' && culturalMapping[name]) {
    return culturalMapping[name];
  } else if (type === 'culinary' && culinaryMapping[name]) {
    return culinaryMapping[name];
  } else if (type === 'nature' && natureMapping[name]) {
    return natureMapping[name];
  }
  
  // Generic fallbacks by type
  switch (type) {
    case 'cultural':
      return `Cultural Immersion in ${name}'s Historic Quarter`;
    case 'culinary':
      return `Authentic ${country} Cuisine Experience`;
    case 'nature':
      return `Natural Beauty Experience Near ${name}`;
  }
}

/**
 * Get a customized location based on experience type and destination
 */
function getCustomizedLocation(type: 'cultural' | 'culinary' | 'nature', name: string, country: string): string {
  // Mapping for major cities and their known locations
  const culturalMapping: Record<string, string> = {
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
  
  const culinaryMapping: Record<string, string> = {
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
  
  const natureMapping: Record<string, string> = {
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
  
  // Return customized location or fallback to generic template
  if (type === 'cultural' && culturalMapping[name]) {
    return culturalMapping[name];
  } else if (type === 'culinary' && culinaryMapping[name]) {
    return culinaryMapping[name];
  } else if (type === 'nature' && natureMapping[name]) {
    return natureMapping[name];
  }
  
  // Generic fallbacks by type
  switch (type) {
    case 'cultural':
      return `Historic District of ${name}`;
    case 'culinary':
      return `Local Markets and Family-run Restaurants in ${name}`;
    case 'nature':
      return `Natural Areas Surrounding ${name}`;
  }
}

// Run the function
addPresetExperiences().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error("Failed to add preset experiences:", error);
  process.exit(1);
});