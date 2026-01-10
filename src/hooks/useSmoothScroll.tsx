import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Module-level instance for scrollTo function (only used if hook is mounted)
let globalLenis: Lenis | null = null;

export const useSmoothScroll = () => {
  const rafIdRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    // ⚡ PERFORMANCE: Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });

    // Initialize Lenis with heavy/strong smooth scroll settings
    const lenis = new Lenis({
      duration: 1.2, // Longer duration for heavier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    globalLenis = lenis; // Set global for scrollTo function
    isActiveRef.current = true; // Reset active flag

    // ⚡ PERFORMANCE: Throttle ScrollTrigger updates to reduce frame drops
    let lastUpdate = 0;
    const updateScrollTrigger = () => {
      const now = performance.now();
      if (now - lastUpdate >= 16) { // ~60fps
        ScrollTrigger.update();
        lastUpdate = now;
      }
    };

    // Integrate Lenis with GSAP ScrollTrigger for better performance
    lenis.on('scroll', updateScrollTrigger);

    // Animation loop for Lenis - with proper cleanup checks and visibility handling
    function raf(time: number) {
      if (!isActiveRef.current || !lenisRef.current) {
        // Stop if component unmounted or lenis destroyed
        rafIdRef.current = null;
        return;
      }
      
      // Pause animation when page is hidden to save resources
      if (document.hidden) {
        rafIdRef.current = requestAnimationFrame(raf);
        return;
      }
      
      try {
        lenisRef.current.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      } catch (error) {
        console.error('Lenis RAF error:', error);
        rafIdRef.current = null;
        isActiveRef.current = false;
      }
    }

    rafIdRef.current = requestAnimationFrame(raf);
    
    // Handle visibility change to pause/resume animations
    const handleVisibilityChange = () => {
      if (document.hidden && lenisRef.current) {
        // Pause smooth scrolling when page is hidden
        lenisRef.current.stop();
      } else if (!document.hidden && lenisRef.current && isActiveRef.current) {
        // Resume when page becomes visible
        lenisRef.current.start();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update ScrollTrigger when Lenis scrolls
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && lenisRef.current) {
          lenisRef.current.scrollTo(value, { immediate: true });
        }
        return lenisRef.current?.scroll || 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    return () => {
      isActiveRef.current = false; // Stop the RAF loop
      
      // Remove visibility change listener
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      // Remove scroll listener before destroying
      if (lenisRef.current) {
        try {
          lenisRef.current.off('scroll', updateScrollTrigger);
          lenisRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Lenis:', error);
        }
        lenisRef.current = null;
      }
      
      if (globalLenis === lenis) {
        globalLenis = null;
      }
      
      // Clean up ScrollTrigger proxy
      try {
        ScrollTrigger.scrollerProxy(document.body, null);
      } catch (error) {
        // Ignore if already cleaned up
      }
    };
  }, []);

  return lenisRef.current;
};

export const scrollTo = (target: string | number, options?: any) => {
  if (globalLenis) {
    globalLenis.scrollTo(target, options);
  }
};