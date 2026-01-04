/**
 * Virtualized List Hook for Performance
 * 
 * Only renders items that are visible in the viewport + buffer
 * Significantly improves performance for large lists (100+ items)
 * 
 * @param items - Array of items to virtualize
 * @param itemHeight - Height of each item in pixels
 * @param containerRef - Ref to the scrollable container
 * @param overscan - Number of items to render outside viewport (default: 5)
 * @returns Visible items and container props
 */

import { useState, useEffect, useRef, useMemo } from 'react';

interface UseVirtualizedListOptions<T> {
  items: T[];
  itemHeight: number;
  containerRef: React.RefObject<HTMLElement>;
  overscan?: number;
  enabled?: boolean;
}

interface VirtualizedListResult<T> {
  visibleItems: Array<{ item: T; index: number }>;
  totalHeight: number;
  offsetY: number;
  startIndex: number;
  endIndex: number;
}

export function useVirtualizedList<T>({
  items,
  itemHeight,
  containerRef,
  overscan = 5,
  enabled = true,
}: UseVirtualizedListOptions<T>): VirtualizedListResult<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const rafRef = useRef<number>();

  // Calculate visible range
  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    if (!enabled || items.length === 0 || containerHeight === 0) {
      return {
        startIndex: 0,
        endIndex: items.length - 1,
        totalHeight: items.length * itemHeight,
        offsetY: 0,
      };
    }

    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
    
    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(items.length - 1, visibleEnd + overscan);
    
    return {
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items.length, itemHeight, scrollTop, containerHeight, overscan, enabled]);

  // Get visible items
  const visibleItems = useMemo(() => {
    if (!enabled) {
      return items.map((item, index) => ({ item, index }));
    }
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, startIndex, endIndex, enabled]);

  // Handle scroll with RAF for performance
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setScrollTop(container.scrollTop);
      });
    };

    // Set initial height
    setContainerHeight(container.clientHeight);
    setScrollTop(container.scrollTop);

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, containerRef]);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  };
}
