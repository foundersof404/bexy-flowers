import { motion } from "framer-motion";
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-luxury text-3xl font-bold text-primary">
              Bexy Flowers
            </h3>
            <p className="font-body text-background/80 leading-relaxed">
              Crafting luxury floral experiences with premium arrangements and bespoke designs for every special moment.
            </p>
            <div className="flex items-center space-x-2 text-primary">
              <Heart className="w-4 h-4" />
              <span className="font-body text-sm">Made with love</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-luxury text-xl font-semibold text-primary">Quick Links</h4>
            <ul className="space-y-2 font-body">
              <li><a href="/collection" className="text-background/80 hover:text-primary transition-colors">Shop All</a></li>
              <li><a href="/customize" className="text-background/80 hover:text-primary transition-colors">Custom Bouquets</a></li>
              <li><a href="/collection" className="text-background/80 hover:text-primary transition-colors">Occasions</a></li>
              <li><a href="/about" className="text-background/80 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-background/80 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-luxury text-xl font-semibold text-primary">Customer Service</h4>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Delivery Info</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Care Guide</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Support</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-luxury text-xl font-semibold text-primary">Get In Touch</h4>
            <div className="space-y-3 font-body">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-background/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-background/80">hello@bexyflowers.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-background/80">123 Luxury Lane, City</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-background/60 text-sm">
            © 2024 Bexy Flowers. All rights reserved. Crafted with care and elegance.
          </p>
          <div className="flex space-x-6 font-body text-sm">
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Cookies</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;