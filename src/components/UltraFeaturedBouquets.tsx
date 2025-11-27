import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye, Crown, ArrowUpRight } from 'lucide-react';
import { useCartWithToast } from '@/hooks/useCartWithToast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignatureQuickView from './SignatureQuickView';

gsap.registerPlugin(ScrollTrigger);

const bouquets = [
  {
    id: 1,
    name: "Royal Red Elegance",
    price: "$299",
    image: encodeURI("/assets/red roses/medium red roses flower in a black box.png"),
    description: "Luxurious red roses with glittering accents"
  },
  {
    id: 2,
    name: "Wedding Serenity",
    price: "$349",
    image: encodeURI("/assets/wedding % events/IMG_1673.JPG"),
    description: "Pure elegant arrangement for special moments"
  },
  {
    id: 3,
    name: "Golden Heart",
    price: "$425",
    image: encodeURI("/assets/red roses/red roses in a golden heart shaped box.jpg"),
    description: "Premium roses in a stunning golden heart box"
  },
  {
    id: 4,
    name: "Event Grandeur",
    price: "$289",
    image: encodeURI("/assets/wedding % events/events/IMG-20251126-WA0024.jpg"),
    description: "Spectacular floral design for grand events"
  },
  {
    id: 5,
    name: "Heart's Desire",
    price: "$399",
    image: encodeURI("/assets/heart shape/IMG-20251001-WA0018.jpg"),
    description: "Romantic heart-shaped arrangement"
  },
  {
    id: 6,
    name: "Glittering Passion",
    price: "$329",
    image: encodeURI("/assets/red roses/red roses bouquet with red glitter.jpg"),
    description: "Radiant red roses with a touch of sparkle"
  }
];

