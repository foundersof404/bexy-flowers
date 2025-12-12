import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFlyingHeart } from "@/contexts/FlyingHeartContext";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useProgressiveRender } from "@/hooks/useProgressiveRender";
import type { Bouquet } from "@/types/bouquet";

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

// Memoized individual card component for performance
const BouquetCard = memo(({ 
  bouquet, 
  index, 
  onBouquetClick 
}: { 
  bouquet: Bouquet; 
  index: number; 
  onBouquetClick: (bouquet: Bouquet) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const heartButtonRef = useRef<HTMLButtonElement | null>(null);
  const { addToCart } = useCartWithToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { triggerFlyingHeart } = useFlyingHeart();
  const navigate = useNavigate();
  
  const tags = getBouquetTags(bouquet);
  const isFav = isFavorite(bouquet.id);
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Premium Luxury Card */}
      <div 
        className="w-full rounded-2xl md:rounded-3xl overflow-hidden relative transition-all duration-300 ease-out"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f5f1 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered 
            ? '0 16px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(194, 154, 67, 0.25)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          willChange: isHovered ? 'transform' : 'auto',
          // ⚡ PERFORMANCE: CSS containment for better scroll performance
          contain: 'layout style paint'
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
                category: bouquet.displayCategory || 'Premium Bouquets'
              }
            }
          });
        }}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden aspect-square">
          <OptimizedImage
            src={bouquet.image}
            alt={bouquet.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            aspectRatio="1/1"
            objectFit="cover"
            priority={index < 4}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              filter: isHovered 
                ? 'brightness(1.03) contrast(1.01)'
                : 'brightness(1) contrast(1)',
              willChange: isHovered ? 'transform' : 'auto'
            }}
          />

          {/* Featured Badge */}
          {bouquet.featured && (
            <span 
              className="absolute top-2 left-2 md:top-4 md:left-4 px-2 py-0.5 md:px-3 md:py-[2px] rounded-full text-[9px] md:text-[10px] font-semibold tracking-wide text-white shadow-sm flex items-center gap-0.5 md:gap-1"
              style={{
                background: 'linear-gradient(90deg, #CFA340 0%, #EDD59E 100%)'
              }}
            >
              <span className="text-[10px] md:text-xs">👑</span> FEATURED
            </span>
          )}

          {/* Floating Action Buttons */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-1.5 md:gap-2 z-20">
            <button 
              ref={heartButtonRef}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                background: isFav ? 'rgba(220, 38, 127, 0.15)' : 'rgba(255, 255, 255, 0.7)',
                boxShadow: isFav ? '0 4px 12px rgba(220, 38, 127, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(8px)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                
                if (!isFav) {
                  const button = heartButtonRef.current;
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
                className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isFav ? 'fill-[#dc267f] text-[#dc267f]' : 'text-slate-700'}`} 
                strokeWidth={2} 
              />
            </button>
            
            <button 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(8px)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onBouquetClick(bouquet);
              }}
            >
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-700" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-3 md:p-4 lg:p-6 relative z-10">
          {/* Title */}
          <h2 className="font-serif font-bold text-gray-900 text-base md:text-lg lg:text-xl line-clamp-1">
            {bouquet.name}
          </h2>
          
          {/* Gold Underline */}
          <div className="relative h-[2px] mt-1 mb-3 w-20 overflow-hidden">
            <div 
              className="h-full absolute left-0 top-0 transition-all duration-500 ease-out"
              style={{
                background: 'linear-gradient(90deg, #C29A43 0%, #F6E4C2 100%)',
                width: isHovered ? '100%' : '0%'
              }}
            />
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-[11px] md:text-xs lg:text-sm line-clamp-2 mt-1">
            {bouquet.description}
          </p>

          {/* Tags */}
          <div className="flex gap-1 md:gap-1.5 lg:gap-2 mt-2 md:mt-3 flex-wrap">
            {tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-1.5 md:px-2 py-0.5 md:py-[3px] text-[9px] md:text-[10px] lg:text-[11px] rounded-md font-semibold"
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
          <div className="w-full border-t border-gray-200/70 my-3 md:my-4 lg:my-5"></div>

          {/* Price and Add to Cart */}
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span 
                  className="text-xl md:text-2xl lg:text-3xl font-bold"
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
                <span className="text-gray-500 text-xs md:text-sm ml-1">USD</span>
              </div>
            </div>

            <button
              className="w-full h-9 md:h-10 lg:h-12 rounded-lg md:rounded-xl font-semibold text-white flex items-center justify-center gap-1.5 md:gap-2 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-xs md:text-sm lg:text-base"
              style={{
                background: 'linear-gradient(90deg, #B88A44 0%, #F6E3B5 100%)',
                boxShadow: isHovered ? '0 6px 20px rgba(194, 154, 67, 0.4)' : '0 4px 12px rgba(184, 138, 68, 0.3)'
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
              <div 
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.08) 100%)'
                }}
              />
              
              <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10" strokeWidth={2} />
              <span className="relative z-10">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

BouquetCard.displayName = 'BouquetCard';

const BouquetGridComponent = ({ bouquets, onBouquetClick }: BouquetGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  
  // ⚡ PERFORMANCE: Progressive rendering for smooth initial load
  const itemsToRender = useProgressiveRender(bouquets.length, 12, 50);
  const visibleBouquets = bouquets.slice(0, itemsToRender);
  const totalImages = visibleBouquets.length;

  // Track image loading progress
  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  // Removed ScrollTrigger cleanup for better scroll performance

  return (
    <>
      {/* Loading progress indicator (optional) */}
      {imagesLoaded < totalImages && imagesLoaded > 0 && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Loading images... {imagesLoaded}/{totalImages}
          </div>
        </div>
      )}
      
      <div 
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 w-full px-0"
      >
        {visibleBouquets.map((bouquet, index) => (
          <BouquetCard
            key={bouquet.id}
            bouquet={bouquet}
            index={index}
            onBouquetClick={onBouquetClick}
          />
        ))}
      </div>
      
      {/* Progressive loading indicator */}
      {itemsToRender < bouquets.length && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <div className="w-4 h-4 border-2 border-[#C29A43] border-t-transparent rounded-full animate-spin" />
            <span>Loading {bouquets.length - itemsToRender} more bouquets...</span>
          </div>
        </div>
      )}
    </>
  );
};

// Export memoized version for better performance
export const BouquetGrid = memo(BouquetGridComponent);
