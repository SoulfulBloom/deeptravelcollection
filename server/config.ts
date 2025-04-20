/**
 * Global application configuration
 * 
 * This file defines application-wide settings and configuration options.
 */

// Define generator types
export type GeneratorType = 'default' | 'chunked' | 'resilient' | 'efficient';

// Define logging configuration type
export interface LoggingConfig {
  generatorUsage: boolean;  // Log when a generator is used
  contentGeneration: boolean; // Log content generation events
  cacheHits: boolean;  // Log when content is retrieved from cache
}

// Default generator type to use when none is specified
export const defaultGeneratorType: GeneratorType = 'efficient';

// Generator type to use for premium content (paid itineraries)
export const premiumGeneratorType: GeneratorType = 'efficient';

// Generator type for testing
export const testGeneratorType: GeneratorType = 'resilient';

// Log configuration
export const logging: LoggingConfig = {
  generatorUsage: true,  // Log when a generator is used
  contentGeneration: true, // Log content generation events
  cacheHits: true,  // Log when content is retrieved from cache
};