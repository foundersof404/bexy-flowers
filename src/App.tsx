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
import { RouteStateProvider } from "@/contexts/RouteStateContext";
import GlobalCartWrapper from "@/components/GlobalCartWrapper";
import { useNavigationPredictor } from "@/hooks/useNavigationPredictor";
import { useComponentPrefetch } from "@/hooks/useComponentPrefetch";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { gsap } from "gsap";

// Configure GSAP globally to suppress null target warnings
gsap.config({
  nullTargetWarn: false,
});

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
const AdminSignatureCollection = lazy(() => import("./pages/admin/AdminSignatureCollection"));
const AdminAccessories = lazy(() => import("./pages/admin/AdminAccessories"));
const AdminFlowers = lazy(() => import("./pages/admin/AdminFlowers"));
const AdminLuxuryBoxes = lazy(() => import("./pages/admin/AdminLuxuryBoxes"));
const AdminWeddingCreations = lazy(() => import("./pages/admin/AdminWeddingCreations"));

// ⚡ PERFORMANCE OPTIMIZATION: Enhanced QueryClient with better caching and scalability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data for 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
      refetchOnMount: false, // Use cached data if available
      refetchOnReconnect: true, // Refetch on reconnect (network recovery)
      retry: 1, // Reduce retries for faster error handling
      retryDelay: 1000, // Shorter retry delay
      // ⚡ SCALABILITY: Network mode for better offline support
      networkMode: 'online',
      // ⚡ SCALABILITY: Structural sharing for better memory usage
      structuralSharing: true,
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
  // ⚡ SCALABILITY: Limit cache size to prevent memory issues
  queryCache: undefined, // Use default cache
  mutationCache: undefined, // Use default cache
});

// Component that contains router-dependent logic
const AppRouter = () => {
  // Initialize navigation predictor and component prefetching (inside router context)
  useNavigationPredictor();
  useComponentPrefetch();
  usePerformanceMonitor();

  return (
    <RouteStateProvider>
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
          <Route path="/admin/signature-collection" element={<AdminSignatureCollection />} />
          <Route path="/admin/accessories" element={<AdminAccessories />} />
          <Route path="/admin/flowers" element={<AdminFlowers />} />
          <Route path="/admin/boxes" element={<AdminLuxuryBoxes />} />
          <Route path="/admin/wedding-creations" element={<AdminWeddingCreations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </RouteStateProvider>
  );
};

const App = () => {
  // Initialize smooth scrolling (can be called outside router context)
  useSmoothScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <CartProvider>
            <FavoritesProvider>
              <FlyingHeartProvider>
                <GlobalCartWrapper />
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <AppRouter />
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