const UltraFeaturedBouquets = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartWithToast();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBouquet, setSelectedBouquet] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

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
        const button = card.querySelector('button');
        const glitterContainer = card.querySelector('[class*="Modern Dynamic Glitter Effect"]');

        let hoverTl: gsap.core.Timeline;

        card.addEventListener('mouseenter', () => {
          hoverTl = gsap.timeline();
          
          hoverTl
            .to(card, {
              duration: 0.3,
              rotateX: 0,
              rotateY: 0,
              z: 0,
              scale: 1.03,
              ease: "power2.out"
            })
            .to(image, {
              duration: 0.3,
              scale: 1.08,
              filter: "brightness(1.05) saturate(1.05)",
              ease: "power2.out"
            }, 0)
            .to(actionButtons, {
              duration: 0.25,
              y: 0,
              opacity: 1,
              ease: "back.out(1.7)"
            }, 0.1)
            .to(button, {
              duration: 0.25,
              y: -1,
              scale: 1.02,
              ease: "power2.out"
            }, 0.2)
            .to(glitterContainer, {
              duration: 0.4,
              opacity: 1,
              ease: "power2.out"
            }, 0);
        });

        card.addEventListener('mouseleave', () => {
          if (hoverTl) hoverTl.kill();
          
          gsap.to(card, {
            duration: 0.25,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            scale: 1,
            ease: "power2.out"
          });
          gsap.to(image, {
            duration: 0.25,
            scale: 1,
            filter: "brightness(1) saturate(1)",
            ease: "power2.out"
          });
          gsap.to(actionButtons, {
            duration: 0.2,
            y: -8,
            opacity: 0,
            ease: "power2.out"
          });
          gsap.to(button, {
            duration: 0.2,
            y: 0,
            scale: 1,
            ease: "power2.out"
          });
          gsap.to(glitterContainer, {
            duration: 0.3,
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

  // Auto-scroll functionality for luxury collection section
  useEffect(() => {
    if (!isAutoScroll) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Disable auto-scroll on mobile

    const section = sectionRef.current;
    if (!section) return;

    // Auto-scroll to the luxury collection section when it comes into view
    // This creates a smooth, heavy scroll effect using Lenis
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Section is in view - ensure smooth heavy scroll is active
            // The heavy scroll is handled by Lenis in useSmoothScroll hook
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [isAutoScroll]);

  return (
    <>
      {/* Google Fonts Import */}
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      
    <section 
      ref={sectionRef}
        className="py-24 px-4 relative overflow-hidden"
      data-section="signature-collection"
      style={{
          background: '#fff',
          fontFamily: '"Lato", sans-serif'
        }}
      >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
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
              whileInView={{ width: '200px' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-8">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 shadow-lg shadow-amber-500/50" />
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="font-body text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our curated selection of premium floral arrangements designed to elevate any space.
          </motion.p>
        </motion.div>

        <div className="flex justify-center">
          <div 
            ref={containerRef}
            className="w-full"
            style={{ marginTop: '5em' }}
          >
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 w-full"
            >
          {bouquets.map((bouquet, index) => {
            // Define consistent gold color for all cards
            const currentColor = 'rgb(199, 158, 72)';

            // Define tag configurations for each card
            const tagConfigurations = [
              // Card 1
              [
                { text: 'VALENTINE', color: '#d3b19a' },
                { text: 'ROMANTIC', color: '#70b3b1' }
              ],
              // Card 2
              [
                { text: 'MOTHER\'S DAY', color: '#d05fa2' },
                { text: 'SPECIAL GIFT', color: '#d3b19a' }
              ],
              // Card 3
              [
                { text: 'BEST SELLING', color: '#70b3b1' },
                { text: 'POPULAR', color: '#d05fa2' }
              ],
              // Card 4
              [
                { text: 'BEST GIFT', color: '#d3b19a' },
                { text: 'LUXURY', color: '#70b3b1' }
              ],
              // Card 5
              [
                { text: 'ANNIVERSARY', color: '#d05fa2' },
                { text: 'CELEBRATION', color: '#d3b19a' }
              ],
              // Card 6
              [
                { text: 'NEW ARRIVAL', color: '#70b3b1' },
                { text: 'EXCLUSIVE', color: '#d05fa2' }
              ]
            ];
            
            return (
            <motion.div
              key={bouquet.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
                className="group cursor-pointer w-full"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
              viewport={{ once: true }}
            >
                 {/* Card structure with fully rounded corners */}
                 <div 
                   className="card"
                   style={{
                     position: 'relative',
                     width: 'inherit',
                     height: 'auto',
                     background: '#fff',
                     borderRadius: '1.25rem'
                   }}
                 >
                     {/* Image */}
                     <div 
                       className="imgBox h-80 sm:h-[clamp(8rem,20vw,18.75rem)]"
                       style={{
                         position: 'relative',
                         width: '100%',
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

                       {/* Icon with sophisticated cut-out effect */}
                       <div 
                         className="icon"
                         style={{
                           position: 'absolute',
                           bottom: '-0.375rem',
                           right: '-0.375rem',
                           width: '6rem',
                           height: '6rem',
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
                             inset: '0.725rem',
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
                      setSelectedBouquet(bouquet);
                      setIsModalOpen(true);
                    }}
                  >
                          <ArrowUpRight color="#fff" size={22} strokeWidth={1.8} />
                         </motion.div>
                  </div>
                </div>

                     {/* Content section */}
                     <div 
                       className="content p-6"
                       style={{
                         borderRadius: '0 0 1.25rem 1.25rem'
                       }}
                     >
                    <h3 
                      style={{
                        textTransform: 'capitalize',
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.8rem)',
                        color: '#111',
                        fontWeight: '700',
                        lineHeight: '1.2',
                        marginBottom: '0.5rem'
                      }}
                    >
                    {bouquet.name}
                  </h3>
                    <p 
                      style={{
                        marginBottom: '1rem',
                        color: '#565656',
                        fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      Fill out the form and the algorithm will offer the right team of experts
                    </p>
                    
                     {/* Tags */}
                     <ul 
                       style={{
                         margin: '0',
                         padding: '0',
                         listStyleType: 'none',
                         display: 'flex',
                         alignItems: 'center',
                         flexWrap: 'wrap',
                         gap: '0.625rem'
                       }}
                     >
                       {tagConfigurations[index].map((tag, tagIndex) => (
                         <li 
                           key={tagIndex}
                           style={{
                             textTransform: 'uppercase',
                             background: '#f0f0f0',
                             color: tag.color,
                             fontWeight: '700',
                             fontSize: '0.75rem',
                             padding: '0.375rem 0.75rem',
                             borderRadius: '0.25rem',
                             whiteSpace: 'nowrap',
                             letterSpacing: '0.05em'
                           }}
                         >
                           {tag.text}
                         </li>
                       ))}
                     </ul>
                </div>
              </div>
            </motion.div>
             );
           })}
            </div>
          </div>
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
         className="
         inline-flex items-center justify-center gap-3
         px-12 py-4
         bg-gradient-to-r from-[rgb(160,120,40)] via-[rgb(199,158,72)] to-[rgb(240,210,150)]
         text-white
         rounded-2xl
         font-semibold text-sm tracking-wide uppercase
         shadow-md shadow-yellow-600/30
         transition-all duration-300 ease-out
         hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-[1.02]
         active:scale-[0.98]
         group
       "
       whileHover={{ scale: 1.03 }}
       whileTap={{ scale: 0.97 }}
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
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>

    {/* Signature Quick View Modal */}
    <SignatureQuickView
      open={isModalOpen}
      item={selectedBouquet}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedBouquet(null);
      }}
    />
    </>
  );
};

export default UltraFeaturedBouquets;