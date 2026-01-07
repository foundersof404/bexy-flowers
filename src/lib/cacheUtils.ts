// Cache utilities for localStorage and sessionStorage
// Provides persistent caching for user preferences and temporary data

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  /**
   * Set a cache item with expiration
   * @param key - Cache key
   * @param data - Data to cache
   * @param expiresIn - Expiration time in milliseconds (default: 24 hours)
   */
  set<T>(key: string, data: T, expiresIn: number = 24 * 60 * 60 * 1000): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };
      this.storage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('[Cache] Error setting cache:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            expiresIn,
          };
          this.storage.setItem(key, JSON.stringify(cacheItem));
        } catch (retryError) {
          console.error('[Cache] Failed to set cache after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Get a cache item if not expired
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const age = Date.now() - cacheItem.timestamp;

      if (age > cacheItem.expiresIn) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('[Cache] Error getting cache:', error);
      return null;
    }
  }

  /**
   * Remove a cache item
   * @param key - Cache key
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('[Cache] Error removing cache:', error);
    }
  }

  /**
   * Clear all cache items
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('[Cache] Error clearing cache:', error);
    }
  }

  /**
   * Clear expired cache items
   */
  clearExpired(): void {
    try {
      const keys = Object.keys(this.storage);
      keys.forEach((key) => {
        const item = this.storage.getItem(key);
        if (item) {
          try {
            const cacheItem: CacheItem<unknown> = JSON.parse(item);
            const age = Date.now() - cacheItem.timestamp;
            if (age > cacheItem.expiresIn) {
              this.storage.removeItem(key);
            }
          } catch {
            // Invalid cache item, remove it
            this.storage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('[Cache] Error clearing expired cache:', error);
    }
  }

  /**
   * Check if a cache item exists and is valid
   * @param key - Cache key
   * @returns true if cache exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSize(): number {
    let size = 0;
    try {
      const keys = Object.keys(this.storage);
      keys.forEach((key) => {
        const item = this.storage.getItem(key);
        if (item) {
          size += item.length + key.length;
        }
      });
    } catch (error) {
      console.error('[Cache] Error calculating cache size:', error);
    }
    return size;
  }
}

// Export instances for different storage types
export const localCache = new CacheManager(localStorage);
export const sessionCache = new CacheManager(sessionStorage);

// Cache keys constants
export const CACHE_KEYS = {
  USER_PREFERENCES: 'bexy_user_preferences',
  CART_DATA: 'bexy_cart_data',
  FAVORITES_DATA: 'bexy_favorites_data',
  RECENT_SEARCHES: 'bexy_recent_searches',
  VIEWED_PRODUCTS: 'bexy_viewed_products',
  COLLECTION_FILTERS: 'bexy_collection_filters',
  THEME_PREFERENCE: 'bexy_theme_preference',
  VISITOR_ID: 'bexy_visitor_id',
} as const;

// Cache durations
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  WEEK: 7 * 24 * 60 * 60 * 1000, // 7 days
  MONTH: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

// Initialize cache cleanup on load
if (typeof window !== 'undefined') {
  // Clear expired items on page load
  localCache.clearExpired();
  sessionCache.clearExpired();

  // Set up periodic cleanup (every 5 minutes)
  setInterval(() => {
    localCache.clearExpired();
    sessionCache.clearExpired();
  }, 5 * 60 * 1000);
}
