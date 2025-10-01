import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import CartNavbar from '@/components/cart/CartNavbar';
import ProductList from '@/components/cart/ProductList';
import CartPage from '@/components/cart/CartPage';

const CartApp: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <CartNavbar />
          
          {/* Spacer for fixed navbar */}
          <div className="h-20" />
          
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default CartApp;
