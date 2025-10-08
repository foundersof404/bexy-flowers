/**
 * Zodiac Signs Data Structure - Research-Based & Astrologically Accurate
 * Sources: Verified astrological databases, floral astrology guides
 * Each sign has authentic traits, colors, flowers, and bouquet recommendations
 */

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  dates: string;
  rulingPlanet: string;
  traits: string[];
  colors: string[];
  flowers: string[];
  personality: string;
  bouquetStyle: string;
  recommendedBouquets: ZodiacBouquet[];
  compatibility: string[];
  luckyNumbers: number[];
  gemstone: string;
}

export interface ZodiacBouquet {
  id: string;
  name: string;
  description: string;
  flowers: string[];
  colors: string[];
  price: number;
  image: string;
  occasion: string;
  meaning: string;
  specialFeatures: string[];
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    modality: 'cardinal',
    dates: 'March 21 - April 19',
    rulingPlanet: 'Mars',
    traits: ['bold', 'energetic', 'passionate', 'confident', 'adventurous', 'courageous'],
    colors: ['#DC143C', '#FF4500', '#B22222', '#CD5C5C'], // Crimson, Orange-Red, Firebrick, Indian Red
    flowers: ['honeysuckle', 'tiger lily', 'red tulips', 'marigolds'],
    personality: 'Bold and energetic, Aries leads with passion and courage. As the first sign of the zodiac, you\'re a natural pioneer who isn\'t afraid to take risks and blaze new trails. Your fiery spirit inspires others.',
    bouquetStyle: 'Bold, vibrant arrangements with strong reds and dynamic shapes that command attention',
    recommendedBouquets: [
      {
        id: 'aries-fire-passion',
        name: 'Fire & Passion',
        description: 'A bold arrangement of tiger lilies, red tulips, and honeysuckle that captures Aries\' fierce energy',
        flowers: ['Tiger Lily', 'Red Tulips', 'Honeysuckle', 'Red Roses'],
        colors: ['Crimson', 'Orange-Red', 'Bold Red'],
        price: 189,
        image: '/assets/bouquet-1.jpg',
        occasion: 'New Beginnings, Courage, Leadership',
        meaning: 'Ignites passion, boldness, and pioneering spirit',
        specialFeatures: ['Dynamic asymmetric shape', 'Vibrant red palette', 'Bold statement piece']
      }
    ],
    compatibility: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    luckyNumbers: [1, 8, 17],
    gemstone: 'Diamond'
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    modality: 'fixed',
    dates: 'April 20 - May 20',
    rulingPlanet: 'Venus',
    traits: ['patient', 'reliable', 'practical', 'devoted', 'romantic', 'sensual'],
    colors: ['#90EE90', '#FFB6C1', '#DEB887', '#F5F5DC'], // Light Green, Light Pink, Burlywood, Beige
    flowers: ['lily', 'red rose', 'poppy', 'violet', 'daisy'],
    personality: 'Grounded and sensual, Taurus appreciates beauty, comfort, and the finer things in life. Ruled by Venus, you have an innate love for luxury, stability, and lasting relationships. Your patience is unmatched.',
    bouquetStyle: 'Luxurious, earthy arrangements with rich textures, pinks, and greens that evoke comfort',
    recommendedBouquets: [
      {
        id: 'taurus-earth-luxury',
        name: 'Earthly Luxury',
        description: 'Rich pink roses, white lilies, and daisies in warm, earthy tones that embody Taurus\' love for beauty',
        flowers: ['Pink Roses', 'White Lilies', 'Daisies', 'Violets'],
        colors: ['Pink', 'Green', 'Cream', 'White'],
        price: 225,
        image: '/assets/bouquet-2.jpg',
        occasion: 'Romance, Luxury, Stability',
        meaning: 'Represents stability, sensuality, and enduring beauty',
        specialFeatures: ['Luxurious texture', 'Earthy palette', 'Premium quality flowers']
      }
    ],
    compatibility: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    luckyNumbers: [2, 6, 9, 12, 24],
    gemstone: 'Emerald'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    modality: 'mutable',
    dates: 'May 21 - June 20',
    rulingPlanet: 'Mercury',
    traits: ['curious', 'versatile', 'communicative', 'witty', 'adaptable', 'intellectual'],
    colors: ['#FFFF00', '#F0E68C', '#90EE90', '#E6E6FA'], // Yellow, Khaki, Light Green, Lavender
    flowers: ['lavender', 'lily of the valley', 'yellow rose', 'orchid', 'freesia'],
    personality: 'Quick-witted and versatile, Gemini loves variety and intellectual stimulation. Ruled by Mercury, you\'re a natural communicator who thrives on social connections and mental challenges. Your adaptability is your superpower.',
    bouquetStyle: 'Playful, varied arrangements with mixed textures, yellows, and light greens for vibrancy',
    recommendedBouquets: [
      {
        id: 'gemini-air-versatility',
        name: 'Air & Wit',
        description: 'A playful mix of lavender, yellow roses, and lily of the valley that captures Gemini\'s dynamic spirit',
        flowers: ['Lavender', 'Yellow Roses', 'Lily of the Valley', 'Freesia'],
        colors: ['Yellow', 'Lavender', 'Light Green', 'White'],
        price: 165,
        image: '/assets/bouquet-3.jpg',
        occasion: 'Communication, Learning, Friendship',
        meaning: 'Encourages curiosity, adaptability, and joyful connections',
        specialFeatures: ['Mixed textures', 'Light airy feel', 'Versatile design']
      }
    ],
    compatibility: ['Libra', 'Aquarius', 'Aries', 'Leo'],
    luckyNumbers: [5, 7, 14, 23],
    gemstone: 'Agate'
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    modality: 'cardinal',
    dates: 'June 21 - July 22',
    rulingPlanet: 'Moon',
    traits: ['emotional', 'intuitive', 'protective', 'nurturing', 'sensitive', 'loyal'],
    colors: ['#FFFFFF', '#C0C0C0', '#F0F8FF', '#E0FFFF'], // White, Silver, Alice Blue, Light Cyan
    flowers: ['white rose', 'white lily', 'hydrangea', 'jasmine', 'forget-me-not'],
    personality: 'Emotional and intuitive, Cancer is deeply connected to home, family, and emotions. Ruled by the Moon, you experience life through your feelings and have an incredible capacity to nurture and protect those you love.',
    bouquetStyle: 'Soft, romantic arrangements with whites, silvers, and gentle flowing shapes',
    recommendedBouquets: [
      {
        id: 'cancer-water-nurture',
        name: 'Moon & Water',
        description: 'Soft white roses, lilies, and hydrangeas for emotional healing and nurturing Cancer energy',
        flowers: ['White Roses', 'White Lilies', 'Hydrangeas', 'Jasmine'],
        colors: ['White', 'Silver', 'Pale Blue', 'Cream'],
        price: 199,
        image: '/assets/bouquet-4.jpg',
        occasion: 'Emotional Healing, Family, Home',
        meaning: 'Nurtures emotional well-being and deep connections',
        specialFeatures: ['Soft textures', 'Romantic feel', 'Calming presence']
      }
    ],
    compatibility: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
    luckyNumbers: [2, 7, 11, 16, 20, 25],
    gemstone: 'Pearl'
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    modality: 'fixed',
    dates: 'July 23 - August 22',
    rulingPlanet: 'Sun',
    traits: ['confident', 'charismatic', 'generous', 'creative', 'passionate', 'loyal'],
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFFF00'], // Gold, Orange, Dark Orange, Yellow
    flowers: ['sunflower', 'marigold', 'red rose', 'orchid', 'dahlia'],
    personality: 'Confident and charismatic, Leo loves to shine and spread warmth wherever you go. Ruled by the Sun, you have a magnetic personality that naturally draws others in. Your generosity and loyalty know no bounds.',
    bouquetStyle: 'Dramatic, regal arrangements with golds, oranges, and bold shapes fit for royalty',
    recommendedBouquets: [
      {
        id: 'leo-sun-royalty',
        name: 'Sun & Royalty',
        description: 'Majestic sunflowers, golden roses, and marigolds that embody Leo\'s radiant, regal nature',
        flowers: ['Sunflowers', 'Golden Roses', 'Marigolds', 'Red Roses'],
        colors: ['Gold', 'Orange', 'Yellow', 'Red'],
        price: 245,
        image: '/assets/bouquet-5.jpg',
        occasion: 'Leadership, Celebration, Achievement',
        meaning: 'Represents confidence, generosity, and radiant energy',
        specialFeatures: ['Regal appearance', 'Warm golden tones', 'Dramatic presence']
      }
    ],
    compatibility: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    luckyNumbers: [1, 3, 10, 19],
    gemstone: 'Ruby'
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    modality: 'mutable',
    dates: 'August 23 - September 22',
    rulingPlanet: 'Mercury',
    traits: ['analytical', 'practical', 'modest', 'hardworking', 'detail-oriented', 'helpful'],
    colors: ['#808080', '#A9A9A9', '#D2B48C', '#F5F5DC'], // Grey, Dark Grey, Tan, Beige
    flowers: ['daisy', 'morning glory', 'chrysanthemum', 'lavender', 'aster'],
    personality: 'Analytical and practical, Virgo appreciates perfection and attention to detail. Ruled by Mercury, you have a sharp mind and natural ability to organize and improve everything around you. Your helpfulness is genuine.',
    bouquetStyle: 'Elegant, refined arrangements with perfect symmetry, greys, and earthy neutrals',
    recommendedBouquets: [
      {
        id: 'virgo-earth-precision',
        name: 'Earth & Precision',
        description: 'Elegant daisies, chrysanthemums, and lavender in refined, perfectly balanced arrangements',
        flowers: ['Daisies', 'Chrysanthemums', 'Morning Glory', 'Lavender'],
        colors: ['Grey', 'White', 'Lavender', 'Tan'],
        price: 175,
        image: '/assets/bouquet-6.jpg',
        occasion: 'Work Success, Health, Organization',
        meaning: 'Promotes organization, wellness, and attention to detail',
        specialFeatures: ['Perfect symmetry', 'Refined colors', 'Meticulous design']
      }
    ],
    compatibility: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    luckyNumbers: [5, 14, 15, 23, 32],
    gemstone: 'Sapphire'
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    modality: 'cardinal',
    dates: 'September 23 - October 22',
    rulingPlanet: 'Venus',
    traits: ['diplomatic', 'charming', 'social', 'fair', 'romantic', 'harmonious'],
    colors: ['#FFB6C1', '#ADD8E6', '#FFC0CB', '#E6E6FA'], // Light Pink, Light Blue, Pink, Lavender
    flowers: ['rose', 'hydrangea', 'peony', 'bluebell', 'cosmos'],
    personality: 'Diplomatic and charming, Libra seeks balance and harmony in all relationships. Ruled by Venus, you have an innate appreciation for beauty, art, and partnership. Your ability to see both sides makes you a natural mediator.',
    bouquetStyle: 'Balanced, harmonious arrangements with soft pinks, blues, and perfectly symmetrical designs',
    recommendedBouquets: [
      {
        id: 'libra-balance-harmony',
        name: 'Balance & Harmony',
        description: 'Perfectly balanced pink roses, peonies, and hydrangeas in harmonious, elegant arrangements',
        flowers: ['Pink Roses', 'Peonies', 'Hydrangeas', 'Bluebells'],
        colors: ['Pink', 'Light Blue', 'Lavender', 'White'],
        price: 195,
        image: '/assets/bouquet-1.jpg',
        occasion: 'Relationships, Balance, Romance',
        meaning: 'Brings harmony, balance, and romantic connection',
        specialFeatures: ['Perfect balance', 'Harmonious colors', 'Elegant symmetry']
      }
    ],
    compatibility: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    luckyNumbers: [6, 15, 24, 33, 42, 51],
    gemstone: 'Opal'
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    modality: 'fixed',
    dates: 'October 23 - November 21',
    rulingPlanet: 'Pluto',
    traits: ['passionate', 'mysterious', 'intense', 'loyal', 'transformative', 'resourceful'],
    colors: ['#8B0000', '#800020', '#000000', '#4B0082'], // Dark Red, Burgundy, Black, Indigo
    flowers: ['dark red rose', 'chrysanthemum', 'geranium', 'orchid', 'black dahlia'],
    personality: 'Passionate and mysterious, Scorpio has unmatched depth and intensity in all you do. Ruled by Pluto, you\'re drawn to transformation, secrets, and the hidden aspects of life. Your loyalty is fierce and unwavering.',
    bouquetStyle: 'Deep, intense arrangements with dark reds, burgundy, and mysterious dark tones',
    recommendedBouquets: [
      {
        id: 'scorpio-water-passion',
        name: 'Depth & Passion',
        description: 'Intense dark red roses, chrysanthemums, and orchids that embody Scorpio\'s mysterious allure',
        flowers: ['Dark Red Roses', 'Chrysanthemums', 'Geraniums', 'Black Dahlia'],
        colors: ['Deep Red', 'Burgundy', 'Black', 'Purple'],
        price: 215,
        image: '/assets/bouquet-2.jpg',
        occasion: 'Transformation, Passion, Mystery',
        meaning: 'Represents depth, transformation, and intense connection',
        specialFeatures: ['Intense colors', 'Mysterious appeal', 'Deep emotional resonance']
      }
    ],
    compatibility: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    luckyNumbers: [8, 11, 18, 22],
    gemstone: 'Topaz'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    modality: 'mutable',
    dates: 'November 22 - December 21',
    rulingPlanet: 'Jupiter',
    traits: ['adventurous', 'optimistic', 'philosophical', 'generous', 'independent', 'enthusiastic'],
    colors: ['#800080', '#4169E1', '#FF4500', '#FF6347'], // Purple, Royal Blue, Orange-Red, Tomato
    flowers: ['bird of paradise', 'carnation', 'narcissus', 'sunflower', 'crocus'],
    personality: 'Adventurous and optimistic, Sagittarius loves freedom and philosophical exploration. Ruled by Jupiter, you\'re constantly seeking new experiences, knowledge, and horizons. Your enthusiasm is contagious.',
    bouquetStyle: 'Bold, adventurous arrangements with purples, blues, and exotic, travel-inspired flowers',
    recommendedBouquets: [
      {
        id: 'sagittarius-fire-adventure',
        name: 'Adventure & Freedom',
        description: 'Exotic birds of paradise, vibrant carnations, and sunflowers that capture Sagittarius\' free spirit',
        flowers: ['Bird of Paradise', 'Carnations', 'Sunflowers', 'Narcissus'],
        colors: ['Purple', 'Blue', 'Orange', 'Yellow'],
        price: 185,
        image: '/assets/bouquet-3.jpg',
        occasion: 'Adventure, Travel, Freedom',
        meaning: 'Encourages exploration, optimism, and philosophical growth',
        specialFeatures: ['Exotic flowers', 'Adventure theme', 'Bold color mix']
      }
    ],
    compatibility: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    luckyNumbers: [3, 9, 12, 21, 30],
    gemstone: 'Turquoise'
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    modality: 'cardinal',
    dates: 'December 22 - January 19',
    rulingPlanet: 'Saturn',
    traits: ['ambitious', 'disciplined', 'practical', 'responsible', 'patient', 'traditional'],
    colors: ['#000000', '#2F4F4F', '#556B2F', '#8B4513'], // Black, Dark Slate Grey, Dark Olive Green, Saddle Brown
    flowers: ['carnation', 'pansy', 'camellia', 'rose', 'ivy'],
    personality: 'Ambitious and disciplined, Capricorn values tradition and long-term success. Ruled by Saturn, you have incredible perseverance and understand that great achievements require time and dedication. Your reliability is legendary.',
    bouquetStyle: 'Classic, sophisticated arrangements with dark greens, blacks, and timeless traditional flowers',
    recommendedBouquets: [
      {
        id: 'capricorn-earth-ambition',
        name: 'Ambition & Tradition',
        description: 'Classic carnations, camellias, and ivy in traditional, sophisticated color palettes',
        flowers: ['Carnations', 'Camellias', 'Pansies', 'Roses with Ivy'],
        colors: ['Dark Green', 'Black', 'Brown', 'White'],
        price: 205,
        image: '/assets/bouquet-4.jpg',
        occasion: 'Career Success, Tradition, Achievement',
        meaning: 'Represents ambition, stability, and lasting success',
        specialFeatures: ['Classic style', 'Traditional colors', 'Professional elegance']
      }
    ],
    compatibility: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    luckyNumbers: [4, 8, 13, 22],
    gemstone: 'Garnet'
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    modality: 'fixed',
    dates: 'January 20 - February 18',
    rulingPlanet: 'Uranus',
    traits: ['innovative', 'independent', 'humanitarian', 'eccentric', 'intellectual', 'progressive'],
    colors: ['#1E90FF', '#00CED1', '#4682B4', '#ADD8E6'], // Dodger Blue, Dark Turquoise, Steel Blue, Light Blue
    flowers: ['orchid', 'bird of paradise', 'snowdrop', 'gladiolus', 'anthurium'],
    personality: 'Innovative and independent, Aquarius marches to your own beat and values freedom above all. Ruled by Uranus, you\'re a visionary who sees the future and fights for humanitarian causes. Your uniqueness is your gift.',
    bouquetStyle: 'Unique, futuristic arrangements with electric blues, turquoise, and unconventional flower choices',
    recommendedBouquets: [
      {
        id: 'aquarius-air-innovation',
        name: 'Innovation & Freedom',
        description: 'Unique orchids and birds of paradise in electric blue tones that reflect Aquarius\' originality',
        flowers: ['Orchids', 'Bird of Paradise', 'Snowdrops', 'Anthuriums'],
        colors: ['Electric Blue', 'Turquoise', 'Silver', 'White'],
        price: 275,
        image: '/assets/bouquet-5.jpg',
        occasion: 'Innovation, Friendship, Humanitarian Causes',
        meaning: 'Represents uniqueness, progress, and visionary thinking',
        specialFeatures: ['Unique flowers', 'Futuristic design', 'Unconventional beauty']
      }
    ],
    compatibility: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
    luckyNumbers: [4, 7, 11, 22, 29],
    gemstone: 'Amethyst'
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    modality: 'mutable',
    dates: 'February 19 - March 20',
    rulingPlanet: 'Neptune',
    traits: ['intuitive', 'artistic', 'compassionate', 'dreamy', 'empathetic', 'spiritual'],
    colors: ['#E6E6FA', '#98FF98', '#AFEEEE', '#DDA0DD'], // Lavender, Pale Green, Pale Turquoise, Plum
    flowers: ['water lily', 'lilac', 'hydrangea', 'peony', 'violet'],
    personality: 'Intuitive and artistic, Pisces is deeply connected to emotions, dreams, and creativity. Ruled by Neptune, you have extraordinary empathy and can sense what others feel. Your imagination knows no bounds.',
    bouquetStyle: 'Dreamy, ethereal arrangements with lavender, sea green, and flowing water-inspired designs',
    recommendedBouquets: [
      {
        id: 'pisces-water-dreams',
        name: 'Dreams & Intuition',
        description: 'Ethereal water lilies, lilacs, and hydrangeas in dreamy, soft color palettes',
        flowers: ['Water Lilies', 'Lilacs', 'Hydrangeas', 'Peonies'],
        colors: ['Lavender', 'Sea Green', 'Pale Blue', 'White'],
        price: 225,
        image: '/assets/bouquet-6.jpg',
        occasion: 'Creativity, Dreams, Spiritual Connection',
        meaning: 'Enhances intuition, creativity, and spiritual awareness',
        specialFeatures: ['Ethereal beauty', 'Flowing design', 'Dreamy colors']
      }
    ],
    compatibility: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
    luckyNumbers: [3, 7, 12, 16, 21, 25, 30],
    gemstone: 'Aquamarine'
  }
];

