import { motion } from "framer-motion";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CollectionFooter = () => {
  return (
    <footer className="relative bg-card/30 backdrop-blur-sm border-t border-border/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-luxury text-primary">Bexy Flowers</h3>
            <p className="text-muted-foreground leading-relaxed font-body">
              Crafting luxury floral experiences for life's most precious moments. 
              Each bouquet tells a story of elegance, beauty, and artisanal excellence.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-luxury text-foreground">Quick Links</h4>
            <div className="space-y-3">
              {[
                "About Us",
                "Custom Bouquets", 
                "Delivery Info",
                "Care Guide",
                "Contact",
                "Privacy Policy"
              ].map((link, index) => (
                <motion.a
                  key={link}
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors font-body"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-luxury text-foreground">Stay Updated</h4>
            <p className="text-muted-foreground font-body">
              Subscribe to receive exclusive offers and floral inspiration.
            </p>
            <div className="space-y-3">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/50 border-border/30 focus:border-primary focus:ring-primary/20"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm font-body">
            © 2024 Bexy Flowers. All rights reserved. Made with{" "}
            <Heart className="inline w-4 h-4 text-primary mx-1" />
            for flower lovers.
          </p>
          <div className="flex gap-6 text-sm">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-body"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-body"
            >
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
};