import React, { Suspense } from "react";
import UltraNavigation from "@/components/UltraNavigation";
import LazySection from "@/components/LazySection";
import PremiumBouquetBuilder from "@/components/bouquet/PremiumBouquetBuilder";
import { BouquetState } from "@/types/bouquet";
import { toast } from "sonner";

const Footer = React.lazy(() => import("@/components/Footer"));

const Customize: React.FC = () => {
  const handleOrder = (bouquet: BouquetState) => {
    // Handle the order - you can integrate with your cart system here
    console.log('Order placed:', bouquet);
    
    // Show success message
    toast.success('Your premium bouquet has been added to cart!', {
      description: `Total: $${bouquet.totalPrice.toFixed(2)} for ${Object.values(bouquet.selectedFlowers).reduce((sum, item) => sum + item.quantity, 0)} premium flowers`,
      duration: 5000,
    });
    
    // You can redirect to cart or show a modal here
    // navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <UltraNavigation />
      <PremiumBouquetBuilder onOrder={handleOrder} />
      <LazySection rootMargin="600px 0px">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default Customize;


