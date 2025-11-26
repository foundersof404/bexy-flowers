import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, ChevronLeft, ShoppingCart, Plus, Minus, Check, Sparkles, Heart, Star, Square, Circle, Triangle, Wand2, RefreshCw, Download, MessageCircle, Eye, Crown, Candy, CreditCard, ArrowDown } from "lucide-react";
import UltraNavigation from "@/components/UltraNavigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const GOLD = "rgb(199, 158, 72)";

interface Package {
  id: string;
  name: string;
  type: "box" | "wrap";
  icon: any;
  price: number;
  description: string;
}

interface BoxShape {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface BoxColor {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

interface Size {
  id: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
}

interface FlowerColor {
  id: string;
  name: string;
  value: string;
}

interface Flower {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: FlowerColor[];
}

interface WrapColor {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

interface Accessory {
  id: string;
  name: string;
  icon: any;
  price: number;
  description: string;
}

const packages: Package[] = [
  { id: "box", name: "Luxury Box", type: "box", icon: Box, price: 25, description: "Premium box with elegant finish" },
  { id: "wrap", name: "Paper Wrap", type: "wrap", icon: Gift, price: 15, description: "Beautiful hand-wrapped with ribbon" }
];

const boxShapes: BoxShape[] = [
  { id: "circle", name: "Circle", icon: Circle, description: "Classic round shape" },
  { id: "rectangle", name: "Rectangle", icon: Square, description: "Elegant rectangular box" },
  { id: "square", name: "Square", icon: Square, description: "Perfect square box" },
  { id: "heart", name: "Heart", icon: Heart, description: "Romantic heart-shaped" },
  { id: "triangle", name: "Triangle", icon: Triangle, description: "Unique triangular design" }
];

const boxColors: BoxColor[] = [
  { id: "white", name: "White", color: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)" },
  { id: "black", name: "Black", color: "#1a1a1a", gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" },
  { id: "gold", name: "Gold", color: GOLD, gradient: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)` },
  { id: "pink", name: "Pink", color: "#FFB6C1", gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)" },
  { id: "blue", name: "Blue", color: "#87CEEB", gradient: "linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)" },
  { id: "red", name: "Red", color: "#DC143C", gradient: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)" }
];

const boxSizes: Size[] = [
  { id: "small", name: "Small", capacity: 15, price: 50, description: "~15 flowers" },
  { id: "medium", name: "Medium", capacity: 25, price: 85, description: "~25 flowers" },
  { id: "large", name: "Large", capacity: 35, price: 120, description: "~35 flowers" },
  { id: "custom", name: "Custom", capacity: 0, price: 0, description: "Choose quantity" }
];

const wrapSizes: Size[] = [
  { id: "small", name: "Small", capacity: 10, price: 40, description: "~10 flowers" },
  { id: "medium", name: "Medium", capacity: 20, price: 70, description: "~20 flowers" },
  { id: "large", name: "Large", capacity: 30, price: 110, description: "~30 flowers" },
  { id: "custom", name: "Custom", capacity: 0, price: 0, description: "Choose quantity" }
];

const flowers: Flower[] = [
  { 
    id: "rose", 
    name: "Roses", 
    price: 5, 
    image: "/src/assets/flowers/red.png",
    colors: [
      { id: "red", name: "Red", value: "red" },
      { id: "pink", name: "Pink", value: "pink" },
      { id: "white", name: "White", value: "white" },
      { id: "yellow", name: "Yellow", value: "yellow" },
      { id: "orange", name: "Orange", value: "orange" }
    ]
  },
  { 
    id: "peony", 
    name: "Peonies", 
    price: 7, 
    image: "/src/assets/flowers/pink.png",
    colors: [
      { id: "pink", name: "Pink", value: "pink" },
      { id: "white", name: "White", value: "white" },
      { id: "coral", name: "Coral", value: "coral" }
    ]
  },
  { 
    id: "lily", 
    name: "Lilies", 
    price: 6, 
    image: "/src/assets/flowers/white .png",
    colors: [
      { id: "white", name: "White", value: "white" },
      { id: "pink", name: "Pink", value: "pink" },
      { id: "orange", name: "Orange", value: "orange" }
    ]
  },
  { 
    id: "tulip", 
    name: "Tulips", 
    price: 4, 
    image: "/src/assets/flowers/red.png",
    colors: [
      { id: "red", name: "Red", value: "red" },
      { id: "pink", name: "Pink", value: "pink" },
      { id: "white", name: "White", value: "white" },
      { id: "yellow", name: "Yellow", value: "yellow" },
      { id: "purple", name: "Purple", value: "purple" }
    ]
  },
  { 
    id: "orchid", 
    name: "Orchids", 
    price: 8, 
    image: "/src/assets/flowers/pink.png",
    colors: [
      { id: "purple", name: "Purple", value: "purple" },
      { id: "white", name: "White", value: "white" },
      { id: "pink", name: "Pink", value: "pink" }
    ]
  },
  { 
    id: "carnation", 
    name: "Carnations", 
    price: 3, 
    image: "/src/assets/flowers/white .png",
    colors: [
      { id: "pink", name: "Pink", value: "pink" },
      { id: "red", name: "Red", value: "red" },
      { id: "white", name: "White", value: "white" }
    ]
  }
];

const wrapColors: WrapColor[] = [
  { id: "white", name: "Pure White", color: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)" },
  { id: "cream", name: "Cream", color: "#FFF8DC", gradient: "linear-gradient(135deg, #FFF8DC 0%, #F5E6D3 100%)" },
  { id: "pink", name: "Blush Pink", color: "#FFB6C1", gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)" },
  { id: "gold", name: "Gold", color: GOLD, gradient: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)` },
  { id: "sage", name: "Sage", color: "#9CAF88", gradient: "linear-gradient(135deg, #9CAF88 0%, #B5C99A 100%)" },
  { id: "lavender", name: "Lavender", color: "#E6E6FA", gradient: "linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)" }
];

const accessories: Accessory[] = [
  { id: "crown", name: "Crown", icon: Crown, price: 15, description: "Golden crown accessory" },
  { id: "teddy", name: "Teddy Bear", icon: Heart, price: 20, description: "Cute plush teddy bear" },
  { id: "chocolates", name: "Chocolates", icon: Candy, price: 12, description: "Premium chocolates box" },
  { id: "card", name: "Greeting Card", icon: CreditCard, price: 5, description: "Beautiful greeting card" }
];

// Simple floating petal component
const FloatingPetal = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0, rotate: 0 }}
    animate={{
      y: window.innerHeight + 100,
      x: Math.random() * window.innerWidth,
      opacity: [0, 0.3, 0.2, 0],
      rotate: 360
    }}
    transition={{
      duration: 20 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
    className="absolute pointer-events-none"
    style={{
      width: "15px",
      height: "15px",
      background: `radial-gradient(circle, ${GOLD}40 0%, transparent 70%)`,
      borderRadius: "50%",
      filter: "blur(2px)"
    }}
  />
);

// Section Component for layout
const CustomizeSection = React.forwardRef<HTMLDivElement, { title: string; children: React.ReactNode; isActive: boolean }>(({ title, children, isActive }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 50 }}
    animate={isActive ? { opacity: 1, y: 0, height: 'auto' } : { opacity: 0.5, y: 0, height: 'auto' }}
    className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 border shadow-xl mb-8 transition-all duration-500 ${isActive ? 'border-[#C79E48]' : 'border-gray-100 grayscale-[0.5] pointer-events-none'}`}
  >
    <h2 className="text-3xl font-luxury font-bold mb-6 text-[#C79E48] border-b border-[#C79E48]/10 pb-4 flex items-center gap-3">
      {title}
      {!isActive && <Check className="w-6 h-6 text-green-500 ml-auto" />}
    </h2>
    {children}
  </motion.div>
));

const Customize: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBoxShape, setSelectedBoxShape] = useState<BoxShape | null>(null);
  const [selectedBoxColor, setSelectedBoxColor] = useState<BoxColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedWrapColor, setSelectedWrapColor] = useState<WrapColor | null>(null);
  const [customQty, setCustomQty] = useState(25);
  const [colorQuantities, setColorQuantities] = useState<Record<string, Record<string, number>>>({});
  const [note, setNote] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [withGlitter, setWithGlitter] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiRefinementText, setAiRefinementText] = useState("");
  const [showRefinement, setShowRefinement] = useState(false);
  const { addToCart } = useCart();

  // Refs for scrolling
  const packageRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const boxColorRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxSizeRef = useRef<HTMLDivElement>(null);
  const flowersRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);

  // Scroll helper
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  // Handlers
  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    // Reset downstream choices if type changes
    if (selectedPackage && selectedPackage.type !== pkg.type) {
      setSelectedBoxShape(null);
      setSelectedBoxColor(null);
      setSelectedWrapColor(null);
      setSelectedSize(null);
    }

    if (pkg.type === "box") {
      scrollToSection(shapeRef);
    } else {
      scrollToSection(wrapRef);
    }
  };

  const handleShapeSelect = (shape: BoxShape) => {
    setSelectedBoxShape(shape);
    scrollToSection(boxColorRef);
  };

  const handleBoxColorSelect = (color: BoxColor) => {
    setSelectedBoxColor(color);
    scrollToSection(boxSizeRef);
  };

  const handleWrapColorSelect = (color: WrapColor) => {
    setSelectedWrapColor(color);
    // Don't scroll yet, waiting for size
  };

  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size);
    scrollToSection(flowersRef);
  };

  // Calculate Stats
  const totalFlowers = Object.values(colorQuantities).reduce((total, colorMap) => {
    return total + Object.values(colorMap).reduce((a, b) => a + b, 0);
  }, 0);
  const maxFlowers = selectedSize?.id === "custom" ? customQty : selectedSize?.capacity || 0;
  
  const flowerCost = Object.entries(colorQuantities).reduce((sum, [flowerId, colors]) => {
    const flower = flowers.find(f => f.id === flowerId);
    const flowerTotal = Object.values(colors).reduce((a, b) => a + b, 0);
    return sum + (flower ? flower.price * flowerTotal : 0);
  }, 0);

  const accessoriesCost = selectedAccessories.reduce((sum, accId) => {
    const acc = accessories.find(a => a.id === accId);
    return sum + (acc ? acc.price : 0);
  }, 0);

  const totalPrice = (selectedPackage?.price || 0) + 
                     (selectedSize?.id === "custom" ? 0 : selectedSize?.price || 0) + 
                     flowerCost + 
                     accessoriesCost;

  const adjustFlowerColor = (flowerId: string, colorId: string, delta: number) => {
    if (delta > 0 && totalFlowers >= maxFlowers) {
      toast.error(`Maximum ${maxFlowers} flowers`, { icon: "🌸" });
      return;
    }
    
    setColorQuantities(prev => {
      const flowerColors = prev[flowerId] || {};
      const current = flowerColors[colorId] || 0;
      const newVal = Math.max(0, current + delta);
      
      if (newVal === 0) {
        const { [colorId]: removed, ...rest } = flowerColors;
        if (Object.keys(rest).length === 0) {
          const { [flowerId]: removedFlower, ...restFlowers } = prev;
          return restFlowers;
        }
        return { ...prev, [flowerId]: rest };
      }
      
      return {
        ...prev,
        [flowerId]: {
          ...flowerColors,
          [colorId]: newVal
        }
      };
    });
  };

  const toggleAccessory = (accessoryId: string) => {
    setSelectedAccessories(prev => {
      if (prev.includes(accessoryId)) {
        return prev.filter(id => id !== accessoryId);
      } else {
        return [...prev, accessoryId];
      }
    });
  };

  // --- AI Generation Logic ---
  const generateBouquetImage = async () => {
    setIsGenerating(true);
    try {
      // 1. Flower List with exact counts
      const flowerDetails = Object.entries(colorQuantities)
        .flatMap(([flowerId, colors]) => {
          const flower = flowers.find(f => f.id === flowerId);
          return Object.entries(colors)
            .filter(([_, count]) => count > 0)
            .map(([colorId, count]) => {
              const colorObj = flower?.colors.find(c => c.id === colorId);
              return `${count} ${colorObj?.name} ${flower?.name}`;
            });
        })
        .join(" and ");

      // 2. Packaging & Setting Description based on Glitter/No-Glitter
      let packagingPrompt = "";
      let settingPrompt = "";
      
      if (selectedPackage?.type === "box") {
        const sizeDesc = selectedSize?.id === 'small' ? "medium-sized" : selectedSize?.id === 'large' ? "large" : "medium-sized";
        
        if (!withGlitter) {
          // Image 1 Style (Classic)
          packagingPrompt = `in a matte black cylindrical box with a slightly textured, fabric-like velvet finish. The box features a small, golden logo centered near the bottom with a stylized 'B' followed by "Bexy Flowers" in a clean, modern, golden sans-serif font. The roses are fresh, vibrant red, plump and velvety, arranged tightly in a perfect, domed cluster sitting slightly above the rim.`;
          settingPrompt = `outdoors on a light grey concrete ledge. Background features bright sunlight casting a slight shadow, with lush green foliage framing the arrangement on the left, suggesting a bright, sunny day with natural lighting.`;
        } else {
          // Image 2 Style (Glitter)
          packagingPrompt = `in a matte black cylindrical box featuring a thin, double-ring gold border trim around the top and bottom edges. The box features a centered golden logo with a stylized 'B' followed by "Bexy Flowers" in a golden sans-serif font. The roses are deep burgundy red, heavily dusted with fine reddish-gold glitter giving a shimmering, metallic frosted appearance. They are packed densely forming a slightly mounded surface.`;
          settingPrompt = `indoors against a completely plain, solid white background. Lighting is soft, artificial studio lighting with no harsh shadows.`;
        }
      } else {
        // Wrap fallback
        packagingPrompt = `wrapped in ${selectedWrapColor?.name} paper with "Bexy Flowers" printed on it. Elegant wrapping style showing stems at the bottom.`;
        settingPrompt = `indoors against a plain white background with soft studio lighting.`;
      }

      // 3. Accessories
      const accessoriesPrompt = selectedAccessories.length > 0 
        ? `Includes ${selectedAccessories.map(id => accessories.find(a => a.id === id)?.name).join(", ")} placed nicely.` 
        : "";

      // Combined Prompt
      const fullPrompt = `Professional photography of ${flowerDetails} ${packagingPrompt} ${accessoriesPrompt} ${settingPrompt} High resolution, photorealistic, 8k, sharp focus. ${aiRefinementText}`;

      // Use Pollinations AI
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${Date.now()}&model=flux`;
      
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        setGeneratedImage(URL.createObjectURL(blob));
        toast.success("Preview ready!");
      } else {
        throw new Error("Generation failed");
      }

    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Generation failed, please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
     // ... (Cart Logic)
    const flowerList = Object.entries(colorQuantities)
      .map(([flowerId, colors]) => {
        const flower = flowers.find(f => f.id === flowerId);
        return Object.entries(colors)
          .filter(([_, count]) => count > 0)
          .map(([colorId, count]) => {
            const colorObj = flower?.colors.find(c => c.id === colorId);
            return `${count}x ${colorObj?.name} ${flower?.name}`;
          })
          .join(", ");
      })
      .join(", ");

