import React, { Suspense } from "react";
import { Sparkles, Wand2, Palette, Flower2, ChevronRight } from "lucide-react";
import LazySection from "@/components/LazySection";
import UltraNavigation from "@/components/UltraNavigation";
const InteractiveBackground = React.lazy(() => import("@/components/interactive/InteractiveBackground"));
const UltraHero = React.lazy(() => import("@/components/UltraHero"));
const UltraFeaturedBouquets = React.lazy(() => import("@/components/UltraFeaturedBouquets"));
const UltraCategories = React.lazy(() => import("@/components/UltraCategories"));
// Replaced heavy interactive builder on home with lightweight CTA
// const VirtualBouquetBuilder = React.lazy(() => import("@/components/interactive/VirtualBouquetBuilder"));
const FlowerPersonalityQuiz = React.lazy(() => import("@/components/culture/FlowerPersonalityQuiz"));
const FlowerCareGuide = React.lazy(() => import("@/components/culture/FlowerCareGuide"));
const Footer = React.lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <UltraNavigation />
      <Suspense fallback={null}>
        <InteractiveBackground />
      </Suspense>
      <div className="relative z-10">
        <Suspense fallback={null}>
          <UltraHero />
        </Suspense>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <UltraFeaturedBouquets />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <UltraCategories />
          </Suspense>
        </LazySection>
        {/* Lightweight CTA replacing the heavy builder on home */}
        <LazySection rootMargin="400px 0px">
          <section className="relative py-28 px-6">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-transparent pointer-events-none" aria-hidden></div>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-12 gap-10 items-center">
                <div className="md:col-span-7 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/60 text-amber-800 text-sm font-medium ring-1 ring-amber-200">
                    <Sparkles className="h-4 w-4" />
                    Live Customization
                  </div>
                  <div className="relative mt-4 inline-block">
                    <span className="absolute -inset-3 blur-2xl bg-gradient-to-r from-yellow-300/20 via-amber-400/20 to-yellow-600/20 rounded-full" aria-hidden></span>
                    <h2 className="relative font-luxury text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent tracking-tight">
                      Design Your Perfect Bouquet
                    </h2>
                  </div>
                  <p className="mt-6 font-body text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-none">
                    Create a custom arrangement with unlimited creativity. Explore curated palettes, blend textures and tones, and preview your bouquet in luxurious detail—before a single stem is cut.
                  </p>
                  <ul className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
                    <li className="flex items-start gap-3">
                      <Wand2 className="h-5 w-5 mt-1 text-amber-600" />
                      <div>
                        <p className="font-medium">Instant style presets</p>
                        <p className="text-sm text-muted-foreground">Romantic, modern, boho, and more—start fast and personalize.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Palette className="h-5 w-5 mt-1 text-amber-600" />
                      <div>
                        <p className="font-medium">Curated color stories</p>
                        <p className="text-sm text-muted-foreground">Handpicked tones for weddings, events, and everyday elegance.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Flower2 className="h-5 w-5 mt-1 text-amber-600" />
                      <div>
                        <p className="font-medium">Premium blooms</p>
                        <p className="text-sm text-muted-foreground">Only the finest stems sourced seasonally and responsibly.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 mt-1 text-amber-600" />
                      <div>
                        <p className="font-medium">HD previews</p>
                        <p className="text-sm text-muted-foreground">See nuanced lighting and texture before you place your order.</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <a href="/customize" className="group inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-[rgb(209,162,73)] via-[rgb(229,182,93)] to-[rgb(209,162,73)] text-white shadow-lg hover:shadow-[0_10px_30px_rgba(209,162,73,0.35)] transition-all">
                      Start Customizing
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <a href="/collection" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium border border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-colors">
                      Explore inspiration
                    </a>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="relative mx-auto max-w-md">
                    <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-amber-200/30 via-yellow-100/20 to-transparent blur-2xl" aria-hidden></div>
                    <div className="relative rounded-3xl border border-amber-200/40 bg-gradient-to-br from-white/60 to-amber-50/40 backdrop-blur-sm shadow-xl p-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-24 rounded-xl bg-gradient-to-br from-rose-200 to-rose-100" />
                        <div className="h-24 rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-100" />
                        <div className="h-24 rounded-xl bg-gradient-to-br from-indigo-200 to-indigo-100" />
                        <div className="h-24 rounded-xl bg-gradient-to-br from-amber-200 to-amber-100" />
                        <div className="h-24 rounded-xl bg-gradient-to-br from-pink-200 to-pink-100" />
                        <div className="h-24 rounded-xl bg-gradient-to-br from-sky-200 to-sky-100" />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground text-center">Preview palettes and textures in a clean, modern canvas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <FlowerPersonalityQuiz />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="400px 0px">
          <Suspense fallback={null}>
            <FlowerCareGuide />
          </Suspense>
        </LazySection>
        <LazySection rootMargin="600px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>
    </div>
  );
};

export default Index;
