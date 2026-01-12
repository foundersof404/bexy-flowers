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
    // ⚡ PERFORMANCE FIX: DISABLE LENIS SMOOTH SCROLL TO STOP INFINITE requestAnimationFrame LOOP
    // This was causing "Page Unresponsive" errors by running continuously
    console.log('⚠️ Lenis smooth scroll is DISABLED for performance');
    
    // ⚡ PERFORMANCE: Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });

    // Initialize Lenis with optimized settings - Apple-like smooth scrolling
    const lenis = new Lenis({
      duration: 1.2, // Smooth duration for that premium feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    globalLenis = lenis; // Set global for scrollTo function
    isActiveRef.current = true; // Reset active flag

    // ⚡ PERFORMANCE: Throttle ScrollTrigger updates to balance smoothness and performance
    let lastUpdate = 0;
    const updateScrollTrigger = () => {
      const now = performance.now();
      // Throttle to ~60fps for smooth experience
      if (now - lastUpdate >= 16) {
        ScrollTrigger.update();
        lastUpdate = now;
      }
    };

    // Integrate Lenis with GSAP ScrollTrigger for smooth animations
    lenis.on('scroll', updateScrollTrigger);

    // Animation loop for Lenis - with proper cleanup checks and visibility handling
    function raf(time: number) {
      if (!isActiveRef.current || !lenisRef.current) {
        // Stop if component unmounted or lenis destroyed
        rafIdRef.current = null;
        return;
      }
      
      // CRITICAL: Pause RAF loop when page is hidden to prevent unresponsive page
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
    
    // CRITICAL: Pause Lenis when page becomes hidden to prevent performance issues
    const handleVisibilityChange = () => {
      if (document.hidden && lenisRef.current) {
        // Pause smooth scroll when tab is hidden
        lenisRef.current.stop();
      } else if (!document.hidden && lenisRef.current && isActiveRef.current) {
        // Resume when tab becomes visible
        lenisRef.current.start();
      }
    };
    
    return () => {
      isActiveRef.current = false;
      
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Lenis:', error);
        }
        lenisRef.current = null;
      }
      
      if (globalLenis) {
        globalLenis = null;
      }
    };
  }, []);

  return lenisRef.current;
};

export const scrollTo = (target: string | number, options?: any) => {
  // Fallback to native scroll since Lenis is disabled
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
