import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sun, Scissors, Heart, CheckCircle, ArrowRight } from 'lucide-react';

interface CareStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
  color: string;
}

const careSteps: CareStep[] = [
  {
    id: 1,
    title: "Water",
    description: "Keep hydrated",
    icon: <Droplets className="w-5 h-5" />,
    tips: [
      "Use lukewarm water (70-80°F)",
      "Add flower food or sugar + bleach",
      "Change water every 2-3 days",
      "Top off water daily"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  },
  {
    id: 2,
    title: "Trim",
    description: "Cut stems properly",
    icon: <Scissors className="w-5 h-5" />,
    tips: [
      "Cut stems at 45° angle",
      "Use sharp, clean floral shears",
      "Remove leaves below waterline",
      "Trim 1-2 inches with water change"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  },
  {
    id: 3,
    title: "Place",
    description: "Perfect spot",
    icon: <Sun className="w-5 h-5" />,
    tips: [
      "Keep away from direct sunlight",
      "Maintain room temp 65-70°F",
      "Ensure good air circulation",
      "Avoid heat sources and drafts"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  },
  {
    id: 4,
    title: "Maintain",
    description: "Daily care",
    icon: <Heart className="w-5 h-5" />,
    tips: [
      "Remove wilted flowers immediately",
      "Gently mist petals",
      "Rotate vase for even light",
      "Clean vase between arrangements"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  }
];

const FlowerCareGuide = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="py-10 px-4 bg-white relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-slate-200/30 to-transparent rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Modern Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/10 to-slate-700/10 backdrop-blur-xl border border-slate-600/20 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 tracking-wider uppercase">EXPERT GUIDANCE</span>
          </motion.div>

          <motion.h2 
            className="font-luxury text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative inline-block"
            style={{
              fontFamily: 'Playfair Display, serif',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            MASTER FLOWER CARE
            {/* Animated Gold Underline */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            />
          </motion.h2>

          {/* Decorative Elements */}
          <div className="relative mb-8 mt-2">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48]/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#C79E48] rotate-45 shadow-lg shadow-[#C79E48]/50" />
          </div>

          <p className="text-slate-600 max-w-2xl mx-auto text-lg sm:text-xl font-light leading-relaxed">
            Simple steps to keep your flowers fresh and beautiful for longer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left Side: Compact Navigation List */}
          <div className="space-y-3 h-full flex flex-col justify-center">
            {careSteps.map((step) => (
              <motion.div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative overflow-hidden group ${
                  activeStep === step.id 
                    ? 'bg-white border-[#C79E48] shadow-lg scale-[1.02]' 
                    : 'bg-white/40 border-transparent hover:bg-white/80 hover:shadow-md'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeStep === step.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C79E48]/5 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-transform duration-300 ${
                    activeStep === step.id ? 'scale-110' : 'scale-100'
                  } bg-gradient-to-r ${step.color}`}>
                    {activeStep === step.id ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base transition-colors duration-300 ${
                      activeStep === step.id ? 'text-[#C79E48]' : 'text-slate-700'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{step.description}</p>
                  </div>
                  {activeStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ArrowRight className="w-4 h-4 text-[#C79E48]" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Detailed Card */}
          <div className="relative min-h-[300px]">
             <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#E8D4A8] shadow-xl h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl filter drop-shadow-md">
                     {activeStep === 1 ? '💧' : activeStep === 2 ? '✂️' : activeStep === 3 ? '🌞' : '💖'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 font-luxury">
                      {careSteps[activeStep - 1].title} Guide
                    </h3>
                    <div className="h-1 w-12 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full mt-1" />
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {careSteps[activeStep - 1].tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-sm sm:text-base text-slate-700 bg-white/50 p-3 rounded-lg hover:bg-white transition-colors duration-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#C79E48]/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#C79E48] font-bold text-xs">
                        {index + 1}
                      </div>
                      {tip}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowerCareGuide;
