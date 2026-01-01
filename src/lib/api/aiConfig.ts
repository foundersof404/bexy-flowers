/**
 * AI Image Generation Configuration
 * 
 * Centralized config for all AI services.
 * Edit these values to customize behavior.
 */

export const AI_CONFIG = {
  /**
   * Generation Settings
   */
  generation: {
    // Default image dimensions (smaller = faster)
    defaultWidth: 512,
    defaultHeight: 512,
    
    // Automatically enhance prompts with professional keywords
    autoEnhancePrompts: true,
    
    // Maximum prompt length (characters)
    maxPromptLength: 500,
  },

  /**
   * Retry Strategy
   */
  retry: {
    // Number of different strategies to try
    maxStrategies: 4,
    
    // Delays between retries (milliseconds)
    // Note: Pollinations can be overloaded during peak hours
    // Longer delays give the service time to recover
    delays: [3000, 5000, 8000], // 3s, 5s, 8s (increased for reliability)
    
    // Timeout for each request (milliseconds)
    requestTimeout: 45000, // 45 seconds (increased from 30s)
  },

  /**
   * API Endpoints
   */
  apis: {
    pollinations: {
      enabled: true,
      // WORKAROUND: Use IMG tag approach (bypasses CORS)
      // Pollinations blocks fetch() but allows <img> tags
      baseUrl: 'https://image.pollinations.ai/prompt',
      apiKey: '', 
      params: {
        nologo: true,
        enhance: true,
        model: 'flux',
        seed: -1,
        width: 1024,
        height: 1024,
      }
    },
    
    huggingface: {
      // DISABLED: HuggingFace blocks direct browser requests (CORS policy)
      // To use HuggingFace, you need a backend proxy server
      // For now, we rely on Pollinations which allows browser requests
      enabled: false, // Changed from true to false
      baseUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      // Optional: Add API key for faster/more reliable generation
      // Get free key at: https://huggingface.co/settings/tokens
      apiKey: '', // Leave empty for public inference
    },
  },

  /**
   * Prompt Enhancement Keywords
   */
  promptEnhancements: {
    // Keywords added to all prompts
    quality: [
      'professional product photography',
      'studio lighting',
      'high resolution',
      'sharp focus',
    ],
    
    style: [
      'white background',
      'detailed',
      'vibrant colors',
      'luxury floral arrangement',
    ],
    
    // Brand-specific keywords (customize for your brand)
    brand: [
      'Bexy Flowers style',
      'elegant presentation',
      'premium quality',
    ],
  },

  /**
   * Validation Rules
   */
  validation: {
    // Minimum valid image size (bytes)
    // Note: Error pages from APIs are usually <30KB, real images are >50KB
    minImageSize: 50000, // 50KB minimum
    
    // Minimum valid dimensions (pixels)
    minWidth: 300,
    minHeight: 300,
    
    // Valid content types
    validContentTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ],
  },

  /**
   * UX Settings
   */
  ux: {
    // Show which AI service was used
    showSourceInfo: true,
    
    // Loading messages
    loadingMessages: [
      'Creating your bouquet...',
      'Arranging flowers...',
      'Adding final touches...',
      'Almost ready...',
    ],
    
    // Toast duration (milliseconds)
    toastDuration: 5000,
  },
};

/**
 * Helper to get loading message based on elapsed time
 */
export function getLoadingMessage(elapsedSeconds: number): string {
  const messages = AI_CONFIG.ux.loadingMessages;
  const index = Math.min(
    Math.floor(elapsedSeconds / 5), 
    messages.length - 1
  );
  return messages[index];
}

/**
 * Helper to build API URL with parameters
 */
export function buildPollinationsUrl(prompt: string, width: number, height: number, negative?: string): string {
  const config = AI_CONFIG.apis.pollinations;
  
  // Build query parameters
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    nologo: 'true',
    enhance: 'true',
    model: config.params.model || 'flux',
  });
  
  const encodedPrompt = encodeURIComponent(prompt);
  return `${config.baseUrl}/${encodedPrompt}?${params.toString()}`;
}

/**
 * Helper to check if API is enabled
 */
export function isApiEnabled(apiName: 'pollinations' | 'huggingface'): boolean {
  return AI_CONFIG.apis[apiName]?.enabled ?? false;
}

export default AI_CONFIG;

