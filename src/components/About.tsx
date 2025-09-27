import { motion } from "framer-motion";
import aboutImage from "@/assets/about-image.jpg";

const About = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-luxury">
              <img
                src={aboutImage}
                alt="Bexy Flowers flower shop"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Golden Border Accent */}
              <div className="absolute -inset-4 border-4 border-primary/30 rounded-lg -z-10" />
            </div>

            {/* Floating Golden Elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-primary rounded-full"
                style={{
                  right: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
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
              <motion.div
                className="w-24 h-1 bg-primary mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              />
              
              <h2 className="font-luxury text-5xl md:text-6xl font-bold text-foreground mb-6">
                Our Story
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
              <p>
                Founded with a passion for creating extraordinary floral experiences, 
                <span className="text-primary font-semibold"> Bexy Flowers</span> has become 
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

            <motion.div
              className="flex items-center space-x-8 pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="font-luxury text-3xl font-bold text-primary mb-1">10K+</div>
                <div className="font-body text-sm text-muted-foreground">Happy Customers</div>
              </div>
              
              <div className="w-px h-12 bg-border" />
              
              <div className="text-center">
                <div className="font-luxury text-3xl font-bold text-primary mb-1">5★</div>
                <div className="font-body text-sm text-muted-foreground">Premium Quality</div>
              </div>
              
              <div className="w-px h-12 bg-border" />
              
              <div className="text-center">
                <div className="font-luxury text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="font-body text-sm text-muted-foreground">Support</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;