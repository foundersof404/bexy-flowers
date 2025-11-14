import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lqip?: string;
  priority?: boolean; // For above-the-fold images
}

const OptimizedImage = ({ src, lqip, alt = "", className = "", priority = false, ...rest }: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    
    // If image is already cached, set loaded immediately
    if (img.complete) {
      setLoaded(true);
    }
  }, [src]);

  // Skip animation for reduced motion
  const shouldAnimate = !shouldReduceMotion && !loaded;

  return (
    <div className={`relative ${className}`.trim()} style={{ willChange: shouldAnimate ? "contents" : "auto" }}>
      {/* LQIP layer - only on mobile or when provided */}
      {lqip && !priority && (
        <img
          src={lqip}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
          loading="eager"
          decoding="async"
        />
      )}
      {/* Final image with fade-in - optimized for performance */}
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        initial={{ opacity: shouldAnimate ? 0 : 1 }}
        animate={{ opacity: loaded || !shouldAnimate ? 1 : 0 }}
        transition={shouldAnimate ? { duration: 0.6, ease: "easeOut" } : { duration: 0 }}
        className="relative z-10 w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ 
          willChange: shouldAnimate ? "opacity" : "auto",
          transform: "translateZ(0)" // GPU acceleration
        }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;


