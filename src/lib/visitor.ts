/**
 * Visitor ID Management
 * Generates and manages unique visitor IDs for tracking cart and favorites
 */

const VISITOR_ID_KEY = 'bexy-flowers-visitor-id';

/**
 * Generate a unique visitor ID (UUID v4)
 */
function generateVisitorId(): string {
  // Generate UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create visitor ID
 * Returns the visitor ID from localStorage, or creates a new one if it doesn't exist
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering: return a temporary ID
    return 'temp-visitor-id';
  }

  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    
    if (!visitorId) {
      // Generate new visitor ID
      visitorId = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    
    return visitorId;
  } catch (error) {
    console.error('Error getting visitor ID:', error);
    // Fallback: generate a temporary ID for this session
    return generateVisitorId();
  }
}

/**
 * Clear visitor ID (useful for testing or logout scenarios)
 */
export function clearVisitorId(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(VISITOR_ID_KEY);
    } catch (error) {
      console.error('Error clearing visitor ID:', error);
    }
  }
}

/**
 * Check if visitor ID exists
 */
export function hasVisitorId(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return localStorage.getItem(VISITOR_ID_KEY) !== null;
  } catch (error) {
    console.error('Error checking visitor ID:', error);
    return false;
  }
}



