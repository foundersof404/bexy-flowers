import { supabase } from '../supabase';
import type { Database } from '../supabase';

type LuxuryBox = Database['public']['Tables']['luxury_boxes']['Row'];
type LuxuryBoxInsert = Database['public']['Tables']['luxury_boxes']['Insert'];
type LuxuryBoxUpdate = Database['public']['Tables']['luxury_boxes']['Update'];

type BoxColor = Database['public']['Tables']['box_colors']['Row'];
type BoxColorInsert = Database['public']['Tables']['box_colors']['Insert'];
type BoxColorUpdate = Database['public']['Tables']['box_colors']['Update'];

type BoxSize = Database['public']['Tables']['box_sizes']['Row'];
type BoxSizeInsert = Database['public']['Tables']['box_sizes']['Insert'];
type BoxSizeUpdate = Database['public']['Tables']['box_sizes']['Update'];

export interface LuxuryBoxWithDetails extends LuxuryBox {
  colors: BoxColor[];
  sizes: BoxSize[];
}

// ==================== Luxury Boxes ====================

/**
 * Get all luxury boxes
 */
export async function getLuxuryBoxes(type?: 'box' | 'wrap'): Promise<LuxuryBox[]> {
  let query = supabase
    .from('luxury_boxes')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch luxury boxes: ${error.message}`);
  }

  return data;
}

/**
 * Get luxury box with colors and sizes
 */
export async function getLuxuryBoxWithDetails(id: string): Promise<LuxuryBoxWithDetails | null> {
  const { data: box, error: boxError } = await supabase
    .from('luxury_boxes')
    .select('*')
    .eq('id', id)
    .single();

  if (boxError) {
    if (boxError.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch luxury box: ${boxError.message}`);
  }

  const { data: colors, error: colorsError } = await supabase
    .from('box_colors')
    .select('*')
    .eq('box_id', id)
    .order('created_at', { ascending: true });

  if (colorsError) {
    throw new Error(`Failed to fetch box colors: ${colorsError.message}`);
  }

  const { data: sizes, error: sizesError } = await supabase
    .from('box_sizes')
    .select('*')
    .eq('box_id', id)
    .order('capacity', { ascending: true });

  if (sizesError) {
    throw new Error(`Failed to fetch box sizes: ${sizesError.message}`);
  }

  return {
    ...box,
    colors: colors || [],
    sizes: sizes || [],
  };
}

/**
 * Create a luxury box
 */
export async function createLuxuryBox(box: Omit<LuxuryBoxInsert, 'id' | 'created_at' | 'updated_at'>): Promise<LuxuryBox> {
  const { data, error } = await supabase
    .from('luxury_boxes')
    .insert(box)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create luxury box: ${error.message}`);
  }

  return data;
}

/**
 * Update a luxury box
 */
export async function updateLuxuryBox(id: string, updates: LuxuryBoxUpdate): Promise<LuxuryBox> {
  const { data, error } = await supabase
    .from('luxury_boxes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update luxury box: ${error.message}`);
  }

  return data;
}

/**
 * Delete a luxury box (cascades to colors and sizes)
 */
export async function deleteLuxuryBox(id: string): Promise<void> {
  const { error } = await supabase
    .from('luxury_boxes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete luxury box: ${error.message}`);
  }
}

// ==================== Box Colors ====================

/**
 * Get colors for a box
 */
export async function getBoxColors(boxId: string): Promise<BoxColor[]> {
  const { data, error } = await supabase
    .from('box_colors')
    .select('*')
    .eq('box_id', boxId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch box colors: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a box color
 */
export async function createBoxColor(color: Omit<BoxColorInsert, 'id' | 'created_at' | 'updated_at'>): Promise<BoxColor> {
  const { data, error } = await supabase
    .from('box_colors')
    .insert(color)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create box color: ${error.message}`);
  }

  return data;
}

/**
 * Update a box color
 */
export async function updateBoxColor(id: string, updates: BoxColorUpdate): Promise<BoxColor> {
  const { data, error } = await supabase
    .from('box_colors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update box color: ${error.message}`);
  }

  return data;
}

/**
 * Delete a box color
 */
export async function deleteBoxColor(id: string): Promise<void> {
  const { error } = await supabase
    .from('box_colors')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete box color: ${error.message}`);
  }
}

// ==================== Box Sizes ====================

/**
 * Get sizes for a box
 */
export async function getBoxSizes(boxId: string): Promise<BoxSize[]> {
  const { data, error } = await supabase
    .from('box_sizes')
    .select('*')
    .eq('box_id', boxId)
    .order('capacity', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch box sizes: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a box size
 */
export async function createBoxSize(size: Omit<BoxSizeInsert, 'id' | 'created_at' | 'updated_at'>): Promise<BoxSize> {
  const { data, error } = await supabase
    .from('box_sizes')
    .insert(size)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create box size: ${error.message}`);
  }

  return data;
}

/**
 * Update a box size
 */
export async function updateBoxSize(id: string, updates: BoxSizeUpdate): Promise<BoxSize> {
  const { data, error } = await supabase
    .from('box_sizes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update box size: ${error.message}`);
  }

  return data;
}

/**
 * Delete a box size
 */
export async function deleteBoxSize(id: string): Promise<void> {
  const { error } = await supabase
    .from('box_sizes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete box size: ${error.message}`);
  }
}

