import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
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

// Luxury Gold Accent Component
const GoldAccent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-[#C79E48]/20 via-[#D4A85A]/30 to-[#C79E48]/20 rounded-full blur-xl" />
    {children}
  </div>
);

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
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(211, 211, 209)' }}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, hsl(51 100% 50% / 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 80% 80%, hsl(51 100% 50% / 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 50% 50%, hsl(51 100% 50% / 0.05) 0%, transparent 60%)`
        }} />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/8 to-amber-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <section className="py-32 px-4 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16 relative"
        >
          {/* Modern Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/10 to-slate-700/10 backdrop-blur-xl border border-slate-600/20 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 tracking-wider uppercase">Zodiac Bouquet Finder</span>
          </motion.div>
          
          {/* Luxury Typography with Gold Accent */}
          <motion.h1 
            className="font-luxury text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            FIND YOUR
            <br />
            COSMIC BOUQUET
            {/* Animated Gold Underline */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#C79E48] to-[#D4A85A] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '200px' }}
              viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            />
          </motion.h1>
          
          {/* Enhanced Decorative Elements */}
          <div className="relative mb-8">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48]/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#C79E48] rotate-45 shadow-lg shadow-[#C79E48]/50" />
          </div>
          
          {/* Enhanced Description */}
          <motion.p 
            className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the perfect floral arrangement that aligns with your zodiac sign and cosmic energy
          </motion.p>
        </motion.div>

        {/* Luxury Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <motion.div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 relative ${
                    index <= currentStep
                      ? 'bg-[#C79E48] text-white shadow-lg shadow-[#C79E48]/40'
                      : 'bg-white border-2 border-[#C79E48] text-[#C79E48]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {index + 1}
                  {index <= currentStep && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#C79E48] opacity-30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span className={`text-sm mt-3 text-center font-medium tracking-wide ${
                  index <= currentStep ? 'text-[#C79E48]' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="absolute top-7 left-14 w-full h-0.5 bg-[#E8D4A8] -z-10" />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#C79E48] to-[#C79E48] h-2 rounded-full shadow-md"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Luxury Quiz Content Card */}
        <Card className="p-10 bg-gradient-to-br from-white to-[#F5F1E8] border border-[#D4A85A] shadow-xl shadow-[#C79E48]/15 rounded-3xl">
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

          {/* Luxury Navigation Buttons */}
          <div className="flex justify-between mt-10">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 bg-white border-2 border-[#C79E48] text-[#C79E48] hover:bg-[#F5F1E8] disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-semibold"
              >
                Previous
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !userInfo.name) ||
                  (currentStep === 1 && (!userInfo.month || !userInfo.day)) ||
                  (currentStep === 3 && !selectedBouquet)
                }
                className="flex items-center gap-3 bg-gradient-to-r from-[#C79E48] to-[#C79E48] hover:from-[#C79E48] hover:to-[#C79E48] text-white shadow-lg shadow-[#C79E48]/40 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-semibold text-lg"
              >
                {currentStep === steps.length - 1 ? 'Find My Bouquet' : 'Next'}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </Card>
        </div>
      </section>
    </div>
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
  <div className="text-center space-y-10">
    
    <motion.h3 
      className="text-4xl font-bold text-gray-900 mb-6 tracking-wide"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      Welcome to Your{' '}
      <span className="text-[#C79E48]">Cosmic</span>{' '}
      Journey
    </motion.h3>
    
    <motion.p 
      className="text-gray-600 text-xl mb-10 leading-relaxed font-light max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      Let's discover the perfect bouquet that resonates with your zodiac energy and personal style.
    </motion.p>
    
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Label htmlFor="name" className="text-gray-800 font-semibold text-xl mb-4 block tracking-wide">
        What should we call you?
      </Label>
      <Input
        id="name"
        placeholder="Enter your name"
        value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        className="bg-white border-2 border-[#D4A85A] focus:border-[#C79E48] focus:ring-[#C79E48]/20 h-14 text-lg rounded-xl px-6 shadow-lg text-gray-900 placeholder:text-gray-500"
      />
    </motion.div>
  </div>
);

