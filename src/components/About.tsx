import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Heart, Award, Users, Star, Crown, Sparkles, Flower2, Leaf } from "lucide-react";
import logoImage from '/assets/bexy-flowers-logo.png';

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

  // Powerful transitions for the content blocks
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
        {/* Header */}
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

          <h1 className="font-luxury text-5xl md:text-6xl font-bold text-slate-800 mb-6">Who We Are</h1>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">Crafting luxury floral experiences with architectural precision and artistic excellence since 1999.</p>
        </motion.div>

        {/* Main Content (text-first layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          {/* Left: Narrative */}
          <motion.div
            className="space-y-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
          >
            <div>
              <motion.h2 className="font-luxury text-3xl md:text-4xl font-bold text-slate-800 mb-3" variants={headingReveal}>Our Story</motion.h2>
              <motion.div className="w-20 h-1 bg-amber-400 rounded-full mb-8 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 280, damping: 12, mass: 0.6, delay: 0.1 }} viewport={{ once: true }} />
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <motion.p variants={paragraphReveal}>Founded in 2024, our flower boutique has quickly become a pioneer in Lebanon&apos;s floral industry. We proudly established the country&apos;s first glitter flower shop, introducing a unique and creative concept that combines beauty, artistry, and personalization. Whether for weddings, events, or personal gifting, we are committed to redefining the art of floral design in Lebanon, offering products that blend tradition with modern creativity.</motion.p>
              <motion.p variants={paragraphReveal}>Our master florists curate each arrangement using the finest stems from renowned gardens worldwide. Every bouquet tells a story of craftsmanship, beauty, and heartfelt emotion.</motion.p>
              <motion.p variants={paragraphReveal}>From intimate celebrations to grand occasions, we transform moments into memories through artful composition, premium quality, and meticulous detail.</motion.p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {[{ title: 'Mission', body: 'Elevate life’s moments with refined floral artistry.' }, { title: 'Vision', body: 'Lead modern luxury floristry with innovation and soul.' }].map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/70 backdrop-blur border border-amber-100/60 shadow-sm">
                  <div className="font-semibold text-slate-800 mb-2">{card.title}</div>
                  <div className="text-slate-600 text-sm leading-relaxed">{card.body}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Highlights */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-amber-100/60 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Crown className="w-6 h-6" /></div>
                <div>
                  <div className="font-luxury text-xl font-bold text-slate-800 mb-1">Luxury Atelier</div>
                  <p className="text-slate-600">Bespoke compositions, premium sourcing, and white-glove service from consultation to delivery.</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[{ icon: <Heart className="w-6 h-6" />, title: 'Heartfelt Craft', body: 'Every stem placed with intention.' }, { icon: <Award className="w-6 h-6" />, title: 'Quality First', body: 'Only the finest seasonal blooms.' }, { icon: <Users className="w-6 h-6" />, title: 'Client-Centric', body: 'Personalized designs for every story.' }, { icon: <Star className="w-6 h-6" />, title: 'Signature Style', body: 'Modern elegance with timeless romance.' }].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/70 backdrop-blur border border-amber-100/60 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">{item.icon}</div>
                    <div>
                      <div className="font-semibold text-slate-800">{item.title}</div>
                      <div className="text-slate-600 text-sm leading-relaxed">{item.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Statistics */}
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

        {/* Values */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {[{ icon: <Sparkles className="w-5 h-5" />, title: 'Innovation', body: 'Forward-thinking design techniques and trends.' }, { icon: <Flower2 className="w-5 h-5" />, title: 'Sustainability', body: 'Responsible sourcing and mindful operations.' }, { icon: <Leaf className="w-5 h-5" />, title: 'Authenticity', body: 'Honest craft that honors nature’s beauty.' }].map((v, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-amber-100/60 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-700">
                {v.icon}
                <div className="font-semibold">{v.title}</div>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed">{v.body}</div>
            </div>
          ))}
        </div>

        {/* Commitment */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-100/60">
          <div className="font-luxury text-2xl font-bold text-slate-800 mb-3">Our Commitment</div>
          <div className="text-slate-600 leading-relaxed">
            We promise refined artistry, exceptional service, and unforgettable floral moments—every single time.
          </div>
        </div>

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