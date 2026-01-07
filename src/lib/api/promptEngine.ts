/**
 * Advanced Prompt Engine for AI Image Generation
 * 
 * Features:
 * - Negative prompts for better results
 * - Exact flower arrangement positions
 * - Style presets (romantic, minimal, luxury)
 * - Prompt templates for common combinations
 * - Variation generation
 */

import { EnhancedFlower } from '@/data/flowers';

// Flower-specific visual characteristics for accurate AI rendering
const FLOWER_VISUALS: Record<string, {
  petalStyle: string;
  bloomShape: string;
  texture: string;
  arrangement: string;
}> = {
  'roses': {
    petalStyle: 'layered spiral petals with velvety soft texture',
    bloomShape: 'classic cup-shaped bloom with tightly packed petals unfurling from center',
    texture: 'smooth velvety petals with delicate edges',
    arrangement: 'elegant long stems with glossy dark green leaves'
  },
  'tulips': {
    petalStyle: 'smooth oval petals with pointed tips',
    bloomShape: 'elegant cup-shaped or goblet bloom',
    texture: 'satiny smooth waxy petals',
    arrangement: 'single straight stem with broad lance-shaped leaves'
  },
  'peonies': {
    petalStyle: 'densely packed ruffled petals in layers',
    bloomShape: 'large lush ball-shaped fluffy bloom',
    texture: 'soft delicate paper-thin petals with romantic ruffles',
    arrangement: 'sturdy stems with deeply lobed dark green foliage'
  },
  'chrysanthemum': {
    petalStyle: 'numerous thin elongated ray petals',
    bloomShape: 'pompon or daisy-like radial bloom',
    texture: 'firm slightly waxy petals',
    arrangement: 'branching stems with aromatic serrated leaves'
  },
  'gypsum': {
    petalStyle: 'tiny delicate star-shaped florets',
    bloomShape: 'cloud-like clusters of miniature blooms',
    texture: 'airy light feathery texture',
    arrangement: 'wispy branching sprays perfect as filler'
  },
  'daisies': {
    petalStyle: 'simple white ray petals around yellow center',
    bloomShape: 'classic flat circular bloom with prominent center disc',
    texture: 'crisp fresh petals',
    arrangement: 'cheerful upright stems'
  },
  'sunflower': {
    petalStyle: 'large golden yellow ray petals',
    bloomShape: 'large circular head with dark brown seed center',
    texture: 'slightly rough textured petals',
    arrangement: 'tall thick sturdy stems with large leaves'
  },
  'lily': {
    petalStyle: 'six elegant recurved petals with spots or plain',
    bloomShape: 'trumpet or star-shaped dramatic bloom',
    texture: 'smooth waxy petals often with speckles',
    arrangement: 'tall stems with multiple blooms and lance leaves'
  },
  'orchid': {
    petalStyle: 'exotic bilateral symmetry with distinctive lip petal',
    bloomShape: 'intricate exotic bloom with unique labellum',
    texture: 'waxy smooth almost artificial-looking perfection',
    arrangement: 'arching sprays of multiple blooms'
  },
  'hydrangea': {
    petalStyle: 'clusters of four-petaled small florets',
    bloomShape: 'large round mophead or lacecap cluster',
    texture: 'papery delicate florets',
    arrangement: 'dense rounded flower heads on sturdy stems'
  },
  'gerbera': {
    petalStyle: 'bold daisy-like ray petals in vibrant colors',
    bloomShape: 'large flat circular bloom with contrasting center',
    texture: 'smooth velvety petals',
    arrangement: 'single long straight leafless stems'
  },
  'lavender': {
    petalStyle: 'tiny tubular flowers in dense spikes',
    bloomShape: 'slender elongated flower spikes',
    texture: 'soft aromatic fuzzy texture',
    arrangement: 'multiple stems with narrow silvery-green leaves'
  },
  'carnation': {
    petalStyle: 'fringed ruffled petals with serrated edges',
    bloomShape: 'rounded fluffy bloom with layered petals',
    texture: 'slightly stiff clove-scented petals',
    arrangement: 'sturdy stems with narrow gray-green leaves'
  }
};

