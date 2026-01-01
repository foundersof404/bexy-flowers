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
 * Detect error pages by analyzing image content
 * Error pages typically have:
 * - Pixelated/retro style (low color variance)
 * - Brown/beige color scheme
 * - QR codes (high contrast square patterns)
 * - Specific dimensions/aspect ratios
 * - Dark green backgrounds (new error pages)
 */
async function detectErrorPage(img: HTMLImageElement): Promise<boolean> {
    try {
        // Create canvas to analyze image - use larger sample for better detection
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.width, 400); // Larger sample for better detection
        canvas.height = Math.min(img.height, 400);
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Analyze color distribution
        let brownCount = 0;
        let darkGreenCount = 0; // New error pages have dark green
        let pixelatedScore = 0;
        let lowVarianceCount = 0;
        let totalPixels = canvas.width * canvas.height;
        let sampledPixels = 0;
        
        // Sample more pixels for better detection
        for (let i = 0; i < data.length; i += 8) { // Sample every 2nd pixel (RGBA = 4 bytes)
            sampledPixels++;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Check for brown/beige colors (typical of old error pages)
            // Brown: R > G, G > B, but not too dark
            if (r > 80 && r > g && g > b && r - g < 60 && g - b < 40) {
                brownCount++;
            }
            
            // Check for dark green colors (new error pages have dark green background)
            // Dark green: G > R, G > B, but dark overall
            if (g > r && g > b && r < 100 && b < 100 && g < 150) {
                darkGreenCount++;
            }
            
            // Check for pixelated style (low color variance in nearby pixels)
            if (i + 8 < data.length) {
                const r2 = data[i + 8];
                const g2 = data[i + 9];
                const b2 = data[i + 10];
                const variance = Math.abs(r - r2) + Math.abs(g - g2) + Math.abs(b - b2);
                if (variance < 25) { // Low variance = pixelated
                    pixelatedScore++;
                }
                if (variance < 15) { // Very low variance
                    lowVarianceCount++;
                }
            }
        }
        
        const brownRatio = brownCount / sampledPixels;
        const darkGreenRatio = darkGreenCount / sampledPixels;
        const pixelatedRatio = pixelatedScore / sampledPixels;
        const lowVarianceRatio = lowVarianceCount / sampledPixels;
        
        // Error pages typically have:
        // - High brown ratio (>10%) OR high dark green ratio (>15%)
        // - High pixelated score (>15%)
        // - Very low variance in many areas (>10%)
        // - Specific aspect ratios (often square-ish: 1040x1024 is suspicious)
        
        // Check for suspicious dimensions (error pages are often square-ish)
        const aspectRatio = img.width / img.height;
        const isSquareish = aspectRatio > 0.95 && aspectRatio < 1.05;
        // ONLY flag the exact known error page dimensions
        const isSuspiciousSize = (img.width === 1040 && img.height === 1024);
        
        // LESS AGGRESSIVE detection - AI images can have smooth areas and brown tones
        // Only flag if we have BOTH error colors AND suspicious dimensions
        // OR if we have EXTREME pixelation (>50%) with error colors
        const hasErrorColors = brownRatio > 0.15 || darkGreenRatio > 0.20; // Increased thresholds
        const hasExtremePixelation = pixelatedRatio > 0.50 || lowVarianceRatio > 0.40; // Much higher thresholds
        const hasModeratePixelation = pixelatedRatio > 0.25 || lowVarianceRatio > 0.20;
        const hasSuspiciousDimensions = isSquareish && isSuspiciousSize;
        
        // Only flag as error page if:
        // 1. Has suspicious dimensions (1040x1024) AND (error colors OR moderate pixelation)
        // 2. Has extreme pixelation (>50%) AND error colors (very unlikely for real images)
        // This prevents false positives on legitimate AI-generated images
        const isLikelyErrorPage = (hasSuspiciousDimensions && (hasErrorColors || hasModeratePixelation)) ||
                                   (hasExtremePixelation && hasErrorColors);
        
        if (isLikelyErrorPage) {
            console.warn(`[ImageGen] ⚠️ Error page detected:`, {
                brown: `${(brownRatio * 100).toFixed(1)}%`,
                darkGreen: `${(darkGreenRatio * 100).toFixed(1)}%`,
                pixelated: `${(pixelatedRatio * 100).toFixed(1)}%`,
                lowVariance: `${(lowVarianceRatio * 100).toFixed(1)}%`,
                dimensions: `${img.width}x${img.height}`,
                aspectRatio: aspectRatio.toFixed(2)
            });
        }
        
        return isLikelyErrorPage;
    } catch (error) {
        console.warn('[ImageGen] Error during error page detection:', error);
        // If detection fails, don't block - let it through
        return false;
    }
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
    
    // NEW POLLINATIONS API (2025)
    // Documentation: https://gen.pollinations.ai
    // Endpoint: https://gen.pollinations.ai/image/{prompt}?key=API_KEY&model=turbo&width=512&height=512
    // Authentication: Use ?key=YOUR_API_KEY query parameter (works with IMG tag, no CORS issues)
    const endpointVariations = [
        {
            baseUrl: 'https://gen.pollinations.ai/image', // New API gateway
            useEnhance: false, // New API format - simplified parameters
            useNoinit: false,
            usePrivate: false,
        },
    ];
    
    // Log API key usage if available
    const apiKey = AI_CONFIG.apis.pollinations.apiKey;
    if (apiKey) {
        console.log('[ImageGen] 🔑 Using Pollinations API key for priority access');
        console.log('[ImageGen] API Key:', apiKey.substring(0, 10) + '...');
    } else {
        console.log('[ImageGen] ⚠️ No API key configured - using free tier');
    }
    
    console.log('[ImageGen] Pollinations attempt with enhanced prompt');
    
    // Try each endpoint variation until one works
    let lastError: Error | null = null;
    for (let i = 0; i < endpointVariations.length; i++) {
        const variation = endpointVariations[i];
        try {
            // Build URL with this variation's parameters
            const pollinationsUrl = buildPollinationsUrlWithVariation(
                cleanedPrompt, 
                width, 
                height, 
                negativePrompt,
                variation
            );
            
            console.log(`[ImageGen] Trying variation ${i + 1}/${endpointVariations.length}: ${variation.baseUrl}`);
            console.log('[ImageGen] URL:', pollinationsUrl.substring(0, 150) + '...');
            
            const result = await tryLoadImageFromUrl(pollinationsUrl);
            
            // CRITICAL: Hardcoded check for known error page dimensions FIRST
            // The "WE HAVE MOVED" error page is exactly 1040x1024 with size ~2.1MB
            if (result.img.width === 1040 && result.img.height === 1024) {
                // Check file size - error pages at this resolution are typically 2-2.5MB
                const sizeKB = result.blob.size / 1024;
                if (sizeKB > 2000 && sizeKB < 2500) {
                    console.warn(`[ImageGen] ⚠️ ERROR PAGE DETECTED: Exact error page dimensions (1040x1024) and size (${sizeKB.toFixed(1)}KB)`);
                    console.warn(`[ImageGen] ⚠️ This is the "WE HAVE MOVED" error page - rejecting and trying next variation...`);
                    lastError = new Error('Error page detected - "WE HAVE MOVED" page (1040x1024)');
                    continue; // Try next variation
                }
            }
            
            // Content-based detection (LESS AGGRESSIVE - only flags obvious error pages)
            // Only reject if dimensions match known error page AND content analysis confirms it
            // For other dimensions, be lenient to avoid false positives on legitimate AI images
            const isErrorPage = await detectErrorPage(result.img);
            if (isErrorPage) {
                // Only reject if we have the exact error page dimensions
                // Otherwise, it might be a false positive (AI images can have smooth areas)
                if (result.img.width === 1040 && result.img.height === 1024) {
                    console.warn(`[ImageGen] ⚠️ Error page detected by content analysis AND dimensions match`);
                    console.warn(`[ImageGen] ⚠️ Rejecting and trying next variation...`);
                    lastError = new Error('Error page detected - "WE HAVE MOVED" or similar');
                    continue; // Try next variation
                } else {
                    // Different dimensions - likely a false positive, allow it through
                    console.warn(`[ImageGen] ⚠️ Content analysis flagged possible error page, but dimensions (${result.img.width}x${result.img.height}) don't match known error page`);
                    console.warn(`[ImageGen] ⚠️ Allowing image through - likely a false positive`);
                }
            }
            
            // Success! Return the blob
            return await processValidImage(result.img, result.blob);
            
        } catch (error) {
            console.warn(`[ImageGen] ⚠️ Variation ${i + 1} failed:`, error);
            lastError = error as Error;
            continue; // Try next variation
        }
    }
    
    // All variations failed - Pollinations API appears to be down or changed
    const errorMessage = 'Pollinations API is currently unavailable. The service has moved to a new system. ' +
        'Please visit https://enter.pollinations.ai to sign up for the new API, or try again later.';
    console.error('[ImageGen] ❌ All Pollinations variations failed');
    console.error('[ImageGen] 💡 Suggestion: The API may require authentication through the new system');
    throw new Error(errorMessage);
}

