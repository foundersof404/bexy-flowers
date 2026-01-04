import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, Check, CheckCircle2, Wand2, Plus, Minus, X, Info, ChevronRight, Palette, ShoppingCart, Circle, Square, Heart, Download, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import UltraNavigation from "@/components/UltraNavigation";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import heroBouquetMain from "@/assets/bouquet-4.jpg";
import { flowers, flowerFamilies, EnhancedFlower } from "@/data/flowers";
import { generateBouquetImage as generateImage } from "@/lib/api/imageGeneration";

// --- Types ---
const GOLD = "rgb(199, 158, 72)";

interface Package {
  id: string;
  name: string;
  type: "box" | "wrap";
  icon: any;
  basePrice: number;
  description: string;
}

interface Size {
  id: string;
  name: string;
  priceMultiplier: number;
  description: string;
}

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  gradient: string;
}

interface SelectedFlower {
  flower: EnhancedFlower;
  quantity: number;
}

interface BoxShape {
  id: string;
  name: string;
  icon: any;
}

// --- Data ---
const packages: Package[] = [
  { id: "box", name: "Luxury Box", type: "box", icon: Box, basePrice: 20, description: "Premium rigid box" },
  { id: "wrap", name: "Signature Wrap", type: "wrap", icon: Gift, basePrice: 15, description: "Elegant paper wrapping" }
];

const sizes: Size[] = [
  { id: "small", name: "Small", priceMultiplier: 1.0, description: "Perfect for a sweet gesture" },
  { id: "medium", name: "Medium", priceMultiplier: 1.5, description: "Our most popular size" },
  { id: "large", name: "Large", priceMultiplier: 2.0, description: "A grand statement" }
];

const colors: ColorOption[] = [
  { id: "black", name: "Black", hex: "#000000", gradient: "linear-gradient(135deg, #2a2a2a 0%, #000000 100%)" },
  { id: "white", name: "White", hex: "#FFFFFF", gradient: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)" },
  { id: "gold", name: "Gold", hex: GOLD, gradient: `linear-gradient(135deg, ${GOLD} 0%, #a88b45 100%)` },
  { id: "pink", name: "Pink", hex: "#FFC0CB", gradient: "linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%)" },
  { id: "blue", name: "Blue", hex: "#87CEEB", gradient: "linear-gradient(135deg, #87ceeb 0%, #5f9ea0 100%)" },
  { id: "red", name: "Red", hex: "#DC143C", gradient: "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)" }
];

const boxShapes: BoxShape[] = [
  { id: "round", name: "Round", icon: Circle },
  { id: "square", name: "Square", icon: Square },
  { id: "heart", name: "Heart", icon: Heart }
];

