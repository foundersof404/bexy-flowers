import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const useSmoothScroll = () => {
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // ⚡ PERFORMANCE: Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });

    // Initialize Lenis with heavy/strong smooth scroll settings
    lenis = new Lenis({
      duration: 1.2, // Longer duration for heavier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
    });

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

    // Animation loop for Lenis
    function raf(time: number) {
      lenis?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Update ScrollTrigger when Lenis scrolls
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis?.scrollTo(value, { immediate: true });
        }
        return lenis?.scroll || 0;
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
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      // Don't kill all ScrollTriggers here as they're managed by components
      // ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return lenis;
};

export const scrollTo = (target: string | number, options?: any) => {
  if (lenis) {
    lenis.scrollTo(target, options);
  }
};