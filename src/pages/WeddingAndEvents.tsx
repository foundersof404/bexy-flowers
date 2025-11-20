import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Flower2, Home, Church, Car, UtensilsCrossed, Wine, Calendar } from "lucide-react";
import LazySection from "@/components/LazySection";
import UltraNavigation from "@/components/UltraNavigation";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const GOLD_COLOR = "rgb(199, 158, 72)";
const GOLD_HEX = "#c79e48";

// Custom SVG Icons for floating elements
const BeerIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Beer mug */}
    <rect x="35" y="25" width="30" height="50" rx="3" fill="currentColor" opacity="0.9"/>
    {/* Handle */}
    <path d="M65 30 Q75 30, 75 40 Q75 50, 65 50" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.7"/>
    {/* Foam */}
    <ellipse cx="50" cy="25" rx="15" ry="8" fill="white" opacity="0.8"/>
    <circle cx="45" cy="22" r="3" fill="white" opacity="0.9"/>
    <circle cx="50" cy="20" r="3" fill="white" opacity="0.9"/>
    <circle cx="55" cy="22" r="3" fill="white" opacity="0.9"/>
    {/* Beer color */}
    <rect x="37" y="30" width="26" height="42" rx="2" fill="#FFD700" opacity="0.6"/>
    {/* Bubbles */}
    <circle cx="45" cy="45" r="2" fill="white" opacity="0.5"/>
    <circle cx="55" cy="50" r="2" fill="white" opacity="0.5"/>
    <circle cx="50" cy="60" r="1.5" fill="white" opacity="0.4"/>
  </svg>
);

const WeddingCakeIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bottom tier */}
    <ellipse cx="50" cy="75" rx="28" ry="8" fill="currentColor" opacity="0.9"/>
    <rect x="22" y="65" width="56" height="12" rx="4" fill="currentColor" opacity="0.85"/>
    {/* Middle tier */}
    <ellipse cx="50" cy="60" rx="22" ry="7" fill="white" opacity="0.8"/>
    <rect x="28" y="52" width="44" height="10" rx="3" fill="white" opacity="0.75"/>
    {/* Top tier */}
    <ellipse cx="50" cy="45" rx="16" ry="6" fill="white" opacity="0.9"/>
    <rect x="34" y="38" width="32" height="10" rx="2" fill="white" opacity="0.85"/>
    {/* Decorative icing */}
    <circle cx="30" cy="68" r="3" fill="white" opacity="0.7"/>
    <circle cx="50" cy="68" r="3" fill="white" opacity="0.7"/>
    <circle cx="70" cy="68" r="3" fill="white" opacity="0.7"/>
    <circle cx="35" cy="58" r="2.5" fill="currentColor" opacity="0.6"/>
    <circle cx="50" cy="58" r="2.5" fill="currentColor" opacity="0.6"/>
    <circle cx="65" cy="58" r="2.5" fill="currentColor" opacity="0.6"/>
    {/* Topper - bride and groom */}
    <circle cx="45" cy="40" r="4" fill="currentColor" opacity="0.8"/>
    <circle cx="55" cy="40" r="4" fill="currentColor" opacity="0.8"/>
    <circle cx="45" cy="37" r="2" fill="white"/>
    <circle cx="55" cy="37" r="2" fill="white"/>
    {/* Cake stand base */}
    <ellipse cx="50" cy="85" rx="30" ry="5" fill="currentColor" opacity="0.6"/>
    <path d="M20 85 Q50 88, 80 85" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none"/>
  </svg>
);

const BrideIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Veil - more elegant */}
    <path d="M25 20 Q50 15, 75 20 Q50 65, 25 60 Z" fill="currentColor" opacity="0.25"/>
    <path d="M30 22 Q50 18, 70 22 Q50 58, 30 55 Z" fill="white" opacity="0.15"/>
    {/* Wedding dress - elegant and flowing */}
    <path d="M35 95 Q40 85, 40 70 Q40 55, 45 60 L50 62 L55 60 Q60 55, 60 70 Q60 85, 65 95" fill="currentColor" opacity="0.95"/>
    <ellipse cx="50" cy="68" rx="12" ry="22" fill="currentColor" opacity="0.9"/>
    {/* Bodice */}
    <path d="M38 65 Q50 58, 62 65 L62 75 L38 75 Z" fill="white" opacity="0.2"/>
    {/* Head */}
    <circle cx="50" cy="32" r="16" fill="currentColor" opacity="0.9"/>
    {/* Eyes */}
    <circle cx="45" cy="30" r="3" fill="white"/>
    <circle cx="55" cy="30" r="3" fill="white"/>
    {/* Smile */}
    <path d="M45 36 Q50 39, 55 36" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
    {/* Dress details - train */}
    <path d="M65 95 Q70 100, 75 98" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none"/>
    {/* Bouquet */}
    <circle cx="35" cy="72" r="7" fill="currentColor" opacity="0.7"/>
    <circle cx="33" cy="70" r="1.5" fill="white"/>
    <circle cx="37" cy="70" r="1.5" fill="white"/>
    <circle cx="35" cy="68" r="1.5" fill="white"/>
    {/* Crown/tiara */}
    <path d="M42 20 Q50 15, 58 20" stroke="currentColor" strokeWidth="2" opacity="0.6" fill="none"/>
    <path d="M45 18 Q50 14, 55 18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" fill="none"/>
  </svg>
);

const BouquetIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stem */}
    <rect x="47" y="60" width="6" height="30" fill="currentColor" opacity="0.6"/>
    {/* Leaves */}
    <ellipse cx="42" cy="70" rx="8" ry="4" fill="currentColor" opacity="0.5" transform="rotate(-30 42 70)"/>
    <ellipse cx="58" cy="75" rx="8" ry="4" fill="currentColor" opacity="0.5" transform="rotate(30 58 75)"/>
    {/* Flowers */}
    <circle cx="40" cy="45" r="8" fill="currentColor" opacity="0.9"/>
    <circle cx="38" cy="43" r="2" fill="white"/>
    <circle cx="50" cy="40" r="10" fill="currentColor" opacity="0.9"/>
    <circle cx="48" cy="38" r="2.5" fill="white"/>
    <circle cx="60" cy="45" r="8" fill="currentColor" opacity="0.9"/>
    <circle cx="58" cy="43" r="2" fill="white"/>
    <circle cx="48" cy="52" r="7" fill="currentColor" opacity="0.9"/>
    <circle cx="46" cy="50" r="2" fill="white"/>
    {/* Ribbon */}
    <rect x="38" y="55" width="24" height="8" rx="2" fill="currentColor" opacity="0.4"/>
    <path d="M44 59 Q50 57, 56 59" stroke="white" strokeWidth="1" opacity="0.5" fill="none"/>
  </svg>
);

const WeddingRingIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.8"/>
    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6"/>
    <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3"/>
    <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.9"/>
  </svg>
);

const DiamondRingIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ring band */}
    <ellipse cx="50" cy="50" rx="28" ry="20" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.8"/>
    <ellipse cx="50" cy="50" rx="23" ry="16" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6"/>
    {/* Diamond setting */}
    <path d="M50 20 L55 35 L50 30 L45 35 Z" fill="white" opacity="0.95" stroke="currentColor" strokeWidth="1"/>
    <path d="M50 30 L55 35 L50 40 L45 35 Z" fill="white" opacity="0.85"/>
    {/* Diamond facets */}
    <path d="M50 20 L52 25 L50 30 Z" fill="white" opacity="0.9"/>
    <path d="M50 20 L48 25 L50 30 Z" fill="white" opacity="0.9"/>
    <path d="M50 30 L52 35 L50 40 Z" fill="white" opacity="0.7"/>
    <path d="M50 30 L48 35 L50 40 Z" fill="white" opacity="0.7"/>
    {/* Sparkle effect */}
    <circle cx="50" cy="25" r="1.5" fill="white" opacity="0.8"/>
    <circle cx="52" cy="28" r="1" fill="white" opacity="0.6"/>
    <circle cx="48" cy="28" r="1" fill="white" opacity="0.6"/>
    {/* Side diamonds */}
    <circle cx="30" cy="50" r="3" fill="white" opacity="0.7"/>
    <circle cx="70" cy="50" r="3" fill="white" opacity="0.7"/>
  </svg>
);

