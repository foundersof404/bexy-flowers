import { motion } from "framer-motion";
import { Heart, Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

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
                <a 
                  href="https://api.whatsapp.com/send/?phone=96176104882&text&type=phone_number&app_absent=0&wame_ctl=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-primary transition-colors"
                >
                  +961 76 104 882
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <a 
                  href="mailto:bexyflowersmsg@gmail.com" 
                  className="text-background/80 hover:text-primary transition-colors"
                >
                  bexyflowersmsg@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <a 
                  href="https://maps.app.goo.gl/DHhr6EeXay2powJeA?g_st=iw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-primary transition-colors"
                >
                  View Location
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              <motion.a
                href="https://api.whatsapp.com/send/?phone=96176104882&text&type=phone_number&app_absent=0&wame_ctl=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/bexyflowers?igsh=cTcybzM0dzVkc25v"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@bexyflower?_r=1&_t=ZS-91i2FtAJdVF"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </motion.a>
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