import React, { Suspense } from "react";
import UltraNavigation from "@/components/UltraNavigation";
import LazySection from "@/components/LazySection";

const VirtualBouquetBuilder = React.lazy(() => import("@/components/interactive/VirtualBouquetBuilder"));
const Footer = React.lazy(() => import("@/components/Footer"));

const Customize: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <UltraNavigation />
      <Suspense fallback={null}>
        <VirtualBouquetBuilder />
      </Suspense>
      <LazySection rootMargin="600px 0px">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default Customize;


