import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Always jump to top on route changes (robust version)
    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    // Run now and again on next frame to beat layout/animations
    reset();
    const id = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(id);
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;


