import {
  regions, destinations, itineraries, days, testimonials, favorites, budgetCategories, enhancedExperiences,
  collections, collectionItems, snowbirdDestinations, userPurchases,
  type Region, type InsertRegion,
  type Destination, type InsertDestination,
  type Itinerary, type InsertItinerary,
  type Day, type InsertDay,
  type Testimonial, type InsertTestimonial,
  type Favorite, type InsertFavorite,
  type BudgetCategory, type InsertBudgetCategory,
  type EnhancedExperience, type InsertEnhancedExperience,
  type Collection, type InsertCollection,
  type CollectionItem, type InsertCollectionItem,
  type SnowbirdDestination, type InsertSnowbirdDestination,
  type DestinationSeasonal, type UserPurchase, type InsertUserPurchase
} from "@shared/schema";

export interface IStorage {
  // Regions
  getRegions(): Promise<Region[]>;
  getRegionById(id: number): Promise<Region | undefined>;
  
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestinationsByRegion(regionId: number): Promise<Destination[]>;
  getDestinationById(id: number): Promise<Destination | undefined>;
  getFeaturedDestinations(): Promise<Destination[]>;
  searchDestinations(query: string): Promise<Destination[]>;
  incrementDownloadCount(id: number): Promise<void>;
  getRelatedDestinations(destinationId: number, limit?: number): Promise<Destination[]>;
  
  // Itineraries
  getItineraryByDestinationId(destinationId: number): Promise<Itinerary | undefined>;
  
  // Days
  getDaysByItineraryId(itineraryId: number): Promise<Day[]>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  
  // Favorites
  getFavorites(userId: string): Promise<Favorite[]>;
  getFavoriteDestinations(userId: string): Promise<Destination[]>;
  addFavorite(userId: string, destinationId: number): Promise<Favorite>;
  removeFavorite(userId: string, destinationId: number): Promise<boolean>;
  isFavorite(userId: string, destinationId: number): Promise<boolean>;
  
  // Budget Categories
  getBudgetCategoriesByDestinationId(destinationId: number): Promise<BudgetCategory[]>;
  getTotalBudgetByDestinationId(destinationId: number): Promise<number>;
  
  // Enhanced Experiences
  getEnhancedExperiencesByDestinationId(destinationId: number): Promise<EnhancedExperience[]>;
  addEnhancedExperience(experience: InsertEnhancedExperience): Promise<EnhancedExperience>;
  
  // Collections
  getCollections(): Promise<Collection[]>;
  getFeaturedCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | undefined>;
  getCollectionItems(collectionId: number): Promise<CollectionItem[]>;
  getDestinationsByCollectionId(collectionId: number): Promise<Destination[]>;
  
  // Snowbird Destinations
  getSnowbirdDestinations(): Promise<SnowbirdDestination[]>;
  getSnowbirdDestinationById(id: number): Promise<SnowbirdDestination | undefined>;
  getSnowbirdDestinationByCountry(country: string): Promise<SnowbirdDestination[]>;
  addSnowbirdDestination(destination: InsertSnowbirdDestination): Promise<SnowbirdDestination>;
  updateSnowbirdDestination(id: number, destination: Partial<InsertSnowbirdDestination>): Promise<SnowbirdDestination>;
  
  // Seasonal Data
  getDestinationSeasonalInfo(destinationId: number): Promise<DestinationSeasonal | undefined>;
  addDestinationSeasonalInfo(destinationId: number, seasonalInfo: DestinationSeasonal): Promise<DestinationSeasonal>;
  getDestinationsPeakTouristMonths(destinationId: number): Promise<number[]>;
  
  // User Purchases
  getUserPurchaseById(id: string): Promise<UserPurchase | undefined>;
  getUserPurchasesByEmail(email: string): Promise<UserPurchase[]>;
  createUserPurchase(purchase: UserPurchase): Promise<UserPurchase>;
  updateUserPurchase(id: string, updates: Partial<UserPurchase>): Promise<UserPurchase | undefined>;
}

export class MemStorage implements IStorage {
  private regions: Map<number, Region>;
  private destinations: Map<number, Destination>;
  private itineraries: Map<number, Itinerary>;
  private days: Map<number, Day[]>;
  private testimonials: Map<number, Testimonial>;
  private favorites: Map<number, Favorite>;
  private budgetCategories: Map<number, BudgetCategory>;
  private favoriteCounter: number;
  
