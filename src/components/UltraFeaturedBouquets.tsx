import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye, Crown } from 'lucide-react';
import { useCartWithToast } from '@/hooks/useCartWithToast';
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
  const { addToCart } = useCartWithToast();
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

      // Enhanced 3D hover effects for modern cards
      cards.forEach((card, index) => {
        const image = card.querySelector('img');
        const actionButtons = card.querySelector('[class*="absolute top-4 right-4"]');
        const priceTag = card.querySelector('[class*="absolute bottom-4 left-4"]');
        const button = card.querySelector('button');
        const glitterContainer = card.querySelector('[class*="Modern Dynamic Glitter Effect"]');

        let hoverTl: gsap.core.Timeline;

        card.addEventListener('mouseenter', () => {
          hoverTl = gsap.timeline();
          
          hoverTl
            .to(card, {
              duration: 0.5,
              rotateX: 3,
              rotateY: 3,
              z: 30,
              scale: 1.02,
              ease: "power2.out"
            })
            .to(image, {
              duration: 0.6,
              scale: 1.08,
              filter: "brightness(1.1) saturate(1.1)",
              ease: "power2.out"
            }, 0)
            .to(actionButtons, {
              duration: 0.4,
              y: 0,
              opacity: 1,
              ease: "back.out(1.7)"
            }, 0.1)
            .to(priceTag, {
              duration: 0.3,
              y: -3,
              scale: 1.05,
              ease: "power2.out"
            }, 0.2)
            .to(button, {
              duration: 0.4,
              y: -1,
              scale: 1.02,
              ease: "power2.out"
            }, 0.2)
            .to(glitterContainer, {
              duration: 0.8,
              opacity: 1,
              ease: "power2.out"
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
            filter: "brightness(1) saturate(1)",
            ease: "power2.out"
          });
          gsap.to(actionButtons, {
            duration: 0.3,
            y: -8,
            opacity: 0,
            ease: "power2.out"
          });
          gsap.to(priceTag, {
            duration: 0.3,
            y: 0,
            scale: 1,
            ease: "power2.out"
          });
          gsap.to(button, {
            duration: 0.3,
            y: 0,
            scale: 1,
            ease: "power2.out"
          });
          gsap.to(glitterContainer, {
            duration: 0.5,
            opacity: 0,
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
      className="py-32 px-4 relative overflow-hidden min-h-screen"
      data-section="signature-collection"
      style={{
        background: 'rgb(211, 211, 209)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
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
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          {/* Modern Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/10 to-slate-700/10 backdrop-blur-xl border border-slate-600/20 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 tracking-wider uppercase">Signature Excellence</span>
          </motion.div>

          {/* Luxury Typography with Gold Accent */}
          <motion.h2 
            className="font-luxury text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            SIGNATURE COLLECTION
            {/* Animated Gold Underline */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '120px' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-8">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45 shadow-lg shadow-amber-500/50" />
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="font-body text-base md:text-lg text-slate-500 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Immerse yourself in our signature arrangements, where each piece represents 
            the pinnacle of floral artistry and architectural design excellence.
          </motion.p>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl px-4 sm:px-6">
          {bouquets.map((bouquet, index) => (
            <motion.div
              key={bouquet.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group cursor-pointer w-full max-w-[350px] mx-auto sm:max-w-none lg:max-w-[400px] xl:max-w-none"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
              viewport={{ once: true }}
            >
              {/* Modern glassmorphism card with enhanced border */}
              <div className="relative group/card">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-700 ease-out overflow-hidden group hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:scale-[1.02]">
                
                {/* Modern Image Container with Enhanced Design */}
                <div className="relative overflow-hidden aspect-[4/4.5] bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-2xl">
                  <motion.img
                    src={bouquet.image}
                    alt={bouquet.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out will-change-transform group-hover/card:scale-110 group-hover/card:brightness-110"
                    whileHover={{ scale: 1.05 }}
                  />
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-800/20 to-transparent transition-all duration-700 ease-out group-hover/card:from-slate-900/50 group-hover/card:via-slate-800/10" />
                  
                  {/* Dynamic Pattern Overlay */}
                  <div className="absolute inset-0 opacity-30 group-hover/card:opacity-50 transition-opacity duration-700" 
                       style={{
                         backgroundImage: `radial-gradient(circle at 20% 80%, rgba(251,191,36,0.15) 0%, transparent 50%),
                                         radial-gradient(circle at 80% 20%, rgba(245,158,11,0.15) 0%, transparent 50%)`
                       }} />
                  
                  {/* Floating light effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/card:opacity-100 group-hover/card:animate-pulse transition-opacity duration-700" />

                  {/* Modern floating action buttons */}
                  <div className="absolute top-4 right-4 opacity-0 -translate-y-2 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:translate-x-0 transition-all duration-500">
                    <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-xl shadow-lg border border-white/50 px-1 py-1">
                      <motion.button 
                        className="w-10 h-10 bg-gradient-to-br from-white to-amber-50 rounded-full flex items-center justify-center text-slate-700 hover:text-amber-600 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        className="w-10 h-10 bg-gradient-to-br from-white to-amber-50 rounded-full flex items-center justify-center text-slate-700 hover:text-amber-600 shadow-sm hover:shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Modern luxury price tag */}
                  <motion.div 
                    className="absolute bottom-4 left-4 rounded-xl bg-gradient-to-r from-amber-500/90 to-yellow-400/90 backdrop-blur-sm text-white px-4 py-2 font-luxury font-bold text-sm shadow-lg border border-amber-300/30 inline-flex items-center gap-2" 
                    whileHover={{ y: -3, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Crown className="w-4 h-4 text-white" />
                    {bouquet.price}
                  </motion.div>
                </div>

                {/* Enhanced glassmorphism content section */}
                <div className="p-6 bg-white/60 backdrop-blur-2xl border-t border-white/40 relative rounded-b-2xl">
                  <h3 className="font-luxury text-xl font-bold text-slate-800 mb-3 tracking-tight group-hover/card:text-amber-600 transition-all duration-700 ease-out">
                    {bouquet.name}
                  </h3>
                  <p className="font-sans text-sm tracking-wide text-slate-600/90 mb-5 leading-relaxed font-light transition-all duration-700 ease-out">
                    {bouquet.description}
                  </p>
                  
                  <motion.button
                    className="w-full rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 px-6 py-3.5 font-semibold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:shadow-amber-500/25 group/btn"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Convert price string to number (remove $ and convert to number)
                      const priceNumber = parseFloat(bouquet.price.replace('$', ''));
                      addToCart({
                        id: bouquet.id,
                        title: bouquet.name,
                        price: priceNumber,
                        image: bouquet.image
                      });
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4 transition-all duration-300 group-hover/btn:scale-110" />
                      ADD TO COLLECTION
                    </div>
                  </motion.button>
                </div>

                {/* Modern enhanced effects */}
                {/* Animated shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/card:opacity-100 rounded-2xl transform -translate-x-full group-hover/card:translate-x-full transition-all duration-1000 ease-in-out" />
                
                {/* Enhanced glow effect */}
                <div className="absolute -inset-3 bg-gradient-to-r from-amber-400/20 via-yellow-300/15 to-amber-400/20 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 ease-out" />
                
                {/* Inset glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_50px_rgba(251,191,36,0.15)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                {/* Modern Dynamic Glitter Effect - Responsive */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:block hidden">
                  {/* Large floating sparkles */}
                  <div className="absolute top-6 left-6 w-2 h-2 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-100 group-hover/card:animate-bounce group-hover/card:shadow-lg group-hover/card:shadow-yellow-300/50" />
                  <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-200 group-hover/card:animate-ping" />
                  <div className="absolute top-20 left-12 w-2 h-2 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-300 group-hover/card:animate-pulse group-hover/card:shadow-lg group-hover/card:shadow-amber-300/50" />
                  <div className="absolute top-8 right-14 w-1 h-1 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-150 group-hover/card:animate-bounce" />
                  <div className="absolute top-16 left-8 w-1.5 h-1.5 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-250 group-hover/card:animate-ping" />
                  <div className="absolute top-24 right-10 w-2 h-2 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-350 group-hover/card:animate-pulse group-hover/card:shadow-lg group-hover/card:shadow-yellow-400/50" />
                  <div className="absolute top-32 left-10 w-1 h-1 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-400 group-hover/card:animate-bounce" />
                  <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-500 group-hover/card:animate-ping" />
                  <div className="absolute top-28 left-6 w-2 h-2 bg-gradient-to-br from-yellow-200 to-amber-400 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-450 group-hover/card:animate-pulse group-hover/card:shadow-lg group-hover/card:shadow-amber-200/50" />
                  <div className="absolute top-14 right-12 w-1 h-1 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-550 group-hover/card:animate-bounce" />
                  <div className="absolute top-36 left-12 w-1.5 h-1.5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-600 group-hover/card:animate-ping" />
                  <div className="absolute top-10 right-16 w-2 h-2 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-650 group-hover/card:animate-pulse group-hover/card:shadow-lg group-hover/card:shadow-yellow-300/50" />
                  <div className="absolute top-22 left-14 w-1 h-1 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-700 group-hover/card:animate-bounce" />
                  <div className="absolute top-18 right-4 w-1.5 h-1.5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-750 group-hover/card:animate-ping" />
                  <div className="absolute top-30 left-4 w-2 h-2 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-800 group-hover/card:animate-pulse group-hover/card:shadow-lg group-hover/card:shadow-amber-200/50" />
                  <div className="absolute top-26 right-18 w-1 h-1 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-850 group-hover/card:animate-bounce" />
                  <div className="absolute top-34 left-16 w-1.5 h-1.5 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-900 group-hover/card:animate-ping" />
                  <div className="absolute top-38 right-20 w-2 h-2 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-950 group-hover/card:animate-pulse group-hover/card:shadow-lg group-hover/card:shadow-yellow-400/50" />
                  <div className="absolute top-40 left-18 w-1 h-1 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 delay-1000 group-hover/card:animate-bounce" />
                  
                  {/* Medium sparkles */}
                  <div className="absolute top-15 left-20 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover/card:opacity-80 transition-all duration-600 delay-120 group-hover/card:animate-spin" />
                  <div className="absolute top-25 right-22 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover/card:opacity-80 transition-all duration-600 delay-320 group-hover/card:animate-spin" />
                  <div className="absolute top-35 left-22 w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover/card:opacity-80 transition-all duration-600 delay-520 group-hover/card:animate-spin" />
                  <div className="absolute top-45 right-24 w-1 h-1 bg-amber-300 rounded-full opacity-0 group-hover/card:opacity-80 transition-all duration-600 delay-720 group-hover/card:animate-spin" />
                </div>
              </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-600/50 text-slate-100 rounded-2xl font-medium text-lg transition-all duration-500 ease-out hover:from-slate-700/90 hover:to-slate-800/90 hover:text-white hover:border-slate-500/70 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
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
            <span>VIEW COMPLETE COLLECTION</span>
            <motion.div
              className="group-hover:translate-x-2 transition-transform duration-300"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UltraFeaturedBouquets;