import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FlyingHeartConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyingHeartAnimationProps {
  config: FlyingHeartConfig;
  onComplete: () => void;
}

const FlyingHeartAnimation = ({ config, onComplete }: FlyingHeartAnimationProps) => {
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none"
      initial={{
        x: config.startX - 12,
        y: config.startY - 12,
        scale: 0.5,
        opacity: 0.8,
        rotate: -45
      }}
      animate={{
        x: config.endX - 12,
        y: config.endY - 12,
        scale: [0.5, 1.2, 1, 0.8],
        opacity: [0.8, 1, 0.9, 0],
        rotate: [0, 15, -10, 0]
      }}
      exit={{
        scale: 0,
        opacity: 0
      }}
      transition={{
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
        times: [0, 0.3, 0.7, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        left: 0,
        top: 0
      }}
    >
      <Heart className="w-6 h-6 fill-[#dc267f] text-[#dc267f]" strokeWidth={2.5} />
      
      {/* Sparkle trail effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#dc267f]"
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          }}
          animate={{
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60,
            opacity: 0,
            scale: 0
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: "easeOut"
          }}
          style={{
            filter: 'blur(2px)'
          }}
        />
      ))}
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#dc267f] blur-md"
        initial={{ opacity: 0.6, scale: 1 }}
        animate={{ opacity: [0.6, 0.9, 0], scale: [1, 1.5, 2] }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

interface FlyingHeartContainerProps {
  flyingHearts: FlyingHeartConfig[];
  onComplete: (index: number) => void;
}

export const FlyingHeartContainer = ({ flyingHearts, onComplete }: FlyingHeartContainerProps) => {
  return (
    <AnimatePresence>
      {flyingHearts.map((config, index) => (
        <FlyingHeartAnimation
          key={`${config.startX}-${config.startY}-${Date.now()}-${index}`}
          config={config}
          onComplete={() => onComplete(index)}
        />
      ))}
    </AnimatePresence>
  );
};

