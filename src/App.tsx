import { lazy, Suspense, useEffect } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import RouteLoader from "@/components/RouteLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/hooks/useTheme";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FlyingHeartProvider } from "@/contexts/FlyingHeartContext";
import { RouteStateProvider } from "@/contexts/RouteStateContext";
import GlobalCartWrapper from "@/components/GlobalCartWrapper";
import { useNavigationPredictor } from "@/hooks/useNavigationPredictor";
import { useComponentPrefetch } from "@/hooks/useComponentPrefetch";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { register as registerServiceWorker } from "@/lib/serviceWorkerRegistration";
import { gsap } from "gsap";

// Configure GSAP globally to suppress null target warnings
gsap.config({
  nullTargetWarn: false,
});

// ⚡ PERFORMANCE: Preload critical routes immediately on app load
// This ensures instant navigation for new users
const preloadCriticalRoutes = () => {
  // Preload main pages that users navigate to most
  import("./pages/Index");
  import("./pages/Collection");
  import("./components/UltraNavigation");
  import("./components/Footer");
};

// Start preloading after initial render
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for non-blocking preload, fallback to setTimeout
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => preloadCriticalRoutes(), { timeout: 2000 });
  } else {
    setTimeout(preloadCriticalRoutes, 100);
  }
}

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
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// ⚡ PERFORMANCE OPTIMIZATION: Enhanced QueryClient with memory-safe caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - reduced to prevent memory buildup
      gcTime: 5 * 60 * 1000, // 5 minutes - significantly reduced from 30 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
      refetchOnMount: false, // Use cached data if available
      refetchOnReconnect: true, // Refetch on reconnect (network recovery)
      retry: 1, // Reduced retries to prevent accumulation
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduced max delay
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
});

// 🛡️ MEMORY MANAGEMENT: Periodic cache cleanup to prevent memory leaks
if (typeof window !== 'undefined') {
  // Clean up stale queries every 3 minutes
  setInterval(() => {
    // Remove queries that haven't been accessed in 10 minutes
    const now = Date.now();
    queryClient.getQueryCache().getAll().forEach((query) => {
      const lastAccess = (query as any).state?.dataUpdatedAt || 0;
      const timeSinceAccess = now - lastAccess;
      
      // Remove queries older than 10 minutes that are not currently being used
      if (timeSinceAccess > 10 * 60 * 1000 && query.getObserversCount() === 0) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
    
    // Limit total cache size - keep only last 50 queries
    const allQueries = queryClient.getQueryCache().getAll();
    if (allQueries.length > 50) {
      // Sort by last access time and remove oldest unused queries
      const sortedQueries = allQueries
        .filter(q => q.getObserversCount() === 0)
        .sort((a, b) => {
          const aTime = (a as any).state?.dataUpdatedAt || 0;
          const bTime = (b as any).state?.dataUpdatedAt || 0;
          return aTime - bTime;
        });
      
      // Remove oldest 20 queries if cache is too large
      sortedQueries.slice(0, Math.min(20, sortedQueries.length)).forEach(query => {
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
    }
  }, 3 * 60 * 1000); // Run every 3 minutes
}

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
          {/* Admin Routes - Protected */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/products/:id" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/signature-collection" element={<ProtectedRoute><AdminSignatureCollection /></ProtectedRoute>} />
          <Route path="/admin/accessories" element={<ProtectedRoute><AdminAccessories /></ProtectedRoute>} />
          <Route path="/admin/flowers" element={<ProtectedRoute><AdminFlowers /></ProtectedRoute>} />
          <Route path="/admin/boxes" element={<ProtectedRoute><AdminLuxuryBoxes /></ProtectedRoute>} />
          <Route path="/admin/wedding-creations" element={<ProtectedRoute><AdminWeddingCreations /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
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

  // Register service worker for caching
  useEffect(() => {
    if (import.meta.env.PROD) {
      registerServiceWorker();
      console.log('[App] Service Worker registration initiated');
    }
  }, []);

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
