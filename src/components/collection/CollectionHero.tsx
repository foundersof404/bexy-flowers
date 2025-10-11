import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import heroBackground from "@/assets/hero-bg.jpg";

export const CollectionHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prepare states for staged reveal
    gsap.set([".hero-subtitle"], { opacity: 0, y: 20, filter: "blur(6px)" });
    gsap.set([".hero-description"], {
      opacity: 0,
      y: 24,
      scale: 0.98,
      clipPath: "inset(0 50% 0 50%)"
    });
    gsap.set('.subtitle-underline', { scaleX: 0, transformOrigin: '0% 50%' });

    // Title first, then subtitle, then powerful description reveal
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(".hero-title .char", {
      y: 100,
      opacity: 0,
      rotationX: -90,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.05
    })
    .to(".hero-subtitle", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.4,
      ease: "power3.out"
    }, "+=0.05")
    .from(".subtitle-word", {
      y: 28,
      opacity: 0,
      skewY: 6,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.06
    }, "<")
    .fromTo(".hero-subtitle", { letterSpacing: "0.08em" }, { letterSpacing: "0em", duration: 0.8, ease: "power2.out" }, "<")
    .to('.subtitle-underline', { scaleX: 1, duration: 0.6, ease: 'power3.out' }, "<0.1")
    .to(".hero-description", {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: "inset(0 0% 0 0%)",
      duration: 0.8,
      ease: "power3.out"
    }, "+=0.1");

    // Floating particles animation
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.set(particles, {
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200),
        scale: () => gsap.utils.random(0.5, 1.5),
        opacity: () => gsap.utils.random(0.3, 0.8)
      });

      gsap.to(particles, {
        y: "-=100",
        rotation: 360,
        duration: () => gsap.utils.random(10, 20),
        ease: "none",
        repeat: -1,
        stagger: { each: 0.5, repeat: -1 }
      });
    }
  }, []);

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="char inline-block" style={{ transformOrigin: "50% 100%" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  const splitWords = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="subtitle-word inline-block mr-2">
        {word}
      </span>
    ));
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.03) 0%, transparent 50%)
        `
      }}
    >
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <img
          src={heroBackground}
          alt="Luxury floral background"
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70 z-10" />

      {/* Floating Particles Background */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-15" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              filter: "blur(0.5px)",
              boxShadow: "0 0 10px hsl(var(--primary))"
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gold"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float"></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <motion.div
          className="hero-title mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-6xl lg:text-8xl font-luxury text-foreground leading-tight">
            {splitText("Our Complete")}
            <br />
            <span className="text-primary">
              {splitText("Collection")}
            </span>
          </h1>
        </motion.div>

        <motion.p 
          className="hero-subtitle relative inline-block text-xl lg:text-2xl text-foreground/80 mb-6 font-body"
          initial={false}
          animate={false}
        >
          {splitWords("Handcrafted luxury bouquets for every precious moment")}
          <span className="subtitle-underline absolute left-0 -bottom-2 h-[2px] w-full bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        </motion.p>

        <motion.div
          className="hero-description relative max-w-3xl mx-auto"
          initial={false}
          animate={false}
        >
          <div className="bg-background/70 backdrop-blur-md border border-primary/20 rounded-xl shadow-gold px-6 py-5">
            <p className="text-lg leading-relaxed text-foreground/90 font-body">
            Discover our curated collection of artisanal bouquets, each carefully designed 
            to celebrate life's most beautiful moments with elegance and sophistication.
            </p>
          </div>
        </motion.div>

        
      </div>
    </section>
  );
};