// Floating decorative element component
const FloatingIcon = ({ 
  Icon, 
  position, 
  delay = 0, 
  duration = 6,
  size = 40 
}: { 
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | React.FC<any>;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  duration?: number;
  size?: number;
}) => {
  const isMobile = useIsMobile();
  const [offset] = React.useState(() => Math.random() * 1000);
  // Make icons smaller on mobile
  const adjustedSize = isMobile ? Math.max(size * 0.6, 24) : size;
  
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{
        ...position,
        width: `${adjustedSize}px`,
        height: `${adjustedSize}px`,
        color: GOLD_COLOR,
        opacity: isMobile ? 0.15 : 0.25,
        filter: 'drop-shadow(0 2px 4px rgba(199, 158, 72, 0.2))',
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.sin((Date.now() + offset) / 1000) * 20, 0],
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <Icon className="w-full h-full" style={{ color: GOLD_COLOR }} />
    </motion.div>
  );
};

// Wedding images - properly encoded paths
const weddingImages = [
  encodeURI("/assets/wedding % events/IMG_5461.jpg"),
  encodeURI("/assets/wedding % events/IMG_4875.jpg"),
  encodeURI("/assets/wedding % events/IMG_2670.jpg"),
  encodeURI("/assets/wedding % events/IMG_1791.jpg"),
  encodeURI("/assets/wedding % events/IMG_1784.jpg"),
  encodeURI("/assets/wedding % events/IMG_1673.JPG"),
  encodeURI("/assets/wedding % events/IMG_1672.JPG"),
  encodeURI("/assets/wedding % events/IMG_1649.jpg"),
  encodeURI("/assets/wedding % events/IMG_2802.JPG"),
];

