import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryNavigationComponent = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryNavigationProps) => {
  return (
    <motion.nav
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 4, duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4 sm:py-6">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 lg:gap-6">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "relative px-3 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 text-xs sm:text-sm lg:text-base font-body transition-all duration-300",
                  "hover:text-primary focus:outline-none focus:text-primary",
                  selectedCategory === category.id 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">
                  {category.name}
                  <span className="ml-1 sm:ml-2 text-xs opacity-70">
                    ({category.count})
                  </span>
                </span>
                
                {/* Hover underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: selectedCategory === category.id ? "100%" : 0 
                  }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                
                {/* Glow effect for selected */}
                {selectedCategory === category.id && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.nav>
  );
};

// Export memoized version for better performance
export const CategoryNavigation = memo(CategoryNavigationComponent);