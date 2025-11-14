import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart, Crown, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartWithToast } from "@/hooks/useCartWithToast";
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

export const BouquetGrid = ({ bouquets, onBouquetClick }: BouquetGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartWithToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (gridRef.current && gridRef.current.children.length > 0) {
      const cards = gridRef.current.children;
      gsap.set(cards, { clearProps: "all" });
      
      gsap.fromTo(cards, 
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          force3D: true,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            refreshPriority: -1
          }
        }
      );
    }

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

              {/* Ambient Floral Particles - Subtle Gold Dust */}
              {isHovered && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(194, 154, 67, 0.6) 0%, transparent 70%)',
                        boxShadow: '0 0 4px rgba(194, 154, 67, 0.4)',
                        left: `${15 + i * 10}%`,
                        top: `${20 + (i % 3) * 20}%`,
                        zIndex: 5
                      }}
                      animate={{
                        y: [0, -30, -60],
                        x: [0, Math.sin(i) * 15, Math.sin(i) * 30],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.3,
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

                {/* Soft Bokeh Effect */}
                {isHovered && (
                  <>
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
                    <motion.div
                      className="absolute w-20 h-20 rounded-full pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(194, 154, 67, 0.25) 0%, transparent 70%)',
                        filter: 'blur(18px)',
                        bottom: '30%',
                        left: '20%'
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </>
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
                    }}
                  >
                    <Heart className="w-4 h-4 text-slate-700" strokeWidth={2} />
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
                    className="w-44 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden group/btn"
                    style={{
                      background: 'linear-gradient(90deg, #B88A44 0%, #F6E3B5 100%)',
                      boxShadow: '0 4px 12px rgba(184, 138, 68, 0.3)'
                    }}
                    animate={{
                      scale: isHovered ? 1.03 : 1,
                      boxShadow: isHovered 
                        ? '0 6px 20px rgba(184, 138, 68, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                        : '0 4px 12px rgba(184, 138, 68, 0.3)'
                    }}
                    whileHover={{
                      background: 'linear-gradient(90deg, #C29A43 0%, #F8D7A3 50%, #E8C882 100%)',
                      scale: 1.05,
                      boxShadow: '0 8px 24px rgba(194, 154, 67, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.4)'
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.23, 1, 0.32, 1],
                      background: { duration: 0.3 }
                    }}
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
                    {/* Powerful Color Transition Background */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(90deg, #C29A43 0%, #F8D7A3 50%, #E8C882 100%)',
                        opacity: 0
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Secondary Color Wave on Hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                        opacity: 0
                      }}
                      whileHover={{
                        opacity: [0, 1, 0],
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Inner Glow on Hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                      }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Light Bevel Effect */}
                    <div 
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.08) 100%)'
                      }}
                    />
                    
                    {/* Icon with Slide Animation */}
                    <motion.div
                      className="relative z-10"
                      animate={{
                        x: isHovered ? 0 : -4,
                        opacity: isHovered ? 1 : 0.8
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                    </motion.div>
                    
                    <motion.span 
                      className="relative z-10"
                      whileHover={{ letterSpacing: '0.5px' }}
                      transition={{ duration: 0.2 }}
                    >
                      Add to Cart
                    </motion.span>
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
