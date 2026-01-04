import { db } from './database-client';
import { uploadImage, deleteImage, extractPathFromUrl } from '../supabase-storage';
import type { Database } from '../supabase';

type Accessory = Database['public']['Tables']['accessories']['Row'];
type AccessoryInsert = Database['public']['Tables']['accessories']['Insert'];
type AccessoryUpdate = Database['public']['Tables']['accessories']['Update'];

/**
 * Get all accessories
 */
export async function getAccessories(): Promise<Accessory[]> {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch accessories: ${error.message}`);
  }

  return data;
}

/**
 * Get a single accessory by ID
 */
export async function getAccessory(id: string): Promise<Accessory | null> {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch accessory: ${error.message}`);
  }

  return data;
}

/**
 * Create a new accessory
 */
export async function createAccessory(
  accessory: Omit<AccessoryInsert, 'id' | 'created_at' | 'updated_at' | 'image_url'>,
  image?: File
): Promise<Accessory> {
  let imageUrl: string | null = null;

  // Upload image if provided
  if (image) {
    try {
      const result = await uploadImage('accessory-images', image);
      imageUrl = result.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const { data, error } = await supabase
    .from('accessories')
    .insert({
      ...accessory,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create accessory: ${error.message}`);
  }

  return data;
}

/**
 * Update an accessory
 */
export async function updateAccessory(
  id: string,
  updates: AccessoryUpdate,
  newImage?: File,
  deleteOldImage?: boolean
): Promise<Accessory> {
  // Delete old image if requested
  if (deleteOldImage) {
    const currentAccessory = await getAccessory(id);
    if (currentAccessory?.image_url) {
      try {
        const path = extractPathFromUrl(currentAccessory.image_url, 'accessory-images');
        await deleteImage('accessory-images', path);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
  }

  // Upload new image if provided
  let imageUrl = updates.image_url;
  if (newImage) {
    try {
      const result = await uploadImage('accessory-images', newImage);
      imageUrl = result.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const { data, error } = await supabase
    .from('accessories')
    .update({
      ...updates,
      image_url: imageUrl,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update accessory: ${error.message}`);
  }

  return data;
}

/**
 * Delete an accessory
 */
export async function deleteAccessory(id: string): Promise<void> {
  // Delete associated image
  const accessory = await getAccessory(id);
  if (accessory?.image_url) {
    try {
      const path = extractPathFromUrl(accessory.image_url, 'accessory-images');
      await deleteImage('accessory-images', path);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  await db.delete('accessories', { id });
}

