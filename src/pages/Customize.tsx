import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Gift, ShoppingCart, Check, Circle, Wand2, RefreshCw, Heart } from "lucide-react";
import UltraNavigation from "@/components/UltraNavigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import heroBouquetMain from "@/assets/bouquet-4.jpg";
import heroBouquetAccent from "@/assets/bouquet-5.jpg";
import { encodeImageUrl } from "@/lib/imageUtils";

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
  { id: "small-round", name: "Small Round", icon: Circle, description: "Small round shape" },
  { id: "circle", name: "Round", icon: Circle, description: "Classic round shape" },
  { id: "heart", name: "Heart", icon: Heart, description: "Romantic heart-shaped" }
];

const boxColors: BoxColor[] = [
  { id: "white", name: "White", color: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)" },
  { id: "black", name: "Black", color: "#1a1a1a", gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" },
  { id: "gold", name: "Gold", color: GOLD, gradient: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)` },
  { id: "pink", name: "Pink", color: "#FFB6C1", gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)" },
  { id: "blue", name: "Blue", color: "#87CEEB", gradient: "linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)" },
  { id: "red", name: "Red", color: "#DC143C", gradient: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)" }
];

const wrapColors: WrapColor[] = [
  { id: "white", name: "Pure White", color: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)" },
  { id: "cream", name: "Cream", color: "#FFF8DC", gradient: "linear-gradient(135deg, #FFF8DC 0%, #F5E6D3 100%)" },
  { id: "pink", name: "Blush Pink", color: "#FFB6C1", gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)" },
  { id: "gold", name: "Gold", color: GOLD, gradient: `linear-gradient(135deg, ${GOLD} 0%, #D4A85A 100%)` },
  { id: "sage", name: "Sage", color: "#9CAF88", gradient: "linear-gradient(135deg, #9CAF88 0%, #B5C99A 100%)" },
  { id: "lavender", name: "Lavender", color: "#E6E6FA", gradient: "linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)" }
];

// Accessories will be loaded from Supabase

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
    className={`relative group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-[1px] mb-4 sm:mb-6 md:mb-8 transition-all duration-500 ${isActive ? 'shadow-[0_35px_120px_rgba(0,0,0,0.08)]' : 'shadow-none'} ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    style={{
      border: '1px solid rgba(199, 158, 72, 0.15)',
      overflow: 'hidden'
    }}
  >
    <div className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border ${isActive ? 'border-white/40 bg-white' : 'border-transparent bg-white/70'} transition-all`}>
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? [0.2, 0.4, 0.2] : 0 }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          background: 'linear-gradient(135deg, rgba(199,158,72,0.08), rgba(255,255,255,0))'
        }}
      />
      <div className={`relative z-10 ${isActive ? '' : 'opacity-70'}`}>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-luxury font-bold mb-4 sm:mb-6 text-[#C79E48] border-b border-[#C79E48]/10 pb-3 sm:pb-4 flex items-center gap-2 sm:gap-3">
          {title}
          {!isActive && <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500 ml-auto" />}
        </h2>
        {children}
      </div>
    </div>
  </motion.div>
));

