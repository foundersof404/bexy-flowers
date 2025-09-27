import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Bouquet } from "@/pages/Collection";

gsap.registerPlugin(ScrollTrigger);

interface BouquetGridProps {
  bouquets: Bouquet[];
  onBouquetClick: (bouquet: Bouquet) => void;
}

export const BouquetGrid = ({ bouquets, onBouquetClick }: BouquetGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
    >
      {bouquets.map((bouquet, index) => (
        <motion.div
          key={bouquet.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
          className="group cursor-pointer"
          onClick={() => onBouquetClick(bouquet)}
        >
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/30 transition-all duration-500">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <motion.img
                src={bouquet.image}
                alt={bouquet.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              
              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Action Buttons */}
              <motion.div
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-10 h-10 bg-white/90 hover:bg-white text-black hover:text-primary backdrop-blur-sm"
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
                  className="w-10 h-10 bg-white/90 hover:bg-white text-black hover:text-primary backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBouquetClick(bouquet);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
              
              {/* Gold Border Animation */}
              <motion.div
                className="absolute inset-0 border-2 border-primary"
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
            <div className="p-6">
              <motion.h3 
                className="text-xl font-luxury text-foreground mb-2"
                whileHover={{ color: "hsl(var(--primary))" }}
                transition={{ duration: 0.2 }}
              >
                {bouquet.name}
              </motion.h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 font-body">
                {bouquet.description}
              </p>
              
              <div className="flex items-center justify-between">
                <motion.span 
                  className="text-2xl font-luxury text-primary"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  ${bouquet.price}
                </motion.span>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-primary hover:bg-primary-dark text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
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
        </motion.div>
      ))}
    </div>
  );
};