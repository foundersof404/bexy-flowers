/**
 * Utility functions for handling image URLs safely
 */

/**
 * Safely encode an image URL for use in img src attributes
 * Handles paths with spaces and special characters properly
 * Specifically handles the % character in folder names (e.g., "wedding % events")
 */
export function encodeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // If it's already a full URL (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // For local paths, we need to encode each segment separately
  // to handle spaces and special characters in folder/file names
  if (url.startsWith('/')) {
    try {
      // Split by '/' and encode each segment
      const segments = url.split('/').filter(Boolean); // Remove empty segments
      const encodedSegments = segments.map(segment => {
        // Check if segment contains % character - if so, encode directly without decoding
        // This prevents issues with Vite's middleware trying to decode malformed URIs
        if (segment.includes('%')) {
          // If it contains %, encode it directly - this will encode % as %25
          return encodeURIComponent(segment);
        }
        
        // For segments without %, try to decode first if already encoded, then re-encode
        // This handles cases where paths are already partially encoded
        try {
          const decoded = decodeURIComponent(segment);
          return encodeURIComponent(decoded);
        } catch {
          // If decode fails, just encode as-is
          return encodeURIComponent(segment);
        }
      });
      
      // Reconstruct the path
      return '/' + encodedSegments.join('/');
    } catch (error) {
      // If anything fails, try to encode the whole URL
      console.warn('Error encoding image URL:', url, error);
      return url;
    }
  }
  
  // For relative paths, encode the whole thing
  return encodeURI(url);
}

