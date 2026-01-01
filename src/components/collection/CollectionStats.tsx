import { memo } from "react";
import { motion } from "framer-motion";

const heroHighlights = [
  { value: "150+", label: "Signature Arrangements" },
  { value: "24/7", label: "Concierge Support" },
  { value: "20+", label: "Curated Themes" },
];

const CollectionStatsComponent = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-3 gap-3 sm:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          {heroHighlights.map((item) => (
            <motion.div
              key={item.label}
              className="relative rounded-3xl border border-[#e8d8b5] bg-white/90 backdrop-blur-lg px-3 py-4 sm:px-6 sm:py-5 text-left shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div className="text-xl sm:text-3xl font-luxury text-slate-900 mb-1 sm:mb-2">
                {item.value}
              </div>
              <div className="text-[0.6rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-slate-500">
                {item.label}
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 6, repeat: Infinity }}
                style={{ border: "1px solid rgba(199,158,72,0.25)" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export const CollectionStats = memo(CollectionStatsComponent);

































