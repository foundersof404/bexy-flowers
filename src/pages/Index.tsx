import React, { Suspense, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Palette,
  Flower2,
  ChevronRight,
  ArrowRight,
  Layers,
  Pen,
  Sparkle,
  Award
} from "lucide-react";
import LazySection from "@/components/LazySection";
import UltraNavigation from "@/components/UltraNavigation";
import BackToTop from "@/components/BackToTop";
import { useIsMobile } from "@/hooks/use-mobile";
const InteractiveBackground = React.lazy(() => import("@/components/interactive/InteractiveBackground"));
const UltraHero = React.lazy(() => import("@/components/UltraHero"));
const UltraFeaturedBouquets = React.lazy(() => import("@/components/UltraFeaturedBouquets"));
const UltraCategories = React.lazy(() => import("@/components/UltraCategories"));
// Replaced heavy interactive builder on home with lightweight CTA
// const VirtualBouquetBuilder = React.lazy(() => import("@/components/interactive/VirtualBouquetBuilder"));
const ZodiacBouquetQuiz = React.lazy(() => import("@/components/culture/ZodiacBouquetQuiz"));
const FlowerCareGuide = React.lazy(() => import("@/components/culture/FlowerCareGuide"));
const Footer = React.lazy(() => import("@/components/Footer"));

