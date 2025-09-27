import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, Heart } from "lucide-react";

const BouquetBuilder = () => {
  return (
    <section className="py-20 px-4 bg-gradient-platinum">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-luxury text-5xl md:text-6xl font-bold text-foreground mb-4">
            Custom Bouquet Builder
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Create your perfect arrangement with our interactive bouquet builder. 
            Choose flowers, colors, and styles to craft something uniquely yours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Builder Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative mx-auto w-80 h-80 flex items-center justify-center">
              {/* Circular Container */}
              <motion.div
                className="w-72 h-72 rounded-full border-4 border-primary/30 flex items-center justify-center relative overflow-hidden shadow-luxury"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full" />
                
                {/* Sample Flowers */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8 bg-primary rounded-full"
                    style={{
                      left: `${45 + 30 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                      top: `${45 + 30 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Center Element */}
                <motion.div
                  className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-gold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </motion.div>
              </motion.div>

              {/* Floating Elements */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-primary/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-gold">
                  <Palette className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-luxury text-2xl font-semibold text-foreground mb-2">
                    Choose Your Colors
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Select from our premium color palette or create custom combinations 
                    to match your vision perfectly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-gold">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-luxury text-2xl font-semibold text-foreground mb-2">
                    Premium Flowers
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Handpick from our curated selection of luxury flowers, each one 
                    carefully sourced for exceptional quality and beauty.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-gold">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-luxury text-2xl font-semibold text-foreground mb-2">
                    Personal Touch
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Add personal messages, special ribbons, and luxury packaging 
                    to make your bouquet truly one-of-a-kind.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="font-body text-lg px-12 py-6 rounded-full gradient-gold text-primary-foreground font-semibold shadow-luxury hover:shadow-gold hover:glow-gold transition-luxury"
              >
                Start Customizing
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BouquetBuilder;