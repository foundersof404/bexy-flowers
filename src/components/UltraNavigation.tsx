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
  const [cartItems, setCartItems] = useState(3); // Mock cart count

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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            
            {/* Logo and Brand */}
            <motion.div
              ref={logoRef}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="relative p-2 hover:bg-primary/5 transition-all duration-500 group flex items-center rounded-lg"
                onClick={() => navigate('/')}
              >
                {/* Logo Container */}
                <motion.div 
                  className="w-20 h-20 relative"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <img
                    src={logoImage}
                    alt="𝓑𝓮𝔁𝔂 𝓯𝓵𝓸𝔀𝓮𝓻 Logo"
                    className="w-full h-full object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(196,166,105,0.4)]"
                  />
                </motion.div>
                
                {/* Brand Name */}
                <div className="ml-2">
                  <motion.h1 
                    className="font-luxury text-2xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(196,166,105,0.6)] [text-shadow:_0_0_12px_rgba(196,166,105,0.8)]"
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Button
                    variant="ghost"
                    className={`relative group font-body font-medium px-6 py-3 transition-all duration-500 overflow-hidden ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <motion.span 
                        className="transition-all duration-500"
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: [0, -10, 10, 0],
                          color: "rgb(196,166,105)"
                        }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.23, 1, 0.32, 1],
                          rotate: { duration: 0.4, repeat: 1, repeatType: "reverse" }
                        }}
                      >
                        {item.icon}
                      </motion.span>
                      <motion.span
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      >
                        {item.name}
                      </motion.span>
                    </span>
                    
                    {/* Elegant Background Hover Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 rounded-lg"
                      initial={{ scale: 0, opacity: 0, x: "-100%" }}
                      whileHover={{ scale: 1, opacity: 1, x: "0%" }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
                    />
                    
                    {/* Active Indicator */}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, x: '-50%' }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Cart & Menu */}
            <div className="flex items-center space-x-4 ml-8">
              {/* Cart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative group hover:bg-primary/10 transition-all duration-500 overflow-hidden rounded-lg"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      color: "rgb(196,166,105)"
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.23, 1, 0.32, 1],
                      rotate: { duration: 0.4, repeat: 1, repeatType: "reverse" }
                    }}
                  >
                    <ShoppingCart className="w-6 h-6 text-foreground transition-all duration-500" />
                  </motion.div>
                  
                  {/* Shimmer Effect for Cart */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
                  />
                  
                  {/* Cart Badge */}
                  {cartItems > 0 && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-luxury font-bold text-xs shadow-gold cart-pulse"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {cartItems}
                      </motion.span>
                    </motion.div>
                  )}
                  
                  {/* Cart Glow */}
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
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
                  className="relative group hover:bg-primary/10 transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
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
              <div className="px-6 py-8 space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-4 text-left group ${
                        location.pathname === item.path
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-luxury font-semibold">{item.name}</div>
                          <div className="font-body text-sm text-muted-foreground">
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
      <div className="h-20" />
    </>
  );
};

export default UltraNavigation;