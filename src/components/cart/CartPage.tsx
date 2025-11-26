import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const isEmpty = cartItems.length === 0;
  const totalPrice = getTotalPrice();

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleCheckout = () => {
    const phoneNumber = "96176104882";
    
    const orderDetails = cartItems.map((item) => {
      let itemStr = `*Item:* ${item.title}\n*Price:* $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
      
      if (item.description) itemStr += `\n*Details:* ${item.description}`;
      if (item.size) itemStr += `\n*Size:* ${item.size}`;
      if (item.personalNote) itemStr += `\n*Personal Note:* ${item.personalNote}`;
      // Only include image link if it's a real URL (not a blob or local asset if possible, but local won't work anyway)
      // Pollinations URL will start with https
      if (item.image && item.image.startsWith('http')) {
        itemStr += `\n*Image Reference:* ${item.image}`;
      }
      
      return itemStr;
    }).join("\n\n-------------------\n\n");

    const total = getTotalPrice();
    const tax = total * 0.08;
    const finalTotal = total + tax;

    const finalMessage = `Hello, I would like to place an order:\n\n${orderDetails}\n\n*Subtotal:* $${total.toFixed(2)}\n*Tax:* $${tax.toFixed(2)}\n*TOTAL:* $${finalTotal.toFixed(2)}\n\n*Payment Method:* Whish Money / Cash on Delivery`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    // Use window.location.href for better mobile deep link support
    window.location.href = whatsappUrl;
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          </div>
          
          <h2 className="font-luxury text-3xl font-bold text-slate-800 mb-4">
            Your cart is empty
          </h2>
          
          <p className="text-slate-600 mb-8 font-body">
            Looks like you haven't added any beautiful arrangements to your cart yet. 
            Start shopping to find the perfect flowers for your special moments.
          </p>
          
          <Button
            onClick={handleContinueShopping}
            className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-luxury text-4xl sm:text-5xl font-bold text-slate-800 mb-2">
              Shopping Cart
            </h1>
            <p className="text-slate-600 font-body">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <Button
            onClick={handleContinueShopping}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 bg-white/60 backdrop-blur-sm border border-white/30">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-luxury text-lg font-bold text-slate-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 font-body text-sm">
                        ${item.price} each
                      </p>
                      {item.size && (
                        <div className="mt-2">
                          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                            Size: {item.size}
                          </span>
                        </div>
                      )}
                      {item.description && (
                        <div className="mt-2">
                          <p className="text-slate-500 text-xs italic max-w-md">
                            "{item.description}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-1">Quantity</p>
                        <div className="flex items-center gap-2">
                          <span className="font-luxury text-lg font-bold text-slate-800">
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-1">Subtotal</p>
                        <p className="font-luxury text-lg font-bold text-amber-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        onClick={() => removeFromCart(item.id, item.size, item.personalNote)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/30 sticky top-8">
              <h3 className="font-luxury text-2xl font-bold text-slate-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
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
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between font-luxury text-xl font-bold text-slate-800">
                    <span>Total</span>
                    <span>${(totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold py-3 rounded-full"
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                Secure checkout powered by our trusted payment partners
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
