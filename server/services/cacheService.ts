/**
 * Cache service for storing and retrieving generated itineraries
 * This reduces API usage and improves performance by reusing already generated content
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface CacheEntry {
  content: string;
  timestamp: number;
  expiresAt: number | null;
}

interface CacheOptions {
  /** Time-to-live in milliseconds (null for no expiration) */
  ttl?: number | null;
  /** Force refresh the cache even if entry exists */
  forceRefresh?: boolean;
}

class ItineraryCache {
  private cacheDir: string;
  private cacheFile: string;
  private cache: Record<string, CacheEntry> = {};
  private isInitialized = false;

  constructor() {
    // Set up cache directory in the tmp folder
    this.cacheDir = path.join(process.cwd(), 'tmp', 'cache');
    this.cacheFile = path.join(this.cacheDir, 'itinerary-cache.json');
  }

  /**
   * Initialize the cache
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Create cache directory if it doesn't exist
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      // Load existing cache if it exists
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        this.cache = JSON.parse(data);
        
        // Clean expired entries on startup
        this.cleanExpiredEntries();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize cache:', error);
      // Create an empty cache object if loading fails
      this.cache = {};
    }
  }

  /**
   * Generate a cache key from parameters
   */
  private generateKey(params: Record<string, any>): string {
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join('|');
    
    return crypto
      .createHash('md5')
      .update(sortedParams)
      .digest('hex');
  }

  /**
   * Get content from cache
   */
  public async get<T extends string>(
    params: Record<string, any>,
    options: CacheOptions = {}
  ): Promise<T | null> {
    await this.init();
    
    const key = this.generateKey(params);
    
    // Force refresh if requested
    if (options.forceRefresh) {
      return null;
    }
    
    const entry = this.cache[key];
    
    // Return null if entry doesn't exist
    if (!entry) {
      return null;
    }
    
    // Check if entry is expired
    if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
      delete this.cache[key];
      await this.saveCache();
      return null;
    }
    
    return entry.content as T;
  }

  /**
   * Store content in cache
   */
  public async set(
    params: Record<string, any>,
    content: string,
    options: CacheOptions = {}
  ): Promise<void> {
    await this.init();
    
    const key = this.generateKey(params);
    const ttl = options.ttl ?? null;
    
    this.cache[key] = {
      content,
      timestamp: Date.now(),
      expiresAt: ttl !== null ? Date.now() + ttl : null,
    };
    
    await this.saveCache();
  }

  /**
   * Remove an entry from cache
   */
  public async invalidate(params: Record<string, any>): Promise<void> {
    await this.init();
    
    const key = this.generateKey(params);
    
    if (this.cache[key]) {
      delete this.cache[key];
      await this.saveCache();
    }
  }

  /**
   * Clear all cache entries
   */
  public async clear(): Promise<void> {
    await this.init();
    
    this.cache = {};
    await this.saveCache();
  }

  /**
   * Clean expired entries
   */
  private cleanExpiredEntries(): void {
    const now = Date.now();
    let hasChanges = false;
    
    for (const [key, entry] of Object.entries(this.cache)) {
      if (entry.expiresAt !== null && entry.expiresAt < now) {
        delete this.cache[key];
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      this.saveCache().catch(console.error);
    }
  }

  /**
   * Save cache to disk
   */
  private async saveCache(): Promise<void> {
    try {
      const data = JSON.stringify(this.cache, null, 2);
      fs.writeFileSync(this.cacheFile, data, 'utf-8');
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  public async getStats(): Promise<{
    totalEntries: number;
    activeEntries: number;
    expiredEntries: number;
    sizeBytes: number;
  }> {
    await this.init();
    
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;
    
    for (const entry of Object.values(this.cache)) {
      if (entry.expiresAt === null || entry.expiresAt >= now) {
        activeEntries++;
      } else {
        expiredEntries++;
      }
    }
    
    const totalEntries = activeEntries + expiredEntries;
    const sizeBytes = fs.existsSync(this.cacheFile)
      ? fs.statSync(this.cacheFile).size
      : 0;
    
    return {
      totalEntries,
      activeEntries,
      expiredEntries,
      sizeBytes,
    };
  }
}

// Export a singleton instance
export const itineraryCache = new ItineraryCache();