import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CartDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDashboard: React.FC<CartDashboardProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isEmpty = cartItems.length === 0;
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      onClose();
      // In a real app, redirect to payment or show success message
    }, 2000);
  };

  // Handle escape key to close cart
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-luxury text-xl font-bold text-slate-800">
                    Shopping Cart
                  </h2>
                  <p className="text-sm text-slate-600">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              {isEmpty ? (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-luxury text-xl font-bold text-slate-800 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Add some beautiful arrangements to get started
                    </p>
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4 bg-slate-50 border border-slate-200">
                          <div className="flex items-center space-x-4">
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-luxury font-semibold text-slate-800 truncate">
                                {item.title}
                              </h3>
                              <p className="text-sm text-slate-600">
                                ${item.price} each
                              </p>
                              
                              {/* Size and Personal Note */}
                              {item.size && (
                                <p className="text-xs text-amber-600 font-medium">
                                  Size: {item.size}
                                </p>
                              )}
                              
                              {item.personalNote && (
                                <div className="mt-2 p-2 bg-white/60 rounded-lg border border-amber-200/60">
                                  <p className="text-xs text-slate-500 mb-1">Personal Note:</p>
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    "{item.personalNote}"
                                  </p>
                                </div>
                              )}
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                              </div>
                            </div>

                            {/* Price and Remove */}
                            <div className="text-right">
                              <p className="font-luxury font-bold text-amber-700">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                onClick={() => removeFromCart(item.id, item.size, item.personalNote)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-200 p-6 bg-slate-50">
                    {/* Order Summary */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-slate-600">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      
                      <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span>${(totalPrice * 0.08).toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-slate-300 pt-3">
                        <div className="flex justify-between font-luxury text-lg font-bold text-slate-800">
                          <span>Total</span>
                          <span>${(totalPrice * 1.08).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold py-3 rounded-full"
                      >
                        {isCheckingOut ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <CreditCard className="w-4 h-4" />
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                      
                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cart
                      </Button>
                    </div>

                    <p className="text-xs text-slate-500 text-center mt-4">
                      Secure checkout powered by our trusted partners
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDashboard;
