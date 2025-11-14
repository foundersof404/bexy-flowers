import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background Image with Parallax Effect - Reduced on mobile */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: shouldReduceMotion ? 1 : 1.1 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: shouldReduceMotion || isMobile ? 0 : 20, 
          ease: "linear", 
          repeat: shouldReduceMotion || isMobile ? 0 : Infinity, 
          repeatType: "reverse" 
        }}
        // Removed willChange for better scroll performance
      >
        <img
          src={heroBackground}
          alt="Luxury floral background"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: "easeOut" }}
          // Removed willChange for better scroll performance
        >
          <h1 className="font-luxury text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground mb-4 sm:mb-6 tracking-wider leading-tight">
            Bexy Flowers
          </h1>
          
          <motion.p
            className="font-body text-base xs:text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
            // Removed willChange for better scroll performance
          >
            Crafting luxury floral experiences with premium arrangements and bespoke designs
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
            // Removed willChange for better scroll performance
          >
            <Button
              variant="default"
              size="lg"
              className="font-body text-base sm:text-lg px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full shadow-luxury hover:shadow-gold hover:glow-gold transition-luxury gradient-gold text-primary-foreground font-semibold touch-target min-h-[44px] sm:min-h-[auto]"
            >
              Shop Now
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - Hidden on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 1.2, ease: "easeOut" }}
            // Removed willChange for better scroll performance
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center text-muted-foreground"
            >
              <span className="font-body text-xs sm:text-sm mb-2 tracking-wide">Scroll to explore</span>
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Floating Elements - Reduced on mobile */}
      {!isMobile && !shouldReduceMotion && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            willChange: "transform",
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  );
};

export default Hero;