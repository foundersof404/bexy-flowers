/**
 * TypeScript type definitions for the shopping cart functionality
 */

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  size?: string;
  description?: string;
  accessories?: string[];
  giftInfo?: {
    recipient: string;
    deliveryDate: string;
    message: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  description?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}
