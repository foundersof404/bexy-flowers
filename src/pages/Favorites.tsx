import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShoppingCart, ArrowLeft, Sparkles } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCartWithToast } from '@/hooks/useCartWithToast';
import UltraNavigation from '@/components/UltraNavigation';

gsap.registerPlugin(ScrollTrigger);

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, isFavorite, toggleFavorite, getTotalFavorites } = useFavorites();
  const { addToCart } = useCartWithToast();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | string | null>(null);

  useEffect(() => {
    // Ensure at top on page mount
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [favorites]);

  const totalFavorites = getTotalFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf9f7] to-white relative overflow-hidden">
      <UltraNavigation />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#dc267f]/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#C79E48]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <section 
        ref={sectionRef}
        className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header Section - Elegant and Powerful */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Sharp Header Text Above */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p 
                className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2"
                style={{
                  color: '#1a1a1a',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '0.3em'
                }}
              >
                YOUR CURATED COLLECTION
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#dc267f]" />
                <div className="h-1 w-1 rounded-full bg-[#dc267f]" />
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#dc267f]" />
              </div>
            </motion.div>

            {/* My Favorites Title */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.3em] uppercase mb-2"
                style={{
                  color: '#1a1a1a',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '0.3em'
                }}
              >
                MY FAVORITES
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#dc267f]" />
                <div className="h-1 w-1 rounded-full bg-[#dc267f]" />
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#dc267f]" />
              </div>
            </motion.div>
            
            {/* Description Text */}
            <motion.p 
              className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-8"
              style={{
                color: '#1a1a1a',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.3em'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {totalFavorites > 0 
                ? `YOU HAVE ${totalFavorites} ${totalFavorites === 1 ? 'BEAUTIFUL ITEM' : 'BEAUTIFUL ITEMS'} SAVED FOR LATER`
                : 'YOUR FAVORITES COLLECTION IS EMPTY. START ADDING ITEMS YOU LOVE!'
              }
            </motion.p>

            {/* Back Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span 
                  className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase"
                  style={{
                    color: '#1a1a1a',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0.3em'
                  }}
                >
                  BACK TO COLLECTION
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Favorites Grid - Powerful Layout */}
          {totalFavorites === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-8"
              >
                <Heart className="w-20 h-20 text-slate-300 mx-auto" strokeWidth={1} />
              </motion.div>
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-[0.3em] uppercase mb-4"
                style={{
                  color: '#1a1a1a',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '0.3em'
                }}
              >
                NO FAVORITES YET
              </h2>
              <p 
                className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-8"
                style={{
                  color: '#1a1a1a',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '0.3em'
                }}
              >
                START EXPLORING AND ADD ITEMS YOU LOVE TO YOUR FAVORITES
              </p>
              <button
                onClick={() => navigate('/collection')}
                className="px-8 py-4 hover:opacity-70 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, #dc267f 0%, #e91e63 100%)',
                  boxShadow: '0 4px 12px rgba(220, 38, 127, 0.3)'
                }}
              >
                <span 
                  className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-white"
                  style={{
                    letterSpacing: '0.3em'
                  }}
                >
                  EXPLORE COLLECTION
                </span>
              </button>
            </motion.div>
          ) : (
            <div 
              ref={containerRef}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10"
            >
              <AnimatePresence mode="popLayout">
                {favorites.map((favorite, index) => {
                  const isHovered = hoveredCard === favorite.id;
                  const isFav = isFavorite(favorite.id);
                  
                  return (
                    <motion.div
                      key={favorite.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -100 }}
                      transition={{ 
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1],
                        layout: { duration: 0.4 }
                      }}
                      className="group"
                      onHoverStart={() => setHoveredCard(favorite.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      {/* Premium Luxury Card - Sharper Design */}
                      <motion.div
                        className="relative rounded-2xl overflow-hidden backdrop-blur-sm cursor-pointer border border-slate-200/80"
                        style={{
                          background: 'linear-gradient(180deg, #ffffff 0%, #fefcfb 100%)',
                          boxShadow: isHovered 
                            ? '0 32px 72px rgba(220, 38, 127, 0.24), 0 0 0 2px rgba(220, 38, 127, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                            : '0 12px 48px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                        }}
                        animate={{
                          y: isHovered ? -4 : 0,
                          scale: isHovered ? 1.04 : 1,
                        }}
                        transition={{ 
                          duration: 0.3, 
                          ease: [0.23, 1, 0.32, 1] 
                        }}
                        onClick={() => {
                          navigate(`/product/${favorite.id}`, {
                            state: {
                              product: {
                                id: favorite.id,
                                title: favorite.title || favorite.name,
                                price: favorite.price,
                                description: favorite.description,
                                imageUrl: favorite.image || favorite.imageUrl,
                                images: [favorite.image || favorite.imageUrl],
                                category: favorite.category || 'Premium Bouquets'
                              }
                            }
                          });
                        }}
                      >
                        {/* Sharp Pink Border Overlay */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                          style={{
                            boxShadow: isHovered 
                              ? 'inset 0 0 0 2px rgba(220, 38, 127, 0.5), inset 0 0 20px rgba(220, 38, 127, 0.1)'
                              : 'inset 0 0 0 0px rgba(220, 38, 127, 0)',
                          }}
                          transition={{ duration: 0.4 }}
                        />

                        {/* Sharp Corner Accent */}
                        {isHovered && (
                          <motion.div
                            className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#dc267f] border-l-[24px] border-l-transparent z-20"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        {/* Image Section - Enhanced */}
                        <div className="relative h-48 sm:h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                          <motion.img
                            src={favorite.image || favorite.imageUrl}
                            alt={favorite.title || favorite.name || 'Favorite'}
                            className="w-full h-full object-cover"
                            style={{
                              filter: isHovered ? 'brightness(1.05) saturate(1.1)' : 'brightness(1) saturate(1)'
                            }}
                            animate={{
                              scale: isHovered ? 1.12 : 1,
                            }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                          />
                          
                          {/* Sharp Gradient Overlay */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                          />
                          
                          {/* Pink Glow Overlay on Hover */}
                          {isHovered && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-[#dc267f]/10 via-transparent to-transparent"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4 }}
                            />
                          )}

                          {/* Floating Action Buttons */}
                          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2 z-20 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <motion.button
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md flex items-center justify-center relative overflow-visible"
                              style={{
                                background: isFav ? 'rgba(220, 38, 127, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                              }}
                              whileHover={{ 
                                scale: 1.15,
                                y: -2,
                                boxShadow: '0 6px 20px rgba(220, 38, 127, 0.4)'
                              }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(favorite);
                              }}
                            >
                              <Heart 
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${isFav ? 'fill-white text-white' : 'text-slate-700'}`} 
                                strokeWidth={2.5} 
                              />
                            </motion.button>
                          </div>

                          {/* Featured Badge */}
                          {favorite.featured && (
                            <span 
                              className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide text-white shadow-lg flex items-center gap-1"
                              style={{
                                background: 'linear-gradient(90deg, #dc267f 0%, #e91e63 100%)'
                              }}
                            >
                              <Sparkles className="w-3 h-3" />
                              FAVORITE
                            </span>
                          )}
                        </div>

                        {/* Content Section - Sharper Typography */}
                        <div className="p-4 sm:p-5 lg:p-7 bg-gradient-to-b from-white to-slate-50/50">
                          <h3 
                            className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3 line-clamp-1"
                            style={{
                              color: '#1a1a1a',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                              letterSpacing: '0.3em'
                            }}
                          >
                            {favorite.title || favorite.name}
                          </h3>
                          
                          {/* Sharp Pink Underline */}
                          <motion.div 
                            className="h-[2px] sm:h-[3px] bg-gradient-to-r from-[#dc267f] via-[#e91e63] to-[#f06292] mb-3 sm:mb-5 rounded-full"
                            initial={{ width: '32px' }}
                            animate={{ width: isHovered ? '60px' : '32px' }}
                            transition={{ duration: 0.4 }}
                          />

                          <p 
                            className="font-serif text-xs sm:text-sm lg:text-base font-normal mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 min-h-[3rem] sm:min-h-[4rem] leading-relaxed text-slate-700" 
                            style={{
                              letterSpacing: '0.02em'
                            }}
                          >
                            {favorite.description || 'Premium floral arrangement crafted with exquisite attention to detail'}
                          </p>

                          {/* Price and Actions - Enhanced */}
                          <div className="flex items-end justify-between pt-2 border-t border-slate-200/60">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-1 flex-wrap">
                                <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-[#dc267f] via-[#e91e63] to-[#f06292] bg-clip-text text-transparent leading-none">
                                  ${favorite.price}
                                </span>
                                <span 
                                  className="font-serif text-[10px] sm:text-xs lg:text-sm font-normal mb-0.5 text-slate-600"
                                  style={{
                                    letterSpacing: '0.05em'
                                  }}
                                >
                                  USD
                                </span>
                              </div>
                              <p 
                                className="font-serif text-[10px] sm:text-xs lg:text-sm font-normal mt-1 text-slate-600"
                                style={{
                                  letterSpacing: '0.05em'
                                }}
                              >
                                Per arrangement
                              </p>
                            </div>

                            <motion.button
                              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center relative overflow-hidden group/btn border-2 border-[#dc267f]/20 flex-shrink-0 ml-2"
                              style={{
                                background: isHovered 
                                  ? 'linear-gradient(135deg, #dc267f 0%, #e91e63 50%, #f06292 100%)'
                                  : 'linear-gradient(135deg, #dc267f 0%, #e91e63 100%)',
                                boxShadow: isHovered
                                  ? '0 8px 24px rgba(220, 38, 127, 0.5), 0 0 0 3px rgba(220, 38, 127, 0.15)'
                                  : '0 6px 20px rgba(220, 38, 127, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
                              }}
                              whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0]
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart({
                                  id: favorite.id,
                                  title: favorite.title || favorite.name || '',
                                  price: favorite.price,
                                  image: favorite.image || favorite.imageUrl || ''
                                });
                              }}
                            >
                              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" strokeWidth={2.5} />
                              
                              {/* Enhanced Shimmer Effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{
                                  x: ['-100%', '200%']
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                              />
                              
                              {/* Inner Glow */}
                              <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                                }}
                                animate={{
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.button>
                          </div>
                        </div>

                        {/* Ambient Particles */}
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full"
                                style={{
                                  background: 'rgba(220, 38, 127, 0.6)',
                                  left: `${20 + i * 15}%`,
                                  top: `${30 + i * 10}%`,
                                }}
                                animate={{
                                  y: [0, -20, 0],
                                  opacity: [0, 1, 0],
                                  scale: [0, 1.5, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favorites;

