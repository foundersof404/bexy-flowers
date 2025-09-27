import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LiquidButton } from '@/components/ui/liquid-button';
import { Calendar, Flower, Thermometer, Droplets } from 'lucide-react';

interface SeasonalFlower {
  name: string;
  emoji: string;
  peakMonths: string[];
  characteristics: string[];
  culturalTradition: string;
  careLevel: 'Easy' | 'Moderate' | 'Advanced';
  price: string;
}

const seasonalData = {
  spring: {
    name: "Spring Awakening",
    months: ["March", "April", "May"],
    theme: "Rebirth & Renewal",
    colors: ["Soft Pink", "Fresh Green", "Pure White"],
    flowers: [
      {
        name: "Cherry Blossoms",
        emoji: "🌸",
        peakMonths: ["March", "April"],
        characteristics: ["Delicate", "Fleeting", "Symbolic"],
        culturalTradition: "Japanese Hanami - viewing flowers as meditation on life's beauty",
        careLevel: "Moderate" as const,
        price: "$75-120"
      },
      {
        name: "Tulips",
        emoji: "🌷",
        peakMonths: ["March", "April", "May"],
        characteristics: ["Vibrant", "Elegant", "Classic"],
        culturalTradition: "Dutch symbol of prosperity and perfect love",
        careLevel: "Easy" as const,
        price: "$45-85"
      },
      {
        name: "Daffodils",
        emoji: "🌻",
        peakMonths: ["March", "April"],
        characteristics: ["Cheerful", "Hardy", "First bloom"],
        culturalTradition: "Welsh national flower, symbol of new beginnings",
        careLevel: "Easy" as const,
        price: "$35-60"
      }
    ]
  },
  summer: {
    name: "Summer Radiance",
    months: ["June", "July", "August"],
    theme: "Abundance & Vitality",
    colors: ["Golden Yellow", "Deep Orange", "Vibrant Red"],
    flowers: [
      {
        name: "Sunflowers",
        emoji: "🌻",
        peakMonths: ["July", "August"],
        characteristics: ["Bold", "Cheerful", "Majestic"],
        culturalTradition: "Native American symbol of harvest and bounty",
        careLevel: "Easy" as const,
        price: "$55-90"
      },
      {
        name: "Peonies",
        emoji: "🌺",
        peakMonths: ["June", "July"],
        characteristics: ["Luxurious", "Fragrant", "Full"],
        culturalTradition: "Chinese 'King of Flowers' - honor and wealth",
        careLevel: "Moderate" as const,
        price: "$95-150"
      },
      {
        name: "Roses",
        emoji: "🌹",
        peakMonths: ["June", "July", "August"],
        characteristics: ["Romantic", "Classic", "Fragrant"],
        culturalTradition: "Universal symbol of love across all cultures",
        careLevel: "Advanced" as const,
        price: "$65-120"
      }
    ]
  },
  autumn: {
    name: "Autumn Elegance",
    months: ["September", "October", "November"],
    theme: "Reflection & Gratitude",
    colors: ["Burnt Orange", "Deep Burgundy", "Golden Brown"],
    flowers: [
      {
        name: "Chrysanthemums",
        emoji: "🌼",
        peakMonths: ["September", "October", "November"],
        characteristics: ["Resilient", "Diverse", "Long-lasting"],
        culturalTradition: "Japanese symbol of autumn and longevity",
        careLevel: "Moderate" as const,
        price: "$45-75"
      },
      {
        name: "Dahlias",
        emoji: "🌺",
        peakMonths: ["September", "October"],
        characteristics: ["Bold", "Sculptural", "Dramatic"],
        culturalTradition: "Mexican national flower, represents dignity",
        careLevel: "Advanced" as const,
        price: "$70-110"
      },
      {
        name: "Marigolds",
        emoji: "🏵️",
        peakMonths: ["September", "October", "November"],
        characteristics: ["Vibrant", "Hardy", "Protective"],
        culturalTradition: "Mexican Day of the Dead - guiding spirits home",
        careLevel: "Easy" as const,
        price: "$25-45"
      }
    ]
  },
  winter: {
    name: "Winter Serenity",
    months: ["December", "January", "February"],
    theme: "Peace & Contemplation",
    colors: ["Pure White", "Deep Evergreen", "Silver"],
    flowers: [
      {
        name: "Poinsettias",
        emoji: "🌺",
        peakMonths: ["December", "January"],
        characteristics: ["Festive", "Symbolic", "Warming"],
        culturalTradition: "Mexican Christmas tradition - Star of Bethlehem",
        careLevel: "Moderate" as const,
        price: "$35-65"
      },
      {
        name: "Amaryllis",
        emoji: "🌸",
        peakMonths: ["December", "January", "February"],
        characteristics: ["Elegant", "Dramatic", "Indoor beauty"],
        culturalTradition: "Victorian symbol of pride and determination",
        careLevel: "Easy" as const,
        price: "$45-80"
      },
      {
        name: "Paperwhites",
        emoji: "🤍",
        peakMonths: ["December", "January"],
        characteristics: ["Pure", "Fragrant", "Delicate"],
        culturalTradition: "Symbol of rebirth and hope in darkness",
        careLevel: "Easy" as const,
        price: "$30-55"
      }
    ]
  }
};

