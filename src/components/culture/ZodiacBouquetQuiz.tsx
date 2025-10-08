import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ArrowRight, Calendar, Heart, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  zodiacSigns, 
  getZodiacSign, 
  getElementColors, 
  ZodiacSign, 
  ZodiacBouquet 
} from '@/data/zodiac';

const ZodiacBouquetQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    month: '',
    day: '',
    email: ''
  });
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [selectedBouquet, setSelectedBouquet] = useState<ZodiacBouquet | null>(null);
  const [showResult, setShowResult] = useState(false);

  const steps = [
    { title: 'Welcome', description: 'Discover your cosmic bouquet' },
    { title: 'Birth Details', description: 'Enter your birth information' },
    { title: 'Zodiac Sign', description: 'Your astrological profile' },
    { title: 'Perfect Match', description: 'Your ideal bouquet' }
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      const month = parseInt(userInfo.month);
      const day = parseInt(userInfo.day);
      const sign = getZodiacSign(month, day);
      if (sign) {
        setSelectedSign(sign);
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBouquetSelect = (bouquet: ZodiacBouquet) => {
    setSelectedBouquet(bouquet);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserInfo({ name: '', month: '', day: '', email: '' });
    setSelectedSign(null);
    setSelectedBouquet(null);
    setShowResult(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (showResult && selectedSign && selectedBouquet) {
    return (
      <ZodiacResult 
        userInfo={userInfo}
        sign={selectedSign}
        bouquet={selectedBouquet}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Zodiac Bouquet Finder
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            Find Your Cosmic Bouquet
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Discover the perfect floral arrangement that aligns with your zodiac sign and cosmic energy
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Quiz Content */}
        <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {currentStep === 0 && (
                <WelcomeStep 
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              )}
              
              {currentStep === 1 && (
                <BirthDetailsStep 
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              )}
              
              {currentStep === 2 && selectedSign && (
                <ZodiacProfileStep 
                  sign={selectedSign}
                />
              )}
              
              {currentStep === 3 && selectedSign && (
                <BouquetSelectionStep 
                  sign={selectedSign}
                  selectedBouquet={selectedBouquet}
                  onBouquetSelect={handleBouquetSelect}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !userInfo.name) ||
                (currentStep === 1 && (!userInfo.month || !userInfo.day)) ||
                (currentStep === 3 && !selectedBouquet)
              }
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Find My Bouquet' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

// Step Components
const WelcomeStep = ({ 
  userInfo, 
  setUserInfo 
}: { 
  userInfo: any; 
  setUserInfo: (info: any) => void; 
}) => (
  <div className="text-center space-y-6">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <Star className="w-12 h-12 text-primary" />
    </motion.div>
    
    <h3 className="text-2xl font-semibold text-foreground mb-4">
      Welcome to Your Cosmic Journey
    </h3>
    
    <p className="text-muted-foreground mb-6">
      Let's discover the perfect bouquet that resonates with your zodiac energy and personal style.
    </p>
    
    <div className="max-w-md mx-auto">
      <Label htmlFor="name">What should we call you?</Label>
      <Input
        id="name"
        placeholder="Enter your name"
        value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        className="mt-2"
      />
    </div>
  </div>
);

const BirthDetailsStep = ({ 
  userInfo, 
  setUserInfo 
}: { 
  userInfo: any; 
  setUserInfo: (info: any) => void; 
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-foreground mb-4">
        Your Birth Details
      </h3>
      <p className="text-muted-foreground">
        Enter your birth month and day to discover your zodiac sign
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto">
      <div>
        <Label htmlFor="month">Birth Month</Label>
        <Select
          value={userInfo.month}
          onValueChange={(value) => setUserInfo({ ...userInfo, month: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="day">Birth Day</Label>
        <Input
          id="day"
          type="number"
          min="1"
          max="31"
          placeholder="Day"
          value={userInfo.day}
          onChange={(e) => setUserInfo({ ...userInfo, day: e.target.value })}
          className="mt-2"
        />
      </div>
    </div>
  </div>
);

const ZodiacProfileStep = ({ sign }: { sign: ZodiacSign }) => (
  <div className="space-y-6">
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-6xl mb-4"
      >
        {sign.symbol}
      </motion.div>
      <h3 className="text-3xl font-luxury font-bold text-foreground mb-2">
        {sign.name}
      </h3>
      <Badge variant="secondary" className="mb-4">
        {sign.element} • {sign.modality}
      </Badge>
      <p className="text-muted-foreground">
        {sign.dates} • Ruled by {sign.rulingPlanet}
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-foreground mb-3">Your Personality</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {sign.personality}
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold text-foreground mb-3">Your Traits</h4>
        <div className="flex flex-wrap gap-2">
          {sign.traits.map((trait, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {trait}
            </Badge>
          ))}
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-semibold text-foreground mb-3">Your Colors</h4>
      <div className="flex gap-2">
        {sign.colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full border-2 border-border"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  </div>
);

const BouquetSelectionStep = ({ 
  sign, 
  selectedBouquet, 
  onBouquetSelect 
}: { 
  sign: ZodiacSign; 
  selectedBouquet: ZodiacBouquet | null; 
  onBouquetSelect: (bouquet: ZodiacBouquet) => void; 
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-foreground mb-4">
        Your Perfect Match
      </h3>
      <p className="text-muted-foreground">
        Choose the bouquet that speaks to your {sign.name} soul
      </p>
    </div>
    
    <div className="grid gap-6">
      {sign.recommendedBouquets.map((bouquet, index) => (
        <motion.div
          key={bouquet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={`p-6 cursor-pointer transition-all duration-300 ${
              selectedBouquet?.id === bouquet.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onBouquetSelect(bouquet)}
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={bouquet.image}
                  alt={bouquet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">
                  {bouquet.name}
                </h4>
                <p className="text-muted-foreground text-sm mb-3">
                  {bouquet.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary font-semibold">
                    ${bouquet.price}
                  </span>
                  <span className="text-muted-foreground">
                    {bouquet.occasion}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                  {selectedBouquet?.id === bouquet.id && (
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

// Result Component
const ZodiacResult = ({ 
  userInfo, 
  sign, 
  bouquet, 
  onRestart 
}: { 
  userInfo: any; 
  sign: ZodiacSign; 
  bouquet: ZodiacBouquet; 
  onRestart: () => void; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="space-y-8"
  >
    {/* Success Header */}
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-8xl mb-4"
      >
        {sign.symbol}
      </motion.div>
      <h2 className="text-4xl font-luxury font-bold text-foreground mb-4">
        {userInfo.name}, Your Cosmic Bouquet Awaits!
      </h2>
      <p className="text-muted-foreground text-xl">
        As a {sign.name}, this arrangement perfectly matches your cosmic energy
      </p>
    </div>

    {/* Bouquet Result */}
    <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <img
            src={bouquet.image}
            alt={bouquet.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-3xl font-luxury font-bold text-foreground mb-2">
              {bouquet.name}
            </h3>
            <p className="text-primary text-2xl font-semibold mb-4">
              ${bouquet.price}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {bouquet.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Why This Bouquet?</h4>
            <p className="text-muted-foreground text-sm mb-4">
              {bouquet.meaning}
            </p>
            <div className="flex flex-wrap gap-2">
              {bouquet.specialFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              <Gift className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={onRestart}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </Card>

    {/* Zodiac Insights */}
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <h3 className="font-semibold text-foreground mb-4">Your Zodiac Insights</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-foreground mb-2">Element</h4>
          <Badge variant="secondary">{sign.element}</Badge>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-2">Ruling Planet</h4>
          <span className="text-muted-foreground">{sign.rulingPlanet}</span>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-2">Gemstone</h4>
          <span className="text-muted-foreground">{sign.gemstone}</span>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default ZodiacBouquetQuiz;
