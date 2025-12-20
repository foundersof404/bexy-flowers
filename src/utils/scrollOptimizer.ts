/**
 * Mobile Scroll Optimizer
 * Disables expensive operations during scroll for better performance
 */

let isScrolling = false;
let scrollTimeout: NodeJS.Timeout | null = null;
let rafId: number | null = null;

export const initScrollOptimizer = () => {
  // Only run on mobile
  if (window.innerWidth >= 768) return;

  const handleScroll = () => {
    if (!isScrolling) {
      isScrolling = true;
      document.documentElement.classList.add('scrolling');
      document.body.classList.add('scrolling');
    }

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Remove scrolling class after scroll ends
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      document.documentElement.classList.remove('scrolling');
      document.body.classList.remove('scrolling');
    }, 150);

    // Use requestAnimationFrame for smooth updates
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      // Scroll handling logic here if needed
    });
  };

  // Throttled scroll listener
  let ticking = false;
  const optimizedScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', optimizedScroll, { passive: true });
  window.addEventListener('touchmove', optimizedScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', optimizedScroll);
    window.removeEventListener('touchmove', optimizedScroll);
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (rafId) cancelAnimationFrame(rafId);
  };
};

