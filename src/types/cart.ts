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
  removeFromCart: (productId: number | string, size?: string, personalNote?: string) => void;
  updateQuantity?: (productId: number | string, newQuantity: number, size?: string, personalNote?: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}
