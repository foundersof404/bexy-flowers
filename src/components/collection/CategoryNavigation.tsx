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
      className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "relative px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-sm text-sm sm:text-base font-medium transition-all duration-300",
                    isSelected
                      ? "text-[#C79E48] bg-[#F5F1E8]"
                      : "text-slate-600 hover:text-slate-800"
                  )}
                  whileHover={{ scale: isSelected ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{category.name}</span>
                    <span className={cn(
                      "text-xs",
                      isSelected ? "text-[#C79E48]/80" : "text-slate-500"
                    )}>
                      ({category.count})
                    </span>
                  </span>
                  
                  {/* Golden underline for selected */}
                  {isSelected && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C79E48]"
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