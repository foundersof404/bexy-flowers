import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LiquidButton } from '@/components/ui/liquid-button';
import { Droplets, Sun, Scissors, Heart, PlayCircle, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CareStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  tips: string[];
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

const careSteps: CareStep[] = [
  {
    id: 1,
    title: "Proper Hydration",
    description: "The foundation of flower longevity is consistent, clean water supply with the right additives.",
    icon: <Droplets className="w-6 h-6" />,
    duration: "Daily ritual",
    tips: [
      "Use lukewarm water (70-80°F) for most flowers",
      "Add flower food or 1 tsp sugar + 1 tsp bleach per quart",
      "Change water every 2-3 days completely",
      "Top off water daily as flowers drink a lot"
    ],
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Strategic Trimming",
    description: "Proper cutting technique ensures maximum water uptake and extends bloom life significantly.",
    icon: <Scissors className="w-6 h-6" />,
    duration: "Every 2-3 days",
    tips: [
      "Cut stems at 45° angle under running water",
      "Use sharp, clean floral shears or knife",
      "Remove any leaves below waterline",
      "Trim 1-2 inches off stems with each water change"
    ],
    difficulty: "Medium"
  },
  {
    id: 3,
    title: "Optimal Placement",
    description: "Environmental factors play a crucial role in maintaining flower freshness and vibrancy.",
    icon: <Sun className="w-6 h-6" />,
    duration: "One-time setup",
    tips: [
      "Keep away from direct sunlight and heat sources",
      "Maintain room temperature around 65-70°F",
      "Ensure good air circulation but avoid drafts",
      "Place in areas with consistent temperature"
    ],
    difficulty: "Easy"
  },
  {
    id: 4,
    title: "Gentle Maintenance",
    description: "Regular care and attention to detail will keep your arrangement looking professionally fresh.",
    icon: <Heart className="w-6 h-6" />,
    duration: "Daily check",
    tips: [
      "Remove wilted flowers and yellowing leaves immediately",
      "Gently mist petals (avoid fuzzy flowers like roses)",
      "Rotate vase occasionally for even light exposure",
      "Clean vase thoroughly between arrangements"
    ],
    difficulty: "Advanced"
  }
];

const FlowerCareGuide = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current;
    const progress = progressRef.current;

    if (!section || !steps.length || !progress) return;

    // Animate steps on scroll
    steps.forEach((step, index) => {
      gsap.fromTo(step,
        { x: index % 2 === 0 ? -100 : 100, opacity: 0, rotateY: 15 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Progress bar animation
    gsap.to(progress, {
      scaleX: activeStep / careSteps.length,
      duration: 0.5,
      ease: "power2.out"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeStep]);

  const playAllSteps = async () => {
    setIsPlaying(true);
    for (let i = 1; i <= careSteps.length; i++) {
      setActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setIsPlaying(false);
  };

  const difficultyColors = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const addToStepsRefs = (el: HTMLDivElement | null) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Heart className="w-4 h-4 mr-2" />
            Care Guide
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            Master Flower Care
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto mb-8">
            Learn the professional techniques that will extend your flowers' beauty and create lasting arrangements
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <LiquidButton
              variant="gold"
              size="lg"
              onClick={playAllSteps}
              disabled={isPlaying}
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {isPlaying ? 'Playing Guide...' : 'Play Full Guide'}
            </LiquidButton>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">Step {activeStep} of {careSteps.length}</span>
              <div className="w-32 h-2 bg-muted/20 rounded-full overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 origin-left scale-x-0 shadow-lg shadow-amber-500/50"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {careSteps.map((step) => (
            <motion.div
              key={step.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  activeStep === step.id
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-primary/10 bg-background/50 hover:border-primary/30'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    activeStep === step.id ? 'bg-primary text-background' : 'bg-muted/20 text-primary'
                  }`}>
                    {activeStep >= step.id ? <CheckCircle className="w-6 h-6" /> : step.icon}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                  <Badge className={`mt-2 text-xs ${difficultyColors[step.difficulty]}`}>
                    {step.difficulty}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Step Details */}
        <AnimatePresence mode="wait">
          {careSteps.map((step) => (
            activeStep === step.id && (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                ref={addToStepsRefs}
                className="mb-16"
              >
                <Card className="p-8 bg-gradient-glass backdrop-blur-md border-primary/20">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-background">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="font-luxury text-2xl font-bold text-foreground">
                            {step.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={difficultyColors[step.difficulty]}>
                              {step.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {step.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {step.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Professional Tips:</h4>
                        {step.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-xs font-bold">{index + 1}</span>
                            </div>
                            <span className="text-muted-foreground">{tip}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                          className="text-8xl mb-6"
                        >
                          {step.id === 1 ? '💧' : step.id === 2 ? '✂️' : step.id === 3 ? '🌞' : '💖'}
                        </motion.div>
                        <Badge className="bg-primary/10 text-primary">
                          Step {step.id} of {careSteps.length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Quick Reference Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="inline-block p-8 bg-gradient-luxury backdrop-blur-md border-primary/20">
            <h3 className="font-luxury text-2xl font-bold mb-4 text-background">
              Quick Reference
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-background/90">
              <div className="text-center">
                <Droplets className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-semibold">Water</div>
                <div className="text-xs">Every 2-3 days</div>
              </div>
              <div className="text-center">
                <Scissors className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-semibold">Trim</div>
                <div className="text-xs">45° angle</div>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-semibold">Light</div>
                <div className="text-xs">Indirect sun</div>
              </div>
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-semibold">Care</div>
                <div className="text-xs">Daily check</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FlowerCareGuide;