import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;

export const useSmoothScroll = () => {
  useEffect(() => {
    // Auto scroll disabled - using native browser scrolling
    // Lenis smooth scroll has been removed
    return;
  }, []);

  return null;
};

export const scrollTo = (target: string | number, options?: any) => {
  if (lenis) {
    lenis.scrollTo(target, options);
  }
};