import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye } from "lucide-react";

interface BouquetPreviewProps {
    selectedPackage: { name: string; type: "box" | "wrap"; price: number } | null;
    selectedBoxShape: { name: string; id: string } | null;
    selectedBoxColor: { name: string; color: string; gradient: string } | null;
    selectedWrapColor: { name: string; color: string; gradient: string } | null;
    selectedSize: { name: string; capacity: number } | null;
    colorQuantities: Record<string, Record<string, number>>;
    flowers: Array<{ id: string; name: string; colors: Array<{ id: string; name: string; value: string }> }>;
    generatedImage: string | null;
    isGenerating: boolean;
    totalFlowers: number;
}

const BouquetPreview: React.FC<BouquetPreviewProps> = ({
    selectedPackage,
    selectedBoxShape,
    selectedBoxColor,
    selectedWrapColor,
    selectedSize,
    colorQuantities,
    flowers,
    generatedImage,
    isGenerating,
    totalFlowers
}) => {
    // Get flower color swatches
    const getFlowerSwatches = () => {
        const swatches: Array<{ color: string; count: number; name: string }> = [];

        Object.entries(colorQuantities).forEach(([flowerId, colors]) => {
            const flower = flowers.find(f => f.id === flowerId);
            Object.entries(colors).forEach(([colorId, count]) => {
                if (count > 0) {
                    const colorObj = flower?.colors.find(c => c.id === colorId);
                    if (colorObj) {
                        swatches.push({
                            color: colorObj.value,
                            count,
                            name: `${colorObj.name} ${flower?.name}`
                        });
                    }
                }
            });
        });

        return swatches;
    };

    const flowerSwatches = getFlowerSwatches();

    return (
        <motion.div
            className="sticky top-24 bg-white rounded-3xl border border-gray-200/60 p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-luxury font-bold text-gray-800 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#C79E48]" />
                    Live Preview
                </h3>
                <div className="flex items-center gap-1.5 text-xs bg-[#C79E48]/10 px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-[#C79E48]" />
                    <span className="text-[#C79E48] font-medium">Real-time</span>
                </div>
            </div>

            {/* Visual Preview Area */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl overflow-hidden mb-6">
                <AnimatePresence mode="wait">
                    {generatedImage ? (
                        /* AI Generated Image */
                        <motion.img
                            key="generated"
                            src={generatedImage}
                            alt="Your custom bouquet"
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                        />
                    ) : (
                        /* Placeholder Preview */
                        <motion.div
                            key="placeholder"
                            className="w-full h-full flex items-center justify-center p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="w-full h-full relative">
                                {/* Package/Container */}
                                {selectedPackage && (
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        {/* Box */}
                                        {selectedPackage.type === "box" && selectedBoxColor && (
                                            <div className="relative w-48 h-48">
                                                {/* Box Shape */}
                                                <div
                                                    className={`absolute inset-0 shadow-2xl border-4 border-white/20 ${selectedBoxShape?.id === "circle" ? "rounded-full" :
                                                            selectedBoxShape?.id === "heart" ? "rounded-full transform rotate-45" :
                                                                selectedBoxShape?.id === "rectangle" ? "rounded-2xl" :
                                                                    "rounded-xl"
                                                        }`}
                                                    style={{
                                                        background: selectedBoxColor.gradient,
                                                        boxShadow: `0 20px 60px ${selectedBoxColor.color}40`
                                                    }}
                                                />
                                                {/* Flowers on top */}
                                                {flowerSwatches.length > 0 && (
                                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-full h-20 flex items-end justify-center gap-1 flex-wrap">
                                                        {flowerSwatches.slice(0, 12).map((swatch, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                                                                style={{ backgroundColor: swatch.color }}
                                                                initial={{ y: -10, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                title={swatch.name}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Box Label */}
                                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                                    <span className="text-xs font-luxury text-white/80">Bexy Flowers</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Wrap */}
                                        {selectedPackage.type === "wrap" && selectedWrapColor && (
                                            <div className="relative w-32 h-56">
                                                {/* Wrap Paper */}
                                                <div
                                                    className="absolute inset-0 rounded-t-full rounded-b-lg shadow-2xl"
                                                    style={{
                                                        background: selectedWrapColor.gradient,
                                                        clipPath: "polygon(20% 100%, 80% 100%, 90% 20%, 70% 0%, 30% 0%, 10% 20%)"
                                                    }}
                                                />
                                                {/* Flowers */}
                                                {flowerSwatches.length > 0 && (
                                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 flex flex-wrap gap-1 justify-center w-24">
                                                        {flowerSwatches.slice(0, 15).map((swatch, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                className="w-4 h-4 rounded-full border border-white shadow-md"
                                                                style={{ backgroundColor: swatch.color }}
                                                                initial={{ y: -10, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                title={swatch.name}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Empty State */}
                                {!selectedPackage && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        <div className="w-20 h-20 rounded-full bg-gray-200/50 flex items-center justify-center mb-4">
                                            <Sparkles className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-2">Start Creating</p>
                                        <p className="text-xs text-gray-400">Choose your presentation style to begin</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Overlay */}
                {isGenerating && (
                    <motion.div
                        className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center">
                            <motion.div
                                className="w-16 h-16 border-4 border-[#C79E48]/30 border-t-[#C79E48] rounded-full mx-auto mb-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-sm text-gray-600 font-medium">Generating preview...</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Details Summary */}
            <div className="space-y-3 text-sm">
                {selectedPackage && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">Package</span>
                        <span className="font-semibold text-gray-800">{selectedPackage.name}</span>
                    </div>
                )}

                {selectedSize && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">Size</span>
                        <span className="font-semibold text-gray-800">{selectedSize.name} ({totalFlowers} flowers)</span>
                    </div>
                )}

                {selectedBoxColor && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">Box Color</span>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ background: selectedBoxColor.gradient }}
                            />
                            <span className="font-semibold text-gray-800">{selectedBoxColor.name}</span>
                        </div>
                    </div>
                )}

                {selectedWrapColor && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-500">Wrap Color</span>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ background: selectedWrapColor.gradient }}
                            />
                            <span className="font-semibold text-gray-800">{selectedWrapColor.name}</span>
                        </div>
                    </div>
                )}

                {flowerSwatches.length > 0 && (
                    <div className="pt-2">
                        <span className="text-gray-500 block mb-2">Flowers</span>
                        <div className="flex flex-wrap gap-1.5">
                            {flowerSwatches.map((swatch, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg text-xs"
                                    title={swatch.name}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full border border-gray-200"
                                        style={{ backgroundColor: swatch.color }}
                                    />
                                    <span className="text-gray-600">{swatch.count}x</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Hint */}
            {!generatedImage && totalFlowers > 0 && (
                <motion.div
                    className="mt-4 p-3 bg-[#C79E48]/5 rounded-xl border border-[#C79E48]/20 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs text-[#C79E48] font-medium">
                        ✨ Scroll down to generate a photorealistic preview!
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default BouquetPreview;
