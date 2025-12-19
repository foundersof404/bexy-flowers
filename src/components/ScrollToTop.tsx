import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    // Force scroll to top immediately on route change
    const scrollToTop = () => {
      // Multiple methods to ensure it works across all browsers
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
      
      // Also try scrolling the window directly
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    // Execute immediately
    scrollToTop();

    // Execute again on next frame to catch any delayed renders
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
      // One more time after a tiny delay to ensure it sticks
      setTimeout(scrollToTop, 0);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, search, hash]);

  // Additional useEffect as fallback for slower route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;


