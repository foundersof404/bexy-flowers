/**
 * Utility functions for handling image URLs safely
 */

/**
 * Safely encode an image URL for use in img src attributes
 * Handles paths with spaces and special characters properly
 * Encodes each path segment separately to handle file/folder names with spaces
 */
export function encodeImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // If it's already a full URL (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // For public assets, encode each segment separately to handle spaces and special chars
  if (url.startsWith('/')) {
    try {
      // Split by '/' and encode each segment
      const segments = url.split('/').filter(Boolean);
      const encodedSegments = segments.map(segment => {
        // Encode each segment to handle spaces and special characters in file/folder names
        return encodeURIComponent(segment);
      });
      
      // Reconstruct the path
      return '/' + encodedSegments.join('/');
    } catch (error) {
      console.warn('Error encoding image URL:', url, error);
      return url;
    }
  }

  // For relative paths, encode the whole thing
  return encodeURI(url);
}

