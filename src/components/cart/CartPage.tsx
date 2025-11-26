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
    console.log('🟢 CartPage MOUNTED');
    console.log('📍 Location:', location.pathname);
    console.log('🛒 Cart Items:', cartItems.length);
    componentMountedRef.current = true;

    // GLOBAL CLICK LISTENER - to catch ALL clicks
    const globalClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.textContent?.includes('Proceed to Checkout') || target.closest('button')?.textContent?.includes('Proceed to Checkout'))) {
        console.log('🌍 GLOBAL CLICK DETECTED on checkout button!');
        console.log('Target:', target);
        console.log('Event:', e);
      }
    };
    
    document.addEventListener('click', globalClickHandler, true);

    // Check if button exists and add test listener
    let testHandlerCleanup: (() => void) | null = null;
    
    const checkButton = () => {
      if (checkoutButtonRef.current) {
        console.log('✅ Checkout button found in DOM');
        console.log('Button element:', checkoutButtonRef.current);
        console.log('Button parent:', checkoutButtonRef.current.parentElement);
        console.log('Button form:', checkoutButtonRef.current.form);
        
        // Add a test click listener directly to the DOM element
        const testHandler = (e: Event) => {
          console.log('🧪 DIRECT DOM CLICK LISTENER FIRED!');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          alert('DIRECT DOM LISTENER WORKS! Button is clickable!');
        };
        checkoutButtonRef.current.addEventListener('click', testHandler, true);
        
        // Store cleanup
        testHandlerCleanup = () => {
          checkoutButtonRef.current?.removeEventListener('click', testHandler, true);
        };
      } else {
        console.warn('⚠️ Checkout button NOT found in DOM yet');
      }
    };
    
    // Check immediately and after a short delay
    checkButton();
    const timeoutId = setTimeout(checkButton, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', globalClickHandler, true);
      if (testHandlerCleanup) testHandlerCleanup();
      console.log('🔴 CartPage UNMOUNTING');
      componentMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track cart changes
  useEffect(() => {
    console.log('🛒 Cart updated:', cartItems.length, 'items');
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
          
          // Start with image URL at the top for visibility
          let itemStr = `*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n*Item ${index + 1}:* ${item.title}`;
          
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

        const finalMessage = `🌸 *BEXY FLOWERS - ORDER REQUEST* 🌸\n\nHello! I would like to place an order:\n\n${orderDetails}\n\n*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n*ORDER SUMMARY:*\n*Subtotal:* $${total.toFixed(2)}\n*Tax (8%):* $${tax.toFixed(2)}\n*━━━━━━━━━━━━━━━━━━━━━━━━━━━━*\n*TOTAL:* $${finalTotal.toFixed(2)}\n\n*Payment Method:* Whish Money / Cash on Delivery\n\nThank you! 💐`;
        
        // Check message length (WhatsApp has practical limits)
        const encodedMessage = encodeURIComponent(finalMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('✅ Order details generated');
        console.log('📝 Message length:', finalMessage.length);
        console.log('📝 Encoded message length:', encodedMessage.length);
        console.log('🔗 WhatsApp URL length:', whatsappUrl.length);
        console.log('📄 Full message:', finalMessage);
        console.log('🔗 Full WhatsApp URL:', whatsappUrl);
        
        // Warn if URL is very long (WhatsApp Web has practical limits)
        if (whatsappUrl.length > 4000) {
          console.warn('⚠️ WhatsApp URL is very long, may not work properly');
          // Optionally truncate or split message
        }
        
        // Save cart state before opening WhatsApp (defensive)
        try {
          localStorage.setItem('bexy-flowers-cart-backup', JSON.stringify(cartItems));
          console.log('💾 Cart backed up to localStorage');
        } catch (storageError) {
          console.error('❌ Could not backup cart:', storageError);
        }
        
        // Use setTimeout to ensure all event handlers have finished
        console.log('⏳ Setting timeout to open WhatsApp...');
        setTimeout(() => {
          try {
            console.log('🚪 Attempting to open WhatsApp window...');
            
            // Try to open WhatsApp
            const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              console.error('❌ Popup blocked');
              
              // Try to copy message to clipboard as fallback
              try {
                navigator.clipboard.writeText(finalMessage).then(() => {
                  alert('Popup was blocked. The order message has been copied to your clipboard!\n\nPlease open WhatsApp manually and paste the message.\n\nPhone: +' + phoneNumber);
                }).catch(() => {
                  alert('Popup was blocked. Please allow popups for this site, or manually open WhatsApp and send this message:\n\n' + finalMessage + '\n\nPhone: +' + phoneNumber);
                });
              } catch (clipboardError) {
                alert('Popup was blocked. Please allow popups for this site, or manually open WhatsApp and send this message:\n\n' + finalMessage + '\n\nPhone: +' + phoneNumber);
              }
            } else {
              console.log('✅ WhatsApp opened successfully!');
              console.log('🪟 New window:', newWindow);
              
              // Verify the message was pre-filled by checking if window loaded
              setTimeout(() => {
                try {
                  // Check if window is still open and accessible
                  if (newWindow && !newWindow.closed) {
                    console.log('✅ WhatsApp window is open and accessible');
                  }
                } catch (e) {
                  console.warn('⚠️ Cannot verify WhatsApp window (cross-origin restriction)');
                }
              }, 1000);
            }
          } catch (openError) {
            console.error('❌ Error opening window:', openError);
            
            // Fallback: copy to clipboard
            try {
              navigator.clipboard.writeText(finalMessage).then(() => {
                alert('Error opening WhatsApp. The order message has been copied to your clipboard!\n\nPlease open WhatsApp manually and paste the message.\n\nPhone: +' + phoneNumber);
              }).catch(() => {
                alert('Error opening WhatsApp. Please manually open WhatsApp and send this message:\n\n' + finalMessage + '\n\nPhone: +' + phoneNumber);
              });
            } catch (clipboardError) {
              alert('Error opening WhatsApp. Please manually open WhatsApp and send this message:\n\n' + finalMessage + '\n\nPhone: +' + phoneNumber);
            }
          }
        }, 100);
        
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
              type="button"
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-full"
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
            <h1 className="font-luxury text-4xl sm:text-5xl font-bold text-slate-800 mb-2">
              Shopping Cart
            </h1>
            <p className="text-slate-600 font-body">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <Button
            type="button"
            onClick={handleContinueShopping}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>

        {/* TEST BUTTON - to verify buttons work on this page */}
        <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
          <p className="text-sm font-bold mb-2">DEBUG: Test if buttons work on this page</p>
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
            <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/30 sticky top-8" style={{ position: 'relative', zIndex: 10 }}>
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
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold py-6 rounded-full"
                  style={{ 
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

              <p className="text-xs text-slate-500 text-center mt-4">
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
