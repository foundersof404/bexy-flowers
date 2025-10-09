import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Eye, ShoppingCart, Crown, Star, Zap, TrendingUp } from "lucide-react";
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

// Function to get tags for bouquets (similar to signature collection)
const getBouquetTags = (bouquet: Bouquet) => {
  const allTags = [
    { name: "BEST SELLING", color: "#70b3b1" },
    { name: "PREMIUM", color: "#d3b19a" },
    { name: "LIMITED", color: "#d05fa2" },
    { name: "FEATURED", color: "#70b3b1" },
    { name: "NEW", color: "#d05fa2" },
    { name: "EXCLUSIVE", color: "#d3b19a" },
    { name: "LUXURY", color: "#70b3b1" },
    { name: "SPECIAL", color: "#d05fa2" }
  ];
  
  // Assign tags based on bouquet properties
  if (bouquet.featured) {
    return [allTags[0], allTags[3]]; // Best Selling + Featured
  }
  if (bouquet.price > 300) {
    return [allTags[1], allTags[2]]; // Premium + Limited
  }
  if (bouquet.price > 200) {
    return [allTags[1], allTags[5]]; // Premium + Exclusive
  }
  return [allTags[4]]; // New
};

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

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {bouquets.map((bouquet, index) => {
        const tags = getBouquetTags(bouquet);
        const currentColor = '#C79E48'; // Gold color
        
        return (
        <motion.div
          key={bouquet.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1]
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group cursor-pointer w-full"
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
            {/* Card structure similar to signature collection - Fixed height only */}
            <div 
              className="card"
              style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: '1.25rem'
              }}
            >
              {/* Image Container - Increased by 30% */}
              <div 
                className="imgBox"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '17.55rem', // Increased by 30% from 13.5rem
                  borderRadius: '1.25rem 1.25rem 0 0',
                  overflow: 'hidden'
                }}
              >
                <motion.img
                  src={bouquet.image}
                  alt={bouquet.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  className="transition-all duration-300 ease-out group-hover:scale-105"
                />

                {/* Arrow and Eye Icons */}
                <div 
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    opacity: 0,
                    transform: 'translateX(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  className="group-hover:opacity-100 group-hover:translate-x-0"
                >
              <motion.div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '1px solid rgba(199, 158, 72, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      background: '#C79E48',
                      color: '#fff'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart style={{ width: '1rem', height: '1rem', color: '#8B6F3A' }} />
                  </motion.div>
                  
                  <motion.div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '1px solid rgba(199, 158, 72, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      background: '#C79E48',
                      color: '#fff'
                    }}
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
                    <Eye style={{ width: '1rem', height: '1rem', color: '#8B6F3A' }} />
                  </motion.div>
                </div>

                {/* Icon with sophisticated cut-out effect (similar to signature) */}
                <div 
                  className="icon"
                  style={{
                    position: 'absolute',
                    bottom: '-0.375rem',
                    right: '-0.375rem',
                    width: '4rem', // Slightly smaller
                    height: '4rem',
                    background:'#fff',
                    borderTopLeftRadius: '50%'
                  }}
                >
                  {/* Pseudo-element simulation with divs */}
                  <div 
                    style={{
                      position: 'absolute',
                      content: '""',
                      bottom: '0.375rem',
                      left: '-1.25rem',
                      background: 'transparent',
                      width: '1.25rem',
                      height: '1.25rem',
                      borderBottomRightRadius: '1.25rem',
                      boxShadow: '0.313rem 0.313rem 0 0.313rem #fff'
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      content: '""',
                      top: '-1.25rem',
                      right: '0.375rem',
                      background: 'transparent',
                      width: '1.25rem',
                      height: '1.25rem',
                      borderBottomRightRadius: '1.25rem',
                      boxShadow: "0.313rem 0.313rem 0 0.313rem #fff"
                    }}
                  />
                  
              <motion.div
                    className="iconBox"
                    style={{
                      position: 'absolute',
                      inset: '0.5rem',
                      background: currentColor,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: '0.3s'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
                    <span style={{ color: '#fff', fontSize: '1.2rem' }}>
                      👁️
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Content section */}
              <div 
                className="content"
                style={{
                  padding: '0.938rem 0.625rem',
                  borderRadius: '0 0 1.25rem 1.25rem',
                  height: 'calc(500px - 17.55rem)', // Fixed height minus image height
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <h3 
                  style={{
                    textTransform: 'capitalize',
                    fontSize: 'clamp(1.2rem, 1.1rem + 0.4vw, 1.5rem)',
                    color: '#111',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}
              >
                {bouquet.name}
                </h3>
                
                <p 
                  style={{
                    margin: '0 0 1rem',
                    color: '#565656',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}
                >
                {bouquet.description}
              </p>
              
                {/* Tags */}
                <ul 
                  style={{
                    margin: '0 0 1rem',
                    padding: '0',
                    listStyleType: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  {tags.map((tag, tagIndex) => (
                    <li 
                      key={tagIndex}
                      style={{
                        textTransform: 'uppercase',
                        background: '#f0f0f0',
                        color: tag.color,
                        fontWeight: '700',
                        fontSize: '0.7rem',
                        padding: '0.3rem 0.5rem',
                        borderRadius: '0.188rem'
                      }}
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>

                {/* Price at bottom (like signature collection) */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto'
                  }}
                >
                  <span 
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: currentColor
                    }}
                  >
                    ${bouquet.price}
                  </span>
                  
                  <Button
                    style={{
                      background: currentColor,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
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
                    <ShoppingCart style={{ width: '0.8rem', height: '0.8rem', marginRight: '0.25rem' }} />
                    Add to Cart
                  </Button>
                </div>
              </div>
          </div>
        </motion.div>
        );
      })}
    </div>
  );
};