// Color-specific descriptions for accurate rendering
const COLOR_VISUALS: Record<string, string> = {
  'red': 'deep crimson red, rich ruby color',
  'white': 'pure pristine white, snow-white, ivory cream',
  'pink': 'soft blush pink, delicate rose pink',
  'yellow': 'bright sunny yellow, golden yellow',
  'blue': 'serene sky blue, soft periwinkle blue',
  'peach': 'warm peach, soft apricot orange',
  'purple': 'rich royal purple, deep violet',
  'orange': 'vibrant tangerine orange, warm sunset orange',
  'fushia': 'vivid hot pink fuchsia, magenta',
  'terracotta': 'warm earthy terracotta, burnt sienna',
  'dark blue': 'deep navy blue, midnight blue'
};

// Style Presets
export type StylePreset = 'classic' | 'romantic' | 'minimal' | 'luxury' | 'modern' | 'vintage';

export interface StylePresetConfig {
  id: StylePreset;
  name: string;
  description: string;
  icon: string;
  promptModifiers: string;
  colorPalette: string;
  lightingStyle: string;
  backgroundStyle: string;
}

export const STYLE_PRESETS: Record<StylePreset, StylePresetConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless elegance',
    icon: '🎩',
    promptModifiers: 'classic elegant timeless traditional refined sophisticated',
    colorPalette: 'rich deep colors, traditional palette',
    lightingStyle: 'soft warm studio lighting, gentle shadows',
    backgroundStyle: 'clean white seamless background'
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic',
    description: 'Soft & dreamy',
    icon: '💕',
    promptModifiers: 'romantic dreamy soft ethereal delicate feminine',
    colorPalette: 'soft pastel colors, blush pink, cream white, dusty rose',
    lightingStyle: 'soft diffused golden hour lighting, warm glow, bokeh effect',
    backgroundStyle: 'soft blurred pink gradient background, dreamy atmosphere'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean & simple',
    icon: '◻️',
    promptModifiers: 'minimalist clean simple modern sleek understated',
    colorPalette: 'monochromatic, white, cream, single accent color',
    lightingStyle: 'bright even lighting, no harsh shadows, high key',
    backgroundStyle: 'pure white background, negative space, isolated'
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    description: 'Opulent & rich',
    icon: '👑',
    promptModifiers: 'luxurious opulent premium high-end exclusive prestigious',
    colorPalette: 'rich jewel tones, gold accents, deep burgundy, emerald',
    lightingStyle: 'dramatic studio lighting, rim light, golden highlights',
    backgroundStyle: 'dark elegant background, subtle texture, vignette'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary style',
    icon: '🔷',
    promptModifiers: 'modern contemporary trendy stylish fresh innovative',
    colorPalette: 'bold contrasting colors, geometric patterns',
    lightingStyle: 'sharp directional lighting, strong contrast',
    backgroundStyle: 'gradient background, abstract elements'
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    description: 'Nostalgic charm',
    icon: '📜',
    promptModifiers: 'vintage retro nostalgic antique classic old-world charm',
    colorPalette: 'muted sepia tones, faded pastels, warm browns',
    lightingStyle: 'soft warm lighting, film grain effect, slight vignette',
    backgroundStyle: 'textured paper background, aged look'
  }
};

// Negative Prompts - things to avoid in generation
export const NEGATIVE_PROMPTS = {
  general: [
    'blurry', 'low quality', 'distorted', 'deformed', 'ugly',
    'bad anatomy', 'bad proportions', 'extra limbs', 'duplicate',
    'watermark', 'text overlay', 'signature', 'logo overlay',
    'dark shadows', 'overexposed', 'underexposed', 'noise', 'grain',
    'compression artifacts', 'pixelated', 'cropped', 'out of frame'
  ],
  flowers: [
    'wilted flowers', 'dead flowers', 'brown petals', 'damaged petals',
    'messy arrangement', 'scattered petals', 'drooping stems',
    'yellow leaves', 'brown leaves', 'insects', 'bugs'
  ],
  packaging: [
    'torn paper', 'damaged box', 'dirty packaging', 'wrinkled ribbon',
    'cheap materials', 'plastic wrap visible', 'tape visible'
  ],
  composition: [
    'cluttered', 'busy background', 'distracting elements',
    'multiple products', 'hands visible', 'people visible'
  ]
};

