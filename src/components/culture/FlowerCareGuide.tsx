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
    color: "from-blue-400 to-blue-600"
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
    color: "from-green-400 to-green-600"
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
    color: "from-yellow-400 to-yellow-600"
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
    color: "from-pink-400 to-pink-600"
  }
];

const FlowerCareGuide = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Simple Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-luxury text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Master Flower Care
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple steps to keep your flowers fresh and beautiful for longer
          </p>
        </motion.div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {careSteps.map((step) => (
            <motion.button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                activeStep === step.id
                  ? 'border-amber-400 bg-amber-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-25'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  activeStep === step.id 
                    ? `bg-gradient-to-r ${step.color} text-white` 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {activeStep >= step.id ? <CheckCircle className="w-6 h-6" /> : step.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active Step Content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${careSteps[activeStep - 1].color} rounded-2xl flex items-center justify-center text-white`}>
                  {careSteps[activeStep - 1].icon}
                </div>
                <div>
                  <h3 className="font-luxury text-2xl font-bold text-slate-800">
                    {careSteps[activeStep - 1].title}
                  </h3>
                  <p className="text-slate-600">
                    {careSteps[activeStep - 1].description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 text-lg">Step-by-Step Guide:</h4>
                {careSteps[activeStep - 1].tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-slate-700">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl mb-6"
              >
                {activeStep === 1 ? '💧' : activeStep === 2 ? '✂️' : activeStep === 3 ? '🌞' : '💖'}
              </motion.div>
              <div className="text-sm text-slate-500">
                Step {activeStep} of {careSteps.length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white"
        >
          <h3 className="font-luxury text-2xl font-bold text-center mb-8">
            Quick Reference
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {careSteps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-all duration-300`}>
                  {step.icon}
                </div>
                <div className="font-semibold text-white mb-1">{step.title}</div>
                <div className="text-sm text-slate-300">{step.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FlowerCareGuide;