import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft,
  Star,
  Crown,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useCartWithToast } from '@/hooks/useCartWithToast';
import UltraNavigation from '@/components/UltraNavigation';

// Import real images from assets
import bouquet1 from '@/assets/bouquet-1.jpg';
import bouquet2 from '@/assets/bouquet-2.jpg';
import bouquet3 from '@/assets/bouquet-3.jpg';
import bouquet4 from '@/assets/bouquet-4.jpg';
import bouquet5 from '@/assets/bouquet-5.jpg';
import bouquet6 from '@/assets/bouquet-6.jpg';
import aboutImage from '@/assets/about-image.jpg';
import heroBg from '@/assets/hero-bg.jpg';

// Types for product data
interface ProductData {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  images?: string[];
  category?: string;
  inStock?: boolean;
}

interface SizeOption {
  id: string;
  name: string;
  priceModifier: number;
}

// Size options for customization
const sizeOptions: SizeOption[] = [
  { id: 'standard', name: 'Standard', priceModifier: 0 },
  { id: 'deluxe', name: 'Deluxe', priceModifier: 50 },
  { id: 'grand', name: 'Grand', priceModifier: 100 }
];

// Suggested flowers data
const suggestedFlowers = [
  {
    id: 'luxury-roses-collection',
    title: 'Luxury Roses Collection',
    price: 189,
    image: bouquet2,
    category: 'Premium Roses',
    description: 'Exquisite collection of premium roses'
  },
  {
    id: 'exotic-orchids',
    title: 'Exotic Orchids',
    price: 245,
    image: bouquet3,
    category: 'Exotic Flowers',
    description: 'Rare orchids from tropical gardens'
  },
  {
    id: 'spring-tulips',
    title: 'Spring Tulips Symphony',
    price: 165,
    image: bouquet4,
    category: 'Seasonal',
    description: 'Fresh spring tulips in vibrant colors'
  },
  {
    id: 'lavender-dreams',
    title: 'Lavender Dreams',
    price: 199,
    image: bouquet5,
    category: 'Aromatic',
    description: 'Fragrant lavender with elegant arrangement'
  }
];

// Categories data
const categories = [
  {
    id: 'premium-roses',
    title: 'Premium Roses',
    description: 'The finest roses from around the world',
    image: bouquet1,
    count: '24 Arrangements',
    color: 'from-rose-400 to-pink-500'
  },
  {
    id: 'exotic-flowers',
    title: 'Exotic Flowers',
    description: 'Rare and unique flowers from distant lands',
    image: bouquet6,
    count: '18 Arrangements',
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'seasonal',
    title: 'Seasonal Collections',
    description: 'Fresh flowers that celebrate each season',
    image: heroBg,
    count: '32 Arrangements',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'aromatic',
    title: 'Aromatic Gardens',
    description: 'Fragrant blooms that delight the senses',
    image: aboutImage,
    count: '15 Arrangements',
    color: 'from-lavender-400 to-purple-500'
  }
];

// Animation variants for page transitions
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.2
    }
  }
};

