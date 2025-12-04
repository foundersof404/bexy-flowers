import { useEffect, useRef, useMemo, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import heroBackground from "@/assets/hero-bg.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const CollectionHeroComponent = () => {
  const heroRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (isMobile || prefersReducedMotion || shouldReduceMotion || !particlesRef.current) {
      return;
    }

    const particles = particlesRef.current.children;
    gsap.set(particles, {
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-200, 200),
      scale: () => gsap.utils.random(0.5, 1.5),
      opacity: () => gsap.utils.random(0.3, 0.8)
    });

    gsap.to(particles, {
      y: "-=100",
      rotation: 180,
      duration: () => gsap.utils.random(15, 25),
      ease: "none",
      repeat: -1,
      stagger: { each: 1, repeat: -1 },
      force3D: true
    });
  }, [isMobile, prefersReducedMotion, shouldReduceMotion]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-8 sm:pb-12"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.03) 0%, transparent 50%)
        `,
        minHeight: isMobile ? '70vh' : '85vh'
      }}
    >
      {/* Ambient Gold Ribbons */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(3)].map((_, idx) => (
          <motion.div
            key={`ribbon-${idx}`}
            initial={{ opacity: 0.2, rotate: 0, y: 0 }}
            animate={{ 
              opacity: [0.15, 0.35, 0.2], 
              rotate: idx % 2 === 0 ? [0, 4, -4, 0] : [0, -5, 5, 0],
              y: [-20, 30, -40]
            }}
            transition={{ duration: 24 + idx * 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[50vw] h-[50vw] bg-gradient-to-br from-[#c9a14e1f] via-[#fff6e6] to-transparent blur-3xl"
            style={{
              top: idx === 0 ? '-5%' : idx === 1 ? '25%' : '55%',
              left: idx === 0 ? '-10%' : idx === 1 ? '45%' : '65%'
            }}
          />
        ))}
      </div>

      {/* Background Image with Parallax Effect - Reduced on mobile */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: shouldReduceMotion || isMobile ? 1 : 1.1 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: shouldReduceMotion || isMobile ? 0 : 20, 
          ease: "linear", 
          repeat: shouldReduceMotion || isMobile ? 0 : Infinity, 
          repeatType: "reverse" 
        }}
        style={{ willChange: shouldReduceMotion || isMobile ? "auto" : "transform" }}
      >
        <img
          src={heroBackground}
          alt="Luxury floral background"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
          decoding="async"
          style={{ willChange: "auto" }}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/85 z-10" />

      {/* Floating Particles Background - Further reduced for performance */}
      {!isMobile && !shouldReduceMotion && (
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-15" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                filter: "blur(0.5px)",
                boxShadow: "0 0 10px hsl(var(--primary))"
              }}
            />
          ))}
        </div>
      )}

      {/* Gradient Orbs - Hidden on mobile and reduced motion */}
      {!isMobile && !shouldReduceMotion && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gold"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float"></div>
        </>
      )}

      {/* Hero Content - Moved upward */}
      <div
        className="relative z-20 text-center max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8"
        style={{ marginTop: "-10px" }}
      >
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p 
            className="uppercase tracking-[0.4em] text-xs sm:text-sm text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Bexy Signature Atelier
          </motion.p>

          <motion.h1 
            className="font-luxury text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-slate-900 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.15))',
              letterSpacing: '0.04em'
            }}
          >
            Our Complete Collection
            <motion.div 
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-[6px] w-48 rounded-full bg-gradient-to-r from-[#C79E48] via-[#dcbf7b] to-[#f9e7bb]"
              initial={{ width: 0 }}
              animate={{ width: 192 }}
              transition={{ delay: 0.6, duration: 1.1, ease: "easeOut" }}
            />
          </motion.h1>

          <div className="relative">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48]/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#C79E48] rotate-45 shadow-lg shadow-[#C79E48]/40" />
          </div>

          <motion.p 
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            Discover Lebanon&apos;s most luxurious floral portfolio — curated themes, couture arrangements, and limited editions designed to celebrate every exquisite moment.
          </motion.p>
        </motion.div>

        {/* Stats moved to end of Collection page for better layout & performance */}
      </div>
    </section>
  );
};

// Export memoized version for better performance
export const CollectionHero = memo(CollectionHeroComponent);