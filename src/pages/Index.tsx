import React, { Suspense } from "react";
import { Sparkles, Wand2, Palette, Flower2, ChevronRight } from "lucide-react";
import LazySection from "@/components/LazySection";
import UltraNavigation from "@/components/UltraNavigation";
const InteractiveBackground = React.lazy(() => import("@/components/interactive/InteractiveBackground"));
const UltraHero = React.lazy(() => import("@/components/UltraHero"));
const UltraFeaturedBouquets = React.lazy(() => import("@/components/UltraFeaturedBouquets"));
const UltraCategories = React.lazy(() => import("@/components/UltraCategories"));
// Replaced heavy interactive builder on home with lightweight CTA
// const VirtualBouquetBuilder = React.lazy(() => import("@/components/interactive/VirtualBouquetBuilder"));
const FlowerPersonalityQuiz = React.lazy(() => import("@/components/culture/FlowerPersonalityQuiz"));
const FlowerCareGuide = React.lazy(() => import("@/components/culture/FlowerCareGuide"));
const Footer = React.lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <UltraNavigation />
      <Suspense fallback={null}>
        <InteractiveBackground />
      </Suspense>
      <div className="relative z-10">
        <Suspense fallback={null}>
          <UltraHero />
        </Suspense>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <UltraFeaturedBouquets />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <UltraCategories />
          </Suspense>
        </LazySection>
        {/* Simple and Modern Design Your Perfect Bouquet Section */}
        <LazySection rootMargin="400px 0px">
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-luxury text-5xl md:text-6xl font-bold text-slate-800 mb-6">
                  Design Your Perfect Bouquet
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mb-6"></div>
                <p className="font-body text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Create a custom arrangement with unlimited creativity. Choose from premium flowers and design something uniquely yours.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wand2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Style Presets</h3>
                  <p className="text-slate-600 leading-relaxed">Start with romantic, modern, or boho styles and personalize to your taste.</p>
                </div>

                <div className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Color Stories</h3>
                  <p className="text-slate-600 leading-relaxed">Explore curated color palettes perfect for any occasion or mood.</p>
                </div>

                <div className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Flower2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Premium Blooms</h3>
                  <p className="text-slate-600 leading-relaxed">Only the finest flowers sourced seasonally and responsibly.</p>
                </div>
              </div>

              <div className="text-center">
                <a href="/customize" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Start Designing
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </section>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <FlowerPersonalityQuiz />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <FlowerCareGuide />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="600px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>
    </div>
  );
};

export default Index;
