import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "WEDDINGS",
    description: "Architectural bridal arrangements",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop",
    gradient: "from-primary/80 to-primary-dark/90"
  },
  {
    id: 2,
    name: "VALENTINE'S",
    description: "Romantic luxury collections",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=1000&fit=crop",
    gradient: "from-red-500/80 to-primary/90"
  },
  {
    id: 3,
    name: "MOTHER'S DAY",
    description: "Elegant tribute arrangements",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=1000&fit=crop",
    gradient: "from-pink-400/80 to-primary/90"
  },
  {
    id: 4,
    name: "BIRTHDAYS",
    description: "Celebration masterpieces",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop",
    gradient: "from-purple-500/80 to-primary/90"
  },
  {
    id: 5,
    name: "ANNIVERSARIES",
    description: "Timeless love expressions",
    image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=800&h=1000&fit=crop",
    gradient: "from-primary/80 to-amber-600/90"
  },
  {
    id: 6,
    name: "CORPORATE",
    description: "Professional luxury designs",
    image: "https://images.unsplash.com/photo-1574684891174-df0693e82998?w=800&h=1000&fit=crop",
    gradient: "from-slate-600/80 to-primary/90"
  },
  {
    id: 7,
    name: "SYMPATHY",
    description: "Respectful memorial arrangements",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    gradient: "from-slate-400/80 to-primary/90"
  },
  {
    id: 8,
    name: "SEASONAL",
    description: "Limited edition collections",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=1000&fit=crop",
    gradient: "from-emerald-500/80 to-primary/90"
  },
  {
    id: 9,
    name: "GRADUATIONS",
    description: "Achievement celebrations",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=1000&fit=crop",
    gradient: "from-blue-500/80 to-primary/90"
  },
  {
    id: 10,
    name: "LUXURY GIFTS",
    description: "Premium gift arrangements",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=1000&fit=crop",
    gradient: "from-primary/80 to-orange-600/90"
  }
];

const UltraCategories = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const swiper = swiperRef.current;

    if (section && title && swiper) {
      // Set initial states
      gsap.set(title, { y: 50, opacity: 0 });
      gsap.set(swiper, { y: 100, opacity: 0 });

      // Animate on scroll
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(title, {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          })
          .to(swiper, {
            duration: 1.2,
            y: 0,
            opacity: 1,
            ease: "power3.out"
          }, "-=0.5");
        }
      });

      // Background gradient animation
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(section, {
            duration: 0.1,
            background: `linear-gradient(135deg, 
              hsl(47 3% ${90 - progress * 5}%), 
              hsl(47 8% ${95 - progress * 10}%)
            )`,
            ease: "none"
          });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-32 px-4 bg-gradient-platinum relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 
            ref={titleRef}
            className="font-luxury text-5xl md:text-7xl font-bold text-foreground mb-6 text-3d"
          >
            LUXURY COLLECTIONS
          </h2>
          <div className="w-32 h-px bg-primary mx-auto mb-8" />
          <p className="font-body text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover our curated collections, each designed for life's most precious moments 
            with uncompromising attention to detail and architectural beauty.
          </p>
        </motion.div>

        <div ref={swiperRef} className="relative">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 300,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="category-swiper"
            style={{
              paddingBottom: '80px'
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id} style={{ width: '400px', height: '600px' }}>
                <motion.div
                  className="relative h-full group cursor-pointer overflow-hidden shadow-3d hover:shadow-luxury transition-3d transform-3d"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    z: 50
                  }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-3d group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} transition-3d group-hover:opacity-90`} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-center">
                    {/* Category Name */}
                    <motion.h3 
                      className="font-luxury text-3xl md:text-4xl font-bold text-white mb-4 text-3d"
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {category.name}
                    </motion.h3>

                    {/* Description */}
                    <motion.p 
                      className="font-body text-lg text-white/90 mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-3d"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 0.9 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                    >
                      {category.description}
                    </motion.p>

                    {/* Explore Button */}
                    <motion.button
                      className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 font-semibold transition-3d hover:bg-white hover:text-foreground hover:border-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      EXPLORE COLLECTION
                    </motion.button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 w-12 h-12 border-2 border-white/30 transform rotate-45 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-3d" />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-2 border-white/30 transform rotate-45 opacity-40 group-hover:opacity-80 group-hover:-rotate-45 transition-3d" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style>{`
        .category-swiper .swiper-pagination-bullet {
          background: hsl(51 100% 50%);
          opacity: 0.3;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        
        .category-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
          box-shadow: 0 0 20px hsl(51 100% 50% / 0.6);
        }
        
        .category-swiper .swiper-button-next,
        .category-swiper .swiper-button-prev {
          color: hsl(51 100% 50%);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          transition: all 0.3s ease;
        }
        
        .category-swiper .swiper-button-next:hover,
        .category-swiper .swiper-button-prev:hover {
          background: hsl(51 100% 50%);
          color: black;
          transform: scale(1.1);
          box-shadow: 0 0 30px hsl(51 100% 50% / 0.5);
        }
        
        .category-swiper .swiper-slide-shadow-left,
        .category-swiper .swiper-slide-shadow-right {
          background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
        }
      `}</style>
    </section>
  );
};

export default UltraCategories;