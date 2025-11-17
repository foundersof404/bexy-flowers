import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Home, 
  Flower2, 
  Sparkles,
  Crown,
  Heart,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFlyingHeart } from '@/contexts/FlyingHeartContext';
import CartDashboard from '@/components/cart/CartDashboard';
import logoImage from '/assets/bexy-flowers-logo.png';

gsap.registerPlugin(ScrollTrigger);

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="w-5 h-5" />,
    description: "Luxury Floral Experience"
  },
  {
    name: "Collection",
    path: "/collection",
    icon: <Flower2 className="w-5 h-5" />,
    description: "Premium Arrangements"
  },
  {
    name: "Custom",
    path: "/customize",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Bespoke Creations"
  },
  {
    name: "About",
    path: "/about",
    icon: <Crown className="w-5 h-5" />,
    description: "Our Story"
  }
];

const UltraNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { getTotalFavorites } = useFavorites();
  const { navHeartPulse } = useFlyingHeart();
  const cartItems = getTotalItems();
  const favoritesCount = getTotalFavorites();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;

    if (nav && logo) {
      // Initial logo animation - Simplified on mobile
      if (isMobile || prefersReducedMotion || shouldReduceMotion) {
        gsap.set(logo, { scale: 1, rotation: 0 });
      } else {
        gsap.set(logo, { scale: 0, rotation: -180 });
        gsap.to(logo, {
          duration: 2,
          scale: 1,
          rotation: 0,
          ease: "elastic.out(1, 0.3)",
          force3D: true
        });
      }

       // Set initial platinum background immediately - no transitions
       gsap.set(nav, {
         backgroundColor: "rgba(229, 228, 226, 0.95)", // Always start with platinum
         backdropFilter: "blur(20px)",
         boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
         immediateRender: true // Force immediate render
       });

       // Simplified scroll effect using native scroll listener for better performance
       let ticking = false;
       const handleScroll = () => {
         if (!ticking) {
           window.requestAnimationFrame(() => {
             const scrolled = window.scrollY > 50;
             setIsScrolled(scrolled);
             
             if (nav) {
               const opacity = scrolled ? 0.98 : 0.95;
               nav.style.backgroundColor = `rgba(229, 228, 226, ${opacity})`;
               nav.style.boxShadow = scrolled 
                 ? "0 8px 32px rgba(0,0,0,0.15)"
                 : "0 8px 32px rgba(0,0,0,0.1)";
             }
             
             ticking = false;
           });
           ticking = true;
         }
       };
       
       window.addEventListener('scroll', handleScroll, { passive: true });
       
       // Initial call
       handleScroll();

      // Logo hover effect - Removed movement, only glow effect via CSS
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, [isMobile, prefersReducedMotion, shouldReduceMotion]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (menuRef.current) {
      if (!isMenuOpen) {
        gsap.fromTo(menuRef.current, 
          { opacity: 0, y: -50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    }
  };

  const handleNavigation = (path: string) => {
    // Force scroll reset around navigation to ensure new page starts at top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    navigate(path);
    setIsMenuOpen(false);
    // Run again on next frame to beat layout/animation timing
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };


  return (
    <>
      {!isCartOpen && (
        <>
          <nav
            ref={navRef}
            className="ultra-navigation fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl shadow-luxury"
            style={{
              backgroundColor: 'transparent', // Make header transparent
              transition: 'none', // Remove transition to prevent black flash
              pointerEvents: 'auto' // Ensure navigation is clickable
              // Removed will-change as it causes performance issues with scroll
            }}
          >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo and Brand - Elegant Glow Only, No Movement */}
            <motion.div
              ref={logoRef}
              className="flex items-center flex-shrink-0"
            >
              <Button
                variant="ghost"
                className="relative p-1 sm:p-2 hover:bg-primary/5 transition-all duration-500 group flex items-center rounded-lg"
                onClick={() => navigate('/')}
              >
                {/* Logo Container - Elegant Glow Only */}
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative"
                >
                  <img
                    src={logoImage}
                    alt="𝓑𝓮𝔁𝔂 𝓯𝓵𝓸𝔀𝓮𝓻 Logo"
                    className="w-full h-full object-contain transition-all duration-700 relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(196,166,105,0.3))'
                    }}
                  />
                  
                  {/* Elegant Glow Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'radial-gradient(circle, rgba(196,166,105,0.4) 0%, rgba(196,166,105,0.2) 40%, transparent 70%)',
                      filter: 'blur(12px)',
                      zIndex: 0
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Secondary Glow Layer */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(196,166,105,0.3) 0%, transparent 60%)',
                      filter: 'blur(8px)',
                      zIndex: 0
                    }}
                  />
                </div>
                
                {/* Brand Name - Hidden on very small screens - Elegant Glow Only */}
                <div className="ml-1 sm:ml-2 hidden xs:block">
                  <h1 
                    className="font-luxury text-lg sm:text-xl lg:text-2xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(196,166,105,0.6)] [text-shadow:_0_0_12px_rgba(196,166,105,0.8)] transition-all duration-700 group-hover:[text-shadow:_0_0_20px_rgba(196,166,105,1),_0_0_30px_rgba(196,166,105,0.8),_0_0_40px_rgba(196,166,105,0.6)]"
                  >
                    𝓑𝓮𝔁𝔂 𝓯𝓵𝓸𝔀𝓮𝓻
                  </h1>
                </div>
              </Button>
            </motion.div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Desktop Navigation with Advanced Hover Effects */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Button
                    variant="ghost"
                    className={`relative group font-body font-medium px-3 xl:px-6 py-2 xl:py-3 transition-all duration-500 overflow-hidden ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {/* Icon with Advanced 3D Hover Effects */}
                      <motion.span 
                        className="transition-all duration-500 relative inline-flex items-center justify-center"
                        whileHover={isMobile || shouldReduceMotion ? {} : { 
                          scale: 1.15, 
                          rotate: [0, -5, 5, 0],
                          color: "rgb(194, 154, 67)",
                          filter: "drop-shadow(0 0 12px rgba(194, 154, 67, 0.8))"
                        }}
                        transition={{ 
                          duration: shouldReduceMotion ? 0 : 0.5, 
                          ease: [0.23, 1, 0.32, 1],
                          rotate: shouldReduceMotion ? {} : { duration: 0.4, repeat: 1, repeatType: "reverse" }
                        }}
                        style={{ willChange: isMobile || shouldReduceMotion ? "auto" : "transform" }}
                      >
                        {item.icon}
                        
                        {/* Simplified Icon Glow Effect - Reduced for performance */}
                        {!isMobile && !shouldReduceMotion && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'radial-gradient(circle, rgba(194, 154, 67, 0.4) 0%, transparent 70%)',
                              filter: 'blur(8px)'
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 2, opacity: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        )}
                      </motion.span>
                      
                      {/* Text with Morphing Animation */}
                      <motion.span
                        className="relative"
                        whileHover={{ 
                          x: 3,
                          scale: 1.05,
                          textShadow: "0 0 10px rgba(196,166,105,0.5)"
                        }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      >
                        {item.name}
                        
                        {/* Text Underline Animation */}
                        <motion.div
                          className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                          initial={{ width: 0, opacity: 0 }}
                          whileHover={{ width: "100%", opacity: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </motion.span>
                    </span>
                    
                    {/* Simplified Background Effects - Reduced for performance */}
                    
                    {/* Primary Background Gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 rounded-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    />
                    
                    {/* Active Indicator */}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          x: '-50%'
                        }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Favorites, Cart & Menu with Enhanced Hover Effects */}
            <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-4">
              {/* Favorites with Advanced Hover Effects */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigation('/favorites')}
                  className="relative group hover:bg-primary/10 transition-all duration-500 overflow-hidden rounded-lg w-10 h-10 sm:w-12 sm:h-12"
                >
                  {/* Favorites Icon with 3D Effects */}
                  <motion.div
                    className="relative z-10"
                    animate={navHeartPulse ? {
                      scale: [1, 1.5, 1.2, 1],
                      rotate: [0, 15, -15, 0],
                      filter: "drop-shadow(0 0 20px rgba(220, 38, 127, 1))"
                    } : {}}
                    whileHover={{ 
                      scale: 1.15, 
                      rotateY: [0, 20, -20, 0],
                      rotateX: [0, 15, -15, 0],
                      color: "rgb(220, 38, 127)",
                      filter: "drop-shadow(0 0 12px rgba(220, 38, 127, 0.8))"
                    }}
                    transition={{ 
                      duration: navHeartPulse ? 0.6 : 0.8, 
                      ease: [0.23, 1, 0.32, 1],
                      rotateY: { duration: 0.6, repeat: 1, repeatType: "reverse" },
                      rotateX: { duration: 0.6, repeat: 1, repeatType: "reverse" }
                    }}
                  >
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ${location.pathname === '/favorites' ? 'fill-[#dc267f] text-[#dc267f]' : 'text-foreground'}`} />
                    
                    {/* Icon Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-pink-500/40 rounded-full blur-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={navHeartPulse ? {
                        scale: [1, 2.5, 1.5, 1],
                        opacity: [0.7, 1, 0.8, 0.7]
                      } : {}}
                      whileHover={{ scale: 1.8, opacity: 0.7 }}
                      transition={{ duration: navHeartPulse ? 0.6 : 0.5 }}
                    />
                    
                    {/* Pulse rings on animation */}
                    {navHeartPulse && (
                      <>
                        <motion.div
                          className="absolute inset-0 border-2 border-[#dc267f] rounded-full"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{
                            scale: [1, 2, 2.5],
                            opacity: [0.8, 0.4, 0]
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 border-2 border-[#dc267f] rounded-full"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{
                            scale: [1, 1.8, 2.2],
                            opacity: [0.6, 0.3, 0]
                          }}
                          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        />
                      </>
                    )}
                  </motion.div>
                  
                  {/* Simplified Background - Reduced for performance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-pink-500/15 to-pink-500/5 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  />
                  
                  {/* Favorites Badge with Enhanced Animation */}
                  {favoritesCount > 0 && (
                    <motion.div
                        className="absolute -top-3 -right-0 -left-3 w-4 h-4 sm:w-4 sm:h-5 bg-[#dc267f] text-white rounded-full flex items-center justify-center text-xs shadow-lg relative z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.4, type: "spring", stiffness: 500 }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 360,
                        boxShadow: "0 0 10px rgba(220, 38, 127, 0.8)"
                      }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {favoritesCount}
                      </motion.span>
                      
                      {/* Badge Glow */}
                      <motion.div
                        className="absolute inset-0 bg-pink-500/50 rounded-full blur-md"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* Cart with Simplified Hover Effects */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCartOpen(true)}
                  className="relative group hover:bg-primary/10 transition-all duration-500 overflow-hidden rounded-lg w-10 h-10 sm:w-12 sm:h-12"
                >
                  {/* Cart Icon - Simplified */}
                  <motion.div
                    className="relative z-10"
                    whileHover={!isMobile && !shouldReduceMotion ? { 
                      scale: 1.15, 
                      color: "rgb(196,166,105)"
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-all duration-300" />
                  </motion.div>
                  
                  {/* Simplified Background - Reduced for performance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  />
                  
                  {/* Cart Badge with Enhanced Animation */}
                  {cartItems > 0 && (
                    <motion.div
                        className="absolute -top-3 -right-0 -left-3 w-4 h-4 sm:w-4 sm:h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs shadow-gold cart-pulse relative z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 360,
                        boxShadow: "0 0 10px rgba(196,166,105,0.8)"
                      }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {cartItems}
                      </motion.span>
                      
                      {/* Badge Glow */}
                      <motion.div
                        className="absolute inset-0 bg-primary/50 rounded-full blur-md"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* Mobile Menu Button - Simplified */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="lg:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMenuToggle}
                  className="relative group hover:bg-primary/10 transition-all duration-300 overflow-hidden rounded-lg w-10 h-10 sm:w-12 sm:h-12"
                >
                  
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        className="relative z-10"
                        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        whileHover={!isMobile && !shouldReduceMotion ? {
                          scale: 1.1,
                          color: "rgb(196,166,105)"
                        } : {}}
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-all duration-300" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        className="relative z-10"
                        initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        whileHover={!isMobile && !shouldReduceMotion ? {
                          scale: 1.1,
                          color: "rgb(196,166,105)"
                        } : {}}
                      >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-all duration-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-primary/20 shadow-luxury"
              style={{ backgroundColor: 'rgba(229, 228, 226, 0.98)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-3 sm:space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-3 sm:p-4 text-left group relative overflow-hidden rounded-xl transition-all duration-500 ${
                        location.pathname === item.path
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {/* Simplified Background - Reduced for performance */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      />
                      
                      <div className="flex items-center space-x-3 sm:space-x-4 relative z-10">
                        {/* Icon - Simplified */}
                        <motion.span 
                          className="relative flex-shrink-0"
                          whileHover={{ 
                            scale: 1.1, 
                            color: "rgb(196,166,105)"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                            {item.icon}
                          </div>
                        </motion.span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-luxury font-semibold relative text-base sm:text-lg">
                            {item.name}
                          </div>
                          <div className="font-body text-xs sm:text-sm text-muted-foreground mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
         </AnimatePresence>
       </nav>

          {/* Spacer for fixed navigation */}
          <div className="h-16 sm:h-20" />
        </>
      )}

      {/* Cart Dashboard */}
      <CartDashboard 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default UltraNavigation;