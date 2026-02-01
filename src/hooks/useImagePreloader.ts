import { useEffect, useState, useRef } from 'react';

interface PreloadOptions {
  priority?: boolean;
  onProgress?: (loaded: number, total: number) => void;
}

/**
 * Hook to preload multiple images
 * Useful for preloading images before showing a gallery or carousel
 * CRITICAL: options stored in ref to avoid effect re-running every render (was causing page freeze)
 */
export const useImagePreloader = (imageUrls: string[], options: PreloadOptions = {}) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const imageElements: HTMLImageElement[] = [];
    let loaded = 0;
    const opts = optionsRef.current;

    const handleImageLoad = () => {
      if (!mounted) return;
      loaded++;
      setLoadedCount(loaded);
      opts.onProgress?.(loaded, imageUrls.length);

      if (loaded === imageUrls.length) {
        setIsLoading(false);
      }
    };

    const handleImageError = (url: string) => {
      if (!mounted) return;
      loaded++;
      setLoadedCount(loaded);
      setErrors((prev) => [...prev, url]);
      opts.onProgress?.(loaded, imageUrls.length);

      if (loaded === imageUrls.length) {
        setIsLoading(false);
      }
    };

    // Filter out invalid URLs first
    const validUrls = imageUrls.filter(url => url && url.trim() !== '');
    
    if (validUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    // Load images sequentially to prevent overwhelming the browser
    let currentIndex = 0;
    const maxConcurrent = 2; // Load max 2 images at once
    let activeLoads = 0;

    const loadNextBatch = () => {
      if (!mounted || currentIndex >= validUrls.length) {
        return;
      }

      // Load next batch if we have capacity
      while (activeLoads < maxConcurrent && currentIndex < validUrls.length) {
        const url = validUrls[currentIndex++];
        activeLoads++;

        const img = new Image();
        
        // Set timeout to handle hanging requests (reduced to 5s)
        const timeout = setTimeout(() => {
          if (!img.complete && mounted) {
            activeLoads--;
            handleImageError(url);
            // Continue loading next batch
            loadNextBatch();
          }
        }, 5000); // 5 second timeout
        
        img.onload = () => {
          clearTimeout(timeout);
          if (!mounted) return;
          activeLoads--;
          handleImageLoad();
          // Continue loading next batch
          loadNextBatch();
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          if (!mounted) return;
          activeLoads--;
          handleImageError(url);
          // Continue loading next batch
          loadNextBatch();
        };
        
        // Set src to start loading
        try {
          img.src = url;
          imageElements.push(img);
        } catch (error) {
          clearTimeout(timeout);
          activeLoads--;
          handleImageError(url);
          loadNextBatch();
        }
      }
    };

    // Start loading first batch
    loadNextBatch();

    return () => {
      mounted = false;
      // Clean up image elements
      imageElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
    // CRITICAL: Only depend on imageUrls. options in ref - avoids effect thrash every render (page freeze)
  }, [imageUrls]);

  return {
    isLoading,
    loadedCount,
    totalCount: imageUrls.length,
    progress: imageUrls.length > 0 ? (loadedCount / imageUrls.length) * 100 : 0,
    errors,
    hasErrors: errors.length > 0,
  };
};

/**
 * Hook to preload a single image
 */
export const useImageLoader = (imageUrl: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
    };
    
    img.onerror = () => {
      setIsLoaded(false);
      setHasError(true);
    };

    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return { isLoaded, hasError };
};

export default useImagePreloader;





