// Build negative prompt string
export function buildNegativePrompt(categories: (keyof typeof NEGATIVE_PROMPTS)[] = ['general', 'flowers', 'packaging', 'composition']): string {
  const negatives: string[] = [];
  categories.forEach(cat => {
    negatives.push(...NEGATIVE_PROMPTS[cat]);
  });
  return negatives.join(', ');
}

// Flower Arrangement Positions
export interface FlowerPosition {
  position: 'center' | 'outer' | 'accent' | 'filler';
  description: string;
}

export function getFlowerArrangementPositions(
  flowers: Array<{ flower: EnhancedFlower; quantity: number }>,
  packageType: 'box' | 'wrap',
  boxShape?: string
): string {
  if (flowers.length === 0) return '';

  const totalFlowers = flowers.reduce((sum, f) => sum + f.quantity, 0);
  const sortedFlowers = [...flowers].sort((a, b) => b.quantity - a.quantity);
  
  const positions: string[] = [];
  
  if (packageType === 'box') {
    // Box arrangement - concentric circles from center
    const shape = boxShape || 'square';
    
    if (shape === 'round' || shape === 'heart') {
      // Circular/heart arrangement
      sortedFlowers.forEach((f, index) => {
        if (index === 0) {
          // Most prominent flower in center
          positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} arranged prominently in the center cluster`);
        } else if (index === 1) {
          // Second most in inner ring
          positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} forming an inner ring around the center`);
        } else {
          // Others in outer ring
          positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} placed in the outer ring`);
        }
      });
    } else {
      // Square arrangement - grid-like
      sortedFlowers.forEach((f, index) => {
        if (index === 0) {
          positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} as the focal point in the center`);
        } else if (index === 1) {
          positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} positioned at the four corners`);
        } else {
          positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} filling the spaces between`);
        }
      });
    }
  } else {
    // Wrap arrangement - cascading bouquet
    sortedFlowers.forEach((f, index) => {
      if (index === 0) {
        positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} as the main focal flowers in the front center`);
      } else if (index === 1) {
        positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} cascading around the sides`);
      } else {
        positions.push(`${f.quantity} ${f.flower.colorName} ${f.flower.family} as accent flowers throughout`);
      }
    });
  }

  return positions.join(', ');
}

