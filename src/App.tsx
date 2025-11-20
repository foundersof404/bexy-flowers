import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";
import Customize from "./pages/Customize";
import WeddingAndEvents from "./pages/WeddingAndEvents";
import ProductDetailPage from "./pages/ProductDetailPage";
import Checkout from "./pages/Checkout";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/hooks/useTheme";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FlyingHeartProvider } from "@/contexts/FlyingHeartContext";
import CartTest from "@/pages/CartTest";
import Favorites from "@/pages/Favorites";
import CartPage from "@/components/cart/CartPage";

const queryClient = new QueryClient();

const App = () => {
  // Initialize smooth scrolling
  useSmoothScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <CartProvider>
            <FavoritesProvider>
              <FlyingHeartProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/customize" element={<Customize />} />
                    <Route path="/wedding-and-events" element={<WeddingAndEvents />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/cart-test" element={<CartTest />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </FlyingHeartProvider>
            </FavoritesProvider>
          </CartProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
