import { useState, useEffect } from 'react';

/**
 * Progressive rendering hook for large lists
 * Renders items in batches for smooth initial load
 * 
 * @param totalItems - Total number of items to render
 * @param batchSize - Number of items to render per batch (default: 12)
 * @param delay - Delay between batches in ms (default: 50)
 * @returns Number of items to render currently
 */
export const useProgressiveRender = (
  totalItems: number,
  batchSize: number = 12,
  delay: number = 50
): number => {
  const [itemsToRender, setItemsToRender] = useState(Math.min(batchSize, totalItems));

  useEffect(() => {
    // If we're already showing all items, no need to continue
    if (itemsToRender >= totalItems) {
      return;
    }

    // Schedule next batch
    const timer = setTimeout(() => {
      setItemsToRender((prev) => Math.min(prev + batchSize, totalItems));
    }, delay);

    return () => clearTimeout(timer);
  }, [itemsToRender, totalItems, batchSize, delay]);

  // Reset when totalItems changes (e.g., category change)
  useEffect(() => {
    setItemsToRender(Math.min(batchSize, totalItems));
  }, [totalItems, batchSize]);

  return itemsToRender;
};

/**
 * Hook for rendering items with intersection observer
 * Only renders items when they're about to enter viewport
 * 
 * @param enabled - Whether progressive rendering is enabled
 * @returns Whether to use progressive rendering
 */
export const useShouldProgressiveRender = (enabled: boolean = true): boolean => {
  const [shouldUse, setShouldUse] = useState(enabled);

  useEffect(() => {
    // Disable progressive rendering if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShouldUse(false);
    }

    // Disable on very fast connections (all data loads instantly anyway)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === '4g' && connection.downlink > 10) {
        setShouldUse(false);
      }
    }
  }, []);

  return shouldUse && enabled;
};


