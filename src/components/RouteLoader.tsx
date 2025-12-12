import { motion } from "framer-motion";

/**
 * Elegant route loading component matching Bexy Flowers brand
 * Displays while lazy-loaded routes are being fetched
 */
const RouteLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f1ea]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Gold Spinner */}
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: '#C29A43',
              borderRightColor: '#C29A43',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              boxShadow: '0 0 20px rgba(194, 154, 67, 0.3)'
            }}
          />
        </motion.div>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h3 
            className="text-xl font-serif font-semibold tracking-wide"
            style={{
              backgroundImage: 'linear-gradient(90deg, #B7893C 0%, #E7D4A8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            }}
          >
            Bexy Flowers
          </h3>
          <p className="text-sm text-gray-500 mt-1">Loading...</p>
        </motion.div>

        {/* Decorative Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#C29A43' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteLoader;


