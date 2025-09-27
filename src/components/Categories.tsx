import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

const categories = [
  { name: "Mother's Day", color: "bg-pink-200" },
  { name: "Valentine's Day", color: "bg-red-200" },
  { name: "Weddings", color: "bg-white" },
  { name: "Birthdays", color: "bg-amber-200" },
  { name: "Graduations", color: "bg-purple-200" },
  { name: "Anniversaries", color: "bg-rose-200" },
  { name: "Sympathy", color: "bg-blue-200" },
  { name: "Get Well Soon", color: "bg-green-200" },
  { name: "New Baby", color: "bg-pink-100" },
  { name: "Thank You", color: "bg-orange-200" },
  { name: "Seasonal Collections", color: "bg-amber-200" },
  { name: "Corporate Events", color: "bg-gray-200" }
];

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-luxury text-5xl md:text-6xl font-bold text-foreground mb-4">
            Shop by Occasion
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-platinum"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-platinum"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Scrollable Categories */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-16 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
              >
                <Card className="group w-64 h-48 cursor-pointer overflow-hidden border-2 border-border/50 hover:border-primary/50 shadow-platinum hover:shadow-luxury transition-luxury">
                  <CardContent className="p-0 h-full relative">
                    <div className={`w-full h-32 ${category.color} flex items-center justify-center relative overflow-hidden`}>
                      {/* Placeholder gradient for category image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      
                      {/* Category Icon Placeholder */}
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center relative z-10">
                        <div className="w-8 h-8 bg-primary rounded-full" />
                      </div>
                    </div>

                    <div className="p-4 bg-card h-16 flex items-center justify-center">
                      <h3 className="font-luxury text-lg font-semibold text-foreground text-center group-hover:text-primary transition-luxury">
                        {category.name}
                      </h3>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-luxury flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-full shadow-gold"
                      >
                        Explore
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;