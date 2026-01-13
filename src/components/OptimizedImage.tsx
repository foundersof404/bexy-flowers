/**
 * Optimized Image Component
 * 
 * Features:
 * - Lazy loading with native browser lazy loading
 * - Responsive images with srcset
 * - Placeholder/skeleton while loading
 * - Error handling with fallback
 * - WebP format support
 * 
 * ⚡ PERFORMANCE FIX: Removed IntersectionObserver to prevent CPU issues
 * Using native browser lazy loading instead - much more efficient!
 */

import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  fallback?: string;
  priority?: boolean; // Load immediately (above the fold)
  sizes?: string; // For responsive images
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  fallback,
  priority = false,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate responsive srcset for WebP
  const generateSrcSet = (baseSrc: string): string => {
    if (!baseSrc || baseSrc.startsWith('data:') || baseSrc.startsWith('blob:')) {
      return '';
    }

    // If already has query params or is external, return as-is
    if (baseSrc.includes('?') || baseSrc.startsWith('http')) {
      return '';
    }

    // Generate different sizes for responsive images
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map((size) => {
        // Try WebP first, fallback to original
        const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return `${webpSrc}?w=${size} ${size}w`;
      })
      .join(', ');
  };

  const imageSrc = hasError && fallback ? fallback : src;
  const srcSet = generateSrcSet(imageSrc);

  return (
    <div
      className={`relative overflow-hidden ${className.includes('!w-full') ? 'w-full h-full' : className}`}
      style={{ width: width || '100%', height: height || '100%' }}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && placeholder && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"
          style={{ width, height }}
        />
      )}

      {/* Actual Image - Always render, let browser handle lazy loading */}
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 w-full h-full ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className.includes('object-cover') ? 'object-cover object-center' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Loading indicator */}
      {!isLoaded && !placeholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