const WeddingHero = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[rgba(199,158,72,0.05)] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-[rgba(199,158,72,0.05)] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-6 h-6" style={{ color: GOLD_COLOR }} />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD_COLOR }}>
              Wedding Packages
            </span>
            <Sparkles className="w-6 h-6" style={{ color: GOLD_COLOR }} />
          </motion.div>

          <motion.h1
            className={`${isMobile ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl lg:text-8xl'} font-serif font-bold mb-6 leading-tight`}
            style={{ color: '#1a1a1a' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Dream
            <br />
            <span className="relative inline-block">
              <span style={{ color: GOLD_COLOR }}>Wedding</span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgba(199,158,72,0.6)] to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
            <br />
            Awaits
          </motion.h1>

          <motion.p
            className={`${isMobile ? 'text-base md:text-lg' : 'text-xl md:text-2xl'} text-gray-600 max-w-3xl mx-auto mb-8 font-light leading-relaxed`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Crafting timeless elegance through bespoke floral artistry
            <br className="hidden md:block" />
            for your most precious day
          </motion.p>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <FloatingIcon Icon={BrideIcon} position={{ top: "10%", left: "8%" }} delay={0} duration={6} size={60} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "20%", right: "10%" }} delay={1} duration={7} size={50} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "28%", left: "15%" }} delay={0.6} duration={6.5} size={48} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ bottom: "20%", right: "12%" }} delay={1.3} duration={7.2} size={52} />
      <FloatingIcon Icon={BouquetIcon} position={{ top: "35%", left: "5%" }} delay={2} duration={5.5} size={45} />
      <FloatingIcon Icon={BeerIcon} position={{ bottom: "25%", left: "12%" }} delay={1.5} duration={6.5} size={55} />
      <FloatingIcon Icon={Flower2} position={{ bottom: "15%", right: "8%" }} delay={0.5} duration={5} size={40} />
      <FloatingIcon Icon={Heart} position={{ top: "50%", left: "3%" }} delay={2.5} duration={6} size={35} />
      <FloatingIcon Icon={DiamondRingIcon} position={{ top: "60%", right: "5%" }} delay={3} duration={7.5} size={40} />
      <FloatingIcon Icon={WeddingRingIcon} position={{ top: "55%", left: "8%" }} delay={2.8} duration={6.8} size={36} />
      <FloatingIcon Icon={BouquetIcon} position={{ bottom: "30%", right: "15%" }} delay={1.8} duration={5.8} size={50} />
      <FloatingIcon Icon={Sparkles} position={{ top: "15%", left: "50%" }} delay={0.8} duration={4.5} size={30} />
      <FloatingIcon Icon={WeddingRingIcon} position={{ bottom: "40%", left: "20%" }} delay={2.2} duration={6.2} size={35} />
      <FloatingIcon Icon={BrideIcon} position={{ top: "70%", right: "20%" }} delay={1.2} duration={7.2} size={48} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ bottom: "10%", left: "45%" }} delay={2.8} duration={5.5} size={52} />
      <FloatingIcon Icon={BeerIcon} position={{ top: "45%", right: "25%" }} delay={1.8} duration={6.8} size={42} />
      <FloatingIcon Icon={Sparkles} position={{ bottom: "50%", left: "30%" }} delay={0.3} duration={5.2} size={28} />
      <FloatingIcon Icon={DiamondRingIcon} position={{ bottom: "35%", right: "25%" }} delay={1.7} duration={6.5} size={38} />
    </section>
  );
};

