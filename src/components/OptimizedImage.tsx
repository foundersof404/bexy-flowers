import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lqip?: string;
}

const OptimizedImage = ({ src, lqip, alt = "", className = "", ...rest }: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <div className={`relative ${className}`.trim()}>
      {/* LQIP layer */}
      {lqip && (
        <img
          src={lqip}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
        />
      )}
      {/* Final image with fade-in */}
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full h-full object-cover"
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;