  constructor() {
    this.regions = new Map();
    this.destinations = new Map();
    this.itineraries = new Map();
    this.days = new Map();
    this.testimonials = new Map();
    this.favorites = new Map();
    this.budgetCategories = new Map();
    this.userPurchases = new Map();
    this.favoriteCounter = 0;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // Region methods
  async getRegions(): Promise<Region[]> {
    return Array.from(this.regions.values());
  }
  
  async getRegionById(id: number): Promise<Region | undefined> {
    return this.regions.get(id);
  }
  
  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async getDestinationsByRegion(regionId: number): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(
      (destination) => destination.regionId === regionId
    );
  }
  
  async getDestinationById(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async getFeaturedDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(
      (destination) => destination.featured
    );
  }
  
  async searchDestinations(query: string): Promise<Destination[]> {
    query = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(
      (destination) => 
        destination.name.toLowerCase().includes(query) || 
        destination.country.toLowerCase().includes(query)
    );
  }
  
  async incrementDownloadCount(id: number): Promise<void> {
    const destination = this.destinations.get(id);
    if (destination) {
      destination.downloadCount = (destination.downloadCount || 0) + 1;
      this.destinations.set(id, destination);
    }
  }
  
  async getRelatedDestinations(destinationId: number, limit: number = 4): Promise<Destination[]> {
    const destination = this.destinations.get(destinationId);
    if (!destination) {
      return [];
    }
    
    // Get destinations from the same region, excluding the current one
    const sameRegionDestinations = Array.from(this.destinations.values())
      .filter(d => d.regionId === destination.regionId && d.id !== destinationId);
    
    // If we don't have enough from the same region, add some popular ones from other regions
    if (sameRegionDestinations.length < limit) {
      const otherDestinations = Array.from(this.destinations.values())
        .filter(d => d.regionId !== destination.regionId && d.id !== destinationId)
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, limit - sameRegionDestinations.length);
      
      return [...sameRegionDestinations, ...otherDestinations];
    }
    
