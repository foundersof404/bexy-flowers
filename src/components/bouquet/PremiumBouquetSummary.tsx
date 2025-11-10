import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, Sparkles, RotateCcw, GripVertical } from 'lucide-react';
import { SummaryPanelProps } from '@/types/bouquet';

const PremiumBouquetSummary: React.FC<SummaryPanelProps> = ({
  selectedFlowers,
  totalPrice,
  onQuantityChange,
  onFlowerRemove,
  onOrder,
  onClearAll
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const selectedFlowersArray = Object.values(selectedFlowers);
  const totalFlowers = selectedFlowersArray.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (flowerId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onFlowerRemove(flowerId);
    } else {
      onQuantityChange(flowerId, newQuantity);
    }
  };

  const handleOrder = async () => {
    if (selectedFlowersArray.length === 0) return;
    
    setIsOrdering(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    onOrder();
    setIsOrdering(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">Your Bouquet</h3>
            <p className="text-slate-600">{totalFlowers} premium flowers</p>
          </div>
        </div>
        
        {selectedFlowersArray.length > 0 && (
          <motion.button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-medium">Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Selected Flowers List */}
      <div className="space-y-4 mb-8 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <AnimatePresence>
          {selectedFlowersArray.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🌺</div>
              <p className="text-slate-600 font-medium mb-2">Your bouquet is empty</p>
              <p className="text-sm text-slate-500">Add flowers to start building</p>
            </motion.div>
          ) : (
            <Reorder.Group
              values={selectedFlowersArray}
              onReorder={() => {}} // Handle reordering if needed
              className="space-y-3"
            >
              {selectedFlowersArray.map((selectedFlower, index) => (
                <Reorder.Item
                  key={selectedFlower.flower.id}
                  value={selectedFlower}
                  className="list-none"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                    className="bg-gradient-to-r from-slate-50/80 to-white/80 border border-slate-200/30 rounded-2xl p-4 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>

                      {/* Flower Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={selectedFlower.flower.imageUrl}
                          alt={selectedFlower.flower.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement;
                            if (fallback) {
                              fallback.innerHTML = '<div class="text-2xl">🌸</div>';
                            }
                          }}
                        />
                      </div>

                      {/* Flower Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate mb-1">
                          {selectedFlower.flower.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          ${selectedFlower.flower.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => handleQuantityChange(selectedFlower.flower.id, selectedFlower.quantity - 1)}
                          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-4 h-4 text-slate-600" />
                        </motion.button>
                        
                        <span className="w-8 text-center font-bold text-slate-800">
                          {selectedFlower.quantity}
                        </span>
                        
                        <motion.button
                          onClick={() => handleQuantityChange(selectedFlower.flower.id, selectedFlower.quantity + 1)}
                          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-4 h-4 text-slate-600" />
                        </motion.button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-0">
                        <p className="font-bold text-slate-800">
                          ${(selectedFlower.flower.price * selectedFlower.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => onFlowerRemove(selectedFlower.flower.id)}
                        className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>

      {/* Total Price */}
      {selectedFlowersArray.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Total Price</p>
                <p className="text-sm text-slate-600">Premium quality guaranteed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-700">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-slate-600">
                {totalFlowers} flower{totalFlowers !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <motion.button
          onClick={handleOrder}
          disabled={selectedFlowersArray.length === 0 || isOrdering}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            selectedFlowersArray.length === 0 || isOrdering
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl'
          }`}
          whileHover={selectedFlowersArray.length > 0 && !isOrdering ? { scale: 1.02 } : {}}
          whileTap={selectedFlowersArray.length > 0 && !isOrdering ? { scale: 0.98 } : {}}
        >
          {isOrdering ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Order This Bouquet</span>
            </>
          )}
        </motion.button>

        {selectedFlowersArray.length > 0 && (
          <motion.button
            onClick={onClearAll}
            className="w-full py-3 px-6 rounded-2xl font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all duration-300"
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
          className="mt-6 pt-6 border-t border-slate-200/50"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>✨</span>
            <span>Free delivery on orders over $50</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PremiumBouquetSummary;

