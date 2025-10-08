import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";
import { Card } from "@/components/ui/card";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useNavigate } from "react-router-dom";
import type { Bouquet } from "@/pages/Collection";

gsap.registerPlugin(ScrollTrigger);

interface BouquetGridProps {
  bouquets: Bouquet[];
  onBouquetClick: (bouquet: Bouquet) => void;
}

export const BouquetGrid = ({ bouquets, onBouquetClick }: BouquetGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartWithToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (gridRef.current && gridRef.current.children.length > 0) {
      const cards = gridRef.current.children;
      
      // Reset previous animations
      gsap.set(cards, { clearProps: "all" });
      
      // Staggered reveal animation
      gsap.fromTo(cards, 
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotationX: -15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [bouquets]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
    >
      {bouquets.map((bouquet, index) => (
        <motion.div
          key={bouquet.id}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
          whileHover={{ y: -10 }}
          className="group cursor-pointer max-w-[280px] mx-auto sm:max-w-none"
          onClick={() => {
            navigate(`/product/${bouquet.id}`, { 
              state: { 
                product: {
                  id: bouquet.id,
                  title: bouquet.name,
                  price: bouquet.price,
                  description: bouquet.description,
                  imageUrl: bouquet.image,
                  images: [bouquet.image, bouquet.image, bouquet.image], // Using same image for demo
                  category: 'Premium Bouquets'
                }
              }
            });
          }}
        >
          {/* Gradient border wrapper for polished edge */}
          <div className="rounded-lg p-[1px] bg-gradient-to-r from-[var(--lux-edge-from)] to-[var(--lux-edge-to)] group/card">
          <Card className="relative overflow-hidden rounded-lg bg-white/60 backdrop-blur-sm border-transparent shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-500">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden transform-gpu">
              <motion.div transition={{ duration: 0.7, ease: "easeOut" }} className="w-full h-full">
                <OptimizedImage
                  src={bouquet.image}
                  alt={bouquet.name}
                  className="w-full h-full object-cover ring-0 group-hover/card:ring-1 group-hover/card:ring-amber-200"
                  style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
                />
              </motion.div>
              
              {/* Hover Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(180deg, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.25) 100%)"
                }}
              />

              {/* Bottom gradient to make price stand out */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
              {/* Inset border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_40px_rgba(251,191,36,0.12)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
              
              {/* Action Buttons */}
              <motion.div
                className="absolute top-4 right-4"
                initial={{ opacity: 0, y: -10, x: 10 }}
                whileHover={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/40 px-2 py-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-9 h-9 bg-white/90 hover:bg-white text-black hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to wishlist logic
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-9 h-9 bg-white/90 hover:bg-white text-black hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
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
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
              
              {/* Gold Border Animation */}
              <motion.div
                className="absolute inset-0 rounded-lg border border-amber-300/30"
                initial={{ 
                  clipPath: "inset(0 100% 100% 0)" 
                }}
                whileHover={{ 
                  clipPath: "inset(0 0 0 0)",
                  transition: {
                    duration: 0.6,
                    ease: "easeInOut"
                  }
                }}
              />
            </div>
            
            {/* Card Content */}
            <div className="p-2.5 sm:p-3">
              <motion.h3 
                className="text-sm sm:text-base lg:text-lg font-luxury tracking-tight text-slate-900 mb-1"
                whileHover={{ color: "hsl(var(--primary))" }}
                transition={{ duration: 0.2 }}
              >
                {bouquet.name}
              </motion.h3>
              
              <p className="text-slate-600/90 text-xs tracking-wide mb-2 line-clamp-2 font-body">
                {bouquet.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <motion.span 
                  className="inline-flex items-center gap-1 text-sm sm:text-base font-luxury text-amber-700 rounded-md bg-gradient-to-r from-amber-100 to-zinc-100 shadow-sm px-1.5 sm:px-2 py-0.5 border border-amber-200/60"
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Crown className="w-3 h-3 text-amber-600" />
                  ${bouquet.price}
                </motion.span>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    className="w-full sm:w-auto rounded-md border border-amber-300/60 bg-white text-slate-900 hover:text-white transition-all duration-300 bg-[length:200%_100%] bg-gradient-to-r from-white via-amber-400 to-amber-600 hover:bg-[position:100%_0] text-xs"
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
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* 3D Hover Effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              whileHover={{
                rotateX: 2,
                rotateY: 2,
                z: 10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              style={{ 
                transformStyle: "preserve-3d",
                transformOrigin: "center center"
              }}
            />
          </Card>
          </div>
        </motion.div>
      ))}
    </div>
  );
};