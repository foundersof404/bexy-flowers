import React from "react";
import { motion } from "framer-motion";

interface PriceBreakdownProps {
    selectedPackage: { name: string; price: number } | null;
    selectedSize: { id: string; name: string; price: number } | null;
    flowerCost: number;
    flowerDetails: Array<{ name: string; color: string; quantity: number; unitPrice: number }>;
    selectedAccessories: Array<{ name: string; price: number }>;
    totalPrice: number;
    compact?: boolean;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
    selectedPackage,
    selectedSize,
    flowerCost,
    flowerDetails,
    selectedAccessories,
    totalPrice,
    compact = false
}) => {
    if (!selectedPackage && !selectedSize && flowerDetails.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 ${compact ? 'p-4' : 'p-6'} shadow-lg`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-luxury font-bold text-gray-800">Price Breakdown</h3>
                <span className="text-sm text-gray-500">Itemized</span>
            </div>

            <div className="space-y-3">
                {/* Package/Presentation */}
                {selectedPackage && (
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                            <span className="font-medium text-gray-700">{selectedPackage.name}</span>
                        </span>
                        <span className="font-semibold text-gray-800">${selectedPackage.price}</span>
                    </div>
                )}

                {/* Size */}
                {selectedSize && selectedSize.id !== 'custom' && (
                    <div className="flex justify-between text-sm pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                            <span className="font-medium text-gray-700">{selectedSize.name} Size</span>
                        </span>
                        <span className="font-semibold text-gray-800">${selectedSize.price}</span>
                    </div>
                )}

                {/* Flowers */}
                {flowerDetails.length > 0 && (
                    <div className="pb-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-700 mb-2">Flowers</div>
                        <div className="space-y-1.5 pl-3">
                            {flowerDetails.map((flower, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-gray-600">
                                    <span>
                                        {flower.quantity}x {flower.color} {flower.name}
                                        <span className="text-gray-400 ml-1">@ ${flower.unitPrice} ea</span>
                                    </span>
                                    <span className="font-medium text-gray-700">${flower.quantity * flower.unitPrice}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-sm font-semibold text-gray-800 pt-1 mt-1 border-t border-gray-100">
                                <span>Flower Subtotal</span>
                                <span>${flowerCost}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Accessories */}
                {selectedAccessories.length > 0 && (
                    <div className="pb-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-700 mb-2">Accessories</div>
                        <div className="space-y-1.5 pl-3">
                            {selectedAccessories.map((acc, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-gray-600">
                                    <span className="font-medium text-gray-700">{acc.name}</span>
                                    <span className="font-medium text-gray-700">${acc.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#C79E48]/30">
                    <span className="text-lg font-luxury font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-luxury font-bold text-[#C79E48]">${totalPrice}</span>
                </div>
            </div>

            {/* Decorative Element */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500">
                    ✨ Crafted with luxury in every detail
                </p>
            </div>
        </motion.div>
    );
};

export default PriceBreakdown;
