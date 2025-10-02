import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, Sparkles, RotateCcw } from 'lucide-react';
import { SummaryPanelProps } from '@/types/bouquet';

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  selectedFlowers,
  totalPrice,
  onQuantityChange,
  onFlowerRemove,
  onOrder,
  onClearAll
}) => {
  const selectedFlowersArray = Object.values(selectedFlowers);
  const totalFlowers = selectedFlowersArray.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (flowerId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onFlowerRemove(flowerId);
    } else {
      onQuantityChange(flowerId, newQuantity);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400/20 to-green-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-emerald-300/30">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-luxury text-2xl font-bold text-slate-800">Your Bouquet</h3>
            <p className="text-sm text-slate-600">{totalFlowers} flowers selected</p>
          </div>
        </div>
        
        {selectedFlowersArray.length > 0 && (
          <motion.button
            onClick={onClearAll}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Selected Flowers List */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <AnimatePresence>
          {selectedFlowersArray.map((selectedFlower, index) => (
            <motion.div
              key={selectedFlower.flower.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
              className="bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-xl border border-slate-200/30 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Flower Image */}
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={selectedFlower.flower.imageUrl}
                    alt={selectedFlower.flower.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement;
                      if (fallback) {
                        fallback.innerHTML = '<div class="text-lg">🌸</div>';
                      }
                    }}
                  />
                </div>

                {/* Flower Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-luxury font-semibold text-slate-800 truncate">
                    {selectedFlower.flower.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    ${selectedFlower.flower.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleQuantityChange(selectedFlower.flower.id, selectedFlower.quantity - 1)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </motion.button>
                  
                  <span className="w-8 text-center font-semibold text-slate-800">
                    {selectedFlower.quantity}
                  </span>
                  
                  <motion.button
                    onClick={() => handleQuantityChange(selectedFlower.flower.id, selectedFlower.quantity + 1)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </motion.button>
                </div>

                {/* Price */}
                <div className="text-right min-w-0">
                  <p className="font-luxury font-bold text-slate-800">
                    ${(selectedFlower.flower.price * selectedFlower.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <motion.button
                  onClick={() => onFlowerRemove(selectedFlower.flower.id)}
                  className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {selectedFlowersArray.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-3">🌺</div>
            <p className="text-slate-600 font-medium">No flowers selected yet</p>
            <p className="text-sm text-slate-500">Choose flowers to build your bouquet</p>
          </motion.div>
        )}
      </div>

      {/* Total Price */}
      {selectedFlowersArray.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="font-luxury font-semibold text-slate-800">Total Price</span>
            </div>
            <div className="text-right">
              <p className="font-luxury text-2xl font-bold text-amber-700">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-xs text-slate-600">
                {totalFlowers} flower{totalFlowers !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          onClick={onOrder}
          disabled={selectedFlowersArray.length === 0}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            selectedFlowersArray.length === 0
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
          }`}
          whileHover={selectedFlowersArray.length > 0 ? { scale: 1.02 } : {}}
          whileTap={selectedFlowersArray.length > 0 ? { scale: 0.98 } : {}}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Order This Bouquet</span>
        </motion.button>

        {selectedFlowersArray.length > 0 && (
          <motion.button
            onClick={onClearAll}
            className="w-full py-3 px-6 rounded-xl font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear All Flowers
          </motion.button>
        )}
      </div>

      {/* Additional Info */}
      {selectedFlowersArray.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-slate-200/50"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>✨</span>
            <span>Free delivery on orders over $50</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SummaryPanel;

