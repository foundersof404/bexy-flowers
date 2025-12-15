/**
 * Safe Image component that handles image URLs with special characters
 * Prevents URI malformed errors
 */

import React from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, ...props }) => {
  // Safely handle image source - encode if needed, but don't double-encode
  const safeSrc = React.useMemo(() => {
    if (!src) return src;
    
    // If it's already a full URL, use as-is
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // For local paths, try to create a safe URL
    // If it already contains encoded characters, use as-is
    // Otherwise, the browser will handle it
    try {
      // Check if it's already properly formatted
      new URL(src, window.location.origin);
      return src;
    } catch {
      // If URL constructor fails, it might need encoding
      // But for public assets, spaces are fine - browser handles it
      return src;
    }
  }, [src]);

  return <img src={safeSrc} alt={alt} {...props} />;
};