const BirthDetailsStep = ({ 
  userInfo, 
  setUserInfo 
}: { 
  userInfo: any; 
  setUserInfo: (info: any) => void; 
}) => (
  <div className="space-y-10">
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
        Your Birth Details
      </h3>
      <p className="text-gray-600 text-xl font-light">
        Enter your birth month and day to discover your zodiac sign
      </p>
    </motion.div>
    
    <motion.div 
      className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div>
        <Label htmlFor="month" className="text-gray-800 font-semibold text-xl mb-4 block tracking-wide">Birth Month</Label>
        <Select
          value={userInfo.month}
          onValueChange={(value) => setUserInfo({ ...userInfo, month: value })}
        >
          <SelectTrigger className="bg-white border-2 border-[#D4A85A] focus:border-[#C79E48] h-14 text-lg rounded-xl px-6 shadow-lg text-gray-900">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-[#D4A85A] rounded-xl shadow-lg">
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()} className="text-gray-900 hover:bg-[#F5F1E8]">
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="day" className="text-gray-800 font-semibold text-xl mb-4 block tracking-wide">Birth Day</Label>
        <Input
          id="day"
          type="number"
          min="1"
          max="31"
          placeholder="Day"
          value={userInfo.day}
          onChange={(e) => setUserInfo({ ...userInfo, day: e.target.value })}
          className="bg-white border-2 border-[#D4A85A] focus:border-[#C79E48] focus:ring-[#C79E48]/20 h-14 text-lg rounded-xl px-6 shadow-lg text-gray-900 placeholder:text-gray-500"
        />
      </div>
    </motion.div>
  </div>
);

