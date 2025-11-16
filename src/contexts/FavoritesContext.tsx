import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FavoriteProduct, FavoritesContextType } from '@/types/favorites';

// Create the Favorites Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Local storage key for persisting favorites data
const FAVORITES_STORAGE_KEY = 'bexy-flowers-favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  // Initialize favorites state from localStorage or empty array
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  });

  // Save favorites to localStorage whenever favorites changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  /**
   * Add a product to favorites
   */
  const addToFavorites = (product: FavoriteProduct): void => {
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
      return [...prevFavorites, normalizedProduct];
    });
  };

  /**
   * Remove a product from favorites
   */
  const removeFromFavorites = (productId: number | string): void => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );
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
  const clearFavorites = (): void => {
    setFavorites([]);
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

