import { motion, MotionProps } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Optimized motion.div that automatically disables whileInView on mobile
 * Use this instead of motion.div for scroll-based animations
 */
export const OptimizedMotionDiv = ({ 
  children, 
  whileInView,
  viewport,
  initial,
  ...rest 
}: MotionProps & { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={isMobile ? {} : initial}
      whileInView={isMobile ? {} : whileInView}
      viewport={isMobile ? undefined : viewport}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

