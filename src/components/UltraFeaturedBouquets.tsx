import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye, Crown, ArrowUpRight } from 'lucide-react';
import { useCartWithToast } from '@/hooks/useCartWithToast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignatureQuickView from './SignatureQuickView';
import { getActiveSignatureCollections } from '@/lib/api/signature-collection';
import { encodeImageUrl } from '@/lib/imageUtils';

gsap.registerPlugin(ScrollTrigger);

const UltraFeaturedBouquets = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartWithToast();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBouquet, setSelectedBouquet] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [bouquets, setBouquets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch signature collection from Supabase
  useEffect(() => {
    const loadSignatureCollection = async () => {
      try {
        setLoading(true);
        const data = await getActiveSignatureCollections();
        
        // Transform to match existing interface
        const formattedBouquets = data.map((item) => ({
          id: item.product?.id || '',
          name: item.product?.title || '',
          price: `$${item.product?.price || 0}`,
          image: item.product?.image_urls?.[0] || '',
          description: item.product?.description || '',
          // Include full product data for modal
          productData: item.product,
        }));
        
        setBouquets(formattedBouquets);
      } catch (error) {
        console.error('Error loading signature collection:', error);
        // Fallback to empty array on error
        setBouquets([]);
      } finally {
        setLoading(false);
      }
    };

    loadSignatureCollection();
  }, []);

  // Setup GSAP animations when bouquets are loaded - Disabled on mobile for performance
  useEffect(() => {
    if (loading || bouquets.length === 0) return;
    
    // Detect mobile devices
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip heavy animations on mobile or if user prefers reduced motion
    if (isMobile || prefersReducedMotion) {
      // Simple fade-in only for mobile
      const cards = cardsRef.current;
      if (cards.length > 0) {
        gsap.set(cards, { opacity: 0 });
        gsap.to(cards, {
          duration: 0.5,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        });
      }
      return;
    }
    
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

      // Smoother, less aggressive hover effects for desktop
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
              duration: 0.5,
              rotateX: 0,
              rotateY: 0,
              z: 0,
              scale: 1.01,
              ease: "power2.out"
            })
            .to(image, {
              duration: 0.5,
              scale: 1.02,
              filter: "brightness(1.02) saturate(1.02)",
              ease: "power2.out"
            }, 0)
            .to(actionButtons, {
              duration: 0.3,
              y: 0,
              opacity: 1,
              ease: "power2.out"
            }, 0.1)
            .to(button, {
              duration: 0.3,
              y: -1,
              scale: 1.01,
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
          gsap.to(button, {
            duration: 0.3,
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
  }, [loading, bouquets.length]);

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
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 relative overflow-hidden"
      data-section="signature-collection"
      style={{
          background: '#fff',
          fontFamily: '"Lato", sans-serif'
        }}
      >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-6 sm:mb-8 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          {/* Luxury Typography with Gold Accent */}
          <motion.h2 
            className="font-luxury text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative px-2"
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
              className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '120px' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{
                width: 'clamp(100px, 30vw, 200px)'
              }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-4 sm:mb-6 md:mb-8">
            <div className="w-24 sm:w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rotate-45 shadow-lg shadow-amber-500/50" />
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light px-2"
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
            style={{ marginTop: '1.5em' }}
          >
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                <p className="mt-4 text-slate-600">Loading signature collection...</p>
              </div>
            ) : bouquets.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-600">No signature collection items available.</p>
              </div>
            ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto px-2 sm:px-4 w-full"
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
                duration: 0.3, // Reduced from 0.8 for faster animation
                delay: index * 0.05, // Reduced from 0.1
                ease: [0.23, 1, 0.32, 1]
              }}
              viewport={{ once: true, margin: "-50px" }} // Only animate when closer to viewport
              onClick={() => {
                if (bouquet.id && bouquet.productData) {
                  navigate(`/product/${bouquet.id}`, {
                    state: {
                      product: {
                        id: bouquet.productData.id,
                        title: bouquet.productData.title || bouquet.name,
                        price: bouquet.productData.price || parseFloat(bouquet.price.replace('$', '')) || 0,
                        description: bouquet.productData.description || bouquet.description,
                        imageUrl: bouquet.image,
                        images: bouquet.productData.image_urls || [bouquet.image],
                        category: bouquet.productData.category || 'Signature Collection'
                      }
                    }
                  });
                }
              }}
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
                       className="imgBox h-64 sm:h-72 md:h-80 lg:h-[clamp(8rem,20vw,18.75rem)]"
                       style={{
                         position: 'relative',
                         width: '100%',
                         borderRadius: '1rem 1rem 0 0',
                         overflow: 'hidden'
                       }}
                     >
                  <motion.img
                    src={encodeImageUrl(bouquet.image)}
                    alt={bouquet.name}
                         style={{
                           width: '100%',
                           height: '100%',
                           objectFit: 'cover'
                         }}
                         className="transition-all duration-200 ease-out"
                         loading="lazy"
                         onError={(e) => {
                           // Fallback if image fails to load
                           (e.target as HTMLImageElement).style.display = 'none';
                         }}
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
                      if (bouquet.id && bouquet.productData) {
                        navigate(`/product/${bouquet.id}`, {
                          state: {
                            product: {
                              id: bouquet.productData.id,
                              title: bouquet.productData.title || bouquet.name,
                              price: bouquet.productData.price || parseFloat(bouquet.price.replace('$', '')) || 0,
                              description: bouquet.productData.description || bouquet.description,
                              imageUrl: bouquet.image,
                              images: bouquet.productData.image_urls || [bouquet.image],
                              category: bouquet.productData.category || 'Signature Collection'
                            }
                          }
                        });
                      }
                    }}
                  >
                          <ArrowUpRight color="#fff" size={22} strokeWidth={1.8} />
                         </motion.div>
                  </div>
                </div>

                     {/* Content section */}
                     <div 
                       className="content p-4 sm:p-5 md:p-6"
                       style={{
                         borderRadius: '0 0 1rem 1rem'
                       }}
                     >
                    <h3 
                      style={{
                        textTransform: 'capitalize',
                        fontSize: 'clamp(1rem, 4vw, 1.8rem)',
                        color: '#111',
                        fontWeight: '700',
                        lineHeight: '1.2',
                        marginBottom: '0.375rem'
                      }}
                    >
                    {bouquet.name}
                  </h3>
                    <p 
                      style={{
                        marginBottom: '0.75rem',
                        color: '#565656',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
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
                             fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                             padding: '0.25rem 0.5rem',
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
            )}
          </div>
        </div>

        <motion.div
          className="text-center mt-8 sm:mt-12 md:mt-16 px-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
         className="
         inline-flex items-center justify-center gap-2 sm:gap-3
         px-6 sm:px-8 md:px-12 py-3 sm:py-3.5 md:py-4
         bg-gradient-to-r from-[rgb(160,120,40)] via-[rgb(199,158,72)] to-[rgb(240,210,150)]
         text-white
         rounded-xl sm:rounded-2xl
         font-semibold text-xs sm:text-sm tracking-wide uppercase
         shadow-md shadow-yellow-600/30
         transition-all duration-300 ease-out
         hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-[1.02]
         active:scale-[0.98]
         group
         w-full sm:w-auto
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