const PackageSection = () => {
  const isMobile = useIsMobile();
  
  const packageFeatures = [
    {
      icon: Flower2,
      title: "Bridal Bouquet",
      description: "Customized bridal bouquet with fresh real flowers of your choice",
    },
    {
      icon: Flower2,
      title: "Bridesmaid Bouquet",
      description: "Elegant bridesmaids' bouquets matching your wedding theme",
    },
    {
      icon: Home,
      title: "Bride & Groom's House Decorations",
      description: "Beautiful floral arrangements for both bride and groom's houses",
    },
    {
      icon: Church,
      title: "Church Decorations",
      description: "Stunning altar and entrance decorations with fresh and artificial flowers",
    },
    {
      icon: Wine,
      title: "Welcome Drink Decoration",
      description: "Elegant table settings with candles and floral centerpieces",
    },
    {
      icon: UtensilsCrossed,
      title: "Party Decoration",
      description: "Beautiful dining table centerpieces for your celebration",
    },
    {
      icon: Flower2,
      title: "Tables Centrepieces",
      description: "Large centerpieces with high-quality white artificial flowers",
    },
    {
      icon: Car,
      title: "Car Flower Decoration",
      description: "Three cars decorated with real flowers, including main bridal car",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-[rgba(250,250,250,1)] overflow-hidden">
      {/* Floating decorative elements */}
      <FloatingIcon Icon={BouquetIcon} position={{ top: "10%", left: "2%" }} delay={0.3} duration={6.5} size={45} />
      <FloatingIcon Icon={BeerIcon} position={{ top: "20%", right: "3%" }} delay={1.8} duration={7} size={50} />
      <FloatingIcon Icon={DiamondRingIcon} position={{ bottom: "15%", left: "4%" }} delay={2.3} duration={5.8} size={40} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ bottom: "25%", right: "2%" }} delay={1.2} duration={6.2} size={48} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "35%", left: "1%" }} delay={0.6} duration={6.5} size={46} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ bottom: "18%", right: "4%" }} delay={1.4} duration={7.1} size={50} />
      <FloatingIcon Icon={Flower2} position={{ top: "50%", left: "1%" }} delay={0.7} duration={5.5} size={35} />
      <FloatingIcon Icon={Heart} position={{ bottom: "5%", right: "8%" }} delay={2.5} duration={7.5} size={38} />
      <FloatingIcon Icon={BrideIcon} position={{ top: "30%", right: "1%" }} delay={1.5} duration={6.8} size={42} />
      <FloatingIcon Icon={WeddingRingIcon} position={{ bottom: "40%", left: "1%" }} delay={0.9} duration={6} size={32} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Package Card */}
        <motion.div
          className="relative mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-[rgba(199,158,72,0.2)]">
            {/* Gold gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(199,158,72,0.05)] via-transparent to-[rgba(199,158,72,0.05)]" />
            
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center gap-2 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: GOLD_COLOR }} />
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD_COLOR }}>
                    Standard Package
                  </span>
                  <Sparkles className="w-5 h-5" style={{ color: GOLD_COLOR }} />
                </motion.div>

                <motion.h2
                  className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-serif font-bold mb-6`}
                  style={{ color: '#1a1a1a' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Standard Wedding Package
                </motion.h2>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <span className={`${isMobile ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl'} font-bold font-serif`} style={{ color: GOLD_COLOR }}>
                    $3,200
                  </span>
                </motion.div>

                <motion.p
                  className={`${isMobile ? 'text-base md:text-lg' : 'text-lg md:text-xl'} text-gray-600 max-w-3xl mx-auto leading-relaxed`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Our Standard Package offers a complete floral and décor experience designed to make your wedding day elegant and unforgettable. This package includes full arrangements from Bexy Flowers – from ceremony to reception – ensuring every detail is beautifully styled and cohesive. We take care of everything so you can focus on celebrating your special day.
                  <br className="mt-4" />
                  <span className="font-semibold" style={{ color: GOLD_COLOR }}>
                    The package can be customized upon request
                  </span>
                </motion.p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {packageFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="relative bg-white rounded-2xl p-6 border border-[rgba(199,158,72,0.15)] hover:border-[rgba(199,158,72,0.4)] transition-all duration-300 hover:shadow-xl group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(199,158,72,0.03)] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${GOLD_COLOR}15` }}>
                          <Icon className="w-6 h-6" style={{ color: GOLD_COLOR }} />
                        </div>
                        <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: '#1a1a1a' }}>
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button
                  size="lg"
                  className={`${isMobile ? 'text-base px-8 py-6' : 'text-lg px-12 py-7'} font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group`}
                  style={{
                    background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                    color: 'white',
                  }}
                  onClick={() => {
                    // Scroll to contact section or open contact modal
                    const contactEl = document.getElementById('contact-section');
                    if (contactEl) {
                      contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      // Fallback: could open a contact form or redirect
                      window.location.href = 'mailto:info@bexyflowers.com?subject=Wedding Package Inquiry';
                    }
                  }}
                >
                  <motion.span
                    className="relative z-10 flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="w-5 h-5" />
                    Contact Us Now to Reserve a Meeting
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);
  const isMobile = useIsMobile();

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Floating decorative elements */}
      <FloatingIcon Icon={BouquetIcon} position={{ top: "5%", left: "3%" }} delay={0.5} duration={6.2} size={42} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "10%", right: "4%" }} delay={1.5} duration={7.3} size={46} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "18%", left: "4%" }} delay={0.7} duration={6.4} size={44} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ bottom: "12%", right: "5%" }} delay={1.8} duration={7.1} size={48} />
      <FloatingIcon Icon={BeerIcon} position={{ bottom: "10%", left: "2%" }} delay={2.1} duration={5.9} size={44} />
      <FloatingIcon Icon={DiamondRingIcon} position={{ bottom: "15%", right: "3%" }} delay={0.8} duration={6.5} size={38} />
      <FloatingIcon Icon={BrideIcon} position={{ top: "40%", left: "1%" }} delay={1.8} duration={7} size={40} />
      <FloatingIcon Icon={Sparkles} position={{ bottom: "5%", right: "6%" }} delay={2.4} duration={5.5} size={30} />
      <FloatingIcon Icon={Heart} position={{ top: "60%", right: "2%" }} delay={1.2} duration={6.8} size={36} />
      <FloatingIcon Icon={WeddingRingIcon} position={{ bottom: "30%", left: "1%" }} delay={0.6} duration={6.3} size={34} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-serif font-bold mb-4`} style={{ color: '#1a1a1a' }}>
            Our Wedding Creations
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 max-w-2xl mx-auto`}>
            Explore our stunning wedding floral arrangements and decorations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {weddingImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`Wedding decoration ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-semibold">View Details</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full screen image modal */}
      {selectedImage !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            src={weddingImages[selectedImage]}
            alt={`Wedding decoration ${selectedImage + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold hover:scale-110 transition-transform"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </motion.div>
      )}
    </section>
  );
};

