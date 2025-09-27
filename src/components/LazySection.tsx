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

  useEffect(() => {
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
  }, [rootMargin, threshold, once]);

  return <div ref={ref} className={className}>{isVisible ? children : null}</div>;
};

export default LazySection;


