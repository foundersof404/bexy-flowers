import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";
import UltraNavigation from "@/components/UltraNavigation";
import { CollectionHero } from "@/components/collection/CollectionHero";
import { CategoryNavigation } from "@/components/collection/CategoryNavigation";
import { BouquetGrid } from "@/components/collection/BouquetGrid";
import { FeaturedCarousel } from "@/components/collection/FeaturedCarousel";
import { ProductModal } from "@/components/collection/ProductModal";
import Footer from "@/components/Footer";
import { FloatingBackground } from "@/components/collection/FloatingBackground";
import { CollectionStats } from "@/components/collection/CollectionStats";
import BackToTop from "@/components/BackToTop";
import LazySection from "@/components/LazySection";
import type { Bouquet } from "@/types/bouquet";
import { generatedCategories } from "@/data/generatedBouquets";
import { getCollectionProducts } from "@/lib/api/collection-products";
import { encodeImageUrl } from "@/lib/imageUtils";

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Fetch products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getCollectionProducts({ isActive: true });
        
        // Transform to match Bouquet interface
        const transformedBouquets: Bouquet[] = products.map((product) => ({
          id: product.id,
          name: product.title,
          price: product.price,
          image: encodeImageUrl(product.image_urls?.[0] || ''),
          description: product.description || '',
          category: product.category || '',
          displayCategory: product.display_category || '',
          featured: product.featured || false,
        }));
        
        setBouquets(transformedBouquets);
      } catch (error) {
        console.error('Error loading products:', error);
        setBouquets([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Ensure page loads at the very top on navigation
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Check for category query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      
      // Scroll to the main collection grid, bypassing the hero section
      setTimeout(() => {
        const gridElement = document.getElementById('main-collection-grid');
        if (gridElement) {
          // Offset for fixed header/navigation if needed
          const yOffset = -80; 
          const y = gridElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 800); // Delay to allow page transition/animation to complete
    }
  }, [location.search]);

  // ⚡ PERFORMANCE: Use useMemo instead of useEffect for filtering
  // This prevents unnecessary re-renders and state updates
  const filteredBouquets = useMemo(() => {
    if (selectedCategory === "all") {
      return bouquets;
    }
    return bouquets.filter((b) => b.category === selectedCategory);
  }, [selectedCategory, bouquets]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Memoize featured bouquets calculation
  const featuredBouquets = useMemo(
    () => bouquets.filter((b) => b.featured),
    [bouquets]
  );

  const categories = useMemo(() => generatedCategories, []);
  
  // Use callback for handlers with smooth scroll
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    
    // ⚡ PERFORMANCE: Smooth scroll to grid when category changes
    setTimeout(() => {
      const gridElement = document.getElementById('main-collection-grid');
      if (gridElement) {
        const yOffset = -100;
        const y = gridElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  }, []);
  
  const handleBouquetClick = useCallback((bouquet: Bouquet) => {
    setSelectedBouquet(bouquet);
  }, []);
  
  const handleModalClose = useCallback(() => {
    setSelectedBouquet(null);
  }, []);

  // Smooth scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring animation for scroll-based effects
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to various values
  const opacity = useTransform(smoothProgress, [0, 0.2], [0.3, 1]);
  const scale = useTransform(smoothProgress, [0, 0.2], [0.95, 1]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
      {/* Ultra Navigation */}
      <UltraNavigation />
      
      {/* Floating 3D Background */}
      <FloatingBackground />
      
      <div className="collection-content relative z-10">
        {/* Immersive Hero Section */}
        <CollectionHero />
        
        {/* Fixed Category Navigation */}
        <CategoryNavigation 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Main Bouquet Grid - With Smooth Category Transitions */}
        <section id="main-collection-grid" className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="max-w-7xl mx-auto w-full">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                <p className="mt-4 text-gray-600">Loading collection...</p>
              </div>
            ) : (
              <>
                {/* Category count with smooth scroll animation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="mb-8 text-center"
                >
                  <motion.p 
                    className="text-sm text-gray-600"
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    Showing <motion.span 
                      className="font-bold text-[#C29A43]"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {filteredBouquets.length}
                    </motion.span> beautiful bouquet{filteredBouquets.length !== 1 ? 's' : ''}
                  </motion.p>
                </motion.div>
                
                {/* Grid without filtration animation - smooth scroll animations inside */}
                <BouquetGrid 
                  bouquets={filteredBouquets}
                  onBouquetClick={handleBouquetClick}
                  selectedCategory={selectedCategory}
                />
              </>
            )}
          </div>
        </section>
        
        {/* Featured Collections Divider - Enhanced with smooth animations */}
        <motion.div 
          className="relative py-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>
          <motion.h2 
            className="font-luxury text-4xl md:text-6xl font-bold text-slate-800 relative z-10 bg-background px-8 inline-block"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            FEATURED COLLECTIONS
          </motion.h2>
        </motion.div>
        
        {/* Featured Carousel */}
        {!loading && featuredBouquets.length > 0 && (
          <FeaturedCarousel 
            bouquets={featuredBouquets}
            onBouquetClick={handleBouquetClick}
          />
        )}

        {/* Global stats for the collection (moved from hero) */}
        <CollectionStats />

        {/* Footer */}
        <LazySection rootMargin="600px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>
      
      {/* Product Modal */}
      <AnimatePresence>
        {selectedBouquet && (
          <ProductModal 
            bouquet={selectedBouquet}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
      <BackToTop />
    </div>
  );
};

export default Collection;