import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { FavoriteProduct, FavoritesContextType } from '@/types/favorites';
import { getVisitorFavorites, addVisitorFavorite, removeVisitorFavorite, clearVisitorFavorites, syncFavoritesToDatabase } from '@/lib/api/visitor-favorites';

// Create the Favorites Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Local storage key for persisting favorites data (used as fallback/cache)
const FAVORITES_STORAGE_KEY = 'bexy-flowers-favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const syncTimeoutRef = useRef<number | null>(null);

  // Load favorites from database on mount - NON-BLOCKING
  useEffect(() => {
    const loadFavoritesFromDatabase = async () => {
      try {
        // CRITICAL FIX: Load from localStorage FIRST (instant, non-blocking)
        // This prevents the page from freezing while waiting for database
        try {
          const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
          if (savedFavorites) {
            const localFavorites = JSON.parse(savedFavorites);
            setFavorites(localFavorites);
            setIsLoading(false); // Immediately show cached data
            isInitialLoad.current = false;
          }
        } catch (error) {
          console.error('Error loading favorites from localStorage:', error);
        }
        
        // Then try to sync with database in the background (non-blocking)
        // Only if we're in production or Netlify Dev is running
        if (import.meta.env.PROD || import.meta.env.VITE_USE_NETLIFY_FUNCTIONS === 'true') {
          const dbFavorites = await getVisitorFavorites();
          
          if (dbFavorites.length > 0) {
            // Database has favorites, use them
            setFavorites(dbFavorites);
            // Update localStorage as cache
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(dbFavorites));
          } else if (favorites.length > 0) {
            // Sync local favorites to database if database is empty
            await syncFavoritesToDatabase(favorites);
          }
        }
      } catch (error) {
        // Silently fail - we already have localStorage data
        if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
          console.warn('Background favorites sync failed:', error);
        }
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadFavoritesFromDatabase();
  }, []);

  // Sync favorites to database whenever favorites changes (debounced)
  useEffect(() => {
    // Skip initial load
    if (isInitialLoad.current) {
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce database sync (wait 500ms after last change)
    syncTimeoutRef.current = window.setTimeout(async () => {
      try {
        // Save to localStorage as cache
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        // Sync to database
        await syncFavoritesToDatabase(favorites);
      } catch (error) {
        console.error('Error syncing favorites to database:', error);
        // Still save to localStorage even if DB sync fails
      }
    }, 500);

    // Cleanup timeout on unmount
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [favorites]);

  /**
   * Add a product to favorites
   */
  const addToFavorites = async (product: FavoriteProduct): Promise<void> => {
    setFavorites(prevFavorites => {
      // Check if product already exists
      const exists = prevFavorites.some(item => item.id === product.id);
      if (exists) {
        return prevFavorites; // Already in favorites
      }
      // Normalize product data
      const normalizedProduct: FavoriteProduct = {
        id: product.id,
        title: product.title || product.name || '',
        price: product.price,
        image: product.image || product.imageUrl || '',
        imageUrl: product.imageUrl || product.image || '',
        description: product.description,
        category: product.category,
        featured: product.featured,
        name: product.name || product.title || ''
      };
      
      // Add to database (async, non-blocking)
      addVisitorFavorite(normalizedProduct).catch(error => {
        console.error('Error adding favorite to database:', error);
      });

      return [...prevFavorites, normalizedProduct];
    });
  };

  /**
   * Remove a product from favorites
   */
  const removeFromFavorites = async (productId: number | string): Promise<void> => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );

    // Remove from database (async, non-blocking)
    removeVisitorFavorite(productId).catch(error => {
      console.error('Error removing favorite from database:', error);
    });
  };

  /**
   * Check if a product is in favorites
   */
  const isFavorite = (productId: number | string): boolean => {
    return favorites.some(item => item.id === productId);
  };

  /**
   * Toggle favorite status of a product
   */
  const toggleFavorite = (product: FavoriteProduct): void => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  /**
   * Get the total number of favorites
   */
  const getTotalFavorites = (): number => {
    return favorites.length;
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = async (): Promise<void> => {
    setFavorites([]);

    // Clear from database (async, non-blocking)
    clearVisitorFavorites().catch(error => {
      console.error('Error clearing favorites from database:', error);
    });
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getTotalFavorites,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Custom hook to use the favorites context
 * This ensures the hook is used within a FavoritesProvider
 */
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