// Prompt Templates for Common Combinations
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'occasion' | 'style' | 'season';
  basePrompt: string;
  suggestedFlowers: string[];
  suggestedColors: string[];
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'valentines',
    name: "Valentine's Day",
    description: 'Romantic red roses arrangement',
    category: 'occasion',
    basePrompt: 'romantic Valentine\'s Day bouquet, passionate red color scheme, heart-shaped arrangement, love and romance theme',
    suggestedFlowers: ['rose-red', 'rose-pink', 'tulip-red'],
    suggestedColors: ['red', 'pink']
  },
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Elegant bridal arrangement',
    category: 'occasion',
    basePrompt: 'elegant bridal wedding bouquet, pure white and cream colors, sophisticated and graceful, timeless beauty',
    suggestedFlowers: ['rose-white', 'peony-white', 'orchid-white', 'lily-white'],
    suggestedColors: ['white', 'gold']
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'Colorful celebration bouquet',
    category: 'occasion',
    basePrompt: 'cheerful birthday celebration bouquet, vibrant mixed colors, joyful and festive arrangement',
    suggestedFlowers: ['gerbera-yellow', 'sunflower-big', 'tulip-yellow', 'rose-pink'],
    suggestedColors: ['pink', 'gold']
  },
  {
    id: 'sympathy',
    name: 'Sympathy',
    description: 'Peaceful memorial arrangement',
    category: 'occasion',
    basePrompt: 'peaceful sympathy arrangement, serene white and soft colors, respectful and comforting',
    suggestedFlowers: ['lily-white', 'rose-white', 'chrys-white', 'carnation-white'],
    suggestedColors: ['white', 'blue']
  },
  {
    id: 'spring-garden',
    name: 'Spring Garden',
    description: 'Fresh spring blooms',
    category: 'season',
    basePrompt: 'fresh spring garden bouquet, pastel colors, new growth and renewal theme, light and airy',
    suggestedFlowers: ['tulip-pink', 'tulip-yellow', 'daisy-white', 'lavender'],
    suggestedColors: ['pink', 'white']
  },
  {
    id: 'summer-sunshine',
    name: 'Summer Sunshine',
    description: 'Bright summer arrangement',
    category: 'season',
    basePrompt: 'bright summer sunshine bouquet, warm golden yellows and oranges, radiant and cheerful',
    suggestedFlowers: ['sunflower-big', 'gerbera-yellow', 'gerbera-orange', 'rose-yellow'],
    suggestedColors: ['gold', 'white']
  },
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    description: 'Warm fall colors',
    category: 'season',
    basePrompt: 'warm autumn harvest bouquet, rich orange and burgundy tones, cozy fall atmosphere',
    suggestedFlowers: ['chrys-orange', 'rose-peach', 'gerbera-orange', 'carnation-red'],
    suggestedColors: ['gold', 'red']
  },
  {
    id: 'winter-elegance',
    name: 'Winter Elegance',
    description: 'Sophisticated winter arrangement',
    category: 'season',
    basePrompt: 'elegant winter bouquet, crisp whites and deep reds, sophisticated holiday theme',
    suggestedFlowers: ['rose-red', 'rose-white', 'orchid-white', 'lily-white'],
    suggestedColors: ['white', 'red']
  }
];

// Generate variation prompts
export function generateVariationPrompts(basePrompt: string, count: number = 3): string[] {
  const variations: string[] = [];
  
  const variationModifiers = [
    { angle: 'slightly different camera angle, unique perspective', lighting: 'warmer lighting tone' },
    { angle: 'alternative composition, fresh arrangement', lighting: 'cooler lighting tone' },
    { angle: 'creative framing, artistic view', lighting: 'dramatic lighting contrast' },
    { angle: 'close-up detail shot, intimate view', lighting: 'soft diffused lighting' },
    { angle: 'wider shot showing full arrangement', lighting: 'natural daylight simulation' }
  ];

  for (let i = 0; i < Math.min(count, variationModifiers.length); i++) {
    const mod = variationModifiers[i];
    variations.push(`${basePrompt}, ${mod.angle}, ${mod.lighting}`);
  }

  return variations;
}

// Main Prompt Builder
export interface PromptBuilderOptions {
  packageType: 'box' | 'wrap';
  boxShape?: string;
  size: string;
  color: string;
  flowers: Array<{ flower: EnhancedFlower; quantity: number }>;
  withGlitter: boolean;
  accessories: string[];
  stylePreset?: StylePreset;
  template?: string;
  includeNegative?: boolean;
}

export interface BuiltPrompt {
  positive: string;
  negative: string;
  preview: string; // Human-readable preview
  hash: string; // For caching
}

