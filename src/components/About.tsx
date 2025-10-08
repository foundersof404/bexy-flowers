import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Heart, Award, Users, Star, Crown, Sparkles, Flower2, Leaf } from "lucide-react";
// SUGGESTION: Import a high-quality image of your signature product.
// For now, using a placeholder - you should add your actual signature glitter flower image
import signatureGlitterFlower from '@/assets/about-image.jpg'; // Updated to about page image
import pinkFlower from '@/assets/flowers/pink.png';
import redFlower from '@/assets/flowers/red.png';

const About = () => {
  // SUGGESTION: Refined and consolidated stats for clarity and credibility.
  const stats = [
    { number: "15k+", label: "Bouquets Delivered", icon: <Users className="w-6 h-6" /> },
    { number: "5.0", suffix: "★", label: "Average Rating", icon: <Star className="w-6 h-6" /> },
    { number: "24/7", label: "Online Ordering", icon: <Heart className="w-6 h-6" /> },
    { number: "25+", label: "Years Combined Experience", icon: <Award className="w-6 h-6" /> }
  ];

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  
  // Detect mobile to reduce parallax amplitude
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(("matches" in e ? e.matches : (e as MediaQueryList).matches));
    handler(mq);
    mq.addEventListener?.("change", handler as (ev: MediaQueryListEvent) => void);
    return () => mq.removeEventListener?.("change", handler as (ev: MediaQueryListEvent) => void);
  }, []);

  const parallaxYPrimary = useTransform(scrollYProgress, [0, 1], isMobile ? [-20, 20] : [-60, 60]);
  const parallaxYSecondary = useTransform(scrollYProgress, [0, 1], isMobile ? [15, -15] : [40, -40]);
  const prefersReducedMotion = useReducedMotion();
  const yPrimary = prefersReducedMotion ? 0 : (parallaxYPrimary as unknown as number | any);
  const ySecondary = prefersReducedMotion ? 0 : (parallaxYSecondary as unknown as number | any);

  // Enhanced scroll effect for signature image - creates un-zoom parallax effect
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const imageScale = useTransform(imageScrollProgress, [0, 1], [1, 1.1]);
  const finalImageScale = prefersReducedMotion ? 1 : imageScale;

  // --- POWERFUL LUXURY PAGE TRANSITION VARIANTS ---
  const pageTransitionVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 30,
      transition: { duration: 0 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.4,
        ease: [0.25, 0.46, 0.45, 0.94], // More dramatic easing
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  } as const;

  const overlayVariants = {
    hidden: {
      y: "0%",
      scale: 1.1,
      opacity: 1,
      transition: { duration: 0 }
    },
    visible: {
      y: "-100%",
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 1.6,
        ease: [0.23, 1, 0.32, 1], // Powerful spring-like easing
        delay: 0.3
      }
    }
  } as const;

  // Enhanced background elements animation
  const backgroundVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -5,
      transition: { duration: 0 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5
      }
    }
  } as const;

  // --- POWERFUL ANIMATION VARIANTS (cinematic and dramatic) ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        staggerChildren: 0.3, 
        delayChildren: 0.4,
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    }
  } as const;

  const headingReveal = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      clipPath: "inset(0 0 100% 0)",
      scale: 0.9,
      rotateX: -15
    },
    show: { 
      opacity: 1, 
      y: 0, 
      clipPath: "inset(0 0 0% 0)",
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 1.2
      } 
    }
  } as const;

  const paragraphReveal = {
    hidden: { opacity: 0, y: 40, x: -20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1,
      transition: { 
        duration: 1, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      } 
    }
  } as const;

  const logoReveal = {
    hidden: { 
      opacity: 0, 
      scale: 0.5, 
      rotate: -180,
      filter: "blur(10px)"
    },
    show: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        duration: 1.5
      } 
    }
  } as const;

  const imageReveal = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotateY: -45,
      filter: "blur(20px)",
      borderRadius: "50%"
    },
    show: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      filter: "blur(0px)",
      borderRadius: "1rem",
      transition: { 
        duration: 1.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.6
      } 
    }
  } as const;

  // Enhanced CTA button variants with powerful hover effects
  const ctaButtonVariants = {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      filter: "brightness(1)"
    },
    hover: { 
      scale: 1.08, 
      y: -8,
      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
      filter: "brightness(1.1)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95,
      y: -2,
      transition: { duration: 0.1 }
    }
  } as const;

  // Powerful stats card animations
  const statsCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.8,
      rotateX: -20
    },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        duration: 1
      } 
    }
  } as const;

  return (
    <motion.section 
      ref={sectionRef} 
      className="relative py-28 px-4 overflow-hidden" 
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fff6f9 50%, #fdecef 100%)' }}
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
    >
      

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 } 
            }
          }}
        >
          
          {/* SUGGESTION: Improved SEO-friendly H1 and more engaging copy */}
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-slate-800 mb-4" 
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={headingReveal}
          >
            The Art of Floral Couture
          </motion.h1>
          <motion.p 
            className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed" 
            style={{ fontFamily: 'Inter, ui-sans-serif, system-ui', lineHeight: 1.8 }}
            variants={paragraphReveal}
          >
            Welcome to Bexy Flowers, where generations of artistry meet modern luxury. Discover Lebanon's first and only glitter flower atelier.
          </motion.p>
          <motion.div
            className="mx-auto mt-6 mb-2 h-px w-24 bg-amber-300/70"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Main Content (Image-first layout for visual impact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-center mb-24">
          {/* Enhanced Signature Image with Powerful 3D Reveal Effect */}
          <motion.div 
            ref={imageRef}
            className="rounded-full overflow-hidden shadow-xl order-1 lg:order-2 mt-4 lg:mt-6 w-72 h-50
             sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]"
            style={{ 
             
              boxShadow: '0 10px 30px rgb(198, 156, 72), 0 0 24px rgba(198, 157, 72, 0.2)'
            }}
            variants={imageReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.img 
              src={signatureGlitterFlower} 
              alt="Signature glitter-dusted rose bouquet" 
              className="w-full h-full object-cover" 
            style={{ 
              scale: finalImageScale,
              boxShadow: '0 0 0 5px rgba(212, 175, 55, 0.5)'
            }}
            />
          </motion.div>

          {/* Narrative */}
          <motion.div
            className="space-y-8 order-2 lg:order-1"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
          >
            <div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" 
                style={{ fontFamily: 'Playfair Display, serif' }}
                variants={headingReveal}
              >
                Our Story
              </motion.h2>
              <motion.div 
                className="w-24 h-[3px] bg-amber-400/90 rounded-full mb-8 origin-left" 
                initial={{ scaleX: 0 }} 
                whileInView={{ scaleX: 1 }} 
                transition={{ type: "spring", stiffness: 280, damping: 12, delay: 0.1 }} 
                viewport={{ once: true }} 
              />
            </div>

            {/* SUGGESTION: More personal and compelling story */}
            <div className="space-y-6 text-slate-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui', lineHeight: 1.9 }}>
              <motion.p variants={paragraphReveal}>
                Born in 2024 from a family legacy of over 25 years in floral design, Bexy Flowers introduced a dream to Lebanon: the country's first glitter flower boutique. We blend time-honored techniques with a spark of modern magic.
              </motion.p>
              <motion.p variants={paragraphReveal}>
                Our artisans hand-select each bloom, from velvety David Austin roses sourced from English gardens to exotic orchids from the tropics, ensuring every arrangement is a masterpiece of freshness and rarity.
              </motion.p>
              <motion.p variants={paragraphReveal}>
                We believe flowers are more than gifts; they are stories, emotions, and memories captured in nature's beauty.
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-2 items-stretch">
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-amber-100/60 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(198,157,72,0.18)]">
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C69D48" strokeWidth="1.5" className="w-5 h-5"><path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7l3-7z"/></svg>
                  Our Mission
                </div>
                <div className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  To craft breathtaking floral narratives that turn your cherished moments into unforgettable memories.
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-amber-100/60 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(198,157,72,0.18)]">
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C69D48" strokeWidth="1.5" className="w-5 h-5"><path d="M8 5l4-3 4 3 3 4-3 4-4 3-4-3-3-4 3-4z"/></svg>
                  Our Vision
                </div>
                <div className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  To be Lebanon's most sought-after floral couturier, celebrated for our pioneering designs and artistry.
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2 flex items-center justify-center py-2">
                <div className="h-px w-24 bg-amber-200" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C69D48" strokeWidth="1.2" className="w-5 h-5 mx-3"><path d="M12 7c2 0 3 1 3 3s-1 3-3 3-3-1-3-3 1-3 3-3z"/><path d="M12 2v5M12 13v9M2 12h5M17 12h5"/></svg>
                <div className="h-px w-24 bg-amber-200" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Statistics with Powerful 3D Card Effects */}
        <div className="mt-16 p-8 rounded-2xl bg-rose-50/70">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.2 } } }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-100/60"
              variants={statsCardVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mx-auto mb-4"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                {stat.icon}
              </motion.div>
              <div className="font-luxury text-2xl font-bold text-slate-800 mb-2">
                <span className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.number}</span>
                <span className="text-amber-500 text-2xl md:text-3xl">{stat.suffix}</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
        </div>

        {/* Enhanced Values with Powerful Staggered Animations */}
        <motion.div 
          className="mt-24 grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.3 } } }}
        >
          {[
            { icon: <Sparkles className="w-5 h-5" />, title: 'Innovation', body: 'Forward-thinking design techniques and trends.' }, 
            { icon: <Flower2 className="w-5 h-5" />, title: 'Sustainability', body: 'Responsible sourcing and mindful operations.' }, 
            { icon: <Leaf className="w-5 h-5" />, title: 'Authenticity', body: 'Honest craft that honors nature&apos;s beauty.' }
          ].map((v, i) => (
            <motion.div 
              key={i} 
              className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-amber-100/60 shadow-sm h-full"
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                show: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    duration: 0.8
                  } 
                }
              }}
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                boxShadow: "0 18px 40px rgba(198,157,72,0.15)",
                transition: { duration: 0.3 }
              }}
              style={{ borderColor: 'rgba(198, 157, 72, 0.35)' }}
            >
              <motion.div 
                className="flex items-center gap-2 mb-2 text-amber-700"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-amber-600">{v.icon}</span>
                </motion.div>
                <div className="font-semibold" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>{v.title}</div>
              </motion.div>
              <div className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>{v.body}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section with Luxury Hover Effects */}
        <motion.div 
          className="mt-24 text-center p-10 rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-100/60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="font-luxury text-3xl font-bold text-slate-800 mb-4">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Whether it's a gift for a loved one or a stunning centerpiece for your event, let us bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a 
              href="/collection" 
              className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-full shadow-lg hover:bg-slate-700 transition-all duration-300"
              variants={ctaButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Explore Collections
            </motion.a>
            <motion.a 
              href="/contact" 
              className="px-8 py-3 bg-white/80 backdrop-blur border border-amber-200 text-slate-800 font-semibold rounded-full hover:bg-white transition-all duration-300"
              variants={ctaButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Request a Custom Design
            </motion.a>
          </div>
        </motion.div>

        {/* Wavy separator */}
        <div className="mt-24 -mb-10">
          <svg className="w-full h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 V40 C150,100 350,100 600,40 C850,-20 1050,-20 1200,40 V0 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </motion.section>
  );
};

export default About;