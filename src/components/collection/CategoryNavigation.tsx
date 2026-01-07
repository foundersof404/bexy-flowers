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
    <nav
      className="sticky top-0 z-40 bg-[#FAF8F3]/98 backdrop-blur-md border-b border-[#E5DCC8]/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center py-3 sm:py-4 md:py-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "relative px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-sm text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold transition-all duration-300",
                    isSelected
                      ? "text-[#C79E48] bg-[#F5F1E8] shadow-sm"
                      : "text-[#6B5D52] hover:text-[#3D3027] hover:bg-[#F5F1E8]/50"
                  )}
                  whileHover={{ scale: isSelected ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-0.5 sm:gap-1">
                    <span className="whitespace-nowrap">{category.name}</span>
                    <span className={cn(
                      "text-[8px] sm:text-[10px] md:text-xs",
                      isSelected ? "text-[#C79E48]/70" : "text-[#8B7355]/70"
                    )}>
                      ({category.count})
                    </span>
                  </span>
                  
                  {/* Golden underline for selected */}
                  {isSelected && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C79E48] to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export memoized version for better performance
export const CategoryNavigation = memo(CategoryNavigationComponent);