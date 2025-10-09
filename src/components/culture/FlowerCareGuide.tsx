import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    description: "Keep your flowers hydrated with clean, fresh water",
    icon: <Droplets className="w-5 h-5" />,
    tips: [
      "Use lukewarm water (70-80°F)",
      "Add flower food or 1 tsp sugar + 1 tsp bleach per quart",
      "Change water every 2-3 days",
      "Top off water daily"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  },
  {
    id: 2,
    title: "Trim",
    description: "Cut stems properly for maximum water absorption",
    icon: <Scissors className="w-5 h-5" />,
    tips: [
      "Cut stems at 45° angle under running water",
      "Use sharp, clean floral shears",
      "Remove leaves below waterline",
      "Trim 1-2 inches off stems with each water change"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  },
  {
    id: 3,
    title: "Place",
    description: "Find the perfect spot for your flowers to thrive",
    icon: <Sun className="w-5 h-5" />,
    tips: [
      "Keep away from direct sunlight",
      "Maintain room temperature 65-70°F",
      "Ensure good air circulation",
      "Avoid heat sources and drafts"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  },
  {
    id: 4,
    title: "Maintain",
    description: "Daily care keeps your flowers looking fresh",
    icon: <Heart className="w-5 h-5" />,
    tips: [
      "Remove wilted flowers immediately",
      "Gently mist petals (avoid fuzzy flowers)",
      "Rotate vase for even light exposure",
      "Clean vase between arrangements"
    ],
    color: "from-[#C79E48] to-[#D4A85A]"
  }
];

const FlowerCareGuide = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl animate-pulse" />
        <div className="absolute top-20 sm:top-40 right-4 sm:right-20 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-200/30 to-transparent rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-16 sm:bottom-32 left-1/6 sm:left-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Glassmorphism Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <h2 className="font-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Master Flower Care
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Simple steps to keep your flowers fresh and beautiful for longer
            </p>
          </div>
        </motion.div>

        {/* Glassmorphism Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16">
          {careSteps.map((step) => (
            <motion.button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-500 backdrop-blur-xl ${
                activeStep === step.id
                  ? 'border-white/40 bg-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.15)] scale-105'
                  : 'border-white/20 bg-white/15 hover:border-white/30 hover:bg-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: step.id * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Glass shimmer effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <div className="text-center relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm border transition-all duration-500 ${
                  activeStep === step.id 
                    ? `bg-gradient-to-r ${step.color} text-white border-white/30 shadow-lg` 
                    : 'bg-white/30 text-slate-600 border-white/20 backdrop-blur-xl'
                }`}>
                  {activeStep >= step.id ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" /> : step.icon}
                </div>
                <h3 className={`font-semibold mb-1 sm:mb-2 transition-colors duration-300 text-sm sm:text-base ${
                  activeStep === step.id ? 'text-slate-800' : 'text-slate-700'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs sm:text-sm transition-colors duration-300 leading-tight ${
                  activeStep === step.id ? 'text-slate-600' : 'text-slate-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Glassmorphism Active Step Content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 overflow-hidden"
        >
          {/* Glass background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl sm:rounded-3xl" />
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl" />
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center relative z-10">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-r ${careSteps[activeStep - 1].color} rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-lg border border-white/20 backdrop-blur-sm flex-shrink-0`}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center">
                    {careSteps[activeStep - 1].icon}
                  </div>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 flex-1">
                  <h3 className="font-luxury text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                    {careSteps[activeStep - 1].title}
                  </h3>
                  <p className="text-slate-600 text-base sm:text-lg">
                    {careSteps[activeStep - 1].description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h4 className="font-semibold text-slate-800 text-lg sm:text-xl mb-4 sm:mb-6">Step-by-Step Guide:</h4>
                {careSteps[activeStep - 1].tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 backdrop-blur-sm bg-white/15 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md border border-white/30">
                      <span className="text-white text-xs sm:text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-800 transition-colors duration-300 text-sm sm:text-base leading-relaxed">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center order-first lg:order-last">
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl sm:text-7xl lg:text-9xl mb-4 sm:mb-6 filter drop-shadow-lg"
                >
                  {activeStep === 1 ? '💧' : activeStep === 2 ? '✂️' : activeStep === 3 ? '🌞' : '💖'}
                </motion.div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Step {activeStep} of {careSteps.length}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Glassmorphism Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          {/* Glass overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl sm:rounded-3xl" />
          <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h3 className="font-luxury text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Quick Reference
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {careSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.08, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 group-hover:bg-white/15 transition-all duration-300">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${step.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:shadow-xl transition-all duration-300 border border-white/20`}>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <div className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">{step.title}</div>
                    <div className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-tight">{step.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FlowerCareGuide;