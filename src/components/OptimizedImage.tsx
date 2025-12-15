import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // For above-the-fold images
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  blurDataURL?: string; // Optional blur placeholder
  onLoadComplete?: () => void;
  sizes?: string; // ⚡ Responsive image sizes for optimal loading
}

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Progressive loading with blur placeholder
 * - Lazy loading with intersection observer
 * - Automatic aspect ratio handling
 * - Loading state with skeleton
 * - Error handling with fallback
 * - Memory efficient
 */
export const OptimizedImage = ({
  src,
  alt,
  className = '',
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  blurDataURL,
  onLoadComplete,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', // ⚡ Default responsive sizes
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(priority); // Priority images load immediately
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading - observe container instead of image
  useEffect(() => {
    if (priority || !containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setImageSrc(src);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before image enters viewport for better UX
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority]);

  // Preload image
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    
    img.onload = () => {
      setIsLoading(false);
      onLoadComplete?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, onLoadComplete]);

  // Fallback image for errors
  const fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage unavailable%3C/text%3E%3C/svg%3E';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspectRatio || 'auto' }}
    >
      {/* Blur placeholder or skeleton */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Blur placeholder if provided */}
      {blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Main image - always render but control visibility */}
      <motion.img
        ref={imgRef}
        src={hasError ? fallbackSrc : (isInView ? (imageSrc || src) : '')}
        alt={alt}
        className={`w-full h-full ${className}`}
        style={{
          objectFit,
          opacity: isLoading || !isInView ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          visibility: isInView ? 'visible' : 'hidden',
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        sizes={sizes}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading || !isInView ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      />

      {/* Loading indicator for priority images */}
      {priority && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton loader for card grids
 */
export const ImageSkeleton = ({ className = '', aspectRatio }: { className?: string; aspectRatio?: string }) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}
    style={{ aspectRatio: aspectRatio || 'auto' }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  </div>
);

export default OptimizedImage;
