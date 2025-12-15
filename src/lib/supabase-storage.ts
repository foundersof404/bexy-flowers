import { supabase } from './supabase';

export type StorageBucket = 'product-images' | 'flower-images' | 'accessory-images' | 'wedding-creations';

/**
 * Upload an image file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param file - The file to upload
 * @param folder - Optional folder path within the bucket
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<{ url: string; path: string }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path to delete
 */
export async function deleteImage(bucket: StorageBucket, path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Upload multiple images
 * @param bucket - The storage bucket name
 * @param files - Array of files to upload
 * @param folder - Optional folder path within the bucket
 * @returns Array of public URLs
 */
export async function uploadMultipleImages(
  bucket: StorageBucket,
  files: File[],
  folder?: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(bucket, file, folder));
    const results = await Promise.all(uploadPromises);
    return results.map((result) => result.url);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

/**
 * Extract file path from Supabase Storage URL
 * @param url - The public URL
 * @returns The file path
 */
export function extractPathFromUrl(url: string, bucket: StorageBucket): string {
  const urlObj = new URL(url);
  // Supabase storage URLs typically have the bucket name in the path
  const pathMatch = urlObj.pathname.match(new RegExp(`/${bucket}/(.+)`));
  return pathMatch ? pathMatch[1] : urlObj.pathname;
}

