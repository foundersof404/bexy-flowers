import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Heart, Gift, Cake, Crown, Briefcase, Flower2, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "WEDDINGS",
    description: "Architectural bridal arrangements",
    image: encodeURI("/assets/wedding % events/wedding/IMG-20251126-WA0021.jpg"),
    gradient: "from-rose-200/20 via-amber-100/30 to-yellow-200/20",
    icon: Crown,
    color: "from-rose-400/80 to-amber-300/90",
    filterValue: "wedding-percent-events"
  },
  {
    id: 2,
    name: "VALENTINE'S",
    description: "Romantic luxury collections",
    image: encodeURI("/assets/valentine/IMG_4172.jpg"),
    gradient: "from-red-200/20 via-pink-100/30 to-rose-200/20",
    icon: Heart,
    color: "from-red-400/80 to-pink-300/90",
    filterValue: "valentine"
  },
  {
    id: 3,
    name: "MOTHER'S DAY",
    description: "Elegant tribute arrangements",
    image: encodeURI("/assets/mother day/IMG_8394.JPG"),
    gradient: "from-pink-200/20 via-rose-100/30 to-lavender-200/20",
    icon: Flower2,
    color: "from-pink-400/80 to-rose-300/90",
    filterValue: "mother-day"
  },
  {
    id: 4,
    name: "BIRTHDAYS",
    description: "Celebration masterpieces",
    image: encodeURI("/assets/birthday/IMG_3730 (1).jpg"),
    gradient: "from-purple-200/20 via-violet-100/30 to-indigo-200/20",
    icon: Cake,
    color: "from-purple-400/80 to-violet-300/90",
    filterValue: "birthday"
  },
  {
    id: 5,
    name: "ANNIVERSARIES",
    description: "Timeless love expressions",
    image: encodeURI("/assets/red roses/red roses the letter J.png"),
    gradient: "from-amber-200/20 via-yellow-100/30 to-gold-200/20",
    icon: Star,
    color: "from-amber-400/80 to-yellow-300/90",
    filterValue: "red-roses"
  },
  {
    id: 6,
    name: "CORPORATE",
    description: "Professional luxury designs",
    image: encodeURI("/assets/wedding % events/events/IMG-20251126-WA0022.jpg"),
    gradient: "from-slate-200/20 via-gray-100/30 to-zinc-200/20",
    icon: Briefcase,
    color: "from-slate-400/80 to-gray-300/90",
    filterValue: "wedding-percent-events"
  },
  {
    id: 8,
    name: "SEASONAL",
    description: "Limited edition collections",
    image: encodeURI("/assets/hand band/IMG_5392.jpg"),
    gradient: "from-emerald-200/20 via-green-100/30 to-teal-200/20",
    icon: Sparkles,
    color: "from-emerald-400/80 to-green-300/90",
    filterValue: "hand-band"
  },
  {
    id: 9,
    name: "GRADUATION",
    description: "Achievement celebrations",
    image: encodeURI("/assets/graduation/IMG_0295.jpg"),
    gradient: "from-blue-200/20 via-indigo-100/30 to-purple-200/20",
    icon: Star,
    color: "from-blue-400/80 to-indigo-300/90",
    filterValue: "graduation"
  },
  {
    id: 10,
    name: "LUXURY GIFTS",
    description: "Premium gift arrangements",
    image: encodeURI("/assets/red roses/large red roses flower bouquet with gliter.png"),
    gradient: "from-orange-200/20 via-amber-100/30 to-yellow-200/20",
    icon: Gift,
    color: "from-orange-400/80 to-amber-300/90",
    filterValue: "red-roses"
  }
];

