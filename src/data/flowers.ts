import { Flower } from '@/types/bouquet';

export interface EnhancedFlower extends Flower {
  family: string;
  colorName: string;
  isTinted?: boolean;
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
  // Roses (All colors)
  { id: "rose-red", name: "Red Rose", price: 3.5, family: "roses", colorName: "red", category: "roses", imageUrl: "/assets/custom/roses/red.png", description: "Classic red rose" },
  { id: "rose-white", name: "White Rose", price: 3.5, family: "roses", colorName: "white", category: "roses", imageUrl: "/assets/custom/roses/white.png", description: "Pure white rose" },
  { id: "rose-pink", name: "Pink Rose", price: 3.5, family: "roses", colorName: "pink", category: "roses", imageUrl: "/assets/custom/roses/pink.png", description: "Soft pink rose" },
  { id: "rose-yellow", name: "Yellow Rose", price: 3.5, family: "roses", colorName: "yellow", category: "roses", imageUrl: "/assets/custom/roses/yellow.png", description: "Bright yellow rose" },
  { id: "rose-blue", name: "Blue Rose", price: 3.5, family: "roses", colorName: "blue", category: "roses", imageUrl: "/assets/custom/roses/blue.png", description: "Elegant blue rose" },
  { id: "rose-peach", name: "Peach Rose", price: 3.5, family: "roses", colorName: "peach", category: "roses", imageUrl: "/assets/custom/roses/peach.png", description: "Soft peach rose" },

  // Tulips (All colors)
  { id: "tulip-red", name: "Red Tulip", price: 3.0, family: "tulips", colorName: "red", category: "tulips", imageUrl: "/assets/custom/tulips/red.png", description: "Romantic red tulip" },
  { id: "tulip-white", name: "White Tulip", price: 3.0, family: "tulips", colorName: "white", category: "tulips", imageUrl: "/assets/custom/tulips/white.png", description: "Elegant white tulip" },
  { id: "tulip-pink", name: "Pink Tulip", price: 3.0, family: "tulips", colorName: "pink", category: "tulips", imageUrl: "/assets/custom/tulips/pink.png", description: "Playful pink tulip" },
  { id: "tulip-yellow", name: "Yellow Tulip", price: 3.0, family: "tulips", colorName: "yellow", category: "tulips", imageUrl: "/assets/custom/tulips/yellow.png", description: "Sunny yellow tulip" },
  { id: "tulip-blue", name: "Blue Tulip", price: 3.0, family: "tulips", colorName: "blue", category: "tulips", imageUrl: "/assets/custom/tulips/blue.png", description: "Beautiful blue tulip" },
  { id: "tulip-peach", name: "Peach Tulip", price: 3.0, family: "tulips", colorName: "peach", category: "tulips", imageUrl: "/assets/custom/tulips/peach.png", description: "Soft peach tulip" },

  // Peonies (Pink, Fushia, White)
  { id: "peony-pink", name: "Pink Peony", price: 6.0, family: "peonies", colorName: "pink", category: "seasonal", imageUrl: "/assets/custom/peonies/pink.png", description: "Lush pink peony" },
  { id: "peony-fushia", name: "Fushia Peony", price: 6.0, family: "peonies", colorName: "fushia", category: "seasonal", imageUrl: "/assets/custom/peonies/fushia.png", description: "Bold fushia peony" },
  { id: "peony-white", name: "White Peony", price: 6.0, family: "peonies", colorName: "white", category: "seasonal", imageUrl: "/assets/custom/peonies/white.png", description: "Delicate white peony" },

  // Chrysanthemum (White, Yellow, Orange, Purple)
  { id: "chrys-white", name: "White Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "white", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/white.png", description: "Classic white mum" },
  { id: "chrys-yellow", name: "Yellow Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "yellow", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/yellow.png", description: "Golden yellow mum" },
  { id: "chrys-orange", name: "Orange Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "orange", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/orange.png", description: "Warm orange mum" },
  { id: "chrys-purple", name: "Purple Chrysanthemum", price: 2.5, family: "chrysanthemum", colorName: "purple", category: "seasonal", imageUrl: "/assets/custom/chrysanthemum/purple.png", description: "Deep purple mum" },

  // Gypsum (All colors)
  { id: "gypsum-white", name: "White Gypsum", price: 2.0, family: "gypsum", colorName: "white", category: "wildflowers", imageUrl: "/assets/flowers/gypsum-white.png", description: "Snowy white baby's breath" },
  { id: "gypsum-pink", name: "Pink Gypsum", price: 2.5, family: "gypsum", colorName: "pink", category: "wildflowers", imageUrl: "/assets/flowers/gypsum-pink.png", description: "Soft pink baby's breath" },
  { id: "gypsum-blue", name: "Blue Gypsum", price: 2.5, family: "gypsum", colorName: "blue", category: "wildflowers", imageUrl: "/assets/flowers/gypsum-blue.png", description: "Dreamy blue baby's breath" },

  // Daisies (White, Yellow)
  { id: "daisy-white", name: "White Daisy", price: 2.0, family: "daisies", colorName: "white", category: "wildflowers", imageUrl: "/assets/flowers/daisy-white.png", description: "Classic white daisy" },
  { id: "daisy-yellow", name: "Yellow Daisy", price: 2.0, family: "daisies", colorName: "yellow", category: "wildflowers", imageUrl: "/assets/flowers/daisy-yellow.png", description: "Sunshine yellow daisy" },

