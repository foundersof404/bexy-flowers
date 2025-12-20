/**
 * Visitor Cart API
 * Handles database operations for visitor cart items
 */

import { supabase } from '../supabase';
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

    const { data, error } = await supabase
      .from('visitor_carts')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }

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
    let query = supabase
      .from('visitor_carts')
      .select('id, quantity')
      .eq('visitor_id', visitorId)
      .eq('product_id', String(item.id));
    
    if (item.size) {
      query = query.eq('size', item.size);
    } else {
      query = query.is('size', null);
    }
    
    if (item.personalNote) {
      query = query.eq('personal_note', item.personalNote);
    } else {
      query = query.is('personal_note', null);
    }
    
    const { data: existing } = await query.maybeSingle();

    if (existing) {
      // Update existing item
      const { error } = await supabase
        .from('visitor_carts')
        .update({
          quantity: item.quantity,
          price: item.price,
          title: item.title,
          image: item.image,
          description: item.description || null,
          accessories: item.accessories || null,
          gift_info: item.giftInfo || null,
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating cart item:', error);
        return false;
      }
    } else {
      // Insert new item
      const { error } = await supabase
        .from('visitor_carts')
        .insert(dbItem);

      if (error) {
        console.error('Error inserting cart item:', error);
        return false;
      }
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

    const query = supabase
      .from('visitor_carts')
      .delete()
      .eq('visitor_id', visitorId)
      .eq('product_id', String(productId));

    if (size !== undefined) {
      query.eq('size', size);
    } else {
      query.is('size', null);
    }

    if (personalNote !== undefined) {
      query.eq('personal_note', personalNote);
    } else {
      query.is('personal_note', null);
    }

    const { error } = await query;

    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }

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

    let query = supabase
      .from('visitor_carts')
      .update({ quantity })
      .eq('visitor_id', visitorId)
      .eq('product_id', String(productId));

    if (size !== undefined && size !== null) {
      query = query.eq('size', size);
    } else {
      query = query.is('size', null);
    }

    if (personalNote !== undefined && personalNote !== null) {
      query = query.eq('personal_note', personalNote);
    } else {
      query = query.is('personal_note', null);
    }

    const { error } = await query;

    if (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
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

    const { error } = await supabase
      .from('visitor_carts')
      .delete()
      .eq('visitor_id', visitorId);

    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }

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
    await supabase
      .from('visitor_carts')
      .delete()
      .eq('visitor_id', visitorId);

    // Insert all current items
    if (items.length > 0) {
      const dbItems = items.map(item => transformToDbFormat(item, visitorId));
      await supabase
        .from('visitor_carts')
        .insert(dbItems);
    }
  } catch (error) {
    console.error('Error syncing cart to database:', error);
  }
}

