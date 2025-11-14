import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;

export const useSmoothScroll = () => {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    
    // Disable Lenis on mobile or reduced motion for better performance
    if (prefersReducedMotion || isMobile) {
      return;
    }

    // Initialize Lenis with optimized settings for better performance
    lenis = new Lenis({
      duration: 1.0, // Reduced from 1.2 for snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5, // Reduced from 2 for better mobile feel
      infinite: false,
      syncTouch: true, // Better touch handling
      syncTouchLerp: 0.075, // Smooth touch sync
      wheelMultiplier: 0.8, // Slightly slower wheel for better control
      smoothWheel: true,
    });

    // Optimized animation frame - removed throttling as it was causing lag
    let rafId: number;

    function raf(time: number) {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger - throttled for better performance
    let scrollUpdatePending = false;
    lenis.on('scroll', () => {
      if (!scrollUpdatePending && typeof window !== 'undefined' && (window as any).ScrollTrigger) {
        scrollUpdatePending = true;
        requestAnimationFrame(() => {
          (window as any).ScrollTrigger.update();
          scrollUpdatePending = false;
        });
      }
    });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
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