const SeasonalCalendar = () => {
  const [selectedSeason, setSelectedSeason] = useState<keyof typeof seasonalData>('spring');
  const [selectedFlower, setSelectedFlower] = useState<SeasonalFlower | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current;

    if (!section || !cards.length) return;

    gsap.fromTo(cards,
      { y: 100, opacity: 0, rotateX: 15 },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      }
    );
  }, [selectedSeason]);

  const currentSeason = seasonalData[selectedSeason];
  const careColors = {
    Easy: 'bg-green-500/20 text-green-400',
    Moderate: 'bg-amber-500/20 text-amber-400',
    Advanced: 'bg-red-500/20 text-red-400'
  };

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Calendar className="w-4 h-4 mr-2" />
            Seasonal Guide
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            Flower Calendar
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Discover the perfect blooms for each season and their cultural significance
          </p>
        </motion.div>

        {/* Season Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {Object.entries(seasonalData).map(([season, data]) => (
            <LiquidButton
              key={season}
              variant={selectedSeason === season ? "gold" : "glass"}
              size="md"
              onClick={() => {
                setSelectedSeason(season as keyof typeof seasonalData);
                setSelectedFlower(null);
                cardRefs.current = [];
              }}
            >
              <span className="capitalize">{data.name}</span>
            </LiquidButton>
          ))}
        </div>

        {/* Season Overview */}
        <motion.div
          key={selectedSeason}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-8 bg-gradient-glass backdrop-blur-md border-primary/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-luxury text-3xl font-bold text-foreground mb-4">
                  {currentSeason.name}
                </h3>
                <p className="text-xl text-muted-foreground mb-6">
                  {currentSeason.theme}
                </p>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-foreground">Peak Months:</span>
                    <div className="flex gap-2 mt-2">
                      {currentSeason.months.map((month) => (
                        <Badge key={month} variant="secondary">{month}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Signature Colors:</span>
                    <div className="flex gap-2 mt-2">
                      {currentSeason.colors.map((color) => (
                        <Badge key={color} className="bg-primary/20 text-primary">{color}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {currentSeason.flowers[0].emoji}
                </div>
                <Badge className="bg-primary/10 text-primary">
                  <Flower className="w-4 h-4 mr-2" />
                  {currentSeason.flowers.length} Featured Flowers
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Flowers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="wait">
            {currentSeason.flowers.map((flower, index) => (
              <motion.div
                key={`${selectedSeason}-${flower.name}`}
                ref={addToRefs}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="perspective-1000"
              >
                <Card className="h-full p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-500 cursor-pointer transform-3d hover:rotate-x-2"
                      onClick={() => setSelectedFlower(flower)}>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{flower.emoji}</div>
                    <h3 className="font-luxury text-xl font-bold text-foreground mb-2">
                      {flower.name}
                    </h3>
                    <Badge className={careColors[flower.careLevel]}>
                      {flower.careLevel}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Peak Season</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {flower.peakMonths.map((month) => (
                          <Badge key={month} variant="outline" className="text-xs">
                            {month}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-foreground mb-2 block">Characteristics</span>
                      <div className="flex flex-wrap gap-1">
                        {flower.characteristics.map((char) => (
                          <Badge key={char} variant="secondary" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-foreground">Price Range</span>
                      <p className="text-primary font-semibold">{flower.price}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Flower Detail Modal */}
        <AnimatePresence>
          {selectedFlower && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedFlower(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 100 }}
                className="max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="p-8 bg-background/95 backdrop-blur-lg border-primary/20">
                  <div className="text-center mb-8">
                    <div className="text-8xl mb-4">{selectedFlower.emoji}</div>
                    <h3 className="font-luxury text-3xl font-bold text-foreground mb-2">
                      {selectedFlower.name}
                    </h3>
                    <Badge className={careColors[selectedFlower.careLevel]}>
                      <Droplets className="w-4 h-4 mr-2" />
                      {selectedFlower.careLevel} Care
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-luxury text-lg font-semibold text-foreground mb-3">
                        Cultural Tradition
                      </h4>
                      <p className="text-muted-foreground italic">
                        "{selectedFlower.culturalTradition}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Peak Months</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFlower.peakMonths.map((month) => (
                            <Badge key={month} variant="outline">{month}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Price Range</h4>
                        <p className="text-primary font-semibold text-lg">{selectedFlower.price}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Characteristics</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFlower.characteristics.map((char) => (
                          <Badge key={char} className="bg-primary/20 text-primary">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <LiquidButton variant="gold" size="lg" className="flex-1">
                      Order This Flower
                    </LiquidButton>
                    <LiquidButton variant="glass" size="lg" onClick={() => setSelectedFlower(null)}>
                      Close
                    </LiquidButton>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SeasonalCalendar;