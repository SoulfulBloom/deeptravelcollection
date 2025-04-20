import { eq, asc, desc, inArray, and, ne, like } from 'drizzle-orm';
import { db } from './db';
import { 
  regions, destinations, itineraries, days, testimonials, favorites, budgetCategories, enhancedExperiences,
  collections, collectionItems, snowbirdDestinations, userPurchases,
  Region, Destination, Itinerary, Day, Testimonial, Favorite, BudgetCategory, EnhancedExperience,
  Collection, CollectionItem, SnowbirdDestination, DestinationSeasonal, UserPurchase
} from '../shared/schema';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // Regions
  async getRegions(): Promise<Region[]> {
    return db.select().from(regions).orderBy(asc(regions.name));
  }

  async getRegionById(id: number): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.id, id));
    return region;
  }

  // Destinations
  async getDestinations(): Promise<Destination[]> {
    return db.select().from(destinations).orderBy(asc(destinations.name));
  }

  async getDestinationsByRegion(regionId: number): Promise<Destination[]> {
    return db.select()
      .from(destinations)
      .where(eq(destinations.regionId, regionId))
      .orderBy(asc(destinations.name));
  }

  async getDestinationById(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select()
      .from(destinations)
      .where(eq(destinations.id, id));
    return destination;
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    return db.select()
      .from(destinations)
      .where(eq(destinations.featured, true))
      .orderBy(desc(destinations.rating));
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const lowerQuery = query.toLowerCase();
    // In a real database we would use LIKE or full-text search
    // This is a simple implementation for demonstration
    const allDestinations = await this.getDestinations();
    return allDestinations.filter(
      (dest) => 
        dest.name.toLowerCase().includes(lowerQuery) || 
        dest.country.toLowerCase().includes(lowerQuery) ||
        dest.description.toLowerCase().includes(lowerQuery)
    );
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const destination = await this.getDestinationById(id);
    if (destination) {
      const currentCount = destination.downloadCount || 0;
      await db.update(destinations)
        .set({ downloadCount: currentCount + 1 })
        .where(eq(destinations.id, id));
    }
  }

  async getRelatedDestinations(destinationId: number, limit: number = 4): Promise<Destination[]> {
    const destination = await this.getDestinationById(destinationId);
    if (!destination) return [];

    // First, try to get destinations from the same region with similar ratings
    const sameRegionDestinations = await db.select()
      .from(destinations)
      .where(and(
        eq(destinations.regionId, destination.regionId),
        ne(destinations.id, destinationId)
      ))
      .orderBy(desc(destinations.rating))
      .limit(limit);
    
    // If we have enough from the same region, return them
    if (sameRegionDestinations.length >= limit) {
      return sameRegionDestinations;
    }
    
    // Otherwise, supplement with popular destinations from other regions
    const neededCount = limit - sameRegionDestinations.length;
    const otherRegionDestinations = await db.select()
      .from(destinations)
      .where(and(
        ne(destinations.regionId, destination.regionId),
        ne(destinations.id, destinationId)
      ))
      .orderBy(desc(destinations.rating))
      .limit(neededCount);
    
    // Combine the results
    return [...sameRegionDestinations, ...otherRegionDestinations];
  }

  // Itineraries
  async getItineraryByDestinationId(destinationId: number): Promise<Itinerary | undefined> {
    // Use query builder to avoid schema issues
    try {
      const results = await db.query.itineraries.findMany({
        where: (itins, { eq }) => eq(itins.destinationId, destinationId)
      });
      
      if (results.length > 0) {
        return results[0] as Itinerary;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching itinerary for destination ID", destinationId, error);
      throw error;
    }
  }

  // Days
  async getDaysByItineraryId(itineraryId: number): Promise<Day[]> {
    // Use select instead of query builder to have more control
    try {
      const result = await db.select({
        id: days.id,
        itineraryId: days.itineraryId,
        dayNumber: days.dayNumber,
        title: days.title,
        activities: days.activities,
        createdAt: days.createdAt
      })
      .from(days)
      .where(eq(days.itineraryId, itineraryId))
      .orderBy(asc(days.dayNumber));
      
      return result;
    } catch (error) {
      console.error("Error fetching days for itinerary ID", itineraryId, error);
      return [];
    }
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials);
  }

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    return db.select()
      .from(favorites)
      .where(eq(favorites.userId, userId));
  }

  async getFavoriteDestinations(userId: string): Promise<Destination[]> {
    const userFavorites = await this.getFavorites(userId);
    const destinationIds = userFavorites.map(fav => fav.destinationId);
    
    if (destinationIds.length === 0) return [];
    
    return db.select()
      .from(destinations)
      .where(inArray(destinations.id, destinationIds));
  }

  async addFavorite(userId: string, destinationId: number): Promise<Favorite> {
    const [favorite] = await db.insert(favorites)
      .values({ userId, destinationId })
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, destinationId: number): Promise<boolean> {
    const result = await db.delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.destinationId, destinationId)
      ))
      .returning();
    return result.length > 0;
  }

  async isFavorite(userId: string, destinationId: number): Promise<boolean> {
    const [favorite] = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.destinationId, destinationId)
      ));
    return !!favorite;
  }
  
  // Budget Categories
  async getBudgetCategoriesByDestinationId(destinationId: number): Promise<BudgetCategory[]> {
    try {
      const result = await db.select({
        id: budgetCategories.id,
        name: budgetCategories.name,
        description: budgetCategories.description,
        destinationId: budgetCategories.destinationId,
        amount: budgetCategories.amount,
        icon: budgetCategories.icon,
        createdAt: budgetCategories.createdAt
      })
      .from(budgetCategories)
      .where(eq(budgetCategories.destinationId, destinationId))
      .orderBy(asc(budgetCategories.name));
      
      return result;
    } catch (error) {
      console.error("Error fetching budget categories for destination ID", destinationId, error);
      return [];
    }
  }
  
  async getTotalBudgetByDestinationId(destinationId: number): Promise<number> {
    try {
      const categories = await this.getBudgetCategoriesByDestinationId(destinationId);
      // Parse amount as number before adding
      return categories.reduce((total, category) => {
        const amount = typeof category.amount === 'string' ? 
          parseFloat(category.amount) : 
          (typeof category.amount === 'number' ? category.amount : 0);
        return total + amount;
      }, 0);
    } catch (error) {
      console.error("Error calculating total budget for destination ID", destinationId, error);
      return 0;
    }
  }
  
  // Enhanced Experiences
  async getEnhancedExperiencesByDestinationId(destinationId: number): Promise<EnhancedExperience[]> {
    return db.select()
      .from(enhancedExperiences)
      .where(eq(enhancedExperiences.destinationId, destinationId))
      .orderBy(asc(enhancedExperiences.title));
  }
  
  async addEnhancedExperience(experience: any): Promise<EnhancedExperience> {
    const [newExperience] = await db.insert(enhancedExperiences)
      .values(experience)
      .returning();
    return newExperience;
  }
  
  // Collections
  async getCollections(): Promise<Collection[]> {
    return db.select()
      .from(collections)
      .orderBy(asc(collections.name));
  }
  
  async getFeaturedCollections(): Promise<Collection[]> {
    return db.select()
      .from(collections)
      .where(eq(collections.featured, true))
      .orderBy(asc(collections.name));
  }
  
  async getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    const [collection] = await db.select()
      .from(collections)
      .where(eq(collections.slug, slug));
    return collection;
  }
  
  async getCollectionItems(collectionId: number): Promise<CollectionItem[]> {
    try {
      const result = await db.select({
        id: collectionItems.id,
        collectionId: collectionItems.collectionId,
        destinationId: collectionItems.destinationId,
        position: collectionItems.position,
        highlight: collectionItems.highlight,
        note: collectionItems.note
      })
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, collectionId))
      .orderBy(asc(collectionItems.position));
      
      return result;
    } catch (error) {
      console.error("Error fetching collection items for collection ID", collectionId, error);
      return [];
    }
  }
  
  async getDestinationsByCollectionId(collectionId: number): Promise<Destination[]> {
    // Get all collection items for the collection
    const items = await this.getCollectionItems(collectionId);
    const destinationIds = items.map(item => item.destinationId);
    
    if (destinationIds.length === 0) return [];
    
    // Get destinations for these items
    return db.select()
      .from(destinations)
      .where(inArray(destinations.id, destinationIds))
      .orderBy(asc(destinations.name));
  }

  // Snowbird Destinations
  async getSnowbirdDestinations(): Promise<SnowbirdDestination[]> {
    return db.select()
      .from(snowbirdDestinations)
      .orderBy(asc(snowbirdDestinations.country), asc(snowbirdDestinations.name));
  }

  async getSnowbirdDestinationById(id: number): Promise<SnowbirdDestination | undefined> {
    const [destination] = await db.select()
      .from(snowbirdDestinations)
      .where(eq(snowbirdDestinations.id, id));
    return destination;
  }

  async getSnowbirdDestinationByCountry(country: string): Promise<SnowbirdDestination[]> {
    return db.select()
      .from(snowbirdDestinations)
      .where(like(snowbirdDestinations.country, `%${country}%`))
      .orderBy(asc(snowbirdDestinations.name));
  }

  async addSnowbirdDestination(destination: any): Promise<SnowbirdDestination> {
    const [newDestination] = await db.insert(snowbirdDestinations)
      .values(destination)
      .returning();
    return newDestination;
  }

  async updateSnowbirdDestination(id: number, destination: Partial<any>): Promise<SnowbirdDestination> {
    const [updatedDestination] = await db.update(snowbirdDestinations)
      .set(destination)
      .where(eq(snowbirdDestinations.id, id))
      .returning();
    return updatedDestination;
  }

  // Seasonal Data methods
  async getDestinationSeasonalInfo(destinationId: number): Promise<DestinationSeasonal | undefined> {
    console.log(`Looking for seasonal data for destination ID: ${destinationId}`);
    
    try {
      // Since we don't have a dedicated table for seasonal data yet, 
      // we'll implement this with hardcoded data for IDs 23, 24, 25
      if (destinationId === 23) { // Tokyo
        const destination = await this.getDestinationById(destinationId);
        if (!destination) return undefined;
        
        return {
          id: destinationId.toString(),
          name: destination.name,
          country: destination.country,
          seasons: {
            summer: { startMonth: 6, endMonth: 8 },
            winter: { startMonth: 12, endMonth: 2 },
            shoulder: { periods: [
              { startMonth: 3, endMonth: 5 },
              { startMonth: 9, endMonth: 11 }
            ]}
          },
          peakTouristMonths: [3, 4, 5, 10, 11],
          weatherAlerts: ["Typhoon season from June to October", "Heavy rain in June"],
          majorEvents: [
            {
              name: "Cherry Blossom Season",
              month: 4,
              duration: 2,
              impact: "high",
              description: "Cherry blossom viewing attracts many tourists"
            },
            {
              name: "Golden Week",
              month: 5,
              duration: 1,
              impact: "high",
              description: "Series of holidays with extensive domestic travel"
            }
          ],
          lastUpdated: new Date(),
          nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };
      } 
      else if (destinationId === 24) { // Barcelona
        const destination = await this.getDestinationById(destinationId);
        if (!destination) return undefined;
        
        return {
          id: destinationId.toString(),
          name: destination.name,
          country: destination.country,
          seasons: {
            summer: { startMonth: 6, endMonth: 8 },
            winter: { startMonth: 12, endMonth: 2 },
            shoulder: { periods: [
              { startMonth: 3, endMonth: 5 },
              { startMonth: 9, endMonth: 11 }
            ]}
          },
          peakTouristMonths: [6, 7, 8],
          weatherAlerts: ["Occasional heat waves in July and August"],
          majorEvents: [
            {
              name: "La Mercè Festival",
              month: 9,
              duration: 1,
              impact: "medium",
              description: "Barcelona's largest street festival"
            },
            {
              name: "Primavera Sound",
              month: 6,
              duration: 1,
              impact: "medium",
              description: "Major music festival attracting international crowds"
            }
          ],
          lastUpdated: new Date(),
          nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };
      }
      else if (destinationId === 25) { // Bali
        const destination = await this.getDestinationById(destinationId);
        if (!destination) return undefined;
        
        return {
          id: destinationId.toString(),
          name: destination.name,
          country: destination.country,
          seasons: {
            summer: { startMonth: 6, endMonth: 8 }, // Using Northern hemisphere seasons for consistency
            winter: { startMonth: 12, endMonth: 2 },
            shoulder: { periods: [
              { startMonth: 3, endMonth: 5 },
              { startMonth: 9, endMonth: 11 }
            ]}
          },
          peakTouristMonths: [7, 8, 12, 1],
          weatherAlerts: ["Rainy season from November to March", "Possible volcanic activity"],
          majorEvents: [
            {
              name: "Nyepi (Day of Silence)",
              month: 3,
              duration: 1,
              impact: "high",
              description: "Balinese New Year with complete island shutdown"
            },
            {
              name: "Galungan",
              month: 7,
              duration: 10,
              impact: "medium",
              description: "Important Balinese holiday celebrating victory of dharma over adharma"
            }
          ],
          lastUpdated: new Date(),
          nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };
      }
      
      console.log(`No seasonal data found for destination ID: ${destinationId}`);
      return undefined;
    } catch (error) {
      console.error(`Error fetching seasonal info for destination ${destinationId}:`, error);
      return undefined;
    }
  }
  
  async addDestinationSeasonalInfo(destinationId: number, seasonalInfo: DestinationSeasonal): Promise<DestinationSeasonal> {
    // First check if the destination exists
    const destination = await this.getDestinationById(destinationId);
    if (!destination) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }
    
    // In a real implementation, we would add this to a database table
    // For now, we'll just return the data with updated fields
    const newSeasonalInfo: DestinationSeasonal = {
      ...seasonalInfo,
      id: destinationId.toString(),
      name: destination.name,
      country: destination.country,
      lastUpdated: new Date(),
      nextUpdateDue: new Date(new Date().setMonth(new Date().getMonth() + 6)) // Update every 6 months
    };
    
    console.log(`Added seasonal info for destination ${destinationId}`);
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
  async getUserPurchaseById(id: string): Promise<UserPurchase | undefined> {
    try {
      const [purchase] = await db.select()
        .from(userPurchases)
        .where(eq(userPurchases.id, parseInt(id)));
      return purchase;
    } catch (error) {
      console.error("Error fetching user purchase by ID", id, error);
      return undefined;
    }
  }

  async getUserPurchasesByEmail(email: string): Promise<UserPurchase[]> {
    try {
      return await db.select()
        .from(userPurchases)
        .where(eq(userPurchases.email, email))
        .orderBy(desc(userPurchases.createdAt));
    } catch (error) {
      console.error("Error fetching user purchases by email", email, error);
      return [];
    }
  }

  async createUserPurchase(purchase: UserPurchase): Promise<UserPurchase> {
    try {
      const [newPurchase] = await db.insert(userPurchases)
        .values(purchase)
        .returning();
      return newPurchase;
    } catch (error) {
      console.error("Error creating user purchase", error);
      throw error;
    }
  }

  async updateUserPurchase(id: string, updates: Partial<UserPurchase>): Promise<UserPurchase | undefined> {
    try {
      const [updatedPurchase] = await db.update(userPurchases)
        .set(updates)
        .where(eq(userPurchases.id, parseInt(id)))
        .returning();
      return updatedPurchase;
    } catch (error) {
      console.error("Error updating user purchase", id, error);
      return undefined;
    }
  }
}