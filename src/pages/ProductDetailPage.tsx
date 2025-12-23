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
import { useFavorites } from '@/contexts/FavoritesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UltraNavigation from '@/components/UltraNavigation';
import BackToTop from '@/components/BackToTop';
import { generatedBouquets } from '@/data/generatedBouquets';
import { getCollectionProduct } from '@/lib/api/collection-products';
import type { Bouquet } from '@/types/bouquet';
import { encodeImageUrl } from '@/lib/imageUtils';

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

// Real categories from UltraCategories component - using correct image paths
// Note: Paths with special characters work fine with Vite - no encoding needed
const allCategories = [
  {
    id: 1,
    name: "WEDDINGS",
    description: "Architectural bridal arrangements",
    image: "/assets/wedding-events/wedding/IMG-20251126-WA0021.webp",
    gradient: "from-rose-200/20 via-amber-100/30 to-yellow-200/20",
    color: "from-rose-400/80 to-amber-300/90",
    filterValue: "wedding-percent-events"
  },
  {
    id: 2,
    name: "VALENTINE'S",
    description: "Romantic luxury collections",
    image: "/assets/valentine/IMG_4172.webp",
    gradient: "from-red-200/20 via-pink-100/30 to-rose-200/20",
    color: "from-red-400/80 to-pink-300/90",
    filterValue: "valentine"
  },
  {
    id: 3,
    name: "MOTHER'S DAY",
    description: "Elegant tribute arrangements",
    image: "/assets/mother day/IMG_8394.webp",
    gradient: "from-pink-200/20 via-rose-100/30 to-lavender-200/20",
    color: "from-pink-400/80 to-rose-300/90",
    filterValue: "mother-day"
  },
  {
    id: 4,
    name: "BIRTHDAYS",
    description: "Celebration masterpieces",
    image: "/assets/birthday/IMG_3730 (1).webp",
    gradient: "from-purple-200/20 via-violet-100/30 to-indigo-200/20",
    color: "from-purple-400/80 to-violet-300/90",
    filterValue: "birthday"
  },
  {
    id: 5,
    name: "ANNIVERSARIES",
    description: "Timeless love expressions",
    image: "/assets/red roses/red roses the letter J.webp",
    gradient: "from-amber-200/20 via-yellow-100/30 to-gold-200/20",
    color: "from-amber-400/80 to-yellow-300/90",
    filterValue: "red-roses"
  },
  {
    id: 6,
    name: "CORPORATE",
    description: "Professional luxury designs",
    image: "/assets/wedding-events/events/IMG-20251126-WA0022.webp",
    gradient: "from-slate-200/20 via-gray-100/30 to-zinc-200/20",
    color: "from-slate-400/80 to-gray-300/90",
    filterValue: "wedding-percent-events"
  },
  {
    id: 8,
    name: "SEASONAL",
    description: "Limited edition collections",
    image: "/assets/hand band/IMG_5392.webp",
    gradient: "from-emerald-200/20 via-green-100/30 to-teal-200/20",
    color: "from-emerald-400/80 to-green-300/90",
    filterValue: "hand-band"
  },
  {
    id: 9,
    name: "GRADUATION",
    description: "Achievement celebrations",
    image: "/assets/graduation/IMG_0295.webp",
    gradient: "from-blue-200/20 via-indigo-100/30 to-purple-200/20",
    color: "from-blue-400/80 to-indigo-300/90",
    filterValue: "graduation"
  },
  {
    id: 10,
    name: "LUXURY GIFTS",
    description: "Premium gift arrangements",
    image: "/assets/red roses/large red roses flower bouquet with gliter.webp",
    gradient: "from-orange-200/20 via-amber-100/30 to-yellow-200/20",
    color: "from-orange-400/80 to-amber-300/90",
    filterValue: "red-roses"
  }
];