const ContactSection = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="contact-section"
      className="relative py-20 bg-gradient-to-b from-[rgba(250,250,250,1)] to-white overflow-hidden"
    >
      {/* Floating decorative elements */}
      <FloatingIcon Icon={BouquetIcon} position={{ top: "8%", left: "5%" }} delay={0.4} duration={6.4} size={48} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "15%", right: "6%" }} delay={1.6} duration={7.2} size={50} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ top: "22%", left: "6%" }} delay={0.8} duration={6.6} size={46} />
      <FloatingIcon Icon={WeddingCakeIcon} position={{ bottom: "15%", right: "7%" }} delay={1.5} duration={7.3} size={50} />
      <FloatingIcon Icon={BeerIcon} position={{ bottom: "12%", left: "4%" }} delay={2.2} duration={6.1} size={46} />
      <FloatingIcon Icon={DiamondRingIcon} position={{ bottom: "18%", right: "5%" }} delay={0.9} duration={6.6} size={42} />
      <FloatingIcon Icon={BrideIcon} position={{ top: "35%", left: "2%" }} delay={1.9} duration={7.1} size={44} />
      <FloatingIcon Icon={Heart} position={{ bottom: "8%", right: "4%" }} delay={1.3} duration={6.9} size={40} />
      <FloatingIcon Icon={WeddingRingIcon} position={{ bottom: "25%", left: "2%" }} delay={0.7} duration={6.2} size={36} />
      <FloatingIcon Icon={Sparkles} position={{ top: "25%", right: "2%" }} delay={2.5} duration={5.7} size={32} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[rgba(199,158,72,0.2)]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
              style={{ backgroundColor: `${GOLD_COLOR}15` }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Calendar className="w-8 h-8" style={{ color: GOLD_COLOR }} />
            </motion.div>

            <h2 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-serif font-bold mb-4`} style={{ color: '#1a1a1a' }}>
              Ready to Begin Your Journey?
            </h2>
            <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 mb-8`}>
              Let's discuss how we can make your special day unforgettable
            </p>
          </div>

          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="w-full text-lg px-8 py-7 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                  color: 'white',
                }}
                onClick={() => {
                  window.location.href = 'mailto:info@bexyflowers.com?subject=Wedding Package Inquiry';
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  <Calendar className="w-5 h-5" />
                  Schedule a Consultation
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg px-8 py-7 font-semibold rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: GOLD_COLOR,
                  color: GOLD_COLOR,
                }}
                onClick={() => {
                  // WhatsApp link - replace with actual number
                  window.open('https://wa.me/1234567890?text=Hi, I\'m interested in your Wedding Package', '_blank');
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  💬 Contact via WhatsApp
                </span>
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              We respond to all inquiries within 24 hours
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WeddingAndEvents = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative bg-white">
      <UltraNavigation />
      <div className="relative z-10">
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <WeddingHero />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <PackageSection />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <ImageGallery />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <ContactSection />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="600px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>
    </div>
  );
};

export default WeddingAndEvents;