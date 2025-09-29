import React, { Suspense } from "react";
import LazySection from "@/components/LazySection";
import UltraNavigation from "@/components/UltraNavigation";
const InteractiveBackground = React.lazy(() => import("@/components/interactive/InteractiveBackground"));
const UltraHero = React.lazy(() => import("@/components/UltraHero"));
const UltraFeaturedBouquets = React.lazy(() => import("@/components/UltraFeaturedBouquets"));
const UltraCategories = React.lazy(() => import("@/components/UltraCategories"));
const VirtualBouquetBuilder = React.lazy(() => import("@/components/interactive/VirtualBouquetBuilder"));
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
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <VirtualBouquetBuilder />
          </Suspense>
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