const columnVariants = {
  hidden: { 
    opacity: 0, 
    x: (index: number) => index === 0 ? -100 : 100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const imageVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const buttonVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.05, 
    y: -2,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  tap: { scale: 0.95 }
};

// Quantity Selector Component
const QuantitySelector = ({ 
  quantity, 
  onQuantityChange 
}: { 
  quantity: number; 
  onQuantityChange: (qty: number) => void; 
}) => (
  <div className="flex items-center space-x-3">
    <span className="text-sm font-medium text-slate-600">Quantity</span>
    <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden">
      <motion.button
        className="p-2 hover:bg-amber-50 transition-colors"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      <span className="px-4 py-2 text-lg font-semibold min-w-[3rem] text-center">
        {quantity}
      </span>
      <motion.button
        className="p-2 hover:bg-amber-50 transition-colors"
        onClick={() => onQuantityChange(quantity + 1)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  </div>
);

// Size Selector Component
const SizeSelector = ({ 
  selectedSize, 
  onSizeChange, 
  basePrice 
}: { 
  selectedSize: string; 
  onSizeChange: (size: string) => void; 
  basePrice: number;
}) => (
  <div className="space-y-3">
    <span className="text-sm font-medium text-slate-600">Size</span>
    <div className="grid grid-cols-3 gap-2">
      {sizeOptions.map((option) => {
        const isSelected = selectedSize === option.id;
        const totalPrice = basePrice + option.priceModifier;
        
        return (
          <motion.button
            key={option.id}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              isSelected 
                ? 'border-amber-400 bg-amber-50 text-amber-800' 
                : 'border-amber-200 hover:border-amber-300 text-slate-600'
            }`}
            onClick={() => onSizeChange(option.id)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="text-center">
              <div className="font-semibold text-sm">{option.name}</div>
              {option.priceModifier > 0 && (
                <div className="text-xs text-amber-600">+${option.priceModifier}</div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  </div>
);

// Image Gallery Component
const ImageGallery = ({ 
  images, 
  currentImageIndex, 
  onImageChange 
}: { 
  images: string[]; 
  currentImageIndex: number; 
  onImageChange: (index: number) => void; 
}) => (
  <div className="space-y-4">
    {/* Main Image */}
    <motion.div 
      className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/5]"
      variants={imageVariants}
      key={currentImageIndex}
    >
      <img
        src={images[currentImageIndex]}
        alt="Product detail"
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      {/* Image overlay with luxury badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Crown className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-slate-800">Luxury</span>
        </div>
      </div>
    </motion.div>

    {/* Thumbnail Gallery */}
    {images.length > 1 && (
      <div className="flex space-x-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            className={`relative overflow-hidden rounded-lg aspect-square w-20 border-2 transition-all duration-300 ${
              index === currentImageIndex 
                ? 'border-amber-400' 
                : 'border-amber-200 hover:border-amber-300'
            }`}
            onClick={() => onImageChange(index)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <img
              src={image}
              alt={`View ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {index === currentImageIndex && (
              <motion.div
                className="absolute inset-0 bg-amber-400/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    )}
  </div>
);

// Price Display Component with Animation
const PriceDisplay = ({ price }: { price: number }) => (
  <motion.div 
    className="flex items-baseline space-x-2"
    key={price}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.5
    }}
  >
    <span className="text-4xl font-bold text-slate-800">${price}</span>
    <span className="text-lg text-slate-500">USD</span>
  </motion.div>
);

// Suggested Flower Card Component
const SuggestedFlowerCard = ({ 
  flower, 
  index 
}: { 
  flower: typeof suggestedFlowers[0]; 
  index: number; 
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6, 
        ease: "easeOut" 
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => {
        navigate(`/product/${flower.id}`, {
          state: {
            product: {
              id: flower.id,
              title: flower.title,
              price: flower.price,
              description: flower.description,
              imageUrl: flower.image,
              images: [flower.image, flower.image, flower.image],
              category: flower.category
            }
          }
        });
      }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100/60">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={flower.image}
            alt={flower.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 px-3 py-1 rounded-full">
              {flower.category}
            </span>
          </div>
          
          {/* Quick View Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Eye className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
              ${flower.price}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="font-luxury text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
            {flower.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {flower.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Category Card Component
const CategoryCard = ({ 
  category, 
  index 
}: { 
  category: typeof categories[0]; 
  index: number; 
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6, 
        ease: "easeOut" 
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => navigate('/collection')}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100/60">
        {/* Background Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
            <motion.h3 
              className="font-luxury text-2xl font-bold mb-2"
              whileHover={{ scale: 1.05 }}
            >
              {category.title}
            </motion.h3>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              {category.description}
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold">
              {category.count}
            </div>
          </div>
          
          {/* Arrow Icon */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Product Detail Page Component
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCartWithToast();

  // Get product data from route state or create mock data
  const productData: ProductData = location.state?.product || {
    id: id || 'ember-rose-symphony',
    title: 'Ember Rose Symphony',
    price: 125.00,
    description: 'A passionate arrangement of crimson Grand Prix roses and rich burgundy snapdragons, accented with delicate seeded eucalyptus. Each stem is carefully selected to create a dramatic, textural masterpiece that speaks of timeless romance and devotion. Handcrafted by our artisans in Sidon.',
    imageUrl: bouquet1,
    images: [
      bouquet1,
      bouquet2,
      bouquet3
    ],
    category: 'Premium Bouquets',
    inStock: true
  };

  // Local state management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  const [personalNote, setPersonalNote] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate current price based on selected size
  const selectedSizeOption = sizeOptions.find(option => option.id === selectedSize);
  const currentPrice = productData.price + (selectedSizeOption?.priceModifier || 0);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Create cart item
    const cartItem = {
      id: productData.id,
      title: productData.title,
      price: currentPrice,
      image: productData.imageUrl,
      size: selectedSizeOption?.name || 'Standard',
      personalNote: personalNote.trim()
    };

    try {
      await addToCart(cartItem);
      setIsAddedToCart(true);
      
      // Reset after 2.5 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 2500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/collection');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Navigation Bar */}
      <UltraNavigation />

      {/* Success Toast */}
      <AnimatePresence>
        {isAddedToCart && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span className="font-semibold">Added to Cart Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.button
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          onClick={() => navigate(-1)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Collection</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
          
          {/* Left Column - Image Gallery */}
          <motion.div 
            className="space-y-6"
            variants={columnVariants}
            custom={0}
          >
            <ImageGallery
              images={productData.images || [productData.imageUrl]}
              currentImageIndex={currentImageIndex}
              onImageChange={setCurrentImageIndex}
            />
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div 
            className="space-y-8"
            variants={columnVariants}
            custom={1}
          >
            {/* Product Header */}
            <div className="space-y-4">
              {productData.category && (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
                    {productData.category}
                  </span>
                </div>
              )}
              
              <h1 className="font-luxury text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                {productData.title}
              </h1>
              
              <PriceDisplay price={currentPrice} />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">About This Arrangement</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {productData.description}
              </p>
            </div>

            {/* Customization Options */}
            <div className="space-y-6 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-100/60">
              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                basePrice={productData.price}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              {/* Personal Note */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-600">
                  Personal Note (Optional)
                </label>
                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Add a heartfelt message for your recipient..."
                  className="w-full p-4 border border-amber-200 rounded-lg resize-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-slate-500 text-right">
                  {personalNote.length}/200 characters
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <motion.button
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={handleAddToCart}
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
              </motion.button>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-100">
              <div className="flex items-center space-x-2 text-slate-600">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Heart className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Handcrafted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Suggested Flowers Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-white/50 to-amber-50/30"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="font-luxury text-4xl font-bold text-slate-800 mb-4">
              You Might Also Love
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Discover more exquisite arrangements crafted with the same attention to detail and luxury
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {suggestedFlowers.map((flower, index) => (
              <SuggestedFlowerCard 
                key={flower.id} 
                flower={flower} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-amber-50/30 to-white/50"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="font-luxury text-4xl font-bold text-slate-800 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Each category represents our commitment to excellence and the art of floral design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default ProductDetailPage;
