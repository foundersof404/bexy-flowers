import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, Check, CheckCircle2, Wand2, Plus, Minus, X, Info, ChevronRight, Palette, ShoppingCart, Circle, Square, Heart, Download, MessageCircle } from "lucide-react";
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

// --- Components ---

const StepHeader = ({ number, title, isActive, isCompleted }: { number: number, title: string, isActive: boolean, isCompleted: boolean }) => (
  <div className={`flex items-center gap-3 mb-6 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-[#C79E48] text-white' : 'bg-gray-200 text-gray-500'
      }`}>
      {isCompleted ? <Check className="w-5 h-5" /> : number}
    </div>
    <h3 className={`text-xl font-luxury font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{title}</h3>
  </div>
);

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

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (generatedImage && generatedImage.startsWith('blob:')) {
        console.log('[Customize] Cleaning up blob URL on unmount');
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  // Computed
  const step1Complete = !!selectedPackage && (selectedPackage.type === "wrap" || !!selectedBoxShape);
  const step2Complete = !!selectedSize && !!selectedColor;
  const step3Complete = Object.keys(selectedFlowers).length > 0;
  
  // Reset box shape when package changes
  useEffect(() => {
    if (selectedPackage?.type !== "box") {
      setSelectedBoxShape(null);
    }
  }, [selectedPackage]);

  // Auto-scroll to box shape selection when luxury box is selected
  useEffect(() => {
    if (selectedPackage?.type === "box" && boxShapeRef.current) {
      setTimeout(() => {
        boxShapeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Wait for animation to complete
    }
  }, [selectedPackage]);

  // Auto-scroll to Step 2 (Size & Color) when box shape is selected
  useEffect(() => {
    if (selectedBoxShape && step2Ref.current) {
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedBoxShape]);

  // Auto-scroll to flowers grid when a flower is added
  const prevFlowerCountRef = useRef<number>(0);
  useEffect(() => {
    const flowerCount = Object.keys(selectedFlowers).length;
    if (flowerCount > prevFlowerCountRef.current && flowersGridRef.current) {
      setTimeout(() => {
        flowersGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
    prevFlowerCountRef.current = flowerCount;
  }, [selectedFlowers]);

  const currentStep = !step1Complete ? 1 : !step2Complete ? 2 : 3;

  // Refs for auto-scroll
  const step1Ref = useRef<HTMLElement>(null);
  const boxShapeRef = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const flowersGridRef = useRef<HTMLDivElement>(null);
  
  // State for preview card top position
  const [previewCardTop, setPreviewCardTop] = useState<number>(400);
  const [scrollY, setScrollY] = useState<number>(0);
  
  // Calculate preview card position based on first section - updates on scroll
  useEffect(() => {
    const updateScrollY = () => {
      setScrollY(window.scrollY);
    };

    const updatePreviewCardPosition = () => {
      if (step1Ref.current) {
        const rect = step1Ref.current.getBoundingClientRect();
        // Calculate absolute position of the section
        const absoluteTop = rect.top + window.scrollY;
        setPreviewCardTop(absoluteTop);
      }
    };

    // Initial calculation after layout
    const timeoutId = setTimeout(() => {
      updateScrollY();
      updatePreviewCardPosition();
    }, 100);

    // Update on scroll and resize
    const handleScroll = () => {
      updateScrollY();
      requestAnimationFrame(updatePreviewCardPosition);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updatePreviewCardPosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePreviewCardPosition);
    };
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (step1Complete && !step2Complete) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (step2Complete && !flowerMode) {
      setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [step1Complete, step2Complete, flowerMode]);

  // Pricing
  const basePrice = (selectedPackage?.basePrice || 0) * (selectedSize?.priceMultiplier || 1);
  const flowerPrice = Object.values(selectedFlowers).reduce((acc, curr) => acc + (curr.flower.price * curr.quantity), 0);
  const totalPrice = basePrice + flowerPrice;

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
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const handleDownloadAndShareWhatsApp = async () => {
    if (!generatedImage) return;

    const whatsappNumber = "96176104882";
    const message = "I would like to order this flower. Thank you.";

    try {
      // First, download the image
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

      // Then open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        toast.success("Image downloaded! Opening WhatsApp...");
      } else {
        toast.info("Image downloaded! Please allow popups to open WhatsApp.");
      }
    } catch (error) {
      console.error("Download and share error:", error);
      toast.error("Failed to download image or open WhatsApp");
    }
  };

  // --- AI Generation Logic (Uses Multiple Free APIs with Fallback) ---
  const generateBouquetImage = async () => {
    console.log('[Customize] Generate button clicked');
    setIsGenerating(true);
    setGeneratedImage(null); // Clear previous to show loading state

    try {
      console.log('[Customize] Building enhanced prompt...');
      
      // Build COMPREHENSIVE flower description with all details
      const flowerDetails: string[] = [];
      const flowerBreakdown: string[] = [];
      let totalFlowerCount = 0;
      
      Object.values(selectedFlowers).forEach(({ flower, quantity }) => {
        totalFlowerCount += quantity;
        // Detailed description: quantity, color, type
        flowerDetails.push(`${quantity} ${flower.colorName} ${flower.family}`);
        // Breakdown for arrangement description
        if (quantity > 1) {
          flowerBreakdown.push(`${quantity} ${flower.colorName} ${flower.family} blooms`);
        } else {
          flowerBreakdown.push(`1 ${flower.colorName} ${flower.family} bloom`);
        }
      });

      const flowersText = flowerDetails.length > 0
        ? flowerDetails.join(', ')
        : 'mixed roses';
      
      const arrangementText = flowerBreakdown.length > 0
        ? flowerBreakdown.join(', ')
        : 'mixed flower arrangement';

      const colorName = selectedColor?.name.toLowerCase() || "white";
      const sizeName = selectedSize?.name.toLowerCase() || "medium";
      const packageType = selectedPackage?.type || "box";
      const packageName = selectedPackage?.name || (packageType === "box" ? "Luxury Box" : "Signature Wrap");

      // Build ULTRA-DETAILED prompt optimized specifically for Pollinations/Flux
      // Pollinations responds best to: Specific details + Composition + Branding + Quality
      let fullPrompt = "";

      if (packageType === "box") {
        const boxShapeName = selectedBoxShape?.name.toLowerCase() || "square";
        // ULTRA-DETAILED box prompt optimized for Pollinations/Flux
        // Pollinations works best with: Specific numbers + Exact colors + Text placement + Multiple brand mentions
        fullPrompt = `A premium ${colorName} luxury gift box, ${boxShapeName} shape, ${sizeName} size dimensions, ` +
                     `filled with a stunning flower bouquet containing exactly ${totalFlowerCount} fresh premium flowers: ${flowersText}, ` +
                     `expertly arranged in a professional ${sizeName} size floral arrangement featuring ${arrangementText}, ` +
                     `top-down aerial view, bird's eye perspective, camera positioned directly above, ` +
                     `showing the elegant ${colorName} ${boxShapeName} box with lid fully open revealing the beautiful flowers arranged inside, ` +
                     `the box lid displays elegant golden text "Bexy Flowers" in elegant script font, clearly visible and readable, ` +
                     `soft professional studio lighting from above creating gentle natural shadows, ` +
                     `diffused natural light, premium floral gift presentation, ` +
                     `Bexy Flowers luxury brand signature, elegant premium quality, ` +
                     `commercial product photography, white seamless background, isolated on white`;
      } else {
        // ULTRA-DETAILED wrap prompt optimized for Pollinations/Flux
        // Pollinations works best with: Specific numbers + Exact colors + Text placement + Multiple brand mentions
        fullPrompt = `A ${sizeName} size elegant flower bouquet, containing exactly ${totalFlowerCount} fresh premium flowers: ${flowersText}, ` +
                     `beautifully arranged with ${arrangementText} in a professional florist style, ` +
                     `wrapped elegantly in ${colorName} decorative paper with matching ${colorName} satin ribbon bow, ` +
                     `the ribbon features a small elegant tag with golden text "Bexy Flowers" clearly visible and readable, ` +
                     `front view, standing upright, three-quarter angle view, ` +
                     `professional florist arrangement, fresh premium flowers, ` +
                     `soft natural studio lighting, diffused light, ` +
                     `Bexy Flowers signature style, premium quality luxury floral gift, ` +
                     `commercial product photography, white seamless background, isolated on white`;
      }

      console.log('[Customize] Enhanced Prompt:', fullPrompt);
      console.log('[Customize] Flower count:', totalFlowerCount);
      
      // Show initial toast
      toast.loading("Generating your bouquet preview...", {
        icon: <Wand2 className="w-4 h-4 text-[#C79E48] animate-pulse" />,
        description: "This may take 5-10 seconds",
        id: 'generating-toast'
      });

      // Generate using AI with Flux model (single high-quality generation)
      // Using 1024x1024 resolution for best quality with Flux
      const result = await generateImage(fullPrompt, {
        width: 1024,
        height: 1024,
        enhancePrompt: true, // Enable automatic structured prompt enhancement
      });

      console.log('[Customize] Generation successful!');
      console.log('[Customize] Source:', result.source);
      console.log('[Customize] Image URL:', result.imageUrl);

      // Clean up old blob URL before setting new one
      if (generatedImage && generatedImage.startsWith('blob:')) {
        console.log('[Customize] Cleaning up old blob URL');
        URL.revokeObjectURL(generatedImage);
      }

      setGeneratedImage(result.imageUrl);
      console.log('[Customize] New image set successfully');

      // Success toast with source info
      toast.success("Preview generated!", {
        icon: <Wand2 className="w-4 h-4 text-[#C79E48]" />,
        description: `Using ${result.source === 'pollinations' ? 'Pollinations AI' : 'HuggingFace AI'}`,
        id: 'generating-toast'
      });
      
    } catch (error) {
      console.error("[Customize] AI Error:", error);
      
      // Dismiss loading toast
      toast.dismiss('generating-toast');
      
      // Show detailed error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error("Could not generate preview", {
        description: "AI services are busy. Try simpler selections or try again in a moment.",
        duration: 5000,
      });
      
      setIsGenerating(false);
    }
  };

  // Filtered Flowers
  const availableFlowers = flowerMode === "specific" && selectedFamily
    ? flowers.filter(f => f.family === selectedFamily)
    : flowers;

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <UltraNavigation />

      {/* Hero Header */}
      <div className="pt-32 pb-12 px-6 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-luxury font-bold text-gray-900 mb-4">Design Your Masterpiece</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Create a truly unique arrangement. Choose your style, colors, and blooms to craft the perfect gift.</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start" id="customize-container">

        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 space-y-8">

          {/* Step 1: Presentation */}
          <section className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-500 border ${currentStep === 1 ? 'border-[#C79E48] ring-4 ring-[#C79E48]/5' : 'border-transparent'}`}>
            <StepHeader number={1} title="Choose Presentation" isActive={currentStep >= 1} isCompleted={step1Complete} />

            <div className="grid grid-cols-2 gap-4">
              {packages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all group hover:border-[#C79E48]/50 ${selectedPackage?.id === pkg.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100 bg-gray-50'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${selectedPackage?.id === pkg.id ? 'bg-[#C79E48] text-white' : 'bg-white text-gray-400 group-hover:text-[#C79E48]'}`}>
                    <pkg.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">{pkg.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>

                  {selectedPackage?.id === pkg.id && (
                    <motion.div layoutId="check1" className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-[#C79E48]" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            {/* Box Shape Selection - Show only when Luxury Box is selected */}
            <AnimatePresence>
              {selectedPackage?.type === "box" && (
                <motion.div
                  ref={boxShapeRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <h4 className="font-bold text-lg text-gray-900 mb-4">Choose Box Shape</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {boxShapes.map(shape => {
                      const ShapeIcon = shape.icon;
                      return (
                        <button
                          key={shape.id}
                          onClick={() => setSelectedBoxShape(shape)}
                          className={`relative p-4 rounded-xl border-2 text-center transition-all group hover:border-[#C79E48]/50 ${selectedBoxShape?.id === shape.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100 bg-gray-50'}`}
                        >
                          <div className={`w-10 h-10 mx-auto mb-3 flex items-center justify-center transition-colors ${selectedBoxShape?.id === shape.id ? 'text-[#C79E48]' : 'text-gray-400 group-hover:text-[#C79E48]'}`}>
                            <ShapeIcon className="w-10 h-10" />
                          </div>
                          <h5 className="font-semibold text-sm text-gray-900">{shape.name}</h5>

                          {selectedBoxShape?.id === shape.id && (
                            <motion.div layoutId="check-shape" className="absolute top-2 right-2">
                              <CheckCircle2 className="w-5 h-5 text-[#C79E48]" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Step 2: Details (Size & Color) */}
          <AnimatePresence>
            {step1Complete && (
              <motion.section
                ref={step2Ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-500 border ${currentStep === 2 ? 'border-[#C79E48] ring-4 ring-[#C79E48]/5' : 'border-transparent'}`}
              >
                <StepHeader number={2} title={`Customize Your ${selectedPackage?.name}`} isActive={currentStep >= 2} isCompleted={step2Complete} />

                <div className="space-y-8">
                  {/* Size Selector */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Select Size</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {sizes.map(size => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${selectedSize?.id === size.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <div className="font-bold text-gray-900">{size.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{size.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Select Color</h4>
                    <div className="flex flex-wrap gap-4">
                      {colors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          className={`group relative w-14 h-14 rounded-full border-4 transition-all ${selectedColor?.id === color.id ? 'border-[#C79E48] scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ background: color.gradient }}
                          title={color.name}
                        >
                          {selectedColor?.id === color.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference"
                            >
                              <Check className="w-6 h-6" />
                            </motion.div>
                          )}
                          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-gray-600">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Step 3: Flowers */}
          <AnimatePresence>
            {step2Complete && (
              <motion.section
                ref={step3Ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-500 border ${currentStep === 3 ? 'border-[#C79E48] ring-4 ring-[#C79E48]/5' : 'border-transparent'}`}
              >
                <StepHeader number={3} title="Select Flowers" isActive={currentStep === 3} isCompleted={step3Complete} />

                {/* Mode Selection */}
                {!flowerMode ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setFlowerMode("specific")}
                      className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-[#C79E48] hover:bg-[#C79E48]/5 transition-all text-left"
                    >
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">🌹</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Specific Variety</h3>
                      <p className="text-gray-500 text-sm">Choose a single flower type (like Roses) and select your perfect color.</p>
                    </button>

                    <button
                      onClick={() => setFlowerMode("mix")}
                      className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-[#C79E48] hover:bg-[#C79E48]/5 transition-all text-left"
                    >
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="text-4xl">💐</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Mix & Match</h3>
                      <p className="text-gray-500 text-sm">Create a vibrant unique bouquet by mixing any of our available flowers.</p>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => { setFlowerMode(null); setSelectedFamily(null); }}
                        className="text-sm text-gray-500 hover:text-[#C79E48] flex items-center gap-1 font-medium"
                      >
                        ← Back to modes
                      </button>
                      <div className="text-sm font-bold text-[#C79E48] uppercase tracking-wider">
                        {flowerMode === "specific" ? "Single Variety" : "Mixed Bouquet"}
                      </div>
                    </div>

                    {/* Specific Mode: Family Selection */}
                    {flowerMode === "specific" && !selectedFamily && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {flowerFamilies.map(fam => (
                          <button
                            key={fam.id}
                            onClick={() => setSelectedFamily(fam.id)}
                            className="p-4 rounded-xl border border-gray-100 hover:border-[#C79E48] hover:shadow-md transition-all flex flex-col items-center gap-2 group bg-white"
                          >
                            <span className="text-3xl group-hover:scale-110 transition-transform">{fam.icon}</span>
                            <span className="font-medium text-sm text-gray-700">{fam.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Flower Selection Grid */}
                    {(flowerMode === "mix" || (flowerMode === "specific" && selectedFamily)) && (
                      <div className="space-y-6">
                        {flowerMode === "specific" && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{flowerFamilies.find(f => f.id === selectedFamily)?.icon}</span>
                            <h3 className="text-xl font-bold">{flowerFamilies.find(f => f.id === selectedFamily)?.name} collection</h3>
                            <button onClick={() => setSelectedFamily(null)} className="text-xs bg-gray-100 px-2 py-1 rounded ml-2 hover:bg-gray-200">Change Type</button>
                          </div>
                        )}

                        <div ref={flowersGridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {availableFlowers.map(flower => {
                            const qty = selectedFlowers[flower.id]?.quantity || 0;
                            return (
                              <div key={flower.id} className={`relative p-3 rounded-xl border-2 transition-all ${qty > 0 ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100 bg-white hover:border-[#C79E48]/30'}`}>
                                <div className="aspect-square rounded-lg bg-gray-50 mb-3 overflow-hidden relative">
                                  <img
                                    src={flower.imageUrl}
                                    alt={flower.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/png?text=Flower'}
                                  />
                                  {qty > 0 && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#C79E48] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                      {qty}
                                    </div>
                                  )}
                                </div>

                                <div className="text-center mb-3">
                                  <div className="font-bold text-gray-900 text-sm">{flower.name}</div>
                                  <div className="text-[#C79E48] font-bold text-xs">${flower.price.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center gap-2 justify-center">
                                  {qty > 0 ? (
                                    <>
                                      <button onClick={() => handleRemoveFlower(flower.id)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="font-bold w-4 text-center">{qty}</span>
                                      <button onClick={() => handleAddFlower(flower)} className="w-8 h-8 rounded-full bg-[#C79E48] text-white flex items-center justify-center hover:bg-[#a6823a] transition-colors">
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <button onClick={() => handleAddFlower(flower)} className="w-full py-2 bg-gray-100 hover:bg-[#C79E48] hover:text-white rounded-lg text-sm font-medium transition-colors">
                                      Add
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Mobile Preview Card - Visible on mobile only */}
          <div className="lg:hidden mt-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-[#C79E48]/20 relative overflow-hidden">
              {/* Decorative Background for Card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C79E48]/5 rounded-bl-full -z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-luxury font-bold text-[#C79E48] flex items-center gap-2">
                    <Wand2 className="w-6 h-6" />
                    Your Design
                  </h3>
                  <div className="bg-[#C79E48]/10 text-[#C79E48] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {step3Complete ? 'Ready' : 'Drafting'}
                  </div>
                </div>

                {/* Preview Image Area */}
                <div className="aspect-square rounded-xl bg-gray-50 mb-6 overflow-hidden relative shadow-inner border border-gray-100 group">
                  <AnimatePresence mode="wait">
                    {generatedImage ? (
                      <motion.img
                        key={generatedImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        src={generatedImage}
                        alt="AI Generated Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log('[Customize] Image loaded successfully');
                          setIsGenerating(false);
                        }}
                        onError={(e) => {
                          console.error('[Customize] Image failed to load');
                          console.error('[Customize] Image src was:', e.currentTarget.src);
                          // Fallback to placeholder
                          e.currentTarget.src = heroBouquetMain;
                          toast.info("Using placeholder. AI service may be temporarily unavailable.");
                          setIsGenerating(false);
                        }}
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center"
                      >
                        <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm font-medium opacity-60 mb-2">AI Preview Area</p>
                        <p className="text-xs opacity-40">
                          {step3Complete 
                            ? "Click 'Generate Preview' to see your design" 
                            : "Complete all steps to generate preview"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Loading Overlay */}
                  {isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                      <div className="text-center text-white px-6">
                        {/* Animated spinner */}
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-[#C79E48]/30 rounded-full" />
                          <div className="absolute inset-0 border-4 border-[#C79E48] border-t-transparent rounded-full animate-spin" />
                          <Wand2 className="absolute inset-0 m-auto w-6 h-6 text-[#C79E48] animate-pulse" />
                        </div>
                        
                        <p className="font-bold tracking-wider text-sm mb-2">CREATING YOUR BOUQUET</p>
                        <p className="text-xs opacity-75">This may take 5-15 seconds...</p>
                        
                        {/* Progress dots */}
                        <div className="flex gap-1 justify-center mt-3">
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={generateBouquetImage}
                    disabled={!step3Complete || isGenerating}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <Wand2 className={`w-4 h-4 text-[#C79E48] ${isGenerating ? 'animate-pulse' : ''}`} />
                    {isGenerating ? "Generating..." : generatedImage ? "Regenerate Preview" : "Generate AI Preview"}
                  </button>
                  {generatedImage && (
                    <>
                      <button
                        onClick={handleDownloadImage}
                        className="bg-[#C79E48] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:bg-[#b08d45] transition-all flex items-center justify-center gap-2"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDownloadAndShareWhatsApp}
                        className="bg-green-600 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        title="Download and share to WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Info banner about AI */}
                {!generatedImage && step3Complete && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
                  >
                    <div className="flex gap-2">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">AI Preview Feature</p>
                        <p className="text-blue-700">
                          We use free AI services to generate previews. 
                          If it fails, try again or adjust your selections.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base</span>
                    <span className="font-medium text-gray-900">
                      {selectedPackage?.name || '-'}
                      {selectedBoxShape && ` (${selectedBoxShape.name})`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size & Color</span>
                    <span className="font-medium text-gray-900">
                      {selectedSize?.name || '-'} / {selectedColor?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Flowers</span>
                    <span className="font-medium text-gray-900 text-right">
                      {Object.values(selectedFlowers).length > 0
                        ? Object.values(selectedFlowers).map(f => `${f.quantity}x ${f.flower.name}`).join(', ')
                        : '-'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="flex justify-between text-base font-bold text-[#C79E48]">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!step3Complete}
                  className="w-full bg-[#C79E48] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b08d45] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_40px_rgba(199,158,72,0.3)] flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Fixed Preview Card - Follows User Scroll */}
        <div className="lg:col-span-5 relative">
          <div 
            className="hidden lg:block fixed right-4 xl:right-8 space-y-6 z-10" 
            style={{ 
              width: 'clamp(20rem, 30vw, 28rem)',
              top: `${Math.max(96, previewCardTop - scrollY + 16)}px`
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-[#C79E48]/20 relative overflow-hidden">
              {/* Decorative Background for Card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C79E48]/5 rounded-bl-full -z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-luxury font-bold text-[#C79E48] flex items-center gap-2">
                    <Wand2 className="w-6 h-6" />
                    Your Design
                  </h3>
                  <div className="bg-[#C79E48]/10 text-[#C79E48] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {step3Complete ? 'Ready' : 'Drafting'}
                  </div>
                </div>

                {/* Preview Image Area */}
                <div className="aspect-square rounded-xl bg-gray-50 mb-6 overflow-hidden relative shadow-inner border border-gray-100 group">
                  <AnimatePresence mode="wait">
                    {generatedImage ? (
                      <motion.img
                        key={generatedImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        src={generatedImage}
                        alt="AI Generated Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log('[Customize] Image loaded successfully');
                          setIsGenerating(false);
                        }}
                        onError={(e) => {
                          console.error('[Customize] Image failed to load');
                          console.error('[Customize] Image src was:', e.currentTarget.src);
                          // Fallback to placeholder
                          e.currentTarget.src = heroBouquetMain;
                          toast.info("Using placeholder. AI service may be temporarily unavailable.");
                          setIsGenerating(false);
                        }}
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center"
                      >
                        <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm font-medium opacity-60 mb-2">AI Preview Area</p>
                        <p className="text-xs opacity-40">
                          {step3Complete 
                            ? "Click 'Generate Preview' to see your design" 
                            : "Complete all steps to generate preview"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Loading Overlay */}
                  {isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                      <div className="text-center text-white px-6">
                        {/* Animated spinner */}
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-[#C79E48]/30 rounded-full" />
                          <div className="absolute inset-0 border-4 border-[#C79E48] border-t-transparent rounded-full animate-spin" />
                          <Wand2 className="absolute inset-0 m-auto w-6 h-6 text-[#C79E48] animate-pulse" />
                        </div>
                        
                        <p className="font-bold tracking-wider text-sm mb-2">CREATING YOUR BOUQUET</p>
                        <p className="text-xs opacity-75">This may take 5-15 seconds...</p>
                        
                        {/* Progress dots */}
                        <div className="flex gap-1 justify-center mt-3">
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={generateBouquetImage}
                    disabled={!step3Complete || isGenerating}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <Wand2 className={`w-4 h-4 text-[#C79E48] ${isGenerating ? 'animate-pulse' : ''}`} />
                    {isGenerating ? "Generating..." : generatedImage ? "Regenerate Preview" : "Generate AI Preview"}
                  </button>
                  {generatedImage && (
                    <>
                      <button
                        onClick={handleDownloadImage}
                        className="bg-[#C79E48] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:bg-[#b08d45] transition-all flex items-center justify-center gap-2"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDownloadAndShareWhatsApp}
                        className="bg-green-600 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        title="Download and share to WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Info banner about AI */}
                {!generatedImage && step3Complete && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
                  >
                    <div className="flex gap-2">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">AI Preview Feature</p>
                        <p className="text-blue-700">
                          We use free AI services to generate previews. 
                          If it fails, try again or adjust your selections.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base</span>
                    <span className="font-medium text-gray-900">
                      {selectedPackage?.name || '-'}
                      {selectedBoxShape && ` (${selectedBoxShape.name})`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size & Color</span>
                    <span className="font-medium text-gray-900">
                      {selectedSize?.name || '-'} / {selectedColor?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Flowers</span>
                    <span className="font-medium text-gray-900 text-right">
                      {Object.values(selectedFlowers).length > 0
                        ? Object.values(selectedFlowers).map(f => `${f.quantity}x ${f.flower.name}`).join(', ')
                        : '-'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="flex justify-between text-base font-bold text-[#C79E48]">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!step3Complete}
                  className="w-full bg-[#C79E48] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b08d45] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_40px_rgba(199,158,72,0.3)] flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Customize;
