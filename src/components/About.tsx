import { motion } from "framer-motion";
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

  return (
    <section className="relative py-24 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)' }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(198,161,81,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(198,161,81,0.1) 0%, transparent 50%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Simple Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500">
              <img
                src={whoWeAreImage}
                alt="Who We Are - Bexy Flowers Team"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-luxury text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Crafting Dreams
              </h2>
              <div className="w-16 h-1 bg-amber-400 rounded-full mb-6" />
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Founded with an unwavering passion for creating extraordinary floral experiences, 
                <span className="text-amber-600 font-semibold"> Bexy Flowers</span> has become 
                synonymous with luxury and elegance in the world of premium floristry.
              </p>

              <p>
                Our master florists carefully curate each arrangement using only the finest 
                flowers sourced from renowned gardens around the world. Every bouquet tells 
                a story of craftsmanship, beauty, and the profound emotions that flowers 
                can convey.
              </p>

              <p>
                From intimate celebrations to grand occasions, we believe that flowers have 
                the power to transform moments into memories. Our commitment to excellence 
                and attention to detail ensures that every creation exceeds expectations.
              </p>
            </div>

            {/* Simple Feature highlights */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {[
                { icon: <Crown className="w-5 h-5" />, text: "Luxury Collection" },
                { icon: <Sparkles className="w-5 h-5" />, text: "Custom Designs" },
                { icon: <Flower2 className="w-5 h-5" />, text: "Premium Quality" },
                { icon: <Leaf className="w-5 h-5" />, text: "Fresh Daily" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-amber-100/50 hover:border-amber-200/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                    {feature.icon}
                  </div>
                  <span className="font-medium text-slate-700">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Simple Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-100/50 hover:border-amber-200/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
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
      </div>
    </section>
  );
};

export default About;