const Customize: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBoxShape, setSelectedBoxShape] = useState<BoxShape | null>(null);
  const [selectedBoxColor, setSelectedBoxColor] = useState<BoxColor | null>(null);
  const [selectedWrapColor, setSelectedWrapColor] = useState<WrapColor | null>(null);
  const [note, setNote] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [withGlitter, setWithGlitter] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
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
  };

  const handleWrapColorSelect = (color: WrapColor) => {
    setSelectedWrapColor(color);
  };

  // Calculate Price
  const totalPrice = selectedPackage?.price || 0;

  const steps = [
    { id: 'presentation', label: 'Presentation', detail: selectedPackage ? selectedPackage.name : 'Choose style', complete: !!selectedPackage },
    { id: 'details', label: selectedPackage?.type === 'box' ? 'Box Details' : 'Wrap Details', detail: selectedPackage?.type === 'box' ? (selectedBoxColor ? selectedBoxColor.name : 'Shape & color') : (selectedWrapColor ? selectedWrapColor.name : 'Wrap color'), complete: selectedPackage?.type === 'box' ? !!selectedBoxColor : !!selectedWrapColor },
    { id: 'preview', label: 'Preview', detail: generatedImage ? 'Ready' : 'Generate look', complete: !!generatedImage }
  ];

  const completedSteps = steps.filter(step => step.complete).length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);


  // --- AI Generation Logic ---
  const generateBouquetImage = async () => {
    setIsGenerating(true);
    try {
      // Packaging & Setting Description
      let packagingPrompt = "";
      let settingPrompt = "";
      
      if (selectedPackage?.type === "box") {
        const colorName = selectedBoxColor?.name || "black";
        
        packagingPrompt = `A ${colorName} ${selectedBoxShape?.name || "round"} box with the text "Bexy Flowers" written in gold letters on the front. The box has an elegant, luxurious appearance.`;
        settingPrompt = `The box sits on a light grey stone ledge outdoors. Sunlight creates soft highlights. Background is blurred green garden foliage.`;
      } else {
        const colorName = selectedWrapColor?.name || "white";
        packagingPrompt = `A beautiful bouquet wrapped in ${colorName} paper with "Bexy Flowers" printed on it. Elegant wrapping style.`;
        settingPrompt = `Indoors against a plain white background with soft studio lighting.`;
      }

      // Combined Prompt
      const fullPrompt = `Professional photography of ${packagingPrompt} ${settingPrompt} High resolution, photorealistic, 8k, sharp focus. ${aiRefinementText}`;

      // Use Pollinations AI
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${Date.now()}&model=flux`;
      
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        setGeneratedImage(URL.createObjectURL(blob));
        setGeneratedImageUrl(url);
        toast.success("Preview ready!", { closeButton: true });
      } else {
        throw new Error("Generation failed");
      }

    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Generation failed, please try again.", { closeButton: true });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    const packageDetails = selectedPackage?.type === "box" 
      ? `${selectedPackage.name} - ${selectedBoxShape?.name || ""} ${selectedBoxColor?.name || ""}`
      : `${selectedPackage?.name || ""} - ${selectedWrapColor?.name || ""}`;

    addToCart({
      id: `custom-${Date.now()}`,
      title: "Custom Box",
      price: totalPrice,
      image: generatedImageUrl || generatedImage || "/src/assets/bouquet-1.jpg",
      description: packageDetails,
      personalNote: note
    });
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
    toast.success("Added to cart!", { closeButton: true });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <UltraNavigation />

      {/* Ambient Gold Ribbons */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, idx) => (
          <motion.div
            key={`ribbon-${idx}`}
            initial={{ opacity: 0.2, rotate: 0, y: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.15], 
              rotate: idx % 2 === 0 ? [0, 5, -5, 0] : [0, -6, 6, 0],
              y: [-30, 20, -40]
            }}
            transition={{ duration: 18 + idx * 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[55vw] h-[55vw] bg-gradient-to-br from-[#c9a14e1f] via-[#f9efe3] to-transparent blur-3xl"
            style={{
              top: idx === 0 ? '-10%' : idx === 1 ? '30%' : '60%',
              left: idx === 0 ? '-15%' : idx === 1 ? '40%' : '65%'
            }}
          />
        ))}
      </div>
      
      {/* Floating Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <FloatingPetal key={i} delay={i * 2} />
        ))}
      </div>

      {/* Header */}
      <div className={`relative ${isMobile ? 'pt-20 sm:pt-24' : 'pt-24 sm:pt-28 md:pt-32'} pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden`}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={heroBouquetMain}
            alt="Customization hero background"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95" />

        <motion.div
          className="relative z-10 text-center px-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Luxury Typography with Gold Accent */}
          <motion.h1 
            className="font-luxury text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            Design Your Masterpiece
            {/* Animated Gold Underline */}
            <motion.div 
              className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 'clamp(120px, 30vw, 200px)' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            />
          </motion.h1>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-4 sm:mb-6">
            <div className="w-24 sm:w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48]/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#C79E48] rotate-45 shadow-lg shadow-[#C79E48]/50" />
          </div>

          <motion.p 
            className="font-body text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Customize every detail of your perfect bouquet, from the box and wrap to the last glittering petal.
          </motion.p>
        </motion.div>
      </div>

      {/* Animated Step Timeline */}
      <div className="relative z-10 -mt-4 sm:-mt-6 md:-mt-8 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6">
        <motion.div 
          className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md border border-[#C79E48]/15 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">Creative journey</p>
              <p className="text-lg sm:text-xl md:text-2xl font-luxury font-semibold text-slate-800">You're {progressPercent}% ready</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs sm:text-sm text-slate-500">Completed steps</p>
              <p className="text-base sm:text-lg font-semibold text-[#C79E48]">{completedSteps} / {steps.length}</p>
            </div>
          </div>

          <div className="relative mb-8">
            <div className="h-2 bg-slate-100 rounded-full" />
            <motion.div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-[#C79E48] via-[#d7b46d] to-[#f5d7a0] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ boxShadow: '0 4px 14px rgba(199, 158, 72, 0.35)' }}
            />
            <div className="absolute inset-0 flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="relative flex-1 flex justify-center">
                  <motion.span 
                    className={`w-4 h-4 rounded-full border-2 ${step.complete ? 'bg-[#C79E48] border-[#C79E48]' : 'bg-white border-slate-200'} transition-colors`}
                    animate={step.complete ? { scale: [1, 1.15, 1], boxShadow: ['0 0 0 rgba(199,158,72,0)', '0 0 12px rgba(199,158,72,0.45)', '0 0 0 rgba(199,158,72,0)'] } : {}}
                    transition={{ duration: 1.6, repeat: step.complete ? Infinity : 0 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Step Names Grid - Hidden on Mobile */}
          <div className={`grid md:grid-cols-6 gap-4 ${isMobile ? 'hidden' : ''}`}>
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                className={`rounded-2xl border p-4 text-center transition-all ${step.complete ? 'border-[#C79E48]/70 bg-[#fff8eb]' : 'border-slate-100 bg-white/70'}`}
                whileHover={{ y: -4 }}
              >
                <div className="text-sm uppercase tracking-wide text-slate-400 mb-1">Step {idx + 1}</div>
                <div className={`font-semibold ${step.complete ? 'text-[#C79E48]' : 'text-slate-600'}`}>{step.label}</div>
                <div className="text-xs text-slate-500 mt-2">{step.detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16 lg:pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Customization Steps */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 md:gap-8">
            
            {/* Step 1: Package */}
            <CustomizeSection title="1. Choose Presentation" isActive={true} ref={packageRef}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 sm:gap-4 hover:scale-[1.02] ${
                      selectedPackage?.id === pkg.id 
                        ? 'border-[#C79E48] bg-[#C79E48]/5 shadow-lg' 
                        : 'border-gray-100 hover:border-[#C79E48]/50'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${selectedPackage?.id === pkg.id ? 'bg-[#C79E48] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <pkg.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">{pkg.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{pkg.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CustomizeSection>

            {/* Step 2: Box Specifics */}
            {selectedPackage?.type === "box" && (
              <>
                <CustomizeSection title="2. Select Box Shape" isActive={!!selectedPackage} ref={shapeRef}>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                    {boxShapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => handleShapeSelect(shape)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 ${
                          selectedBoxShape?.id === shape.id ? 'border-[#C79E48] bg-[#C79E48]/5' : 'border-gray-100'
                        }`}
                      >
                        <div className={`p-1.5 sm:p-2 rounded-full ${selectedBoxShape?.id === shape.id ? 'bg-[#C79E48] text-white' : 'bg-gray-100'}`}>
                          <shape.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </CustomizeSection>

                <CustomizeSection title="3. Select Box Color" isActive={!!selectedBoxShape} ref={boxColorRef}>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {boxColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleBoxColorSelect(color)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 shadow-sm transition-transform hover:scale-110 ${selectedBoxColor?.id === color.id ? 'border-[#C79E48] ring-2 ring-[#C79E48] ring-offset-1 sm:ring-offset-2' : 'border-white'}`}
                        style={{ background: color.gradient }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  {selectedBoxColor && <p className="mt-3 sm:mt-4 text-[#C79E48] font-bold text-sm sm:text-base">{selectedBoxColor.name} Selected</p>}
                </CustomizeSection>

              </>
            )}

            {/* Step 2: Wrap Specifics */}
            {selectedPackage?.type === "wrap" && (
              <CustomizeSection title="2. Wrap Details" isActive={!!selectedPackage} ref={wrapRef}>
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="font-bold mb-3 sm:mb-4 text-gray-700 text-sm sm:text-base">Select Wrap Color</h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {wrapColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleWrapColorSelect(color)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 sm:border-4 shadow-sm transition-transform hover:scale-110 ${selectedWrapColor?.id === color.id ? 'border-[#C79E48] ring-2 ring-[#C79E48] ring-offset-1 sm:ring-offset-2' : 'border-white'}`}
                          style={{ background: color.gradient }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CustomizeSection>
            )}


          </div>

          {/* Right Column: Preview & Cart - Sticky */}
          <div className="lg:col-span-5 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-20 xl:top-24 flex flex-col gap-4 sm:gap-6">
              
              {/* AI Preview Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl border border-[#C79E48]/20">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-luxury font-bold text-[#C79E48]">Your Design</h3>
                  <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79E48]" />
                </div>

                <div className="aspect-square rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-50 mb-3 sm:mb-4 md:mb-6 overflow-hidden relative group">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setGeneratedImage(null)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-8">
                      <Wand2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Complete your selection to generate an AI preview of your bouquet.
                      </p>
                    </div>
                  )}
                  
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-[#C79E48] animate-spin mb-3 sm:mb-4" />
                      <p className="font-bold text-[#C79E48] text-sm sm:text-base">Generating Magic...</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={generateBouquetImage}
                  disabled={isGenerating || !selectedPackage || (selectedPackage?.type === 'box' ? !selectedBoxColor : !selectedWrapColor)}
                  className="w-full py-2.5 sm:py-3 md:py-4 bg-[#C79E48] text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:bg-[#b08d45] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base touch-target min-h-[44px]"
                >
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  {generatedImage ? "Regenerate Preview" : "Generate Preview"}
                </button>

                {/* Summary & Total */}
                <div className="border-t border-gray-100 pt-3 sm:pt-4 md:pt-6 flex flex-col gap-2 sm:gap-3">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Price</span>
                    <span>${selectedPackage?.price || 0}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg sm:text-xl md:text-2xl font-bold text-[#C79E48] pt-3 sm:pt-4 border-t border-dashed border-[#C79E48]/20">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedPackage || (selectedPackage?.type === 'box' ? !selectedBoxColor : !selectedWrapColor)}
                  className="w-full mt-3 sm:mt-4 md:mt-6 py-2.5 sm:py-3 md:py-4 bg-black text-white font-bold rounded-lg sm:rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base touch-target min-h-[44px]"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
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
