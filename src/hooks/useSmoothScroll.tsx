import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const useSmoothScroll = () => {
  useEffect(() => {
    // CRITICAL: Disable Lenis smooth scroll on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Skip smooth scroll entirely on mobile - native scrolling is faster
      return;
    }

    // Initialize Lenis with heavy/strong smooth scroll settings (desktop only)
    lenis = new Lenis({
      duration: 1.2, // Longer duration for heavier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger for better performance
    lenis.on('scroll', ScrollTrigger.update);

    // Animation loop for Lenis
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

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
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return lenis;
};

export const scrollTo = (target: string | number, options?: any) => {
  if (lenis) {
    lenis.scrollTo(target, options);
  }
};