import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShoppingCart, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

    // Elegant entrance animation
    const section = sectionRef.current;
    const container = containerRef.current;

    if (section && container) {
      const tl = gsap.timeline();
      tl.from(section, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out"
      })
      .from(container.children, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.5");
    }

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
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Elegant and Powerful */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#dc267f] to-transparent" />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-[#dc267f]" />
              </motion.div>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#dc267f] to-transparent" />
            </div>

            <h1 className="font-luxury text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#dc267f] via-[#e91e63] to-[#f06292] bg-clip-text text-transparent">
              My Favorites
            </h1>
            
            <p className="font-body text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {totalFavorites > 0 
                ? `You have ${totalFavorites} ${totalFavorites === 1 ? 'beautiful item' : 'beautiful items'} saved for later`
                : 'Your favorites collection is empty. Start adding items you love!'
              }
            </p>

            {/* Back Button */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-slate-600 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Collection</span>
              </Button>
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
                className="inline-block mb-6"
              >
                <Heart className="w-20 h-20 text-slate-300 mx-auto" strokeWidth={1} />
              </motion.div>
              <h2 className="font-luxury text-3xl text-slate-400 mb-4">No favorites yet</h2>
              <p className="font-body text-slate-500 mb-8">Start exploring and add items you love to your favorites</p>
              <Button
                onClick={() => navigate('/collection')}
                className="bg-gradient-to-r from-[#dc267f] to-[#e91e63] text-white hover:from-[#c2185b] hover:to-[#d81b60] transition-all duration-300"
              >
                Explore Collection
              </Button>
            </motion.div>
          ) : (
            <div 
              ref={containerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10"
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
                          y: isHovered ? -20 : 0,
                          scale: isHovered ? 1.02 : 1,
                        }}
                        transition={{ 
                          duration: 0.4, 
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
                        <div className="relative h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
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
                          <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <motion.button
                              className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center relative overflow-visible"
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
                                className={`w-4 h-4 ${isFav ? 'fill-white text-white' : 'text-slate-700'}`} 
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
                        <div className="p-7 bg-gradient-to-b from-white to-slate-50/50">
                          <h3 className="font-luxury text-2xl sm:text-3xl font-bold text-slate-900 mb-3 line-clamp-1 tracking-tight">
                            {favorite.title || favorite.name}
                          </h3>
                          
                          {/* Sharp Pink Underline */}
                          <motion.div 
                            className="h-[3px] bg-gradient-to-r from-[#dc267f] via-[#e91e63] to-[#f06292] mb-5 rounded-full"
                            initial={{ width: '48px' }}
                            animate={{ width: isHovered ? '80px' : '48px' }}
                            transition={{ duration: 0.4 }}
                          />

                          <p className="font-body text-slate-800 text-base sm:text-lg mb-6 line-clamp-3 min-h-[4rem] leading-tight font-semibold tracking-wide" 
                             style={{
                               textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                               letterSpacing: '0.025em'
                             }}>
                            <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                              {favorite.description || 'Premium floral arrangement crafted with exquisite attention to detail'}
                            </span>
                          </p>

                          {/* Price and Actions - Enhanced */}
                          <div className="flex items-end justify-between pt-2 border-t border-slate-200/60">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#dc267f] via-[#e91e63] to-[#f06292] bg-clip-text text-transparent leading-none">
                                  ${favorite.price}
                                </span>
                                <span className="text-slate-500 text-xs sm:text-sm font-medium mb-0.5">USD</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 font-medium">Per arrangement</p>
                            </div>

                            <motion.button
                              className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden group/btn border-2 border-[#dc267f]/20"
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
                              <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2.5} />
                              
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

