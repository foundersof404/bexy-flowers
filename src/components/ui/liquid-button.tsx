import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface LiquidButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  | 'onDrag' 
  | 'onDragStart' 
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onTransitionEnd'
> {
  children: React.ReactNode;
  variant?: 'gold' | 'platinum' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant = 'gold', size = 'md', children, onClick, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);
    const liquidRef = useRef<HTMLDivElement>(null);

    const variants = {
      gold: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-background border-primary/20 hover:shadow-lg hover:shadow-amber-500/50',
      platinum: 'bg-gradient-platinum text-background border-muted/20 hover:shadow-3d',
      glass: 'bg-background/10 backdrop-blur-md text-foreground border-white/20 hover:bg-background/20'
    };

    const sizes = {
      sm: 'px-6 py-3 text-sm',
      md: 'px-8 py-4 text-base',
      lg: 'px-12 py-6 text-lg'
    };

    useEffect(() => {
      const button = buttonRef.current;
      const ripple = rippleRef.current;
      const liquid = liquidRef.current;

      if (!button || !ripple || !liquid) return;

      const handleMouseEnter = () => {
        gsap.to(liquid, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(liquid, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleClick = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.set(ripple, {
          x: x - 50,
          y: y - 50,
          scale: 0,
          opacity: 1
        });

        gsap.to(ripple, {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });

        // Liquid morph effect
        gsap.to(liquid, {
          scaleX: 1.2,
          scaleY: 0.8,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      button.addEventListener('click', handleClick);

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
        button.removeEventListener('click', handleClick);
      };
    }, []);

    return (
      <motion.button
        ref={buttonRef}
        className={cn(
          'relative overflow-hidden border transition-all duration-300 font-medium transform-gpu',
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        {...props}
      >
        {/* Liquid background layer */}
        <div
          ref={liquidRef}
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 transition-transform duration-300"
        />
        
        {/* Ripple effect */}
        <div
          ref={rippleRef}
          className="absolute w-24 h-24 bg-white/30 rounded-full pointer-events-none"
          style={{ transform: 'scale(0)' }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

LiquidButton.displayName = 'LiquidButton';

export { LiquidButton };