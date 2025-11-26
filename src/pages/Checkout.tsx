import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, CreditCard, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import BackToTop from '@/components/BackToTop';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = () => {
    // In a real application, this would process the payment
    alert('Order placed successfully! Thank you for your purchase.');
    clearCart();
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Your cart is empty</h1>
          <p className="text-slate-600">Add some beautiful flowers to get started!</p>
          <motion.button
            className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            onClick={() => navigate('/collection')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
      <BackToTop />
    </>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.button
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Page Title */}
          <div className="text-center space-y-4">
            <h1 className="font-luxury text-4xl font-bold text-slate-800">
              Complete Your Order
            </h1>
            <p className="text-slate-600 text-lg">
              Review your selections and proceed to checkout
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-8">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-white/40 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    {item.size && (
                      <p className="text-sm text-amber-600 font-medium">Size: {item.size}</p>
                    )}
                    {item.personalNote && (
                      <div className="mt-2 p-2 bg-amber-50/60 rounded-lg border border-amber-200/60">
                        <p className="text-xs text-slate-500 mb-1">Personal Note:</p>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          "{item.personalNote}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">Qty: {item.quantity}</p>
                    <p className="text-amber-600 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-6 border-t border-amber-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax (8%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-amber-200">
                <span className="text-slate-800">Total</span>
                <span className="text-amber-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-amber-500" />
                <div>
                  <p className="font-semibold text-slate-800">Standard Delivery</p>
                  <p className="text-slate-600">3-5 business days</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-amber-500" />
                <div>
                  <p className="font-semibold text-slate-800">Handcrafted Fresh</p>
                  <p className="text-slate-600">Made to order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Payment Method</h2>
            
            <div className="flex items-center space-x-3 p-4 bg-white/40 rounded-lg">
              <CreditCard className="w-6 h-6 text-amber-500" />
              <div>
                <p className="font-semibold text-slate-800">Credit/Debit Card</p>
                <p className="text-slate-600">Secure payment processing</p>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <motion.button
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handlePlaceOrder}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Place Order - ${total.toFixed(2)}
          </motion.button>
        </motion.div>
      </div>
      <BackToTop />
    </motion.div>
  );
};

export default Checkout;
