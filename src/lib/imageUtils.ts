/**
 * Utility functions for handling image URLs safely
 */

/**
 * Checks if a string contains percent-encoded characters
 */
function isEncoded(str: string): boolean {
  return /%[0-9A-Fa-f]{2}/.test(str);
}

/**
 * Safely decode a URL segment, handling already-encoded and non-encoded segments
 */
function safeDecodeSegment(segment: string): string {
  if (!isEncoded(segment)) {
    return segment; // Already decoded
  }
  
  try {
    return decodeURIComponent(segment);
  } catch {
    // If decoding fails, return as-is (might be malformed, but don't break everything)
    return segment;
  }
}

/**
 * Safely encode an image URL for use in img src attributes and programmatic use
 * Handles paths with spaces and special characters properly for Vite compatibility
 * 
 * This function:
 * 1. Decodes already-encoded segments to normalize them
 * 2. Re-encodes all segments to ensure consistent encoding
 * 3. Works with both browser img src and Vite's middleware
 */
export function encodeImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // If it's already a full URL (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // For public assets, encode each segment separately
  // This ensures spaces and special characters are properly handled
  if (url.startsWith('/')) {
    try {
      // Split by '/' and process each segment
      const segments = url.split('/').filter(Boolean); // Remove empty segments
      
      const encodedSegments = segments.map(segment => {
        // First, try to decode if it's already encoded (normalize)
        const decoded = safeDecodeSegment(segment);
        
        // Then encode it properly (this handles spaces, special chars, etc.)
        return encodeURIComponent(decoded);
      });
      
      // Reconstruct the path
      return '/' + encodedSegments.join('/');
    } catch (error) {
      console.warn('Error encoding image URL:', url, error);
      // If encoding fails, try to return a safe version
      return url.replace(/\s+/g, '%20');
    }
  }

  // For relative paths, encode the whole thing
  return encodeURI(url);
}

