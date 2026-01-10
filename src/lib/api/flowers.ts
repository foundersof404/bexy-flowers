import { db } from './database-client';
import { uploadImage, deleteImage, extractPathFromUrl } from '../supabase-storage';
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type FlowerType = Database['public']['Tables']['flower_types']['Row'];
type FlowerTypeInsert = Database['public']['Tables']['flower_types']['Insert'];
type FlowerTypeUpdate = Database['public']['Tables']['flower_types']['Update'];

type FlowerColor = Database['public']['Tables']['flower_colors']['Row'];
type FlowerColorInsert = Database['public']['Tables']['flower_colors']['Insert'];
type FlowerColorUpdate = Database['public']['Tables']['flower_colors']['Update'];

export interface FlowerTypeWithColors extends FlowerType {
  colors: FlowerColor[];
}

// ==================== Flower Types ====================

/**
 * Get all flower types
 */
export async function getFlowerTypes(filters?: { category?: string; featured?: boolean; isActive?: boolean }): Promise<FlowerType[]> {
  let query = supabase
    .from('flower_types')
    .select('*')
    .order('name', { ascending: true });

  // Apply filters if provided
  if (filters?.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch flower types: ${error.message}`);
  }

  return data || [];
}

// Alias for backwards compatibility
export const getFlowers = getFlowerTypes;

/**
 * Get single flower type by ID
 */
export const getFlower = getFlowerTypeWithColors;

/**
 * Get flower type with colors
 */
export async function getFlowerTypeWithColors(id: string): Promise<FlowerTypeWithColors | null> {
  const { data: flower, error: flowerError } = await supabase
    .from('flower_types')
    .select('*')
    .eq('id', id)
    .single();

  if (flowerError) {
    if (flowerError.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch flower type: ${flowerError.message}`);
  }

  const { data: colors, error: colorsError } = await supabase
    .from('flower_colors')
    .select('*')
    .eq('flower_id', id)
    .order('name', { ascending: true });

  if (colorsError) {
    throw new Error(`Failed to fetch flower colors: ${colorsError.message}`);
  }

  return {
    ...flower,
    colors: colors || [],
  };
}

/**
 * Create a flower type
 */
export async function createFlowerType(
  flower: Omit<FlowerTypeInsert, 'id' | 'created_at' | 'updated_at' | 'image_url'>,
  image?: File
): Promise<FlowerType> {
  let imageUrl: string | null = null;

  // Upload image if provided
  if (image) {
    try {
      const result = await uploadImage('flower-images', image);
      imageUrl = result.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const { data, error } = await supabase
    .from('flower_types')
    .insert({
      ...flower,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create flower type: ${error.message}`);
  }

  return data;
}

/**
 * Update a flower type
 */
export async function updateFlowerType(
  id: string,
  updates: FlowerTypeUpdate,
  newImage?: File,
  deleteOldImage?: boolean
): Promise<FlowerType> {
  // Delete old image if requested
  if (deleteOldImage) {
    const currentFlower = await getFlowerTypeWithColors(id);
    if (currentFlower?.image_url) {
      try {
        const path = extractPathFromUrl(currentFlower.image_url, 'flower-images');
        await deleteImage('flower-images', path);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
  }

  // Upload new image if provided
  let imageUrl = updates.image_url;
  if (newImage) {
    try {
      const result = await uploadImage('flower-images', newImage);
      imageUrl = result.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const { data, error } = await supabase
    .from('flower_types')
    .update({
      ...updates,
      image_url: imageUrl,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update flower type: ${error.message}`);
  }

  return data;
}

/**
 * Delete a flower type (cascades to colors)
 */
export async function deleteFlowerType(id: string): Promise<void> {
  // Delete associated image
  const flower = await getFlowerTypeWithColors(id);
  if (flower?.image_url) {
    try {
      const path = extractPathFromUrl(flower.image_url, 'flower-images');
      await deleteImage('flower-images', path);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  await db.delete('flower_types', { id });
}

// Aliases for backwards compatibility
export const createFlower = createFlowerType;
export const updateFlower = updateFlowerType;
export const deleteFlower = deleteFlowerType;

// ==================== Flower Colors ====================

/**
 * Get colors for a flower type
 */
export async function getFlowerColors(flowerId: string): Promise<FlowerColor[]> {
  const { data, error } = await supabase
    .from('flower_colors')
    .select('*')
    .eq('flower_id', flowerId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch flower colors: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a flower color
 */
export async function createFlowerColor(
  color: Omit<FlowerColorInsert, 'id' | 'created_at' | 'updated_at'>
): Promise<FlowerColor> {
  const data = await db.insert<FlowerColor>('flower_colors', color);
  if (!data) {
    throw new Error('Failed to create flower color');
  }
  return data;
}

/**
 * Update a flower color
 */
export async function updateFlowerColor(id: string, updates: FlowerColorUpdate): Promise<FlowerColor> {
  const data = await db.update<FlowerColor>('flower_colors', { id }, updates);
  if (!data || data.length === 0) {
    throw new Error('Failed to update flower color');
  }
  return data[0];
}

/**
 * Delete a flower color
 */
export async function deleteFlowerColor(id: string): Promise<void> {
  await db.delete('flower_colors', { id });
}

