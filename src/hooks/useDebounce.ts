/**
 * Debounce Hook for Performance
 * 
 * Delays execution of a function until after a specified delay
 * Useful for search inputs, filters, and API calls
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced value
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounced callback hook
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced callback
 */
import { useCallback, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );

  return debouncedCallback;
}
