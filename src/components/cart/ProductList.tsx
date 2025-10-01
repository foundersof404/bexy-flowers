import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import ProductCard from './ProductCard';
import { Product } from '@/types/cart';

// Sample products data - in a real app, this would come from an API
const sampleProducts: Product[] = [
  {
    id: 1,
    title: "Royal Elegance Bouquet",
    price: 299,
    image: "/src/assets/bouquet-1.jpg"
  },
  {
    id: 2,
    title: "Valentine's Passion Roses",
    price: 199,
    image: "/src/assets/bouquet-2.jpg"
  },
  {
    id: 3,
    title: "Wedding Dreams Arrangement",
    price: 450,
    image: "/src/assets/bouquet-3.jpg"
  },
  {
    id: 4,
    title: "Mother's Love Carnations",
    price: 189,
    image: "/src/assets/bouquet-4.jpg"
  },
  {
    id: 5,
    title: "Graduation Glory Sunflowers",
    price: 159,
    image: "/src/assets/bouquet-5.jpg"
  },
  {
    id: 6,
    title: "Anniversary Bliss Mix",
    price: 279,
    image: "/src/assets/bouquet-6.jpg"
  },
  {
    id: 7,
    title: "Spring Awakening Tulips",
    price: 129,
    image: "/src/assets/bouquet-1.jpg"
  },
  {
    id: 8,
    title: "Autumn Harvest Chrysanthemums",
    price: 169,
    image: "/src/assets/bouquet-2.jpg"
  },
  {
    id: 9,
    title: "Winter Wonderland Poinsettias",
    price: 89,
    image: "/src/assets/bouquet-3.jpg"
  }
];

const ProductList: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-4">
            Our Collection
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Discover our premium floral arrangements, each crafted with love and attention to detail
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {sampleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 font-body">
            Can't find what you're looking for?{' '}
            <span className="text-amber-600 font-semibold hover:underline cursor-pointer">
              Contact us for custom arrangements
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductList;
