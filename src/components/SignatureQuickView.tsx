import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, ZoomIn, ChevronLeft, ChevronRight, Gift, Sparkles, Box, MessageSquare, Clock, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartWithToast } from '@/hooks/useCartWithToast';

interface QuickItem {
  id: number;
  name: string;
  price: number | string;
  image: string;
  description: string;
}

interface SignatureQuickViewProps {
  open: boolean;
  item?: QuickItem | null;
  onClose: () => void;
}

const SignatureQuickView = ({ open, item, onClose }: SignatureQuickViewProps) => {
  const { addToCart } = useCartWithToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [showMessagePreview, setShowMessagePreview] = useState(false);

  // Handle touch events for mobile scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    // Allow touch events to work normally for scrolling
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Allow touch events to work normally for scrolling
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Simple body scroll prevention
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', onKey);
    
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedSize('');
      setCustomDescription('');
      setIsAddingToCart(false);
      setCurrentImageIndex(0);
      setIsZoomed(false);
      setIsGift(false);
      setRecipientName('');
      setDeliveryDate('');
      setSelectedAccessories([]);
      setShowMessagePreview(false);
    }
  }, [open]);

  if (!item) return null;

  const numericPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$','')) : item.price;

  const sizeOptions = [
    { value: 'small', label: 'Small', price: 0, description: 'Perfect for intimate moments' },
    { value: 'medium', label: 'Medium', price: 50, description: 'Ideal for special occasions' },
    { value: 'large', label: 'Large', price: 100, description: 'Makes a grand statement' },
    { value: 'premium', label: 'Premium', price: 200, description: 'Ultimate luxury experience' }
  ];

  // Mock data for gallery images
  const galleryImages = [
    item.image,
    item.image, // Different angle
    item.image, // Close-up
    item.image, // With accessories
    item.image  // Lifestyle context
  ];

  // Accessories data
  const accessories = [
    { id: 'gift-box', name: 'Gift Box', price: 20, icon: Box },
    { id: 'glitter', name: 'Glitter', price: 15, icon: Sparkles },
    { id: 'chocolate', name: 'Chocolate', price: 25, icon: Gift },
    { id: 'ribbon', name: 'Premium Ribbon', price: 10, icon: MessageSquare }
  ];

  // Mock reviews
  const review = { name: 'Sarah M.', rating: 5, comment: 'Absolutely stunning! Perfect for my anniversary.' };

  // Premium product data
  const productInfo = {
    isBestseller: true,
    isPremium: true,
    rating: 4.9,
    reviewsCount: 127
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    
    const selectedSizeOption = sizeOptions.find(option => option.value === selectedSize);
    const accessoriesTotal = selectedAccessories.reduce((total, accessoryId) => {
      const accessory = accessories.find(acc => acc.id === accessoryId);
      return total + (accessory?.price || 0);
    }, 0);
    
    const finalPrice = numericPrice + (selectedSizeOption?.price || 0) + accessoriesTotal;
    const finalDescription = customDescription.trim() || `${item.description} - ${selectedSizeOption?.label} Size`;
    
    const giftInfo = isGift ? {
      recipient: recipientName,
      deliveryDate: deliveryDate,
      message: customDescription
    } : null;

    addToCart({
      id: item.id,
      title: item.name,
      price: finalPrice,
      image: item.image,
      size: selectedSizeOption?.label,
      description: finalDescription,
      accessories: selectedAccessories,
      giftInfo: giftInfo
    });

    // Show success animation
    setTimeout(() => {
      setIsAddingToCart(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-center pt-16 sm:pt-20 pb-4 sm:pb-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000
          }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modern Popup Modal */}
          <motion.div
            ref={dialogRef}
            className="relative z-[101] w-full max-w-5xl h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col touch-none"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ 
              position: 'relative',
              zIndex: 1001,
              maxHeight: 'calc(100vh - 6rem)',
              margin: 'auto'
            }}
          >
            {/* Premium Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-8">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Premium indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-1 h-1 bg-amber-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  <div>
                    <h3 className="font-luxury text-4xl text-white mb-2">{item.name}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-amber-300 text-sm ml-2">{productInfo.rating} ({productInfo.reviewsCount})</span>
                      </div>
                      {productInfo.isBestseller && (
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Bestseller
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Elegant Close Button */}
                <motion.button
                onClick={onClose}
                  className="group relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-white group-hover:text-amber-300 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </div>
            </div>

            {/* Content with Responsive Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Premium Image Gallery */}
              <motion.div 
                className="relative w-full lg:w-1/2 h-80 lg:h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
              >
                {/* Main Image with Premium Effects */}
                <div className="relative w-full h-full overflow-hidden group">
                  <img 
                    src={galleryImages[currentImageIndex]} 
                    alt={item.name} 
                    className={`w-full h-full object-cover transition-all duration-500 cursor-zoom-in ${
                      isZoomed ? 'scale-150' : 'group-hover:scale-110'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  
                  {/* Premium overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Zoom indicator with premium styling */}
                  <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-2xl">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Elegant Gallery Navigation */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between">
                    <motion.button
                      className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300"
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </motion.button>
                    <motion.button
                      className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300"
                      onClick={() => setCurrentImageIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                  
                  {/* Premium Gallery Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                          index === currentImageIndex 
                            ? 'bg-white border-white scale-125' 
                            : 'bg-white/30 border-white/50 hover:bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Premium Price Display */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500/90 to-amber-600/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border border-amber-400/30">
                  <p className="text-white font-luxury text-3xl">${numericPrice.toFixed(2)}</p>
                  <p className="text-amber-100 text-sm">Starting price</p>
                </div>

                {/* Premium Heart Button */}
                <motion.button
                  className="absolute bottom-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-red-500/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-7 h-7 text-white hover:text-red-400 transition-colors duration-300" />
                </motion.button>
              </motion.div>

              {/* Right: Scrollable Content */}
              <motion.div 
                className="w-full lg:w-1/2 flex flex-col overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
              >
                <div 
                  className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                    touchAction: 'pan-y',
                    scrollBehavior: 'smooth',
                    minHeight: '0',
                    height: '100%'
                  }}
                >
                {/* Premium Size Selection */}
                <section>
                  <h4 className="font-luxury text-3xl text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-3 h-10 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg"></div>
                    Choose Your Size
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sizeOptions.map((option) => {
                      const isSelected = selectedSize === option.value;
                      const optionPrice = numericPrice + option.price;
                      
                      return (
                        <motion.button
                          key={option.value}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                            isSelected 
                              ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg shadow-amber-300/30' 
                              : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-gradient-to-br hover:from-amber-25 hover:to-amber-50 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedSize(option.value)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-slate-900 text-sm">{option.label}</h5>
                            <span className="text-amber-600 font-bold text-sm">+${option.price}</span>
                          </div>
                          <p className="text-slate-600 mb-2 leading-tight text-xs">{option.description}</p>
                <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-slate-900">${optionPrice.toFixed(2)}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                </div>
                </section>

                {/* Premium Personal Message */}
                <section>
                  <h4 className="font-luxury text-3xl text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-3 h-10 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg"></div>
                    Personal Message
                  </h4>
                  <div className="relative group">
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Share your heartfelt message... (optional)"
                      className="w-full p-8 border-2 border-slate-200 rounded-3xl resize-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all duration-500 text-slate-700 placeholder-slate-400 text-lg leading-relaxed bg-gradient-to-br from-slate-50 to-white shadow-lg hover:shadow-xl"
                      rows={4}
                      maxLength={200}
                    />
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white px-3 py-1 rounded-full shadow-lg">
                      <p className="text-sm font-medium">
                        {customDescription.length}/200
                      </p>
                    </div>
                  </div>
                </section>

                {/* Product Details */}
                <section>
                  <h4 className="font-luxury text-2xl text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full"></div>
                    What's Included
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Premium flowers</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Elegant wrapping</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Care instructions</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">Message card</span>
                    </div>
                  </div>
                </section>

                {/* Customer Review */}
                <section>
                  <h4 className="font-luxury text-2xl text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full"></div>
                    Customer Review
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-semibold text-slate-900">{review.name}</span>
                    </div>
                    <p className="text-slate-600 text-sm">"{review.comment}"</p>
                  </div>
                </section>

                {/* Premium Accessories */}
                <section>
                  <h4 className="font-luxury text-3xl text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-3 h-10 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg"></div>
                    Add Premium Accessories
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    {accessories.map((accessory) => {
                      const Icon = accessory.icon;
                      const isSelected = selectedAccessories.includes(accessory.id);
                      
                      return (
                        <motion.button
                          key={accessory.id}
                          className={`p-6 rounded-3xl border-2 transition-all duration-500 text-left group relative overflow-hidden ${
                            isSelected 
                              ? 'border-amber-400 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 shadow-2xl shadow-amber-300/30 scale-105' 
                              : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-gradient-to-br hover:from-amber-25 hover:to-amber-50 hover:shadow-xl'
                          }`}
                          onClick={() => {
                            setSelectedAccessories(prev => 
                              prev.includes(accessory.id)
                                ? prev.filter(id => id !== accessory.id)
                                : [...prev, accessory.id]
                            );
                          }}
                          whileHover={{ scale: 1.03, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {/* Premium selection indicator */}
                          {isSelected && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              isSelected ? 'bg-amber-500' : 'bg-amber-100'
                            }`}>
                              <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                    </div>
                    <div>
                              <h5 className="font-bold text-slate-900 text-lg">{accessory.name}</h5>
                              <p className="text-amber-600 font-bold text-xl">+${accessory.price}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </section>

                {/* Gift Options */}
                <section>
                  <h4 className="font-luxury text-2xl text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full"></div>
                    Gift Options
                  </h4>
                  <div className="space-y-4">
                    <motion.button
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isGift 
                          ? 'border-amber-400 bg-amber-50 shadow-md' 
                          : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-25'
                      }`}
                      onClick={() => setIsGift(!isGift)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-amber-600" />
                        <span className="font-semibold text-slate-900">Send as a gift 🎁</span>
                        {isGift && <Check className="w-5 h-5 text-amber-600 ml-auto" />}
                    </div>
                    </motion.button>
                    
                    {isGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-4 bg-amber-50 rounded-xl"
                      >
                    <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Recipient Name
                          </label>
                          <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Enter recipient's name"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          />
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Delivery Date
                          </label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </section>

                {/* Care Tips & Guarantee */}
                <section>
                  <h4 className="font-luxury text-2xl text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full"></div>
                    Care & Guarantee
                  </h4>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Freshness Guaranteed</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Freshness guaranteed for 7 days 🌱. If you're not completely satisfied, we'll replace it free of charge.
                    </p>
                  </div>
                </section>

                {/* Fixed Add to Cart Button */}
                <div className="pt-6 border-t border-slate-200">
                  <motion.button
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 ${
                      isAddingToCart
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                    } shadow-xl hover:shadow-2xl relative overflow-hidden group`}
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isAddingToCart}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding to Cart...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <ShoppingCart className="w-6 h-6" />
                        <span>
                          Add to Cart - ${(() => {
                            const selectedSizeOption = sizeOptions.find(opt => opt.value === selectedSize);
                            const accessoriesTotal = selectedAccessories.reduce((total, accessoryId) => {
                              const accessory = accessories.find(acc => acc.id === accessoryId);
                              return total + (accessory?.price || 0);
                            }, 0);
                            const finalPrice = numericPrice + (selectedSizeOption?.price || 0) + accessoriesTotal;
                            return finalPrice.toFixed(2);
                          })()}
                        </span>
                      </div>
                    )}
                  </motion.button>
                  
                  {!selectedSize && (
                    <motion.p 
                      className="text-center text-amber-600 mt-4 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Please select a size to continue
                    </motion.p>
                  )}
                  
                  {/* Message Preview */}
                  {customDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">Message Preview</span>
                      </div>
                      <p className="text-amber-700 text-sm italic">"{customDescription}"</p>
                    </motion.div>
                  )}
                </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignatureQuickView;


