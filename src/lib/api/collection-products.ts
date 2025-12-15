import { supabase } from '../supabase';
import { uploadImage, uploadMultipleImages, deleteImage, extractPathFromUrl } from '../supabase-storage';
import type { Database } from '../supabase';

type CollectionProduct = Database['public']['Tables']['collection_products']['Row'];
type CollectionProductInsert = Database['public']['Tables']['collection_products']['Insert'];
type CollectionProductUpdate = Database['public']['Tables']['collection_products']['Update'];

/**
 * Get all collection products
 */
export async function getCollectionProducts(filters?: {
  category?: string;
  featured?: boolean;
  isActive?: boolean;
}): Promise<CollectionProduct[]> {
  let query = supabase
    .from('collection_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }

  if (filters?.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch collection products: ${error.message}`);
  }

  return data;
}

/**
 * Get a single collection product by ID
 */
export async function getCollectionProduct(id: string): Promise<CollectionProduct | null> {
  const { data, error } = await supabase
    .from('collection_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch collection product: ${error.message}`);
  }

  return data;
}

/**
 * Create a new collection product
 */
export async function createCollectionProduct(
  product: Omit<CollectionProductInsert, 'id' | 'created_at' | 'updated_at'>,
  images?: File[]
): Promise<CollectionProduct> {
  let imageUrls: string[] = [];

  // Upload images if provided
  if (images && images.length > 0) {
    try {
      imageUrls = await uploadMultipleImages('product-images', images);
    } catch (error) {
      throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const { data, error } = await supabase
    .from('collection_products')
    .insert({
      ...product,
      image_urls: imageUrls.length > 0 ? imageUrls : product.image_urls || [],
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create collection product: ${error.message}`);
  }

  return data;
}

/**
 * Update a collection product
 */
export async function updateCollectionProduct(
  id: string,
  updates: CollectionProductUpdate,
  newImages?: File[],
  imagesToDelete?: string[]
): Promise<CollectionProduct> {
  // Delete old images if specified
  if (imagesToDelete && imagesToDelete.length > 0) {
    const deletePromises = imagesToDelete.map((url) => {
      try {
        const path = extractPathFromUrl(url, 'product-images');
        return deleteImage('product-images', path);
      } catch (error) {
        console.error('Error deleting image:', error);
        return Promise.resolve();
      }
    });
    await Promise.all(deletePromises);
  }

  // Upload new images if provided
  let newImageUrls: string[] = [];
  if (newImages && newImages.length > 0) {
    try {
      newImageUrls = await uploadMultipleImages('product-images', newImages);
    } catch (error) {
      throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update image URLs
  const currentImageUrls = updates.image_urls || [];
  const remainingUrls = currentImageUrls.filter((url) => !imagesToDelete?.includes(url));
  const finalImageUrls = [...remainingUrls, ...newImageUrls];

  const { data, error } = await supabase
    .from('collection_products')
    .update({
      ...updates,
      image_urls: finalImageUrls.length > 0 ? finalImageUrls : updates.image_urls,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update collection product: ${error.message}`);
  }

  return data;
}

/**
 * Delete a collection product
 */
export async function deleteCollectionProduct(id: string): Promise<void> {
  // Get product to delete images
  const product = await getCollectionProduct(id);
  if (product && product.image_urls) {
    // Delete all associated images
    const deletePromises = product.image_urls.map((url) => {
      try {
        const path = extractPathFromUrl(url, 'product-images');
        return deleteImage('product-images', path);
      } catch (error) {
        console.error('Error deleting image:', error);
        return Promise.resolve();
      }
    });
    await Promise.all(deletePromises);
  }

  const { error } = await supabase
    .from('collection_products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete collection product: ${error.message}`);
  }
}

/**
 * Add tags to a product
 */
export async function addTagsToProduct(id: string, tags: string[]): Promise<CollectionProduct> {
  const product = await getCollectionProduct(id);
  if (!product) {
    throw new Error('Product not found');
  }

  const currentTags = product.tags || [];
  const newTags = [...new Set([...currentTags, ...tags])]; // Remove duplicates

  return updateCollectionProduct(id, { tags: newTags });
}

/**
 * Remove tags from a product
 */
export async function removeTagsFromProduct(id: string, tagsToRemove: string[]): Promise<CollectionProduct> {
  const product = await getCollectionProduct(id);
  if (!product) {
    throw new Error('Product not found');
  }

  const currentTags = product.tags || [];
  const newTags = currentTags.filter((tag) => !tagsToRemove.includes(tag));

  return updateCollectionProduct(id, { tags: newTags });
}

/**
 * Get all unique tags from all products
 */
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('collection_products')
    .select('tags');

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  const allTags = new Set<string>();
  data.forEach((product) => {
    if (product.tags) {
      product.tags.forEach((tag) => allTags.add(tag));
    }
  });

  return Array.from(allTags).sort();
}

