/**
 * Image Cache System
 * 
 * Caches generated images by configuration hash to avoid
 * regenerating the same bouquet configuration.
 * 
 * Uses IndexedDB for persistent storage with LRU eviction.
 */

const DB_NAME = 'bexy-image-cache';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const MAX_CACHE_SIZE = 50; // Maximum number of cached images
const CACHE_EXPIRY_DAYS = 7; // Cache expiry in days

interface CachedImage {
  hash: string;
  imageUrl: string; // Base64 data URL
  prompt: string;
  createdAt: number;
  lastAccessedAt: number;
  accessCount: number;
  metadata: {
    width: number;
    height: number;
    size: number;
  };
}

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'hash' });
        store.createIndex('lastAccessedAt', 'lastAccessedAt', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

// Get cached image by hash
export async function getCachedImage(hash: string): Promise<CachedImage | null> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(hash);
      
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const cached = request.result as CachedImage | undefined;
        
        if (cached) {
          // Check if expired
          const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
          if (Date.now() - cached.createdAt > expiryTime) {
            // Delete expired entry
            store.delete(hash);
            db.close();
            resolve(null);
            return;
          }
          
          // Update access time and count
          cached.lastAccessedAt = Date.now();
          cached.accessCount += 1;
          store.put(cached);
          
          console.log(`[ImageCache] Cache HIT for hash: ${hash}`);
        } else {
          console.log(`[ImageCache] Cache MISS for hash: ${hash}`);
        }
        
        db.close();
        resolve(cached || null);
      };
    });
  } catch (error) {
    console.error('[ImageCache] Error getting cached image:', error);
    return null;
  }
}

// Store image in cache
export async function cacheImage(
  hash: string,
  imageUrl: string,
  prompt: string,
  metadata: { width: number; height: number; size: number }
): Promise<void> {
  try {
    const db = await openDB();
    
    // First, check cache size and evict if necessary
    await evictIfNeeded(db);
    
    const cached: CachedImage = {
      hash,
      imageUrl,
      prompt,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      accessCount: 1,
      metadata
    };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(cached);
      
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log(`[ImageCache] Cached image with hash: ${hash}`);
        db.close();
        resolve();
      };
    });
  } catch (error) {
    console.error('[ImageCache] Error caching image:', error);
  }
}

// Evict oldest entries if cache is full (LRU)
async function evictIfNeeded(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const countRequest = store.count();
    
    countRequest.onsuccess = () => {
      const count = countRequest.result;
      
      if (count >= MAX_CACHE_SIZE) {
        // Get oldest entries by lastAccessedAt
        const index = store.index('lastAccessedAt');
        const toDelete = count - MAX_CACHE_SIZE + 5; // Delete 5 extra for buffer
        
        let deleted = 0;
        const cursorRequest = index.openCursor();
        
        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          
          if (cursor && deleted < toDelete) {
            console.log(`[ImageCache] Evicting old entry: ${cursor.value.hash}`);
            cursor.delete();
            deleted++;
            cursor.continue();
          } else {
            resolve();
          }
        };
        
        cursorRequest.onerror = () => reject(cursorRequest.error);
      } else {
        resolve();
      }
    };
    
    countRequest.onerror = () => reject(countRequest.error);
  });
}

// Clear all cached images
export async function clearCache(): Promise<void> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('[ImageCache] Cache cleared');
        db.close();
        resolve();
      };
    });
  } catch (error) {
    console.error('[ImageCache] Error clearing cache:', error);
  }
}

// Get cache statistics
export async function getCacheStats(): Promise<{
  count: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const entries = request.result as CachedImage[];
        
        const stats = {
          count: entries.length,
          totalSize: entries.reduce((sum, e) => sum + (e.metadata?.size || 0), 0),
          oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.createdAt)) : null,
          newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.createdAt)) : null
        };
        
        db.close();
        resolve(stats);
      };
    });
  } catch (error) {
    console.error('[ImageCache] Error getting cache stats:', error);
    return { count: 0, totalSize: 0, oldestEntry: null, newestEntry: null };
  }
}

// Convert blob URL to base64 for storage
export async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert base64 to blob URL for display
export function base64ToBlobUrl(base64: string): string {
  // If it's already a blob URL, return as-is
  if (base64.startsWith('blob:')) return base64;
  
  // If it's a data URL, convert to blob
  if (base64.startsWith('data:')) {
    const [header, data] = base64.split(',');
    const mimeMatch = header.match(/data:([^;]+)/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    const blob = new Blob([array], { type: mime });
    return URL.createObjectURL(blob);
  }
  
  return base64;
}

export default {
  getCachedImage,
  cacheImage,
  clearCache,
  getCacheStats,
  blobUrlToBase64,
  base64ToBlobUrl
};
