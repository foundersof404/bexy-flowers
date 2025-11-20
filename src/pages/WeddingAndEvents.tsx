import React, { Suspense } from "react";
import LazySection from "@/components/LazySection";
import UltraNavigation from "@/components/UltraNavigation";
import Footer from "@/components/Footer";

const WeddingAndEvents = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <UltraNavigation />
      <div className="relative z-10">
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            {/* Content will be added later */}
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

export default WeddingAndEvents;