const UltraCategories = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileRow1Ref = useRef<HTMLDivElement>(null);
  const mobileRow2Ref = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(false);

  const handleExplore = (filterValue: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    navigate(`/collection?category=${filterValue}`);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

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

  // Seamless infinite scroll effect for desktop (single row)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto scroll - infinite seamless loop
    const cardWidth = 352; // Card width (w-80 = 320px + gap-8 = 32px = 352px)
    const singleSetWidth = categories.length * cardWidth;
    
    // Set initial position
    gsap.set(container, { x: 0 });
    
    const tween = gsap.to(container, {
      x: -singleSetWidth,
      duration: 30,
      ease: "none",
      force3D: true,
      repeat: -1,
      repeatDelay: 0,
      modifiers: {
        x: (x) => {
          const val = parseFloat(x);
          // Seamless loop: when we reach the end of first set, reset to start position
          if (val <= -singleSetWidth) {
            return `${val % singleSetWidth}px`;
          }
          return `${val}px`;
        }
      }
    });

    return () => {
      tween.kill();
      gsap.killTweensOf(container);
    };
  }, []);

  // Mobile: Two rows with opposite scroll directions
  useEffect(() => {
    const row1 = mobileRow1Ref.current;
    const row2 = mobileRow2Ref.current;
    
    if (!row1 || !row2) return;

    const cardWidth = 196; // Reduced by 30% (280 * 0.7 = 196)
    const gap = 12; // gap-3 = 12px
    const cardTotalWidth = cardWidth + gap;
    const row1Cards = 5; // First 5 categories
    const row2Cards = 4; // Last 4 categories
    
    // Calculate the exact width of one complete set
    const singleSetWidth1 = row1Cards * cardTotalWidth;
    const singleSetWidth2 = row2Cards * cardTotalWidth;

    let tween1: gsap.core.Tween | null = null;
    let tween2: gsap.core.Tween | null = null;

    // Row 1: Scrolls left (normal direction) - infinite seamless loop
    if (isAutoScroll) {
      tween1 = gsap.to(row1, {
        x: -singleSetWidth1,
        duration: 15,
        ease: "none",
        force3D: true,
        repeat: -1,
        repeatDelay: 0,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x);
            return `${val % singleSetWidth1}px`;
          }
        }
      });

      // Row 2: Scrolls right (opposite direction) - infinite seamless loop
      // Start from negative position for right scroll
      gsap.set(row2, { x: -singleSetWidth2 });
      tween2 = gsap.to(row2, {
        x: 0,
        duration: 25,
        ease: "none",
        force3D: true,
        repeat: -1,
        repeatDelay: 0,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x);
            return `${val % singleSetWidth2}px`;
          }
        }
      });
    } else {
      // Pause animations
      if (tween1) tween1.pause();
      if (tween2) tween2.pause();
    }

    return () => {
      if (tween1) tween1.kill();
      if (tween2) tween2.kill();
      gsap.killTweensOf(row1);
      gsap.killTweensOf(row2);
    };
  }, [isAutoScroll]);

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
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '200px' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-8">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48]/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#C79E48] rotate-45 shadow-lg shadow-[#C79E48]/50" />
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

        {/* Desktop: Single Row Cards Container */}
        <div className="w-full overflow-hidden hidden lg:block">
          <div 
            ref={containerRef} 
            className="flex gap-8" 
            style={{ 
              width: `${categories.length * 2 * 352}px`,
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            {/* Duplicate categories for seamless infinite scroll */}
            {[...categories, ...categories].map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 w-80 h-96 group cursor-pointer"
                onClick={() => handleExplore(category.filterValue)}
                  style={{ 
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
              >
                <div className="relative h-full w-full">
                  {/* Ultra-Modern Glassmorphism Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[30px] shadow-[0_20px_60px_rgba(198,161,81,0.15)] hover:shadow-[0_30px_80px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden hover:scale-95 hover:-translate-y-2">
                    
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
                        <div className="w-14 h-14 bg-gradient-to-br from-[#C79E48]/80 to-[#8B6F3A]/90 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-[#C79E48]/50 transition-all duration-700 ease-out group-hover:scale-110 group-hover:from-slate-700/90 group-hover:to-slate-800/95 shadow-lg">
                          <category.icon className="w-7 h-7 text-white transition-all duration-700 ease-out group-hover:text-white" />
                        </div>
                      </div>

                      {/* Bottom Content with Modern Typography */}
                      <div className="space-y-5">
                        {/* Category Name - Modern Typography */}
                        <h3 className="font-luxury text-3xl font-bold text-white transition-all duration-700 ease-out group-hover:text-slate-100 tracking-wide">
                          {category.name}
                        </h3>

                        {/* Description - Sophisticated Styling */}
                        <p className="font-sans font-light text-sm text-white/90 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out leading-relaxed">
                          {category.description}
                        </p>

                        {/* Modern Explore Button */}
                        <motion.button 
                          className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/50 text-slate-100 px-8 py-3 rounded-2xl font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out hover:from-slate-700/90 hover:to-slate-800/90 hover:text-white hover:border-slate-500/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExplore(category.filterValue);
                          }}
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

        {/* Mobile: Two Rows with Opposite Scroll Directions */}
        <div className="w-full overflow-hidden lg:hidden space-y-4">
          {/* Enhanced Toggle Switch for Auto/Manual Scroll */}
          <div className="flex flex-col items-center mb-8 space-y-4">
            {/* Toggle Switch */}
            <motion.button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className={`relative inline-flex items-center gap-4 px-8 py-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 shadow-lg ${
                isAutoScroll 
                  ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border-amber-400/60 shadow-amber-500/20' 
                  : 'bg-gradient-to-r from-slate-800/15 to-slate-700/15 border-slate-600/40 shadow-slate-500/10'
              }`}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: isAutoScroll 
                  ? "0 20px 40px rgba(245, 158, 11, 0.3)" 
                  : "0 20px 40px rgba(71, 85, 105, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Enhanced Toggle Switch */}
              <motion.div
                className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner ${
                  isAutoScroll 
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500' 
                    : 'bg-gradient-to-r from-slate-300 to-slate-400'
                }`}
              >
                {/* Toggle Knob */}
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg border border-gray-200"
                  animate={{ x: isAutoScroll ? 28 : 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 600, 
                    damping: 30,
                    mass: 0.8
                  }}
                />
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full blur-sm ${
                    isAutoScroll ? 'bg-amber-400/50' : 'bg-slate-300/30'
                  }`}
                  animate={{ opacity: isAutoScroll ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              {/* Status Text */}
              <div className="flex flex-col items-start">
                <span className={`text-base font-semibold tracking-wide ${
                  isAutoScroll ? 'text-amber-700' : 'text-slate-700'
                }`}>
                  {isAutoScroll ? 'AUTO SCROLL' : 'MANUAL CONTROL'}
                </span>
                <span className={`text-xs font-medium ${
                  isAutoScroll ? 'text-amber-600/80' : 'text-slate-600/80'
                }`}>
                  {isAutoScroll ? 'Cards flow automatically' : 'Pause to swipe manually'}
                </span>
              </div>

              {/* Icon indicator */}
              <motion.div
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isAutoScroll ? 'bg-amber-500/20' : 'bg-slate-500/20'
                }`}
                animate={{ rotate: isAutoScroll ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {isAutoScroll ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={`w-5 h-5 ${isAutoScroll ? 'text-amber-600' : 'text-slate-600'}`} />
                  </motion.div>
                ) : (
                  <ChevronLeft className={`w-5 h-5 ${isAutoScroll ? 'text-amber-600' : 'text-slate-600'}`} />
                )}
              </motion.div>
            </motion.button>

            {/* Helpful Note */}
            <motion.div 
              className="text-center max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-slate-500 leading-relaxed">
                💡 <strong>Tip:</strong> Switch to manual mode to pause the auto-scrolling and swipe through the collections at your own pace.
              </p>
            </motion.div>
          </div>

          {/* Row 1: Scrolls Left */}
          <div className="w-full overflow-hidden">
              <div 
                ref={mobileRow1Ref} 
                className="flex gap-3" 
                style={{ 
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
              >
              {/* First 5 categories, tripled for seamless infinite scroll */}
              {[...categories.slice(0, 5), ...categories.slice(0, 5), ...categories.slice(0, 5)].map((category, index) => (
                <div
                  key={`row1-${category.id}-${index}`}
                  className="flex-shrink-0 w-[196px] h-56 group cursor-pointer"
                  onClick={() => handleExplore(category.filterValue)}
                  style={{ 
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                >
                  <div className="relative h-full w-full">
                    {/* Ultra-Modern Glassmorphism Card - Mobile */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[24px] shadow-[0_15px_45px_rgba(198,161,81,0.15)] active:shadow-[0_20px_60px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden active:scale-95">
                      
                      {/* Enhanced Background Image */}
                      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-all duration-700 ease-out"
                        />
                        
                        {/* Modern Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-800/40 to-transparent transition-all duration-700 ease-out" />
                        
                        {/* Sophisticated Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20 transition-opacity duration-700" 
                             style={{
                               backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                             }} />
                      </div>

                      {/* Luxury Gold Border System */}
                      <div className="absolute inset-0 rounded-[24px] border border-amber-300/30 transition-all duration-700 ease-out" />

                      {/* Enhanced Content Layout */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6">
                        
                        {/* Top Icon with Modern Design */}
                        <div className="flex justify-end">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#C79E48]/80 to-[#8B6F3A]/90 backdrop-blur-xl rounded-xl flex items-center justify-center border border-[#C79E48]/50 transition-all duration-700 ease-out shadow-lg">
                            <category.icon className="w-6 h-6 text-white transition-all duration-700 ease-out" />
                          </div>
                        </div>

                        {/* Bottom Content with Modern Typography */}
                        <div className="space-y-3">
                          {/* Category Name - Modern Typography */}
                          <h3 className="font-luxury text-2xl font-bold text-white transition-all duration-700 ease-out tracking-wide">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
          </div>

          {/* Row 2: Scrolls Right (Opposite Direction) */}
          <div className="w-full overflow-hidden">
              <div 
                ref={mobileRow2Ref} 
                className="flex gap-3" 
                style={{ 
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
              >
              {/* Last 4 categories, tripled for seamless infinite scroll */}
              {[...categories.slice(5, 9), ...categories.slice(5, 9), ...categories.slice(5, 9)].map((category, index) => (
                <div
                  key={`row2-${category.id}-${index}`}
                  className="flex-shrink-0 w-[196px] h-56 group cursor-pointer"
                  onClick={() => handleExplore(category.filterValue)}
                  style={{ 
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                >
                  <div className="relative h-full w-full">
                    {/* Ultra-Modern Glassmorphism Card - Mobile */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[24px] shadow-[0_15px_45px_rgba(198,161,81,0.15)] active:shadow-[0_20px_60px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden active:scale-95">
                      
                      {/* Enhanced Background Image */}
                      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-all duration-700 ease-out"
                        />
                        
                        {/* Modern Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-800/40 to-transparent transition-all duration-700 ease-out" />
                        
                        {/* Sophisticated Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20 transition-opacity duration-700" 
                             style={{
                               backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                             }} />
                      </div>

                      {/* Luxury Gold Border System */}
                      <div className="absolute inset-0 rounded-[24px] border border-amber-300/30 transition-all duration-700 ease-out" />

                      {/* Enhanced Content Layout */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6">
                        
                        {/* Top Icon with Modern Design */}
                        <div className="flex justify-end">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#C79E48]/80 to-[#8B6F3A]/90 backdrop-blur-xl rounded-xl flex items-center justify-center border border-[#C79E48]/50 transition-all duration-700 ease-out shadow-lg">
                            <category.icon className="w-6 h-6 text-white transition-all duration-700 ease-out" />
                          </div>
                        </div>

                        {/* Bottom Content with Modern Typography */}
                        <div className="space-y-3">
                          {/* Category Name - Modern Typography */}
                          <h3 className="font-luxury text-2xl font-bold text-white transition-all duration-700 ease-out tracking-wide">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
          </div>
        </div>

        {/* Modern Navigation Buttons - Desktop Only */}
        <motion.div 
          className="hidden lg:flex justify-center items-center mt-16 space-x-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={scrollLeft}
            className="w-16 h-16 bg-gradient-to-br from-[#C79E48]/90 to-[#8B6F3A]/95 backdrop-blur-xl border border-[#C79E48]/50 rounded-2xl flex items-center justify-center text-white hover:from-[#D4A85A]/90 hover:to-[#C79E48]/95 hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(199,158,72,0.2)] hover:shadow-[0_15px_40px_rgba(199,158,72,0.3)]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-7 h-7" />
          </motion.button>

          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#C79E48]/10 to-[#D4A85A]/10 backdrop-blur-xl border border-[#C79E48]/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#C79E48] to-[#D4A85A] animate-pulse" />
            <span className="text-sm text-[#8B6F3A] font-medium tracking-wider uppercase">
              Navigate Collections
            </span>
          </div>

          <motion.button
            onClick={scrollRight}
            className="w-16 h-16 bg-gradient-to-br from-[#C79E48]/90 to-[#8B6F3A]/95 backdrop-blur-xl border border-[#C79E48]/50 rounded-2xl flex items-center justify-center text-white hover:from-[#D4A85A]/90 hover:to-[#C79E48]/95 hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(199,158,72,0.2)] hover:shadow-[0_15px_40px_rgba(199,158,72,0.3)]"
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
