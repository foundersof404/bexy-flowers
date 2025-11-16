import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight, Sparkles, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDashboard: React.FC<CartDashboardProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isEmpty = cartItems.length === 0;
  const totalPrice = getTotalPrice();
  const accentColor = '#C79E48';

  const handleCheckout = () => {
    if (isEmpty || isCheckingOut) return;
    
    setIsCheckingOut(true);
    setTimeout(() => {
      try {
        clearCart();
        setIsCheckingOut(false);
        onClose();
        // In a real app, you would redirect to checkout page here
        // navigate('/checkout');
      } catch (error) {
        console.error('Checkout error:', error);
        setIsCheckingOut(false);
      }
    }, 2000);
  };
  
  const handleClearCart = () => {
    if (isEmpty) return;
    
    // Confirm before clearing
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      clearCart();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dashboard - Sharp Architectural Design */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-white shadow-2xl z-50 overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
            }}
          >
            {/* Geometric Pattern Background */}
            <div 
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 10px, ${accentColor} 10px, ${accentColor} 20px),
                  repeating-linear-gradient(-45deg, transparent, transparent 10px, ${accentColor} 10px, ${accentColor} 20px)
                `,
                backgroundSize: '28px 28px'
              }}
            />

            {/* Header - Sharp Professional Design */}
            <div 
              className="relative flex items-center justify-between p-6 border-b-2"
              style={{
                borderColor: `${accentColor}20`,
                background: `linear-gradient(135deg, ${accentColor}08 0%, white 100%)`
              }}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    boxShadow: `0 4px 12px ${accentColor}30`
                  }}
                >
                  <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 
                    className="font-luxury text-2xl font-bold text-slate-900"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    Shopping Cart
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-10 h-10 rounded-lg hover:bg-slate-100"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-[calc(100%-80px)]">
              {isEmpty ? (
                /* Empty State - Sharp Design */
                <div className="flex-1 flex items-center justify-center p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div 
                      className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%)`,
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                        border: `2px solid ${accentColor}30`
                      }}
                    >
                      <ShoppingCart className="w-10 h-10" style={{ color: accentColor }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-luxury text-2xl font-bold text-slate-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-xs mx-auto">
                      Add some beautiful arrangements to get started
                    </p>
                    <Button
                      onClick={onClose}
                      className="px-8 py-3 font-semibold uppercase tracking-wider"
                      style={{
                        background: accentColor,
                        color: 'white',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                        boxShadow: `0 4px 12px ${accentColor}30`
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Cart Items - Professional Sharp Layout with Custom Scrollbar */}
                  <div 
                    className="flex-1 overflow-y-auto p-6 space-y-4 cart-scrollbar"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: `${accentColor}40 transparent`
                    }}
                  >
                    {cartItems.map((item, index) => {
                      // Create unique key based on item properties
                      const uniqueKey = `${item.id}-${item.size || 'default'}-${item.personalNote || 'no-note'}-${index}`;
                      return (
                      <motion.div
                        key={uniqueKey}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="relative"
                        style={{
                          background: 'white',
                          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                          border: `1px solid ${accentColor}20`,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div className="p-4 sm:p-5">
                          <div className="flex gap-3 sm:gap-4">
                            {/* Product Image - Enhanced Sharp Design */}
                            <div 
                              className="flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 relative group/image"
                              style={{
                                width: '90px',
                                height: '90px',
                                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                                border: `2px solid ${accentColor}20`,
                                boxShadow: `0 2px 8px ${accentColor}10`
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
                              />
                              {/* Image Overlay on Hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Product Details - Enhanced Professional Layout */}
                            <div className="flex-1 min-w-0 space-y-2.5">
                              <div className="space-y-1.5">
                                <h3 
                                  className="font-luxury font-bold text-slate-900 text-base sm:text-lg leading-tight line-clamp-2"
                                  style={{ letterSpacing: '-0.01em' }}
                                >
                                  {item.title}
                                </h3>
                                
                                {/* Price Display - Enhanced */}
                                <div className="flex items-baseline gap-2">
                                  <span 
                                    className="font-luxury font-bold text-lg sm:text-xl"
                                    style={{ color: accentColor }}
                                  >
                                    ${item.price.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-slate-500 font-medium">each</span>
                                  {item.quantity > 1 && (
                                    <span className="text-xs text-slate-400 ml-1">
                                      × {item.quantity}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Item Total - Prominent Display */}
                                {item.quantity > 1 && (
                                  <div className="flex items-center gap-1.5 pt-0.5">
                                    <span className="text-xs text-slate-500 font-medium">Subtotal:</span>
                                    <span 
                                      className="font-luxury font-bold text-base"
                                      style={{ color: accentColor }}
                                    >
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Size and Personal Note - Sharp Design */}
                              {item.size && (
                                <div 
                                  className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
                                  style={{
                                    color: accentColor,
                                    background: `${accentColor}10`,
                                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                                    border: `1px solid ${accentColor}30`
                                  }}
                                >
                                  Size: {item.size}
                                </div>
                              )}
                              
                              {/* Accessories Display - Enhanced */}
                              {item.accessories && item.accessories.length > 0 && (
                                <div 
                                  className="flex flex-wrap gap-1.5"
                                >
                                  {item.accessories.map((accessory, accIndex) => (
                                    <span
                                      key={accIndex}
                                      className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                                      style={{
                                        color: accentColor,
                                        background: `${accentColor}10`,
                                        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))',
                                        border: `1px solid ${accentColor}25`
                                      }}
                                    >
                                      {accessory}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {item.personalNote && (
                                <div 
                                  className="p-2.5 sm:p-3 text-xs leading-relaxed"
                                  style={{
                                    background: `${accentColor}05`,
                                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                                    border: `1px solid ${accentColor}20`
                                  }}
                                >
                                  <p className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Personal Note:
                                  </p>
                                  <p className="text-slate-700 italic leading-relaxed">"{item.personalNote}"</p>
                                </div>
                              )}
                              
                              {/* Gift Info Display - Enhanced */}
                              {item.giftInfo && (
                                <div 
                                  className="p-2.5 sm:p-3 text-xs leading-relaxed"
                                  style={{
                                    background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}03 100%)`,
                                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                                    border: `1.5px solid ${accentColor}25`
                                  }}
                                >
                                  <p className="text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    Gift Information:
                                  </p>
                                  <div className="space-y-1 text-slate-600">
                                    {item.giftInfo.recipient && (
                                      <p><span className="font-semibold">To:</span> {item.giftInfo.recipient}</p>
                                    )}
                                    {item.giftInfo.deliveryDate && (
                                      <p><span className="font-semibold">Delivery:</span> {item.giftInfo.deliveryDate}</p>
                                    )}
                                    {item.giftInfo.message && (
                                      <p className="italic mt-1">"{item.giftInfo.message}"</p>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Quantity Controls - Enhanced Sharp Design */}
                              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Quantity:</span>
                                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg" style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        try {
                                          const newQuantity = item.quantity - 1;
                                          if (newQuantity >= 0) {
                                            updateQuantity(item.id, newQuantity, item.size, item.personalNote);
                                          }
                                        } catch (error) {
                                          console.error('Error updating quantity:', error);
                                        }
                                      }}
                                      disabled={item.quantity <= 1}
                                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      style={{
                                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                                        border: '1px solid #e2e8f0'
                                      }}
                                      whileHover={item.quantity > 1 ? { scale: 1.05, backgroundColor: 'white' } : {}}
                                      whileTap={item.quantity > 1 ? { scale: 0.95 } : {}}
                                      title={item.quantity <= 1 ? 'Minimum quantity is 1' : 'Decrease quantity'}
                                    >
                                      <Minus className="w-4 h-4" strokeWidth={2.5} />
                                    </motion.button>
                                    <span className="w-10 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        try {
                                          const newQuantity = item.quantity + 1;
                                          // Optional: Add max quantity limit (e.g., 99)
                                          if (newQuantity <= 99) {
                                            updateQuantity(item.id, newQuantity, item.size, item.personalNote);
                                          }
                                        } catch (error) {
                                          console.error('Error updating quantity:', error);
                                        }
                                      }}
                                      disabled={item.quantity >= 99}
                                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      style={{
                                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                                        border: '1px solid #e2e8f0'
                                      }}
                                      whileHover={item.quantity < 99 ? { scale: 1.05, backgroundColor: 'white' } : {}}
                                      whileTap={item.quantity < 99 ? { scale: 0.95 } : {}}
                                      title={item.quantity >= 99 ? 'Maximum quantity is 99' : 'Increase quantity'}
                                    >
                                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    </motion.button>
                                  </div>
                                </div>
                                
                                {/* Total Price - Enhanced Display */}
                                <div className="text-right">
                                  <p className="text-xs text-slate-500 font-medium mb-0.5">Item Total</p>
                                  <p 
                                    className="font-luxury font-bold text-lg sm:text-xl"
                                    style={{ color: accentColor }}
                                  >
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Remove Button - Enhanced Sharp Design with Confirmation */}
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                try {
                                  // Optional: Add confirmation for single item removal
                                  if (window.confirm(`Remove "${item.title}" from cart?`)) {
                                    removeFromCart(item.id, item.size, item.personalNote);
                                  }
                                } catch (error) {
                                  console.error('Error removing item:', error);
                                }
                              }}
                              className="w-9 h-9 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 transition-all flex-shrink-0"
                              style={{
                                clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
                                border: '1.5px solid #fee2e2',
                                boxShadow: '0 1px 3px rgba(239, 68, 68, 0.1)'
                              }}
                              whileHover={{ scale: 1.1, backgroundColor: '#fef2f2' }}
                              whileTap={{ scale: 0.9 }}
                              title="Remove item from cart"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>

                  {/* Footer - Sharp Professional Design */}
                  <div 
                    className="border-t-2 p-6 space-y-6"
                    style={{
                      borderColor: `${accentColor}20`,
                      background: `linear-gradient(180deg, white 0%, ${accentColor}03 100%)`
                    }}
                  >
                    {/* Order Summary - Professional Layout */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Subtotal ({cartItems.length} items)</span>
                        <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Shipping</span>
                        <span className="font-semibold text-green-600">Free</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Tax</span>
                        <span className="font-semibold text-slate-900">${(totalPrice * 0.08).toFixed(2)}</span>
                      </div>
                      
                      <div 
                        className="pt-3 border-t-2"
                        style={{ borderColor: `${accentColor}30` }}
                      >
                        <div className="flex justify-between items-baseline">
                          <span className="font-luxury text-xl font-bold text-slate-900">Total</span>
                          <span 
                            className="font-luxury text-2xl font-bold"
                            style={{ color: accentColor }}
                          >
                            ${(totalPrice * 1.08).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Sharp Professional Design */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full py-4 font-semibold text-sm uppercase tracking-wider relative overflow-hidden"
                        style={{
                          background: accentColor,
                          color: 'white',
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                          boxShadow: `0 4px 12px ${accentColor}30`
                        }}
                      >
                        {isCheckingOut ? (
                          <div className="flex items-center justify-center space-x-2">
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
                        onClick={handleClearCart}
                        variant="outline"
                        disabled={isEmpty}
                        className="w-full py-3 border-red-300 text-red-600 hover:bg-red-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cart
                      </Button>
                    </div>

                    <p className="text-xs text-slate-500 text-center pt-2">
                      <Package className="w-3 h-3 inline mr-1" />
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