import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import bouquet1 from '@/assets/bouquet-1.jpg';
import bouquet2 from '@/assets/bouquet-2.jpg';
import bouquet3 from '@/assets/bouquet-3.jpg';
import bouquet4 from '@/assets/bouquet-4.jpg';
import bouquet5 from '@/assets/bouquet-5.jpg';
import bouquet6 from '@/assets/bouquet-6.jpg';

gsap.registerPlugin(ScrollTrigger);

const bouquets = [
  {
    id: 1,
    name: "Royal Gold Elegance",
    price: "$299",
    image: bouquet1,
    description: "Luxurious gold roses with premium white accents"
  },
  {
    id: 2,
    name: "Platinum Serenity",
    price: "$349",
    image: bouquet2,
    description: "Pure white arrangement with silver details"
  },
  {
    id: 3,
    name: "Architectural Bloom",
    price: "$425",
    image: bouquet3,
    description: "Modern geometric design with premium flowers"
  },
  {
    id: 4,
    name: "Diamond Cascade",
    price: "$289",
    image: bouquet4,
    description: "Cascading white roses with crystal accents"
  },
  {
    id: 5,
    name: "Golden Dynasty",
    price: "$399",
    image: bouquet5,
    description: "Imperial golden arrangement with regal presence"
  },
  {
    id: 6,
    name: "Minimalist Luxury",
    price: "$329",
    image: bouquet6,
    description: "Clean lines with maximum impact design"
  }
];

const UltraFeaturedBouquets = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (section && cards.length > 0) {
      // Staggered reveal animation
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(cards, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.15,
            ease: "power3.out"
          });
        }
      });

      // Set initial states
      gsap.set(cards, { y: 100, opacity: 0, rotateX: -15 });

      // 3D hover effects for each card
      cards.forEach((card, index) => {
        const image = card.querySelector('.bouquet-image');
        const overlay = card.querySelector('.card-overlay');
        const actions = card.querySelector('.card-actions');
        const border = card.querySelector('.gold-border');

        let hoverTl: gsap.core.Timeline;

        card.addEventListener('mouseenter', () => {
          hoverTl = gsap.timeline();
          
          hoverTl
            .to(card, {
              duration: 0.6,
              rotateX: 5,
              rotateY: 5,
              z: 50,
              scale: 1.02,
              ease: "power2.out"
            })
            .to(image, {
              duration: 0.6,
              scale: 1.1,
              rotateZ: 2,
              ease: "power2.out"
            }, 0)
            .to(overlay, {
              duration: 0.4,
              opacity: 1,
              ease: "power2.out"
            }, 0.2)
            .to(actions, {
              duration: 0.5,
              y: 0,
              opacity: 1,
              ease: "power2.out"
            }, 0.3)
            .to(border, {
              duration: 0.8,
              strokeDasharray: "0, 1000",
              ease: "power2.inOut"
            }, 0);
        });

        card.addEventListener('mouseleave', () => {
          if (hoverTl) hoverTl.kill();
          
          gsap.to(card, {
            duration: 0.4,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            scale: 1,
            ease: "power2.out"
          });
          gsap.to(image, {
            duration: 0.4,
            scale: 1,
            rotateZ: 0,
            ease: "power2.out"
          });
          gsap.to(overlay, {
            duration: 0.3,
            opacity: 0,
            ease: "power2.out"
          });
          gsap.to(actions, {
            duration: 0.3,
            y: 20,
            opacity: 0,
            ease: "power2.out"
          });
          gsap.to(border, {
            duration: 0.5,
            strokeDasharray: "1000, 1000",
            ease: "power2.out"
          });
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-32 px-4 bg-gradient-platinum relative overflow-hidden"
      data-section="signature-collection"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(51 100% 50% / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(51 100% 50% / 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="font-luxury text-5xl md:text-7xl font-bold text-foreground mb-6 text-3d"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            SIGNATURE COLLECTION
          </motion.h2>
          <div className="w-32 h-px bg-primary mx-auto mb-8" />
          <p className="font-body text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Each arrangement is meticulously crafted using the finest premium flowers, 
            designed with architectural precision to create stunning visual masterpieces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {bouquets.map((bouquet, index) => (
            <motion.div
              key={bouquet.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group perspective-1000 cursor-pointer w-full max-w-[384px]"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
              viewport={{ once: true }}
            >
              <div className="relative bg-card shadow-sharp hover:shadow-3d transition-3d transform-3d overflow-hidden rounded-xl">
                {/* Gold Border Animation */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  style={{ strokeDasharray: "1000, 1000" }}
                >
                  <rect
                    className="gold-border"
                    x="2"
                    y="2"
                    width="calc(100% - 4px)"
                    height="calc(100% - 4px)"
                    stroke="hsl(51 100% 50%)"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>

                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                  <img
                    src={bouquet.image}
                    alt={bouquet.name}
                    className="bouquet-image w-full h-full object-cover transition-3d"
                  />
                  
                  {/* Overlay */}
                  <div className="card-overlay absolute inset-0 bg-foreground/20 opacity-0 transition-3d" />
                  
                  {/* Floating Actions */}
                  <div className="card-actions absolute top-4 right-4 flex flex-col gap-2.5 opacity-0 translate-y-5 transition-3d">
                    <Button size="icon" className="h-9 w-9 bg-primary/90 hover:bg-primary text-primary-foreground shadow-gold backdrop-blur-sm">
                      <Heart className="w-4.5 h-4.5" />
                    </Button>
                    <Button size="icon" className="h-9 w-9 bg-primary/90 hover:bg-primary text-primary-foreground shadow-gold backdrop-blur-sm">
                      <Eye className="w-4.5 h-4.5" />
                    </Button>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 font-luxury font-bold text-lg shadow-gold rounded">
                    {bouquet.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-card relative z-10">
                  <h3 className="font-luxury text-2xl font-bold text-card-foreground mb-3">
                    {bouquet.name}
                  </h3>
                  <p className="font-body text-base text-muted-foreground mb-5 leading-relaxed">
                    {bouquet.description}
                  </p>
                  
                  <Button
                    className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-3d font-semibold py-4 shadow-sharp hover:shadow-gold group text-base"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3 group-hover:animate-pulse-gold" />
                    ADD TO COLLECTION
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="font-body text-lg px-12 py-6 bg-primary text-primary-foreground font-semibold shadow-luxury hover:shadow-3d hover:glow-intense transition-3d group"
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              navigate('/collection');
              requestAnimationFrame(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              });
            }}
          >
            VIEW COMPLETE COLLECTION
            <motion.div
              className="ml-3 group-hover:translate-x-2 transition-transform duration-300"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default UltraFeaturedBouquets;