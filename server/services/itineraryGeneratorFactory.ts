/**
 * Factory for creating itinerary generators
 * 
 * This factory provides a central place to create and manage different itinerary generator
 * implementations, allowing for easy switching between generators with different characteristics.
 */

import { Destination } from '@shared/schema';

// Import configuration and generator type
import { 
  defaultGeneratorType, 
  premiumGeneratorType, 
  logging, 
  GeneratorType 
} from '../config';

/**
 * Interface for all itinerary generators
 */
export interface ItineraryGenerator {
  /**
   * Generate a complete itinerary for a destination
   * 
   * @param destination - The destination to generate an itinerary for
   * @returns Complete itinerary content
   */
  generateItinerary(destination: Destination): Promise<string>;

  /**
   * Generate content for a specific day of an itinerary
   * 
   * @param destination - The destination
   * @param dayNumber - Day number (1-7)
   * @returns Content for the specific day
   */
  generateDay(destination: Destination, dayNumber: number): Promise<string>;
}

/**
 * Itinerary Generator Factory
 * 
 * Provides methods to create different types of itinerary generators
 * and handles selection of the appropriate generator based on requirements.
 */
class ItineraryGeneratorFactory {
  // Get default generator type from config
  private defaultGeneratorType: GeneratorType = defaultGeneratorType;
  private generators: Record<GeneratorType, ItineraryGenerator>;
  
  constructor() {
    // We need to properly initialize the generators, but we'll do it after import
    // to avoid circular dependencies
    this.generators = {
      default: null as unknown as ItineraryGenerator,
      chunked: null as unknown as ItineraryGenerator,
      resilient: null as unknown as ItineraryGenerator,
      efficient: null as unknown as ItineraryGenerator
    };

    // We'll initialize the generators in a separate async method
    this.initializeGenerators();
  }
  
  /**
   * Initialize generator instances asynchronously
   * 
   * NOTE: We've replaced all old generators with a standalone implementation
   * This factory is maintained for compatibility with existing code.
   */
  private async initializeGenerators(): Promise<void> {
    try {
      // Create a simple basic generator for all types
      // This is just a placeholder since we're using the standalone generator elsewhere
      const standaloneBasicGenerator: ItineraryGenerator = {
        async generateItinerary(destination: Destination): Promise<string> {
          return `7-Day Itinerary for ${destination.name}, ${destination.country}
          
Note: This is a placeholder. The actual implementation uses the standalone generator.`;
        },
        async generateDay(destination: Destination, dayNumber: number): Promise<string> {
          return `Day ${dayNumber} in ${destination.name}, ${destination.country}
          
Note: This is a placeholder. The actual implementation uses the standalone generator.`;
        }
      };
      
      // Use the same generator for all types for simplicity
      this.generators.default = standaloneBasicGenerator;
      this.generators.chunked = standaloneBasicGenerator;
      this.generators.resilient = standaloneBasicGenerator;
      this.generators.efficient = standaloneBasicGenerator;
      
      console.log('Using standalone generator for all PDF generation');
      
      // Skip loading old generators as they've been replaced with standalone implementation
    } catch (error) {
      console.error('Error initializing generators:', error);
    }
  }
  
  /**
   * Get the default generator type
   */
  getDefaultGeneratorType(): GeneratorType {
    return this.defaultGeneratorType;
  }
  
  /**
   * Set the default generator type
   * 
   * @param type - Generator type to use as default
   */
  setDefaultGeneratorType(type: GeneratorType): void {
    this.defaultGeneratorType = type;
  }
  
  /**
   * Get generator by type
   * 
   * @param type - Type of generator to retrieve
   * @returns The requested generator instance
   */
  getGenerator(type: GeneratorType): ItineraryGenerator {
    return this.generators[type];
  }
  
  /**
   * Generate a complete itinerary using the specified generator
   * 
   * @param destination - The destination to generate for
   * @param generatorType - Optional generator type, defaults to the default type
   * @returns Generated itinerary content
   */
  async generateItinerary(
    destination: Destination,
    generatorType?: GeneratorType
  ): Promise<string> {
    // Get type from parameters, or use premium type for premium content, or use default
    let type: GeneratorType;
    
    if (!generatorType && destination.featured) {
      // Use premiumGeneratorType from config for featured destinations
      type = premiumGeneratorType;
      
      if (logging?.generatorUsage) {
        console.log(`🌟 Using PREMIUM generator (${type}) for featured destination: ${destination.name}`);
      }
    } else {
      type = generatorType || this.defaultGeneratorType;
      
      if (logging?.generatorUsage) {
        console.log(`Using ${type} generator to create itinerary for ${destination.name}`);
      }
    }
    
    const generator = this.getGenerator(type);
    
    // Track start time for performance logging
    const startTime = Date.now();
    
    try {
      const result = await generator.generateItinerary(destination);
      
      // Log generation time if configured
      if (logging?.contentGeneration) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`${type} generator completed itinerary for ${destination.name} in ${duration}s (${result.length} chars)`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error using ${type} generator for ${destination.name}:`, error);
      throw error;
    }
  }
  
  /**
   * Generate content for a specific day using the specified generator
   * 
   * @param destination - The destination
   * @param dayNumber - Day number (1-7)
   * @param generatorType - Optional generator type, defaults to the default type
   * @returns Generated day content
   */
  async generateDay(
    destination: Destination,
    dayNumber: number,
    generatorType?: GeneratorType
  ): Promise<string> {
    // Get type from parameters, or use premium type for premium content, or use default
    let type: GeneratorType;
    
    if (!generatorType && destination.featured) {
      // Use premiumGeneratorType from config for featured destinations
      type = premiumGeneratorType;
      
      if (logging?.generatorUsage) {
        console.log(`🌟 Using PREMIUM generator (${type}) for featured destination day ${dayNumber}: ${destination.name}`);
      }
    } else {
      type = generatorType || this.defaultGeneratorType;
      
      if (logging?.generatorUsage) {
        console.log(`Using ${type} generator to create day ${dayNumber} for ${destination.name}`);
      }
    }
    
    const generator = this.getGenerator(type);
    
    // Track start time for performance logging
    const startTime = Date.now();
    
    try {
      const result = await generator.generateDay(destination, dayNumber);
      
      // Log generation time if configured
      if (logging?.contentGeneration) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`${type} generator completed day ${dayNumber} for ${destination.name} in ${duration}s (${result.length} chars)`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error using ${type} generator for day ${dayNumber} of ${destination.name}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const itineraryGeneratorFactory = new ItineraryGeneratorFactory();