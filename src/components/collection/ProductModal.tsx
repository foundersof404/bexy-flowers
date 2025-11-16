import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { X, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bouquet } from "@/pages/Collection";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";

interface ProductModalProps {
  bouquet: Bouquet;
  onClose: () => void;
}

export const ProductModal = ({ bouquet, onClose }: ProductModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { addToCart } = useCartWithToast();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    
    // Modal entrance animation
    if (modalRef.current && imageRef.current) {
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

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose
      });
    } else {
      onClose();
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
    addToCart({
      id: typeof bouquet.id === 'string' ? parseInt(bouquet.id) : bouquet.id,
      title: bouquet.name,
      price: numericPrice,
      image: bouquet.image
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative max-w-6xl w-full max-h-[90vh] bg-card/95 backdrop-blur-xl border border-border/20 overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground bg-black/20 hover:bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid lg:grid-cols-2 gap-0 h-full">
          {/* Image Section */}
          <div className="relative h-64 lg:h-auto bg-gradient-to-b from-primary/5 to-transparent">
            <img
              ref={imageRef}
              src={bouquet.image}
              alt={bouquet.name}
              className="w-full h-full object-cover"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Floating Elements */}
            <div className="absolute top-6 left-6">
              {bouquet.featured && (
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>

            {/* Rating Stars */}
            <div className="absolute bottom-6 left-6 flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className="w-4 h-4 fill-primary text-primary" 
                />
              ))}
              <span className="ml-2 text-white text-sm">5.0 (124 reviews)</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="modal-content p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <motion.h1 
                  className="text-3xl lg:text-4xl font-luxury text-foreground mb-2"
                  layoutId={`bouquet-title-${bouquet.id}`}
                >
                  {bouquet.name}
                </motion.h1>
                <motion.p 
                  className="text-4xl font-luxury text-primary"
                  layoutId={`bouquet-price-${bouquet.id}`}
                >
                  ${bouquet.price}
                </motion.p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed font-body">
                  {bouquet.description}
                </p>
                
                <p className="text-muted-foreground leading-relaxed font-body">
                  Each bouquet is carefully handcrafted using premium flowers sourced from the finest growers. 
                  Our master florists ensure every arrangement meets our exacting standards for beauty and longevity.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-luxury text-foreground">Includes:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 font-body">
                    <li>• Premium flower selection</li>
                    <li>• Elegant gift wrapping</li>
                    <li>• Care instructions card</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-luxury text-foreground">Care:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 font-body">
                    <li>• Fresh water daily</li>
                    <li>• Trim stems every 2-3 days</li>
                    <li>• Keep away from direct sunlight</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  className="add-to-cart-btn flex-1 bg-primary hover:bg-primary-dark text-primary-foreground h-12 text-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 border-primary/30 hover:border-primary hover:bg-primary/10 ${
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
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite(bouquet.id) ? 'fill-[#dc267f] text-[#dc267f]' : 'text-primary'}`} 
                    strokeWidth={2}
                  />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-border/20 pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
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

        {/* Gold Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </motion.div>
  );
};