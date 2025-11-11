import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, ChevronLeft, ShoppingCart, Plus, Minus, Check, Sparkles, Heart, Star, Square, Circle, Triangle, Wand2, RefreshCw, Download, MessageCircle, Eye, Crown, Candy, CreditCard } from "lucide-react";
import UltraNavigation from "@/components/UltraNavigation";
import Footer from "@/components/Footer";
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

const Customize: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBoxShape, setSelectedBoxShape] = useState<BoxShape | null>(null);
  const [selectedBoxColor, setSelectedBoxColor] = useState<BoxColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedWrapColor, setSelectedWrapColor] = useState<WrapColor | null>(null);
  const [customQty, setCustomQty] = useState(25);
  const [flowerCounts, setFlowerCounts] = useState<Record<string, number>>({});
  const [flowerColors, setFlowerColors] = useState<Record<string, string>>({});
  // NEW: Track individual color quantities for each flower type
  const [colorQuantities, setColorQuantities] = useState<Record<string, Record<string, number>>>({});
  const [note, setNote] = useState("");
  const [showPrices, setShowPrices] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [withGlitter, setWithGlitter] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiRefinementText, setAiRefinementText] = useState("");
  const [showRefinement, setShowRefinement] = useState(false);
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

  // Auto-advance when box color is selected
  useEffect(() => {
    if (selectedBoxColor && step === 3 && selectedPackage?.type === "box") {
      setTimeout(() => setStep(4), 600);
    }
  }, [selectedBoxColor, step, selectedPackage]);

  // Auto-advance when size is selected (for wrap with color)
  useEffect(() => {
    if (selectedSize && step === 2 && selectedPackage?.type === "wrap" && selectedWrapColor) {
      setTimeout(() => setStep(3), 600);
    }
  }, [selectedSize, selectedWrapColor, step, selectedPackage]);

  // Auto-advance when size is selected for box (step 4 -> 5)
  useEffect(() => {
    if (selectedSize && step === 4 && selectedPackage?.type === "box") {
      setTimeout(() => setStep(5), 600);
    }
  }, [selectedSize, step, selectedPackage]);

  // Calculate total flowers from colorQuantities (supports multiple colors per flower type)
  const totalFlowers = Object.values(colorQuantities).reduce((total, colorMap) => {
    return total + Object.values(colorMap).reduce((a, b) => a + b, 0);
  }, 0);
  const maxFlowers = selectedSize?.id === "custom" ? customQty : selectedSize?.capacity || 0;
  
  // Calculate flower cost from colorQuantities
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

  // NEW: Adjust flower with specific color
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

  // AI Image Generation Function with Multiple Reliable Fallbacks
  const generateBouquetImage = async () => {
    setIsGenerating(true);
    
    try {
      // Build ULTRA PRECISE prompt with NUMBERED flower list and multiple verifications
      const flowerDetailsList: string[] = [];
      let flowerNumber = 1;
      
      Object.entries(colorQuantities).forEach(([flowerId, colors]) => {
        const flower = flowers.find(f => f.id === flowerId);
        Object.entries(colors).forEach(([colorId, count]) => {
          const colorObj = flower?.colors.find(c => c.id === colorId);
          const colorName = colorObj?.name || "";
          for (let i = 0; i < count; i++) {
            flowerDetailsList.push(`Flower #${flowerNumber}: ${colorName} ${flower?.name} with stem and leaves`);
            flowerNumber++;
          }
        });
      });

      const totalCount = totalFlowers;
      const numberedFlowerList = flowerDetailsList.join(", ");
      
      // Summary for AI
      const flowerSummary = Object.entries(colorQuantities)
        .map(([flowerId, colors]) => {
          const flower = flowers.find(f => f.id === flowerId);
          return Object.entries(colors)
            .map(([colorId, count]) => {
              const colorObj = flower?.colors.find(c => c.id === colorId);
              return `${count} ${colorObj?.name} ${flower?.name}`;
            })
            .join(" + ");
        })
        .join(" + ");

      // Glitter ONLY on flower petals
      const glitterDesc = withGlitter ? ". ADD delicate sparkly glitter ONLY on flower petals (NOT on background, box, or accessories)" : "";
      
      // BRANDING: Add "Bexy Flowers" LOGO to packaging - must look professional and real
      const boxDesc = selectedPackage?.type === "box" 
        ? `arranged in a ${selectedBoxColor?.name || ""} ${selectedBoxShape?.name}-shaped luxury gift box with a professional "Bexy Flowers" logo prominently displayed on the front of the box (gold/elegant font style with flower icon), box clearly visible`
        : `hand-wrapped in ${selectedWrapColor?.name} colored decorative wrapping paper with "Bexy Flowers" branding printed on the paper, the ${selectedWrapColor?.name} wrapping paper CLEARLY VISIBLE wrapping around the flower stems at the bottom of the bouquet, tied with elegant silk ribbon bow, gift wrap MUST be visible in the image`;

      // Accessories
      const accessoriesDesc = selectedAccessories.length > 0
        ? ". INCLUDE: " + selectedAccessories.map(accId => {
            if (accId === "crown") return "one small golden crown on top";
            if (accId === "teddy") return "one small teddy bear beside flowers";
            if (accId === "chocolates") return "one small chocolate box nearby";
            if (accId === "card") return "one greeting card visible";
            return "";
          }).filter(Boolean).join(", ")
        : "";

      // User refinement text (if provided after first generation)
      const refinementInstructions = aiRefinementText.trim() 
        ? `\n\nUSER REFINEMENT REQUEST: ${aiRefinementText}`
        : "";

      // SIMPLE, NATURAL PROMPT - like talking to a person!
      const simpleFlowerList = Object.entries(colorQuantities)
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

      const packagingDesc = selectedPackage?.type === "box"
        ? `in a ${selectedBoxColor?.name} ${selectedBoxShape?.name}-shaped gift box with "Bexy Flowers" logo on it`
        : `wrapped in ${selectedWrapColor?.name} wrapping paper with "Bexy Flowers" printed on it`;

      const extrasDesc = selectedAccessories.length > 0
        ? `, with ` + selectedAccessories.map(accId => {
            if (accId === "crown") return "a crown on top";
            if (accId === "teddy") return "a teddy bear";
            if (accId === "chocolates") return "a box of chocolates";
            if (accId === "card") return "a greeting card";
            return "";
          }).filter(Boolean).join(" and ")
        : "";

      const glitterNote = withGlitter ? ". Add sparkly glitter on the flower petals." : "";

      const prompt = `Create a beautiful flower bouquet with ${simpleFlowerList}, ${packagingDesc}${extrasDesc}${glitterNote} Professional product photo with white background, clear and sharp focus${refinementInstructions ? `. ${aiRefinementText}` : ""}.`;
      
      const negativePrompt = `ugly, blurry, low quality, wilted flowers, messy, dark background, poor lighting`;

      // Method 1: Pollinations.ai - Super stable
      try {
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&enhance=true&seed=${Date.now()}`;
        
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

      // Method 2: Hugging Face Stable Diffusion XL
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
                negative_prompt: negativePrompt,
                num_inference_steps: 40,
                guidance_scale: 12.0,
                width: 1024,
                height: 1024,
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

      // Final fallback - keep it simple!
      const finalFlowerList = Object.entries(colorQuantities)
        .flatMap(([flowerId, colors]) => {
          const flower = flowers.find(f => f.id === flowerId);
          return Object.entries(colors)
            .filter(([_, count]) => count > 0)
            .map(([colorId, count]) => {
              const colorObj = flower?.colors.find(c => c.id === colorId);
              return `${count} ${colorObj?.name} ${flower?.name}`;
            });
        })
        .join(", ");
      
      const finalPackaging = selectedPackage?.type === "box" 
        ? `${selectedBoxColor?.name || ""} gift box`
        : `${selectedWrapColor?.name} wrapping paper`;
      
      const finalSimplePrompt = `Beautiful bouquet with ${finalFlowerList} in ${finalPackaging}, professional photo, white background`;
      const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalSimplePrompt)}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
      
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

      throw new Error("All services temporarily unavailable");
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Please try again in a moment! 🌸", {
        description: "Our AI is taking a short break. Click 'Generate' again!",
        duration: 5000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewClick = () => {
    if (totalFlowers === 0) {
      toast.error("Please add some flowers first!");
      return;
    }
    setShowPreview(true);
  };

  const handleAddToCart = () => {
    // NEW: Build detailed flower list from colorQuantities
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
      .filter(Boolean)
      .join(", ");

    const shapeInfo = selectedBoxShape ? ` - ${selectedBoxShape.name} ${selectedBoxColor?.name || ""} Box` : "";
    const accessoriesInfo = selectedAccessories.length > 0
      ? ` - Accessories: ${selectedAccessories.map(id => accessories.find(a => a.id === id)?.name).join(", ")}`
      : "";

    addToCart({
      id: `custom-${Date.now()}`,
      title: "Custom Bouquet",
      price: totalPrice,
      image: generatedImage || "/src/assets/bouquet-1.jpg",
      description: `${selectedPackage?.name}${shapeInfo} - ${selectedSize?.name} - ${flowerList}${accessoriesInfo}${withGlitter ? " with glitter on petals" : ""}`,
      personalNote: note || undefined
    });

    toast.success("🎉 Added to cart!", { 
      description: `Your beautiful bouquet: $${totalPrice.toFixed(2)}`,
      duration: 4000
    });
    
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
    setShowPreview(false);
  };

  const handleWhatsAppShare = () => {
    // NEW: Build flower list from colorQuantities
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
      .filter(Boolean)
      .join(", ");

    const accessoriesList = selectedAccessories.length > 0
      ? `\nAccessories: ${selectedAccessories.map(id => accessories.find(a => a.id === id)?.name).join(", ")}`
      : "";

    const message = `Hi! I'd like to order a custom bouquet:\n\n${selectedPackage?.name}${selectedBoxShape ? ` - ${selectedBoxShape.name} ${selectedBoxColor?.name || ""} Box` : ""}\nSize: ${selectedSize?.name}\nFlowers: ${flowerList}${accessoriesList}${withGlitter ? "\nGlitter on Flower Petals ✨" : ""}${note ? `\n\nNote: ${note}` : ""}\n\nTotal: $${totalPrice.toFixed(2)}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success("Opening WhatsApp...", { icon: "💬" });
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedPackage(null);
      setSelectedBoxShape(null);
      setSelectedBoxColor(null);
      setSelectedSize(null);
      setSelectedWrapColor(null);
    } else if (step === 3) {
      if (selectedPackage?.type === "box") {
        setSelectedBoxShape(null);
        setSelectedBoxColor(null);
        setSelectedSize(null);
      } else {
        setSelectedSize(null);
        setSelectedWrapColor(null);
      }
    } else if (step === 4) {
      if (selectedPackage?.type === "box") {
        setSelectedBoxColor(null);
        setSelectedSize(null);
      }
    } else if (step === 5) {
      setSelectedSize(null);
    }
    setStep(s => Math.max(1, s - 1));
    setShowPrices(false);
  };

  const getTotalSteps = () => {
    return selectedPackage?.type === "box" ? 5 : 3;
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

  const finalStep = (selectedPackage?.type === "wrap" && step === 3) || (selectedPackage?.type === "box" && step === 5);

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

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: GOLD }}>
                Review Your Bouquet
              </h2>

              {generatedImage && (
                <div className="mb-6">
                  <img 
                    src={generatedImage} 
                    alt="Your Custom Bouquet" 
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              )}

              <div className="space-y-3 mb-6 p-6 rounded-2xl" style={{ backgroundColor: "#fffbf5" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: GOLD }}>Order Summary</h3>
                {selectedPackage && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Package:</span>
                    <span>{selectedPackage.name} (+${selectedPackage.price})</span>
                  </div>
                )}
                {selectedBoxShape && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Shape:</span>
                    <span>{selectedBoxShape.name}</span>
                  </div>
                )}
                {selectedBoxColor && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Box Color:</span>
                    <span>{selectedBoxColor.name}</span>
                  </div>
                )}
                {selectedWrapColor && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Wrap Color:</span>
                    <span>{selectedWrapColor.name}</span>
                  </div>
                )}
                {selectedSize && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Size:</span>
                    <span>{selectedSize.name} {selectedSize.id !== "custom" && `($${selectedSize.price})`}</span>
                  </div>
                )}
                <div className="border-t-2 pt-3 mt-3" style={{ borderColor: GOLD }}>
                  <p className="font-semibold mb-2">Flowers:</p>
                  {Object.entries(colorQuantities).flatMap(([flowerId, colors]) => {
                    const flower = flowers.find(f => f.id === flowerId);
                    return Object.entries(colors)
                      .filter(([_, count]) => count > 0)
                      .map(([colorId, count]) => {
                        const colorObj = flower?.colors.find(c => c.id === colorId);
                        return (
                          <div key={`${flowerId}-${colorId}`} className="flex justify-between text-sm ml-4">
                            <span>{count}x {colorObj?.name} {flower?.name}</span>
                            <span>${(flower?.price || 0) * count}</span>
                          </div>
                        );
                      });
                  })}
                </div>
                {selectedAccessories.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Accessories:</p>
                    <div className="ml-4 space-y-1">
                      {selectedAccessories.map(accId => {
                        const acc = accessories.find(a => a.id === accId);
                        return (
                          <div key={accId} className="flex justify-between text-sm">
                            <span>{acc?.name}</span>
                            <span>${acc?.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {withGlitter && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Glitter:</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
                      On Flower Petals
                    </span>
                  </div>
                )}
                {note && (
                  <div>
                    <p className="font-semibold mb-1">Personal Note:</p>
                    <p className="text-sm text-gray-700 italic">"{note}"</p>
                  </div>
                )}
                <div className="border-t-2 pt-3 mt-3 flex justify-between text-2xl font-bold" style={{ borderColor: GOLD, color: GOLD }}>
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="w-full px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg text-lg"
                  style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)` }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppShare}
                  className="w-full px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg text-lg bg-green-500 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  Contact via WhatsApp
                </motion.button>

                {generatedImage && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={downloadImage}
                    className="w-full px-6 py-4 rounded-xl font-bold border-2 flex items-center justify-center gap-3 text-lg"
                    style={{ borderColor: GOLD, color: GOLD }}
                  >
                    <Download className="w-6 h-6" />
                    Download Image
                  </motion.button>
                )}

                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full px-6 py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
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
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full backdrop-blur-xl border-2 shadow-xl"
            style={{ borderColor: GOLD, background: "rgba(255, 255, 255, 0.7)" }}
          >
            <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: GOLD }}>
              AI-POWERED DESIGN STUDIO
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            style={{ color: GOLD, textShadow: `0 2px 20px ${GOLD}40` }}
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
          <div className="flex justify-center items-center gap-4 mt-12 flex-wrap">
            {[...Array(getTotalSteps())].map((_, index) => {
              const num = index + 1;
              const active = step >= num;
              const current = step === num;
              
              return (
                <motion.div key={num} className="flex items-center gap-3">
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
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ border: `2px solid ${GOLD}` }}
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  {num < getTotalSteps() && (
                    <motion.div
                      className="w-8 h-1 rounded-full hidden sm:block"
                      style={{ backgroundColor: step > num ? GOLD : "#e5e7eb" }}
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
                {/* Step 1: Package */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 className="text-4xl font-bold text-center mb-4" style={{ color: GOLD }}>
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
                              boxShadow: selected ? `0 20px 60px ${GOLD}40` : "0 10px 30px rgba(0,0,0,0.08)"
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
                                <Icon className="w-10 h-10" style={{ color: selected ? "white" : "#9ca3af" }} />
                              </motion.div>
                              
                              <div className="text-left flex-1">
                                <h3 className="text-2xl font-bold mb-2" style={{ color: GOLD }}>{pkg.name}</h3>
                                <p className="text-gray-600 text-base">{pkg.description}</p>
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

                {/* Step 2: Box Shape */}
                {step === 2 && selectedPackage?.type === "box" && (
                  <motion.div
                    key="s2-shape"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 className="text-4xl font-bold text-center mb-4" style={{ color: GOLD }}>
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
                              boxShadow: selected ? `0 12px 40px ${GOLD}40` : "0 6px 20px rgba(0,0,0,0.06)"
                            }}
                          >
                            <motion.div
                              className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: selected ? GOLD : "#f9fafb" }}
                            >
                              <Icon className="w-7 h-7" style={{ color: selected ? "white" : "#9ca3af" }} />
                            </motion.div>
                            
                            <h3 className="text-lg font-bold mb-1" style={{ color: GOLD }}>{shape.name}</h3>
                            <p className="text-gray-600 text-sm">{shape.description}</p>
                            
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

                {/* Step 3: Box Color */}
                {step === 3 && selectedPackage?.type === "box" && (
                  <motion.div
                    key="s3-box-color"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 className="text-4xl font-bold text-center mb-4" style={{ color: GOLD }}>
                      Choose Box Color
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 text-lg">
                      Select your box color
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap mb-8">
                      {boxColors.map((boxColor, index) => (
                        <motion.button
                          key={boxColor.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedBoxColor(boxColor)}
                          className="relative w-16 h-16 rounded-full border-4 transition-all"
                          style={{
                            background: boxColor.gradient,
                            borderColor: selectedBoxColor?.id === boxColor.id ? GOLD : "#d1d5db",
                            boxShadow: selectedBoxColor?.id === boxColor.id 
                              ? `0 8px 24px ${GOLD}60` 
                              : boxColor.color === "#FFFFFF" 
                                ? "inset 0 0 0 1px #e5e7eb, 0 4px 12px rgba(0,0,0,0.1)" 
                                : "0 4px 12px rgba(0,0,0,0.2)"
                          }}
                        >
                          {selectedBoxColor?.id === boxColor.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full"
                            >
                              <Check className="w-7 h-7 text-white drop-shadow-lg" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    {selectedBoxColor && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-xl font-semibold" 
                        style={{ color: GOLD }}
                      >
                        {selectedBoxColor.name} Box
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Step 2 (Wrap): Size & Color */}
                {step === 2 && selectedPackage?.type === "wrap" && (
                  <motion.div
                    key="s2-wrap"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 className="text-4xl font-bold text-center mb-4" style={{ color: GOLD }}>
                      Choose Size & Color
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 text-lg">
                      Select quantity and wrap color
                    </p>

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
                              boxShadow: selected ? `0 15px 40px ${GOLD}40` : "0 8px 20px rgba(0,0,0,0.08)"
                            }}
                          >
                            <div className="relative z-10 text-center">
                              <h3 className="text-xl font-bold mb-2" style={{ color: GOLD }}>{size.name}</h3>
                              {size.id !== "custom" ? (
                                <p className="text-base text-gray-700 font-semibold">{size.description}</p>
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

                {/* Step 4 (Box): Size Selection */}
                {step === 4 && selectedPackage?.type === "box" && (
                  <motion.div
                    key="s4-box-size"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h2 className="text-4xl font-bold text-center mb-4" style={{ color: GOLD }}>
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
                              boxShadow: selected ? `0 15px 40px ${GOLD}40` : "0 8px 20px rgba(0,0,0,0.08)"
                            }}
                          >
                            <div className="relative z-10 text-center">
                              <h3 className="text-xl font-bold mb-2" style={{ color: GOLD }}>{size.name}</h3>
                              {size.id !== "custom" ? (
                                <p className="text-base text-gray-700 font-semibold">{size.description}</p>
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
                {finalStep && selectedSize && (
                  <motion.div
                    key="s-flowers"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="h-full overflow-y-auto"
                  >
                    <motion.h2 className="text-4xl font-bold text-center mb-4" style={{ color: GOLD }}>
                      Choose Your Flowers
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-6 text-lg">
                      Select flowers and their colors
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

                    <div className="space-y-4 mb-6">
                      {flowers.map((flower, index) => {
                        // NEW: Get total count across all colors for this flower type
                        const flowerColorMap = colorQuantities[flower.id] || {};
                        const totalCount = Object.values(flowerColorMap).reduce((a, b) => a + b, 0);
                        
                        return (
                          <motion.div
                            key={flower.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative p-4 rounded-xl border-2 bg-white"
                            style={{
                              borderColor: totalCount > 0 ? GOLD : "#e5e7eb",
                              boxShadow: totalCount > 0 ? `0 8px 24px ${GOLD}30` : "0 4px 12px rgba(0,0,0,0.06)"
                            }}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative">
                                <img 
                                  src={flower.image} 
                                  alt={flower.name} 
                                  className="w-16 h-16 object-cover rounded-lg" 
                                />
                                {totalCount > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs"
                                    style={{ backgroundColor: GOLD }}
                                  >
                                    {totalCount}
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="text-lg font-bold mb-1" style={{ color: GOLD }}>
                                  {flower.name}
                                </h4>
                                <p className="text-sm font-semibold" style={{ color: GOLD }}>
                                  ${flower.price} each
                                </p>
                              </div>
                            </div>

                            {/* NEW: Multiple Colors Support - Each color gets its own counter */}
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-gray-700 mb-2">
                                🎨 Select Colors & Quantities:
                              </p>
                              {flower.colors.map(color => {
                                const colorCount = flowerColorMap[color.id] || 0;
                                
                                return (
                                  <div 
                                    key={color.id}
                                    className="flex items-center justify-between p-2 rounded-lg transition-all"
                                    style={{
                                      backgroundColor: colorCount > 0 ? `${GOLD}10` : "#f9fafb",
                                      border: `1px solid ${colorCount > 0 ? GOLD : "#e5e7eb"}`
                                    }}
                                  >
                                    <span className="text-sm font-semibold text-gray-700">
                                      {color.name}
                                    </span>
                                    
                                    <div className="flex items-center gap-2">
                                      <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => adjustFlowerColor(flower.id, color.id, -1)}
                                        disabled={colorCount === 0}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: GOLD }}
                                      >
                                        <Minus className="w-3 h-3" />
                                      </motion.button>
                                      
                                      <input
                                        type="number"
                                        min="0"
                                        max={maxFlowers}
                                        value={colorCount}
                                        onChange={(e) => {
                                          const newValue = parseInt(e.target.value) || 0;
                                          const currentTotal = totalFlowers - colorCount;
                                          const maxAllowed = maxFlowers - currentTotal;
                                          const finalValue = Math.min(Math.max(0, newValue), maxAllowed);
                                          
                                          // Set the new value
                                          setColorQuantities(prev => {
                                            if (finalValue === 0) {
                                              const flowerColors = prev[flower.id] || {};
                                              const { [color.id]: removed, ...rest } = flowerColors;
                                              if (Object.keys(rest).length === 0) {
                                                const { [flower.id]: removedFlower, ...restFlowers } = prev;
                                                return restFlowers;
                                              }
                                              return { ...prev, [flower.id]: rest };
                                            }
                                            
                                            return {
                                              ...prev,
                                              [flower.id]: {
                                                ...(prev[flower.id] || {}),
                                                [color.id]: finalValue
                                              }
                                            };
                                          });
                                        }}
                                        className="w-14 h-8 text-center text-lg font-bold rounded-lg border-2 focus:outline-none"
                                        style={{
                                          color: colorCount > 0 ? GOLD : "#9ca3af",
                                          borderColor: colorCount > 0 ? GOLD : "#e5e7eb"
                                        }}
                                      />
                                      
                                      <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => adjustFlowerColor(flower.id, color.id, 1)}
                                        disabled={totalFlowers >= maxFlowers}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: GOLD }}
                                      >
                                        <Plus className="w-3 h-3" />
                                      </motion.button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Total for this flower type */}
                            {totalCount > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 pt-3 border-t-2 flex justify-between items-center"
                                style={{ borderColor: GOLD }}
                              >
                                <span className="text-sm font-bold" style={{ color: GOLD }}>
                                  Total {flower.name}:
                                </span>
                                <span className="text-lg font-bold" style={{ color: GOLD }}>
                                  {totalCount} × ${flower.price} = ${(totalCount * flower.price).toFixed(2)}
                                </span>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Accessories Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <h3 className="text-xl font-bold mb-4" style={{ color: GOLD }}>
                        🎁 Add Accessories (Optional)
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {accessories.map((accessory, index) => {
                          const Icon = accessory.icon;
                          const isSelected = selectedAccessories.includes(accessory.id);
                          
                          return (
                            <motion.button
                              key={accessory.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleAccessory(accessory.id)}
                              className="p-4 rounded-xl border-2 transition-all bg-white"
                              style={{
                                borderColor: isSelected ? GOLD : "#e5e7eb",
                                boxShadow: isSelected ? `0 4px 16px ${GOLD}30` : "none"
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: isSelected ? GOLD : "#f3f4f6" }}
                                >
                                  <Icon className="w-5 h-5" style={{ color: isSelected ? "white" : "#9ca3af" }} />
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-bold" style={{ color: GOLD }}>
                                    {accessory.name}
                                  </p>
                                  <p className="text-xs text-gray-600">+${accessory.price}</p>
                                </div>
                                {isSelected && (
                                  <Check className="w-5 h-5" style={{ color: GOLD }} />
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>

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
                            <span className="font-bold text-gray-800">Add Glitter on Flower Petals</span>
                            <p className="text-xs text-gray-600">Delicate sparkles on flowers only</p>
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
                    
                    {/* AI REFINEMENT TEXT BOX - Super powerful! */}
                    {showRefinement && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4 p-4 rounded-xl border-2"
                        style={{ borderColor: GOLD, background: "#fffbf5" }}
                      >
                        <label className="block text-sm font-bold mb-2" style={{ color: GOLD }}>
                          ✨ Refine Your Image (AI will adjust):
                        </label>
                        <textarea
                          value={aiRefinementText}
                          onChange={e => setAiRefinementText(e.target.value)}
                          placeholder="Examples:
• 'Recount - I need EXACTLY 5 separate flower stems visible'
• 'Make Bexy Flowers logo bigger and more visible on box'
• 'Space out flowers more so I can count each one'
• 'Make the crown accessory larger'
• 'Show each flower stem clearly'"
                          rows={4}
                          className="w-full px-3 py-2 border-2 rounded-lg resize-none focus:outline-none text-sm"
                          style={{ borderColor: GOLD }}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          💡 <strong>Be specific!</strong> Tell the AI exactly what to fix or adjust. It will regenerate with your instructions.
                        </p>
                      </motion.div>
                    )}
                    
                    <div className="flex gap-2 mb-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={generateBouquetImage}
                        disabled={isGenerating || totalFlowers === 0}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: GOLD }}
                      >
                        <RefreshCw className="w-5 h-5" />
                        {aiRefinementText ? "Apply Refinements" : "Regenerate"}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePreviewClick}
                        className="px-4 py-3 rounded-xl font-semibold border-2 flex items-center justify-center"
                        style={{ borderColor: GOLD, color: GOLD }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowRefinement(!showRefinement)}
                      className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                      style={{ 
                        backgroundColor: showRefinement ? `${GOLD}20` : "#f3f4f6",
                        color: GOLD 
                      }}
                    >
                      {showRefinement ? "Hide" : "Show"} AI Refinement Box
                    </motion.button>
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
                    
                    {totalFlowers > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 p-3 rounded-lg border-2"
                        style={{ borderColor: GOLD, background: "#fffbf5" }}
                      >
                        <p className="text-xs text-gray-700 text-center">
                          <strong style={{ color: GOLD }}>🎯 Ultra-Precise AI:</strong> Generates exactly {totalFlowers} flower{totalFlowers !== 1 ? 's' : ''} with Bexy Flowers branding
                        </p>
                      </motion.div>
                    )}
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
                      {selectedBoxColor && (
                        <div className="flex justify-between">
                          <span>Box Color:</span>
                          <span className="font-semibold">{selectedBoxColor.name}</span>
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
                      {selectedAccessories.length > 0 && (
                        <div className="flex justify-between">
                          <span>Accessories:</span>
                          <span className="font-semibold">{selectedAccessories.length} items</span>
                        </div>
                      )}
                      {withGlitter && (
                        <div className="flex justify-between">
                          <span>Glitter:</span>
                          <span className="font-semibold">✨ On Petals</span>
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

            {finalStep && totalFlowers > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviewClick}
                className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3 text-white transition-all shadow-2xl text-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)`,
                  boxShadow: `0 8px 32px ${GOLD}60`
                }}
              >
                <Eye className="w-6 h-6" />
                Review & Order - ${totalPrice.toFixed(2)}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Customize;
