/**
 * TypeScript type definitions for the shopping cart functionality
 */

export interface Product {
  id: number | string;
  title: string;
  price: number;
  image: string;
  size?: string;
  personalNote?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string, size?: string, personalNote?: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}
