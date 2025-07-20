/**
 * Centralized caching utility for the portfolio application
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size (optional)
}

class CacheManager {
  private cache = new Map<string, CacheItem<unknown>>();
  private defaultTTL = 15 * 60 * 1000; // 15 minutes default
  
  // Cache configurations for different data types
  private readonly configs: Record<string, CacheConfig> = {
    'github-repos': { ttl: 30 * 60 * 1000 }, // 30 minutes for GitHub repos
    'github-languages': { ttl: 60 * 60 * 1000 }, // 1 hour for language data
    'timeline': { ttl: 60 * 60 * 1000 }, // 1 hour for timeline
    'technology': { ttl: 60 * 60 * 1000 }, // 1 hour for tech stack
    'blogs': { ttl: 10 * 60 * 1000 }, // 10 minutes for blogs
    'blog-single': { ttl: 5 * 60 * 1000 }, // 5 minutes for single blog posts
  };

  /**
   * Get data from cache if valid, otherwise return null
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set data in cache with appropriate TTL
   */
  set<T>(key: string, data: T, customTTL?: number): void {
    // Determine TTL based on key prefix or use custom/default
    const prefix = key.split('-')[0];
    const config = this.configs[prefix];
    const ttl = customTTL || config?.ttl || this.defaultTTL;
    
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    
    this.cache.set(key, item);
    
    // Optional: Implement cache size limit
    if (config?.maxSize && this.cache.size > config.maxSize) {
      this.evictOldest();
    }
  }

  /**
   * Check if cache has valid entry for key
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    this.cache.forEach((item) => {
      if (now <= item.expiry) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    });
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// Create singleton cache instance
export const cache = new CacheManager();

// Browser localStorage cache for persistence across sessions
export class PersistentCache {
  private prefix = 'portfolio-cache-';

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Error reading from localStorage cache:', error);
      return null;
    }
  }

  set<T>(key: string, data: T, ttl: number = 15 * 60 * 1000): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      };
      
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Error writing to localStorage cache:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

export const persistentCache = new PersistentCache();

// Utility function for cached API calls
export async function cachedFetch<T>(
  url: string,
  cacheKey: string,
  options?: RequestInit,
  customTTL?: number
): Promise<T> {
  // Try memory cache first
  let cached = cache.get<T>(cacheKey);
  if (cached) return cached;
  
  // Try persistent cache
  cached = persistentCache.get<T>(cacheKey);
  if (cached) {
    // Store in memory cache for faster subsequent access
    cache.set(cacheKey, cached, customTTL);
    return cached;
  }
  
  // Fetch from network
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: T = await response.json();
  
  // Store in both caches
  cache.set(cacheKey, data, customTTL);
  persistentCache.set(cacheKey, data, customTTL || 15 * 60 * 1000);
  
  return data;
}
