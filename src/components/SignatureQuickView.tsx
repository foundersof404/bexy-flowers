import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartWithToast } from '@/hooks/useCartWithToast';

interface QuickItem {
  id: number;
  name: string;
  price: number | string;
  image: string;
  description: string;
}

interface SignatureQuickViewProps {
  open: boolean;
  item?: QuickItem | null;
  onClose: () => void;
}

const SignatureQuickView = ({ open, item, onClose }: SignatureQuickViewProps) => {
  const { addToCart } = useCartWithToast();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!item) return null;

  const numericPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$','')) : item.price;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Half-screen sheet (centered) */}
          <motion.div
            ref={dialogRef}
            className="relative z-[101] w-[96%] max-w-5xl h-[88vh] sm:h-[80vh] lg:h-[65vh] mx-auto bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Opening sweep accent */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ background: 'linear-gradient(90deg, rgba(255,215,128,0.07), rgba(255,255,255,0) 30%)' }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-black/5">
              <h3 className="font-luxury text-xl sm:text-2xl text-slate-900">{item.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full bg-white/80 hover:bg-white/90 shadow-sm"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-2 flex-1">
              {/* Left: large image, sticky on desktop */}
              <motion.div 
                className="relative h-72 sm:h-96 lg:h-full bg-slate-100 lg:sticky lg:top-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
              </motion.div>

              {/* Right: scrollable details */}
              <motion.div 
                className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
              >
                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-amber-700 font-luxury text-2xl">${numericPrice.toFixed(2)}</p>
                  <Button
                    className="rounded-md border border-amber-300/60 bg-white text-slate-900 hover:text-white transition-all duration-300 bg-[length:200%_100%] bg-gradient-to-r from-white via-amber-400 to-amber-600 hover:bg-[position:100%_0]"
                    onClick={() => addToCart({ id: item.id, title: item.name, price: numericPrice, image: item.image })}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>

                {/* Description */}
                <section>
                  <h4 className="font-luxury text-lg text-slate-900 mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </section>

                {/* Includes */}
                <section>
                  <h4 className="font-luxury text-lg text-slate-900 mb-3">Includes</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Premium flower selection</li>
                    <li>Elegant gift wrapping</li>
                    <li>Care instructions card</li>
                    <li>Handwritten message card (optional)</li>
                  </ul>
                </section>

                {/* Care Instructions */}
                <section>
                  <h4 className="font-luxury text-lg text-slate-900 mb-3">Care</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Refresh water daily</li>
                    <li>Trim stems every 2-3 days</li>
                    <li>Keep away from direct sunlight and heat</li>
                    <li>Use included care sachet for extended freshness</li>
                  </ul>
                </section>

                {/* Specifications */}
                <section>
                  <h4 className="font-luxury text-lg text-slate-900 mb-3">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Bouquet Size</p>
                      <p className="font-medium">Medium / Large</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Stem Count</p>
                      <p className="font-medium">24–36 (approx.)</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Occasion</p>
                      <p className="font-medium">Luxury, Romance, Ceremony</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Delivery</p>
                      <p className="font-medium">Same-day available</p>
                    </div>
                  </div>
                </section>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignatureQuickView;