  // Sunflower (Baby, Big)
  { id: "sunflower-big", name: "Big Sunflower", price: 4.0, family: "sunflower", colorName: "yellow", category: "seasonal", imageUrl: "/assets/flowers/sunflower-big.png", description: "Large radiant sunflower" },
  { id: "sunflower-baby", name: "Baby Sunflower", price: 3.0, family: "sunflower", colorName: "yellow", category: "seasonal", imageUrl: "/assets/flowers/sunflower-baby.png", description: "Petite sunflower" },

  // Lily (Yellow, Pink, White, Orange)
  { id: "lily-white", name: "White Lily", price: 5.0, family: "lily", colorName: "white", category: "lilies", imageUrl: "/assets/flowers/lily-white.png", description: "Elegant white lily" },
  { id: "lily-pink", name: "Pink Lily", price: 5.0, family: "lily", colorName: "pink", category: "lilies", imageUrl: "/assets/flowers/lily-pink.png", description: "Lovely pink lily" },
  { id: "lily-yellow", name: "Yellow Lily", price: 5.0, family: "lily", colorName: "yellow", category: "lilies", imageUrl: "/assets/flowers/lily-yellow.png", description: "Bright yellow lily" },
  { id: "lily-orange", name: "Orange Lily", price: 5.0, family: "lily", colorName: "orange", category: "lilies", imageUrl: "/assets/flowers/lily-orange.png", description: "Fiery orange lily" },

  // Orchid Plant (Blue, White, Pink)
  { id: "orchid-white", name: "White Orchid", price: 8.0, family: "orchid", colorName: "white", category: "exotic", imageUrl: "/assets/flowers/orchid-white.png", description: "Sophisticated white orchid" },
  { id: "orchid-pink", name: "Pink Orchid", price: 8.0, family: "orchid", colorName: "pink", category: "exotic", imageUrl: "/assets/flowers/orchid-pink.png", description: "Vibrant pink orchid" },
  { id: "orchid-blue", name: "Blue Orchid", price: 9.0, family: "orchid", colorName: "blue", category: "exotic", imageUrl: "/assets/flowers/orchid-blue.png", description: "Rare blue orchid" },

  // Hydrangea (White, Pink, Blue)
  { id: "hydrangea-white", name: "White Hydrangea", price: 6.0, family: "hydrangea", colorName: "white", category: "seasonal", imageUrl: "/assets/flowers/hydrangea-white.png", description: "Cloud-like white hydrangea" },
  { id: "hydrangea-pink", name: "Pink Hydrangea", price: 6.0, family: "hydrangea", colorName: "pink", category: "seasonal", imageUrl: "/assets/flowers/hydrangea-pink.png", description: "Blooming pink hydrangea" },
  { id: "hydrangea-blue", name: "Blue Hydrangea", price: 6.0, family: "hydrangea", colorName: "blue", category: "seasonal", imageUrl: "/assets/flowers/hydrangea-blue.png", description: "Deep blue hydrangea" },

  // Gerbera (Red, Yellow, Orange)
  { id: "gerbera-red", name: "Red Gerbera", price: 3.0, family: "gerbera", colorName: "red", category: "wildflowers", imageUrl: "/assets/flowers/gerbera-red.png", description: "Bold red gerbera" },
  { id: "gerbera-yellow", name: "Yellow Gerbera", price: 3.0, family: "gerbera", colorName: "yellow", category: "wildflowers", imageUrl: "/assets/flowers/gerbera-yellow.png", description: "Happy yellow gerbera" },
  { id: "gerbera-orange", name: "Orange Gerbera", price: 3.0, family: "gerbera", colorName: "orange", category: "wildflowers", imageUrl: "/assets/flowers/gerbera-orange.png", description: "Zesty orange gerbera" },

  // Lavender
  { id: "lavender", name: "Lavender", price: 4.0, family: "lavender", colorName: "purple", category: "herbs", imageUrl: "/assets/flowers/lavender.png", description: "Aromatic lavender bundle" },

  // Carnation (Yellow, White, Purple, Pink, Red)
  { id: "carnation-red", name: "Red Carnation", price: 2.0, family: "carnation", colorName: "red", category: "carnations", imageUrl: "/assets/flowers/carnation-red.png", description: "Deep red carnation" },
  { id: "carnation-white", name: "White Carnation", price: 2.0, family: "carnation", colorName: "white", category: "carnations", imageUrl: "/assets/flowers/carnation-white.png", description: "Pure white carnation" },
  { id: "carnation-pink", name: "Pink Carnation", price: 2.0, family: "carnation", colorName: "pink", category: "carnations", imageUrl: "/assets/flowers/carnation-pink.png", description: "Sweet pink carnation" },
  { id: "carnation-purple", name: "Purple Carnation", price: 2.0, family: "carnation", colorName: "purple", category: "carnations", imageUrl: "/assets/flowers/carnation-purple.png", description: "Royal purple carnation" },
  { id: "carnation-yellow", name: "Yellow Carnation", price: 2.0, family: "carnation", colorName: "yellow", category: "carnations", imageUrl: "/assets/flowers/carnation-yellow.png", description: "Bright yellow carnation" }
];

export const flowerCategories = flowerFamilies;
