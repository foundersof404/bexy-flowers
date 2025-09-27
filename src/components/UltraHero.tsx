import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleSystem from './ParticleSystem';
import heroBackground from '@/assets/hero-bg.jpg';

gsap.registerPlugin(ScrollTrigger);

const UltraHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const button = buttonRef.current;
    const particles = particlesRef.current;

    if (hero && title && subtitle && button && particles) {
      // Initial animation sequence
      const tl = gsap.timeline();
      
      // Set initial states
      gsap.set([title, subtitle, button], { y: 100, opacity: 0 });
      gsap.set(particles, { opacity: 0 });

      // Animate in sequence
      tl.to(particles, { duration: 2, opacity: 1, ease: "power2.out" })
        .to(title, { 
          duration: 1.5, 
          y: 0, 
          opacity: 1, 
          ease: "power3.out",
          onComplete: () => {
            // Add 3D text effect
            gsap.to(title, {
              duration: 0.8,
              textShadow: "0 1px 0 hsl(51 100% 40%), 0 2px 0 hsl(51 100% 35%), 0 3px 0 hsl(51 100% 30%), 0 4px 8px rgba(0,0,0,0.3)",
              ease: "power2.out"
            });
          }
        }, "-=0.8")
        .to(subtitle, { duration: 1, y: 0, opacity: 1, ease: "power2.out" }, "-=0.5")
        .to(button, { 
          duration: 1, 
          y: 0, 
          opacity: 1, 
          ease: "power2.out",
          onComplete: () => {
            // Add liquid morph animation to button
            gsap.to(button.querySelector('button'), {
              duration: 4,
              borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut"
            });
          }
        }, "-=0.3");

      // Parallax scroll effect
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(hero, {
            duration: 0.1,
            y: progress * -200,
            scale: 1 + progress * 0.1,
            ease: "none"
          });
        }
      });

      // Floating elements animation
      const floatingElements = hero.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        gsap.to(element, {
          duration: 6 + index * 2,
          y: "-=100",
          x: `+=${Math.random() * 100 - 50}`,
          rotation: 360,
          repeat: -1,
          ease: "none",
          delay: index * 0.5
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000 pt-8 -mt-12"
    >
      {/* Background Image with 3D Parallax */}
      <div className="absolute inset-0 z-0 -top-4">
        <motion.img
          src={heroBackground}
          alt="Luxury floral background"
          className="w-full h-full object-cover opacity-20 transform-3d"
          initial={{ scale: 1.2, rotateX: -5 }}
          whileInView={{ scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 -top-4 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>

      {/* 3D Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-10">
        <ParticleSystem />
      </div>

      

      {/* Modern Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              ref={titleRef}
              className="overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="font-luxury text-4xl lg:text-6xl font-black text-foreground leading-tight mb-4">
                <span className="inline-block hover:after:content-[''] hover:after:block hover:after:w-full hover:after:h-1 hover:after:bg-gradient-to-r hover:after:from-primary hover:after:to-transparent hover:after:mt-2 hover:after:transition-all hover:after:duration-500">
                  Elegant Flowers for Every Occasion
                </span>
              </h1>
              <p className="font-serif text-lg text-primary/80 font-light tracking-wide mb-2">
                Crafting timeless beauty through floral artistry
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
                From intimate weddings to grand celebrations, we create bespoke arrangements that capture life's most precious moments with unparalleled elegance.
              </p>
            </motion.div>


            {/* Action Buttons */}
            <motion.div
              ref={buttonRef}
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="font-body text-lg px-8 py-4 bg-gradient-to-r from-[rgb(209,162,73)] via-[rgb(229,182,93)] to-[rgb(209,162,73)] text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-[rgba(209,162,73,0.3)] transition-all duration-300 rounded-full transform hover:scale-105"
                onClick={() => {
                  const el = document.querySelector('[data-section="signature-collection"]');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Start Project
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-body text-lg px-8 py-4 border-2 border-muted-foreground/30 text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 rounded-full backdrop-blur-sm"
                onClick={() => {
                  const el = document.querySelector('[data-section="custom-bouquet"]');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Let's Talk
              </Button>
            </motion.div>

            {/* Statistics */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="font-luxury text-3xl lg:text-4xl font-bold text-foreground">15+</div>
                <div className="font-body text-sm text-muted-foreground mt-1">years experience</div>
              </div>
              <div className="text-center">
                <div className="font-luxury text-3xl lg:text-4xl font-bold text-foreground">26K</div>
                <div className="font-body text-sm text-muted-foreground mt-1">bouquets created</div>
              </div>
              <div className="text-center">
                <div className="font-luxury text-3xl lg:text-4xl font-bold text-foreground">98%</div>
                <div className="font-body text-sm text-muted-foreground mt-1">satisfied rate</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="relative">
            {/* Flower Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full h-96 lg:h-[500px] group">
                {/* Soft glow background */}
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl scale-110 group-hover:scale-125 transition-transform duration-700"></div>
                
                <img
                  src="/assets/flower1.jpg"
                  alt="Beautiful Flower"
                  className="relative w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(198,161,81,0.4)] hover:drop-shadow-[0_35px_70px_rgba(198,161,81,0.6)] transition-all duration-700 transform group-hover:rotate-2 hover:scale-105"
                />
                
                {/* Floating particles around image */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-primary/40 rounded-full"
                      style={{
                        left: `${20 + (i * 15)}%`,
                        top: `${30 + (i % 3) * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Glassmorphism Service Cards */}
            <motion.div
              className="absolute -right-16 top-8 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Wedding Arrangements */}
              <motion.div 
                className="relative group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 pr-6 shadow-2xl hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:bg-white/15 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <span className="font-body font-semibold text-white drop-shadow-lg">Wedding Arrangements</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Custom Bouquets */}
              <motion.div 
                className="relative group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 pr-6 shadow-2xl hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:bg-white/15 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.5 7.5L20 9L14.5 10.5L12 16L9.5 10.5L4 9L10.5 7.5L12 2Z"/>
                      </svg>
                    </div>
                    <span className="font-body font-semibold text-white drop-shadow-lg">Custom Bouquets</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Event Decor */}
              <motion.div 
                className="relative group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 pr-6 shadow-2xl hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:bg-white/15 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.5 6L18 7.5L14.5 10L15 14L12 12L9 14L9.5 10L6 7.5L10.5 6L12 2Z"/>
                      </svg>
                    </div>
                    <span className="font-body font-semibold text-white drop-shadow-lg">Event Decor</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Advanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-[47%] transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-muted-foreground cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="font-body text-sm mb-4 tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
            DISCOVER LUXURY
          </span>
          <div className="relative">
            <ChevronDown className="w-8 h-8 text-primary animate-pulse-gold" />
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default UltraHero;