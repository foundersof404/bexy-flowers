import { useRef, memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFlyingHeart } from "@/contexts/FlyingHeartContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { collectionQueryKeys } from "@/hooks/useCollectionProducts";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { Bouquet } from "@/types/bouquet";

interface BouquetGridProps {
  bouquets: Bouquet[];
  onBouquetClick: (bouquet: Bouquet) => void;
  selectedCategory?: string;
}

// Helper function to get badge text for bouquet
const getBouquetBadge = (bouquet: Bouquet): string | undefined => {
  if (bouquet.is_out_of_stock) return undefined;
  if (bouquet.featured) return "FEATURED";
  if (bouquet.discount_percentage && bouquet.discount_percentage > 0) return `${bouquet.discount_percentage}% OFF`;
  if (bouquet.price > 300) return "PREMIUM";
  if (bouquet.price > 200) return "LUXURY";
  return undefined;
};

// Memoized individual card component with Arts-style design
const BouquetCard = memo(({ 
  bouquet, 
  index, 
  onBouquetClick 
}: { 
  bouquet: Bouquet; 
  index: number; 
  onBouquetClick: (bouquet: Bouquet) => void;
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const heartButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCartWithToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { triggerFlyingHeart } = useFlyingHeart();
  const queryClient = useQueryClient();
  
  const isFav = isFavorite(bouquet.id);
  const badge = getBouquetBadge(bouquet);
  const finalPrice = bouquet.discount_percentage && bouquet.discount_percentage > 0
    ? bouquet.price * (1 - bouquet.discount_percentage / 100)
    : bouquet.price;

  const handleClick = useCallback(() => {
    navigate(`/product/${bouquet.id}`, {
      state: {
        id: bouquet.id,
        name: bouquet.name,
        price: finalPrice,
        category: bouquet.category || bouquet.displayCategory || "Collection",
        description: bouquet.description,
        fullDescription: bouquet.description,
        images: [bouquet.image],
      },
    });
  }, [navigate, bouquet, finalPrice]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Prefetch product data on hover for instant navigation
    queryClient.prefetchQuery({
      queryKey: collectionQueryKeys.detail(bouquet.id),
      queryFn: async () => {
        const { getCollectionProduct } = await import('@/lib/api/collection-products');
        return getCollectionProduct(bouquet.id);
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, bouquet.id]);

  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
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
  }, [isFav, bouquet, toggleFavorite, triggerFlyingHeart]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bouquet.is_out_of_stock) {
      addToCart({
        id: parseInt(bouquet.id),
        title: bouquet.name,
        price: finalPrice,
        image: bouquet.image
      });
    }
  }, [bouquet, finalPrice, addToCart]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1.2,
        delay: index * 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group relative cursor-pointer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-black">
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'transform' }}
        >
          <OptimizedImage
            src={bouquet.image}
            alt={bouquet.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            priority={index < 4}
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80" />

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.4 }}
            className="absolute top-4 right-4 z-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm">
              <span className="text-white text-xs font-bold tracking-widest">
                {badge}
              </span>
            </div>
          </motion.div>
        )}

        {/* Out of Stock Badge */}
        {bouquet.is_out_of_stock && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.4 }}
            className="absolute top-4 right-4 z-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="px-3 py-1 bg-red-600/90 backdrop-blur-md border border-red-400/50 rounded-sm">
              <span className="text-white text-xs font-bold tracking-widest">
                OUT OF STOCK
              </span>
            </div>
          </motion.div>
        )}

        {/* Favorite Button */}
        <motion.button
          ref={heartButtonRef}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: isFav ? 'rgba(220, 38, 127, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={`w-5 h-5 ${isFav ? 'fill-[#dc267f] text-[#dc267f]' : 'text-white'}`} 
            strokeWidth={2} 
          />
        </motion.button>

        {/* Quick View Button */}
        <motion.button
          className="absolute top-16 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            e.stopPropagation();
            onBouquetClick(bouquet);
          }}
        >
          <Eye className="w-5 h-5 text-white" strokeWidth={2} />
        </motion.button>

        {/* Hover Overlay with Description */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 20,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-2"
            style={{ willChange: 'transform, opacity' }}
          >
            <p className="text-white/80 text-xs tracking-widest uppercase">
              {bouquet.displayCategory || bouquet.category || "Collection"}
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs line-clamp-2">
              {bouquet.description}
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative Corner Borders */}
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
          style={{ willChange: 'transform, opacity' }}
        />
      </div>

      {/* Card Info Below Image */}
      <motion.div
        className="mt-6 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-ultra-wide text-foreground">
              {bouquet.name.toUpperCase()}
            </h3>
            <p className="text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground mt-1">
              {bouquet.displayCategory || bouquet.category || "Collection"}
            </p>
          </div>
          <div className="text-right">
            {bouquet.discount_percentage && bouquet.discount_percentage > 0 ? (
              <div>
                <p className="text-xs line-through text-muted-foreground">
                  ${bouquet.price.toFixed(2)}
                </p>
                <p className="text-lg sm:text-xl font-bold tracking-wider text-foreground">
                  ${finalPrice.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-lg sm:text-xl font-bold tracking-wider text-foreground">
                ${bouquet.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className={`w-full h-12 rounded-sm font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 ${
            bouquet.is_out_of_stock ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            background: bouquet.is_out_of_stock 
              ? 'linear-gradient(90deg, #9CA3AF 0%, #D1D5DB 100%)'
              : 'linear-gradient(90deg, #B88A44 0%, #F6E3B5 100%)',
            boxShadow: bouquet.is_out_of_stock 
              ? '0 4px 12px rgba(156, 163, 175, 0.3)'
              : '0 4px 12px rgba(184, 138, 68, 0.3)'
          }}
          whileHover={bouquet.is_out_of_stock ? {} : { scale: 1.02 }}
          whileTap={bouquet.is_out_of_stock ? {} : { scale: 0.98 }}
          disabled={bouquet.is_out_of_stock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 relative z-10" strokeWidth={2} />
          <span className="relative z-10">
            {bouquet.is_out_of_stock ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </motion.button>

        {/* Animated Underline */}
        <motion.div
          className="h-px bg-gradient-to-r from-foreground via-foreground/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            originX: 0,
            willChange: 'transform'
          }}
        />
      </motion.div>
    </motion.div>
  );
});

BouquetCard.displayName = 'BouquetCard';

const BouquetGridComponent = ({ bouquets, onBouquetClick, selectedCategory }: BouquetGridProps) => {
  // Render all bouquets at once when data is ready to avoid extra work while scrolling
  const visibleBouquets = bouquets;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 w-full">
      {visibleBouquets.map((bouquet, index) => (
        <BouquetCard
          key={bouquet.id}
          bouquet={bouquet}
          index={index}
          onBouquetClick={onBouquetClick}
        />
      ))}
    </div>
  );
};

// Export memoized version for better performance
export const BouquetGrid = memo(BouquetGridComponent);
