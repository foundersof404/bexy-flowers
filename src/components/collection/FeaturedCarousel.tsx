import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Bouquet } from "@/pages/Collection";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface FeaturedCarouselProps {
  bouquets: Bouquet[];
  onBouquetClick: (bouquet: Bouquet) => void;
}

export const FeaturedCarousel = ({ bouquets, onBouquetClick }: FeaturedCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (carouselRef.current) {
      gsap.fromTo(carouselRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      <div 
        ref={carouselRef}
        className="max-w-7xl mx-auto px-4 lg:px-8"
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl lg:text-5xl font-luxury text-foreground mb-4">
            Featured <span className="text-primary">Masterpieces</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Our most coveted designs, crafted with rare flowers and premium materials
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="featured-swiper"
            style={{
              paddingTop: "50px",
              paddingBottom: "50px",
            }}
          >
            {bouquets.map((bouquet, index) => (
              <SwiperSlide
                key={bouquet.id}
                className="!w-80 !h-96"
              >
                <motion.div
                  className="relative h-full group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onBouquetClick(bouquet)}
                >
                  {/* Card */}
                  <div className="relative h-full bg-card/30 backdrop-blur-sm border border-border/20 overflow-hidden shadow-2xl">
                    {/* Image */}
                    <div className="relative h-2/3 overflow-hidden">
                      <img
                        src={bouquet.image}
                        alt={bouquet.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8 bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBouquetClick(bouquet);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8 bg-primary hover:bg-primary-dark text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to cart logic
                          }}
                        >
                          <ShoppingCart className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card/95 to-transparent backdrop-blur-sm">
                      <h3 className="text-xl font-luxury text-foreground mb-2">
                        {bouquet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 font-body">
                        {bouquet.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-luxury text-primary">
                          ${bouquet.price}
                        </span>
                        <div className="w-8 h-px bg-primary" />
                      </div>
                    </div>
                    
                    {/* Gold accent lines */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .featured-swiper .swiper-pagination {
            bottom: 10px !important;
          }
          
          .featured-swiper .swiper-pagination-bullet {
            background: hsl(var(--primary)) !important;
            opacity: 0.3 !important;
            width: 12px !important;
            height: 12px !important;
          }
          
          .featured-swiper .swiper-pagination-bullet-active {
            opacity: 1 !important;
            transform: scale(1.2) !important;
          }
          
          .featured-swiper .swiper-slide-shadow-left,
          .featured-swiper .swiper-slide-shadow-right {
            background: linear-gradient(to right, rgba(0,0,0,0.3), transparent) !important;
          }
          
          .featured-swiper .swiper-slide {
            transition: all 0.3s ease !important;
          }
        `
      }} />
    </section>
  );
};