/**
 * Helper functions for zodiac calculations
 */
export const getZodiacSign = (month: number, day: number): ZodiacSign | null => {
  const dateRanges: { [key: string]: { start: [number, number], end: [number, number] } } = {
    'aries': { start: [3, 21], end: [4, 19] },
    'taurus': { start: [4, 20], end: [5, 20] },
    'gemini': { start: [5, 21], end: [6, 20] },
    'cancer': { start: [6, 21], end: [7, 22] },
    'leo': { start: [7, 23], end: [8, 22] },
    'virgo': { start: [8, 23], end: [9, 22] },
    'libra': { start: [9, 23], end: [10, 22] },
    'scorpio': { start: [10, 23], end: [11, 21] },
    'sagittarius': { start: [11, 22], end: [12, 21] },
    'capricorn': { start: [12, 22], end: [1, 19] },
    'aquarius': { start: [1, 20], end: [2, 18] },
    'pisces': { start: [2, 19], end: [3, 20] }
  };

  for (const sign of zodiacSigns) {
    const range = dateRanges[sign.id];
    if (!range) continue;

    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;

    // Handle year boundary (e.g., Capricorn spans December to January)
    if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign;
      }
    } else {
      // Normal case within same year
      if (month === startMonth && month === endMonth) {
        if (day >= startDay && day <= endDay) return sign;
      } else if (month === startMonth && day >= startDay) {
        return sign;
      } else if (month === endMonth && day <= endDay) {
        return sign;
      } else if (month > startMonth && month < endMonth) {
        return sign;
      }
    }
  }

  return null;
};

export const getElementColors = (element: string): string[] => {
  const elementColorMap: { [key: string]: string[] } = {
    fire: ['#FF6B35', '#F7931E', '#FFD700', '#DC143C'],
    earth: ['#8B4513', '#228B22', '#DEB887', '#A0522D'],
    air: ['#87CEEB', '#DDA0DD', '#F0F8FF', '#E6E6FA'],
    water: ['#4682B4', '#5F9EA0', '#20B2AA', '#008B8B']
  };

  return elementColorMap[element] || ['#666666'];
};

export const getCompatibilitySigns = (sign: ZodiacSign): ZodiacSign[] => {
  return zodiacSigns.filter(zodiacSign =>
    sign.compatibility.includes(zodiacSign.name)
  );
};