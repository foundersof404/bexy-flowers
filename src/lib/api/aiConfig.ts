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
    // Default image dimensions (1024x1024 for best quality with Flux)
    defaultWidth: 1024,
    defaultHeight: 1024,
    
    // Automatically enhance prompts with professional keywords
    autoEnhancePrompts: true,
    
    // Maximum prompt length (characters)
    // Increased to accommodate detailed prompts with branding and all flower details
    // Pollinations can handle longer prompts well (Flux has 12B parameters)
    maxPromptLength: 400,
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
      // NEW API ENDPOINT (as of 2025)
      // Documentation: https://gen.pollinations.ai
      // Format: https://gen.pollinations.ai/image/{prompt}?key=YOUR_API_KEY
      baseUrl: 'https://gen.pollinations.ai/image', // New API gateway endpoint
      apiKey: 'pk_uI3dAtamrhnXMCUr', // Publishable API key for priority access
      params: {
        // NOTE: Only basic parameters are supported in new API
        // enhance, nologo, seed may cause 400 errors - not including them
        model: 'flux', // Using 'flux' model (confirmed to work)
        width: 1024, // High resolution for quality
        height: 1024, // High resolution for quality
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
    // Photography-specific keywords for Flux model
    // Flux understands professional photography terminology
    quality: [
      '8K resolution',
      'ultra-detailed',
      'photorealistic',
      'professional product photography',
      'studio lighting',
      'soft natural lighting',
      'sharp focus',
      'depth of field',
      'macro photography',
    ],
    
    style: [
      'white background',
      'seamless background',
      'isolated on white',
      'detailed',
      'vibrant colors',
      'luxury floral arrangement',
      'premium quality',
      'commercial photography',
    ],
    
    // Brand-specific keywords (customize for your brand)
    // Multiple mentions help Pollinations/Flux understand branding importance
    brand: [
      'Bexy Flowers luxury brand',
      'Bexy Flowers signature style',
      'elegant presentation',
      'premium quality',
      'signature arrangement',
      'Bexy Flowers premium floral gift',
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
  
  // NEW API FORMAT: https://gen.pollinations.ai/image/{prompt}?key=API_KEY&model=flux&width=1024&height=1024
  // Documentation: https://gen.pollinations.ai
  // Authentication: Use ?key=YOUR_API_KEY (publishable keys work in query param)
  // 
  // IMPORTANT: New API may only support basic parameters:
  // - model (required): 'flux', 'turbo', 'sdxl', etc.
  // - width, height (optional): Image dimensions
  // - key (required): API key for authentication
  // 
  // Parameters that may NOT be supported:
  // - enhance, nologo, seed, negative (may cause 400 errors)
  
  // Build query parameters - ONLY use confirmed supported parameters
  const params = new URLSearchParams();
  
  // Model (required) - use 'flux' as default (confirmed to work)
  params.append('model', config.params.model || 'flux');
  
  // Dimensions (optional but recommended)
  if (width) {
    params.append('width', width.toString());
  }
  if (height) {
    params.append('height', height.toString());
  }
  
  // API key (required for authenticated requests)
  if (config.apiKey) {
    params.append('key', config.apiKey);
  }
  
  // NOTE: Not including enhance, nologo, seed - these may cause 400 errors
  // The API documentation suggests these may not be supported in the new endpoint
  
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Simplified API format: /image/{prompt}?key=API_KEY&model=flux&width=1024&height=1024
  return `${config.baseUrl}/${encodedPrompt}?${params.toString()}`;
}

/**
 * Helper to check if API is enabled
 */
export function isApiEnabled(apiName: 'pollinations' | 'huggingface'): boolean {
  return AI_CONFIG.apis[apiName]?.enabled ?? false;
}

export default AI_CONFIG;

