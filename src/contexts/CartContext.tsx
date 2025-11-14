import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, CartContextType, Product } from '@/types/cart';

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for persisting cart data
const CART_STORAGE_KEY = 'bexy-flowers-cart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize cart state from localStorage or empty array
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  /**
   * Add a product to the cart or increment quantity if it already exists
   */
  const addToCart = (product: Product): void => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.size === product.size && 
        item.personalNote === product.personalNote &&
        item.description === product.description
      );
      
      if (existingItem) {
        // If item exists with same size, note, and description, increment quantity
        return prevItems.map(item =>
          item.id === product.id && 
          item.size === product.size && 
          item.personalNote === product.personalNote &&
          item.description === product.description
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist with this combination, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  /**
   * Remove a product completely from the cart
   */
  const removeFromCart = (productId: number | string, size?: string, personalNote?: string): void => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === productId && 
          item.size === size && 
          item.personalNote === personalNote)
      )
    );
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
  const updateQuantity = (productId: number | string, newQuantity: number, size?: string, personalNote?: string): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, personalNote);
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
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = (): void => {
    setCartItems([]);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
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
