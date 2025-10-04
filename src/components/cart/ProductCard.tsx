import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/cart';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay with action buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="w-10 h-10 bg-white/90 hover:bg-white text-slate-900 rounded-full"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button Overlay */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold rounded-full shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-6">
          <h3 className="font-luxury text-lg sm:text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* Size and Description if available */}
          {'size' in product && product.size && (
            <div className="mb-2">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                Size: {product.size}
              </span>
            </div>
          )}
          
          {'description' in product && product.description && (
            <p className="text-slate-500 text-xs italic mb-3 line-clamp-2">
              "{product.description}"
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-luxury font-bold text-amber-700">
              ${product.price}
            </span>
            
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold rounded-full px-4"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
