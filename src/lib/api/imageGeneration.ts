/**
 * AI Image Generation Service
 * 
 * Uses multiple free AI APIs with intelligent fallback:
 * 1. Pollinations AI (Primary)
 * 2. HuggingFace Inference (Backup)
 * 3. Improved prompts and error handling
 */

import AI_CONFIG, { buildPollinationsUrl, isApiEnabled } from './aiConfig';

interface GenerationOptions {
    width?: number;
    height?: number;
    enhancePrompt?: boolean;
}

interface GenerationResult {
    imageUrl: string;
    source: 'pollinations' | 'huggingface' | 'placeholder';
}

/**
 * Enhance prompt with professional photography keywords for better results
 */
function enhancePrompt(basePrompt: string): string {
    if (!AI_CONFIG.generation.autoEnhancePrompts) {
        return basePrompt;
    }
    
    // Combine all enhancement keywords from config
    const enhancements = [
        ...AI_CONFIG.promptEnhancements.quality,
        ...AI_CONFIG.promptEnhancements.style,
        ...AI_CONFIG.promptEnhancements.brand,
    ];
    
    return `${basePrompt}, ${enhancements.join(', ')}`;
}

/**
 * Clean and optimize prompt to avoid API errors
 */
function cleanPrompt(prompt: string): string {
    // Remove excessive punctuation and special characters that might cause issues
    return prompt
        .replace(/[^\w\s,.-]/g, '') // Keep only alphanumeric, spaces, commas, periods, hyphens
        .replace(/\s+/g, ' ')        // Normalize spaces
        .trim()
        .slice(0, AI_CONFIG.generation.maxPromptLength); // Limit length from config
}

/**
 * Generate image using Pollinations API (Primary method)
 */
async function generateWithPollinations(
    prompt: string,
    options: GenerationOptions
): Promise<GenerationResult> {
    if (!isApiEnabled('pollinations')) {
        throw new Error('Pollinations API is disabled in config');
    }
    
    const { 
        width = AI_CONFIG.generation.defaultWidth, 
        height = AI_CONFIG.generation.defaultHeight, 
        enhancePrompt: shouldEnhance = true 
    } = options;
    
    // Enhance and clean prompt
    const finalPrompt = shouldEnhance ? enhancePrompt(prompt) : prompt;
    const cleanedPrompt = cleanPrompt(finalPrompt);
    
    // Build negative prompt for better quality (exclude unwanted elements)
    const negativePrompt = "leaves, stems, green foliage, wilted, blurry, low quality, dark, messy";
    
    // Build URL using config helper
    const pollinationsUrl = buildPollinationsUrl(cleanedPrompt, width, height, negativePrompt);
    
    console.log('[ImageGen] Pollinations attempt with enhanced prompt');
    console.log('[ImageGen] URL length:', pollinationsUrl.length);
    
    // Pollinations doesn't use Authorization headers in browser (CORS blocked)
    // Their free tier works without API keys from browsers
    const headers: Record<string, string> = {
        'Accept': 'image/*',
    };
    
    console.log('[ImageGen] 🌸 Using Pollinations AI with IMG tag workaround (CORS bypass)');
    
    // WORKAROUND: Use Image() instead of fetch() to bypass CORS
    // Pollinations blocks fetch() but allows <img> tags
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Try to enable CORS
    
    const imageLoadPromise = new Promise<Blob>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Image load timeout after 45 seconds'));
        }, AI_CONFIG.retry.requestTimeout);
        
        img.onload = async () => {
            clearTimeout(timeout);
            try {
                // Convert image to blob
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert canvas to blob'));
                    }
                }, 'image/png');
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to load image from Pollinations'));
        };
        
        img.src = pollinationsUrl;
    });
    
    const blob = await imageLoadPromise;
    // Validate blob size
    const minSize = AI_CONFIG.validation.minImageSize;
    if (blob.size < minSize) {
        console.warn(`[ImageGen] ⚠️ Image too small: ${(blob.size / 1024).toFixed(1)}KB`);
        throw new Error(`Received error page or invalid image (size: ${(blob.size / 1024).toFixed(1)}KB)`);
    }
    
    // Validate dimensions (img is already loaded)
    const minWidth = AI_CONFIG.validation.minWidth;
    const minHeight = AI_CONFIG.validation.minHeight;
    
    if (img.width < minWidth || img.height < minHeight) {
        console.warn(`[ImageGen] ⚠️ Image dimensions too small: ${img.width}x${img.height}`);
        throw new Error(`Invalid image dimensions: ${img.width}x${img.height}`);
    }
    
    console.log(`[ImageGen] ✅ Valid image: ${img.width}x${img.height}, ${(blob.size / 1024).toFixed(1)}KB`);
    
    // Create blob URL
    const localUrl = URL.createObjectURL(blob);
    
    console.log('[ImageGen] ✅ Pollinations successful, blob URL:', localUrl);
    
    // Return the blob URL - component will handle cleanup on unmount
    return { imageUrl: localUrl, source: 'pollinations' };
}

/**
 * Generate image using HuggingFace Inference API (Backup method)
 */
