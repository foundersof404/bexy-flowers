import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { gsap } from "gsap";
import { X, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { Bouquet } from "@/pages/Collection";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductModalProps {
  bouquet: Bouquet;
  onClose: () => void;
}

export const ProductModal = ({ bouquet, onClose }: ProductModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartWithToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isMobile = useIsMobile();
  
  // Swipe-to-close functionality for mobile
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0]);
  const scale = useTransform(y, [0, 100], [1, 0.95]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    
    // Mobile-specific: Prevent background scroll on iOS
    if (isMobile) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
    
    // Modal entrance animation (simplified on mobile for performance)
    if (modalRef.current && imageRef.current) {
      if (isMobile) {
        // Simple fade-in on mobile
        gsap.set(modalRef.current, { opacity: 0, y: 20 });
        gsap.to(modalRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        // Desktop animation
        const tl = gsap.timeline();
        tl.set(modalRef.current, { scale: 0.8, opacity: 0 })
          .set(imageRef.current, { scale: 1.2, opacity: 0 })
          .to(modalRef.current, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.4, 
            ease: "power2.out" 
          })
          .to(imageRef.current, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.6, 
            ease: "power2.out" 
          }, "-=0.2")
          .from(".modal-content > *", {
            y: 30,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
          }, "-=0.3");
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      if (isMobile) {
        document.body.style.position = "";
        document.body.style.width = "";
      }
    };
  }, [isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        // Simple fade-out on mobile
        gsap.to(modalRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.2,
          ease: "power2.in",
          onComplete: onClose
        });
      } else {
        gsap.to(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: onClose
        });
      }
    } else {
      onClose();
    }
  };

  // Handle swipe gesture for mobile
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    
    setIsDragging(false);
    y.set(0); // Reset position
    
    // Close modal if swiped down more than 100px or with velocity > 500
    if (info.offset.y > 100 || info.velocity.y > 500) {
      handleClose();
    }
  };

  const handleDragStart = () => {
    if (isMobile) {
      setIsDragging(true);
    }
  };

  const handleAddToCart = () => {
    // Add liquid morph animation to button
    const button = document.querySelector('.add-to-cart-btn');
    if (button) {
      gsap.timeline()
        .to(button, { 
          scale: 0.95, 
          duration: 0.1 
        })
        .to(button, { 
          scale: 1.05, 
          backgroundColor: "hsl(var(--primary-glow))",
          duration: 0.2,
          ease: "power2.out"
        })
        .to(button, { 
          scale: 1, 
          backgroundColor: "hsl(var(--primary))",
          duration: 0.2 
        });
    }
    
    // Add to cart logic
    const numericPrice = typeof bouquet.price === 'string' ? parseFloat(bouquet.price.replace('$','')) : bouquet.price;
    const finalPrice = bouquet.discount_percentage && bouquet.discount_percentage > 0
      ? numericPrice * (1 - bouquet.discount_percentage / 100)
      : numericPrice;
    
    addToCart({
      id: typeof bouquet.id === 'string' ? parseInt(bouquet.id) : bouquet.id,
      title: bouquet.name,
      price: finalPrice,
      image: bouquet.image
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-2 md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        // Safe area insets for iOS devices
        paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: isMobile ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: isMobile ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          // Ensure backdrop respects safe areas
          top: isMobile ? 'env(safe-area-inset-top)' : 0,
          bottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
        }}
      />

      {/* Modal - Fully Responsive */}
      <motion.div 
        ref={modalRef}
        className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-card/95 backdrop-blur-xl border border-border/20 overflow-hidden shadow-2xl rounded-none sm:rounded-lg md:rounded-xl"
        style={{
          y: isMobile ? y : 0,
          opacity: isMobile ? opacity : 1,
          scale: isMobile ? scale : 1,
        }}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragDirectionLock
      >
        {/* Swipe Indicator for Mobile */}
        {isMobile && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-400/50 rounded-full z-20" />
        )}

        {/* Close Button - Touch-Friendly (48px minimum) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-50 text-white hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-target active:scale-95 transition-transform"
          onClick={handleClose}
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </Button>

        {/* Mobile Layout: Stacked | Desktop Layout: Side-by-Side */}
        <div className={`flex ${isMobile ? 'flex-col' : 'lg:grid lg:grid-cols-2'} gap-0 h-full max-h-[95vh] sm:max-h-[90vh]`}>
          {/* Image Section - Responsive Height */}
          <div 
            ref={imageRef}
            className={`relative ${
              isMobile 
                ? 'h-[220px] sm:h-[280px]' 
                : 'h-64 md:h-[400px] lg:h-auto lg:min-h-[500px]'
            } bg-gradient-to-b from-primary/5 to-transparent flex-shrink-0`}
          >
            <OptimizedImage
              src={bouquet.image}
              alt={bouquet.name}
              className="w-full h-full object-cover"
              priority={true}
              aspectRatio={isMobile ? "16/9" : "4/5"}
              objectFit="cover"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            
            {/* Floating Elements - Responsive Positioning */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 flex flex-col gap-2 z-20">
              {/* Out of Stock Badge - Priority */}
              {bouquet.is_out_of_stock && (
                <Badge className="bg-red-600 text-white text-xs sm:text-sm px-3 py-1.5 font-bold border-2 border-white/50 shadow-lg">
                  OUT OF STOCK
                </Badge>
              )}
              
              {/* In Stock Badge */}
              {!bouquet.is_out_of_stock && (
                <Badge className="bg-green-600 text-white text-xs sm:text-sm px-3 py-1.5 font-bold border-2 border-white/50 shadow-lg">
                  IN STOCK
                </Badge>
              )}

              {/* Featured Badge */}
              {bouquet.featured && !bouquet.is_out_of_stock && (
                <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm px-2 py-1">
                  Featured
                </Badge>
              )}

              {/* Discount Badge */}
              {bouquet.discount_percentage && bouquet.discount_percentage > 0 && (
                <Badge className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1.5 font-bold border-2 border-white/50 shadow-lg">
                  {bouquet.discount_percentage}% OFF
                </Badge>
              )}
            </div>

            {/* Rating Stars - Responsive Size */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary" 
                />
              ))}
              <span className="ml-1.5 sm:ml-2 text-white text-xs sm:text-sm font-body">5.0 (124)</span>
            </div>
          </div>

          {/* Content Section - Scrollable on Mobile */}
          <div 
            ref={contentRef}
            className={`modal-content ${
              isMobile 
                ? 'p-4 sm:p-5 flex flex-col flex-1 min-h-0 overflow-y-auto' 
                : 'p-6 sm:p-8 lg:p-12 flex flex-col justify-center'
            }`}
            style={{
              // Smooth scrolling on iOS
              WebkitOverflowScrolling: 'touch',
              // Custom scrollbar styling
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(194, 154, 67, 0.5) transparent',
            }}
          >
            <style>{`
              .modal-content::-webkit-scrollbar {
                width: 4px;
              }
              .modal-content::-webkit-scrollbar-track {
                background: transparent;
              }
              .modal-content::-webkit-scrollbar-thumb {
                background-color: rgba(194, 154, 67, 0.5);
                border-radius: 2px;
              }
            `}</style>
            
            <div className={`space-y-4 sm:space-y-5 md:space-y-6 ${isMobile ? 'pb-4' : ''}`}>
              {/* Header - Responsive Typography */}
              <div>
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl font-luxury text-foreground mb-1.5 sm:mb-2 leading-tight"
                  layoutId={`bouquet-title-${bouquet.id}`}
                >
                  {bouquet.name}
                </motion.h1>
                
                {/* Price Display with Discount */}
                <div className="flex items-baseline gap-2 sm:gap-3">
                  {bouquet.discount_percentage && bouquet.discount_percentage > 0 ? (
                    <>
                      <motion.span 
                        className="text-xl sm:text-2xl font-luxury text-gray-400 line-through"
                        layoutId={`bouquet-price-original-${bouquet.id}`}
                      >
                        ${bouquet.price.toFixed(2)}
                      </motion.span>
                      <motion.p 
                        className="text-3xl sm:text-4xl font-luxury text-red-600 leading-tight"
                        layoutId={`bouquet-price-${bouquet.id}`}
                      >
                        ${(bouquet.price * (1 - bouquet.discount_percentage / 100)).toFixed(2)}
                      </motion.p>
                      <Badge className="bg-red-500 text-white text-sm sm:text-base px-2 py-1">
                        {bouquet.discount_percentage}% OFF
                      </Badge>
                    </>
                  ) : (
                    <motion.p 
                      className="text-3xl sm:text-4xl font-luxury text-primary leading-tight"
                      layoutId={`bouquet-price-${bouquet.id}`}
                    >
                      ${bouquet.price.toFixed(2)}
                    </motion.p>
                  )}
                </div>

                {/* Stock Status Alert */}
                {bouquet.is_out_of_stock && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ This product is currently out of stock
                    </p>
                  </div>
                )}
              </div>

              {/* Description - Responsive Text */}
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-body">
                  {bouquet.description}
                </p>
                
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-body">
                  Each bouquet is carefully handcrafted using premium flowers sourced from the finest growers. 
                  Our master florists ensure every arrangement meets our exacting standards for beauty and longevity.
                </p>
              </div>

              {/* Features - Responsive Grid */}
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} sm:gap-4`}>
                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="font-luxury text-foreground text-base sm:text-lg">Includes:</h3>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 font-body">
                    <li>• Premium flower selection</li>
                    <li>• Elegant gift wrapping</li>
                    <li>• Care instructions card</li>
                  </ul>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="font-luxury text-foreground text-base sm:text-lg">Care:</h3>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 font-body">
                    <li>• Fresh water daily</li>
                    <li>• Trim stems every 2-3 days</li>
                    <li>• Keep away from direct sunlight</li>
                  </ul>
                </div>
              </div>

              {/* Actions - Stack on Mobile, Side-by-Side on Desktop */}
              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4'} pt-2 sm:pt-4`}>
                <Button
                  className={`add-to-cart-btn flex-1 h-14 sm:h-12 text-base sm:text-lg font-medium touch-target active:scale-95 transition-transform ${
                    bouquet.is_out_of_stock 
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-primary hover:bg-primary-dark text-primary-foreground'
                  }`}
                  onClick={handleAddToCart}
                  disabled={bouquet.is_out_of_stock}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: '56px', // Minimum touch target
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {bouquet.is_out_of_stock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className={`${
                    isMobile ? 'w-full h-14' : 'h-12 w-12'
                  } border-primary/30 hover:border-primary hover:bg-primary/10 touch-target active:scale-95 transition-transform ${
                    isFavorite(bouquet.id) ? 'bg-pink-50 border-pink-300' : ''
                  }`}
                  onClick={() => {
                    toggleFavorite({
                      id: bouquet.id,
                      title: bouquet.name,
                      price: bouquet.price,
                      image: bouquet.image,
                      description: bouquet.description,
                      featured: bouquet.featured
                    });
                  }}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: isMobile ? '56px' : '48px',
                  }}
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite(bouquet.id) ? 'fill-[#dc267f] text-[#dc267f]' : 'text-primary'}`} 
                    strokeWidth={2}
                  />
                  {isMobile && (
                    <span className="ml-2 text-sm font-medium">
                      {isFavorite(bouquet.id) ? 'Saved' : 'Save'}
                    </span>
                  )}
                </Button>
              </div>

              {/* Additional Info - Responsive Grid */}
              <div className="border-t border-border/20 pt-4 sm:pt-6">
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} text-xs sm:text-sm`}>
                  <div>
                    <span className="text-muted-foreground font-body">Delivery:</span>
                    <span className="ml-2 text-foreground font-body">Same day available</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-body">Guarantee:</span>
                    <span className="ml-2 text-foreground font-body">7-day freshness</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Accent Lines - Only on Desktop */}
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};