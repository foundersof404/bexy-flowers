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

    // DO NOT initialize Lenis - it causes infinite loops
    // const lenis = new Lenis({ ... });
    
    isActiveRef.current = false; // Mark as inactive
    
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
  // Lenis is disabled, use native scroll
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
  } else if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    }
  }
};
