import { Flower } from '@/types/bouquet';

export type Season = "spring" | "summer" | "fall" | "winter" | "all-year";

export interface EnhancedFlower extends Flower {
  family: string;
  colorName: string;
  isTinted?: boolean;
  seasons?: Season[]; // Lebanon-specific seasonal availability
}

export const flowerFamilies = [
  { id: "roses", name: "Roses", icon: "🌹" },
  { id: "tulips", name: "Tulips", icon: "🌷" },
  { id: "peonies", name: "Peonies", icon: "🌸" },
  { id: "chrysanthemum", name: "Chrysanthemums", icon: "🌼" },
  { id: "gypsum", name: "Gypsum", icon: "🌫️" },
  { id: "daisies", name: "Daisies", icon: "🌼" },
  { id: "sunflower", name: "Sunflowers", icon: "🌻" },
  { id: "lily", name: "Lilies", icon: "🌺" },
  { id: "orchid", name: "Orchids", icon: "🌸" },
  { id: "hydrangea", name: "Hydrangeas", icon: "💠" },
  { id: "gerbera", name: "Gerberas", icon: "🌻" },
  { id: "lavender", name: "Lavender", icon: "🌿" },
  { id: "carnation", name: "Carnations", icon: "🌺" }
];

export const flowers: EnhancedFlower[] = [
  // Roses (All colors) - Year-round (always available, very resilient in cooler weather)
  { id: "rose-red", name: "Red Rose", price: 3.5, family: "roses", colorName: "red", category: "roses", imageUrl: "/assets/custom/roses/red.png", description: "Classic red rose", seasons: ["all-year"] },
  { id: "rose-white", name: "White Rose", price: 3.5, family: "roses", colorName: "white", category: "roses", imageUrl: "/assets/custom/roses/white.png", description: "Pure white rose", seasons: ["all-year"] },
  { id: "rose-pink", name: "Pink Rose", price: 3.5, family: "roses", colorName: "pink", category: "roses", imageUrl: "/assets/custom/roses/pink.png", description: "Soft pink rose", seasons: ["all-year"] },
  { id: "rose-yellow", name: "Yellow Rose", price: 3.5, family: "roses", colorName: "yellow", category: "roses", imageUrl: "/assets/custom/roses/yellow.png", description: "Bright yellow rose", seasons: ["all-year"] },
  { id: "rose-blue", name: "Blue Rose", price: 3.5, family: "roses", colorName: "blue", category: "roses", imageUrl: "/assets/custom/roses/blue.png", description: "Elegant blue rose", seasons: ["all-year"] },
  { id: "rose-peach", name: "Peach Rose", price: 3.5, family: "roses", colorName: "peach", category: "roses", imageUrl: "/assets/custom/roses/peach.png", description: "Soft peach rose", seasons: ["all-year"] },

  // Tulips (All colors) - Winter bloomer (Dec-Feb, best in Feb/March - ultimate winter bloom)
  { id: "tulip-red", name: "Red Tulip", price: 3.0, family: "tulips", colorName: "red", category: "tulips", imageUrl: "/assets/custom/tulips/red.png", description: "Romantic red tulip", seasons: ["winter", "spring"] },
  { id: "tulip-white", name: "White Tulip", price: 3.0, family: "tulips", colorName: "white", category: "tulips", imageUrl: "/assets/custom/tulips/white.png", description: "Elegant white tulip", seasons: ["winter", "spring"] },
  { id: "tulip-pink", name: "Pink Tulip", price: 3.0, family: "tulips", colorName: "pink", category: "tulips", imageUrl: "/assets/custom/tulips/pink.png", description: "Playful pink tulip", seasons: ["winter", "spring"] },
  { id: "tulip-yellow", name: "Yellow Tulip", price: 3.0, family: "tulips", colorName: "yellow", category: "tulips", imageUrl: "/assets/custom/tulips/yellow.png", description: "Sunny yellow tulip", seasons: ["winter", "spring"] },
  { id: "tulip-blue", name: "Blue Tulip", price: 3.0, family: "tulips", colorName: "blue", category: "tulips", imageUrl: "/assets/custom/tulips/blue.png", description: "Beautiful blue tulip", seasons: ["winter", "spring"] },
  { id: "tulip-peach", name: "Peach Tulip", price: 3.0, family: "tulips", colorName: "peach", category: "tulips", imageUrl: "/assets/custom/tulips/peach.png", description: "Soft peach tulip", seasons: ["winter", "spring"] },

  // Peonies (Pink, Fushia, White) - Summer (strictly late spring/early summer, very hard to find in winter)
  { id: "peony-pink", name: "Pink Peony", price: 6.0, family: "peonies", colorName: "pink", category: "seasonal", imageUrl: "/assets/custom/peonies/pink.png", description: "Lush pink peony", seasons: ["summer"] },
  { id: "peony-fushia", name: "Fushia Peony", price: 6.0, family: "peonies", colorName: "fushia", category: "seasonal", imageUrl: "/assets/custom/peonies/fushia.png", description: "Bold fushia peony", seasons: ["summer"] },
  { id: "peony-white", name: "White Peony", price: 6.0, family: "peonies", colorName: "white", category: "seasonal", imageUrl: "/assets/custom/peonies/white.png", description: "Delicate white peony", seasons: ["summer"] },

  // Chrysanthemum (White, Yellow, Orange, Purple) - Year-round (reliable late into the year, very popular for winter sprays)
  { id: "chrys-white", name: "White Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "white", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/white.png", description: "Classic white mum", seasons: ["all-year"] },
  { id: "chrys-yellow", name: "Yellow Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "yellow", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/yellow.png", description: "Golden yellow mum", seasons: ["all-year"] },
  { id: "chrys-orange", name: "Orange Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "orange", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/orange.png", description: "Warm orange mum", seasons: ["all-year"] },
  { id: "chrys-purple", name: "Purple Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "purple", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/purple.png", description: "Deep purple mum", seasons: ["all-year"] },

  // Gypsum (All colors) - Year-round (always available to add that "snowy" filler effect)
  { id: "gypsum-white", name: "White Gypsum", price: 2.0, family: "gypsum", colorName: "white", category: "wildflowers", imageUrl: "/assets/custom/gypsum/white.png", description: "Snowy white baby's breath", seasons: ["all-year"] },
  { id: "gypsum-pink", name: "Pink Gypsum", price: 2.5, family: "gypsum", colorName: "pink", category: "wildflowers", imageUrl: "/assets/custom/gypsum/pink.png", description: "Soft pink baby's breath", seasons: ["all-year"] },
  { id: "gypsum-blue", name: "Blue Gypsum", price: 2.5, family: "gypsum", colorName: "blue", category: "wildflowers", imageUrl: "/assets/custom/gypsum/blue.png", description: "Dreamy blue baby's breath", seasons: ["all-year"] },
  { id: "gypsum-dark-blue", name: "Dark Blue Gypsum", price: 2.5, family: "gypsum", colorName: "dark blue", category: "wildflowers", imageUrl: "/assets/custom/gypsum/dark blue.png", description: "Deep dark blue baby's breath", seasons: ["all-year"] },
  { id: "gypsum-purple", name: "Purple Gypsum", price: 2.5, family: "gypsum", colorName: "purple", category: "wildflowers", imageUrl: "/assets/custom/gypsum/purple.png", description: "Lavender purple baby's breath", seasons: ["all-year"] },
  { id: "gypsum-terracotta", name: "Terracotta Gypsum", price: 2.5, family: "gypsum", colorName: "terracotta", category: "wildflowers", imageUrl: "/assets/custom/gypsum/terracotta.png", description: "Warm terracotta baby's breath", seasons: ["all-year"] },
  { id: "gypsum-yellow", name: "Yellow Gypsum", price: 2.5, family: "gypsum", colorName: "yellow", category: "wildflowers", imageUrl: "/assets/custom/gypsum/Yellow.png", description: "Sunny yellow baby's breath", seasons: ["all-year"] },

  // Daisies (White, Yellow) - Summer (thrive in bright summer light)
  { id: "daisy-white", name: "White Daisy", price: 2.0, family: "daisies", colorName: "white", category: "wildflowers", imageUrl: "/assets/custom/daises/white.png", description: "Classic white daisy", seasons: ["summer"] },
  { id: "daisy-yellow", name: "Yellow Daisy", price: 2.0, family: "daisies", colorName: "yellow", category: "wildflowers", imageUrl: "/assets/custom/daises/yellow.png", description: "Sunshine yellow daisy", seasons: ["summer"] },

  // Sunflowers (Big, Small) - Summer (peak summer flower, best when the sun is strongest)
  { id: "sunflower-big", name: "Big Sunflower", price: 4.0, family: "sunflower", colorName: "yellow", category: "seasonal", imageUrl: "/assets/custom/sunflowers/big.png", description: "Large radiant sunflower", seasons: ["summer"] },
  { id: "sunflower-small", name: "Small Sunflower", price: 3.0, family: "sunflower", colorName: "yellow", category: "seasonal", imageUrl: "/assets/custom/sunflowers/small.png", description: "Petite sunflower", seasons: ["summer"] },

  // Lily (Yellow, Pink, White, Orange) - Winter (specifically white and pink lilies are very consistent in winter)
  { id: "lily-white", name: "White Lily", price: 5.0, family: "lily", colorName: "white", category: "lilies", imageUrl: "/assets/custom/lilly/white.png", description: "Elegant white lily", seasons: ["winter"] },
  { id: "lily-pink", name: "Pink Lily", price: 5.0, family: "lily", colorName: "pink", category: "lilies", imageUrl: "/assets/custom/lilly/pink.png", description: "Lovely pink lily", seasons: ["winter"] },
  { id: "lily-yellow", name: "Yellow Lily", price: 5.0, family: "lily", colorName: "yellow", category: "lilies", imageUrl: "/assets/custom/lilly/yellow.png", description: "Bright yellow lily", seasons: ["winter"] },
  { id: "lily-orange", name: "Orange Lily", price: 5.0, family: "lily", colorName: "orange", category: "lilies", imageUrl: "/assets/custom/lilly/orange.png", description: "Fiery orange lily", seasons: ["winter"] },

  // Orchid Plant (Blue, White, Pink) - Winter (often available as potted plants or luxury cut stems in winter)
  { id: "orchid-white", name: "White Orchid", price: 8.0, family: "orchid", colorName: "white", category: "exotic", imageUrl: "/assets/custom/orchid/white.png", description: "Sophisticated white orchid", seasons: ["winter"] },
  { id: "orchid-pink", name: "Pink Orchid", price: 8.0, family: "orchid", colorName: "pink", category: "exotic", imageUrl: "/assets/custom/orchid/pink.png", description: "Vibrant pink orchid", seasons: ["winter"] },
  { id: "orchid-blue", name: "Blue Orchid", price: 9.0, family: "orchid", colorName: "blue", category: "exotic", imageUrl: "/assets/custom/orchid/blue.png", description: "Rare blue orchid", seasons: ["winter"] },

  // Hydrangea (White, Pink, Blue) - Summer (love the heat but need a lot of water, big and voluminous for sprays)
  { id: "hydrangea-white", name: "White Hydrangea", price: 6.0, family: "hydrangea", colorName: "white", category: "seasonal", imageUrl: "/assets/custom/hydrangea/white.png", description: "Cloud-like white hydrangea", seasons: ["summer"] },
  { id: "hydrangea-pink", name: "Pink Hydrangea", price: 6.0, family: "hydrangea", colorName: "pink", category: "seasonal", imageUrl: "/assets/custom/hydrangea/pink.png", description: "Blooming pink hydrangea", seasons: ["summer"] },
  { id: "hydrangea-blue", name: "Blue Hydrangea", price: 6.0, family: "hydrangea", colorName: "blue", category: "seasonal", imageUrl: "/assets/custom/hydrangea/blue.png", description: "Deep blue hydrangea", seasons: ["summer"] },

  // Gerbera (Red, Yellow, Orange) - Summer (thrive in bright summer light)
  { id: "gerbera-red", name: "Red Gerbera", price: 3.0, family: "gerbera", colorName: "red", category: "wildflowers", imageUrl: "/assets/custom/gerbera/red.png", description: "Bold red gerbera", seasons: ["summer"] },
  { id: "gerbera-yellow", name: "Yellow Gerbera", price: 3.0, family: "gerbera", colorName: "yellow", category: "wildflowers", imageUrl: "/assets/custom/gerbera/yellow.png", description: "Happy yellow gerbera", seasons: ["summer"] },
  { id: "gerbera-orange", name: "Orange Gerbera", price: 3.0, family: "gerbera", colorName: "orange", category: "wildflowers", imageUrl: "/assets/custom/gerbera/orange.png", description: "Zesty orange gerbera", seasons: ["summer"] },

  // Lavender - Summer (typically harvested in the warmer months when the scent is strongest)
  { id: "lavender", name: "Lavender", price: 4.0, family: "lavender", colorName: "purple", category: "herbs", imageUrl: "/assets/custom/lavender/purple.png", description: "Aromatic lavender bundle", seasons: ["summer"] },

  // Carnation (Yellow, White, Purple, Pink, Red) - Year-round (very hardy, traditional for sprays, handle winter humidity well)
  { id: "carnation-red", name: "Red Carnation", price: 2.0, family: "carnation", colorName: "red", category: "carnations", imageUrl: "/assets/custom/carnation/red.png", description: "Deep red carnation", seasons: ["all-year"] },
  { id: "carnation-white", name: "White Carnation", price: 2.0, family: "carnation", colorName: "white", category: "carnations", imageUrl: "/assets/custom/carnation/white.png", description: "Pure white carnation", seasons: ["all-year"] },
  { id: "carnation-pink", name: "Pink Carnation", price: 2.0, family: "carnation", colorName: "pink", category: "carnations", imageUrl: "/assets/custom/carnation/pink.png", description: "Sweet pink carnation", seasons: ["all-year"] },
  { id: "carnation-purple", name: "Purple Carnation", price: 2.0, family: "carnation", colorName: "purple", category: "carnations", imageUrl: "/assets/custom/carnation/purple.png", description: "Royal purple carnation", seasons: ["all-year"] },
  { id: "carnation-yellow", name: "Yellow Carnation", price: 2.0, family: "carnation", colorName: "yellow", category: "carnations", imageUrl: "/assets/custom/carnation/yellow.png", description: "Bright yellow carnation", seasons: ["all-year"] }
];

export const flowerCategories = flowerFamilies;