/**
 * Build Pollinations URL with specific variation parameters
 */
function buildPollinationsUrlWithVariation(
    prompt: string,
    width: number,
    height: number,
    negative: string | undefined,
    variation: { baseUrl: string; useEnhance: boolean; useNoinit: boolean; usePrivate: boolean }
): string {
    const config = AI_CONFIG.apis.pollinations;
    
    // NEW API FORMAT: https://gen.pollinations.ai/image/{prompt}?key=API_KEY&model=turbo&width=512&height=512
    // Documentation: https://gen.pollinations.ai
    // Authentication: Use ?key=YOUR_API_KEY (publishable keys work in query param)
    
    // Build query parameters for new API (simplified - new API may not support all old params)
    const params = new URLSearchParams({
        model: config.params.model || 'turbo',
    });
    
    // Add dimensions if specified
    if (width) {
        params.append('width', width.toString());
    }
    if (height) {
        params.append('height', height.toString());
    }
    
    // CRITICAL: Add API key as query parameter (required for new API)
    // Format: ?key=pk_... (publishable key works in query param)
    if (config.apiKey) {
        params.append('key', config.apiKey);
    }
    
    // Note: New API may not support old parameters like:
    // - nologo, enhance, noinit, private, negative
    // These are omitted for now to ensure compatibility with new API
    
    const encodedPrompt = encodeURIComponent(prompt);
    
    // New API format: /image/{prompt}?key=API_KEY&model=turbo&width=512&height=512
    return `${variation.baseUrl}/${encodedPrompt}?${params.toString()}`;
}

/**
 * Helper to load image from URL
 */
function tryLoadImageFromUrl(url: string): Promise<{ img: HTMLImageElement; blob: Blob }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
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
                        resolve({ img, blob });
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
        
        img.src = url;
    });
}

/**
 * Process and validate a loaded image
 */
async function processValidImage(img: HTMLImageElement, blob: Blob): Promise<GenerationResult> {
    // Validate blob size
    const minSize = AI_CONFIG.validation.minImageSize;
    if (blob.size < minSize) {
        console.warn(`[ImageGen] ⚠️ Image too small: ${(blob.size / 1024).toFixed(1)}KB`);
        throw new Error(`Received error page or invalid image (size: ${(blob.size / 1024).toFixed(1)}KB)`);
    }
    
    // Validate dimensions
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
