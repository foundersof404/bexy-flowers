import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    path: "/custom",
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
  const cartItems = getTotalItems();

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;

    if (nav && logo) {
      // Initial logo animation
      gsap.set(logo, { scale: 0, rotation: -180 });
      gsap.to(logo, {
        duration: 2,
        scale: 1,
        rotation: 0,
        ease: "elastic.out(1, 0.3)"
      });

       // Set initial platinum background immediately - no transitions
       gsap.set(nav, {
         backgroundColor: "rgba(229, 228, 226, 0.95)", // Always start with platinum
         backdropFilter: "blur(20px)",
         boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
         immediateRender: true // Force immediate render
       });

       // Scroll effect - maintain platinum background throughout
       ScrollTrigger.create({
         trigger: document.body,
         start: "top top",
         end: "bottom top",
         onUpdate: (self) => {
           setIsScrolled(self.progress > 0.1);
           
           // Always maintain platinum background with slight opacity adjustment
           gsap.to(nav, {
             duration: 0.3,
             backgroundColor: self.progress > 0.1 
               ? "rgba(229, 228, 226, 0.98)" // Slightly more opaque when scrolled
               : "rgba(229, 228, 226, 0.95)", // Slightly less opaque at top
             backdropFilter: "blur(20px)",
             boxShadow: self.progress > 0.1 
               ? "0 8px 32px rgba(0,0,0,0.15)"
               : "0 8px 32px rgba(0,0,0,0.1)",
             ease: "power2.out"
           });
         }
       });

      // Logo hover effect
      const logoButton = logo.querySelector('button');
      if (logoButton) {
        logoButton.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            duration: 0.6,
            scale: 1.1,
            rotation: 5,
            ease: "power2.out"
          });
        });

        logoButton.addEventListener('mouseleave', () => {
          gsap.to(logo, {
            duration: 0.6,
            scale: 1,
            rotation: 0,
            ease: "power2.out"
          });
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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

       <nav
         ref={navRef}
         className="ultra-navigation fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-luxury"
         style={{
           backgroundColor: 'transparent', // Make header transparent
           transition: 'none' // Remove transition to prevent black flash
         }}
       >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo and Brand */}
            <motion.div
              ref={logoRef}
              className="flex items-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="relative p-1 sm:p-2 hover:bg-primary/5 transition-all duration-500 group flex items-center rounded-lg"
                onClick={() => navigate('/')}
              >
                {/* Logo Container - Responsive sizing */}
                <motion.div 
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <img
                    src={logoImage}
                    alt="𝓑𝓮𝔁𝔂 𝓯𝓵𝓸𝔀𝓮𝓻 Logo"
                    className="w-full h-full object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(196,166,105,0.4)]"
                  />
                </motion.div>
                
                {/* Brand Name - Hidden on very small screens */}
                <div className="ml-1 sm:ml-2 hidden xs:block">
                  <motion.h1 
                    className="font-luxury text-lg sm:text-xl lg:text-2xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(196,166,105,0.6)] [text-shadow:_0_0_12px_rgba(196,166,105,0.8)]"
                    whileHover={{ 
                      scale: 1.02,
                      textShadow: "0 0 20px rgba(196,166,105,1), 0 0 30px rgba(196,166,105,0.8)"
                    }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    𝓑𝓮𝔁𝔂 𝓯𝓵𝓸𝔀𝓮𝓻
                  </motion.h1>
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
                        className="transition-all duration-500 relative"
                        whileHover={{ 
                          scale: 1.2, 
                          rotateY: [0, 15, -15, 0],
                          rotateX: [0, 10, -10, 0],
                          color: "rgb(196,166,105)",
                          filter: "drop-shadow(0 0 8px rgba(196,166,105,0.6))"
                        }}
                        transition={{ 
                          duration: 0.8, 
                          ease: [0.23, 1, 0.32, 1],
                          rotateY: { duration: 0.6, repeat: 1, repeatType: "reverse" },
                          rotateX: { duration: 0.6, repeat: 1, repeatType: "reverse" }
                        }}
                      >
                        {item.icon}
                        
                        {/* Icon Glow Effect */}
                        <motion.div
                          className="absolute inset-0 bg-primary/30 rounded-full blur-md"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.5, opacity: 0.6 }}
                          transition={{ duration: 0.4 }}
                        />
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
                    
                    {/* Multi-layered Background Effects */}
                    
                    {/* Primary Background Gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 rounded-lg"
                      initial={{ scale: 0, opacity: 0, x: "-100%" }}
                      whileHover={{ scale: 1, opacity: 1, x: "0%" }}
                      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    />
                    
                    {/* Secondary Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 1 }}
                      transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                    />
                    
                    {/* Pulsing Border Effect */}
                    <motion.div
                      className="absolute inset-0 border border-primary/30 rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ 
                        opacity: 1, 
                        scale: 1,
                        borderColor: "rgba(196,166,105,0.6)"
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary/60 rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 0.8, 0],
                            y: [0, -10, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Active Indicator with Enhanced Animation */}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          x: '-50%',
                          boxShadow: "0 0 10px rgba(196,166,105,0.6)"
                        }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      />
                    )}
                    
                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-lg blur-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.2, opacity: 0.3 }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Cart & Menu with Enhanced Hover Effects */}
            <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-4">
              {/* Cart with Advanced Hover Effects */}
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
                  {/* Cart Icon with 3D Effects */}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ 
                      scale: 1.15, 
                      rotateY: [0, 20, -20, 0],
                      rotateX: [0, 15, -15, 0],
                      color: "rgb(196,166,105)",
                      filter: "drop-shadow(0 0 12px rgba(196,166,105,0.8))"
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.23, 1, 0.32, 1],
                      rotateY: { duration: 0.6, repeat: 1, repeatType: "reverse" },
                      rotateX: { duration: 0.6, repeat: 1, repeatType: "reverse" }
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-all duration-500" />
                    
                    {/* Icon Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/40 rounded-full blur-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.8, opacity: 0.7 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                  
                  {/* Multi-layered Background Effects */}
                  
                  {/* Primary Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                  />
                  
                  {/* Pulsing Border */}
                  <motion.div
                    className="absolute inset-0 border border-primary/30 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 1,
                      borderColor: "rgba(196,166,105,0.6)"
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Cart Badge with Enhanced Animation */}
                  {cartItems > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-luxury font-bold text-xs shadow-gold cart-pulse relative z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 360,
                        boxShadow: "0 0 20px rgba(196,166,105,0.8)"
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
                  
                  {/* Overall Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-lg blur-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.3, opacity: 0.4 }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>

              {/* Mobile Menu Button with Enhanced Effects */}
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
                  className="relative group hover:bg-primary/10 transition-all duration-500 overflow-hidden rounded-lg w-10 h-10 sm:w-12 sm:h-12"
                >
                  {/* Background Effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  />
                  
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                  />
                  
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        className="relative z-10"
                        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        whileHover={{
                          scale: 1.1,
                          color: "rgb(196,166,105)",
                          filter: "drop-shadow(0 0 8px rgba(196,166,105,0.6))"
                        }}
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-all duration-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        className="relative z-10"
                        initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        whileHover={{
                          scale: 1.1,
                          color: "rgb(196,166,105)",
                          filter: "drop-shadow(0 0 8px rgba(196,166,105,0.6))"
                        }}
                      >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground transition-all duration-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-lg blur-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2, opacity: 0.3 }}
                    transition={{ duration: 0.6 }}
                  />
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
                      {/* Background Effects */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl"
                        initial={{ scale: 0, opacity: 0, x: "-100%" }}
                        whileHover={{ scale: 1, opacity: 1, x: "0%" }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                      />
                      
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                      />
                      
                      <div className="flex items-center space-x-3 sm:space-x-4 relative z-10">
                        {/* Icon with Enhanced Animation */}
                        <motion.span 
                          className="relative flex-shrink-0"
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: [0, -10, 10, 0],
                            color: "rgb(196,166,105)",
                            filter: "drop-shadow(0 0 8px rgba(196,166,105,0.6))"
                          }}
                          transition={{ 
                            duration: 0.6, 
                            ease: [0.23, 1, 0.32, 1],
                            rotate: { duration: 0.4, repeat: 1, repeatType: "reverse" }
                          }}
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                            {item.icon}
                          </div>
                          
                          {/* Icon Glow */}
                          <motion.div
                            className="absolute inset-0 bg-primary/30 rounded-full blur-md"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.5, opacity: 0.6 }}
                            transition={{ duration: 0.4 }}
                          />
                        </motion.span>
                        
                        <div className="flex-1 min-w-0">
                          {/* Title with Animation */}
                          <motion.div 
                            className="font-luxury font-semibold relative text-base sm:text-lg"
                            whileHover={{
                              scale: 1.05,
                              textShadow: "0 0 8px rgba(196,166,105,0.5)"
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.name}
                            
                            {/* Title Underline */}
                            <motion.div
                              className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                              initial={{ width: 0, opacity: 0 }}
                              whileHover={{ width: "100%", opacity: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </motion.div>
                          
                          {/* Description with Fade Effect */}
                          <motion.div 
                            className="font-body text-xs sm:text-sm text-muted-foreground mt-1"
                            whileHover={{
                              color: "rgba(196,166,105,0.8)",
                              scale: 1.02
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.description}
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(2)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary/60 rounded-full"
                            style={{
                              left: `${20 + i * 60}%`,
                              top: `${30 + (i % 2) * 40}%`,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ 
                              scale: [0, 1, 0],
                              opacity: [0, 0.8, 0],
                              y: [0, -8, 0]
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.4,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Glow Effect */}
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-xl blur-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1, opacity: 0.3 }}
                        transition={{ duration: 0.6 }}
                      />
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

      {/* Cart Dashboard */}
      <CartDashboard 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default UltraNavigation;