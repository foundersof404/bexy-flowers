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

/**
 * Ensure visitor exists in database (create if doesn't exist)
 */
async function ensureVisitor(): Promise<void> {
  const visitorId = getVisitorId();
  
  try {
    // Call the database function to get or create visitor
    const { error } = await supabase.rpc('get_or_create_visitor', {
      p_visitor_id: visitorId
    });

    if (error) {
      // If function doesn't exist, try direct insert/update
      const { data: existing } = await supabase
        .from('visitors')
        .select('id')
        .eq('visitor_id', visitorId)
        .single();

      if (!existing) {
        await supabase
          .from('visitors')
          .insert({
            visitor_id: visitorId,
            first_visit_at: new Date().toISOString(),
            last_visit_at: new Date().toISOString()
          });
      } else {
        await supabase
          .from('visitors')
          .update({ last_visit_at: new Date().toISOString() })
          .eq('visitor_id', visitorId);
      }
    }
  } catch (error) {
    console.error('Error ensuring visitor:', error);
    // Continue even if visitor creation fails
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
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    const data = await db.select<VisitorCartItem>('visitor_carts', {
      filters: { visitor_id: visitorId },
      orderBy: { column: 'created_at', ascending: false }
    });

    return (data || []).map(transformCartItem);
  } catch (error) {
    console.error('Error in getVisitorCart:', error);
    return [];
  }
}

/**
 * Add or update cart item for the current visitor
 */
export async function upsertVisitorCartItem(item: CartItem): Promise<boolean> {
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
    console.error('Error in updateVisitorCartItemQuantity:', error);
    return false;
  }
}

/**
 * Clear all cart items for the current visitor
 */
export async function clearVisitorCart(): Promise<boolean> {
  try {
    const visitorId = getVisitorId();

    await db.delete('visitor_carts', { visitor_id: visitorId });

    return true;
  } catch (error) {
    console.error('Error in clearVisitorCart:', error);
    return false;
  }
}

/**
 * Sync local cart items to database
 */
export async function syncCartToDatabase(items: CartItem[]): Promise<void> {
  try {
    await ensureVisitor();
    const visitorId = getVisitorId();

    // Delete all existing items for this visitor
    await db.delete('visitor_carts', { visitor_id: visitorId });

    // Insert all current items
    if (items.length > 0) {
      const dbItems = items.map(item => transformToDbFormat(item, visitorId));
      await db.insert('visitor_carts', dbItems);
    }
  } catch (error) {
    console.error('Error syncing cart to database:', error);
  }
}