    addToCart({
      id: `custom-${Date.now()}`,
      title: "Custom Bouquet",
      price: totalPrice,
      image: generatedImage || "/src/assets/bouquet-1.jpg",
      description: `${selectedPackage?.name} - ${selectedSize?.name} - ${flowerList}`,
      personalNote: note
    });
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <UltraNavigation />
      
      {/* Floating Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <FloatingPetal key={i} delay={i * 2} />
        ))}
      </div>

      {/* Header */}
      <div className="relative pt-32 pb-12 px-6 text-center bg-gradient-to-b from-white to-[#fffbf5]">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-luxury font-bold mb-4 text-[#C79E48]"
        >
          Design Your Masterpiece
        </motion.h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
          Customize every detail of your perfect bouquet, from the packaging to the petals.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Customization Steps */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Package */}
            <CustomizeSection title="1. Choose Presentation" isActive={true} ref={packageRef}>
              <div className="grid grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 hover:scale-[1.02] ${
                      selectedPackage?.id === pkg.id 
                        ? 'border-[#C79E48] bg-[#C79E48]/5 shadow-lg' 
                        : 'border-gray-100 hover:border-[#C79E48]/50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedPackage?.id === pkg.id ? 'bg-[#C79E48] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <pkg.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{pkg.name}</h3>
                      <p className="text-sm text-gray-500">{pkg.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CustomizeSection>

            {/* Step 2: Box Specifics */}
            {selectedPackage?.type === "box" && (
              <>
                <CustomizeSection title="2. Select Box Shape" isActive={!!selectedPackage} ref={shapeRef}>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {boxShapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => handleShapeSelect(shape)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedBoxShape?.id === shape.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${selectedBoxShape?.id === shape.id ? 'bg-[#C79E48] text-white' : 'bg-gray-100'}`}>
                          <shape.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </CustomizeSection>

                <CustomizeSection title="3. Select Box Color" isActive={!!selectedBoxShape} ref={boxColorRef}>
                  <div className="flex flex-wrap gap-4">
                    {boxColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleBoxColorSelect(color)}
                        className={`w-16 h-16 rounded-full border-4 shadow-sm transition-transform hover:scale-110 ${selectedBoxColor?.id === color.id ? 'border-[#C79E48] ring-2 ring-[#C79E48] ring-offset-2' : 'border-white'}`}
                        style={{ background: color.gradient }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  {selectedBoxColor && <p className="mt-4 text-[#C79E48] font-bold">{selectedBoxColor.name} Selected</p>}
                </CustomizeSection>

                <CustomizeSection title="4. Choose Size" isActive={!!selectedBoxColor} ref={boxSizeRef}>
                  <div className="grid grid-cols-2 gap-4">
                    {boxSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeSelect(size)}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          selectedSize?.id === size.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-lg">{size.name}</span>
                          <span className="text-[#C79E48] font-bold">{size.id !== 'custom' ? `$${size.price}` : 'Custom'}</span>
                        </div>
                        <p className="text-sm text-gray-500">{size.description}</p>
                        {size.id === 'custom' && selectedSize?.id === 'custom' && (
                          <input
                            type="number"
                            min="5"
                            value={customQty}
                            onChange={(e) => setCustomQty(parseInt(e.target.value) || 5)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 w-full p-2 border rounded-lg"
                            placeholder="Enter quantity"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </CustomizeSection>
              </>
            )}

            {/* Step 2: Wrap Specifics */}
            {selectedPackage?.type === "wrap" && (
              <CustomizeSection title="2. Wrap Details" isActive={!!selectedPackage} ref={wrapRef}>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold mb-4 text-gray-700">Select Wrap Color</h3>
                    <div className="flex flex-wrap gap-4">
                      {wrapColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleWrapColorSelect(color)}
                          className={`w-14 h-14 rounded-full border-4 shadow-sm transition-transform hover:scale-110 ${selectedWrapColor?.id === color.id ? 'border-[#C79E48] ring-2 ring-[#C79E48] ring-offset-2' : 'border-white'}`}
                          style={{ background: color.gradient }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-4 text-gray-700">Select Bouquet Size</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {wrapSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleSizeSelect(size)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedSize?.id === size.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{size.name}</span>
                            <span className="text-[#C79E48]">{size.id !== 'custom' ? `$${size.price}` : ''}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{size.description}</p>
                          {size.id === 'custom' && selectedSize?.id === 'custom' && (
                          <input
                            type="number"
                            min="5"
                            value={customQty}
                            onChange={(e) => setCustomQty(parseInt(e.target.value) || 5)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 w-full p-2 border rounded-lg"
                            placeholder="Qty"
                          />
                        )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CustomizeSection>
            )}

            {/* Step 5: Flowers */}
            <CustomizeSection title="Select Flowers" isActive={!!selectedSize} ref={flowersRef}>
              <div className="mb-6 p-4 bg-[#fffbf5] border border-[#C79E48]/20 rounded-xl flex justify-between items-center">
                <span>
                  <span className="font-bold text-[#C79E48]">{totalFlowers}</span> / {maxFlowers} Stems Selected
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C79E48] transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalFlowers / maxFlowers) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {flowers.map((flower) => {
                  const flowerColorMap = colorQuantities[flower.id] || {};
                  const totalCount = Object.values(flowerColorMap).reduce((a, b) => a + b, 0);
                  
                  return (
                    <div key={flower.id} className={`border rounded-xl p-4 transition-all ${totalCount > 0 ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <img src={flower.image} alt={flower.name} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                        <div>
                          <h4 className="font-bold text-lg">{flower.name}</h4>
                          <p className="text-[#C79E48] font-medium">${flower.price} / stem</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                        {flower.colors.map((color) => {
                          const count = flowerColorMap[color.id] || 0;
                          return (
                            <div key={color.id} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{color.name}</span>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => adjustFlowerColor(flower.id, color.id, -1)}
                                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                  disabled={count === 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold w-6 text-center">{count}</span>
                                <button 
                                  onClick={() => {
                                    adjustFlowerColor(flower.id, color.id, 1);
                                    // Auto scroll to extras if max reached? Maybe annoying.
                                    if (totalFlowers + 1 === maxFlowers) {
                                      scrollToSection(extrasRef);
                                    }
                                  }}
                                  className="w-8 h-8 rounded-full bg-[#C79E48] text-white flex items-center justify-center hover:bg-[#b08d45]"
                                  disabled={totalFlowers >= maxFlowers}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CustomizeSection>

            {/* Step 6: Accessories & Extras */}
            <CustomizeSection title="Final Touches" isActive={totalFlowers > 0} ref={extrasRef}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-4 text-gray-700">Add Accessories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {accessories.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          selectedAccessories.includes(acc.id) ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100'
                        }`}
                      >
                        <acc.icon className={`w-5 h-5 ${selectedAccessories.includes(acc.id) ? 'text-[#C79E48]' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className="font-bold text-sm">{acc.name}</p>
                          <p className="text-xs text-gray-500">+${acc.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#C79E48]/20 bg-[#fffbf5]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-[#C79E48]" />
                      <span className="font-bold text-gray-700">Add Glitter on Petals</span>
                    </div>
                    <div 
                      onClick={() => setWithGlitter(!withGlitter)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${withGlitter ? 'bg-[#C79E48]' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${withGlitter ? 'left-7' : 'left-1'}`} />
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-2">Personal Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#C79E48] focus:ring-1 focus:ring-[#C79E48] outline-none resize-none"
                    placeholder="Write a sweet message..."
                    rows={3}
                  />
                </div>
              </div>
            </CustomizeSection>

          </div>

          {/* Right Column: Preview & Cart - Sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-6">
              
              {/* AI Preview Card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#C79E48]/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-luxury font-bold text-[#C79E48]">Your Design</h3>
                  <Wand2 className="w-6 h-6 text-[#C79E48]" />
                </div>

                <div className="aspect-square rounded-2xl bg-gray-50 mb-6 overflow-hidden relative group">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setGeneratedImage(null)}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                      <Wand2 className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">
                        Complete your selection to generate an AI preview of your bouquet.
                      </p>
                    </div>
                  )}
                  
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <RefreshCw className="w-10 h-10 text-[#C79E48] animate-spin mb-4" />
                      <p className="font-bold text-[#C79E48]">Generating Magic...</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={generateBouquetImage}
                  disabled={isGenerating || totalFlowers === 0}
                  className="w-full py-4 bg-[#C79E48] text-white font-bold rounded-xl shadow-lg hover:bg-[#b08d45] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-4"
                >
                  <Wand2 className="w-5 h-5" />
                  {generatedImage ? "Regenerate Preview" : "Generate Preview"}
                </button>

                {/* Summary & Total */}
                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Base Price</span>
                    <span>${selectedPackage?.price || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Size Upgrade</span>
                    <span>+${selectedSize?.id !== 'custom' ? selectedSize?.price || 0 : 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Flowers ({totalFlowers})</span>
                    <span>+${flowerCost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Accessories</span>
                    <span>+${accessoriesCost}</span>
                  </div>
                  
                  <div className="flex justify-between text-2xl font-bold text-[#C79E48] pt-4 border-t border-dashed border-[#C79E48]/20">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={totalFlowers === 0}
                  className="w-full mt-6 py-4 bg-black text-white font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {celebrating && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
           {/* Celebration Overlay logic could go here */}
           <div className="absolute inset-0 bg-black/20" />
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }} 
             className="bg-white p-8 rounded-3xl shadow-2xl text-center z-10"
           >
             <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold">Added to Cart!</h2>
           </motion.div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Customize;
