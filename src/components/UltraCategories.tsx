import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Gift, Cake, Crown, Briefcase, Flower2, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "WEDDINGS",
    description: "Architectural bridal arrangements",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop",
    gradient: "from-rose-200/20 via-amber-100/30 to-yellow-200/20",
    icon: Crown,
    color: "from-rose-400/80 to-amber-300/90"
  },
  {
    id: 2,
    name: "VALENTINE'S",
    description: "Romantic luxury collections",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=1000&fit=crop",
    gradient: "from-red-200/20 via-pink-100/30 to-rose-200/20",
    icon: Heart,
    color: "from-red-400/80 to-pink-300/90"
  },
  {
    id: 3,
    name: "MOTHER'S DAY",
    description: "Elegant tribute arrangements",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=1000&fit=crop",
    gradient: "from-pink-200/20 via-rose-100/30 to-lavender-200/20",
    icon: Flower2,
    color: "from-pink-400/80 to-rose-300/90"
  },
  {
    id: 4,
    name: "BIRTHDAYS",
    description: "Celebration masterpieces",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop",
    gradient: "from-purple-200/20 via-violet-100/30 to-indigo-200/20",
    icon: Cake,
    color: "from-purple-400/80 to-violet-300/90"
  },
  {
    id: 5,
    name: "ANNIVERSARIES",
    description: "Timeless love expressions",
    image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=800&h=1000&fit=crop",
    gradient: "from-amber-200/20 via-yellow-100/30 to-gold-200/20",
    icon: Star,
    color: "from-amber-400/80 to-yellow-300/90"
  },
  {
    id: 6,
    name: "CORPORATE",
    description: "Professional luxury designs",
    image: "https://images.unsplash.com/photo-1574684891174-df0693e82998?w=800&h=1000&fit=crop",
    gradient: "from-slate-200/20 via-gray-100/30 to-zinc-200/20",
    icon: Briefcase,
    color: "from-slate-400/80 to-gray-300/90"
  },
  {
    id: 7,
    name: "SYMPATHY",
    description: "Respectful memorial arrangements",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    gradient: "from-slate-200/20 via-gray-100/30 to-blue-200/20",
    icon: Flower2,
    color: "from-slate-400/80 to-blue-300/90"
  },
  {
    id: 8,
    name: "SEASONAL",
    description: "Limited edition collections",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=1000&fit=crop",
    gradient: "from-emerald-200/20 via-green-100/30 to-teal-200/20",
    icon: Sparkles,
    color: "from-emerald-400/80 to-green-300/90"
  },
  {
    id: 9,
    name: "GRADUATIONS",
    description: "Achievement celebrations",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=1000&fit=crop",
    gradient: "from-blue-200/20 via-indigo-100/30 to-purple-200/20",
    icon: Star,
    color: "from-blue-400/80 to-indigo-300/90"
  },
  {
    id: 10,
    name: "LUXURY GIFTS",
    description: "Premium gift arrangements",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=1000&fit=crop",
    gradient: "from-orange-200/20 via-amber-100/30 to-yellow-200/20",
    icon: Gift,
    color: "from-orange-400/80 to-amber-300/90"
  }
];

