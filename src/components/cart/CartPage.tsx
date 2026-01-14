import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import UltraNavigation from '@/components/UltraNavigation';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);
  const componentMountedRef = useRef(false);

  const isEmpty = cartItems.length === 0;
  const totalPrice = getTotalPrice();

  // Track component lifecycle
  useEffect(() => {
    componentMountedRef.current = true;

    // GLOBAL CLICK LISTENER - to catch ALL clicks (only in development)
    let globalClickHandler: ((e: MouseEvent) => void) | null = null;
    if (process.env.NODE_ENV === 'development') {
      globalClickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target && (target.textContent?.includes('Proceed to Checkout') || target.closest('button')?.textContent?.includes('Proceed to Checkout'))) {
          console.log('🌍 GLOBAL CLICK DETECTED on checkout button!');
        }
      };
      document.addEventListener('click', globalClickHandler, true);
    }

    // Check if button exists and add test listener (only in development)
    let testHandlerCleanup: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (process.env.NODE_ENV === 'development') {
      const checkButton = () => {
        if (checkoutButtonRef.current) {
          // Add a test click listener directly to the DOM element
          const testHandler = (e: Event) => {
            console.log('🧪 DIRECT DOM CLICK LISTENER FIRED!');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          };
          checkoutButtonRef.current.addEventListener('click', testHandler, true);
          
          // Store cleanup
          testHandlerCleanup = () => {
            checkoutButtonRef.current?.removeEventListener('click', testHandler, true);
          };
        }
      };
      
      // Check immediately and after a short delay
      checkButton();
      timeoutId = setTimeout(checkButton, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (globalClickHandler) {
        document.removeEventListener('click', globalClickHandler, true);
      }
      if (testHandlerCleanup) testHandlerCleanup();
      componentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track cart changes (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 Cart updated:', cartItems.length, 'items');
    }
  }, [cartItems]);

  const handleContinueShopping = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use requestAnimationFrame to ensure state is preserved
    requestAnimationFrame(() => {
      navigate('/');
    });
  };

  const handleWhatsAppCheckout = useCallback((e?: React.MouseEvent<HTMLButtonElement> | MouseEvent) => {
    try {
      console.log('🚀 ========== CHECKOUT HANDLER CALLED ==========');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('📍 Component mounted:', componentMountedRef.current);
      console.log('🎯 Event:', e);
      console.log('🛒 Cart Items Count:', cartItems.length);
      console.log('💰 Total Price:', totalPrice);
      
      // CRITICAL: Prevent all default behavior and stop propagation
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if ('stopImmediatePropagation' in e && typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }
        console.log('✅ Event prevented and stopped');
      } else {
        console.warn('⚠️ No event object provided');
      }
      
      // Check if component is still mounted
      if (!componentMountedRef.current) {
        console.error('❌ Component unmounted, aborting checkout');
        return;
      }
      
      if (cartItems.length === 0) {
        console.error('❌ Cart is empty, cannot checkout');
        alert('Your cart is empty. Please add items before checkout.');
        return;
      }
      
      const phoneNumber = "96176104882";
      console.log('📱 Phone number:', phoneNumber);
      
      try {
        const orderDetails = cartItems.map((item, index) => {
          console.log(`📦 Processing item ${index + 1}:`, item.title);
          const cardNumber = index + 1;
          
          // Start with image URL at the top for visibility
          let itemStr = `*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n*Card ${cardNumber} - Item ${cardNumber}:* ${item.title}`;
          
          // Add image URL prominently at the top
          if (item.image) {
            if (item.image.includes('pollinations.ai') || item.image.startsWith('http')) {
              itemStr += `\n\n📸 *FLOWER IMAGE:*\n${item.image}`;
            } else {
              // For local images, try to construct full URL
              const imageUrl = item.image.startsWith('/') 
                ? `${window.location.origin}${item.image}`
                : item.image;
              itemStr += `\n\n📸 *FLOWER IMAGE:*\n${imageUrl}`;
            }
          }
          
          itemStr += `\n\n*Price:* $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
          
          if (item.description) itemStr += `\n*Details:* ${item.description}`;
          if (item.size) itemStr += `\n*Size:* ${item.size}`;
          if (item.personalNote) itemStr += `\n*Personal Note:* ${item.personalNote}`;
          
          itemStr += `\n*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*`;
          
          return itemStr;
        }).join("\n\n");

        const total = totalPrice;
        const tax = total * 0.08;
        const finalTotal = total + tax;

        // Create FULL detailed message (for clipboard)
        const fullMessage = `🌸 *BEXY FLOWERS - ORDER REQUEST* 🌸\n\nHello! I would like to place an order:\n\n${orderDetails}\n\n*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n*ORDER SUMMARY:*\n*Subtotal:* $${total.toFixed(2)}\n*Tax (8%):* $${tax.toFixed(2)}\n*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n*TOTAL:* $${finalTotal.toFixed(2)}\n\n*Payment Method:* Whish Money / Cash on Delivery\n\nThank you! 💐`;
        
        // Create ULTRA-SHORT message for URL (NO image URLs - they're too long!)
        // WhatsApp has ~2000 char limit for encoded URLs, so we keep it minimal
        const shortOrderDetails = cartItems.map((item, index) => {
          const cardNumber = index + 1;
          let shortStr = `*Card ${cardNumber}:* ${item.title}`;
          shortStr += ` - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
          if (item.size) shortStr += ` (${item.size})`;
          return shortStr;
        }).join('\n');
        
        // Create a concise message that will ALWAYS fit in WhatsApp URL
        const shortMessage = `🌸 *BEXY FLOWERS - ORDER REQUEST* 🌸\n\nHello! I would like to place an order:\n\n${shortOrderDetails}\n\n*Subtotal:* $${total.toFixed(2)}\n*Tax (8%):* $${tax.toFixed(2)}\n*TOTAL:* $${finalTotal.toFixed(2)}\n\n*Payment:* Whish Money / Cash on Delivery\n\nThank you! 💐`;
        
        // Encode and check length
        let encodedMessage = encodeURIComponent(shortMessage);
        let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('✅ Order details generated');
        console.log('📝 Full message length:', fullMessage.length);
        console.log('📝 Short message length:', shortMessage.length);
        console.log('📝 Encoded message length:', encodedMessage.length);
        console.log('🔗 WhatsApp URL length:', whatsappUrl.length);
        console.log('📄 Full message (with images):', fullMessage);
        console.log('📄 Short message (for URL):', shortMessage);
        
        // If still too long (shouldn't happen, but safety check), use minimal
        if (whatsappUrl.length > 2000) {
          console.warn('⚠️ Message still too long, using ultra-minimal version');
          const minimalMessage = `🌸 *BEXY FLOWERS ORDER* 🌸\n\nHello! Order: ${cartItems.length} item(s)\n*Total:* $${finalTotal.toFixed(2)}\n*Payment:* Whish Money / Cash on Delivery\n\n*Full details with images in clipboard*`;
          encodedMessage = encodeURIComponent(minimalMessage);
          whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
          console.log('📄 Minimal message:', minimalMessage);
        }
        
        // Save cart state before opening WhatsApp (defensive)
        try {
          localStorage.setItem('bexy-flowers-cart-backup', JSON.stringify(cartItems));
          console.log('💾 Cart backed up to localStorage');
        } catch (storageError) {
          console.error('❌ Could not backup cart:', storageError);
        }
        
        // ALWAYS copy full message to clipboard FIRST, then open WhatsApp
        navigator.clipboard.writeText(fullMessage).then(() => {
          console.log('✅ Full message copied to clipboard');
          
          // Use setTimeout to ensure all event handlers have finished
          console.log('⏳ Setting timeout to open WhatsApp...');
          setTimeout(() => {
            try {
              console.log('🚪 Attempting to open WhatsApp window...');
              
              // Brief info (don't block with alert - message should appear automatically)
              console.log('💡 Full order details with images are in clipboard as backup');
              
              // Try to open WhatsApp
              const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
              
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.error('❌ Popup blocked');
                alert('Popup was blocked. Please allow popups for this site.\n\nFull order details are in your clipboard.\n\nPhone: +' + phoneNumber);
              } else {
                console.log('✅ WhatsApp opened successfully!');
                console.log('🪟 New window:', newWindow);
              }
            } catch (openError) {
              console.error('❌ Error opening window:', openError);
              alert('Error opening WhatsApp. Full order details are in your clipboard.\n\nPhone: +' + phoneNumber);
            }
          }, 100);
        }).catch((clipboardError) => {
          console.warn('⚠️ Could not copy to clipboard:', clipboardError);
          // Still try to open WhatsApp even if clipboard failed
          console.log('⏳ Opening WhatsApp...');
          setTimeout(() => {
            try {
              const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
              
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.error('❌ Popup blocked');
                alert('Popup was blocked. Please allow popups for this site.\n\nPhone: +' + phoneNumber);
              } else {
                console.log('✅ WhatsApp opened successfully!');
              }
            } catch (openError) {
              console.error('❌ Error opening window:', openError);
              alert('Error opening WhatsApp. Please try again.\n\nPhone: +' + phoneNumber);
            }
          }, 100);
        });
        
      } catch (orderError) {
        console.error('❌ Error generating order details:', orderError);
        alert('Error preparing order. Please try again.');
      }
      
    } catch (error) {
      console.error('❌ FATAL ERROR in checkout handler:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      } else {
        console.error('Error details:', String(error));
      }
      alert('An unexpected error occurred. Please try again or contact support.');
    }
  }, [cartItems, totalPrice]);

  // Track button render and check for form wrappers - AFTER handler is defined
  useEffect(() => {
    if (!isEmpty && checkoutButtonRef.current) {
      console.log('✅ Checkout button rendered');
      const button = checkoutButtonRef.current;
      console.log('Button styles:', window.getComputedStyle(button));
      console.log('Button z-index:', window.getComputedStyle(button).zIndex);
      console.log('Button pointer-events:', window.getComputedStyle(button).pointerEvents);
      
      // Check if button is inside a form
      const form = button.closest('form');
      if (form) {
        console.error('❌ WARNING: Button is inside a FORM element!', form);
        console.error('Form action:', form.action);
        console.error('Form method:', form.method);
      } else {
        console.log('✅ Button is NOT inside a form');
      }
      
      // Check for overlaying elements
      const rect = button.getBoundingClientRect();
      const elementAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (elementAtPoint !== button && !button.contains(elementAtPoint)) {
        console.warn('⚠️ WARNING: Element at button center is not the button itself:', elementAtPoint);
      }
      
      // Add direct event listener as backup
      const handleDirectClick = (e: MouseEvent) => {
        console.log('🎯 DIRECT CLICK LISTENER FIRED (capture phase)');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handleWhatsAppCheckout(e as any);
      };
      
      button.addEventListener('click', handleDirectClick, true); // Use capture phase
      
      return () => {
        button.removeEventListener('click', handleDirectClick, true);
      };
    }
  }, [isEmpty, cartItems.length, handleWhatsAppCheckout]);

  if (isEmpty) {
    return (
      <>
        <UltraNavigation />
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto mb-4" style={{ color: '#2c2d2a' }} />
            </div>
            
            <h2 className="font-luxury text-3xl font-normal mb-4" style={{ color: '#2c2d2a', letterSpacing: '-0.02em' }}>
              Your cart is empty
            </h2>
            
            <p className="mb-8 font-body" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif", letterSpacing: '-0.02em' }}>
              Looks like you haven't added any beautiful arrangements to your cart yet. 
              Start shopping to find the perfect flowers for your special moments.
            </p>
            
            <Button
              type="button"
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-normal px-8 py-3 rounded-full"
              style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '-0.02em' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </motion.div>
        </div>
        <Footer />
        <BackToTop />
      </>
    );
  }

  return (
    <>
      <UltraNavigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-8 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-luxury text-4xl sm:text-5xl font-normal mb-2" style={{ color: '#2c2d2a', letterSpacing: '-0.02em' }}>
              Shopping Cart
            </h1>
            <p className="font-body" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif", letterSpacing: '-0.02em' }}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <Button
            type="button"
            onClick={handleContinueShopping}
            variant="outline"
            className="border-slate-300 hover:bg-slate-50"
            style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>

        {/* TEST BUTTON - to verify buttons work on this page */}
        <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
          <p className="text-sm font-normal mb-2" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>DEBUG: Test if buttons work on this page</p>
          <button
            type="button"
            onClick={() => {
              console.log('✅ TEST BUTTON CLICKED - Buttons work on this page!');
              alert('TEST BUTTON WORKS!');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            TEST BUTTON (Click Me)
          </button>
        </div>

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
                      <h3 className="font-luxury text-lg font-normal mb-1" style={{ color: '#2c2d2a', letterSpacing: '-0.02em' }}>
                        {item.title}
                      </h3>
                      <p className="font-body text-sm" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                        ${item.price} each
                      </p>
                      {item.size && (
                        <div className="mt-2">
                          <span className="inline-block bg-amber-100 text-xs font-normal px-2 py-1 rounded-full" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                            Size: {item.size}
                          </span>
                        </div>
                      )}
                      {item.description && (
                        <div className="mt-2">
                          <p className="text-xs italic max-w-md" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                            "{item.description}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm mb-1" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>Quantity</p>
                        <div className="flex items-center gap-2">
                          <span className="font-luxury text-lg font-normal" style={{ color: '#2c2d2a', letterSpacing: '-0.02em' }}>
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm mb-1" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>Subtotal</p>
                        <p className="font-luxury text-lg font-normal" style={{ color: '#C79E48', letterSpacing: '-0.02em' }}>
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
            <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/30 sticky top-8" style={{ position: 'relative', zIndex: 10 }}>
              <h3 className="font-luxury text-2xl font-normal mb-6" style={{ color: '#2c2d2a', letterSpacing: '-0.02em' }}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                  <span>Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between font-luxury text-xl font-normal" style={{ color: '#2c2d2a', letterSpacing: '-0.02em' }}>
                    <span>Total</span>
                    <span>${(totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3" style={{ position: 'relative', zIndex: 10 }}>
                <Button
                  ref={checkoutButtonRef}
                  type="button"
                  onClick={(e) => {
                    console.log('🎯🎯🎯 REACT onClick HANDLER FIRED! 🎯🎯🎯');
                    alert('REACT onClick WORKS!');
                    e.preventDefault();
                    e.stopPropagation();
                    handleWhatsAppCheckout(e);
                  }}
                  onMouseDown={(e) => {
                    console.log('🖱️ onMouseDown fired');
                    e.preventDefault();
                  }}
                  onMouseUp={(e) => {
                    console.log('🖱️ onMouseUp fired');
                  }}
                  onTouchStart={(e) => {
                    console.log('👆 onTouchStart fired');
                    e.preventDefault();
                  }}
                  onTouchEnd={(e) => {
                    console.log('👆 onTouchEnd fired');
                    e.preventDefault();
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-normal py-6 rounded-full"
                  style={{ 
                    fontFamily: "'EB Garamond', serif",
                    letterSpacing: '-0.02em',
                    position: 'relative', 
                    zIndex: 1000,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  type="button"
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>

              <p className="text-xs text-center mt-4" style={{ color: '#2c2d2a', fontFamily: "'EB Garamond', serif" }}>
                Secure checkout powered by our trusted payment partners
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default CartPage;