const ZodiacProfileStep = ({ sign }: { sign: ZodiacSign }) => (
  <div className="space-y-10">
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mx-auto mb-8"
      >
        <div className="w-40 h-40 bg-white border-4 border-[#C79E48] rounded-full flex items-center justify-center shadow-2xl shadow-[#C79E48]/30 relative">
          <span className="text-8xl drop-shadow-lg">{sign.symbol}</span>
          <motion.div
            className="absolute inset-0 border-4 border-[#C79E48] rounded-full"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>
      
      <motion.h3 
        className="text-5xl font-bold text-gray-900 mb-6 tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {sign.name}
      </motion.h3>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Badge variant="secondary" className="mb-6 bg-[#F5F1E8] border-2 border-[#C79E48] text-[#8B6F3A] text-xl px-6 py-3 rounded-full font-semibold">
          {sign.element} • {sign.modality}
        </Badge>
      </motion.div>
      
      <motion.p 
        className="text-gray-600 text-xl font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {sign.dates} • Ruled by {sign.rulingPlanet}
      </motion.p>
    </motion.div>
    
    <motion.div 
      className="grid md:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg">
        <h4 className="font-bold text-gray-900 text-2xl mb-6 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
          Your Personality
        </h4>
        <p className="text-gray-800 leading-relaxed text-lg">
          {sign.personality}
        </p>
      </div>
      
      <div className="bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg">
        <h4 className="font-bold text-gray-900 text-2xl mb-6 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
          Your Traits
        </h4>
        <div className="flex flex-wrap gap-3">
          {sign.traits.map((trait, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="inline-block border-2 border-[#C79E48] text-[#8B6F3A] bg-[#F5F1E8] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#C79E48] hover:text-white transition-all duration-300 cursor-pointer">
                {trait}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
    
    <motion.div 
      className="bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <h4 className="font-bold text-gray-900 text-2xl mb-6 tracking-wide text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Your Colors
      </h4>
      <div className="flex justify-center gap-6">
        {sign.colors.map((color, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.2 }}
          >
            <div
              className="w-16 h-16 rounded-full border-4 border-[#C79E48] shadow-lg"
              style={{ backgroundColor: color }}
              title={`${sign.name} ${color}`}
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {color}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
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
  <div className="space-y-10">
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
        Your Perfect Match
      </h3>
      <p className="text-gray-600 text-xl font-light">
        Choose the bouquet that speaks to your {sign.name} soul
      </p>
    </motion.div>
    
    <div className="grid gap-8">
      {sign.recommendedBouquets.map((bouquet, index) => (
        <motion.div
          key={bouquet.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ y: -8 }}
        >
          <Card 
            className={`p-8 cursor-pointer transition-all duration-500 rounded-2xl border-2 shadow-lg ${
              selectedBouquet?.id === bouquet.id
                ? 'ring-4 ring-[#C79E48] bg-gradient-to-br from-[#F5F1E8] to-white border-[#C79E48] shadow-xl shadow-[#C79E48]/30'
                : 'bg-white border-[#E8D4A8] hover:border-[#D4A85A] hover:shadow-xl'
            }`}
            onClick={() => onBouquetSelect(bouquet)}
          >
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-white rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#E8D4A8] shadow-lg">
                <img
                  src={bouquet.image}
                  alt={bouquet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-2xl mb-4 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {bouquet.name}
                </h4>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {bouquet.description}
                </p>
                <div className="flex items-center gap-6 text-xl">
                  <span className="text-[#C79E48] font-bold text-2xl">
                    ${bouquet.price}
                  </span>
                  <span className="text-gray-800 bg-[#F5F1E8] border border-[#D4A85A] px-4 py-2 rounded-full text-sm font-medium">
                    {bouquet.occasion}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className={`w-12 h-12 rounded-full border-3 flex items-center justify-center transition-all duration-300 ${
                    selectedBouquet?.id === bouquet.id
                      ? 'border-[#C79E48] bg-[#C79E48] shadow-lg shadow-[#C79E48]/40'
                      : 'border-[#D4A85A] bg-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {selectedBouquet?.id === bouquet.id && (
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />
                  )}
                </motion.div>
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
  <div className="min-h-screen bg-white">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-16 p-8"
    >
      {/* Success Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative mx-auto mb-8"
        >
          <div className="w-48 h-48 bg-white border-4 border-[#C79E48] rounded-full flex items-center justify-center shadow-2xl shadow-[#C79E48]/30 relative">
            <span className="text-9xl drop-shadow-lg">{sign.symbol}</span>
            <motion.div
              className="absolute inset-0 border-4 border-[#C79E48] rounded-full"
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {userInfo.name}, Your{' '}
          <span className="text-[#C79E48]">Cosmic</span>{' '}
          Bouquet Awaits!
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          As a {sign.name}, this arrangement perfectly matches your cosmic energy
        </motion.p>
      </motion.div>

      {/* Bouquet Result */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Card className="p-12 bg-gradient-to-br from-white to-[#F5F1E8] border-2 border-[#D4A85A] shadow-2xl shadow-[#C79E48]/15 rounded-3xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <img
                src={bouquet.image}
                alt={bouquet.name}
                className="w-full h-96 object-cover rounded-3xl shadow-2xl border-2 border-[#E8D4A8]"
              />
            </motion.div>
            
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <h3 className="text-5xl font-bold text-gray-900 mb-6 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {bouquet.name}
                </h3>
                <p className="text-[#C79E48] text-4xl font-bold mb-8">
                  ${bouquet.price}
                </p>
                <p className="text-gray-800 text-xl leading-relaxed">
                  {bouquet.description}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg"
              >
                <h4 className="font-bold text-gray-900 text-2xl mb-6 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Why This Bouquet?
                </h4>
                <p className="text-gray-800 mb-8 leading-relaxed text-lg">
                  {bouquet.meaning}
                </p>
                <div className="flex flex-wrap gap-3">
                  {bouquet.specialFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.6 + index * 0.1 }}
                    >
                      <span className="inline-block border-2 border-[#C79E48] text-[#8B6F3A] bg-[#F5F1E8] rounded-full px-4 py-2 text-sm font-medium">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="flex gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button size="lg" className="w-full bg-gradient-to-r from-[#C79E48] to-[#C79E48] hover:from-[#C79E48] hover:to-[#C79E48] text-white shadow-lg shadow-[#C79E48]/40 h-16 text-xl font-semibold rounded-xl">
                    <Gift className="w-6 h-6 mr-3" />
                    Add to Cart
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" onClick={onRestart} className="bg-white border-2 border-[#C79E48] text-[#C79E48] hover:bg-[#F5F1E8] h-16 text-xl px-8 rounded-xl font-semibold">
                    Try Again
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Zodiac Insights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <Card className="p-10 bg-gradient-to-r from-[#F5F1E8] to-white border-2 border-[#D4A85A] shadow-xl shadow-[#C79E48]/10 rounded-3xl">
          <h3 className="font-bold text-gray-900 text-3xl mb-12 text-center tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Zodiac Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <h4 className="font-bold text-gray-900 text-xl mb-4 tracking-wide">Element</h4>
              <span className="inline-block border-2 border-[#C79E48] text-[#8B6F3A] bg-[#F5F1E8] rounded-full px-6 py-3 text-lg font-semibold">
                {sign.element}
              </span>
            </motion.div>
            <motion.div 
              className="text-center bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              <h4 className="font-bold text-gray-900 text-xl mb-4 tracking-wide">Ruling Planet</h4>
              <span className="text-gray-800 text-xl font-semibold">{sign.rulingPlanet}</span>
            </motion.div>
            <motion.div 
              className="text-center bg-white rounded-2xl p-8 border-2 border-[#E8D4A8] shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.6 }}
            >
              <h4 className="font-bold text-gray-900 text-xl mb-4 tracking-wide">Gemstone</h4>
              <span className="text-gray-800 text-xl font-semibold">{sign.gemstone}</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  </div>
);

export default ZodiacBouquetQuiz;
