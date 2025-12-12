import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  generatedBouquets,
  generatedCategories
} from "@/data/generatedBouquets";

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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
      return generatedBouquets;
    }
    return generatedBouquets.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Memoize featured bouquets calculation
  const featuredBouquets = useMemo(
    () => generatedBouquets.filter((b) => b.featured),
    []
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
            {/* Category count and transition */}
            <motion.div
              key={`count-${selectedCategory}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 text-center"
            >
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-[#C29A43]">{filteredBouquets.length}</span> beautiful bouquet{filteredBouquets.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
            
            {/* Grid with smooth transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <BouquetGrid 
                  bouquets={filteredBouquets}
                  onBouquetClick={handleBouquetClick}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        
        {/* Simplified Category Divider - Reduced animation complexity */}
        <motion.div 
          className="relative py-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-slate-800 relative z-10 bg-background px-8 inline-block"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                letterSpacing: '0.05em'
              }}
          >
            FEATURED COLLECTIONS
          </h2>
        </motion.div>
        
        {/* Featured Carousel */}
        <FeaturedCarousel 
          bouquets={featuredBouquets}
          onBouquetClick={handleBouquetClick}
        />

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