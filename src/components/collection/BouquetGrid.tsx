import { useEffect, useRef, useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFlyingHeart } from "@/contexts/FlyingHeartContext";
import { useNavigate } from "react-router-dom";
import type { Bouquet } from "@/pages/Collection";

gsap.registerPlugin(ScrollTrigger);

interface BouquetGridProps {
  bouquets: Bouquet[];
  onBouquetClick: (bouquet: Bouquet) => void;
}

// Function to get tags for bouquets - Premium Luxury Style
const getBouquetTags = (bouquet: Bouquet) => {
  const allTags = [
    { name: "BEST SELLING", color: "#977839", bgColor: "#f2efe7" },
    { name: "FEATURED", color: "#508f72", bgColor: "#eaf5f2" },
    { name: "PREMIUM", color: "#977839", bgColor: "#f2efe7" },
    { name: "LIMITED", color: "#d05fa2", bgColor: "#fde8f5" },
    { name: "NEW", color: "#508f72", bgColor: "#eaf5f2" },
    { name: "EXCLUSIVE", color: "#977839", bgColor: "#f2efe7" },
    { name: "LUXURY", color: "#508f72", bgColor: "#eaf5f2" }
  ];
  
  if (bouquet.featured) {
    return [allTags[0], allTags[1]];
  }
  if (bouquet.price > 300) {
    return [allTags[2], allTags[3]];
  }
  if (bouquet.price > 200) {
    return [allTags[2], allTags[6]];
  }
  return [allTags[4]];
};

