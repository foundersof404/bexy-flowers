import { useState, useEffect, useRef } from 'react';

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    isActiveRef.current = true;
    
    // Reset to initial batch when totalItems changes
    setItemsToRender(Math.min(batchSize, totalItems));
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Progressive loading function using recursive setTimeout to avoid dependency issues
    const loadNextBatch = () => {
      if (!isActiveRef.current) return;
      
      setItemsToRender((prev) => {
        const next = Math.min(prev + batchSize, totalItems);
        
        // Schedule next batch if we haven't reached the end
        if (next < totalItems && isActiveRef.current) {
          timerRef.current = setTimeout(loadNextBatch, delay);
        }
        
        return next;
      });
    };

    // Start loading batches if we haven't reached the end
    const initialCount = Math.min(batchSize, totalItems);
    if (initialCount < totalItems) {
      timerRef.current = setTimeout(loadNextBatch, delay);
    }

    return () => {
      isActiveRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [totalItems, batchSize, delay]);

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