async function generateWithHuggingFace(
    prompt: string,
    options: GenerationOptions
): Promise<GenerationResult> {
    if (!isApiEnabled('huggingface')) {
        throw new Error('HuggingFace API is disabled in config');
    }
    
    console.log('[ImageGen] Attempting HuggingFace backup...');
    
    const cleanedPrompt = cleanPrompt(prompt);
    const apiConfig = AI_CONFIG.apis.huggingface;
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    // Add API key if provided in config
    if (apiConfig.apiKey) {
        headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
    }
    
    const response = await fetch(apiConfig.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            inputs: cleanedPrompt,
            options: {
                wait_for_model: true,
            }
        }),
        signal: AbortSignal.timeout(AI_CONFIG.retry.requestTimeout),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
    }
    
    const blob = await response.blob();
    
    const minSize = AI_CONFIG.validation.minImageSize;
    if (blob.size < minSize) {
        console.warn(`[ImageGen] ⚠️ HuggingFace image too small: ${(blob.size / 1024).toFixed(1)}KB`);
        throw new Error(`HuggingFace returned invalid image (size: ${(blob.size / 1024).toFixed(1)}KB)`);
    }
    
    const localUrl = URL.createObjectURL(blob);
    
    // Verify image validity
    try {
        await new Promise<void>((resolve, reject) => {
            const img = new Image();
            const minWidth = AI_CONFIG.validation.minWidth;
            const minHeight = AI_CONFIG.validation.minHeight;
            
            img.onload = () => {
                if (img.width < minWidth || img.height < minHeight) {
                    console.warn(`[ImageGen] ⚠️ HuggingFace dimensions too small: ${img.width}x${img.height}`);
                    reject(new Error(`Invalid dimensions: ${img.width}x${img.height}`));
                } else {
                    console.log(`[ImageGen] ✅ Valid image: ${img.width}x${img.height}, ${(blob.size / 1024).toFixed(1)}KB`);
                    resolve();
                }
            };
            img.onerror = (e) => {
                console.error('[ImageGen] ❌ HuggingFace image failed to load:', e);
                reject(new Error('Failed to load HuggingFace image'));
            };
            img.src = localUrl;
        });
    } catch (error) {
        // Validation failed - revoke URL and throw
        URL.revokeObjectURL(localUrl);
        throw error;
    }
    
    console.log('[ImageGen] ✅ HuggingFace successful, blob URL:', localUrl);
    
    return { imageUrl: localUrl, source: 'huggingface' };
}

/**
 * Main generation function with intelligent fallback
 */
export async function generateBouquetImage(
    prompt: string,
    options: GenerationOptions = {}
): Promise<GenerationResult> {
    const { 
        width = AI_CONFIG.generation.defaultWidth, 
        height = AI_CONFIG.generation.defaultHeight, 
        enhancePrompt: shouldEnhance = AI_CONFIG.generation.autoEnhancePrompts 
    } = options;
    
    console.log('[ImageGen] Starting generation with prompt:', prompt);
    console.log('[ImageGen] Config:', { width, height, enhancePrompt: shouldEnhance });
    
    // Build strategies based on enabled APIs
    const strategies = [];
    
    if (isApiEnabled('pollinations')) {
        // Try 1: Pollinations with enhanced prompt
        strategies.push({ 
            name: 'Pollinations (Enhanced)', 
            fn: () => generateWithPollinations(prompt, { width, height, enhancePrompt: true }) 
        });
        
        // Try 2: Pollinations with simpler prompt (after delay)
        strategies.push({ 
            name: 'Pollinations (Simple)', 
            fn: () => generateWithPollinations(prompt, { width, height, enhancePrompt: false }) 
        });
        
        // Try 3: Pollinations with smaller size (faster)
        strategies.push({ 
            name: 'Pollinations (Fast)', 
            fn: () => generateWithPollinations(prompt, { width: 384, height: 384, enhancePrompt: false }) 
        });
    }
    
    if (isApiEnabled('huggingface')) {
        // Try 4: HuggingFace backup
        strategies.push({ 
            name: 'HuggingFace Backup', 
            fn: () => generateWithHuggingFace(prompt, { width, height }) 
        });
    }
    
    if (strategies.length === 0) {
        throw new Error('No AI services are enabled in configuration');
    }
    
    let lastError: Error | null = null;
    const delays = AI_CONFIG.retry.delays;
    
    for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        
        try {
            // Add delay between attempts (except first)
            if (i > 0 && delays[i - 1]) {
                const delay = delays[i - 1];
                console.log(`[ImageGen] Waiting ${delay}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            console.log(`[ImageGen] Attempt ${i + 1}/${strategies.length}: ${strategy.name}`);
            
            const result = await strategy.fn();
            
            console.log(`[ImageGen] ✅ Success with ${strategy.name}`);
            return result;
            
        } catch (error) {
            lastError = error as Error;
            console.warn(`[ImageGen] ❌ ${strategy.name} failed:`, error);
            
            // Continue to next strategy
            continue;
        }
    }
    
    // All strategies failed
    console.error('[ImageGen] ❌ All generation methods failed');
    throw lastError || new Error('All AI services are currently unavailable. Please try again later.');
}
