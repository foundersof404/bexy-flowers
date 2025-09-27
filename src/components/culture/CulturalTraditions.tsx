import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Calendar, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const traditions = [
  {
    culture: "Japanese Ikebana",
    emoji: "🌸",
    description: "The ancient art of Japanese flower arrangement emphasizes harmony, peace, and beauty through minimalist design.",
    principles: ["Asymmetrical balance", "Use of space", "Seasonal awareness", "Natural beauty"],
    occasion: "Meditation and spiritual practice",
    colors: ["Pure White", "Soft Pink", "Natural Green"],
    philosophy: "Finding beauty in imperfection and impermanence"
  },
  {
    culture: "Victorian Language",
    emoji: "🌹",
    description: "In Victorian England, flowers conveyed secret messages when words couldn't be spoken aloud.",
    principles: ["Red roses = passionate love", "Yellow roses = friendship", "White lilies = purity", "Forget-me-nots = remembrance"],
    occasion: "Courtship and social communication",
    colors: ["Deep Red", "Pure White", "Soft Yellow"],
    philosophy: "Flowers as silent messengers of the heart"
  },
  {
    culture: "Indian Garlands",
    emoji: "🏵️",
    description: "Elaborate flower garlands (malas) play sacred roles in Hindu ceremonies and daily worship.",
    principles: ["Fresh flowers only", "Specific color combinations", "Sacred geometry", "Offering to deities"],
    occasion: "Religious ceremonies and festivals",
    colors: ["Saffron Orange", "Sacred Red", "Pure White"],
    philosophy: "Flowers as divine offerings connecting earth to heaven"
  },
  {
    culture: "European Cottage Style",
    emoji: "🌻",
    description: "Rustic, abundant arrangements celebrating the wild beauty of English countryside gardens.",
    principles: ["Mixed seasonal blooms", "Natural, unstructured form", "Garden-fresh appearance", "Abundant texture"],
    occasion: "Daily home decoration and celebrations",
    colors: ["Warm Yellow", "Lavender Purple", "Sage Green"],
    philosophy: "Bringing nature's spontaneous beauty indoors"
  }
];

const CulturalTraditions = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      }
    });

    cards.forEach((card, index) => {
      tl.fromTo(card,
        { 
          y: 100,
          opacity: 0,
          rotateX: 45,
          scale: 0.8
        },
        { 
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out"
        },
        index * 0.2
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
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
            <Globe className="w-4 h-4 mr-2" />
            Cultural Heritage
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            Floral Traditions Worldwide
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Explore the rich cultural heritage and symbolic meanings behind flower arrangements from different civilizations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {traditions.map((tradition, index) => (
            <div
              key={index}
              ref={addToRefs}
              className="perspective-1000"
            >
              <Card className="h-full p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-500 transform-3d">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{tradition.emoji}</div>
                  <h3 className="font-luxury text-xl font-bold text-foreground mb-2">
                    {tradition.culture}
                  </h3>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tradition.description}
                  </p>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Core Principles</span>
                    </div>
                    <ul className="space-y-1">
                      {tradition.principles.map((principle, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Primary Use</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tradition.occasion}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Philosophy</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{tradition.philosophy}"</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-foreground mb-2 block">Traditional Colors</span>
                    <div className="flex flex-wrap gap-1">
                      {tradition.colors.map((color, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Card className="inline-block p-8 bg-gradient-glass backdrop-blur-md border-primary/20">
            <h3 className="font-luxury text-2xl font-bold mb-4 text-foreground">
              Honor These Traditions
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Each Bexy Flowers arrangement can be customized to reflect these beautiful cultural traditions and their deep meanings.
            </p>
            <Badge className="bg-primary/20 text-primary">
              <Globe className="w-4 h-4 mr-2" />
              Available in Custom Orders
            </Badge>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CulturalTraditions;