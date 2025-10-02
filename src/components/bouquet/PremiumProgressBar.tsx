import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flower2, Palette, CreditCard } from 'lucide-react';

interface PremiumProgressBarProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const PremiumProgressBar: React.FC<PremiumProgressBarProps> = ({
  currentStep,
  onStepClick
}) => {
  const steps = [
    {
      id: 1,
      title: 'Choose Flowers',
      subtitle: 'Select your blooms',
      icon: Flower2,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Customize',
      subtitle: 'Arrange & style',
      icon: Palette,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Checkout',
      subtitle: 'Complete order',
      icon: CreditCard,
      completed: currentStep > 3
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() => onStepClick?.(step.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Step Circle */}
                <div className="relative mb-4">
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-transparent text-white shadow-lg'
                        : isActive
                        ? 'bg-white border-amber-500 text-amber-500 shadow-lg'
                        : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        <Check className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </motion.div>

                  {/* Pulse Effect for Active Step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-amber-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="max-w-32">
                  <h3 className={`font-semibold text-sm mb-1 transition-colors ${
                    isActive || isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-500 group-hover:text-slate-700'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs transition-colors ${
                    isActive || isCompleted
                      ? 'text-slate-600'
                      : 'text-slate-400 group-hover:text-slate-500'
                  }`}>
                    {step.subtitle}
                  </p>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-full w-full h-0.5 -translate-x-1/2 -translate-y-1/2 bg-slate-200" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Indicator */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200/50 shadow-lg">
          <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-700">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumProgressBar;