    // Sort by download count and return limited number
    return sameRegionDestinations
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, limit);
  }
  
  // Favorites methods
  async getFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId);
  }
  
  async getFavoriteDestinations(userId: string): Promise<Destination[]> {
    const userFavorites = await this.getFavorites(userId);
    const destinationIds = userFavorites.map(fav => fav.destinationId);
    
    return Array.from(this.destinations.values())
      .filter(destination => destinationIds.includes(destination.id));
  }
  
  async addFavorite(userId: string, destinationId: number): Promise<Favorite> {
    // Check if destination exists
    const destination = await this.getDestinationById(destinationId);
    if (!destination) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }
    
    // Check if already a favorite
    const isAlreadyFavorite = await this.isFavorite(userId, destinationId);
    if (isAlreadyFavorite) {
      // Find and return the existing favorite
      const existingFavorite = Array.from(this.favorites.values())
        .find(fav => fav.userId === userId && fav.destinationId === destinationId);
      
      if (existingFavorite) {
        return existingFavorite;
      }
    }
    
    // Add new favorite
    this.favoriteCounter += 1;
    const newFavorite: Favorite = {
      id: this.favoriteCounter,
      userId,
      destinationId,
      addedAt: new Date()
    };
    
    this.favorites.set(this.favoriteCounter, newFavorite);
    return newFavorite;
  }
  
  async removeFavorite(userId: string, destinationId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.destinationId === destinationId);
    
    if (favorite) {
      return this.favorites.delete(favorite.id);
    }
    
    return false;
  }
  
  async isFavorite(userId: string, destinationId: number): Promise<boolean> {
    return Array.from(this.favorites.values())
      .some(fav => fav.userId === userId && fav.destinationId === destinationId);
  }
  
  // Itinerary methods
  async getItineraryByDestinationId(destinationId: number): Promise<Itinerary | undefined> {
    return Array.from(this.itineraries.values()).find(
      (itinerary) => itinerary.destinationId === destinationId
    );
  }
  
  // Day methods
  async getDaysByItineraryId(itineraryId: number): Promise<Day[]> {
    return this.days.get(itineraryId) || [];
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  // Budget Categories
  async getBudgetCategoriesByDestinationId(destinationId: number): Promise<BudgetCategory[]> {
    return Array.from(this.budgetCategories.values()).filter(
      category => category.destinationId === destinationId
    );
  }
  
  async getTotalBudgetByDestinationId(destinationId: number): Promise<number> {
    const categories = await this.getBudgetCategoriesByDestinationId(destinationId);
    return categories.reduce((total, category) => total + category.amount, 0);
  }
  
  // Enhanced Experiences methods
  private enhancedExperiences: Map<number, EnhancedExperience> = new Map();
  private enhancedExperienceCounter: number = 0;
  
  async getEnhancedExperiencesByDestinationId(destinationId: number): Promise<EnhancedExperience[]> {
    return Array.from(this.enhancedExperiences.values())
      .filter(exp => exp.destinationId === destinationId);
  }
  
  async addEnhancedExperience(experience: InsertEnhancedExperience): Promise<EnhancedExperience> {
    this.enhancedExperienceCounter += 1;
    const newExperience: EnhancedExperience = {
      id: this.enhancedExperienceCounter,
      destinationId: experience.destinationId,
      title: experience.title,
      specificLocation: experience.specificLocation,
      description: experience.description,
      personalNarrative: experience.personalNarrative ?? null,
      season: experience.season ?? null,
      seasonalEvent: experience.seasonalEvent ?? null,
      bestTimeToVisit: experience.bestTimeToVisit ?? null,
      localTip: experience.localTip ?? null
    };
    this.enhancedExperiences.set(this.enhancedExperienceCounter, newExperience);
    return newExperience;
  }
  
  // Collections methods
  private collections: Map<number, Collection> = new Map();
  private collectionItems: Map<number, CollectionItem> = new Map();
  private collectionCounter: number = 0;
  private collectionItemCounter: number = 0;
  
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }
  
  async getFeaturedCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values())
      .filter(collection => collection.featured);
  }
  
  async getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    return Array.from(this.collections.values())
      .find(collection => collection.slug === slug);
  }
  
  async getCollectionItems(collectionId: number): Promise<CollectionItem[]> {
    return Array.from(this.collectionItems.values())
      .filter(item => item.collectionId === collectionId)
      .sort((a, b) => a.position - b.position);
  }
  
  async getDestinationsByCollectionId(collectionId: number): Promise<Destination[]> {
    const items = await this.getCollectionItems(collectionId);
    const destinationIds = items.map(item => item.destinationId);
    
    return Array.from(this.destinations.values())
      .filter(destination => destinationIds.includes(destination.id));
  }
  
  // Snowbird Destinations methods
  private snowbirdDestinations: Map<number, SnowbirdDestination> = new Map();
  private snowbirdCounter: number = 0;
  
  async getSnowbirdDestinations(): Promise<SnowbirdDestination[]> {
    return Array.from(this.snowbirdDestinations.values());
  }
  
  async getSnowbirdDestinationById(id: number): Promise<SnowbirdDestination | undefined> {
    return this.snowbirdDestinations.get(id);
  }
  
  async getSnowbirdDestinationByCountry(country: string): Promise<SnowbirdDestination[]> {
    const lowerCountry = country.toLowerCase();
    return Array.from(this.snowbirdDestinations.values())
      .filter(dest => dest.country.toLowerCase().includes(lowerCountry));
  }
  
  async addSnowbirdDestination(destination: InsertSnowbirdDestination): Promise<SnowbirdDestination> {
    this.snowbirdCounter += 1;
    const newDestination: SnowbirdDestination = {
      id: this.snowbirdCounter,
      name: destination.name,
      country: destination.country,
      description: destination.description,
      region: destination.region || null,
      imageUrl: destination.imageUrl || null,
      avgWinterTemp: destination.avgWinterTemp || null,
      costComparison: destination.costComparison || null,
      visaRequirements: destination.visaRequirements || null,
      healthcareAccess: destination.healthcareAccess || null,
      avgAccommodationCost: destination.avgAccommodationCost || null,
      flightTime: destination.flightTime || null,
      languageBarrier: destination.languageBarrier || null,
      canadianExpats: destination.canadianExpats || null,
      bestTimeToVisit: destination.bestTimeToVisit || null,
      localTips: destination.localTips || null,
      costOfLiving: destination.costOfLiving || null,
      createdAt: new Date()
    };
    this.snowbirdDestinations.set(this.snowbirdCounter, newDestination);
    return newDestination;
  }
  
  async updateSnowbirdDestination(id: number, destData: Partial<InsertSnowbirdDestination>): Promise<SnowbirdDestination> {
    const destination = await this.getSnowbirdDestinationById(id);
    if (!destination) {
      throw new Error(`Snowbird destination with ID ${id} not found`);
    }
    
    const updatedDestination: SnowbirdDestination = {
      ...destination,
      ...destData,
    };
    
    this.snowbirdDestinations.set(id, updatedDestination);
    return updatedDestination;
  }
  
  // Seasonal Data methods
  private seasonalData: Map<number, DestinationSeasonal> = new Map();
  
  async getDestinationSeasonalInfo(destinationId: number): Promise<DestinationSeasonal | undefined> {
    console.log(`Looking for seasonal data for destination ID: ${destinationId}`);
    console.log(`Available seasonal data keys: ${Array.from(this.seasonalData.keys()).join(', ')}`);
    const result = this.seasonalData.get(destinationId);
    console.log(`Result found: ${result ? 'yes' : 'no'}`);
    return result;
  }
  
  async addDestinationSeasonalInfo(destinationId: number, seasonalInfo: DestinationSeasonal): Promise<DestinationSeasonal> {
    // First check if the destination exists
    const destination = await this.getDestinationById(destinationId);
    if (!destination) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }
    
    // Create a new seasonal info object
    const newSeasonalInfo: DestinationSeasonal = {
      ...seasonalInfo,
      id: destinationId.toString(),
      name: destination.name,
      country: destination.country,
      lastUpdated: new Date(),
      nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6)) // Update every 6 months
    };
    
    this.seasonalData.set(destinationId, newSeasonalInfo);
    return newSeasonalInfo;
  }
  
  async getDestinationsPeakTouristMonths(destinationId: number): Promise<number[]> {
    const seasonalInfo = await this.getDestinationSeasonalInfo(destinationId);
    if (seasonalInfo) {
      return seasonalInfo.peakTouristMonths;
    }
    return []; // Return empty array if no data found
  }
  
  // User Purchases methods
  private userPurchases: Map<string, UserPurchase> = new Map();
  
  async getUserPurchaseById(id: string): Promise<UserPurchase | undefined> {
    return this.userPurchases.get(id);
  }
  
  async getUserPurchasesByEmail(email: string): Promise<UserPurchase[]> {
    return Array.from(this.userPurchases.values())
      .filter(purchase => purchase.email.toLowerCase() === email.toLowerCase());
  }
  
  async createUserPurchase(purchase: UserPurchase): Promise<UserPurchase> {
    this.userPurchases.set(purchase.id.toString(), purchase);
    return purchase;
  }
  
  async updateUserPurchase(id: string, updates: Partial<UserPurchase>): Promise<UserPurchase | undefined> {
    const purchase = await this.getUserPurchaseById(id);
    if (!purchase) {
      return undefined;
    }
    
    const updatedPurchase: UserPurchase = {
      ...purchase,
      ...updates
    };
    
    this.userPurchases.set(id, updatedPurchase);
    return updatedPurchase;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Initialize enhanced experiences map
    this.enhancedExperiences = new Map();
    // Initialize snowbird destinations map
    this.snowbirdDestinations = new Map();
    // Initialize seasonal data map
    this.seasonalData = new Map();
    
    // Add sample snowbird destinations
    const snowbirdDestinationsData: InsertSnowbirdDestination[] = [
      {
        name: "Puerto Vallarta",
        country: "Mexico",
        description: "A vibrant beach destination with warm weather year-round, perfect for Canadian snowbirds seeking sun and culture.",
        region: "North America",
        imageUrl: "https://images.unsplash.com/photo-1605300045897-0de17e04d357?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        avgWinterTemp: "25°C / 77°F",
        costComparison: "30-40% lower than Canada",
        visaRequirements: "Tourist visa for 180 days, no special requirements for Canadians",
        healthcareAccess: "Good quality private healthcare at affordable rates, international insurance accepted",
        avgAccommodationCost: "$800-1500/month for a 1-bedroom apartment",
        flightTime: "4-6 hours from most Canadian cities",
        languageBarrier: "Medium - English widely spoken in tourist areas",
        canadianExpats: "Large community, especially during winter months",
        bestTimeToVisit: "November to April for ideal temperatures and low humidity",
        localTips: "Visit the Malecon boardwalk for stunning sunset views and local entertainment",
        costOfLiving: "Affordable with options for all budgets"
      },
      {
        name: "Algarve",
        country: "Portugal",
        description: "A sunny coastal region with mild winters, beautiful beaches, and charming historic towns.",
        region: "Europe",
        imageUrl: "https://images.unsplash.com/photo-1566822549280-b8c0ccabafde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        avgWinterTemp: "16°C / 61°F",
        costComparison: "25-35% lower than Canada",
        visaRequirements: "90-day Schengen visa, D7 visa available for longer stays",
        healthcareAccess: "Excellent public healthcare system, reciprocal agreements with Canada",
        avgAccommodationCost: "€700-1200/month for a 1-bedroom apartment",
        flightTime: "8-10 hours from most Canadian cities",
        languageBarrier: "Low - English widely spoken in tourist areas",
        canadianExpats: "Growing community of Canadian retirees",
        bestTimeToVisit: "October to May for mild temperatures and fewer tourists",
        localTips: "Explore the picturesque fishing villages and try the local seafood dishes",
        costOfLiving: "Moderate with excellent value for money"
      },
      {
        name: "Chiang Mai",
        country: "Thailand",
        description: "A cultural hub in northern Thailand with pleasant winter temperatures, rich history, and low cost of living.",
        region: "Asia",
        imageUrl: "https://images.unsplash.com/photo-1563415068-29294f561772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        avgWinterTemp: "22°C / 72°F",
        costComparison: "50-60% lower than Canada",
        visaRequirements: "60-day tourist visa, special retirement visa available",
        healthcareAccess: "Excellent private healthcare at affordable rates, international hospitals",
        avgAccommodationCost: "$300-700/month for a 1-bedroom apartment",
        flightTime: "15-20 hours from most Canadian cities",
        languageBarrier: "Medium-high - limited English outside tourist areas",
        canadianExpats: "Sizeable expat community from various countries",
        bestTimeToVisit: "November to February for comfortable temperatures and low humidity",
        localTips: "Visit the Sunday Walking Street market for local crafts and street food",
        costOfLiving: "Very affordable with luxury options available at budget prices"
      }
    ];
    
    snowbirdDestinationsData.forEach((destination, index) => {
      const id = index + 1;
      const snowbirdDestination: SnowbirdDestination = {
        id,
        name: destination.name,
        country: destination.country,
        description: destination.description,
        region: destination.region || null,
        imageUrl: destination.imageUrl || null,
        avgWinterTemp: destination.avgWinterTemp || null,
        costComparison: destination.costComparison || null,
        visaRequirements: destination.visaRequirements || null,
        healthcareAccess: destination.healthcareAccess || null,
        avgAccommodationCost: destination.avgAccommodationCost || null,
        flightTime: destination.flightTime || null,
        languageBarrier: destination.languageBarrier || null,
        canadianExpats: destination.canadianExpats || null,
        bestTimeToVisit: destination.bestTimeToVisit || null,
        localTips: destination.localTips || null,
        costOfLiving: destination.costOfLiving || null,
        createdAt: new Date()
      };
      this.snowbirdDestinations.set(id, snowbirdDestination);
    });
    
    // Add sample seasonal data for a few destinations
    // Tokyo (destination ID 23)
    const tokyoSeasonalData: DestinationSeasonal = {
      id: "23",
      name: "Tokyo",
      country: "Japan",
      seasons: {
        summer: { startMonth: 6, endMonth: 9 },
        winter: { startMonth: 12, endMonth: 3 },
        shoulder: { 
          periods: [
            { startMonth: 4, endMonth: 5 },
            { startMonth: 10, endMonth: 11 }
          ] 
        }
      },
      peakTouristMonths: [3, 4, 5, 10, 11], // Cherry blossom (March-May) and autumn leaves (Oct-Nov)
      weatherAlerts: [
        "Typhoon season runs from June to October",
        "Heavy rainfall in June (rainy season)",
        "Hot and humid summer months (July-August)"
      ],
      majorEvents: [
        {
          name: "Cherry Blossom Season",
          month: 4,
          duration: 2,
          impact: "high",
          description: "Extremely crowded parks and gardens, higher hotel prices"
        },
        {
          name: "Golden Week",
          month: 5,
          duration: 1,
          impact: "high",
          description: "National holiday week, domestic travel peaks"
        },
        {
          name: "Autumn Foliage",
          month: 11,
          duration: 1,
          impact: "medium",
          description: "Popular parks and temples become crowded"
        }
      ],
      lastUpdated: new Date(),
      nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6))
    };
    this.seasonalData.set(23, tokyoSeasonalData);
    
    // Barcelona (destination ID 24)
    const barcelonaSeasonalData: DestinationSeasonal = {
      id: "24",
      name: "Barcelona",
      country: "Spain",
      seasons: {
        summer: { startMonth: 6, endMonth: 9 },
        winter: { startMonth: 12, endMonth: 3 },
        shoulder: { 
          periods: [
            { startMonth: 4, endMonth: 5 },
            { startMonth: 10, endMonth: 11 }
          ] 
        }
      },
      peakTouristMonths: [6, 7, 8], // Summer peak season
      weatherAlerts: [
        "Occasional heat waves in July and August",
        "Flash rainstorms in October"
      ],
      majorEvents: [
        {
          name: "La Mercè Festival",
          month: 9,
          duration: 1,
          impact: "medium",
          description: "City-wide celebrations with music and performances"
        },
        {
          name: "Mobile World Congress",
          month: 2,
          duration: 1,
          impact: "high",
          description: "Large tech conference causing hotel price increases"
        }
      ],
      lastUpdated: new Date(),
      nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6))
    };
    this.seasonalData.set(24, barcelonaSeasonalData);
    
    // Bali (destination ID 25)
    const baliSeasonalData: DestinationSeasonal = {
      id: "25",
      name: "Bali",
      country: "Indonesia",
      seasons: {
        summer: { startMonth: 5, endMonth: 9 }, // Dry season in Bali
        winter: { startMonth: 11, endMonth: 3 }, // Wet season
        shoulder: { 
          periods: [
            { startMonth: 4, endMonth: 4 },
            { startMonth: 10, endMonth: 10 }
          ] 
        }
      },
      peakTouristMonths: [7, 8, 12], // July-August and December
      weatherAlerts: [
        "Monsoon rains from November to March",
        "Occasional volcanic activity from Mount Agung"
      ],
      majorEvents: [
        {
          name: "Nyepi (Day of Silence)",
          month: 3,
          duration: 1,
          impact: "high",
          description: "Complete island shutdown, no activities permitted"
        },
        {
          name: "Galungan Festival",
          month: 6,
          duration: 10,
          impact: "medium",
          description: "Religious ceremonies throughout the island"
        }
      ],
      lastUpdated: new Date(),
      nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6))
    };
    this.seasonalData.set(25, baliSeasonalData);
    
    // Add regions
    const regionsData: InsertRegion[] = [
      { name: "Europe" },
      { name: "Asia" },
      { name: "North America" },
      { name: "South America" },
      { name: "Africa" },
      { name: "Oceania" }
    ];
    
    regionsData.forEach((region, index) => {
      const id = index + 1;
      this.regions.set(id, { ...region, id });
    });
    
    // Add destinations
    const destinationsData: InsertDestination[] = [
      {
        name: "Tokyo",
        country: "Japan",
        regionId: 2, // Asia
        description: "Discover Tokyo's blend of traditional culture and modern innovation, from historic temples to vibrant neighborhoods.",
        imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rating: "4.8",
        downloadCount: 1200,
        featured: true
      },
      {
        name: "Barcelona",
        country: "Spain",
        regionId: 1, // Europe
        description: "Experience Gaudí's masterpieces, stunning beaches, and tapas culture in this vibrant Catalan city.",
        imageUrl: "https://images.unsplash.com/photo-1499678329028-101435549a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rating: "4.7",
        downloadCount: 990,
        featured: true
      },
      {
        name: "Bali",
        country: "Indonesia",
        regionId: 2, // Asia
        description: "Explore lush rice terraces, ancient temples, vibrant culture, and stunning beaches on this idyllic island.",
        imageUrl: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rating: "4.9",
        downloadCount: 1500,
        featured: true
      },
      {
        name: "Paris",
        country: "France",
        regionId: 1, // Europe
        description: "Discover the City of Light with its iconic Eiffel Tower, world-class museums, and charming cafés.",
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.6",
        downloadCount: 1300,
        featured: false
      },
      {
        name: "New York",
        country: "USA",
        regionId: 3, // North America
        description: "Experience the Big Apple's skyscrapers, diverse neighborhoods, and vibrant arts and food scene.",
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.7",
        downloadCount: 1100,
        featured: false
      },
      {
        name: "Rome",
        country: "Italy",
        regionId: 1, // Europe
        description: "Explore the Eternal City's ancient ruins, Renaissance art, and lively piazzas.",
        imageUrl: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.8",
        downloadCount: 980,
        featured: false
      },
      {
        name: "Sydney",
        country: "Australia",
        regionId: 6, // Oceania
        description: "Discover the iconic harbor, beautiful beaches, and vibrant culture of Australia's largest city.",
        imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.7",
        downloadCount: 850,
        featured: false
      },
      {
        name: "Cairo",
        country: "Egypt",
        regionId: 5, // Africa
        description: "Explore ancient pyramids, bustling markets, and the rich history of this iconic Egyptian city.",
        imageUrl: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.5",
        downloadCount: 780,
        featured: false
      },
      {
        name: "Rio de Janeiro",
        country: "Brazil",
        regionId: 4, // South America
        description: "Experience stunning beaches, vibrant culture, and iconic landmarks in this Brazilian paradise.",
        imageUrl: "https://images.unsplash.com/photo-1619546952812-520e98064a52?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.6",
        downloadCount: 920,
        featured: false
      },
      {
        name: "Bangkok",
        country: "Thailand",
        regionId: 2, // Asia
        description: "Explore ancient temples, floating markets, and vibrant street life in Thailand's capital city.",
        imageUrl: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        rating: "4.5",
        downloadCount: 870,
        featured: false
      },
      {
        name: "Santorini",
        country: "Greece",
        regionId: 1, // Europe
        description: "Discover white-washed buildings, breathtaking caldera views, and stunning sunsets on this Greek island.",
        imageUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        rating: "4.9",
        downloadCount: 1600,
        featured: false
      }
    ];
    
    destinationsData.forEach((destination, index) => {
      const id = index + 1;
      // Ensure all required fields are present with correct types
      const destinationWithId: Destination = {
        id,
        name: destination.name,
        country: destination.country,
        regionId: destination.regionId,
        description: destination.description,
        imageUrl: destination.imageUrl,
        rating: destination.rating,
        downloadCount: destination.downloadCount ?? 0,
        featured: destination.featured ?? false
      };
      this.destinations.set(id, destinationWithId);
    });
    
    // Add itineraries
    const itinerariesData: InsertItinerary[] = [
      {
        destinationId: 1, // Tokyo
        title: "Tokyo 5-Day Itinerary",
        duration: 5,
        description: "Experience the best of Tokyo in 5 days",
        content: "A comprehensive guide to exploring Tokyo's highlights in 5 days, including cultural landmarks, shopping districts, and food recommendations."
      },
      {
        destinationId: 2, // Barcelona
        title: "Barcelona 7-Day Itinerary",
        duration: 7,
        description: "Architecture and Mediterranean vibes",
        content: "A week-long exploration of Barcelona's architectural wonders, beaches, and culinary delights."
      },
      {
        destinationId: 3, // Bali
        title: "Bali 10-Day Itinerary",
        duration: 10,
        description: "Tropical paradise island experience",
        content: "An extensive guide to Bali's beaches, temples, rice terraces, and cultural experiences over 10 days."
      },
      {
        destinationId: 8, // Cairo
        title: "Cairo 6-Day Itinerary",
        duration: 6,
        description: "Ancient wonders and vibrant culture",
        content: "A 6-day journey through Egypt's capital, exploring pyramids, museums, markets, and experiencing authentic Egyptian cuisine."
      },
      {
        destinationId: 11, // Santorini
        title: "Santorini 5-Day Itinerary",
        duration: 5,
        description: "Island exploration and stunning sunsets",
        content: "A perfect 5-day plan to experience the beauty and culture of Santorini, Greece."
      }
    ];
    
    itinerariesData.forEach((itinerary, index) => {
      const id = index + 1;
      this.itineraries.set(id, { ...itinerary, id });
    });
    
    // Add days for itineraries
    // Cairo days
    this.days.set(4, [
      {
        id: 1,
        itineraryId: 4,
        dayNumber: 1,
        title: "Arrival & Giza Pyramids",
        activities: ["Arrival at Cairo International Airport", "Check-in at hotel", "Visit the Great Pyramids of Giza", "See the Sphinx", "Dinner with views of the pyramids"]
      },
      {
        id: 2,
        itineraryId: 4,
        dayNumber: 2,
        title: "Egyptian Museum & Old Cairo",
        activities: ["Visit the Egyptian Museum", "See the treasures of Tutankhamun", "Explore Coptic Cairo", "Visit the Hanging Church", "Shop at Khan el-Khalili bazaar"]
      },
      {
        id: 3,
        itineraryId: 4,
        dayNumber: 3,
        title: "Islamic Cairo",
        activities: ["Tour the Citadel of Saladin", "Visit the Alabaster Mosque", "Explore Al-Azhar Park", "See Sultan Hassan Mosque", "Evening Nile dinner cruise"]
      },
      {
        id: 4,
        itineraryId: 4,
        dayNumber: 4,
        title: "Memphis & Saqqara",
        activities: ["Day trip to Memphis, Egypt's ancient capital", "Visit the Step Pyramid at Saqqara", "See the Bent Pyramid", "Traditional Egyptian lunch experience"]
      },
      {
        id: 5,
        itineraryId: 4,
        dayNumber: 5,
        title: "Culinary & Cultural Day",
        activities: ["Egyptian cooking class", "Visit Al-Azhar Mosque", "Shop for spices and souvenirs", "Visit Cairo Tower for city views"]
      },
      {
        id: 6,
        itineraryId: 4,
        dayNumber: 6,
        title: "Alexandria Day Trip & Departure",
        activities: ["Optional day trip to Alexandria", "See Bibliotheca Alexandrina", "Visit the Roman Amphitheater", "Return to Cairo and departure preparations"]
      }
    ]);
    
    // Santorini days
    this.days.set(5, [
      {
        id: 1,
        itineraryId: 5,
        dayNumber: 1,
        title: "Arrival & Fira Exploration",
        activities: ["Check-in at hotel in Fira", "Explore Fira town center", "Dinner at Argo Restaurant with caldera views"]
      },
      {
        id: 2,
        itineraryId: 5,
        dayNumber: 2,
        title: "Oia & Sunset",
        activities: ["Morning visit to Oia village", "Lunch at Ammoudi Bay", "Famous Oia sunset viewing"]
      },
      {
        id: 3,
        itineraryId: 5,
        dayNumber: 3,
        title: "Beach Day",
        activities: ["Red Beach visit", "Perissa Black Sand Beach", "Beach club experience"]
      },
      {
        id: 4,
        itineraryId: 5,
        dayNumber: 4,
        title: "Wine Tour & Local Culture",
        activities: ["Morning visit to vineyard", "Wine tasting experience", "Traditional Greek cooking class"]
      },
      {
        id: 5,
        itineraryId: 5,
        dayNumber: 5,
        title: "Caldera Boat Tour & Departure",
        activities: ["Morning boat trip around caldera", "Visit to volcanic hot springs", "Final shopping and departure"]
      }
    ]);
    
    // Add testimonials
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
    
    testimonialsData.forEach((testimonial, index) => {
      const id = index + 1;
      this.testimonials.set(id, { ...testimonial, id });
    });
    
    // Add budget categories for Bali (destinationId: 3)
    const baliBudgetCategories: InsertBudgetCategory[] = [
      {
        destinationId: 3,
        name: "Accommodation",
        amount: 550,
        icon: "🏨",
        color: "#4F46E5",
        description: "Hotels, hostels, and Airbnb",
        milestoneEmoji: "🎉",
        milestoneMessage: "Accommodation funds secured! Time to book that dream villa!"
      },
      {
        destinationId: 3,
        name: "Food & Dining",
        amount: 350,
        icon: "🍲",
        color: "#10B981",
        description: "Restaurants, cafes, and street food",
        milestoneEmoji: "🍹",
        milestoneMessage: "Food budget ready! Prepare for amazing culinary experiences!"
      },
      {
        destinationId: 3,
        name: "Activities",
        amount: 400,
        icon: "🏄‍♂️",
        color: "#F59E0B",
        description: "Tours, attractions, and experiences",
        milestoneEmoji: "🌊",
        milestoneMessage: "Activities budget complete! Get ready for adventure!"
      },
      {
        destinationId: 3,
        name: "Transportation",
        amount: 200,
        icon: "🛵",
        color: "#EF4444",
        description: "Flights, taxis, and scooter rentals",
        milestoneEmoji: "✈️",
        milestoneMessage: "Transportation funds secured! Start booking those flights!"
      },
      {
        destinationId: 3,
        name: "Shopping",
        amount: 150,
        icon: "🛍️",
        color: "#8B5CF6",
        description: "Souvenirs and gifts",
        milestoneEmoji: "🎁",
        milestoneMessage: "Shopping budget ready! Time to plan for souvenirs!"
      }
    ];
    
    baliBudgetCategories.forEach((category, index) => {
      const id = index + 1;
      this.budgetCategories.set(id, { ...category, id });
    });
    
    // Add budget categories for Tokyo (destinationId: 1)
    const tokyoBudgetCategories: InsertBudgetCategory[] = [
      {
        destinationId: 1,
        name: "Accommodation",
        amount: 750,
        icon: "🏙️",
        color: "#4F46E5",
        description: "Hotels and hostels in Tokyo",
        milestoneEmoji: "🎌",
        milestoneMessage: "Accommodation funds ready for Tokyo! Time to book!"
      },
      {
        destinationId: 1,
        name: "Food & Dining",
        amount: 450,
        icon: "🍣",
        color: "#10B981",
        description: "Sushi, ramen, and local cuisine",
        milestoneEmoji: "🍜",
        milestoneMessage: "Food budget complete! Ready for amazing Japanese cuisine!"
      },
      {
        destinationId: 1,
        name: "Activities",
        amount: 350,
        icon: "⛩️",
        color: "#F59E0B",
        description: "Temples, museums, and experiences",
        milestoneEmoji: "🏯",
        milestoneMessage: "Activities budget ready! Prepare for cultural experiences!"
      },
      {
        destinationId: 1,
        name: "Transportation",
        amount: 300,
        icon: "🚅",
        color: "#EF4444",
        description: "Flights, metro, and bullet trains",
        milestoneEmoji: "🚄",
        milestoneMessage: "Transportation budget secured! Ready to zoom around Japan!"
      },
      {
        destinationId: 1,
        name: "Shopping",
        amount: 250,
        icon: "🛒",
        color: "#8B5CF6",
        description: "Electronics, fashion, and gifts",
        milestoneEmoji: "🎁",
        milestoneMessage: "Shopping budget ready! Time for Akihabara electronics!"
      }
    ];
    
    tokyoBudgetCategories.forEach((category, index) => {
      const id = index + 6; // Start after Bali budget categories
      this.budgetCategories.set(id, { ...category, id });
    });
  }
}

// Import the DatabaseStorage implementation
import { DatabaseStorage } from './db-storage';

// Use DatabaseStorage instead of MemStorage for production
export const storage = new DatabaseStorage();
