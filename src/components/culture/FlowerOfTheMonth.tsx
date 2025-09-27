import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const flowerOfTheMonth = {
  name: "Peonies",
  month: "May",
  origin: "China & Japan",
  meaning: "Honor, Wealth, Romance",
  description: "Known as the 'King of Flowers' in Chinese culture, peonies symbolize honor, wealth, and romance. These lush, full blooms have been cherished for over 2,000 years and represent the pinnacle of floral beauty.",
  culturalSignificance: [
    "In Chinese culture, peonies represent honor and wealth",
    "Japanese tradition associates them with bravery and honor",
    "Victorian flower language: bashfulness and compassion",
    "Modern symbol of happy marriage and good fortune"
  ],
  colors: ["Coral Pink", "Deep Magenta", "Pure White", "Soft Blush"],
  seasonality: "Late spring to early summer bloom",
  careInstructions: [
    "Plant in well-drained, fertile soil",
    "Choose sunny to partial shade locations",
    "Water deeply but infrequently",
    "Avoid disturbing established roots"
  ]
};

const FlowerOfTheMonth = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!section || !image || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    });

    tl.fromTo(image, 
      { scale: 0.8, opacity: 0, rotateY: -15 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 1 }
    )
    .fromTo(content,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 },
      "-=0.5"
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Star className="w-4 h-4 mr-2" />
            Flower of the Month
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            {flowerOfTheMonth.name}
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Discover the rich cultural heritage and symbolic meaning behind this month's featured bloom
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div ref={imageRef} className="relative">
            <Card className="p-8 bg-gradient-glass backdrop-blur-md border-primary/10">
              <div className="aspect-square bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg mb-6 flex items-center justify-center text-background font-luxury text-8xl shadow-lg shadow-amber-500/50">
                🌸
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{flowerOfTheMonth.month} Featured</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>Origin: {flowerOfTheMonth.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-5 h-5" />
                  <span>Symbolizes: {flowerOfTheMonth.meaning}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Content Section */}
          <div ref={contentRef} className="space-y-8">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-primary/10">
              <h3 className="font-luxury text-2xl font-bold mb-4 text-foreground">
                Cultural Significance
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {flowerOfTheMonth.description}
              </p>
              <ul className="space-y-3">
                {flowerOfTheMonth.culturalSignificance.map((significance, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{significance}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-background/30 backdrop-blur-sm border-primary/10">
                <h4 className="font-luxury text-lg font-semibold mb-3 text-foreground">
                  Available Colors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {flowerOfTheMonth.colors.map((color, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {color}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-background/30 backdrop-blur-sm border-primary/10">
                <h4 className="font-luxury text-lg font-semibold mb-3 text-foreground">
                  Season
                </h4>
                <p className="text-muted-foreground text-sm">
                  {flowerOfTheMonth.seasonality}
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-background/30 backdrop-blur-sm border-primary/10">
              <h4 className="font-luxury text-lg font-semibold mb-4 text-foreground">
                Care Instructions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flowerOfTheMonth.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-xs font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{instruction}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowerOfTheMonth;