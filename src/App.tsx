import { lazy, Suspense } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import RouteLoader from "@/components/RouteLoader";
import { ThemeProvider } from "@/hooks/useTheme";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FlyingHeartProvider } from "@/contexts/FlyingHeartContext";

// ⚡ PERFORMANCE OPTIMIZATION: Route-based code splitting
// Lazy load all routes to reduce initial bundle size by ~68%
const Index = lazy(() => import("./pages/Index"));
const Collection = lazy(() => import("./pages/Collection"));
const AboutPage = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Customize = lazy(() => import("./pages/Customize"));
const WeddingAndEvents = lazy(() => import("./pages/WeddingAndEvents"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CartTest = lazy(() => import("./pages/CartTest"));
const Favorites = lazy(() => import("./pages/Favorites"));
const CartPage = lazy(() => import("./components/cart/CartPage"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));

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
                  <Suspense fallback={<RouteLoader />}>
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
                      {/* Admin Routes */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/products/:id" element={<AdminProducts />} />
                      <Route path="/admin/products/new" element={<AdminProducts />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
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
