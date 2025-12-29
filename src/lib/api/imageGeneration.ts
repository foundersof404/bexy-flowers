/**
 * AI Image Generation Service
 * 
 * Uses Pollinations AI API for image generation.
 */

const POLLINATIONS_BASE_URL = 'https://image.pollinations.ai';

interface GenerationOptions {
    width?: number;
    height?: number;
}

interface GenerationResult {
    imageUrl: string;
    source: 'pollinations';
}

/**
 * Generate image using Pollinations API
 * Uses fetch-first approach to avoid CORS issues
 */
export async function generateBouquetImage(
    prompt: string,
    options: GenerationOptions = {}
): Promise<GenerationResult> {
    const { width = 512, height = 512 } = options;

    // Step 1: URL-encode the prompt (spaces → %20, commas → %2C, etc.)
    const encodedPrompt = encodeURIComponent(prompt);

    // Step 2: Construct the Pollinations API URL (minimal params to avoid 500 errors)
    const pollinationsUrl = `${POLLINATIONS_BASE_URL}/prompt/${encodedPrompt}?width=${width}&height=${height}`;

    console.log('[ImageGen] Pollinations URL:', pollinationsUrl);

    // Option A: Retry with delay if Pollinations fails
    let lastError: Error | null = null;
    const maxRetries = 3;
    const retryDelays = [1000, 3000, 5000]; // 1s, 3s, 5s

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                const delay = retryDelays[attempt - 1];
                console.log(`[ImageGen] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.log('[ImageGen] Fetching image blob...');
            }

            const response = await fetch(pollinationsUrl);

            if (!response.ok) {
                // If 500 error and we have retries left, continue to retry
                if (response.status >= 500 && attempt < maxRetries - 1) {
                    console.log(`[ImageGen] Got ${response.status} error, will retry...`);
                    lastError = new Error(`Pollinations returned ${response.status}: ${response.statusText}`);
                    continue;
                }
                throw new Error(`Pollinations returned ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const localUrl = URL.createObjectURL(blob);

            console.log('[ImageGen] Image loaded successfully as blob');
            return { imageUrl: localUrl, source: 'pollinations' };

        } catch (error) {
            lastError = error as Error;
            if (attempt === maxRetries - 1) {
                // Last attempt failed, throw error
                throw lastError;
            }
        }
    }

    throw lastError || new Error('Pollinations API failed after retries');
}
