/**
 * Visitor Cart API
 * Handles database operations for visitor cart items
 */

import { db } from './database-client';
import { getVisitorId } from '../visitor';
import { CartItem } from '@/types/cart';

interface VisitorCartItem {
  id: string;
  visitor_id: string;
  product_id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null;
  personal_note?: string | null;
  description?: string | null;
  accessories?: any;
  gift_info?: any;
  created_at: string;
  updated_at: string;
}

// Circuit breaker: Skip RPC if it fails (function doesn't exist)
let rpcFunctionAvailable: boolean | null = null;

// Circuit breaker: Skip all cart DB calls temporarily after 400 / errors to reduce console spam
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
 * Transform database cart item to CartItem
 */
function transformCartItem(item: VisitorCartItem): CartItem {
  return {
    id: item.product_id,
    title: item.title,
    price: Number(item.price),
    image: item.image,
    quantity: item.quantity,
    size: item.size || undefined,
    personalNote: item.personal_note || undefined,
    description: item.description || undefined,
    accessories: item.accessories || undefined,
    giftInfo: item.gift_info || undefined,
  };
}

/**
 * Transform CartItem to database format
 */
function transformToDbFormat(item: CartItem, visitorId: string) {
  return {
    visitor_id: visitorId,
    product_id: String(item.id),
    title: item.title,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    size: item.size || null,
    personal_note: item.personalNote || null,
    description: item.description || null,
    accessories: item.accessories || null,
    gift_info: item.giftInfo || null,
  };
}

/**
 * Get all cart items for the current visitor
 */
export async function getVisitorCart(): Promise<CartItem[]> {
  if (isDbCircuitOpen()) return [];
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    const data = await db.select<VisitorCartItem>('visitor_carts', {
      filters: { visitor_id: visitorId },
      orderBy: { column: 'created_at', ascending: false }
    });

    return (data || []).map(transformCartItem);
  } catch (error) {
    recordDbFailure();
    if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
      console.error('Error in getVisitorCart:', error);
    }
    return [];
  }
}

/**
 * Add or update cart item for the current visitor
 */
export async function upsertVisitorCartItem(item: CartItem): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    const dbItem = transformToDbFormat(item, visitorId);

    // Check if item exists (handle NULL values properly)
    const filters: any = {
      visitor_id: visitorId,
      product_id: String(item.id)
    };
    
    if (item.size) {
      filters.size = item.size;
    } else {
      filters.size = null;
    }
    
    if (item.personalNote) {
      filters.personal_note = item.personalNote;
    } else {
      filters.personal_note = null;
    }
    
    const existing = await db.selectOne<VisitorCartItem>('visitor_carts', filters);

    if (existing) {
      // Update existing item
      await db.update('visitor_carts', { id: existing.id }, {
          quantity: item.quantity,
          price: item.price,
          title: item.title,
          image: item.image,
          description: item.description || null,
          accessories: item.accessories || null,
          gift_info: item.giftInfo || null,
      });
    } else {
      // Insert new item
      await db.insert('visitor_carts', dbItem);
    }

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in upsertVisitorCartItem:', error);
    return false;
  }
}

/**
 * Remove cart item for the current visitor
 */
export async function removeVisitorCartItem(
  productId: string | number,
  size?: string,
  personalNote?: string
): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    const visitorId = getVisitorId();

    const filters: any = {
      visitor_id: visitorId,
      product_id: String(productId)
    };

    if (size !== undefined) {
      filters.size = size;
    } else {
      filters.size = null;
    }

    if (personalNote !== undefined) {
      filters.personal_note = personalNote;
    } else {
      filters.personal_note = null;
    }

    await db.delete('visitor_carts', filters);

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in removeVisitorCartItem:', error);
    return false;
  }
}

/**
 * Update cart item quantity for the current visitor
 */
export async function updateVisitorCartItemQuantity(
  productId: string | number,
  quantity: number,
  size?: string,
  personalNote?: string
): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    const visitorId = getVisitorId();

    const filters: any = {
      visitor_id: visitorId,
      product_id: String(productId)
    };

    if (size !== undefined && size !== null) {
      filters.size = size;
    } else {
      filters.size = null;
    }

    if (personalNote !== undefined && personalNote !== null) {
      filters.personal_note = personalNote;
    } else {
      filters.personal_note = null;
    }

    const existing = await db.selectOne<VisitorCartItem>('visitor_carts', filters);
    if (existing) {
      await db.update('visitor_carts', { id: existing.id }, { quantity });
    }

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in updateVisitorCartItemQuantity:', error);
    return false;
  }
}

/**
 * Clear all cart items for the current visitor
 */
export async function clearVisitorCart(): Promise<boolean> {
  if (isDbCircuitOpen()) return false;
  try {
    const visitorId = getVisitorId();

    await db.delete('visitor_carts', { visitor_id: visitorId });

    return true;
  } catch (error) {
    recordDbFailure();
    console.error('Error in clearVisitorCart:', error);
    return false;
  }
}

/**
 * Sync local cart items to database
 */
export async function syncCartToDatabase(items: CartItem[]): Promise<void> {
  if (isDbCircuitOpen()) return;
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    await db.delete('visitor_carts', { visitor_id: visitorId });

    if (items.length > 0) {
      const dbItems = items.map(item => transformToDbFormat(item, visitorId));
      await db.insert('visitor_carts', dbItems);
    }
  } catch (error) {
    recordDbFailure();
    if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
      console.error('Error syncing cart to database:', error);
    }
  }
}

