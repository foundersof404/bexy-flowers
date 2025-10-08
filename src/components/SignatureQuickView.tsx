import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, ZoomIn, ChevronLeft, ChevronRight, Gift, Sparkles, Box, MessageSquare, Shield, Check, Crown, Flower2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartWithToast } from '@/hooks/useCartWithToast';
import { Link } from 'react-router-dom';

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
    
    // Lock body scroll and preserve position while modal is open
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalLeft = document.body.style.left;
    const originalWidth = document.body.style.width;
    const originalHeight = document.body.style.height;

    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    document.addEventListener('keydown', onKey);
    
    return () => {
      document.removeEventListener('keydown', onKey);

      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.left = originalLeft;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;

      // Restore scroll position
      window.scrollTo(0, scrollY);
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
    reviewsCount: 127,
    isSignature: true
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
          className="fixed inset-0 z-[100] flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            overscrollBehavior: 'contain'
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

          {/* Enhanced Signature Modal */}
          <motion.div
            ref={dialogRef}
            className="relative z-[101] w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 60, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 26, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20, mass: 0.9 }}
            style={{ 
              position: 'relative',
              zIndex: 1001,
              maxHeight: '80vh',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y'
            }}
          >
            {/* Elegant Header */}
            <div className="relative bg-gradient-to-r from-white via-rose-50/40 to-white px-8 py-6 border-b border-rose-100 flex-shrink-0">
              {/* Enhanced background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-300/30 via-amber-200/20 to-rose-300/30"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Enhanced Signature indicator */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-rose-50 rounded-full border border-amber-200/50">
                    <div className="relative">
                      <Crown className="w-5 h-5 text-amber-600 drop-shadow-sm" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-amber-700 font-bold text-sm tracking-wider uppercase" style={{ 
                      fontFamily: 'Inter, ui-sans-serif, system-ui',
                      letterSpacing: '0.1em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      Signature Collection
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-4xl font-bold text-slate-800 mb-3 leading-tight" style={{ 
                      fontFamily: '"Playfair Display", "Times New Roman", serif',
                      textShadow: '0 3px 6px rgba(0,0,0,0.1)',
                      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: '800',
                      letterSpacing: '-0.03em'
                    }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                        ))}
                        <span className="text-slate-600 text-sm ml-2 font-semibold" style={{ 
                          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                          fontWeight: '600'
                        }}>
                          {productInfo.rating} ({productInfo.reviewsCount} reviews)
                        </span>
                      </div>
                      {productInfo.isBestseller && (
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-amber-500/25">
                          Bestseller
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Close Button */}
                <motion.button
                onClick={onClose}
                  className="group relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg border border-slate-200/50"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/10 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </div>
            </div>

            {/* Content with Responsive Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Enhanced Image Gallery */}
              <motion.div 
                className="relative w-full lg:w-1/2 bg-gradient-to-br from-slate-50 to-white flex-shrink-0 overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
                style={{ height: '100%' }}
              >
                {/* Main Image Container with Enhanced Display */}
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  <div className="relative w-full h-full max-w-lg rounded-xl overflow-hidden shadow-2xl group">
                  <img 
                    src={galleryImages[currentImageIndex]} 
                      alt={`${item.name} - Image ${currentImageIndex + 1}`}
                      className={`w-full h-full object-cover transition-all duration-700 cursor-zoom-in ${
                      isZoomed ? 'scale-150' : 'group-hover:scale-110'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                      loading="eager"
                      style={{
                        imageRendering: 'crisp-edges',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Enhanced overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Enhanced Zoom indicator */}
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/20">
                      <ZoomIn className="w-5 h-5 text-slate-700" />
                  </div>
                  
                    {/* Enhanced Gallery Navigation */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between">
                    <motion.button
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl hover:bg-white transition-all duration-300 border border-white/20"
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                        whileHover={{ scale: 1.1, x: -3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </motion.button>
                    <motion.button
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl hover:bg-white transition-all duration-300 border border-white/20"
                      onClick={() => setCurrentImageIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                        whileHover={{ scale: 1.1, x: 3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight className="w-6 h-6 text-slate-700" />
                    </motion.button>
                  </div>
                  
                    {/* Enhanced Gallery Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                          index === currentImageIndex 
                              ? 'bg-white scale-125 shadow-xl' 
                              : 'bg-white/60 hover:bg-white/80'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                    </div>
                    
                    {/* Image counter */}
                    <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {galleryImages.length}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Price Display */}
                <div className="absolute bottom-6 left-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl px-6 py-4 shadow-2xl border border-amber-400/30">
                  <p className="text-3xl font-bold" style={{ 
                    fontFamily: 'Playfair Display, serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ${numericPrice.toFixed(2)}
                  </p>
                  <p className="text-amber-100 text-sm font-medium">Starting from</p>
                </div>

                {/* Enhanced Heart Button */}
                <motion.button
                  className="absolute bottom-6 right-6 w-14 h-14 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl hover:bg-red-50 transition-all duration-300 border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-6 h-6 text-slate-600 hover:text-red-500 transition-colors duration-300" />
                </motion.button>
              </motion.div>

              {/* Enhanced Content Section */}
              <motion.div 
                className="w-full lg:w-1/2 flex flex-col overflow-hidden bg-gradient-to-b from-white to-rose-50/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
                style={{ height: '100%' }}
              >
                <div 
                  className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-10 custom-scrollbar"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                    touchAction: 'pan-y',
                    scrollBehavior: 'smooth',
                    minHeight: '0',
                    height: '100%',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(245, 158, 11, 0.4) transparent'
                  }}
                >
                {/* Elegant Size Selection */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <motion.div 
                      className="relative p-2 bg-gradient-to-br from-amber-100 to-rose-100 rounded-xl border border-amber-200/50"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flower2 className="w-5 h-5 text-amber-600 drop-shadow-sm" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </motion.div>
                    <motion.h4 
                      className="text-2xl font-bold text-slate-800 leading-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      style={{ 
                        fontFamily: '"Playfair Display", "Times New Roman", serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '700',
                        letterSpacing: '-0.02em'
                      }}
                    >
                    Choose Your Size
                    </motion.h4>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-3">
                    {sizeOptions.map((option, i) => {
                      const isSelected = selectedSize === option.value;
                      const optionPrice = numericPrice + option.price;
                      
                      return (
                        <motion.button
                          key={option.value}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                            isSelected 
                              ? 'border-amber-400 bg-amber-50 shadow-md' 
                              : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-25'
                          }`}
                          onClick={() => setSelectedSize(option.value)}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35, delay: i * 0.04 }}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          <div className="pr-8">
                          <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-slate-800 text-base" style={{ 
                                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                                textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                fontWeight: '600',
                                letterSpacing: '-0.01em'
                              }}>
                                {option.label}
                              </h5>
                              <span className="text-amber-600 font-bold text-xs" style={{ 
                                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                                textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                fontWeight: '700'
                              }}>
                                +${option.price}
                              </span>
                          </div>
                            <p className="text-slate-600 text-xs mb-3 leading-relaxed" style={{ 
                              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                              textShadow: '0 1px 2px rgba(0,0,0,0.04)',
                              lineHeight: '1.6',
                              fontWeight: '400'
                            }}>
                              {option.description}
                            </p>
                            <p className="text-lg font-bold text-slate-800" style={{ 
                              fontFamily: '"Playfair Display", "Times New Roman", serif',
                              textShadow: '0 2px 4px rgba(0,0,0,0.06)',
                              fontWeight: '700',
                              letterSpacing: '-0.02em'
                            }}>
                              ${optionPrice.toFixed(2)}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                </div>
                </motion.section>

                {/* Elegant Personal Message */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <motion.div 
                      className="relative p-2 bg-gradient-to-br from-amber-100 to-rose-100 rounded-xl border border-amber-200/50"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageSquare className="w-5 h-5 text-amber-600 drop-shadow-sm" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </motion.div>
                    <motion.h4 
                      className="text-2xl font-bold text-slate-800 leading-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 }}
                      style={{ 
                        fontFamily: '"Playfair Display", "Times New Roman", serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '700',
                        letterSpacing: '-0.02em'
                      }}
                    >
                    Personal Message
                    </motion.h4>
                  </motion.div>
                  <div className="relative">
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Share your heartfelt message... (optional)"
                      className="w-full p-5 border-2 border-slate-200 rounded-2xl resize-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                      rows={4}
                      maxLength={200}
                      style={{
                        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        fontWeight: '400',
                        textShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}
                    />
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-100 to-rose-100 text-slate-600 px-3 py-1.5 rounded-full shadow-sm border border-amber-200/50">
                      <p className="text-xs font-semibold" style={{
                        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        textShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}>
                        {customDescription.length}/200
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Elegant Accessories */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    <motion.div 
                      className="relative p-2 bg-gradient-to-br from-amber-100 to-rose-100 rounded-xl border border-amber-200/50"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles className="w-5 h-5 text-amber-600 drop-shadow-sm" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </motion.div>
                    <motion.h4 
                      className="text-2xl font-bold text-slate-800 leading-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      style={{ 
                        fontFamily: '"Playfair Display", "Times New Roman", serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '700',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Add Elegant Touches
                    </motion.h4>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-3">
                    {accessories.map((accessory, i) => {
                      const Icon = accessory.icon;
                      const isSelected = selectedAccessories.includes(accessory.id);
                      
                      return (
                        <motion.button
                          key={accessory.id}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 text-left relative ${
                            isSelected 
                              ? 'border-amber-400 bg-amber-50 shadow-md' 
                              : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-25'
                          }`}
                          onClick={() => {
                            setSelectedAccessories(prev => 
                              prev.includes(accessory.id)
                                ? prev.filter(id => id !== accessory.id)
                                : [...prev, accessory.id]
                            );
                          }}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35, delay: i * 0.04 }}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 pr-8">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shadow-sm ${
                              isSelected ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-amber-100 to-rose-100'
                            }`}>
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-white drop-shadow-sm' : 'text-amber-600 drop-shadow-sm'}`} />
                    </div>
                    <div>
                              <h5 className="font-bold text-slate-800 text-base" style={{ 
                                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                                textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                fontWeight: '600',
                                letterSpacing: '-0.01em'
                              }}>
                                {accessory.name}
                              </h5>
                              <p className="text-amber-600 font-bold text-base" style={{ 
                                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                                textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                fontWeight: '700'
                              }}>
                                +${accessory.price}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.section>

                {/* Gift Option */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <motion.div 
                      className="relative p-2 bg-gradient-to-br from-amber-100 to-rose-100 rounded-xl border border-amber-200/50"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Gift className="w-5 h-5 text-amber-600 drop-shadow-sm" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </motion.div>
                    <motion.h4 
                      className="text-2xl font-bold text-slate-800 leading-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.65 }}
                      style={{ 
                        fontFamily: '"Playfair Display", "Times New Roman", serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '700',
                        letterSpacing: '-0.02em'
                      }}
                    >
                    Gift Options
                    </motion.h4>
                  </motion.div>
                    <motion.button
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isGift 
                          ? 'border-amber-400 bg-amber-50 shadow-md' 
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-25'
                      }`}
                      onClick={() => setIsGift(!isGift)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gradient-to-br from-amber-100 to-rose-100 rounded-lg">
                        <Gift className="w-4 h-4 text-amber-600 drop-shadow-sm" />
                      </div>
                      <span className="font-bold text-slate-800 text-lg" style={{ 
                        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                        fontWeight: '600',
                        letterSpacing: '-0.01em'
                      }}>
                        Send as a gift
                      </span>
                      {isGift && <Check className="w-5 h-5 text-amber-600 ml-auto drop-shadow-sm" />}
                    </div>
                  </motion.button>
                  
                  {isGift && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="mt-4 space-y-4 p-4 bg-amber-50 rounded-xl"
                    >
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3" style={{ 
                          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                          fontWeight: '600',
                          letterSpacing: '-0.01em'
                        }}>
                            Recipient Name
                          </label>
                          <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Enter recipient's name"
                          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                          style={{ 
                            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                            textShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            fontSize: '16px',
                            lineHeight: '1.5'
                          }}
                          />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3" style={{ 
                          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                          fontWeight: '600',
                          letterSpacing: '-0.01em'
                        }}>
                            Delivery Date
                          </label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                          style={{ 
                            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                            textShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            fontSize: '16px',
                            lineHeight: '1.5'
                          }}
                          />
                        </div>
                    </motion.div>
                  )}
                </motion.section>

                {/* Elegant Add to Cart Section */}
                <motion.div 
                  className="pt-6 border-t border-slate-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <motion.button
                    className={`w-full py-5 px-8 rounded-2xl font-bold text-white text-xl transition-all duration-300 ${
                      isAddingToCart
                        ? 'bg-green-500'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                    } shadow-xl hover:shadow-2xl relative overflow-hidden group`}
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isAddingToCart}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      fontWeight: '700',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding to Cart...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <ShoppingCart className="w-5 h-5" />
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
                      className="text-center text-amber-600 mt-3 font-medium text-sm"
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
                      className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl border border-amber-200/50 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-1.5 bg-gradient-to-br from-amber-200 to-rose-200 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-amber-700 drop-shadow-sm" />
                        </div>
                        <span className="text-sm font-bold text-amber-800" style={{ 
                          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          textShadow: '0 1px 2px rgba(0,0,0,0.06)',
                          fontWeight: '700'
                        }}>
                          Message Preview
                        </span>
                      </div>
                      <p className="text-amber-700 text-base italic leading-relaxed" style={{ 
                        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        textShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        lineHeight: '1.7',
                        fontWeight: '400'
                      }}>
                        "{customDescription}"
                      </p>
                    </motion.div>
                  )}

                  {/* Full details link */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/product/${String(item.id)}`}
                      state={{
                        product: {
                          id: String(item.id),
                          title: item.name,
                          price: numericPrice,
                          description: item.description,
                          imageUrl: item.image,
                          images: galleryImages,
                          category: 'Signature Collection',
                          inStock: true
                        }
                      }}
                      className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 underline underline-offset-4"
                    >
                      View full details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
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


