/**
 * Visitor Favorites API
 * Handles database operations for visitor favorite products
 */

import { db } from './database-client';
import { getVisitorId } from '../visitor';
import { FavoriteProduct } from '@/types/favorites';

interface VisitorFavoriteItem {
  id: string;
  visitor_id: string;
  product_id: string;
  title: string;
  price: number;
  image: string;
  image_url?: string | null;
  description?: string | null;
  category?: string | null;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Circuit breaker: Skip RPC if it fails (function doesn't exist)
let rpcFunctionAvailable: boolean | null = null;

// Circuit breaker: Skip all favorites DB calls temporarily after errors (matches visitor-cart)
const DB_CIRCUIT_MS = 60_000;
let dbCircuitOpenUntil = 0;

function isDbCircuitOpen(): boolean {
  return Date.now() < dbCircuitOpenUntil;
}

function recordDbFailure(): void {
  dbCircuitOpenUntil = Date.now() + DB_CIRCUIT_MS;
}

/**
 * Ensure visitor exists in database (create if doesn't exist)
 */
async function ensureVisitor(): Promise<void> {
  if (isDbCircuitOpen()) return;

  const visitorId = getVisitorId();
  
  try {
    // Try to call the database function to get or create visitor
    // Skip if we know RPC function is not available
    if (rpcFunctionAvailable !== false) {
      try {
        await db.rpc('get_or_create_visitor', {
          p_visitor_id: visitorId
        });
        rpcFunctionAvailable = true; // Mark as available on success
        return; // Success - early return
      } catch (rpcError) {
        // If RPC fails with 400/404, mark as unavailable and fall through to fallback
        const errorMsg = rpcError instanceof Error ? rpcError.message : String(rpcError);
        if (errorMsg.includes('400') || errorMsg.includes('404') || errorMsg.includes('function') || errorMsg.includes('not found')) {
          rpcFunctionAvailable = false; // Mark as unavailable
        }
        // Fall through to fallback method
      }
    }

    // Fallback: direct insert/update via database proxy
    const existing = await db.selectOne('visitors', { visitor_id: visitorId });

    if (!existing) {
      await db.insert('visitors', {
        visitor_id: visitorId,
        first_visit_at: new Date().toISOString(),
        last_visit_at: new Date().toISOString()
      });
    } else {
      await db.update('visitors', { visitor_id: visitorId }, {
        last_visit_at: new Date().toISOString()
      });
    }
  } catch (error) {
    recordDbFailure();
    if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
      console.error('Error ensuring visitor:', error);
    }
  }
}

/**
 * Transform database favorite item to FavoriteProduct
 */
function transformFavoriteItem(item: VisitorFavoriteItem): FavoriteProduct {
  return {
    id: item.product_id,
    title: item.title,
    price: Number(item.price),
    image: item.image,
    imageUrl: item.image_url || item.image,
    description: item.description || undefined,
    category: item.category || undefined,
    featured: item.featured || false,
    name: item.title,
  };
}

/**
 * Transform FavoriteProduct to database format
 */
function transformToDbFormat(product: FavoriteProduct, visitorId: string) {
  return {
    visitor_id: visitorId,
    product_id: String(product.id),
    title: product.title,
    price: product.price,
    image: product.image,
    image_url: product.imageUrl || product.image,
    description: product.description || null,
    category: product.category || null,
    featured: product.featured || false,
  };
}

/**
 * Get all favorites for the current visitor
 */
export async function getVisitorFavorites(): Promise<FavoriteProduct[]> {
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    const data = await db.select<VisitorFavoriteItem>('visitor_favorites', {
      filters: { visitor_id: visitorId },
      orderBy: { column: 'created_at', ascending: false }
    });

    return (data || []).map(transformFavoriteItem);
  } catch (error) {
    recordDbFailure();
    if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
      console.error('Error in getVisitorFavorites:', error);
    }
    return [];
  }
}

/**
 * Add favorite product for the current visitor
 */
export async function addVisitorFavorite(product: FavoriteProduct): Promise<boolean> {
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    const dbItem = transformToDbFormat(product, visitorId);

    await db.insert('visitor_favorites', dbItem);

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in addVisitorFavorite:', error);
    return false;
  }
}

/**
 * Remove favorite product for the current visitor
 */
export async function removeVisitorFavorite(productId: string | number): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    const visitorId = getVisitorId();

    await db.delete('visitor_favorites', {
      visitor_id: visitorId,
      product_id: String(productId)
    });

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in removeVisitorFavorite:', error);
    return false;
  }
}

/**
 * Check if product is in favorites for the current visitor
 */
export async function isVisitorFavorite(productId: string | number): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    const visitorId = getVisitorId();

    const data = await db.select<VisitorFavoriteItem>('visitor_favorites', {
      filters: { visitor_id: visitorId, product_id: String(productId) }
    });

    return data.length > 0;
  } catch (error) {
    recordDbFailure();
    console.error('Error in isVisitorFavorite:', error);
    return false;
  }
}

/**
 * Clear all favorites for the current visitor
 */
export async function clearVisitorFavorites(): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    const visitorId = getVisitorId();

    await db.delete('visitor_favorites', { visitor_id: visitorId });

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in clearVisitorFavorites:', error);
    return false;
  }
}

/**
 * Sync local favorites to database
 */
export async function syncFavoritesToDatabase(favorites: FavoriteProduct[]): Promise<void> {
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    // Delete all existing favorites for this visitor
    await db.delete('visitor_favorites', { visitor_id: visitorId });

    // Insert all current favorites
    if (favorites.length > 0) {
      const dbItems = favorites.map(item => transformToDbFormat(item, visitorId));
      await db.insert('visitor_favorites', dbItems);
    }
  } catch (error) {
    recordDbFailure();
    if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
      console.error('Error syncing favorites to database:', error);
    }
  }
}

