const UltraCategories = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const container = containerRef.current;

    if (section && title && container) {
      // Set initial states
      gsap.set(title, { y: 50, opacity: 0 });
      gsap.set(container, { y: 100, opacity: 0 });

      // Animate on scroll
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(title, {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          })
          .to(container, {
            duration: 1.2,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          }, "-=0.5");
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Seamless infinite scroll effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create seamless infinite loop animation
    const infiniteScroll = () => {
      const singleSetWidth = categories.length * 352; // Width of one complete set
      
      gsap.to(container, {
        x: -singleSetWidth, // Move exactly one set width
        duration: 25, // 25 seconds to complete one full cycle
        ease: "none",
        force3D: true, // Force hardware acceleration
        onComplete: () => {
          // When we've scrolled through one complete set, reset to start of second set
          // This creates the illusion of infinite scroll
          gsap.set(container, { x: 0, force3D: true });
          infiniteScroll(); // Start the animation again
        }
      });
    };

    // Start the infinite scroll
    infiniteScroll();

    return () => {
      gsap.killTweensOf(container);
    };
  }, []);

  const scrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      const currentX = gsap.getProperty(container, "x") as number;
      const newPosition = Math.max(0, currentX + 400);
      
      gsap.to(container, {
        x: -newPosition,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  };

  const scrollRight = () => {
    const container = containerRef.current;
    if (container) {
      const currentX = gsap.getProperty(container, "x") as number;
      const maxScroll = (categories.length * 352) - 1200;
      const newPosition = Math.min(maxScroll, currentX + 400);
      
      gsap.to(container, {
        x: -newPosition,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-32 px-4 relative overflow-hidden min-h-screen"
      style={{ background: 'rgb(211, 211, 209)' }}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, hsl(51 100% 50% / 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 80% 80%, hsl(51 100% 50% / 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 50% 50%, hsl(51 100% 50% / 0.05) 0%, transparent 60%)`
        }} />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/8 to-amber-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          {/* Modern Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/10 to-slate-700/10 backdrop-blur-xl border border-slate-600/20 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 tracking-wider uppercase">Curated Excellence</span>
          </motion.div>

          {/* Luxury Typography with Gold Accent */}
          <motion.h2 
            ref={titleRef}
            className="font-luxury text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            LUXURY COLLECTIONS
            {/* Animated Gold Underline */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '200px' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-8">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 shadow-lg shadow-amber-500/50" />
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="font-body text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our meticulously curated floral collections, where each arrangement 
            represents the pinnacle of artistic expression and timeless elegance.
          </motion.p>
        </motion.div>

        {/* Cards Container */}
        <div className="w-full overflow-hidden">
          <div 
            ref={containerRef} 
            className="flex gap-8" 
            style={{ 
              width: `${categories.length * 2 * 352}px`,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          >
            {/* Duplicate categories for seamless infinite scroll */}
            {[...categories, ...categories].map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 w-80 h-96 group cursor-pointer"
                style={{ willChange: 'transform' }}
              >
                <div className="relative h-full w-full">
                  {/* Ultra-Modern Glassmorphism Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[30px] shadow-[0_20px_60px_rgba(198,161,81,0.15)] hover:shadow-[0_30px_80px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden hover:scale-105 hover:-translate-y-6">
                    
                    {/* Enhanced Background Image */}
                    <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                      />
                      
                      {/* Modern Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-800/40 to-transparent transition-all duration-700 ease-out group-hover:from-slate-900/50 group-hover:via-slate-800/20" />
                      
                      {/* Sophisticated Pattern Overlay */}
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700" 
                           style={{
                             backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                           }} />
                    </div>

                    {/* Luxury Gold Border System */}
                    <div className="absolute inset-0 rounded-[30px] border border-amber-300/30 group-hover:border-amber-400/60 transition-all duration-700 ease-out" />
                    <div className="absolute inset-[1px] rounded-[30px] bg-gradient-to-br from-amber-100/20 via-transparent to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Enhanced Content Layout */}
                    <div className="absolute inset-0 flex flex-col justify-between p-8">
                      
                      {/* Top Icon with Modern Design */}
                      <div className="flex justify-end">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-slate-700/50 transition-all duration-700 ease-out group-hover:scale-110 group-hover:from-slate-700/90 group-hover:to-slate-800/95 shadow-lg">
                          <category.icon className="w-7 h-7 text-slate-200 transition-all duration-700 ease-out group-hover:text-white" />
                        </div>
                      </div>

                      {/* Bottom Content with Modern Typography */}
                      <div className="space-y-5">
                        {/* Category Name - Modern Typography */}
                        <h3 className="font-luxury text-3xl font-bold text-white transition-all duration-700 ease-out group-hover:text-slate-100 tracking-wide">
                          {category.name}
                        </h3>

                        {/* Description - Sophisticated Styling */}
                        <p className="font-sans font-light text-sm text-slate-200/90 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out leading-relaxed">
                          {category.description}
                        </p>

                        {/* Modern Explore Button */}
                        <motion.button 
                          className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/50 text-slate-100 px-8 py-3 rounded-2xl font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out hover:from-slate-700/90 hover:to-slate-800/90 hover:text-white hover:border-slate-500/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          EXPLORE COLLECTION
                        </motion.button>
                      </div>
                    </div>

                    {/* Modern Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent opacity-0 group-hover:opacity-100 rounded-[30px] transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                    {/* Sophisticated 3D Shadow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 rounded-[30px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

                    {/* Glitter Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[30px]">
                      {/* Glitter dots positioned randomly */}
                      <div className="absolute top-4 left-8 w-1 h-1 bg-amber-400/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-100" />
                      <div className="absolute top-12 right-6 w-1 h-1 bg-amber-500/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-200" />
                      <div className="absolute top-20 left-12 w-1 h-1 bg-amber-600/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-300" />
                      <div className="absolute top-8 right-12 w-1 h-1 bg-amber-400/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-150" />
                      <div className="absolute top-16 left-6 w-1 h-1 bg-amber-500/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-250" />
                      <div className="absolute top-24 right-8 w-1 h-1 bg-amber-600/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-350" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Navigation Buttons */}
        <motion.div 
          className="flex justify-center items-center mt-16 space-x-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={scrollLeft}
            className="w-16 h-16 bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl flex items-center justify-center text-slate-200 hover:from-slate-700/90 hover:to-slate-800/95 hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-7 h-7" />
          </motion.button>

          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/10 to-slate-700/10 backdrop-blur-xl border border-slate-600/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 animate-pulse" />
            <span className="text-sm text-slate-600 font-medium tracking-wider uppercase">
              Navigate Collections
            </span>
          </div>

          <motion.button
            onClick={scrollRight}
            className="w-16 h-16 bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl flex items-center justify-center text-slate-200 hover:from-slate-700/90 hover:to-slate-800/95 hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-7 h-7" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UltraCategories;