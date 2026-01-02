/**
 * Visitor Favorites API
 * Handles database operations for visitor favorite products
 */

import { supabase } from '../supabase';
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

    const { data, error } = await supabase
      .from('visitor_favorites')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return (data || []).map(transformFavoriteItem);
  } catch (error) {
    console.error('Error in getVisitorFavorites:', error);
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

    const { error } = await supabase
      .from('visitor_favorites')
      .upsert(dbItem, {
        onConflict: 'visitor_id,product_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error adding favorite:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addVisitorFavorite:', error);
    return false;
  }
}

/**
 * Remove favorite product for the current visitor
 */
export async function removeVisitorFavorite(productId: string | number): Promise<boolean> {
  try {
    const visitorId = getVisitorId();

    const { error } = await supabase
      .from('visitor_favorites')
      .delete()
      .eq('visitor_id', visitorId)
      .eq('product_id', String(productId));

    if (error) {
      console.error('Error removing favorite:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeVisitorFavorite:', error);
    return false;
  }
}

/**
 * Check if product is in favorites for the current visitor
 */
export async function isVisitorFavorite(productId: string | number): Promise<boolean> {
  try {
    const visitorId = getVisitorId();

    const { data, error } = await supabase
      .from('visitor_favorites')
      .select('id')
      .eq('visitor_id', visitorId)
      .eq('product_id', String(productId))
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking favorite:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isVisitorFavorite:', error);
    return false;
  }
}

/**
 * Clear all favorites for the current visitor
 */
export async function clearVisitorFavorites(): Promise<boolean> {
  try {
    const visitorId = getVisitorId();

    const { error } = await supabase
      .from('visitor_favorites')
      .delete()
      .eq('visitor_id', visitorId);

    if (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }

    return true;
  } catch (error) {
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
    await supabase
      .from('visitor_favorites')
      .delete()
      .eq('visitor_id', visitorId);

    // Insert all current favorites
    if (favorites.length > 0) {
      const dbItems = favorites.map(item => transformToDbFormat(item, visitorId));
      await supabase
        .from('visitor_favorites')
        .insert(dbItems);
    }
  } catch (error) {
    console.error('Error syncing favorites to database:', error);
  }
}














