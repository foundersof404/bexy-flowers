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
 * 1. Normalizes old folder names (e.g., "wedding % events" → "wedding-events")
 * 2. Decodes already-encoded segments to normalize them
 * 3. Re-encodes all segments to ensure consistent encoding
 * 4. Works with both browser img src and Vite's middleware
 * 5. Preserves full URLs (Supabase storage URLs, etc.) as-is
 */
export function encodeImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') return '';

  // If it's already a full URL (http/https), return as-is (includes Supabase storage URLs)
  // This preserves query parameters, hash fragments, and other URL components
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle blob URLs (for preview images)
  if (url.startsWith('blob:')) {
    return url;
  }

  // For public assets, normalize old folder names first, then encode
  if (url.startsWith('/')) {
    try {
      // Normalize old folder names before processing
      // Replace "wedding % events" with "wedding-events" (handles both encoded and non-encoded versions)
      let normalizedUrl = url;
      
      // Handle the old folder name "wedding % events" (with space and %)
      // This handles both the raw path and encoded versions
      normalizedUrl = normalizedUrl.replace(/wedding\s*%\s*events/gi, 'wedding-events');
      
      // Also handle already encoded versions like "wedding%20%25%20events"
      normalizedUrl = normalizedUrl.replace(/wedding%20%25%20events/gi, 'wedding-events');
      normalizedUrl = normalizedUrl.replace(/wedding%20%20events/gi, 'wedding-events'); // double space variant
      
      // Split by '/' and process each segment
      const segments = normalizedUrl.split('/').filter(Boolean); // Remove empty segments
      
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

