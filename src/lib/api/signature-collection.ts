import { supabase } from '../supabase';
import type { Database } from '../supabase';

type SignatureCollection = Database['public']['Tables']['signature_collections']['Row'];
type SignatureCollectionInsert = Database['public']['Tables']['signature_collections']['Insert'];
type SignatureCollectionUpdate = Database['public']['Tables']['signature_collections']['Update'];

export interface SignatureCollectionWithProduct extends SignatureCollection {
  product: Database['public']['Tables']['collection_products']['Row'] | null;
}

/**
 * Get all signature collection items with product details
 */
export async function getSignatureCollections(): Promise<SignatureCollectionWithProduct[]> {
  const { data, error } = await supabase
    .from('signature_collections')
    .select(`
      *,
      product:collection_products(*)
    `)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch signature collections: ${error.message}`);
  }

  return data as SignatureCollectionWithProduct[];
}

/**
 * Get active signature collection items for frontend
 */
export async function getActiveSignatureCollections(): Promise<SignatureCollectionWithProduct[]> {
  const { data, error } = await supabase
    .from('signature_collections')
    .select(`
      *,
      product:collection_products(*)
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch active signature collections: ${error.message}`);
  }

  return data as SignatureCollectionWithProduct[];
}

/**
 * Add a product to signature collection
 */
export async function addToSignatureCollection(
  productId: string,
  displayOrder?: number
): Promise<SignatureCollection> {
  // Get max display order if not provided
  let order = displayOrder;
  if (order === undefined) {
    const { data: maxOrder } = await supabase
      .from('signature_collections')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    order = maxOrder ? maxOrder.display_order + 1 : 0;
  }

  const { data, error } = await supabase
    .from('signature_collections')
    .insert({
      product_id: productId,
      display_order: order,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add to signature collection: ${error.message}`);
  }

  return data;
}

/**
 * Remove a product from signature collection
 */
export async function removeFromSignatureCollection(id: string): Promise<void> {
  const { error } = await supabase
    .from('signature_collections')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to remove from signature collection: ${error.message}`);
  }
}

/**
 * Update signature collection item
 */
export async function updateSignatureCollection(
  id: string,
  updates: SignatureCollectionUpdate
): Promise<SignatureCollection> {
  const { data, error } = await supabase
    .from('signature_collections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update signature collection: ${error.message}`);
  }

  return data;
}

/**
 * Reorder signature collection items
 */
export async function reorderSignatureCollections(
  items: { id: string; display_order: number }[]
): Promise<void> {
  const updates = items.map((item) =>
    supabase
      .from('signature_collections')
      .update({ display_order: item.display_order })
      .eq('id', item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw new Error(`Failed to reorder signature collections: ${errors[0].error?.message}`);
  }
}

/**
 * Toggle active status of signature collection item
 */
export async function toggleSignatureCollectionActive(
  id: string,
  isActive: boolean
): Promise<SignatureCollection> {
  return updateSignatureCollection(id, { is_active: isActive });
}

