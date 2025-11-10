import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, ChevronLeft, ShoppingCart, Plus, Minus, Check, Sparkles, Heart, Star, Square, Circle, Triangle, Wand2, RefreshCw, Download } from "lucide-react";
import UltraNavigation from "@/components/UltraNavigation";
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

interface Size {
  id: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
}

interface Flower {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
}

interface WrapColor {
  id: string;
  name: string;
  color: string;
  gradient: string;
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
  { id: "rose", name: "Roses", price: 5, image: "/src/assets/flowers/red.png", color: "#DC143C" },
  { id: "peony", name: "Peonies", price: 7, image: "/src/assets/flowers/pink.png", color: "#FFB6C1" },
  { id: "lily", name: "Lilies", price: 6, image: "/src/assets/flowers/white .png", color: "#FFFFFF" },
  { id: "tulip", name: "Tulips", price: 4, image: "/src/assets/flowers/red.png", color: "#FF6347" },
  { id: "orchid", name: "Orchids", price: 8, image: "/src/assets/flowers/pink.png", color: "#DA70D6" },
  { id: "carnation", name: "Carnations", price: 3, image: "/src/assets/flowers/white .png", color: "#FFF0F5" }
];

const wrapColors: WrapColor[] = [
  { id: "white", name: "Pure White", color: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)" },
  { id: "cream", name: "Cream", color: "#FFF8DC", gradient: "linear-gradient(135deg, #FFF8DC 0%, #F5E6D3 100%)" },
  { id: "pink", name: "Blush Pink", color: "#FFB6C1", gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)" },
  { id: "gold", name: "Gold", color: GOLD, gradient: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)` },
  { id: "sage", name: "Sage", color: "#9CAF88", gradient: "linear-gradient(135deg, #9CAF88 0%, #B5C99A 100%)" },
  { id: "lavender", name: "Lavender", color: "#E6E6FA", gradient: "linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)" }
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

const Customize: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBoxShape, setSelectedBoxShape] = useState<BoxShape | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedWrapColor, setSelectedWrapColor] = useState<WrapColor | null>(null);
  const [customQty, setCustomQty] = useState(25);
  const [flowerCounts, setFlowerCounts] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [showPrices, setShowPrices] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [withGlitter, setWithGlitter] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Auto-advance when package is selected
  useEffect(() => {
    if (selectedPackage && step === 1) {
      setTimeout(() => setStep(2), 600);
    }
  }, [selectedPackage, step]);

  // Auto-advance when box shape is selected
  useEffect(() => {
    if (selectedBoxShape && step === 2 && selectedPackage?.type === "box") {
      setTimeout(() => setStep(3), 600);
    }
  }, [selectedBoxShape, step, selectedPackage]);

  // Auto-advance when size is selected (for wrap with color)
  useEffect(() => {
    if (selectedSize && step === 2 && selectedPackage?.type === "wrap" && selectedWrapColor) {
      setTimeout(() => setStep(3), 600);
    }
  }, [selectedSize, selectedWrapColor, step, selectedPackage]);

  // Auto-advance when size is selected for box (step 3 -> 4)
  useEffect(() => {
    if (selectedSize && step === 3 && selectedPackage?.type === "box") {
      setTimeout(() => setStep(4), 600);
    }
  }, [selectedSize, step, selectedPackage]);

  const totalFlowers = Object.values(flowerCounts).reduce((a, b) => a + b, 0);
  const maxFlowers = selectedSize?.id === "custom" ? customQty : selectedSize?.capacity || 0;
  
  const flowerCost = Object.entries(flowerCounts).reduce((sum, [id, count]) => {
    const flower = flowers.find(f => f.id === id);
    return sum + (flower ? flower.price * count : 0);
  }, 0);

  const totalPrice = (selectedPackage?.price || 0) + 
                     (selectedSize?.id === "custom" ? 0 : selectedSize?.price || 0) + 
                     flowerCost;

  const adjustFlower = (id: string, delta: number) => {
    const current = flowerCounts[id] || 0;
    const newVal = Math.max(0, current + delta);
    
    if (delta > 0 && totalFlowers >= maxFlowers) {
      toast.error(`Maximum ${maxFlowers} flowers`, { icon: "🌸" });
      return;
    }
    
    setFlowerCounts(prev => ({ ...prev, [id]: newVal }));
  };

  // AI Image Generation Function with Multiple Reliable Fallbacks
  const generateBouquetImage = async () => {
    setIsGenerating(true);
    
    try {
      // Build detailed prompt based on user selections
      const flowerList = Object.entries(flowerCounts)
        .filter(([_, count]) => count > 0)
        .map(([id, count]) => {
          const flower = flowers.find(f => f.id === id);
          return `${count} ${flower?.name}`;
        })
        .join(", ");

      const prompt = `A beautiful luxury flower bouquet arrangement, professional photography, ${flowerList}, 
        ${selectedPackage?.type === "box" ? `in a ${selectedBoxShape?.name} shaped elegant box` : `wrapped in ${selectedWrapColor?.name} paper with ribbon`}, 
        ${withGlitter ? "with sparkly glitter accents," : ""} 
        premium floral design, studio lighting, white background, high quality, 4K, detailed, elegant composition`;

      // Method 1: Pollinations.ai - Super stable, URL-based, 100% free, no rate limits
      try {
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&enhance=true`;
        
        const pollinationsResponse = await fetch(pollinationsUrl);
        
        if (pollinationsResponse.ok) {
          const blob = await pollinationsResponse.blob();
          const imageUrl = URL.createObjectURL(blob);
          setGeneratedImage(imageUrl);
          
          toast.success("✨ Your bouquet preview is ready!", {
            duration: 3000,
            icon: "🎨"
          });
          return;
        }
      } catch (error) {
        console.log("Pollinations.ai unavailable, trying next method...");
      }

      // Method 2: Hugging Face Stable Diffusion XL (more reliable model)
      try {
        const hfResponse = await fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                negative_prompt: "ugly, blurry, low quality, distorted, bad composition, wilted flowers",
                num_inference_steps: 25,
              }
            }),
          }
        );

        if (hfResponse.ok) {
          const blob = await hfResponse.blob();
          const imageUrl = URL.createObjectURL(blob);
          setGeneratedImage(imageUrl);
          
          toast.success("✨ Your bouquet preview is ready!", {
            duration: 3000,
            icon: "🎨"
          });
          return;
        }
      } catch (error) {
        console.log("Hugging Face SDXL unavailable, trying next method...");
      }

      // Method 3: Alternative Pollinations endpoint
      try {
        const altPollinationsUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;
        
        const altResponse = await fetch(altPollinationsUrl);
        
        if (altResponse.ok) {
          const blob = await altResponse.blob();
          const imageUrl = URL.createObjectURL(blob);
          setGeneratedImage(imageUrl);
          
          toast.success("✨ Your bouquet preview is ready!", {
            duration: 3000,
            icon: "🎨"
          });
          return;
        }
      } catch (error) {
        console.log("Alternative Pollinations unavailable, trying next method...");
      }

      // Method 4: Hugging Face Stable Diffusion 2.1
      try {
        const hfSD21Response = await fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                negative_prompt: "ugly, blurry, low quality",
                num_inference_steps: 20,
              }
            }),
          }
        );

        if (hfSD21Response.ok) {
          const blob = await hfSD21Response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setGeneratedImage(imageUrl);
          
          toast.success("✨ Your bouquet preview is ready!", {
            duration: 3000,
            icon: "🎨"
          });
          return;
        }
      } catch (error) {
        console.log("Hugging Face SD 2.1 unavailable, trying next method...");
      }

      // Method 5: Fallback to a beautiful placeholder with custom message
      // Instead of showing an error, show a preview message
      toast.info("🌸 Creating your preview...", {
        description: "This might take a moment. Your beautiful bouquet is being designed!",
        duration: 4000
      });
      
      // Try one more time with a simpler prompt for Pollinations
      const simplePrompt = `luxury ${flowerList} bouquet, professional photo, white background`;
      const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(simplePrompt)}?width=1024&height=1024&nologo=true`;
      
      const finalResponse = await fetch(finalUrl);
      if (finalResponse.ok) {
        const blob = await finalResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImage(imageUrl);
        
        toast.success("✨ Your bouquet preview is ready!", {
          duration: 3000,
          icon: "🎨"
        });
        return;
      }

      // If absolutely everything fails (very rare), show a friendly message
      throw new Error("All services temporarily unavailable");
      
    } catch (error) {
      console.error("Error generating image:", error);
      
      // User-friendly error message
      toast.error("Please try again in a moment! 🌸", {
        description: "Our AI is taking a short break. Click 'Generate' again!",
        duration: 5000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckout = () => {
    if (totalFlowers === 0) return;

    const flowerList = Object.entries(flowerCounts)
      .filter(([_, c]) => c > 0)
      .map(([id, c]) => `${c}x ${flowers.find(f => f.id === id)?.name}`)
      .join(", ");

    const shapeInfo = selectedBoxShape ? ` - ${selectedBoxShape.name} Shape` : "";

    addToCart({
      id: `custom-${Date.now()}`,
      title: "Custom Bouquet",
      price: totalPrice,
      image: generatedImage || "/src/assets/bouquet-1.jpg",
      description: `${selectedPackage?.name}${shapeInfo} - ${selectedSize?.name} - ${flowerList}${withGlitter ? " with glitter" : ""}`,
      personalNote: note || undefined
    });

    toast.success("🎉 Added to cart!", { 
      description: `Your beautiful bouquet: $${totalPrice.toFixed(2)}`,
      duration: 4000
    });
    
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedPackage(null);
      setSelectedBoxShape(null);
      setSelectedSize(null);
      setSelectedWrapColor(null);
    } else if (step === 3) {
      if (selectedPackage?.type === "box") {
        setSelectedBoxShape(null);
        setSelectedSize(null);
      } else {
        setSelectedSize(null);
        setSelectedWrapColor(null);
      }
    } else if (step === 4) {
      setSelectedSize(null);
    }
    setStep(s => Math.max(1, s - 1));
    setShowPrices(false);
  };

  const getTotalSteps = () => {
    return selectedPackage?.type === "box" ? 4 : 3;
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'my-custom-bouquet.png';
      link.click();
      toast.success("Image downloaded!");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <UltraNavigation />
      
      {/* Subtle Floating Petals Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        {[...Array(8)].map((_, i) => (
          <FloatingPetal key={i} delay={i * 3} />
        ))}
      </div>

      {/* Celebration Effect */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 800,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 800,
                  opacity: 0,
                  scale: 1
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute"
              >
                {i % 3 === 0 ? (
                  <Heart className="w-4 h-4" style={{ color: GOLD }} />
                ) : i % 3 === 1 ? (
                  <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
                ) : (
                  <Star className="w-4 h-4" style={{ color: GOLD }} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative pt-24 pb-12 px-6" style={{ background: "linear-gradient(to bottom, #ffffff, #fffbf5)" }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full backdrop-blur-xl border-2 shadow-xl"
            style={{ 
              borderColor: GOLD,
              background: "rgba(255, 255, 255, 0.7)"
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: GOLD }}>
              AI-POWERED DESIGN STUDIO
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            style={{ 
              color: GOLD,
              textShadow: `0 2px 20px ${GOLD}40`
            }}
          >
            Create Your Dream Bouquet
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            Design & see AI-generated preview instantly
          </motion.p>

          {/* Progress Indicator */}
          <div className="flex justify-center items-center gap-4 mt-12">
            {[...Array(getTotalSteps())].map((_, index) => {
              const num = index + 1;
              const active = step >= num;
              const current = step === num;
              
              return (
                <motion.div
                  key={num}
                  className="flex items-center gap-3"
                >
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg transition-all"
                      style={{
                        backgroundColor: active ? GOLD : "#f3f4f6",
                        color: active ? "white" : "#9ca3af",
                        boxShadow: active ? `0 4px 20px ${GOLD}60` : "0 2px 8px rgba(0,0,0,0.1)",
                        transform: current ? "scale(1.1)" : "scale(1)"
                      }}
                    >
                      {step > num ? <Check className="w-6 h-6" /> : num}
                      
                      {current && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ border: `2px solid ${GOLD}` }}
                        />
                      )}
                    </motion.div>
                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                      {num === 1 && "Package"}
                      {num === 2 && selectedPackage?.type === "box" && "Shape"}
                      {num === 2 && selectedPackage?.type === "wrap" && "Size"}
                      {num === 3 && selectedPackage?.type === "box" && "Size"}
                      {num === 3 && selectedPackage?.type === "wrap" && "Flowers"}
                      {num === 4 && "Flowers"}
                    </span>
                  </div>
                  
                  {num < getTotalSteps() && (
                    <motion.div
                      className="w-16 h-1 rounded-full hidden md:block"
                      style={{
                        backgroundColor: step > num ? GOLD : "#e5e7eb"
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative px-6 py-16 min-h-[600px] z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side: Steps */}
            <div>
              <AnimatePresence mode="wait">
                {/* Step 1: Package - NO PRICES */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: GOLD }}
                    >
                      Choose Your Style
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 text-lg">
                      How would you like your flowers presented?
                    </p>

                    <div className="grid gap-6">
                      {packages.map((pkg, index) => {
                        const Icon = pkg.icon;
                        const selected = selectedPackage?.id === pkg.id;
                        
                        return (
                          <motion.button
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedPackage(pkg)}
                            className="group relative p-8 rounded-3xl border-2 transition-all bg-white"
                            style={{
                              borderColor: selected ? GOLD : "#e5e7eb",
                              boxShadow: selected 
                                ? `0 20px 60px ${GOLD}40` 
                                : "0 10px 30px rgba(0,0,0,0.08)"
                            }}
                          >
                            <div className="flex items-center gap-6">
                              <motion.div
                                className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ 
                                  backgroundColor: selected ? GOLD : "#f9fafb",
                                  boxShadow: selected ? `0 8px 24px ${GOLD}40` : "none"
                                }}
                              >
                                <Icon 
                                  className="w-10 h-10" 
                                  style={{ color: selected ? "white" : "#9ca3af" }}
                                />
                              </motion.div>
                              
                              <div className="text-left flex-1">
                                <h3 
                                  className="text-2xl font-bold mb-2" 
                                  style={{ color: GOLD }}
                                >
                                  {pkg.name}
                                </h3>
                                <p className="text-gray-600 text-base">
                                  {pkg.description}
                                </p>
                              </div>
                            </div>
                            
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: GOLD }}
                              >
                                <Check className="w-6 h-6 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Box Shape Selection */}
                {step === 2 && selectedPackage?.type === "box" && (
                  <motion.div
                    key="s2-shape"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: GOLD }}
                    >
                      Choose Box Shape
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 text-lg">
                      Select your preferred box design
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {boxShapes.map((shape, index) => {
                        const Icon = shape.icon;
                        const selected = selectedBoxShape?.id === shape.id;
                        
                        return (
                          <motion.button
                            key={shape.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedBoxShape(shape)}
                            className="group relative p-6 rounded-2xl border-2 transition-all bg-white"
                            style={{
                              borderColor: selected ? GOLD : "#e5e7eb",
                              boxShadow: selected 
                                ? `0 12px 40px ${GOLD}40` 
                                : "0 6px 20px rgba(0,0,0,0.06)"
                            }}
                          >
                            <motion.div
                              className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                              style={{ 
                                backgroundColor: selected ? GOLD : "#f9fafb",
                              }}
                            >
                              <Icon 
                                className="w-7 h-7" 
                                style={{ color: selected ? "white" : "#9ca3af" }}
                              />
                            </motion.div>
                            
                            <h3 
                              className="text-lg font-bold mb-1" 
                              style={{ color: GOLD }}
                            >
                              {shape.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {shape.description}
                            </p>
                            
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: GOLD }}
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 2 (Wrap): Size & Color - NO PRICES */}
                {step === 2 && selectedPackage?.type === "wrap" && (
                  <motion.div
                    key="s2-wrap"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: GOLD }}
                    >
                      Choose Size & Color
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 text-lg">
                      Select quantity and wrap color
                    </p>

                    {/* Wrap Color Picker */}
                    <motion.div className="mb-8">
                      <h3 className="text-xl font-bold text-center mb-4" style={{ color: GOLD }}>
                        Wrap Color
                      </h3>
                      <div className="flex justify-center gap-3 flex-wrap">
                        {wrapColors.map((wc, index) => (
                          <motion.button
                            key={wc.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedWrapColor(wc)}
                            className="relative w-14 h-14 rounded-full border-4 transition-all"
                            style={{
                              background: wc.gradient,
                              borderColor: selectedWrapColor?.id === wc.id ? GOLD : "#d1d5db",
                              boxShadow: selectedWrapColor?.id === wc.id 
                                ? `0 8px 24px ${GOLD}60` 
                                : wc.color === "#FFFFFF" 
                                  ? "inset 0 0 0 1px #e5e7eb, 0 4px 12px rgba(0,0,0,0.1)" 
                                  : "0 4px 12px rgba(0,0,0,0.2)"
                            }}
                          >
                            {selectedWrapColor?.id === wc.id && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full"
                              >
                                <Check className="w-6 h-6 text-white drop-shadow-lg" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                      {selectedWrapColor && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center mt-3 text-lg font-semibold" 
                          style={{ color: GOLD }}
                        >
                          {selectedWrapColor.name}
                        </motion.p>
                      )}
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      {wrapSizes.map((size, index) => {
                        const selected = selectedSize?.id === size.id;
                        
                        return (
                          <motion.button
                            key={size.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSize(size)}
                            className="group relative p-6 rounded-2xl border-2 transition-all bg-white"
                            style={{
                              borderColor: selected ? GOLD : "#e5e7eb",
                              boxShadow: selected 
                                ? `0 15px 40px ${GOLD}40` 
                                : "0 8px 20px rgba(0,0,0,0.08)"
                            }}
                          >
                            <div className="relative z-10 text-center">
                              <h3 className="text-xl font-bold mb-2" style={{ color: GOLD }}>
                                {size.name}
                              </h3>
                              {size.id !== "custom" ? (
                                <p className="text-base text-gray-700 font-semibold">
                                  {size.description}
                                </p>
                              ) : (
                                <input
                                  type="number"
                                  min="5"
                                  max="100"
                                  value={customQty}
                                  onChange={e => setCustomQty(Math.max(5, parseInt(e.target.value) || 5))}
                                  onClick={e => e.stopPropagation()}
                                  className="w-full mt-2 px-3 py-2 border-2 rounded-xl text-center font-bold"
                                  style={{ borderColor: GOLD, color: GOLD }}
                                  placeholder="Qty"
                                />
                              )}
                            </div>
                            
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: GOLD }}
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 3 (Box): Size Selection */}
                {step === 3 && selectedPackage?.type === "box" && (
                  <motion.div
                    key="s3-box-size"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: GOLD }}
                    >
                      Choose Box Size
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 text-lg">
                      How many flowers would you like?
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {boxSizes.map((size, index) => {
                        const selected = selectedSize?.id === size.id;
                        
                        return (
                          <motion.button
                            key={size.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSize(size)}
                            className="group relative p-6 rounded-2xl border-2 transition-all bg-white"
                            style={{
                              borderColor: selected ? GOLD : "#e5e7eb",
                              boxShadow: selected 
                                ? `0 15px 40px ${GOLD}40` 
                                : "0 8px 20px rgba(0,0,0,0.08)"
                            }}
                          >
                            <div className="relative z-10 text-center">
                              <h3 className="text-xl font-bold mb-2" style={{ color: GOLD }}>
                                {size.name}
                              </h3>
                              {size.id !== "custom" ? (
                                <p className="text-base text-gray-700 font-semibold">
                                  {size.description}
                                </p>
                              ) : (
                                <input
                                  type="number"
                                  min="5"
                                  max="100"
                                  value={customQty}
                                  onChange={e => setCustomQty(Math.max(5, parseInt(e.target.value) || 5))}
                                  onClick={e => e.stopPropagation()}
                                  className="w-full mt-2 px-3 py-2 border-2 rounded-xl text-center font-bold"
                                  style={{ borderColor: GOLD, color: GOLD }}
                                  placeholder="Qty"
                                />
                              )}
                            </div>
                            
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: GOLD }}
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Final Step: Flowers */}
                {((step === 3 && selectedPackage?.type === "wrap") || (step === 4 && selectedPackage?.type === "box")) && selectedSize && (
                  <motion.div
                    key="s-flowers"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="h-full overflow-y-auto"
                  >
                    <motion.h2 
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: GOLD }}
                    >
                      Choose Your Flowers
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-6 text-lg">
                      Select your beautiful blooms
                    </p>

                    {/* Progress Bar */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-2xl border-2"
                      style={{ 
                        borderColor: GOLD,
                        background: "linear-gradient(135deg, #ffffff 0%, #fffbf5 100%)",
                        boxShadow: `0 8px 32px ${GOLD}20`
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-800">
                          {totalFlowers} / {maxFlowers} flowers
                        </span>
                        <motion.span 
                          className="text-lg font-bold"
                          style={{ color: GOLD }}
                        >
                          +${flowerCost.toFixed(2)}
                        </motion.span>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${GOLD} 0%, #D4A85A 100%)`,
                          }}
                          animate={{ 
                            width: `${(totalFlowers / maxFlowers) * 100}%`,
                          }}
                          transition={{ type: "spring", stiffness: 100 }}
                        />
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {flowers.map((flower, index) => {
                        const count = flowerCounts[flower.id] || 0;
                        
                        return (
                          <motion.div
                            key={flower.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative p-3 rounded-xl border-2 bg-white"
                            style={{
                              borderColor: count > 0 ? GOLD : "#e5e7eb",
                              boxShadow: count > 0 
                                ? `0 8px 24px ${GOLD}30` 
                                : "0 4px 12px rgba(0,0,0,0.06)"
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="relative">
                                <img 
                                  src={flower.image} 
                                  alt={flower.name} 
                                  className="w-12 h-12 object-cover rounded-lg" 
                                />
                                {count > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-xs"
                                    style={{ backgroundColor: GOLD }}
                                  >
                                    {count}
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="text-sm font-bold" style={{ color: GOLD }}>
                                  {flower.name}
                                </h4>
                                <p className="text-xs font-semibold" style={{ color: GOLD }}>
                                  ${flower.price}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => adjustFlower(flower.id, -1)}
                                disabled={count === 0}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ backgroundColor: GOLD }}
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              
                              <span 
                                className="text-xl font-bold"
                                style={{ color: GOLD }}
                              >
                                {count}
                              </span>
                              
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => adjustFlower(flower.id, 1)}
                                disabled={totalFlowers >= maxFlowers}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ backgroundColor: GOLD }}
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Glitter Toggle */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-4 rounded-xl border-2 bg-white"
                      style={{ borderColor: GOLD }}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
                          <div>
                            <span className="font-bold text-gray-800">Add Glitter</span>
                            <p className="text-xs text-gray-600">Sparkly finishing touch</p>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWithGlitter(!withGlitter)}
                          className="relative w-12 h-7 rounded-full transition-colors"
                          style={{ backgroundColor: withGlitter ? GOLD : "#e5e7eb" }}
                        >
                          <motion.div
                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ left: withGlitter ? "24px" : "4px" }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </label>
                    </motion.div>

                    {/* Note */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-lg font-bold mb-2" style={{ color: GOLD }}>
                        💌 Personal Note
                      </label>
                      <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Your message..."
                        rows={2}
                        className="w-full px-3 py-2 border-2 rounded-xl resize-none focus:outline-none"
                        style={{ borderColor: GOLD }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: AI Preview */}
            <div className="lg:sticky lg:top-24 h-fit">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl border-2 bg-white"
                style={{
                  borderColor: GOLD,
                  boxShadow: `0 20px 60px ${GOLD}20`
                }}
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: GOLD }}>
                  <Wand2 className="w-6 h-6" />
                  AI Preview
                </h3>

                {generatedImage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img 
                      src={generatedImage} 
                      alt="AI Generated Bouquet" 
                      className="w-full h-80 object-cover rounded-2xl mb-4"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={generateBouquetImage}
                        disabled={isGenerating || totalFlowers === 0}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: GOLD }}
                      >
                        <RefreshCw className="w-5 h-5" />
                        Regenerate
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadImage}
                        className="px-4 py-3 rounded-xl font-semibold border-2 flex items-center justify-center"
                        style={{ borderColor: GOLD, color: GOLD }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 flex items-center justify-center border-2 border-dashed" style={{ borderColor: GOLD }}>
                      {isGenerating ? (
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 mx-auto mb-4"
                          >
                            <Wand2 className="w-full h-full" style={{ color: GOLD }} />
                          </motion.div>
                          <p className="text-lg font-semibold" style={{ color: GOLD }}>
                            Creating your bouquet...
                          </p>
                          <p className="text-sm text-gray-600 mt-2">This may take 10-20 seconds</p>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-2">
                            {totalFlowers === 0 
                              ? "Choose flowers to see AI preview"
                              : "Click below to generate your preview"}
                          </p>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={generateBouquetImage}
                      disabled={isGenerating || totalFlowers === 0}
                      className="w-full px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)`
                      }}
                    >
                      <Wand2 className="w-6 h-6" />
                      {isGenerating ? "Generating..." : "Generate AI Preview"}
                    </motion.button>
                  </div>
                )}

                {/* Summary */}
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-2xl"
                    style={{ backgroundColor: "#fffbf5" }}
                  >
                    <h4 className="font-bold mb-3" style={{ color: GOLD }}>Your Selection</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-semibold">{selectedPackage.name}</span>
                      </div>
                      {selectedBoxShape && (
                        <div className="flex justify-between">
                          <span>Shape:</span>
                          <span className="font-semibold">{selectedBoxShape.name}</span>
                        </div>
                      )}
                      {selectedSize && (
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-semibold">{selectedSize.name}</span>
                        </div>
                      )}
                      {selectedWrapColor && (
                        <div className="flex justify-between">
                          <span>Color:</span>
                          <span className="font-semibold">{selectedWrapColor.name}</span>
                        </div>
                      )}
                      {totalFlowers > 0 && (
                        <div className="flex justify-between">
                          <span>Flowers:</span>
                          <span className="font-semibold">{totalFlowers} stems</span>
                        </div>
                      )}
                      {withGlitter && (
                        <div className="flex justify-between">
                          <span>Glitter:</span>
                          <span className="font-semibold">✨ Yes</span>
                        </div>
                      )}
                      <div className="border-t-2 pt-2 mt-2 flex justify-between text-lg font-bold" style={{ borderColor: GOLD, color: GOLD }}>
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-center max-w-4xl mx-auto mt-12"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border-2 transition-all shadow-lg text-lg"
              style={{ borderColor: GOLD, color: GOLD, background: "white" }}
            >
              <ChevronLeft className="w-6 h-6" />
              Back
            </motion.button>

            {((step === 3 && selectedPackage?.type === "wrap") || (step === 4 && selectedPackage?.type === "box")) && totalFlowers > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3 text-white transition-all shadow-2xl text-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)`,
                  boxShadow: `0 8px 32px ${GOLD}60`
                }}
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart - ${totalPrice.toFixed(2)}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
