import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Heart, Award, Users, Star, Crown, Sparkles, Flower2, Leaf } from "lucide-react";
import logoImage from '/assets/bexy-flowers-logo.png';
import whoWeAreImage from '@/assets/who we-are-bexy-flowers.jpeg';

const About = () => {
  const stats = [
    {
      number: 15000,
      suffix: "+",
      label: "Happy Customers",
      icon: <Users className="w-6 h-6" />
    },
    {
      number: 5,
      suffix: "★",
      label: "Premium Quality",
      icon: <Star className="w-6 h-6" />
    },
    {
      number: 24,
      suffix: "/7",
      label: "Support",
      icon: <Heart className="w-6 h-6" />
    },
    {
      number: 25,
      suffix: "+",
      label: "Years Experience",
      icon: <Award className="w-6 h-6" />
    }
  ];

  const sectionRef = useRef<HTMLDivElement | null>(null);
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

  // Tilt-on-mouse for image frame
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 120, damping: 12 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 120, damping: 12 });

  // Powerful transitions for the "Crafting Dreams" content block
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  } as const;

  const headingReveal = {
    hidden: { opacity: 0, y: 14, x: -24, clipPath: "inset(0 0 100% 0)" },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      clipPath: "inset(0 0 0% 0)",
      transition: { type: "spring", stiffness: 320, damping: 22, mass: 0.7 }
    }
  } as const;

  const paragraphReveal = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  } as const;

  // Line-by-line reveal for paragraphs
  const lineContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  } as const;

  const lineReveal = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
  } as const;

  // Word-by-word "smoke" effect for dramatic reveals
  const wordSmokeVariants = {
    hidden: { opacity: 0, y: 8, filter: "blur(6px)", letterSpacing: "0.06em", textShadow: "0 10px 18px rgba(2,6,23,0.18)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      letterSpacing: "0em",
      textShadow: "0 0 0 rgba(0,0,0,0)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  } as const;

  const renderSmokyWords = (text: string) => (
    <motion.span variants={lineContainer} className="inline-block">
      {text.split(" ").map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={wordSmokeVariants}
          className="inline-block mr-2 align-baseline"
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );

  // Photo enter animation (image only, not the container)
  const photoEnter = {
    hidden: { opacity: 0, x: 80, y: -80, scale: 1.08, rotateZ: -3, filter: "blur(10px)" },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 260, damping: 24, mass: 0.9 }
    }
  } as const;

  return (
    <section ref={sectionRef} className="relative py-28 px-4 overflow-hidden" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #faf9fb 30%, #f7fbff 100%)' }}>
      {/* Premium Background Theme */}
      <div className="pointer-events-none absolute inset-0">
        {/* layered organic shapes */}
        <motion.svg style={{ y: yPrimary }} className="absolute -top-56 -left-40 w-[62rem] h-[62rem] opacity-40" viewBox="0 0 800 800" fill="none">
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--lux-edge-from)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="var(--lux-edge-to)" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          <path d="M50,300 Q400,0 750,300 T750,700 Q400,1000 50,700 T50,300 Z" fill="url(#g1)"/>
        </motion.svg>
        <motion.svg style={{ y: ySecondary }} className="absolute -bottom-72 -right-48 w-[58rem] h-[58rem] opacity-35" viewBox="0 0 800 800" fill="none">
          <defs>
            <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--lux-edge-from)" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="var(--lux-edge-to)" stopOpacity="0.35"/>
            </linearGradient>
          </defs>
          <path d="M100,350 Q420,40 700,350 T700,650 Q420,960 100,650 T100,350 Z" fill="url(#g2)"/>
        </motion.svg>
        {/* remove math-paper grid; keep a soft grain vignette only */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply" style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(2,6,23,0.05) 0, transparent 50%)'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Simple Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={logoImage}
              alt="Bexy Flowers Logo"
              className="w-12 h-12 object-contain"
            />
            <div className="w-1 h-8 bg-amber-400 rounded-full" />
          </motion.div>

          <h1 className="font-luxury text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Our Story
          </h1>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Crafting luxury floral experiences with architectural precision and artistic excellence since 1999
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 items-center mb-24">
          {/* Image */}
          <motion.div
            className="relative group -mt-8 md:-mt-19 lg:-mt-40"
            initial={{ opacity: 0, x: -60, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            {/* Compact photo frame presentation */}
            <div className="absolute -inset-4 -z-10 -rotate-2 rounded-[1.5rem] bg-gradient-to-br from-amber-200/40 via-white to-pink-100/40 shadow-[0_0_90px_-40px_rgba(251,191,36,0.45)]" />
            <motion.div
              className="relative overflow-hidden rounded-[1.5rem] shadow-xl ring-1 ring-amber-100/70 transition-all duration-500 will-change-transform group/image"
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                mouseX.set(Math.max(0, Math.min(1, x)));
                mouseY.set(Math.max(0, Math.min(1, y)));
              }}
              onMouseLeave={() => {
                mouseX.set(0.5);
                mouseY.set(0.5);
              }}
            >
              <motion.img
                src={whoWeAreImage}
                alt="Who We Are - Bexy Flowers Team"
                className="w-full h-[26rem] md:h-[32rem] object-contain object-top bg-white/70 transition-transform duration-[800ms]"
                initial={photoEnter.hidden}
                whileInView={photoEnter.show}
                viewport={{ once: true, margin: "-15%" }}
              />
              {/* motion trail */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0.35 }}
                whileInView={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-15%" }}
                style={{
                  background: 'radial-gradient(60% 40% at 80% 20%, rgba(255,255,255,0.5), transparent 70%)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              {/* light sweep overlay */}
              <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 transition-all duration-700 group-hover/image:translate-x-[260%] group-hover/image:opacity-60" />
              {/* soft vignette at edges */}
              <div className="pointer-events-none absolute inset-0" style={{
                background: 'radial-gradient(closest-side, rgba(2,6,23,0.35), transparent 70%)'
              }} />
              {/* signature watermark */}
              <div className="pointer-events-none absolute bottom-3 right-3 select-none">
                <div className="px-2 py-1 rounded bg-white/70 backdrop-blur border border-amber-100/60 shadow-sm">
                  <span className="text-[10px] tracking-widest text-amber-700 font-semibold">BEXY • ATELIER</span>
                </div>
              </div>
            </motion.div>
            {/* corner pins */}
            <div className="hidden md:block absolute -top-2 -left-2 w-3 h-3 rounded-full bg-amber-300 shadow" />
            <div className="hidden md:block absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-pink-300 shadow" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
          >
            <div>
              <motion.h2
                className="font-luxury text-3xl md:text-4xl font-bold text-slate-800 mb-3"
                variants={headingReveal}
              >
                <motion.span
                  initial={{ letterSpacing: "0.12em" }}
                  whileInView={{ letterSpacing: "0em" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  Crafting Dreams
                </motion.span>
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-amber-400 rounded-full mb-8 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 12, mass: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              />
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              {/* Paragraph 1: line-by-line */}
              <motion.div variants={paragraphReveal}>
                <motion.div variants={lineContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="space-y-1">
                  <motion.p variants={lineReveal}>{renderSmokyWords("Founded with an unwavering passion for creating extraordinary floral experiences,")}</motion.p>
                  <motion.p variants={lineReveal}>
                    {renderSmokyWords("Bexy Flowers has become synonymous with luxury and elegance in the world of premium floristry.")}
                  </motion.p>
                </motion.div>
              </motion.div>

              {/* Paragraph 2: line-by-line */}
              <motion.div variants={paragraphReveal}>
                <motion.div variants={lineContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="space-y-1">
                  <motion.p variants={lineReveal}>{renderSmokyWords("Our master florists carefully curate each arrangement using only the finest flowers sourced from renowned gardens around the world.")}</motion.p>
                  <motion.p variants={lineReveal}>{renderSmokyWords("Every bouquet tells a story of craftsmanship, beauty, and the profound emotions that flowers can convey.")}</motion.p>
                </motion.div>
              </motion.div>

              {/* Paragraph 3: line-by-line */}
              <motion.div variants={paragraphReveal}>
                <motion.div variants={lineContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="space-y-1">
                  <motion.p variants={lineReveal}>{renderSmokyWords("From intimate celebrations to grand occasions, we believe that flowers have the power to transform moments into memories.")}</motion.p>
                  <motion.p variants={lineReveal}>{renderSmokyWords("Our commitment to excellence and attention to detail ensures that every creation exceeds expectations.")}</motion.p>
                </motion.div>
              </motion.div>
            </div>

            {/* Content cards for clarity */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                {
                  title: 'Our Mission',
                  body: 'Elevate life’s moments with refined floral artistry that blends luxury with heartfelt storytelling.'
                },
                {
                  title: 'Our Craft',
                  body: 'Every stem is selected with intent; every composition balances form, texture, and fragrance.'
                }
              ].map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/70 backdrop-blur border border-amber-100/60 shadow-sm">
                  <div className="font-semibold text-slate-800 mb-2">{card.title}</div>
                  <div className="text-slate-600 text-sm leading-relaxed">{card.body}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Simple Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-100/50 hover:border-amber-200/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="font-luxury text-2xl font-bold text-slate-800 mb-2">
                {stat.number}{stat.suffix}
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Wavy separator */}
        <div className="mt-24 -mb-10">
          <svg className="w-full h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 V40 C150,100 350,100 600,40 C850,-20 1050,-20 1200,40 V0 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default About;