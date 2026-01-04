import { useEffect, useState } from 'react';

interface PreloadOptions {
  priority?: boolean;
  onProgress?: (loaded: number, total: number) => void;
}

/**
 * Hook to preload multiple images
 * Useful for preloading images before showing a gallery or carousel
 */
export const useImagePreloader = (imageUrls: string[], options: PreloadOptions = {}) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const imageElements: HTMLImageElement[] = [];
    let loaded = 0;

    const handleImageLoad = () => {
      if (!mounted) return;
      loaded++;
      setLoadedCount(loaded);
      options.onProgress?.(loaded, imageUrls.length);

      if (loaded === imageUrls.length) {
        setIsLoading(false);
      }
    };

    const handleImageError = (url: string) => {
      if (!mounted) return;
      loaded++;
      setLoadedCount(loaded);
      setErrors((prev) => [...prev, url]);
      options.onProgress?.(loaded, imageUrls.length);

      if (loaded === imageUrls.length) {
        setIsLoading(false);
      }
    };

    // Start preloading
    imageUrls.forEach((url) => {
      const img = new Image();
      
      img.onload = handleImageLoad;
      img.onerror = () => handleImageError(url);
      
      // Set src to start loading
      img.src = url;
      imageElements.push(img);
    });

    return () => {
      mounted = false;
      // Clean up image elements
      imageElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [imageUrls, options]);

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





































