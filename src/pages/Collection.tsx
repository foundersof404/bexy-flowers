import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import UltraNavigation from "@/components/UltraNavigation";
import { CollectionHero } from "@/components/collection/CollectionHero";
import { CategoryNavigation } from "@/components/collection/CategoryNavigation";
import { BouquetGrid } from "@/components/collection/BouquetGrid";
import { FeaturedCarousel } from "@/components/collection/FeaturedCarousel";
import { ProductModal } from "@/components/collection/ProductModal";
import { CollectionFooter } from "@/components/collection/CollectionFooter";
import { FloatingBackground } from "@/components/collection/FloatingBackground";

gsap.registerPlugin(ScrollTrigger);

export interface Bouquet {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured?: boolean;
}

const bouquets: Bouquet[] = [
  {
    id: "1",
    name: "Royal Elegance",
    price: 299,
    image: "/src/assets/bouquet-1.jpg",
    description: "A stunning arrangement of premium roses and peonies with gold accents",
    category: "luxury",
    featured: true
  },
  {
    id: "2", 
    name: "Valentine's Passion",
    price: 199,
    image: "/src/assets/bouquet-2.jpg",
    description: "Deep red roses with silk ribbons for the perfect romantic gesture",
    category: "valentine",
    featured: true
  },
  {
    id: "3",
    name: "Wedding Dreams",
    price: 450,
    image: "/src/assets/bouquet-3.jpg", 
    description: "Classic white roses and eucalyptus for your special day",
    category: "wedding"
  },
  {
    id: "4",
    name: "Mother's Love",
    price: 189,
    image: "/src/assets/bouquet-4.jpg",
    description: "Soft pink carnations and baby's breath for Mom",
    category: "mothers-day"
  },
  {
    id: "5",
    name: "Graduation Glory",
    price: 159,
    image: "/src/assets/bouquet-5.jpg",
    description: "Bright sunflowers and daisies to celebrate achievements", 
    category: "graduation"
  },
  {
    id: "6",
    name: "Anniversary Bliss",
    price: 279,
    image: "/src/assets/bouquet-6.jpg",
    description: "Mixed premium flowers with golden touches",
    category: "anniversary",
    featured: true
  }
];

const categories = [
  { id: "all", name: "All Collections", count: bouquets.length },
  { id: "luxury", name: "Luxury Classics", count: bouquets.filter(b => b.category === "luxury").length },
  { id: "valentine", name: "Valentine's Day", count: bouquets.filter(b => b.category === "valentine").length },
  { id: "wedding", name: "Weddings", count: bouquets.filter(b => b.category === "wedding").length },
  { id: "mothers-day", name: "Mother's Day", count: bouquets.filter(b => b.category === "mothers-day").length },
  { id: "graduation", name: "Graduation", count: bouquets.filter(b => b.category === "graduation").length },
  { id: "anniversary", name: "Anniversary", count: bouquets.filter(b => b.category === "anniversary").length }
];

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);
  const [filteredBouquets, setFilteredBouquets] = useState(bouquets);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure page loads at the very top on navigation
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredBouquets(bouquets);
    } else {
      setFilteredBouquets(bouquets.filter(b => b.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Ensure at top on page mount
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Curtain reveal animation on page load
    const tl = gsap.timeline();
    
    tl.set(".curtain-left", { x: 0 })
      .set(".curtain-right", { x: 0 })
      .to(".curtain-left", { x: "-100%", duration: 1.5, ease: "power3.inOut" })
      .to(".curtain-right", { x: "100%", duration: 1.5, ease: "power3.inOut" }, "-=1.5")
      .from(".collection-content", { opacity: 0, y: 50, duration: 1, ease: "power2.out" }, "-=0.5");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const featuredBouquets = bouquets.filter(b => b.featured);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
      {/* Ultra Navigation */}
      <UltraNavigation />
      
      {/* Curtain Animation */}
      <div className="curtain-left fixed top-0 left-0 w-1/2 h-full bg-primary z-50"></div>
      <div className="curtain-right fixed top-0 right-0 w-1/2 h-full bg-primary z-50"></div>
      
      {/* Floating 3D Background */}
      <FloatingBackground />
      
      <div className="collection-content relative z-10">
        {/* Immersive Hero Section */}
        <CollectionHero />
        
        {/* Fixed Category Navigation */}
        <CategoryNavigation 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Main Bouquet Grid */}
        <section className="py-20 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <BouquetGrid 
                key={selectedCategory}
                bouquets={filteredBouquets}
                onBouquetClick={setSelectedBouquet}
              />
            </AnimatePresence>
          </div>
        </section>
        
        {/* Animated Category Divider */}
        <motion.div 
          className="relative py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="h-px bg-gradient-to-r from-transparent via-[#C79E48] to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
          <motion.h2 
            className="text-center text-3xl font-luxury text-[#C79E48] relative z-10 bg-background px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Featured Collections
          </motion.h2>
        </motion.div>
        
        {/* Featured Carousel */}
        <FeaturedCarousel 
          bouquets={featuredBouquets}
          onBouquetClick={setSelectedBouquet}
        />
        
        {/* Footer */}
        <CollectionFooter />
      </div>
      
      {/* Product Modal */}
      <AnimatePresence>
        {selectedBouquet && (
          <ProductModal 
            bouquet={selectedBouquet}
            onClose={() => setSelectedBouquet(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collection;