import { useEffect, useLayoutEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  // Enhanced scroll reset function with multiple fallbacks
  const resetScrollPosition = useCallback(() => {
    try {
      // Method 1: Modern scroll API
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      // Method 2: Direct property setting (fallback)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Method 3: Scroll the viewport element (Safari fallback)
      const viewport = document.scrollingElement || document.documentElement;
      if (viewport) {
        viewport.scrollTop = 0;
      }

      // Method 4: Reset any custom scrollable containers
      const scrollableElements = document.querySelectorAll('[data-scroll-container]');
      scrollableElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.scrollTop = 0;
          el.scrollLeft = 0;
        }
      });

      // Method 5: Force scroll for stubborn cases
      if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0) {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      // Silent fail - scroll behavior is not critical
      console.warn('Scroll reset failed:', error);
    }
  }, []);

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const original = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = original;
      };
    }
  }, []);

  // Reset scroll position on every route change
  useLayoutEffect(() => {
    // Immediate reset
    resetScrollPosition();

    // Double-check after layout (for SPA routing)
    const rafId = requestAnimationFrame(() => {
      resetScrollPosition();
    });

    // Triple-check after animations complete
    const timeoutId = setTimeout(() => {
      resetScrollPosition();
    }, 100);
    
    // Additional check after page fully loads
    const loadTimeoutId = setTimeout(() => {
      resetScrollPosition();
    }, 300);
    
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      clearTimeout(loadTimeoutId);
    };
  }, [pathname, search, hash, resetScrollPosition]);

  // Also handle browser back/forward navigation
  useEffect(() => {
    let popStateTimeoutId: NodeJS.Timeout | null = null;
    const handlePopState = () => {
      // Clear any pending timeout to prevent accumulation
      if (popStateTimeoutId) {
        clearTimeout(popStateTimeoutId);
      }
      // Small delay to ensure the DOM is ready
      popStateTimeoutId = setTimeout(() => {
        resetScrollPosition();
        popStateTimeoutId = null;
      }, 10);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (popStateTimeoutId) {
        clearTimeout(popStateTimeoutId);
      }
    };
  }, [resetScrollPosition]);

  return null;
};

export default ScrollToTop;


