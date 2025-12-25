import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const original = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = original;
      };
    }
  }, []);

  useLayoutEffect(() => {
    // Always jump to top on route changes (robust version)
    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also reset scroll position for any scrollable containers
      const scrollableElements = document.querySelectorAll('[data-scroll-container]');
      scrollableElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.scrollTop = 0;
        }
      });
    };
    
    // Run immediately
    reset();
    
    // Run again on next frame to beat layout/animations
    const rafId = requestAnimationFrame(reset);
    
    // Also run after a short delay to ensure it sticks
    const timeoutId = setTimeout(reset, 50);
    
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;