// Professional Custom Bouquet Section Component - Optimized for performance
const ProfessionalCustomSection = React.memo(() => {
  const isMobile = useIsMobile();

  const features = [
    {
      icon: Pen,
      title: "ARTISAN CRAFTED",
      subtitle: "Style Presets",
      description: "Start with romantic, modern, or avant-garde styles. Our master florists guide your creative vision.",
      gradientColors: ["#C29A43", "#D4A85A", "#E8C882"],
      direction: "left"
    },
    {
      icon: Sparkle,
      title: "BESPOKE PALETTES",
      subtitle: "Color Stories",
      description: "Explore professionally curated color harmonies. Each palette tells a unique story for your occasion.",
      gradientColors: ["#B7893C", "#C79E48", "#D4A85A"],
      direction: "center"
    },
    {
      icon: Award,
      title: "LUXURY BLOOMS",
      subtitle: "Premium Selection",
      description: "Exclusively sourced seasonal flowers. Hand-selected for uncompromising quality and elegance.",
      gradientColors: ["#A67C37", "#B88A44", "#CFA340"],
      direction: "right"
    }
  ];

  return (
    <section 
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #faf7f3 0%, #ffffff 100%)'
      }}
    >
      {/* Optimized Floating Background Elements - DISABLED ON MOBILE FOR PERFORMANCE */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#C79E48]/8 to-transparent rounded-full blur-2xl opacity-60"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ willChange: 'transform, opacity' }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#B88A44]/8 to-transparent rounded-full blur-2xl opacity-60"
            animate={{
              scale: [1.15, 1, 1.15],
              opacity: [0.6, 0.4, 0.6]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{ willChange: 'transform, opacity' }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Premium Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20 relative px-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Modern Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-slate-800/10 to-slate-700/10 md:backdrop-blur-xl border border-slate-600/20 mb-6 sm:mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-slate-700 tracking-wider uppercase">Professional Customization</span>
          </motion.div>

          {/* Main Title - Luxury Typography with Gold Accent */}
          <motion.h2
            className="font-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            DESIGN YOUR
            <br />
            PERFECT BOUQUET
            {/* Animated Gold Underline */}
            <motion.div
              className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 'clamp(120px, 30vw, 200px)' }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-4 sm:mb-6 md:mb-8">
            <div className="w-24 sm:w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48]/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#C79E48] rotate-45 shadow-lg shadow-[#C79E48]/50" />
          </div>

          {/* Subtitle - Enhanced Description */}
          <motion.p
            className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Create a bespoke floral masterpiece with unlimited creative freedom.
            <br className="hidden sm:block" />
            Choose from our curated premium selection and design something uniquely yours.
          </motion.p>
        </motion.div>

        {/* Feature Cards - Premium Grid */}
        <div className="relative mb-16">
          {/* Optimized decorative elements - DISABLED ON MOBILE FOR PERFORMANCE */}
          {!isMobile && (
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute top-6 left-8 w-40 h-40 rounded-full bg-[#F1E2CE]/30 blur-xl opacity-60" />
              <div className="absolute bottom-4 right-20 w-48 h-48 rounded-full bg-[#F6EADC]/25 blur-xl opacity-60" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            {features.map((feature, index) => {
              const getInitialState = () => {
                if (feature.direction === "left") {
                  return { opacity: 0, x: -100, scale: 0.9 };
                } else if (feature.direction === "right") {
                  return { opacity: 0, x: 100, scale: 0.9 };
                }
                // Optimized: removed expensive blur filter animation for center card
                return { opacity: 0, scale: 0.6 };
              };

              const getAnimateState = () => {
                return { opacity: 1, x: 0, scale: 1 };
              };

              const gradient135 = `linear-gradient(135deg, ${feature.gradientColors[0]} 0%, ${feature.gradientColors[1]} 50%, ${feature.gradientColors[2]} 100%)`;
              const gradient90 = `linear-gradient(90deg, ${feature.gradientColors[0]} 0%, ${feature.gradientColors[1]} 50%, ${feature.gradientColors[2]} 100%)`;
              const gradient225 = `linear-gradient(225deg, ${feature.gradientColors[0]} 0%, ${feature.gradientColors[1]} 50%, ${feature.gradientColors[2]} 100%)`;
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  className="group relative"
                initial={getInitialState()}
                whileInView={getAnimateState()}
                viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
                transition={{
                  duration: feature.direction === "center" ? 1 : 0.8,
                  delay: index * 0.2,
                  ease: feature.direction === "center" ? [0.34, 1.56, 0.64, 1] : [0.23, 1, 0.32, 1]
                }}
                >
                  <motion.div
                    className="relative h-full p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C6A15B]/20 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)] transition-all duration-300"
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, #fafaf9 100%)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                      ...(isMobile ? {} : { willChange: 'transform, box-shadow' })
                    }}
                    whileHover={isMobile ? {} : {
                      y: -12,
                      boxShadow: '0 20px 45px rgba(0,0,0,0.10)',
                      borderColor: 'rgba(194, 154, 67, 0.35)'
                    }}
                    transition={{ duration: 0.35 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(194, 154, 67, 0.03) 100%)' }}
                      transition={{ duration: 0.4 }}
                    />

                    <motion.div
                      className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-[48px] md:h-[48px] mb-3 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_3px_12px_rgba(198,161,91,0.25)]"
                      style={{ 
                        background: gradient135, 
                        boxShadow: '0 8px 24px rgba(194, 154, 67, 0.3)',
                        ...(isMobile ? {} : { willChange: 'transform' })
                      }}
                      whileHover={isMobile ? {} : { scale: 1.12, rotate: 8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Icon - Ensure it stays visible with proper z-index */}
                      <Icon 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)] relative z-10" 
                        strokeWidth={1.6} 
                        style={{ pointerEvents: 'none' }}
                      />
                      {/* Optimized Glow Effect - Removed expensive blur filter */}
                      <motion.div
                        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-30 pointer-events-none -z-10"
                        style={{ background: gradient135, transform: 'scale(1.2)' }}
                        transition={{ duration: 0.4 }}
                      />
                    </motion.div>

                    <h3
                      className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1"
                      style={{ color: '#B88A44', letterSpacing: '0.15em' }}
                    >
                      {feature.title}
                    </h3>

                    <motion.h4
                      className="text-base sm:text-lg font-bold mb-2 transition-all duration-300"
                      style={{ color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif' }}
                      whileHover={isMobile ? {} : { color: '#B88A44' }}
                    >
                      {feature.subtitle}
                    </motion.h4>

                    <motion.div
                      className="h-[2px] mb-3 sm:mb-4 rounded-full"
                      style={{ background: gradient90, width: '40px' }}
                      whileHover={isMobile ? {} : { width: '60px' }}
                      transition={{ duration: 0.4 }}
                    />

                    <p
                      className="leading-relaxed text-sm sm:text-base"
                      style={{ color: '#525252', lineHeight: '1.7' }}
                    >
                      {feature.description}
                    </p>

                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
                      style={{ background: gradient225, borderRadius: '0 16px 0 100%' }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Button Section - Elegant Frame */}
        <motion.div
          className="relative text-center mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Elegant Decorative Frame */}
          <div className="relative inline-block px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
            {/* Top Left Corner */}
            <motion.div
              className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
              style={{
                borderTop: '2px solid rgba(194, 154, 67, 0.3)',
                borderLeft: '2px solid rgba(194, 154, 67, 0.3)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            
            {/* Top Right Corner */}
            <motion.div
              className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
              style={{
                borderTop: '2px solid rgba(194, 154, 67, 0.3)',
                borderRight: '2px solid rgba(194, 154, 67, 0.3)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            
            {/* Bottom Left Corner */}
            <motion.div
              className="absolute bottom-0 left-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
              style={{
                borderBottom: '2px solid rgba(194, 154, 67, 0.3)',
                borderLeft: '2px solid rgba(194, 154, 67, 0.3)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            
            {/* Bottom Right Corner */}
            <motion.div
              className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
              style={{
                borderBottom: '2px solid rgba(194, 154, 67, 0.3)',
                borderRight: '2px solid rgba(194, 154, 67, 0.3)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />

            {/* Optimized Floating Particles Around Button - DISABLED ON MOBILE FOR PERFORMANCE */}
            {!isMobile && [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#C79E48] opacity-60"
                style={{
                  top: `${20 + Math.sin(i * Math.PI / 2) * 40}%`,
                  left: `${50 + Math.cos(i * Math.PI / 2) * 45}%`,
                  willChange: 'transform, opacity'
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* CTA Button */}
            <motion.a
              href="/customize"
              className="group inline-flex items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-white relative overflow-hidden w-full sm:w-auto touch-target min-h-[44px] sm:min-h-[auto] text-xs sm:text-sm md:text-base"
              style={{
                background: 'linear-gradient(90deg, #B88A44 0%, #D4A85A 50%, #CFA340 100%)',
                boxShadow: '0 8px 32px rgba(184, 138, 68, 0.4)',
                fontSize: 'clamp(0.875rem, 2vw, 1.1rem)',
                letterSpacing: '0.05em',
                ...(isMobile ? {} : { willChange: 'transform, box-shadow' })
              }}
              whileHover={isMobile ? {} : {
                scale: 1.05,
                boxShadow: '0 12px 48px rgba(194, 154, 67, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
            {/* Optimized Shimmer Effect - DISABLED ON MOBILE FOR PERFORMANCE */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 -left-full w-1/2 h-full pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                  transform: 'skewX(-20deg)',
                  willChange: 'left'
                }}
                animate={{
                  left: ['100%', '-50%']
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1.5
                }}
              />
            )}

            <span className="relative z-10 uppercase tracking-wider text-xs sm:text-sm md:text-base">
              Start Designing Now
            </span>
            {!isMobile && (
              <motion.div
                className="relative z-10"
                animate={{
                  x: [0, 4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </motion.div>
            )}
            {isMobile && (
              <div className="relative z-10">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
            )}
            </motion.a>

            {/* Trust Badge */}
            <motion.p
              className="mt-4 sm:mt-6 text-xs sm:text-sm px-2"
              style={{
                color: '#737373',
                letterSpacing: '0.02em'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              ✨ Trusted by over 10,000+ satisfied customers worldwide
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

ProfessionalCustomSection.displayName = 'ProfessionalCustomSection';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <UltraNavigation />
      <Suspense fallback={null}>
        <InteractiveBackground />
      </Suspense>
      <div className="relative z-10">
        <Suspense fallback={null}>
          <UltraHero />
        </Suspense>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <UltraFeaturedBouquets />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <UltraCategories />
          </Suspense>
        </LazySection>
        {/* Professional Custom Bouquet Design Section - Premium Redesign */}
        <LazySection rootMargin="400px 0px">
          <ProfessionalCustomSection />
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <ZodiacBouquetQuiz />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <FlowerCareGuide />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="600px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>
      <BackToTop />
    </div>
  );
};

export default Index;