const BouquetGridComponent = ({ bouquets, onBouquetClick }: BouquetGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const heartButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const { addToCart } = useCartWithToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { triggerFlyingHeart } = useFlyingHeart();
  const navigate = useNavigate();

  useEffect(() => {
    // Simplified animation - removed GSAP ScrollTrigger for better scroll performance
    // Framer Motion handles the initial animations on individual cards
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [bouquets]);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 w-full"
    >
      {bouquets.map((bouquet, index) => {
        const tags = getBouquetTags(bouquet);
        const [isHovered, setIsHovered] = useState(false);
        const isFav = isFavorite(bouquet.id);
        
        return (
          <motion.div
            key={bouquet.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.08,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="group cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Premium Luxury Card - Rounded Design with Hover Transformation */}
            <motion.div 
              className="max-w-sm mx-auto rounded-3xl overflow-hidden backdrop-blur-sm relative"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f5f1 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              animate={{
                y: isHovered ? -12 : 0,
                boxShadow: isHovered 
                  ? '0 18px 48px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(194, 154, 67, 0.3)'
                  : '0 8px 40px rgba(0, 0, 0, 0.08)',
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              onClick={() => {
                navigate(`/product/${bouquet.id}`, { 
                  state: { 
                    product: {
                      id: bouquet.id,
                      title: bouquet.name,
                      price: bouquet.price,
                      description: bouquet.description,
                      imageUrl: bouquet.image,
                      images: [bouquet.image, bouquet.image, bouquet.image],
                      category: 'Premium Bouquets'
                    }
                  }
                });
              }}
            >
              {/* Subtle Gold Border Overlay - Only Border, Not Full Coverage */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  boxShadow: isHovered 
                    ? 'inset 0 0 0 1px rgba(194, 154, 67, 0.3)'
                    : 'inset 0 0 0 0px rgba(194, 154, 67, 0)',
                  zIndex: 10
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Simplified Ambient Particles - Reduced for performance */}
              {isHovered && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(194, 154, 67, 0.6) 0%, transparent 70%)',
                        boxShadow: '0 0 4px rgba(194, 154, 67, 0.4)',
                        left: `${25 + i * 25}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        zIndex: 5
                      }}
                      animate={{
                        y: [0, -40],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}

              {/* Image Section with Golden Glow */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={bouquet.image}
                  alt={bouquet.name}
                  className="w-full h-80 object-cover"
                  animate={{ 
                    scale: isHovered ? 1.06 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    filter: isHovered 
                      ? 'brightness(1.05) contrast(1.02) saturate(1.05)'
                      : 'brightness(1) contrast(1) saturate(1)'
                  }}
                />

                {/* Golden Ambient Glow Around Bouquet */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(194, 154, 67, 0.2) 0%, transparent 60%)',
                    mixBlendMode: 'screen'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Simplified Bokeh Effect - Single Element for performance */}
                {isHovered && (
                  <motion.div
                    className="absolute w-24 h-24 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(246, 228, 194, 0.3) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      top: '20%',
                      right: '15%'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Featured Badge - Gold Gradient Pill */}
                {bouquet.featured && (
                  <span 
                    className="absolute top-4 left-4 px-3 py-[2px] rounded-full text-[10px] font-semibold tracking-wide text-white shadow-sm flex items-center gap-1"
                    style={{
                      background: 'linear-gradient(90deg, #CFA340 0%, #EDD59E 100%)'
                    }}
                  >
                    <span className="text-xs">👑</span> FEATURED
                  </span>
                )}

                {/* Floating Action Buttons - Enhanced Glass-morphism with Gold Halo */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <motion.button 
                    ref={(el) => { heartButtonRefs.current[bouquet.id] = el; }}
                    className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center relative overflow-visible"
                    style={{
                      background: isFav ? 'rgba(220, 38, 127, 0.2)' : 'rgba(255, 255, 255, 0.6)',
                      boxShadow: isFav ? '0 4px 12px rgba(220, 38, 127, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -2,
                      boxShadow: '0 6px 20px rgba(220, 38, 127, 0.4), 0 0 0 2px rgba(220, 38, 127, 0.3)',
                      background: 'rgba(220, 38, 127, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // Only trigger flying heart if adding to favorites (not removing)
                      if (!isFav) {
                        const button = heartButtonRefs.current[bouquet.id];
                        // Try to find the navbar heart button - look for button with heart icon before cart
                        const navButtons = document.querySelectorAll('nav button');
                        let navHeart: HTMLElement | null = null;
                        
                        for (let i = 0; i < navButtons.length; i++) {
                          const btn = navButtons[i];
                          if (btn.querySelector('svg') && btn.innerHTML.includes('Heart') && !btn.innerHTML.includes('ShoppingCart')) {
                            navHeart = btn as HTMLElement;
                            break;
                          }
                        }
                        
                        if (button && navHeart) {
                          const buttonRect = button.getBoundingClientRect();
                          const navRect = navHeart.getBoundingClientRect();
                          
                          triggerFlyingHeart(
                            buttonRect.left + buttonRect.width / 2,
                            buttonRect.top + buttonRect.height / 2,
                            navRect.left + navRect.width / 2,
                            navRect.top + navRect.height / 2
                          );
                        }
                      }
                      
                      toggleFavorite({
                        id: bouquet.id,
                        title: bouquet.name,
                        price: bouquet.price,
                        image: bouquet.image,
                        description: bouquet.description,
                        featured: bouquet.featured
                      });
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${isFav ? 'fill-[#dc267f] text-[#dc267f]' : 'text-slate-700'}`} 
                      strokeWidth={2} 
                    />
                  </motion.button>
                  
                  <motion.button 
                    className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center relative overflow-visible"
                    style={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -2,
                      boxShadow: '0 6px 20px rgba(194, 154, 67, 0.25), 0 0 0 2px rgba(194, 154, 67, 0.2)',
                      background: 'rgba(255, 255, 255, 0.75)'
                    }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBouquetClick(bouquet);
                    }}
                  >
                    <Eye className="w-4 h-4 text-slate-700" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 relative z-10">
                {/* Title with Hover Enhancement */}
                <motion.h2 
                  className="font-serif font-bold text-gray-900"
                  animate={{
                    fontSize: isHovered ? '1.53rem' : '1.5rem'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {bouquet.name}
                </motion.h2>
                
                {/* Gold Underline with Left-to-Right Completion Animation */}
                <div className="relative h-[2px] mt-1 mb-3 w-20 overflow-hidden">
                  <motion.div 
                    className="h-full absolute left-0 top-0"
                    style={{
                      background: 'linear-gradient(90deg, #C29A43 0%, #F6E4C2 100%)'
                    }}
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: isHovered ? '100%' : '0%'
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-[15px] line-clamp-2">
                  {bouquet.description}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mt-4">
                  {tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-[3px] text-[11px] rounded-md font-semibold"
                      style={{
                        backgroundColor: tag.bgColor,
                        color: tag.color
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-gray-200/70 my-5"></div>

                {/* Price and Add to Cart */}
                <div className="flex items-end justify-between">
                  <div>
                    <span 
                      className="text-3xl font-bold"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, #B7893C 0%, #E7D4A8 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                      }}
                    >
                      ${bouquet.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">USD</span>
                  </div>

                  <motion.button
                    className="w-44 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(90deg, #B88A44 0%, #F6E3B5 100%)',
                      boxShadow: '0 4px 12px rgba(184, 138, 68, 0.3)'
                    }}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: '0 8px 24px rgba(194, 154, 67, 0.5)'
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: parseInt(bouquet.id),
                        title: bouquet.name,
                        price: bouquet.price,
                        image: bouquet.image
                      });
                    }}
                  >
                    {/* Light Bevel Effect */}
                    <div 
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.08) 100%)'
                      }}
                    />
                    
                    <ShoppingCart className="w-4 h-4 relative z-10" strokeWidth={2} />
                    <span className="relative z-10">Add to Cart</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Export memoized version for better performance
export const BouquetGrid = memo(BouquetGridComponent);