// Horizontal Progress Stepper Component
const ProgressStepper = ({ currentStep, steps }: { currentStep: number, steps: Array<{ id: number, title: string, icon: any }> }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C79E48] to-[#d4af4a]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#C79E48] border-[#C79E48] text-white shadow-lg'
                    : isActive
                    ? 'bg-white border-[#C79E48] text-[#C79E48] shadow-lg scale-110'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
                whileHover={!isActive && !isCompleted ? { scale: 1.1 } : {}}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </motion.div>
              <span className={`mt-3 text-xs font-bold tracking-wider uppercase transition-colors ${
                isActive || isCompleted ? 'text-[#C79E48]' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Customize: React.FC = () => {
  const isMobile = useIsMobile();
  const { addToCart } = useCart();

  // State
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBoxShape, setSelectedBoxShape] = useState<BoxShape | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [flowerMode, setFlowerMode] = useState<"specific" | "mix" | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedFlowers, setSelectedFlowers] = useState<Record<string, SelectedFlower>>({});
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (generatedImage && generatedImage.startsWith('blob:')) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  // Computed
  const step1Complete = !!selectedPackage && (selectedPackage.type === "wrap" || !!selectedBoxShape);
  const step2Complete = !!selectedSize && !!selectedColor;
  const step3Complete = Object.keys(selectedFlowers).length > 0;
  const currentStep = !step1Complete ? 1 : !step2Complete ? 2 : 3;

  // Reset box shape when package changes
  useEffect(() => {
    if (selectedPackage?.type !== "box") {
      setSelectedBoxShape(null);
    }
  }, [selectedPackage]);

  // Pricing
  const basePrice = (selectedPackage?.basePrice || 0) * (selectedSize?.priceMultiplier || 1);
  const flowerPrice = Object.values(selectedFlowers).reduce((acc, curr) => acc + (curr.flower.price * curr.quantity), 0);
  const totalPrice = basePrice + flowerPrice;

  // Price animation
  const [displayPrice, setDisplayPrice] = useState(0);
  const prevPriceRef = useRef(0);
  useEffect(() => {
    if (totalPrice === prevPriceRef.current) return;
    const duration = 500;
    const startTime = Date.now();
    const startPrice = prevPriceRef.current;
    const priceDiff = totalPrice - startPrice;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayPrice(startPrice + priceDiff * easeOut);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayPrice(totalPrice);
        prevPriceRef.current = totalPrice;
      }
    };
    animate();
  }, [totalPrice]);

  // Handlers
  const handleAddFlower = (flower: EnhancedFlower) => {
    setSelectedFlowers(prev => ({
      ...prev,
      [flower.id]: {
        flower,
        quantity: (prev[flower.id]?.quantity || 0) + 1
      }
    }));
  };

  const handleRemoveFlower = (flowerId: string) => {
    setSelectedFlowers(prev => {
      const next = { ...prev };
      if (next[flowerId].quantity > 1) {
        next[flowerId].quantity -= 1;
      } else {
        delete next[flowerId];
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    const desc = `${selectedSize?.name} ${selectedColor?.name} ${selectedPackage?.name}${selectedBoxShape ? ` (${selectedBoxShape.name})` : ''} with ${Object.values(selectedFlowers).map(f => `${f.quantity} ${f.flower.name}`).join(', ')}`;
    addToCart({
      id: `custom-${Date.now()}`,
      title: "Custom Bouquet",
      price: totalPrice,
      image: generatedImage || Object.values(selectedFlowers)[0]?.flower.imageUrl || heroBouquetMain,
      description: desc,
      personalNote: ""
    });
    toast.success("Added to cart!");
  };

  const handleDownloadImage = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bexy-flowers-custom-bouquet-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleDownloadAndShareWhatsApp = async () => {
    if (!generatedImage) return;
    const whatsappNumber = "96176104882";
    const message = "I would like to order this flower. Thank you.";
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bexy-flowers-custom-bouquet-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      toast.success("Image downloaded! Opening WhatsApp...");
    } catch (error) {
      toast.error("Failed to download image or open WhatsApp");
    }
  };

  // AI Generation
  const generateBouquetImage = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const flowerDetails: string[] = [];
      const flowerBreakdown: string[] = [];
      let totalFlowerCount = 0;
      
      Object.values(selectedFlowers).forEach(({ flower, quantity }) => {
        totalFlowerCount += quantity;
        flowerDetails.push(`${quantity} ${flower.colorName} ${flower.family}`);
        if (quantity > 1) {
          flowerBreakdown.push(`${quantity} ${flower.colorName} ${flower.family} blooms`);
        } else {
          flowerBreakdown.push(`1 ${flower.colorName} ${flower.family} bloom`);
        }
      });

      const flowersText = flowerDetails.length > 0 ? flowerDetails.join(', ') : 'mixed roses';
      const arrangementText = flowerBreakdown.length > 0 ? flowerBreakdown.join(', ') : 'mixed flower arrangement';
      const colorName = selectedColor?.name.toLowerCase() || "white";
      const sizeName = selectedSize?.name.toLowerCase() || "medium";
      const packageType = selectedPackage?.type || "box";
      const packageName = selectedPackage?.name || (packageType === "box" ? "Luxury Box" : "Signature Wrap");

      let fullPrompt = "";
      if (packageType === "box") {
        const boxShapeName = selectedBoxShape?.name.toLowerCase() || "square";
        fullPrompt = `A premium ${colorName} luxury gift box, ${boxShapeName} shape, ${sizeName} size dimensions, filled with a stunning flower bouquet containing exactly ${totalFlowerCount} fresh premium flowers: ${flowersText}, expertly arranged in a professional ${sizeName} size floral arrangement featuring ${arrangementText}, top-down aerial view, bird's eye perspective, camera positioned directly above, showing the elegant ${colorName} ${boxShapeName} box with lid fully open revealing the beautiful flowers arranged inside, the box lid displays elegant golden text "Bexy Flowers" in elegant script font, clearly visible and readable, soft professional studio lighting from above creating gentle natural shadows, diffused natural light, premium floral gift presentation, Bexy Flowers luxury brand signature, elegant premium quality, commercial product photography, white seamless background, isolated on white`;
      } else {
        fullPrompt = `A ${sizeName} size elegant flower bouquet, containing exactly ${totalFlowerCount} fresh premium flowers: ${flowersText}, beautifully arranged with ${arrangementText} in a professional florist style, wrapped elegantly in ${colorName} decorative paper with matching ${colorName} satin ribbon bow, the ribbon features a small elegant tag with golden text "Bexy Flowers" clearly visible and readable, front view, standing upright, three-quarter angle view, professional florist arrangement, fresh premium flowers, soft natural studio lighting, diffused light, Bexy Flowers signature style, premium quality luxury floral gift, commercial product photography, white seamless background, isolated on white`;
      }

      toast.loading("Generating your bouquet preview...", { id: 'generating-toast' });
      const result = await generateImage(fullPrompt, {
        width: 1024,
        height: 1024,
        enhancePrompt: true,
      });

      if (generatedImage && generatedImage.startsWith('blob:')) {
        URL.revokeObjectURL(generatedImage);
      }
      setGeneratedImage(result.imageUrl);
      toast.success("Preview generated!", { id: 'generating-toast' });
    } catch (error) {
      toast.dismiss('generating-toast');
      toast.error("Could not generate preview", {
        description: "AI services are busy. Try again in a moment.",
      });
      setIsGenerating(false);
    }
  };

  const availableFlowers = flowerMode === "specific" && selectedFamily
    ? flowers.filter(f => f.family === selectedFamily)
    : flowers;

  const steps = [
    { id: 1, title: "Base", icon: Box },
    { id: 2, title: "Details", icon: Palette },
    { id: 3, title: "Blooms", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-white font-body">
      <UltraNavigation />

      {/* Minimal Hero */}
      <div className="pt-24 pb-8 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-luxury font-bold text-gray-900 mb-2">Design Your Masterpiece</h1>
          <p className="text-sm text-gray-500">Handcrafted by expert florists</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={currentStep} steps={steps} />

      {/* Main Content - Split Screen Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Selection Panels */}
          <div className="space-y-6">
            
            {/* Step 1: Package Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step1Complete ? 'bg-[#C79E48] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Choose Presentation</h3>
                  <p className="text-xs text-gray-500">Select your base style</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {packages.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      selectedPackage?.id === pkg.id
                        ? 'border-[#C79E48] bg-[#C79E48]/5'
                        : 'border-gray-200 hover:border-[#C79E48]/50'
                    }`}
                  >
                    <pkg.icon className={`w-8 h-8 mb-3 ${selectedPackage?.id === pkg.id ? 'text-[#C79E48]' : 'text-gray-400'}`} />
                    <h4 className="font-bold text-gray-900 mb-1">{pkg.name}</h4>
                    <p className="text-xs text-gray-500">{pkg.description}</p>
                    <div className="mt-2 text-sm font-bold text-[#C79E48]">${pkg.basePrice}</div>
                  </button>
                ))}
              </div>

              {/* Box Shape - Conditional */}
              <AnimatePresence>
                {selectedPackage?.type === "box" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <h4 className="font-semibold text-gray-900 mb-4">Box Shape</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {boxShapes.map(shape => {
                        const ShapeIcon = shape.icon;
                        return (
                          <button
                            key={shape.id}
                            onClick={() => setSelectedBoxShape(shape)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedBoxShape?.id === shape.id
                                ? 'border-[#C79E48] bg-[#C79E48]/5'
                                : 'border-gray-200 hover:border-[#C79E48]/50'
                            }`}
                          >
                            <ShapeIcon className={`w-6 h-6 mx-auto mb-2 ${selectedBoxShape?.id === shape.id ? 'text-[#C79E48]' : 'text-gray-400'}`} />
                            <span className="text-xs font-medium text-gray-700">{shape.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step 2: Size & Color */}
            {step1Complete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step2Complete ? 'bg-[#C79E48] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Size & Color</h3>
                    <p className="text-xs text-gray-500">Refine the details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Sizes */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Size</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {sizes.map(size => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            selectedSize?.id === size.id
                              ? 'border-[#C79E48] bg-[#C79E48]/5'
                              : 'border-gray-200 hover:border-[#C79E48]/50'
                          }`}
                        >
                          <div className="font-bold text-gray-900">{size.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{size.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Color</h4>
                    <div className="flex flex-wrap gap-3">
                      {colors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${
                            selectedColor?.id === color.id ? 'border-[#C79E48] scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ background: color.gradient }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Flowers */}
            {step2Complete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step3Complete ? 'bg-[#C79E48] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Choose Your Blooms</h3>
                    <p className="text-xs text-gray-500">Select your flowers</p>
                  </div>
                </div>

                {!flowerMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setFlowerMode("specific")}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#C79E48] hover:bg-[#C79E48]/5 transition-all text-left"
                    >
                      <div className="text-3xl mb-3">🌹</div>
                      <h4 className="font-bold text-gray-900 mb-1">Specific Variety</h4>
                      <p className="text-xs text-gray-500">Choose one flower type</p>
                    </button>
                    <button
                      onClick={() => setFlowerMode("mix")}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#C79E48] hover:bg-[#C79E48]/5 transition-all text-left"
                    >
                      <div className="text-3xl mb-3">💐</div>
                      <h4 className="font-bold text-gray-900 mb-1">Mix & Match</h4>
                      <p className="text-xs text-gray-500">Create a mixed bouquet</p>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => { setFlowerMode(null); setSelectedFamily(null); }}
                        className="text-sm text-gray-500 hover:text-[#C79E48] flex items-center gap-1"
                      >
                        ← Back
                      </button>
                      <span className="text-xs font-medium text-[#C79E48] uppercase tracking-wider">
                        {flowerMode === "specific" ? "Single Variety" : "Mixed Bouquet"}
                      </span>
                    </div>

                    {flowerMode === "specific" && !selectedFamily && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {flowerFamilies.map(fam => (
                          <button
                            key={fam.id}
                            onClick={() => setSelectedFamily(fam.id)}
                            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#C79E48] hover:bg-[#C79E48]/5 transition-all text-center"
                          >
                            <span className="text-2xl block mb-2">{fam.icon}</span>
                            <span className="text-xs font-medium text-gray-700">{fam.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {flowerMode === "specific" && selectedFamily && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{flowerFamilies.find(f => f.id === selectedFamily)?.icon}</span>
                        <h4 className="font-bold text-gray-900">{flowerFamilies.find(f => f.id === selectedFamily)?.name}</h4>
                        <button
                          onClick={() => setSelectedFamily(null)}
                          className="ml-auto text-xs text-gray-500 hover:text-[#C79E48]"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    {(flowerMode === "mix" || (flowerMode === "specific" && selectedFamily)) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                        {availableFlowers.map(flower => {
                          const qty = selectedFlowers[flower.id]?.quantity || 0;
                          return (
                            <div
                              key={flower.id}
                              className={`p-3 rounded-xl border-2 transition-all ${
                                qty > 0 ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-200'
                              }`}
                            >
                              <div className="aspect-square rounded-lg bg-gray-100 mb-2 overflow-hidden">
                                <img
                                  src={flower.imageUrl}
                                  alt={flower.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-xs font-bold text-gray-900 mb-1">{flower.name}</div>
                              <div className="text-xs text-[#C79E48] font-bold mb-2">${flower.price.toFixed(2)}</div>
                              {qty > 0 ? (
                                <div className="flex items-center justify-between">
                                  <button onClick={() => handleRemoveFlower(flower.id)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-bold text-sm">{qty}</span>
                                  <button onClick={() => handleAddFlower(flower)} className="w-7 h-7 rounded-full bg-[#C79E48] text-white flex items-center justify-center">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddFlower(flower)}
                                  className="w-full py-1.5 bg-gray-100 hover:bg-[#C79E48] hover:text-white rounded-lg text-xs font-medium transition-colors"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Right: Preview & Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              
              {/* Preview Area */}
              <div className="aspect-square rounded-xl bg-gray-50 mb-6 overflow-hidden border border-gray-200 relative">
                <AnimatePresence mode="wait">
                  {generatedImage ? (
                    <motion.img
                      key={generatedImage}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      src={generatedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => setIsGenerating(false)}
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                      style={{
                        background: selectedColor 
                          ? `linear-gradient(135deg, ${selectedColor.hex}10 0%, ${selectedColor.hex}05 100%)`
                          : undefined
                      }}
                    >
                      <Wand2 className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {step3Complete ? "Ready to Preview" : "Design Preview"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {step3Complete ? "Generate your custom design" : "Complete selections to preview"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-[#C79E48]/30 rounded-full" />
                        <div className="absolute inset-0 border-4 border-[#C79E48] border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="font-bold text-sm">Creating Your Bouquet</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateBouquetImage}
                disabled={!step3Complete || isGenerating}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-4 flex items-center justify-center gap-2 ${
                  step3Complete && !isGenerating
                    ? 'bg-gradient-to-r from-[#C79E48] to-[#d4af4a] text-white hover:shadow-lg hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                {isGenerating ? "Generating..." : generatedImage ? "Regenerate" : "Generate Preview"}
              </button>

              {generatedImage && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleDownloadImage}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleDownloadAndShareWhatsApp}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
              )}

              {/* Summary */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base</span>
                  <span className="font-medium text-gray-900">
                    {selectedPackage?.name || <span className="text-gray-400">—</span>}
                    {selectedBoxShape && ` (${selectedBoxShape.name})`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Size & Color</span>
                  <span className="font-medium text-gray-900">
                    {selectedSize?.name && selectedColor?.name ? `${selectedSize.name} / ${selectedColor.name}` : <span className="text-gray-400">—</span>}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Flowers</span>
                  <span className="font-medium text-gray-900 text-right">
                    {Object.values(selectedFlowers).length > 0
                      ? Object.values(selectedFlowers).map(f => `${f.quantity}x ${f.flower.name}`).join(', ')
                      : <span className="text-gray-400">—</span>}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-[#C79E48]">${displayPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!step3Complete}
                className="w-full mt-4 py-4 bg-[#C79E48] text-white rounded-xl font-bold hover:bg-[#b08d45] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Customize;
