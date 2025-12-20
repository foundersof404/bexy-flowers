import React, { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  className?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  rootMargin = "200px 0px",
  threshold = 0,
  once = true,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // CRITICAL: Detect mobile and always render on mobile (bypass IntersectionObserver)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // CRITICAL: On mobile, always show content immediately (no lazy loading)
  useEffect(() => {
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    if (!ref.current) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!cancelled) setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          if (!cancelled) setIsVisible(false);
        }
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [rootMargin, threshold, once, isMobile]);

  // CRITICAL: Always render on mobile, lazy load on desktop
  return <div ref={ref} className={className}>{isVisible || isMobile ? children : null}</div>;
};

export default LazySection;


