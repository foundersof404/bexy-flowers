import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { useCartWithToast } from '@/hooks/useCartWithToast';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UltraNavigation from '@/components/UltraNavigation';
import BackToTop from '@/components/BackToTop';
import { useCollectionProduct, useCollectionProducts } from '@/hooks/useCollectionProducts';
import { useQueryClient } from '@tanstack/react-query';
import { collectionQueryKeys } from '@/hooks/useCollectionProducts';
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
  { id: 'premium', name: 'Premium', priceModifier: 100 }
];




// Quantity Selector Component
const QuantitySelector = ({
  quantity,
  onQuantityChange
}: {
  quantity: number;
  onQuantityChange: (qty: number) => void;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-gray-700">Quantity</span>
    <div className="flex items-center border border-gray-300 rounded-md">
      <button
        className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="px-4 py-2 text-base font-medium min-w-[3rem] text-center">
        {quantity}
      </span>
      <button
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={() => onQuantityChange(quantity + 1)}
      >
        <Plus className="w-4 h-4" />
      </button>
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
    <span className="text-sm font-medium text-gray-700">Size</span>
    <div className="grid grid-cols-3 gap-3">
      {sizeOptions.map((option) => {
        const isSelected = selectedSize === option.id;

        return (
          <button
            key={option.id}
            className={`p-3 rounded-md border-2 transition-all ${
              isSelected
                ? 'border-[#C79E48] bg-[#C79E48]/5 text-[#C79E48]'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
            onClick={() => onSizeChange(option.id)}
          >
            <div className="text-center">
              <div className="font-medium text-sm">{option.name}</div>
              {option.priceModifier > 0 && (
                <div className="text-xs text-gray-600">+€{option.priceModifier}</div>
              )}
            </div>
          </button>
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
    <div className="relative overflow-hidden rounded-lg bg-[#F5F5F5] aspect-[3/4]">
      <img
        src={encodeImageUrl(images[currentImageIndex])}
        alt="Product detail"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Thumbnail Gallery */}
    {images.length > 1 && (
      <div className="flex gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative overflow-hidden rounded-md aspect-square w-20 border-2 transition-all ${
              index === currentImageIndex
                ? 'border-[#C79E48]'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onImageChange(index)}
          >
            <img
              src={encodeImageUrl(image)}
              alt={`View ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
);

// Price Display Component
const PriceDisplay = ({ price }: { price: number }) => (
  <div className="flex items-baseline gap-1">
    <span className="text-3xl font-bold text-black">€{price}</span>
  </div>
);


// Main Product Detail Page Component
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCartWithToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMobile = useIsMobile();


  // Fetch product data using React Query (single source of truth)
  const { data: product, isLoading: isLoadingProduct, error } = useCollectionProduct(id);

  // Fetch all products for recommendations
  const { data: allProducts } = useCollectionProducts({ isActive: true });

  // Transform product data to match component interface
  const productData: ProductData = useMemo(() => {
    if (product) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description || '',
        imageUrl: encodeImageUrl(product.image_urls?.[0] || ''),
        images: product.image_urls?.map(url => encodeImageUrl(url)) || [],
        category: product.display_category || product.category || '',
        inStock: !product.is_out_of_stock
      };
    }
    // Fallback to mock data if no product found
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
  }, [product, id]);

  // Local state management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate current price based on selected size
  const selectedSizeOption = sizeOptions.find(option => option.id === selectedSize);
  const currentPrice = productData.price + (selectedSizeOption?.priceModifier || 0);

  // Smart recommendation logic using React Query data
  const recommendedBouquets = useMemo((): Bouquet[] => {
    if (!allProducts || !product) return [];

    const currentCategory = productData.category;
    const currentId = productData.id;
    const currentPrice = productData.price;

    // Transform products to Bouquet format
    const availableBouquets: Bouquet[] = allProducts
      .filter(p => p.id !== currentId)
      .map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        image: encodeImageUrl(p.image_urls?.[0] || ''),
        description: p.description || '',
        category: p.category || '',
        displayCategory: p.display_category || p.category || '',
        featured: p.featured || false,
        is_out_of_stock: p.is_out_of_stock || false,
        discount_percentage: p.discount_percentage || null
      }));

    // Find bouquets from the same or related categories
    let sameCategoryBouquets = availableBouquets.filter(
      b => b.displayCategory === currentCategory
    );

    // If not enough same category, find similar price range
    if (sameCategoryBouquets.length < 4) {
      const similarPriceBouquets = availableBouquets.filter(
        b => Math.abs(b.price - currentPrice) <= 50
      );
      sameCategoryBouquets = [...sameCategoryBouquets, ...similarPriceBouquets];
    }

    // If still not enough, add featured bouquets
    if (sameCategoryBouquets.length < 4) {
      const featuredBouquets = availableBouquets.filter(b => b.featured);
      sameCategoryBouquets = [...sameCategoryBouquets, ...featuredBouquets];
    }

    // Remove duplicates and take first 4
    const uniqueBouquets = Array.from(
      new Map(sameCategoryBouquets.map(b => [b.id, b])).values()
    );

    return uniqueBouquets.slice(0, 4);
  }, [allProducts, product, productData]);


  // Prefetch recommended products for faster navigation
  useEffect(() => {
    recommendedBouquets.forEach((bouquet) => {
      queryClient.prefetchQuery({
        queryKey: collectionQueryKeys.detail(bouquet.id),
        queryFn: async () => {
          const { getCollectionProduct } = await import('@/lib/api/collection-products');
          return getCollectionProduct(bouquet.id);
        },
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [recommendedBouquets, queryClient]);


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
      size: selectedSizeOption?.name || 'Standard'
    }));

    try {
      // Add all items to cart
      for (const item of cartItems) {
        await addToCart(item);
      }
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


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <UltraNavigation />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left Column - Image Gallery */}
          <div className="max-w-md mx-auto lg:mx-0">
            <ImageGallery
              images={productData.images || [productData.imageUrl]}
              currentImageIndex={currentImageIndex}
              onImageChange={setCurrentImageIndex}
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              {productData.category && (
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  {productData.category}
                </p>
              )}

              <h1 className="font-luxury text-3xl lg:text-4xl font-normal text-black">
                {productData.title}
              </h1>

              <PriceDisplay price={currentPrice} />
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-base">
                {productData.description}
              </p>
            </div>

            {/* Customization Options */}
            <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                basePrice={productData.price}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-3">
              <button
                className="w-full py-4 bg-[#C79E48] hover:bg-[#B88A44] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={isLoading || isLoadingProduct || !productData.inStock}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isLoading || isLoadingProduct ? 'Loading...' : !productData.inStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              {/* Favorite Button */}
              <button
                className={`w-full py-3 border-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                  isFavorite(productData.id)
                    ? 'bg-pink-50 border-pink-300 text-pink-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-5 h-5 ${isFavorite(productData.id) ? 'fill-pink-600' : ''}`} />
                <span>{isFavorite(productData.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Flowers Section */}
      {recommendedBouquets.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="font-luxury text-3xl font-normal text-black mb-2">
                You Might Also Like
              </h2>
              <p className="text-gray-600 text-base">
                Similar products you may be interested in
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendedBouquets.map((bouquet) => (
                <Link
                  key={bouquet.id}
                  to={`/product/${bouquet.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative overflow-hidden aspect-[3/4] bg-[#F5F5F5]">
                      <img
                        src={bouquet.image}
                        alt={bouquet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        {bouquet.displayCategory || bouquet.category}
                      </p>
                      <h3 className="font-luxury text-sm font-normal text-black mb-2 line-clamp-1">
                        {bouquet.name}
                      </h3>
                      <p className="text-sm font-medium text-black">
                        €{bouquet.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <BackToTop />
    </div>
  );
};

export default ProductDetailPage;
