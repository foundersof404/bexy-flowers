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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {bouquets.map((bouquet, index) => (
            <motion.div
              key={bouquet.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group cursor-pointer w-full max-w-[380px] mx-auto"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[25px] shadow-[0_20px_60px_rgba(198,161,81,0.15)] hover:shadow-[0_30px_80px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden hover:scale-105 hover:-translate-y-6 group">
                
                {/* Image Container with Modern Design */}
                <div className="relative overflow-hidden aspect-[4/4.5] bg-slate-100 rounded-t-[25px]">
                  <img
                    src={bouquet.image}
                    alt={bouquet.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                  />
                  
                  {/* Modern Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-800/30 to-transparent transition-all duration-700 ease-out group-hover:from-slate-900/40 group-hover:via-slate-800/10" />
                  
                  {/* Sophisticated Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700" 
                       style={{
                         backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                         radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                       }} />

                  {/* Modern Floating Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                    <motion.button 
                      className="w-10 h-10 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-slate-700/50 text-slate-200 hover:text-white transition-all duration-500 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      className="w-10 h-10 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-slate-700/50 text-slate-200 hover:text-white transition-all duration-500 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Luxury Gold Price Tag */}
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-amber-400/90 to-yellow-500/90 backdrop-blur-xl text-slate-900 px-4 py-2 font-luxury font-bold text-base rounded-2xl border border-amber-300/50 shadow-[0_8px_25px_rgba(198,161,81,0.4)] hover:shadow-[0_12px_35px_rgba(198,161,81,0.6)] transition-all duration-500 transform hover:scale-105">
                    {bouquet.price}
                  </div>
                </div>

                {/* Glassmorphism Content Section */}
                <div className="p-5 bg-white/40 backdrop-blur-xl border-t border-white/50 relative rounded-b-[25px]">
                  <h3 className="font-serif text-xl font-bold text-slate-800 mb-3 tracking-wide group-hover:text-amber-600 transition-all duration-700 ease-out">
                    {bouquet.name}
                  </h3>
                  <p className="font-sans text-sm text-slate-500 mb-4 leading-relaxed font-light transition-all duration-700 ease-out">
                    {bouquet.description}
                  </p>
                  
                  <motion.button
                    className="w-full bg-transparent border-2 border-amber-500/60 text-amber-600 px-6 py-3 rounded-2xl font-medium text-sm uppercase tracking-wider transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-slate-900 hover:border-amber-400 hover:shadow-[0_8px_25px_rgba(198,161,81,0.4)]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4 transition-all duration-300 group-hover:text-amber-600" />
                      ADD TO COLLECTION
                    </div>
                  </motion.button>
                </div>

                {/* Luxury Gold Border */}
                <div className="absolute inset-0 rounded-[25px] border border-amber-300/30 group-hover:border-amber-400/60 transition-all duration-700 ease-out" />
                <div className="absolute inset-[1px] rounded-[25px] bg-gradient-to-br from-amber-100/20 via-transparent to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Gold Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent opacity-0 group-hover:opacity-100 rounded-[25px] transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                {/* Luxury Gold Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 rounded-[25px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

                {/* Glitter Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[25px]">
                  {/* Moving glitter dots with subtle colors */}
                  <div className="absolute top-4 left-8 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 group-hover:animate-bounce" />
                  <div className="absolute top-12 right-6 w-1 h-1 bg-amber-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 group-hover:animate-ping" />
                  <div className="absolute top-20 left-12 w-1 h-1 bg-amber-800/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 group-hover:animate-pulse" />
                  <div className="absolute top-8 right-12 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 group-hover:animate-bounce" />
                  <div className="absolute top-16 left-6 w-1 h-1 bg-amber-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-250 group-hover:animate-ping" />
                  <div className="absolute top-24 right-8 w-1 h-1 bg-amber-800/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-350 group-hover:animate-pulse" />
                  <div className="absolute top-32 left-10 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400 group-hover:animate-bounce" />
                  <div className="absolute top-6 right-4 w-1 h-1 bg-amber-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-500 group-hover:animate-ping" />
                  <div className="absolute top-28 left-4 w-1 h-1 bg-amber-800/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-450 group-hover:animate-pulse" />
                  <div className="absolute top-14 right-10 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-550 group-hover:animate-bounce" />
                  <div className="absolute top-36 left-8 w-1 h-1 bg-amber-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-600 group-hover:animate-ping" />
                  <div className="absolute top-10 right-14 w-1 h-1 bg-amber-800/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-650 group-hover:animate-pulse" />
                  <div className="absolute top-22 left-14 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-700 group-hover:animate-bounce" />
                  <div className="absolute top-18 right-2 w-1 h-1 bg-amber-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-750 group-hover:animate-ping" />
                  <div className="absolute top-30 left-2 w-1 h-1 bg-amber-800/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-800 group-hover:animate-pulse" />
                  <div className="absolute top-26 right-16 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-850 group-hover:animate-bounce" />
                  <div className="absolute top-34 left-16 w-1 h-1 bg-amber-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-900 group-hover:animate-ping" />
                  <div className="absolute top-38 right-18 w-1 h-1 bg-amber-800/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-950 group-hover:animate-pulse" />
                  <div className="absolute top-40 left-18 w-1 h-1 bg-amber-600/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-1000 group-hover:animate-bounce" />
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