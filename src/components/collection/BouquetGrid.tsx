import { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFlyingHeart } from "@/contexts/FlyingHeartContext";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
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
        className="max-w-sm mx-auto rounded-3xl overflow-hidden relative transition-all duration-300 ease-out"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f5f1 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered 
            ? '0 16px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(194, 154, 67, 0.25)'
            : '0 6px 30px rgba(0, 0, 0, 0.06)',
          willChange: isHovered ? 'transform' : 'auto'
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
        <div className="relative overflow-hidden h-48 sm:h-64 lg:h-80">
          <OptimizedImage
            src={bouquet.image}
            alt={bouquet.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            aspectRatio="4/5"
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
              className="absolute top-4 left-4 px-3 py-[2px] rounded-full text-[10px] font-semibold tracking-wide text-white shadow-sm flex items-center gap-1"
              style={{
                background: 'linear-gradient(90deg, #CFA340 0%, #EDD59E 100%)'
              }}
            >
              <span className="text-xs">👑</span> FEATURED
            </span>
          )}

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button 
              ref={heartButtonRef}
              className="w-10 h-10 rounded-full flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95"
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
                className={`w-4 h-4 ${isFav ? 'fill-[#dc267f] text-[#dc267f]' : 'text-slate-700'}`} 
                strokeWidth={2} 
              />
            </button>
            
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95"
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
              <Eye className="w-4 h-4 text-slate-700" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 sm:p-6 relative z-10">
          {/* Title */}
          <h2 className="font-serif font-bold text-gray-900 text-lg sm:text-xl">
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
          <p className="text-gray-600 leading-relaxed text-xs sm:text-[15px] line-clamp-2">
            {bouquet.description}
          </p>

          {/* Tags */}
          <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 flex-wrap">
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <span 
                className="text-2xl sm:text-3xl font-bold"
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

            <button
              className="w-full sm:w-44 h-11 sm:h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
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
              
              <ShoppingCart className="w-4 h-4 relative z-10" strokeWidth={2} />
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
  const totalImages = bouquets.length;

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
        className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full px-2 sm:px-0"
      >
        {bouquets.map((bouquet, index) => (
          <BouquetCard
            key={bouquet.id}
            bouquet={bouquet}
            index={index}
            onBouquetClick={onBouquetClick}
          />
        ))}
      </div>
    </>
  );
};

// Export memoized version for better performance
export const BouquetGrid = memo(BouquetGridComponent);
