import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BreathingCardProps {
  children: React.ReactNode;
  className?: string;
  breathingIntensity?: 'subtle' | 'normal' | 'strong';
  glowColor?: 'gold' | 'platinum' | 'primary';
  delay?: number;
}

const BreathingCard: React.FC<BreathingCardProps> = ({
  children,
  className,
  breathingIntensity = 'normal',
  glowColor = 'gold',
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const intensityMap = {
    subtle: { scale: [1, 1.02], duration: 4 },
    normal: { scale: [1, 1.05], duration: 3 },
    strong: { scale: [1, 1.08], duration: 2.5 }
  };

  const glowColors = {
    gold: 'hsl(var(--primary))',
    platinum: 'hsl(var(--muted))',
    primary: 'hsl(var(--primary))'
  };

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;

    if (!card || !glow) return;

    const { scale, duration } = intensityMap[breathingIntensity];

    // Breathing animation
    const breathingTl = gsap.timeline({ repeat: -1, delay });
    
    breathingTl
      .to(card, {
        scale: scale[1],
        duration: duration / 2,
        ease: "power2.inOut"
      })
      .to(card, {
        scale: scale[0],
        duration: duration / 2,
        ease: "power2.inOut"
      });

    // Glow pulse animation
    const glowTl = gsap.timeline({ repeat: -1, delay });
    
    glowTl
      .to(glow, {
        opacity: 0.6,
        scale: 1.1,
        duration: duration / 2,
        ease: "power2.inOut"
      })
      .to(glow, {
        opacity: 0.2,
        scale: 1,
        duration: duration / 2,
        ease: "power2.inOut"
      });

    return () => {
      breathingTl.kill();
      glowTl.kill();
    };
  }, [breathingIntensity, delay]);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-lg opacity-20 blur-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColors[glowColor]} 0%, transparent 70%)`,
          transform: 'scale(1.2)'
        }}
      />
      
      {/* Main card */}
      <motion.div
        ref={cardRef}
        className={cn('relative z-10', className)}
        whileHover={{ 
          scale: 1.02,
          rotateY: 2,
          rotateX: 1,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="border-primary/10 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500">
          <CardContent className="p-0">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BreathingCard;