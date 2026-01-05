import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, Check, CheckCircle2, Wand2, Plus, Minus, X, Info, ChevronRight, Palette, ShoppingCart, Circle, Square, Heart, Download, MessageCircle, Sparkles, ArrowRight, Star, Crown, GraduationCap, Heart as HeartIcon, Candy } from "lucide-react";
import UltraNavigation from "@/components/UltraNavigation";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import heroBouquetMain from "@/assets/bouquet-4.jpg";
import { flowers, flowerFamilies, EnhancedFlower, Season } from "@/data/flowers";
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
  maxFlowers: number; // Maximum number of flowers for this size
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

interface Accessory {
  id: string;
  name: string;
  icon: any;
  price: number;
}

// --- Data ---
const packages: Package[] = [
  { id: "box", name: "Luxury Box", type: "box", icon: Box, basePrice: 20, description: "Premium rigid box" },
  { id: "wrap", name: "Signature Wrap", type: "wrap", icon: Gift, basePrice: 15, description: "Elegant paper wrapping" }
];

const sizes: Size[] = [
  { id: "small", name: "Small", priceMultiplier: 1.0, description: "Perfect for a sweet gesture", maxFlowers: 10 },
  { id: "medium", name: "Medium", priceMultiplier: 1.5, description: "Our most popular size", maxFlowers: 22 },
  { id: "large", name: "Large", priceMultiplier: 2.0, description: "A grand statement", maxFlowers: 37 }
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

const accessories: Accessory[] = [
  { id: "crown", name: "Crown", icon: Crown, price: 5 },
  { id: "graduation-hat", name: "Graduation Hat", icon: GraduationCap, price: 4 },
  { id: "bear", name: "Bear", icon: HeartIcon, price: 6 },
  { id: "chocolate", name: "Chocolate", icon: Candy, price: 3 }
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
  const [withGlitter, setWithGlitter] = useState<boolean>(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flowerFilter, setFlowerFilter] = useState<"all" | "popular" | "romantic" | "minimal" | "luxury" | "seasonal">("all");
  const [seasonFilter, setSeasonFilter] = useState<Season | "all-seasons">("all-seasons");
  const flowersGridRef = useRef<HTMLDivElement>(null);

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
  const step4Complete = true; // Glitter selection is optional (always complete)
  const step5Complete = true; // Accessories selection is optional (always complete)
  const currentStep = !step1Complete ? 1 : !step2Complete ? 2 : !step3Complete ? 3 : !step4Complete ? 4 : 5;

  // Refs for sections
  const step1Ref = useRef<HTMLDivElement>(null);
  const boxShapeRef = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);

  // State for sticky preview card position
  const [previewCardTop, setPreviewCardTop] = useState<number>(96);
  const [scrollY, setScrollY] = useState<number>(0);

  // Calculate preview card position to align with step1
  useEffect(() => {
    const updatePosition = () => {
      if (step1Ref.current) {
        const rect = step1Ref.current.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        setPreviewCardTop(absoluteTop);
      }
      setScrollY(window.scrollY);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const timeoutId = setTimeout(updatePosition, 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  // Reset box shape when package changes
  useEffect(() => {
    if (selectedPackage?.type !== "box") {
      setSelectedBoxShape(null);
    }
  }, [selectedPackage]);

  // Auto-scroll: When Luxury Box is selected, scroll to box shape
  useEffect(() => {
    if (selectedPackage?.type === "box" && boxShapeRef.current) {
      setTimeout(() => {
        boxShapeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedPackage]);

  // Auto-scroll: When box shape is selected, scroll to size & color
  useEffect(() => {
    if (selectedBoxShape && step2Ref.current) {
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedBoxShape]);

  // Auto-scroll: When size and color are both selected, scroll to flowers
  useEffect(() => {
    if (step2Complete && step3Ref.current) {
      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [step2Complete]);

  // Reset filter when mode changes
  useEffect(() => {
    setFlowerFilter("all");
    setSeasonFilter("all-seasons");
  }, [flowerMode, selectedFamily]);

  // Auto-scroll: When family is selected, scroll to flowers grid
  useEffect(() => {
    if (selectedFamily && flowersGridRef.current) {
      setTimeout(() => {
        flowersGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedFamily]);

  // Pricing
  const basePrice = (selectedPackage?.basePrice || 0) * (selectedSize?.priceMultiplier || 1);
  const flowerPrice = Object.values(selectedFlowers).reduce((acc, curr) => acc + (curr.flower.price * curr.quantity), 0);
  const glitterPrice = withGlitter ? 2 : 0;
  const accessoriesPrice = selectedAccessories.reduce((acc, accId) => {
    const accessory = accessories.find(a => a.id === accId);
    return acc + (accessory?.price || 0);
  }, 0);
  const totalPrice = basePrice + flowerPrice + glitterPrice + accessoriesPrice;

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

  // Get max flowers for current size
  const maxFlowers = selectedSize?.maxFlowers || 10;
  
  // Calculate current total flowers
  const currentTotalFlowers = Object.values(selectedFlowers).reduce((acc, curr) => acc + curr.quantity, 0);
  const canAddMore = currentTotalFlowers < maxFlowers;
  const remainingSlots = maxFlowers - currentTotalFlowers;

  // Handlers
  const handleAddFlower = (flower: EnhancedFlower) => {
    if (flowerMode === "specific") {
      // Specific Variety: Set to max flowers (only one flower type allowed)
      setSelectedFlowers({
        [flower.id]: {
          flower,
          quantity: maxFlowers
        }
      });
    } else {
      // Mix & Match: Add one at a time, but check max
      if (!canAddMore) return; // Don't add if max reached
      setSelectedFlowers(prev => ({
        ...prev,
        [flower.id]: {
          flower,
          quantity: (prev[flower.id]?.quantity || 0) + 1
        }
      }));
    }
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
    const flowerDesc = Object.values(selectedFlowers).map(f => `${f.quantity} ${f.flower.name}`).join(', ');
    const glitterDesc = withGlitter ? " with glitter" : "";
    const accessoriesDesc = selectedAccessories.length > 0 
      ? ` with ${selectedAccessories.map(id => accessories.find(a => a.id === id)?.name).join(', ')}`
      : "";
    const desc = `${selectedSize?.name} ${selectedColor?.name} ${selectedPackage?.name}${selectedBoxShape ? ` (${selectedBoxShape.name})` : ''} with ${flowerDesc}${glitterDesc}${accessoriesDesc}`;
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

  // Get current season in Lebanon (Mediterranean climate)
  const getCurrentSeason = (): Season => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 9) return "summer";
    if (month >= 10 && month <= 11) return "fall";
    return "winter"; // Dec, Jan, Feb
  };

  const currentSeason = getCurrentSeason();

  // Season configuration for display
  const seasonConfig: Record<Season, { label: string; icon: string; color: string }> = {
    spring: { label: "Spring", icon: "🌸", color: "bg-green-100 text-green-700 border-green-300" },
    summer: { label: "Summer", icon: "☀️", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    fall: { label: "Fall", icon: "🍂", color: "bg-orange-100 text-orange-700 border-orange-300" },
    winter: { label: "Winter", icon: "❄️", color: "bg-blue-100 text-blue-700 border-blue-300" },
    "all-year": { label: "All Year", icon: "🌿", color: "bg-gray-100 text-gray-700 border-gray-300" }
  };

  // Flower categories mapping - maps filter categories to flower families
  // Popular: Most commonly requested flowers
  // Romantic: Red, pink, white roses (not blue/yellow), peonies, lilies, pink/red/white tulips, pink/white orchids
  // Minimal: Simple, delicate filler flowers - gypsum, daisies, lavender
  // Luxury: Premium, expensive flowers - orchids, peonies, hydrangeas, lilies
  // Seasonal: Empty array - seasonal filter shows ALL flowers, then filters by season
  const flowerCategories: Record<string, string[]> = {
    popular: ["roses", "tulips", "carnation"],
    romantic: ["roses", "peonies", "lily", "tulips", "orchid"], // Will filter by color in logic
    minimal: ["gypsum", "daisies", "lavender"],
    luxury: ["orchid", "peonies", "hydrangea", "lily"],
    seasonal: [] // Empty - seasonal filter shows ALL flowers
  };

  // Get recommended flowers based on package/size (Florist's Choice)
  const getRecommendedFlowers = (): string[] => {
    if (selectedPackage?.type === "box" && selectedSize?.id === "medium") {
      return ["rose-red", "rose-pink", "peony-pink", "orchid-white", "hydrangea-white"];
    }
    if (selectedPackage?.type === "wrap") {
      return ["rose-red", "rose-pink", "tulip-red", "lily-pink"];
    }
    return ["rose-red", "rose-pink", "tulip-pink", "carnation-red"];
  };

  const recommendedFlowerIds = getRecommendedFlowers();

  // Filter flowers by family (specific variety mode)
  const filteredFlowers = flowerMode === "specific" && selectedFamily
    ? flowers.filter(f => f.family === selectedFamily)
    : flowers;

  // Filter by category (popular, romantic, minimal, luxury, seasonal)
  let categoryFiltered = filteredFlowers;
  if (flowerFilter !== "all" && flowerFilter !== "seasonal") {
    const families = flowerCategories[flowerFilter] || [];
    categoryFiltered = filteredFlowers.filter(f => {
      if (!families.includes(f.family)) return false;
      
      // Additional color-based filtering for specific categories
      if (flowerFilter === "romantic") {
        // Romantic: Exclude blue, yellow roses (not romantic colors)
        if (f.family === "roses" && (f.colorName === "blue" || f.colorName === "yellow")) return false;
        // Romantic tulips: red, pink, white (exclude blue, yellow, peach)
        if (f.family === "tulips" && !["red", "pink", "white"].includes(f.colorName)) return false;
      }
      if (flowerFilter === "minimal") {
        // Minimal: Simple flowers - gypsum, daisies, lavender (all colors are fine for minimal)
        // No additional filtering needed
      }
      if (flowerFilter === "luxury") {
        // Luxury: Premium flowers - orchids, peonies, hydrangeas, lilies (all colors are fine)
        // No additional filtering needed
      }
      
      return true;
    });
  }

  // Filter by season if seasonal category is selected
  // When "seasonal" is selected, show ALL flowers (not filtered by families), then filter by season if specific season is chosen
  const availableFlowers = flowerFilter === "seasonal"
    ? seasonFilter === "all-seasons"
      ? filteredFlowers // Show ALL flowers when "all-seasons" is selected (not categoryFiltered)
      : filteredFlowers.filter(f => {
          // Filter by specific season - if flower has seasons data, filter by it
          if (!f.seasons || f.seasons.length === 0) return false; // Exclude flowers without season data
          return f.seasons.includes(seasonFilter);
        })
    : categoryFiltered;

  const steps = [
    { id: 1, title: "Base", icon: Box },
    { id: 2, title: "Details", icon: Palette },
    { id: 3, title: "Blooms", icon: Sparkles },
    { id: 4, title: "Glitter", icon: Star },
    { id: 5, title: "Extras", icon: Gift }
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
          
          {/* Left: Selection Panels */}
          <div className="space-y-6 w-full min-w-0">
            
            {/* Step 1: Package Selection */}
            <motion.div
              ref={step1Ref}
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
                    ref={boxShapeRef}
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
                ref={step2Ref}
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
                ref={step3Ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full min-w-0 overflow-x-hidden"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step3Complete ? 'bg-[#C79E48] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Choose Your Blooms</h3>
                    <p className="text-xs text-gray-500">
                      {flowerMode === "specific" 
                        ? "Select one flower type" 
                        : selectedSize 
                          ? `${currentTotalFlowers} / ${maxFlowers} flowers selected`
                          : "Select your flowers"}
                    </p>
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
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                      >
                        {flowerFamilies.map(fam => (
                          <motion.button
                            key={fam.id}
                            onClick={() => setSelectedFamily(fam.id)}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#C79E48] hover:bg-[#C79E48]/5 transition-all text-center"
                          >
                            <span className="text-2xl block mb-2">{fam.icon}</span>
                            <span className="text-xs font-medium text-gray-700">{fam.name}</span>
                          </motion.button>
                        ))}
                      </motion.div>
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

                    {/* Flower Filters - Available for both Specific Variety and Mix & Match */}
                    {(flowerMode === "mix" || (flowerMode === "specific" && selectedFamily)) && (
                      <div className="space-y-3 mb-4">
                        {/* Style Filters */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "all", label: "All" },
                            { id: "popular", label: "Popular" },
                            { id: "romantic", label: "Romantic" },
                            { id: "minimal", label: "Minimal" },
                            { id: "luxury", label: "Luxury" },
                            { id: "seasonal", label: "Seasonal" }
                          ].map(filter => (
                            <button
                              key={filter.id}
                              onClick={() => setFlowerFilter(filter.id as any)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                flowerFilter === filter.id
                                  ? 'bg-[#C79E48] text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>

                        {/* Seasonal Filter - Only show when "seasonal" category is selected */}
                        {flowerFilter === "seasonal" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-gray-600">Season:</span>
                            {[
                              { id: "all-seasons", label: "All Seasons" },
                              { id: "spring", label: "Spring", icon: "🌸" },
                              { id: "summer", label: "Summer", icon: "☀️" },
                              { id: "fall", label: "Fall", icon: "🍂" },
                              { id: "winter", label: "Winter", icon: "❄️" }
                            ].map(seasonFilterOption => (
                              <button
                                key={seasonFilterOption.id}
                                onClick={() => {
                                  setSeasonFilter(seasonFilterOption.id === "all-seasons" ? "all-seasons" : seasonFilterOption.id as Season);
                                }}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                                  (seasonFilterOption.id === "all-seasons" && seasonFilter === "all-seasons") ||
                                  (seasonFilterOption.id !== "all-seasons" && seasonFilter === seasonFilterOption.id)
                                    ? 'bg-[#C79E48]/20 text-[#C79E48] border border-[#C79E48]/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {seasonFilterOption.icon && <span>{seasonFilterOption.icon}</span>}
                                {seasonFilterOption.label}
                              </button>
                            ))}
                            <span className="text-[10px] text-gray-400 ml-auto">
                              Current: {seasonConfig[currentSeason].icon} {seasonConfig[currentSeason].label}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Flower Count Indicator for Mix & Match */}
                    {flowerMode === "mix" && selectedSize && (
                      <div className={`mb-4 p-3 rounded-lg border-2 ${
                        currentTotalFlowers >= maxFlowers 
                          ? 'bg-green-50 border-green-300' 
                          : currentTotalFlowers >= maxFlowers * 0.8
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Flowers Selected:</span>
                          <span className={`text-sm font-bold ${
                            currentTotalFlowers >= maxFlowers 
                              ? 'text-green-700' 
                              : currentTotalFlowers >= maxFlowers * 0.8
                              ? 'text-yellow-700'
                              : 'text-blue-700'
                          }`}>
                            {currentTotalFlowers} / {maxFlowers}
                          </span>
                        </div>
                        {currentTotalFlowers >= maxFlowers && (
                          <div className="text-xs text-green-700 mt-1">✓ Maximum capacity reached</div>
                        )}
                        {currentTotalFlowers < maxFlowers && remainingSlots <= 5 && (
                          <div className="text-xs text-yellow-700 mt-1">Only {remainingSlots} more slot{remainingSlots !== 1 ? 's' : ''} available</div>
                        )}
                      </div>
                    )}

                    {/* Recommended Section */}
                    {(flowerMode === "mix" || (flowerMode === "specific" && selectedFamily)) && step1Complete && step2Complete && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-[#C79E48]/5 to-[#C79E48]/10 rounded-xl border border-[#C79E48]/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-[#C79E48]" />
                          <span className="text-sm font-bold text-[#C79E48]">Florist's Choice</span>
                          <span className="text-xs text-gray-500">Recommended for {selectedPackage?.name} {selectedSize?.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {availableFlowers
                            .filter(f => recommendedFlowerIds.includes(f.id))
                            .slice(0, 4)
                            .map(flower => (
                              <button
                                key={flower.id}
                                onClick={() => handleAddFlower(flower)}
                                disabled={flowerMode === "mix" && !canAddMore}
                                className={`px-3 py-1.5 bg-white border rounded-lg text-xs font-medium transition-all ${
                                  flowerMode === "mix" && !canAddMore
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-[#C79E48]/30 text-gray-700 hover:bg-[#C79E48]/10 hover:border-[#C79E48]'
                                }`}
                              >
                                {flower.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {(flowerMode === "mix" || (flowerMode === "specific" && selectedFamily)) && (
                      <div ref={flowersGridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto overflow-x-hidden w-full">
                        {availableFlowers.map(flower => {
                          const qty = selectedFlowers[flower.id]?.quantity || 0;
                          const isRecommended = recommendedFlowerIds.includes(flower.id);
                          const isSelected = qty > 0;
                          return (
                            <motion.div
                              key={flower.id}
                              whileHover={!isSelected ? { y: -2 } : {}}
                              className={`relative p-3 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-[#C79E48] bg-gradient-to-br from-[#C79E48]/8 to-[#C79E48]/4 shadow-md translate-y-[-2px]'
                                  : 'border-gray-200 bg-white hover:border-[#C79E48]/50 hover:shadow-sm'
                              }`}
                            >
                              {isRecommended && !isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 bg-[#C79E48] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-md whitespace-nowrap">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  Choice
                                </div>
                              )}
                              
                              <div className="aspect-square rounded-lg bg-gray-100 mb-2 overflow-hidden relative">
                                <img
                                  src={flower.imageUrl}
                                  alt={flower.name}
                                  className={`w-full h-full object-cover ${
                                    flower.seasons && 
                                    !flower.seasons.includes("all-year") && 
                                    !flower.seasons.includes(currentSeason)
                                      ? "opacity-50 grayscale-[30%]" 
                                      : ""
                                  }`}
                                />
                                {/* Out of Season Overlay */}
                                {flower.seasons && 
                                 !flower.seasons.includes("all-year") && 
                                 !flower.seasons.includes(currentSeason) && (
                                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 z-20">
                                    <div className="text-white text-center">
                                      <div className="text-xs font-bold mb-1">Not This Season</div>
                                      <div className="text-[10px] text-white/90">
                                        Available in {flower.seasons.map(s => seasonConfig[s].label).join(", ")}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute top-2 right-2 w-5 h-5 bg-[#C79E48] rounded-full flex items-center justify-center shadow-md z-30"
                                  >
                                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="text-xs font-bold text-gray-900 mb-1">{flower.name}</div>
                              <div className="text-xs text-[#C79E48] font-bold mb-2">${flower.price.toFixed(2)}</div>
                              
                              {qty > 0 ? (
                                flowerMode === "specific" ? (
                                  // Specific Variety: Show fixed quantity (no controls)
                                  <div className="text-center py-2">
                                    <div className="text-xs text-gray-500 mb-1">Quantity</div>
                                    <div className="font-bold text-lg text-[#C79E48]">{qty}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">Fixed for {selectedSize?.name} size</div>
                                  </div>
                                ) : (
                                  // Mix & Match: Show controls with max limit
                                  <div className="flex items-center justify-between">
                                    <button 
                                      onClick={() => handleRemoveFlower(flower.id)} 
                                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-bold text-sm">{qty}</span>
                                    <button 
                                      onClick={() => handleAddFlower(flower)} 
                                      disabled={!canAddMore}
                                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                        canAddMore 
                                          ? 'bg-[#C79E48] text-white hover:bg-[#b08d45]' 
                                          : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                      }`}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                )
                              ) : (
                                <button
                                  onClick={() => handleAddFlower(flower)}
                                  disabled={flowerMode === "mix" && !canAddMore}
                                  className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    flowerMode === "mix" && !canAddMore
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'bg-gray-100 hover:bg-[#C79E48] hover:text-white'
                                  }`}
                                >
                                  {flowerMode === "specific" ? "Select" : canAddMore ? "Add" : "Max Reached"}
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Glitter */}
            {step3Complete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full min-w-0 overflow-x-hidden"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C79E48] text-white">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Add Glitter</h3>
                    <p className="text-xs text-gray-500">Make it sparkle! (+$2)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setWithGlitter(false)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      !withGlitter
                        ? 'border-[#C79E48] bg-[#C79E48]/5'
                        : 'border-gray-200 hover:border-[#C79E48]/50'
                    }`}
                  >
                    <div className="text-3xl mb-3">✨</div>
                    <h4 className="font-bold text-gray-900 mb-1">Without Glitter</h4>
                    <p className="text-xs text-gray-500">Classic and elegant</p>
                  </button>
                  <button
                    onClick={() => setWithGlitter(true)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      withGlitter
                        ? 'border-[#C79E48] bg-[#C79E48]/5'
                        : 'border-gray-200 hover:border-[#C79E48]/50'
                    }`}
                  >
                    <div className="text-3xl mb-3">⭐</div>
                    <h4 className="font-bold text-gray-900 mb-1">With Glitter</h4>
                    <p className="text-xs text-gray-500">Sparkle and shine (+$2)</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Accessories */}
            {step3Complete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full min-w-0 overflow-x-hidden"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C79E48] text-white">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Add Accessories</h3>
                    <p className="text-xs text-gray-500">Optional extras to personalize</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {accessories.map(accessory => {
                    const Icon = accessory.icon;
                    const isSelected = selectedAccessories.includes(accessory.id);
                    return (
                      <button
                        key={accessory.id}
                        onClick={() => {
                          setSelectedAccessories(prev => 
                            prev.includes(accessory.id)
                              ? prev.filter(id => id !== accessory.id)
                              : [...prev, accessory.id]
                          );
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? 'border-[#C79E48] bg-[#C79E48]/5'
                            : 'border-gray-200 hover:border-[#C79E48]/50'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-[#C79E48]' : 'text-gray-400'}`} />
                        <div className="font-bold text-sm text-gray-900 mb-1">{accessory.name}</div>
                        <div className="text-xs text-[#C79E48] font-semibold">+${accessory.price}</div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </div>

          {/* Right: Preview & Summary */}
          <div 
            className="hidden lg:block fixed right-4 xl:right-8 h-fit z-10"
            style={{ 
              width: 'clamp(20rem, 30vw, 28rem)',
              top: `${Math.max(96, previewCardTop - scrollY + 16)}px`
            }}
          >
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
