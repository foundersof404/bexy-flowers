import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroBackground from '@/assets/hero-bg.jpg';

gsap.registerPlugin(ScrollTrigger);

const UltraHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const button = buttonRef.current;
    if (hero && title && subtitle && button) {
      // Initial animation sequence
      const tl = gsap.timeline();
      
      // Set initial states
      gsap.set([title, subtitle, button], { y: 100, opacity: 0 });

      // Animate in sequence
      tl
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

      // Beautiful 3D rotation effect for flower image on scroll
      const flowerImage = hero.querySelector('img[alt="Beautiful Flower"]');
      if (flowerImage) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const smoothProgress = progress * progress * (3 - 2 * progress); // Smooth easing
            
            gsap.to(flowerImage, {
              duration: 0.1,
              rotateY: smoothProgress * 720, // Two full rotations
              rotateX: Math.sin(progress * Math.PI * 2) * 10, // Gentle X rotation
              rotateZ: Math.sin(progress * Math.PI) * 5, // Subtle Z rotation
              scale: 1 + Math.sin(progress * Math.PI) * 0.05, // Subtle scale breathing
              ease: "none"
            });
          }
        });
      }

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000 pt-8 -mt-20"
    >
      {/* Background Image with 3D Parallax */}
      <div className="absolute inset-0 z-0 -top-4">
        <motion.img
          src={heroBackground}
          alt="Luxury floral background"
          className="w-full h-full object-cover opacity-20 transform-3d shadow-gold"
          initial={{ scale: 1.2, rotateX: -5 }}
          whileInView={{ scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 -top-4 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>


      

      {/* Modern Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8">
             <motion.div
               ref={titleRef}
               className="overflow-hidden"
               initial={{ opacity: 0, x: -100, scale: 0.9 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               transition={{ 
                 duration: 1.5, 
                 delay: 0.2,
                 type: "spring",
                 stiffness: 60,
                 damping: 15
               }}
             >
               {/* Main Title with Character-by-Character Animation */}
               <motion.h1 
                 className="font-luxury text-4xl lg:text-6xl font-black text-foreground leading-tight mb-4"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.1, delay: 0.4 }}
               >
                 <motion.span 
                   className="inline-block relative overflow-hidden"
                   whileHover={{
                     scale: 1.02,
                     transition: { duration: 0.3 }
                   }}
                 >
                   {/* Animated background gradient */}
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-r from-primary/10 via-yellow-400/5 to-transparent"
                     initial={{ x: "-100%", opacity: 0 }}
                     animate={{ x: "100%", opacity: 1 }}
                     transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
                   />
                   
                   {/* Text with staggered character animation */}
                   <span className="relative z-10">
                     {"Elegant Flowers for Every Occasion".split("").map((char, index) => (
                       <motion.span
                         key={index}
                         className="inline-block"
                         initial={{ 
                           opacity: 0, 
                           y: 50, 
                           rotateX: -90,
                           filter: "blur(10px)"
                         }}
                         animate={{ 
                           opacity: 1, 
                           y: 0, 
                           rotateX: 0,
                           filter: "blur(0px)"
                         }}
                         transition={{ 
                           duration: 0.6,
                           delay: 0.5 + index * 0.05,
                           ease: [0.25, 0.46, 0.45, 0.94]
                         }}
                         whileHover={{
                           scale: 1.1,
                           color: "#c6a151",
                           textShadow: "0 0 20px rgba(198,161,81,0.5)",
                           transition: { duration: 0.2 }
                         }}
                       >
                         {char === " " ? "\u00A0" : char}
                       </motion.span>
                     ))}
                   </span>
                   
                   {/* Animated underline with morphing effect */}
                   <motion.div
                     className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-transparent"
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ 
                       width: "100%", 
                       opacity: 1,
                       boxShadow: "0 0 20px rgba(198,161,81,0.5)"
                     }}
                     transition={{ 
                       duration: 2, 
                       delay: 2.2, 
                       ease: "easeOut"
                     }}
                   />
                   
                 </motion.span>
               </motion.h1>
               
               {/* Subtitle with elegant reveal */}
               <motion.div
                 className="relative overflow-hidden"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 0.8 }}
               >
                 <motion.p 
                   className="font-serif text-lg text-primary/80 font-light tracking-wide mb-2 relative"
                   initial={{ opacity: 0, x: -50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                 >
                   <motion.span
                     className="inline-block"
                     whileHover={{
                       color: "#c6a151",
                       scale: 1.05,
                       transition: { duration: 0.3 }
                     }}
                   >
                     Crafting timeless beauty through floral artistry
                   </motion.span>
                   
                   {/* Decorative line */}
                   <motion.div
                     className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-primary/50 to-transparent"
                     initial={{ width: 0 }}
                     animate={{ width: "60%" }}
                     transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
                   />
                 </motion.p>
               </motion.div>
               
               {/* Description with typewriter effect */}
               <motion.div
                 className="relative overflow-hidden"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 1.2 }}
               >
                 <motion.p 
                   className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl relative"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.5, delay: 1.4 }}
                 >
                   <motion.span
                     className="inline-block"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.1, delay: 1.6 }}
                   >
                     From intimate weddings to grand celebrations, we create bespoke arrangements that capture life's most precious moments with unparalleled elegance.
                   </motion.span>
                   
                   {/* Animated cursor */}
                   <motion.span
                     className="inline-block w-0.5 h-5 bg-primary ml-1"
                     animate={{ opacity: [1, 0, 1] }}
                     transition={{ 
                       duration: 1, 
                       repeat: Infinity, 
                       delay: 2.5,
                       ease: "easeInOut"
                     }}
                   />
                   
                   {/* Background highlight */}
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-yellow-400/5 rounded-lg"
                     initial={{ scaleX: 0, opacity: 0 }}
                     animate={{ scaleX: 1, opacity: 1 }}
                     transition={{ duration: 2, delay: 2, ease: "easeOut" }}
                     style={{ transformOrigin: "left" }}
                   />
                 </motion.p>
               </motion.div>
             </motion.div>


            {/* Action Buttons */}
            <motion.div
              ref={buttonRef}
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1, 
                delay: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="font-body text-lg px-8 py-4 bg-gradient-to-r from-[rgb(209,162,73)] via-[rgb(229,182,93)] to-[rgb(209,162,73)] text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-[rgba(209,162,73,0.3)] transition-all duration-300 rounded-full relative overflow-hidden group"
                  onClick={() => {
                    const el = document.querySelector('[data-section="signature-collection"]');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <motion.span
                    className="relative z-10"
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0.9 }}
                  >
                    Start Project
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="font-body text-lg px-8 py-4 border-2 border-muted-foreground/30 text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 rounded-full backdrop-blur-sm relative overflow-hidden group"
                  onClick={() => {
                    const el = document.querySelector('[data-section="custom-bouquet"]');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <motion.span
                    className="relative z-10"
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0.9 }}
                  >
                    Let's Talk
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </motion.div>

             {/* Statistics with Enhanced Animations */}
             <motion.div
               className="grid grid-cols-3 gap-8 pt-8"
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ 
                 duration: 1.2, 
                 delay: 1.8,
                 type: "spring",
                 stiffness: 60,
                 damping: 15
               }}
             >
               {[
                 { number: "1+", label: "years experience", color: "#c6a151" },
                 { number: "100+", label: "flowers", color: "#ffd700" },
                 { number: "98%", label: "satisfied rate", color: "#e4b55c" }
               ].map((stat, index) => (
                 <motion.div 
                   key={index}
                   className="text-center group cursor-pointer relative"
                   initial={{ opacity: 0, y: 30, rotateX: -45 }}
                   animate={{ opacity: 1, y: 0, rotateX: 0 }}
                   transition={{ 
                     duration: 0.8, 
                     delay: 2 + index * 0.3,
                     type: "spring",
                     stiffness: 100,
                     damping: 15
                   }}
                   whileHover={{ 
                     scale: 1.08,
                     y: -8,
                     rotateY: 5,
                     transition: { duration: 0.4, ease: "easeOut" }
                   }}
                 >
                   {/* Background glow effect */}
                   <motion.div
                     className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-2xl blur-xl"
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 1, delay: 2.5 + index * 0.3 }}
                     whileHover={{
                       scale: 1.2,
                       opacity: 0.3,
                       transition: { duration: 0.3 }
                     }}
                   />
                   
                   {/* Number with counting animation */}
                   <motion.div 
                     className="font-luxury text-3xl lg:text-4xl font-bold text-foreground relative z-10"
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ 
                       duration: 0.8, 
                       delay: 2.2 + index * 0.3,
                       type: "spring",
                       stiffness: 200,
                       damping: 15
                     }}
                     whileHover={{ 
                       color: stat.color,
                       scale: 1.1,
                       textShadow: `0 0 20px ${stat.color}40`,
                       transition: { duration: 0.3 }
                     }}
                   >
                     <motion.span
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.6, delay: 2.4 + index * 0.3 }}
                     >
                       {stat.number}
                     </motion.span>
                     
                     {/* Animated underline with color */}
                     <motion.div
                       className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full"
                       style={{ backgroundColor: stat.color }}
                       initial={{ width: 0, opacity: 0 }}
                       animate={{ width: "80%", opacity: 1 }}
                       transition={{ duration: 1, delay: 2.8 + index * 0.3, ease: "easeOut" }}
                       whileHover={{
                         width: "100%",
                         boxShadow: `0 0 10px ${stat.color}60`,
                         transition: { duration: 0.3 }
                       }}
                     />
                   </motion.div>
                   
                   {/* Label with typewriter effect */}
                   <motion.div 
                     className="font-body text-sm text-muted-foreground mt-2 relative z-10"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 2.6 + index * 0.3 }}
                     whileHover={{ 
                       color: stat.color,
                       scale: 1.05,
                       transition: { duration: 0.3 }
                     }}
                   >
                     <motion.span
                       className="inline-block"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.1, delay: 2.8 + index * 0.3 }}
                     >
                       {stat.label}
                     </motion.span>
                     
                     {/* Decorative dot */}
                     <motion.div
                       className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full"
                       style={{ backgroundColor: stat.color }}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ duration: 0.4, delay: 3 + index * 0.3 }}
                       whileHover={{
                         scale: 1.5,
                         boxShadow: `0 0 8px ${stat.color}80`,
                         transition: { duration: 0.3 }
                       }}
                     />
                   </motion.div>
                   
                 </motion.div>
               ))}
             </motion.div>
          </div>

          {/* Right Content */}
          <div className="relative">
            {/* Flower Image with Clean Transitions */}
            <motion.div
              className="relative"
              initial={{ 
                opacity: 0, 
                x: 300, 
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className="relative w-full h-96 lg:h-[500px] perspective-1000" style={{ transformStyle: "preserve-3d" }}>
                {/* Subtle glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl scale-110"
                  animate={{
                    scale: [1.1, 1.2, 1.1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main flower image */}
                <motion.img
                  src="/assets/flower1.jpg"
                  alt="Beautiful Flower"
                  className="relative w-full h-full object-contain z-10 ml-8"
                  initial={{ 
                    filter: "blur(8px) brightness(0.9) drop-shadow(0 0 15px rgba(228, 181, 92, 0.4)) drop-shadow(0 0 25px rgba(228, 181, 92, 0.2))",
                    scale: 0.95
                  }}
                  animate={{ 
                    filter: "blur(0px) brightness(1) drop-shadow(0 0 15px rgba(228, 181, 92, 0.4)) drop-shadow(0 0 25px rgba(228, 181, 92, 0.2))",
                    scale: 1
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.5,
                    ease: "easeOut"
                  }}
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(198,161,81,0.3))",
                    transformStyle: "preserve-3d"
                  }}
                />
                
              </div>
            </motion.div>

            {/* Glassmorphism Service Cards */}
            <motion.div
              className="absolute -right-24 top-8 space-y-6"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 1, 
                delay: 0.5,
                type: "spring",
                stiffness: 80,
                damping: 12
              }}
            >
              {[
                { 
                  icon: "M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z", 
                  title: "Wedding Arrangements" 
                },
                { 
                  icon: "M12 2L13.5 7.5L20 9L14.5 10.5L12 16L9.5 10.5L4 9L10.5 7.5L12 2Z", 
                  title: "Custom Bouquets" 
                },
                { 
                  icon: "M12 2L13.5 6L18 7.5L14.5 10L15 14L12 12L9 14L9.5 10L6 7.5L10.5 6L12 2Z", 
                  title: "Event Decor" 
                }
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, x: 30, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.7 + index * 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <motion.div 
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 pr-6 shadow-2xl hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:bg-white/15 transition-all duration-500 relative overflow-hidden"
                    whileHover={{
                      borderColor: "rgba(198,161,81,0.4)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <motion.div 
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          backgroundColor: "rgba(198,161,81,0.3)",
                          transition: { duration: 0.3 }
                        }}
                      >
                        <motion.svg 
                          className="w-5 h-5 text-white drop-shadow-lg" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          whileHover={{
                            scale: 1.1,
                            rotate: -5,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <path d={service.icon}/>
                        </motion.svg>
                      </motion.div>
                      <motion.span 
                        className="font-body font-semibold text-white drop-shadow-lg"
                        whileHover={{
                          color: "#c6a151",
                          transition: { duration: 0.3 }
                        }}
                      >
                        {service.title}
                      </motion.span>
                    </div>
                    
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-yellow-400/5 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
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