// Generate hash for caching
function generatePromptHash(options: PromptBuilderOptions): string {
  const hashData = JSON.stringify({
    packageType: options.packageType,
    boxShape: options.boxShape,
    size: options.size,
    color: options.color,
    flowers: options.flowers.map(f => ({ id: f.flower.id, qty: f.quantity })),
    withGlitter: options.withGlitter,
    accessories: options.accessories.sort(),
    stylePreset: options.stylePreset,
    template: options.template
  });
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < hashData.length; i++) {
    const char = hashData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function buildAdvancedPrompt(options: PromptBuilderOptions): BuiltPrompt {
  const {
    packageType,
    boxShape,
    size,
    color,
    flowers,
    withGlitter,
    accessories,
    includeNegative = true
  } = options;

  // NOTE: stylePreset and template are IGNORED to prevent unrealistic images
  // We focus ONLY on exact user inputs for accurate generation

  const totalFlowers = flowers.reduce((sum, f) => sum + f.quantity, 0);
  
  // Build DETAILED flower descriptions with exact quantities
  // Priority: larger quantities first, then by flower type
  const sortedFlowers = [...flowers].sort((a, b) => b.quantity - a.quantity);
  const flowerDescriptions: string[] = [];
  
  sortedFlowers.forEach(f => {
    const colorName = f.flower.colorName.toLowerCase();
    const flowerFamily = f.flower.family.toLowerCase();
    const qty = f.quantity;
    
    // Get detailed visual for this flower type
    const visual = FLOWER_VISUALS[flowerFamily];
    if (visual && qty > 0) {
      flowerDescriptions.push(`exactly ${qty} ${colorName} ${flowerFamily} with ${visual.bloomShape}`);
    } else if (qty > 0) {
      flowerDescriptions.push(`exactly ${qty} ${colorName} ${flowerFamily}`);
    }
  });
  
  const flowersText = flowerDescriptions.join(', ');
  
  // Build PRECISE prompt focused on user inputs only
  // Pollinations Flux model works best with clear, structured descriptions
  const parts: string[] = [];
  
  if (packageType === 'box') {
    const shape = boxShape || 'square';
    // Exact box description
    parts.push(`${size} ${color} ${shape} luxury flower gift box`);
    parts.push(`containing ${flowersText}`);
    parts.push(`flowers arranged inside open box`);
    parts.push(`top-down aerial view looking into box`);
    parts.push(`gold BEXY text on box`);
  } else {
    // Exact bouquet description
    parts.push(`${size} hand-tied flower bouquet`);
    parts.push(`containing ${flowersText}`);
    parts.push(`wrapped in ${color} paper with matching ribbon`);
    parts.push(`front three-quarter view`);
    parts.push(`small BEXY tag on ribbon`);
  }
  
  // Add glitter only if selected
  if (withGlitter) {
    parts.push(`fine glitter dust on flower petals`);
  }
  
  // Add accessories with exact descriptions
  if (accessories.length > 0) {
    const accDescriptions: Record<string, string> = {
      'crown': 'small golden crown on top of flowers',
      'graduation-hat': 'miniature black graduation cap among flowers',
      'bear': 'small plush teddy bear next to flowers',
      'chocolate': 'box of chocolates beside arrangement'
    };
    accessories.forEach(acc => {
      if (accDescriptions[acc]) {
        parts.push(accDescriptions[acc]);
      }
    });
  }
  
  // Technical quality - minimal, focused
  parts.push(`professional product photography, white background, soft studio lighting`);
  
  const positivePrompt = parts.join(', ');
  
  // Build negative prompt
  const negativePrompt = includeNegative ? buildNegativePrompt() : '';
  
  // Build simple flower list for preview
  const flowerListSimple = flowers.map(f => `${f.quantity} ${f.flower.colorName} ${f.flower.family}`).join(', ');
  
  // Build human-readable preview
  const previewParts: string[] = [
    `📦 ${packageType === 'box' ? `${boxShape || 'Square'} Box` : 'Wrapped Bouquet'} (${size}, ${color})`,
    `🌸 ${totalFlowers} flowers: ${flowerListSimple}`,
  ];
  if (withGlitter) previewParts.push('✨ With glitter');
  if (accessories.length > 0) previewParts.push(`🎁 Accessories: ${accessories.join(', ')}`);
  
  return {
    positive: positivePrompt,
    negative: negativePrompt,
    preview: previewParts.join('\n'),
    hash: generatePromptHash(options)
  };
}

// Export all for use
export default {
  STYLE_PRESETS,
  NEGATIVE_PROMPTS,
  PROMPT_TEMPLATES,
  buildAdvancedPrompt,
  buildNegativePrompt,
  getFlowerArrangementPositions,
  generateVariationPrompts
};
