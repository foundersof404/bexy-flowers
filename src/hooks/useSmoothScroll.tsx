import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;

export const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize Lenis
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return lenis;
};

export const scrollTo = (target: string | number, options?: any) => {
  if (lenis) {
    lenis.scrollTo(target, options);
  }
};