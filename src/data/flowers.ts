import { Flower, PreDesignedBouquet } from '@/types/bouquet';
import redFlower from '@/assets/flowers/red.png';
import whiteFlower from '@/assets/flowers/white .png';
import pinkFlower from '@/assets/flowers/pink.png';

export const flowers: Flower[] = [
  {
    id: "red-rose",
    name: "Red Rose",
    price: 3.5,
    imageUrl: redFlower,
    category: "roses",
    description: "Classic red rose symbolizing love and passion"
  },
  {
    id: "white-rose",
    name: "White Rose",
    price: 3.5,
    imageUrl: whiteFlower,
    category: "roses",
    description: "Pure white rose representing innocence and new beginnings"
  },
  {
    id: "pink-rose",
    name: "Pink Rose",
    price: 3.5,
    imageUrl: pinkFlower,
    category: "roses",
    description: "Soft pink rose for gratitude and appreciation"
  },
  {
    id: "yellow-rose",
    name: "Yellow Rose",
    price: 3.5,
    imageUrl: "/images/flowers/yellow-rose.png",
    category: "roses",
    description: "Bright yellow rose symbolizing friendship and joy"
  },
  {
    id: "pink-tulip",
    name: "Pink Tulip",
    price: 4.0,
    imageUrl: "/images/flowers/pink-tulip.png",
    category: "tulips",
    description: "Elegant pink tulip representing perfect love"
  },
  {
    id: "red-tulip",
    name: "Red Tulip",
    price: 4.0,
    imageUrl: "/images/flowers/red-tulip.png",
    category: "tulips",
    description: "Bold red tulip symbolizing true love"
  },
  {
    id: "white-tulip",
    name: "White Tulip",
    price: 4.0,
    imageUrl: "/images/flowers/white-tulip.png",
    category: "tulips",
    description: "Pure white tulip for forgiveness and worthiness"
  },
  {
    id: "purple-lavender",
    name: "Purple Lavender",
    price: 2.5,
    imageUrl: "/images/flowers/purple-lavender.png",
    category: "herbs",
    description: "Fragrant purple lavender for calm and serenity"
  },
  {
    id: "white-lily",
    name: "White Lily",
    price: 5.0,
    imageUrl: "/images/flowers/white-lily.png",
    category: "lilies",
    description: "Elegant white lily representing purity and renewal"
  },
  {
    id: "pink-lily",
    name: "Pink Lily",
    price: 5.0,
    imageUrl: "/images/flowers/pink-lily.png",
    category: "lilies",
    description: "Beautiful pink lily symbolizing prosperity and abundance"
  },
  {
    id: "sunflower",
    name: "Sunflower",
    price: 4.5,
    imageUrl: "/images/flowers/sunflower.png",
    category: "seasonal",
    description: "Bright sunflower representing adoration and loyalty"
  },
  {
    id: "daisy",
    name: "White Daisy",
    price: 2.0,
    imageUrl: "/images/flowers/white-daisy.png",
    category: "wildflowers",
    description: "Simple white daisy symbolizing innocence and purity"
  },
  {
    id: "orchid",
    name: "Purple Orchid",
    price: 8.0,
    imageUrl: "/images/flowers/purple-orchid.png",
    category: "exotic",
    description: "Exotic purple orchid representing luxury and beauty"
  },
  {
    id: "carnation",
    name: "Pink Carnation",
    price: 2.5,
    imageUrl: "/images/flowers/pink-carnation.png",
    category: "carnations",
    description: "Sweet pink carnation symbolizing a mother's love"
  },
  {
    id: "iris",
    name: "Blue Iris",
    price: 3.0,
    imageUrl: "/images/flowers/blue-iris.png",
    category: "seasonal",
    description: "Striking blue iris representing faith and wisdom"
  },
  {
    id: "peony",
    name: "Pink Peony",
    price: 6.0,
    imageUrl: "/images/flowers/pink-peony.png",
    category: "seasonal",
    description: "Luxurious pink peony symbolizing honor and romance"
  }
];

