import { useRef, memo } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const CollectionHeroComponent = () => {
  const heroRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16"
      style={{
        background: 'linear-gradient(180deg, #FEFCF8 0%, #F9F7F2 100%)',
        minHeight: isMobile ? '60vh' : '70vh'
      }}
    >
      {/* Subtle Blurred Rose Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left rose */}
        <motion.div
          className="absolute w-64 h-64 sm:w-96 sm:h-96 top-0 left-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, transparent 70%)'
            }}
          />
        </motion.div>
        
        {/* Bottom-left rose */}
        <motion.div
          className="absolute w-72 h-72 sm:w-[28rem] sm:h-[28rem] bottom-0 left-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 30%, transparent 70%)'
            }}
          />
        </motion.div>
        
        {/* Top-right subtle hint */}
        <motion.div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 top-0 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)'
            }}
          />
        </motion.div>
        
        {/* Center-right subtle hint */}
        <motion.div
          className="absolute w-56 h-56 sm:w-80 sm:h-80 top-1/2 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 30%, transparent 70%)'
            }}
          />
        </motion.div>
      </div>

      {/* Hero Content - Elegant Design Matching Product Layout */}
      <div
        className="relative z-20 text-center max-w-4xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8"
        style={{ marginTop: "-10px" }}
      >
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand Name */}
          <motion.p 
            className="uppercase tracking-ultra-wide text-xs sm:text-sm text-slate-700 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            BEXY SIGNATURE ATELIER
          </motion.p>

          {/* Main Heading */}
          <motion.h1 
            className="font-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              letterSpacing: '0.02em',
              lineHeight: '1.1'
            }}
          >
            <span className="block">Our Complete</span>
            <span className="block mt-1">Collection</span>
          </motion.h1>

          {/* Golden Divider with Diamond */}
          <motion.div 
            className="relative flex items-center justify-center my-4 sm:my-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#C79E48] to-transparent" />
            <div className="absolute w-2 h-2 bg-[#C79E48] rotate-45 shadow-sm" />
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            Discover Lebanon&apos;s most luxurious floral portfolio — curated themes, couture arrangements, and limited editions designed to celebrate every exquisite moment.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Export memoized version for better performance
export const CollectionHero = memo(CollectionHeroComponent);