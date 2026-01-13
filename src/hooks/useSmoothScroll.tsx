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
    // 🔴 CRITICAL FIX: DISABLE Lenis smooth scroll to prevent infinite RAF loop
    // The requestAnimationFrame loop was running 60fps continuously causing crashes
    // Fallback to native smooth scroll instead
    
    console.log('⚠️ Lenis smooth scroll DISABLED for performance - using native smooth scroll');
    
    // ⚡ PERFORMANCE: Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });

    // DISABLED: Lenis initialization
    // const lenis = new Lenis({ ... });
    // This was causing infinite requestAnimationFrame loop
    
    lenisRef.current = null;
    globalLenis = null;
    isActiveRef.current = false;

    // DISABLED: RAF loop
    // function raf(time: number) { ... }
    // This was the main cause of crashes - ran 60fps forever


    return () => {
      isActiveRef.current = false;
      
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  return lenisRef.current;
};

// Fallback to native smooth scroll
export const scrollTo = (target: string | number, options?: any) => {
  // Use native smooth scroll instead of Lenis
  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', ...options });
    }
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth', ...options });
  }
};