export const preDesignedBouquets: PreDesignedBouquet[] = [
  {
    id: "romantic-red",
    name: "Romantic Red Bouquet",
    description: "A passionate bouquet perfect for anniversaries and declarations of love",
    imageUrl: "/images/bouquets/romantic-red.jpg",
    category: "romance",
    totalPrice: 35.0,
    flowers: [
      { flowerId: "red-rose", quantity: 8, position: { x: 20, y: 30, rotation: -15, scale: 1.0 } },
      { flowerId: "white-rose", quantity: 4, position: { x: 80, y: 25, rotation: 10, scale: 0.9 } },
      { flowerId: "purple-lavender", quantity: 6, position: { x: 50, y: 60, rotation: 0, scale: 0.8 } }
    ]
  },
  {
    id: "spring-garden",
    name: "Spring Garden Bouquet",
    description: "A fresh and vibrant bouquet celebrating the beauty of spring",
    imageUrl: "/images/bouquets/spring-garden.jpg",
    category: "seasonal",
    totalPrice: 45.0,
    flowers: [
      { flowerId: "pink-tulip", quantity: 6, position: { x: 30, y: 40, rotation: -20, scale: 1.1 } },
      { flowerId: "yellow-rose", quantity: 4, position: { x: 70, y: 35, rotation: 15, scale: 1.0 } },
      { flowerId: "white-daisy", quantity: 8, position: { x: 50, y: 70, rotation: 0, scale: 0.7 } },
      { flowerId: "purple-lavender", quantity: 5, position: { x: 20, y: 80, rotation: -10, scale: 0.8 } }
    ]
  },
  {
    id: "elegant-white",
    name: "Elegant White Bouquet",
    description: "A sophisticated white bouquet perfect for weddings and formal occasions",
    imageUrl: "/images/bouquets/elegant-white.jpg",
    category: "formal",
    totalPrice: 55.0,
    flowers: [
      { flowerId: "white-rose", quantity: 10, position: { x: 40, y: 30, rotation: 0, scale: 1.0 } },
      { flowerId: "white-lily", quantity: 3, position: { x: 60, y: 25, rotation: 5, scale: 1.2 } },
      { flowerId: "white-tulip", quantity: 5, position: { x: 25, y: 60, rotation: -15, scale: 0.9 } },
      { flowerId: "white-daisy", quantity: 6, position: { x: 75, y: 65, rotation: 10, scale: 0.8 } }
    ]
  },
  {
    id: "sunset-dreams",
    name: "Sunset Dreams Bouquet",
    description: "A warm and cozy bouquet with sunset colors",
    imageUrl: "/images/bouquets/sunset-dreams.jpg",
    category: "warm",
    totalPrice: 42.0,
    flowers: [
      { flowerId: "sunflower", quantity: 3, position: { x: 50, y: 20, rotation: 0, scale: 1.3 } },
      { flowerId: "orange-rose", quantity: 6, position: { x: 30, y: 45, rotation: -10, scale: 1.0 } },
      { flowerId: "yellow-rose", quantity: 4, position: { x: 70, y: 50, rotation: 15, scale: 0.9 } },
      { flowerId: "purple-lavender", quantity: 7, position: { x: 50, y: 75, rotation: 0, scale: 0.8 } }
    ]
  }
];

export const flowerCategories = [
  { id: "all", name: "All Flowers", icon: "🌸" },
  { id: "roses", name: "Roses", icon: "🌹" },
  { id: "tulips", name: "Tulips", icon: "🌷" },
  { id: "lilies", name: "Lilies", icon: "🌺" },
  { id: "seasonal", name: "Seasonal", icon: "🌻" },
  { id: "wildflowers", name: "Wildflowers", icon: "🌼" },
  { id: "exotic", name: "Exotic", icon: "🌸" },
  { id: "herbs", name: "Herbs", icon: "🌿" },
  { id: "carnations", name: "Carnations", icon: "🌺" }
];