// Function to get random 4 categories (with seed for consistency during same product view)
const getRandomCategories = (seed?: string): typeof allCategories => {
  // Use a seeded random if seed is provided to ensure same product shows same categories
  // But different products will get different seeds
  let array = [...allCategories];
  
  if (seed) {
    // Simple seeded shuffle based on seed string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Use hash to create consistent shuffling
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.abs(hash) % (i + 1);
      [array[i], array[j]] = [array[j], array[i]];
      hash = hash >>> 1; // Shift hash for next iteration
    }
  } else {
    // Pure random shuffle
    array.sort(() => Math.random() - 0.5);
  }
  
  return array.slice(0, 4);
};

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
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${isSelected
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
        src={encodeImageUrl(images[currentImageIndex])}
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
            className={`relative overflow-hidden rounded-lg aspect-square w-20 border-2 transition-all duration-300 ${index === currentImageIndex
              ? 'border-amber-400'
              : 'border-amber-200 hover:border-amber-300'
              }`}
            onClick={() => onImageChange(index)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <img
              src={encodeImageUrl(image)}
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
            src={encodeImageUrl(flower.image)}
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
  category: typeof allCategories[0];
  index: number;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate('/collection', { state: { filter: category.filterValue } })}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100/60">
        {/* Background Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={encodeImageUrl(category.image)}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
            <h3 className="font-luxury text-2xl font-bold mb-2">
              {category.name}
            </h3>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              {category.description}
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold">
              Explore Collection
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
    </div>
  );
};

// Main Product Detail Page Component
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCartWithToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMobile = useIsMobile();

  // Get random 4 categories that update when product changes
  const [displayCategories, setDisplayCategories] = useState(() => getRandomCategories());

  // State for product data
  const [productData, setProductData] = useState<ProductData>(() => {
    // Use state if available
    if (location.state?.product) {
      return location.state.product;
    }
    // Fallback to mock data
    return {
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
  });
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

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

  // Smart recommendation logic
  const getRecommendations = (): Bouquet[] => {
    const currentCategory = productData.category;
    const currentId = productData.id;
    const currentPrice = productData.price;

    // Find bouquets from the same or related categories
    let sameCategoryBouquets = generatedBouquets.filter(
      b => b.displayCategory === currentCategory && b.id !== currentId
    );

    // If not enough same category, find similar price range
    if (sameCategoryBouquets.length < 4) {
      const similarPriceBouquets = generatedBouquets.filter(
        b => b.id !== currentId &&
          Math.abs(b.price - currentPrice) <= 50
      );
      sameCategoryBouquets = [...sameCategoryBouquets, ...similarPriceBouquets];
    }

    // If still not enough, add featured bouquets
    if (sameCategoryBouquets.length < 4) {
      const featuredBouquets = generatedBouquets.filter(
        b => b.featured && b.id !== currentId
      );
      sameCategoryBouquets = [...sameCategoryBouquets, ...featuredBouquets];
    }

    // Remove duplicates and take first 4
    const uniqueBouquets = Array.from(
      new Map(sameCategoryBouquets.map(b => [b.id, b])).values()
    );

    return uniqueBouquets.slice(0, 4);
  };

  const recommendedBouquets = getRecommendations();

  // Fetch product from Supabase if no state is passed
  useEffect(() => {
    const fetchProduct = async () => {
      // If we have state, use it
      if (location.state?.product) {
        setProductData(location.state.product);
        return;
      }

      // If we have an ID, try to fetch from Supabase
      if (id) {
        setIsLoadingProduct(true);
        try {
          const product = await getCollectionProduct(id);
          if (product) {
            setProductData({
              id: product.id,
              title: product.title,
              price: product.price,
              description: product.description || '',
              imageUrl: encodeImageUrl(product.image_urls?.[0] || ''),
              images: product.image_urls?.map(url => encodeImageUrl(url)) || [encodeImageUrl(product.image_urls?.[0] || '')],
              category: product.category || product.display_category || 'Premium Bouquets',
              inStock: product.is_active !== false
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          // Keep fallback data
        } finally {
          setIsLoadingProduct(false);
        }
      }
    };

    fetchProduct();
  }, [id, location.state]);

  // Update categories when product changes (different categories for each product)
  useEffect(() => {
    // Get new random categories whenever the product ID changes
    // Use product ID as seed to ensure same product shows same categories (but different from other products)
    const productIdForSeed = id || productData.id || String(Date.now());
    const newCategories = getRandomCategories(productIdForSeed);
    setDisplayCategories(newCategories);
  }, [id, productData.id]);

  // Ensure page always loads from the top and is scrollable on mobile
  useEffect(() => {
    // Reset scroll position on mount and when product changes
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const timeoutId = setTimeout(resetScroll, 100);
    const rafId = requestAnimationFrame(resetScroll);

    // Ensure body is scrollable on mobile
    const restoreScroll = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';

      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.position = '';
    };

    restoreScroll();
    const restoreTimeoutId = setTimeout(restoreScroll, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(restoreTimeoutId);
      cancelAnimationFrame(rafId);
      restoreScroll();
    };
  }, [productData.id]);

  // Handle add to cart - includes quantity
  const handleAddToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);

    // Create cart items for the quantity selected
    const cartItems = Array.from({ length: quantity }, () => ({
      id: productData.id,
      title: productData.title,
      price: currentPrice,
      image: productData.imageUrl,
      size: selectedSizeOption?.name || 'Standard',
      personalNote: personalNote.trim()
    }));

    try {
      // Add all items to cart
      for (const item of cartItems) {
        await addToCart(item);
      }
      
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

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    toggleFavorite({
      id: productData.id,
      title: productData.title,
      name: productData.title,
      price: productData.price,
      image: productData.imageUrl,
      imageUrl: productData.imageUrl,
      description: productData.description,
      category: productData.category || 'Premium Bouquets',
      featured: false
    });
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
      style={{
        // Ensure page is scrollable on mobile
        overflowX: 'hidden',
        position: 'relative',
        minHeight: '100vh',
      }}
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
      <div
        className="max-w-7xl mx-auto px-4 pb-16"
        style={{
          // Ensure content is scrollable on mobile
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16'}`}>

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
                disabled={isLoading || isLoadingProduct}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isLoading || isLoadingProduct ? 'Loading...' : 'Add to Cart'}</span>
              </motion.button>

              {/* Favorite Button */}
              <motion.button
                className={`w-full py-3 border-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isFavorite(productData.id)
                    ? 'bg-pink-50 border-pink-300 text-pink-600'
                    : 'bg-white border-amber-200 text-slate-700 hover:border-amber-300'
                }`}
                onClick={handleToggleFavorite}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Heart className={`w-5 h-5 ${isFavorite(productData.id) ? 'fill-pink-600' : ''}`} />
                <span>{isFavorite(productData.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
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

          <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {recommendedBouquets.map((bouquet, index) => (
              <motion.div
                key={bouquet.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer min-w-[280px] sm:min-w-0 snap-center"
                onClick={() => navigate(`/product/${bouquet.id}`, {
                  state: {
                    product: {
                      id: bouquet.id,
                      title: bouquet.name,
                      price: bouquet.price,
                      description: bouquet.description,
                      imageUrl: bouquet.image,
                      images: [bouquet.image, bouquet.image, bouquet.image],
                      category: bouquet.displayCategory
                    }
                  }
                })}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={bouquet.image}
                      alt={bouquet.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {bouquet.featured && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                      {bouquet.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {bouquet.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                        ${bouquet.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${bouquet.id}`, {
                            state: {
                              product: {
                                id: bouquet.id,
                                title: bouquet.name,
                                price: bouquet.price,
                                description: bouquet.description,
                                imageUrl: bouquet.image,
                                images: [bouquet.image, bouquet.image, bouquet.image],
                                category: bouquet.displayCategory
                              }
                            }
                          });
                        }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
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
            {displayCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>
      <BackToTop />
    </motion.div>
  );
};

export default ProductDetailPage;
