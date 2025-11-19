// Category-specific flower name generators
export const flowerNameGenerators = {
  'birthday': [
    'Celebration Sparkle',
    'Golden Jubilee',
    'Birthday Bliss',
    'Festive Bloom',
    'Party Petals',
    'Joyful Celebration',
    'Milestone Magic',
    'Birthday Radiance',
    'Happy Harmony',
    'Festive Flourish'
  ],
  'butterfly': [
    'Butterfly Dreams',
    'Garden Flutter',
    'Winged Wonder',
    'Butterfly Whisper',
    'Ethereal Wings',
    'Garden Fantasy',
    'Butterfly Meadow',
    'Delicate Dance',
    'Butterfly Serenade',
    'Enchanted Garden'
  ],
  'gender': [
    'Sweet Reveal',
    'Baby Bliss',
    'Dreamy Delight',
    'Pastel Promise',
    'Tender Surprise',
    'Precious Moment',
    'Little Wonder',
    'Baby Dreams',
    'Gentle Joy',
    'Sweet Anticipation'
  ],
  'graduation': [
    'Achievement Glory',
    'Scholar\'s Pride',
    'Success Story',
    'Graduation Splendor',
    'Honor Bloom',
    'Victory Cascade',
    'Brilliant Future',
    'Academic Excellence',
    'Triumph Bouquet',
    'Milestone Achievement',
    'Golden Success',
    'Graduate\'s Dream'
  ],
  'hand band': [
    'Wrist Elegance',
    'Floral Bracelet',
    'Garden Embrace',
    'Wearable Bloom',
    'Handcrafted Grace',
    'Delicate Wrist',
    'Floral Jewel'
  ],
  'heart shape': [
    'Heart of Roses',
    'Love Silhouette',
    'Romantic Heart',
    'Heart\'s Desire',
    'Love Statement'
  ],
  'mother day': [
    'Mother\'s Love',
    'Graceful Mom',
    'Tender Heart',
    'Mom\'s Garden',
    'Gentle Embrace',
    'Mother\'s Grace',
    'Loving Tribute',
    'Mom\'s Treasure',
    'Sweet Mother',
    'Eternal Love'
  ],
  'pink': [
    'Pink Paradise',
    'Rose Blush',
    'Pink Perfection',
    'Blushing Beauty',
    'Pink Romance',
    'Soft Petals',
    'Pink Reverie'
  ],
  'red roses': [
    'Crimson Passion',
    'Red Romance',
    'Classic Rose',
    'Scarlet Love',
    'Ruby Roses',
    'Red Desire',
    'Eternal Flame'
  ],
  'valentine': [
    'Valentine\'s Kiss',
    'Romantic Embrace',
    'Love\'s Symphony',
    'Passionate Heart',
    'Cupid\'s Arrow',
    'True Love',
    'Forever Yours',
    'Romantic Passion',
    'Valentine Dream',
    'Heart\'s Devotion',
    'Endless Romance'
  ],
  'wedding % events': [
    'Wedding Dreams',
    'Bridal Elegance',
    'Eternal Union',
    'Wedding Bliss',
    'Grand Celebration',
    'Event Splendor',
    'Wedding Grace',
    'Celebration Luxe'
  ]
};

// Get a unique name for a bouquet based on category
export function generateFlowerName(category, index) {
  const names = flowerNameGenerators[category];
  
  if (!names || names.length === 0) {
    // Fallback to generic names
    return `Signature Bouquet ${index + 1}`;
  }
  
  // If we have more images than names, add numbers
  if (index >= names.length) {
    const nameIndex = index % names.length;
    const suffix = Math.floor(index / names.length) + 1;
    return `${names[nameIndex]} ${suffix}`;
  }
  
  return names[index];
}

