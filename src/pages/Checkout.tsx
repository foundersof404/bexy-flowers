import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, CreditCard, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import BackToTop from '@/components/BackToTop';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();
  const deliveryFee = 4; // $4 delivery fee
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const phoneNumber = "96176104882";
    
    // Create professional WhatsApp message
    const orderDetails = cartItems.map((item, index) => {
      const itemNumber = index + 1;
      let itemStr = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n*Item ${itemNumber}:* ${item.title}`;
      
      // Add image URL if available
      if (item.image) {
        const imageUrl = item.image.startsWith('/') 
          ? `${window.location.origin}${item.image}`
          : item.image;
        itemStr += `\n\n📸 *Image:*\n${imageUrl}`;
      }
      
      itemStr += `\n\n💰 *Price:* $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
      
      if (item.size) {
        itemStr += `\n📏 *Size:* ${item.size}`;
      }
      
      if (item.personalNote) {
        itemStr += `\n💌 *Personal Note:*\n"${item.personalNote}"`;
      }
      
      itemStr += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      
      return itemStr;
    }).join("\n\n");

    const subtotal = getTotalPrice();
    const deliveryFee = 4;
    const finalTotal = subtotal + deliveryFee;

    // Create full detailed message with payment selection prompt
    const fullMessage = `🌸 *BEXY FLOWERS - NEW ORDER REQUEST* 🌸\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nHello! I would like to place an order with the following details:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${orderDetails}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💰 *PAYMENT SUMMARY*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📦 *Items Subtotal:* $${subtotal.toFixed(2)}\n🚚 *Delivery Fee:* $${deliveryFee.toFixed(2)}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💵 *TOTAL AMOUNT:* $${finalTotal.toFixed(2)}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💳 *PREFERRED PAYMENT METHOD:*\n\n_Please let me know which payment option works best:_\n\n✅ Option 1: *Whish Money Transfer*\n✅ Option 2: *Cash on Delivery (COD)*\n✅ Option 3: *Bank Transfer*\n✅ Option 4: *Credit/Debit Card*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📍 *DELIVERY INFORMATION*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⏱️ *Delivery Time:* 3-5 business days\n🌺 *Quality:* Handcrafted Fresh - Made to Order\n📦 *Delivery Fee:* $4.00 (All Areas)\n🎁 *Gift Wrapping:* Complimentary Premium Packaging\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nThank you for choosing *Bexy Flowers*! 💐\n\nWe're excited to create something beautiful for you. Please confirm your preferred payment method and delivery address, and we'll process your order immediately.\n\n_Looking forward to serving you!_ 🌸✨`;

    // Create shorter message for WhatsApp URL (to avoid URL length limits)
    const shortOrderDetails = cartItems.map((item, index) => {
      const itemNumber = index + 1;
      let shortStr = `*Item ${itemNumber}:* ${item.title} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
      if (item.size) shortStr += ` (${item.size})`;
      return shortStr;
    }).join('\n');

    const shortMessage = `🌸 *BEXY FLOWERS - NEW ORDER* 🌸\n\nHello! I'd like to place an order:\n\n${shortOrderDetails}\n\n*Subtotal:* $${subtotal.toFixed(2)}\n*Delivery:* $${deliveryFee.toFixed(2)}\n*TOTAL:* $${finalTotal.toFixed(2)}\n\n*Please confirm my preferred payment method:*\n• Whish Money\n• Cash on Delivery\n• Bank Transfer\n• Card Payment\n\nThank you! 💐`;

    // Copy full message to clipboard
    navigator.clipboard.writeText(fullMessage).then(() => {
      // Encode and create WhatsApp URL
      const encodedMessage = encodeURIComponent(shortMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert(`Popup was blocked. Please allow popups for this site.\n\nFull order details have been copied to your clipboard.\n\nPhone: +961 76 104 882`);
      } else {
        // Show success message
        setTimeout(() => {
          alert('Order details have been sent to WhatsApp!\n\nFull order details are also in your clipboard.\n\nYour cart will be cleared after confirmation.');
        }, 500);
      }
    }).catch(() => {
      // Fallback if clipboard fails
      const encodedMessage = encodeURIComponent(shortMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      alert(`Order details are ready to send!\n\nPhone: +961 76 104 882\n\nPlease copy the order details manually if needed.`);
    });
    
    // Clear cart after a delay to allow user to see the message
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 2000);
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
            <h1 
              className="font-luxury text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative uppercase"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                letterSpacing: '0.05em'
              }}
            >
              COMPLETE YOUR ORDER
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
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
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
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Payment Options</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-white/40 rounded-lg">
                <CreditCard className="w-6 h-6 text-amber-500" />
                <div>
                  <p className="font-semibold text-slate-800">Multiple Payment Methods Available</p>
                  <p className="text-slate-600 text-sm">Select your preferred option in WhatsApp</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="p-3 bg-amber-50/50 rounded-lg">✓ Whish Money</div>
                <div className="p-3 bg-amber-50/50 rounded-lg">✓ Cash on Delivery</div>
                <div className="p-3 bg-amber-50/50 rounded-lg">✓ Bank Transfer</div>
                <div className="p-3 bg-amber-50/50 rounded-lg">✓ Card Payment</div>
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
