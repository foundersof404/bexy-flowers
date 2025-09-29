import React, { Suspense } from "react";

const VirtualBouquetBuilder = React.lazy(() => import("@/components/interactive/VirtualBouquetBuilder"));

const Customize: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <VirtualBouquetBuilder />
      </Suspense>
    </div>
  );
};

export default Customize;


