import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { CartItem, CartContextType, Product } from '@/types/cart';
import { getVisitorCart, upsertVisitorCartItem, removeVisitorCartItem, updateVisitorCartItemQuantity, clearVisitorCart, syncCartToDatabase } from '@/lib/api/visitor-cart';

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for persisting cart data (used as fallback/cache)
const CART_STORAGE_KEY = 'bexy-flowers-cart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const syncTimeoutRef = useRef<number | null>(null);

  // Load cart from database on mount - NON-BLOCKING
  useEffect(() => {
    const loadCartFromDatabase = async () => {
      try {
        // CRITICAL FIX: Load from localStorage FIRST (instant, non-blocking)
        // This prevents the page from freezing while waiting for database
        try {
          const savedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            const localCart = JSON.parse(savedCart);
            setCartItems(localCart);
            setIsLoading(false); // Immediately show cached data
            isInitialLoad.current = false;
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
        
        // Then try to sync with database in the background (non-blocking)
        // Only if we're in production or Netlify Dev is running
        if (import.meta.env.PROD || import.meta.env.VITE_USE_NETLIFY_FUNCTIONS === 'true') {
          const dbCart = await getVisitorCart();

          if (dbCart.length > 0) {
            // Database has cart items, use them
            setCartItems(dbCart);
            // Update localStorage as cache
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dbCart));
          } else if (cartItems.length > 0) {
            // Sync local cart to database if database is empty
            await syncCartToDatabase(cartItems);
          }
        }
      } catch (error) {
        // Silently fail - we already have localStorage data
        if (!(error instanceof Error && error.message === 'NETLIFY_FUNCTIONS_UNAVAILABLE')) {
          console.warn('Background cart sync failed:', error);
        }
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadCartFromDatabase();
  }, []);

  // Sync cart to database whenever cartItems changes (debounced)
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
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        // Sync to database
        await syncCartToDatabase(cartItems);
      } catch (error) {
        console.error('Error syncing cart to database:', error);
        // Still save to localStorage even if DB sync fails
      }
    }, 500);

    // Cleanup timeout on unmount
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [cartItems]);

  /**
   * Add a product to the cart or increment quantity if it already exists
   */
  const addToCart = async (product: Product): Promise<void> => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item =>
        item.id === product.id &&
        item.size === product.size &&
        item.personalNote === product.personalNote &&
        item.description === product.description
      );

      let newItems: CartItem[];

      if (existingItem) {
        // If item exists with same size, note, and description, increment quantity
        newItems = prevItems.map(item =>
          item.id === product.id &&
            item.size === product.size &&
            item.personalNote === product.personalNote &&
            item.description === product.description
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist with this combination, add it with quantity 1
        newItems = [...prevItems, { ...product, quantity: 1 }];
      }

      // Sync the new item to database (async, non-blocking)
      const newItem = newItems.find(item =>
        item.id === product.id &&
        item.size === product.size &&
        item.personalNote === product.personalNote &&
        item.description === product.description
      );

      if (newItem) {
        upsertVisitorCartItem(newItem).catch(error => {
          console.error('Error syncing cart item to database:', error);
        });
      }

      return newItems;
    });
  };

  /**
   * Remove a product completely from the cart
   */
  const removeFromCart = async (productId: number | string, size?: string, personalNote?: string): Promise<void> => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.id === productId &&
          item.size === size &&
          item.personalNote === personalNote)
      )
    );

    // Remove from database (async, non-blocking)
    removeVisitorCartItem(productId, size, personalNote).catch(error => {
      console.error('Error removing cart item from database:', error);
    });
  };

  /**
   * Get the total number of items in the cart (sum of all quantities)
   */
  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Get the total price of all items in the cart
   */
  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  /**
   * Update the quantity of a specific cart item
   */
  const updateQuantity = async (productId: number | string, newQuantity: number, size?: string, personalNote?: string): Promise<void> => {
    if (newQuantity <= 0) {
      await removeFromCart(productId, size, personalNote);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId &&
          item.size === size &&
          item.personalNote === personalNote
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Update quantity in database (async, non-blocking)
    updateVisitorCartItemQuantity(productId, newQuantity, size, personalNote).catch(error => {
      console.error('Error updating cart item quantity in database:', error);
    });
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = async (): Promise<void> => {
    setCartItems([]);

    // Clear from database (async, non-blocking)
    clearVisitorCart().catch(error => {
      console.error('Error clearing cart from database:', error);
    });
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use the cart context
 * This ensures the hook is used within a CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
