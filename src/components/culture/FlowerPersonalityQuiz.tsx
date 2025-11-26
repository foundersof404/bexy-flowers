import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LiquidButton } from '@/components/ui/liquid-button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Star } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    personality: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your ideal way to spend a weekend?",
    options: [
      { text: "Hosting an elegant dinner party", personality: "sophisticated" },
      { text: "Exploring nature and hiking trails", personality: "adventurous" },
      { text: "Reading a book in a cozy corner", personality: "romantic" },
      { text: "Creating art or crafts", personality: "creative" }
    ]
  },
  {
    id: 2,
    question: "Which color palette speaks to you most?",
    options: [
      { text: "Deep purples and royal blues", personality: "sophisticated" },
      { text: "Bright oranges and warm golds", personality: "adventurous" },
      { text: "Soft pinks and cream whites", personality: "romantic" },
      { text: "Vibrant reds and bold magentas", personality: "creative" }
    ]
  },
  {
    id: 3,
    question: "Your perfect date would be:",
    options: [
      { text: "Fine dining at a Michelin-starred restaurant", personality: "sophisticated" },
      { text: "Picnic in a beautiful garden", personality: "adventurous" },
      { text: "Candlelit dinner at home", personality: "romantic" },
      { text: "Art gallery opening with wine", personality: "creative" }
    ]
  },
  {
    id: 4,
    question: "Which fragrance appeals to you most?",
    options: [
      { text: "Rich and complex with deep notes", personality: "sophisticated" },
      { text: "Fresh and clean like ocean breeze", personality: "adventurous" },
      { text: "Sweet and floral like jasmine", personality: "romantic" },
      { text: "Unique and bold with spicy undertones", personality: "creative" }
    ]
  }
];

const personalityResults = {
  sophisticated: {
    title: "The Sophisticated Soul",
    description: "You appreciate the finer things in life and have an eye for elegance and refinement.",
    bouquet: "Royal Orchid Arrangement",
    flowers: ["Purple Orchids", "White Calla Lilies", "Silver Eucalyptus"],
    characteristics: ["Elegant", "Refined", "Timeless", "Luxurious"],
    emoji: "👑"
  },
  romantic: {
    title: "The Romantic Dreamer",
    description: "You believe in love stories and find beauty in life's tender moments.",
    bouquet: "Garden Rose Paradise",
    flowers: ["Pink Garden Roses", "White Peonies", "Baby's Breath"],
    characteristics: ["Tender", "Loving", "Gentle", "Dreamy"],
    emoji: "💕"
  },
  adventurous: {
    title: "The Free Spirit",
    description: "You're drawn to nature's wild beauty and love exploring new experiences.",
    bouquet: "Wildflower Symphony",
    flowers: ["Sunflowers", "Orange Tulips", "Green Hypericum"],
    characteristics: ["Bold", "Energetic", "Natural", "Vibrant"],
    emoji: "🌻"
  },
  creative: {
    title: "The Artistic Innovator",
    description: "You see the world through a unique lens and appreciate unconventional beauty.",
    bouquet: "Avant-Garde Expression",
    flowers: ["Red Anthuriums", "Purple Protea", "Twisted Willow"],
    characteristics: ["Unique", "Bold", "Expressive", "Innovative"],
    emoji: "🎨"
  }
};

const FlowerPersonalityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleAnswer = (personality: string) => {
    const newAnswers = [...answers, personality];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const personalityCounts = newAnswers.reduce((acc, p) => {
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantPersonality = Object.keys(personalityCounts).reduce((a, b) =>
        personalityCounts[a] > personalityCounts[b] ? a : b
      );

      setResult(dominantPersonality);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult('');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Personality Quiz
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            Find Your Perfect Bouquet
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Discover which flowers match your personality and style
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-background/50 backdrop-blur-sm border-primary/10">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm text-primary font-semibold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-luxury text-2xl font-bold mb-8 text-center text-foreground">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <LiquidButton
                          variant="glass"
                          size="lg"
                          className="w-full h-auto py-6 text-left justify-start"
                          onClick={() => handleAnswer(option.personality)}
                        >
                          <span className="text-base">{option.text}</span>
                        </LiquidButton>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-12 bg-gradient-glass backdrop-blur-md border-primary/20 text-center">
                <div className="text-8xl mb-6">
                  {personalityResults[result as keyof typeof personalityResults].emoji}
                </div>
                
                <h3 className="font-luxury text-3xl font-bold mb-4 text-foreground">
                  {personalityResults[result as keyof typeof personalityResults].title}
                </h3>
                
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  {personalityResults[result as keyof typeof personalityResults].description}
                </p>

                <div className="bg-background/30 rounded-lg p-8 mb-8">
                  <h4 className="font-luxury text-2xl font-bold mb-4 text-foreground">
                    Your Perfect Bouquet
                  </h4>
                  <div className="text-primary text-xl font-semibold mb-4">
                    {personalityResults[result as keyof typeof personalityResults].bouquet}
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {personalityResults[result as keyof typeof personalityResults].flowers.map((flower, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {flower}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {personalityResults[result as keyof typeof personalityResults].characteristics.map((char, index) => (
                      <Badge key={index} className="bg-primary/20 text-primary text-sm">
                        <Star className="w-3 h-3 mr-1" />
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LiquidButton variant="gold" size="lg">
                    <Heart className="w-5 h-5 mr-2" />
                    Order This Bouquet
                  </LiquidButton>
                  <LiquidButton variant="glass" size="lg" onClick={resetQuiz}>
                    Take Quiz Again
                  </LiquidButton>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FlowerPersonalityQuiz;