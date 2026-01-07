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
    stylePreset = 'classic',
    template,
    includeNegative = true
  } = options;

  const style = STYLE_PRESETS[stylePreset];
  const totalFlowers = flowers.reduce((sum, f) => sum + f.quantity, 0);
  
  // Get flower arrangement positions
  const arrangementPositions = getFlowerArrangementPositions(flowers, packageType, boxShape);
  
  // Build detailed flower descriptions with exact colors and types
  const flowerDescriptions = flowers.map(f => {
    const colorName = f.flower.colorName.toLowerCase();
    const flowerType = f.flower.family.toLowerCase();
    const qty = f.quantity;
    
    // More descriptive flower terms
    if (qty === 1) {
      return `1 beautiful ${colorName} ${flowerType} bloom`;
    } else if (qty <= 3) {
      return `${qty} ${colorName} ${flowerType} blooms`;
    } else {
      return `${qty} fresh ${colorName} ${flowerType} flowers`;
    }
  });
  
  const flowerList = flowerDescriptions.join(', ');
  
  // Get template if specified
  const templateConfig = template ? PROMPT_TEMPLATES.find(t => t.id === template) : null;
  
  // Size descriptions for more accuracy
  const sizeDescriptions: Record<string, string> = {
    'small': 'compact petite small-sized',
    'medium': 'medium-sized standard',
    'large': 'large grand impressive full-sized'
  };
  const sizeDesc = sizeDescriptions[size.toLowerCase()] || size;
  
  // Color descriptions for packaging
  const colorDescriptions: Record<string, string> = {
    'black': 'elegant matte black',
    'white': 'pristine pure white',
    'gold': 'luxurious shimmering gold',
    'pink': 'soft blush pink',
    'blue': 'serene sky blue',
    'red': 'rich deep red'
  };
  const colorDesc = colorDescriptions[color.toLowerCase()] || color;
  
  // Build the prompt parts
  const parts: string[] = [];
  
  // 1. Main subject with precise details
  if (packageType === 'box') {
    const shape = boxShape || 'square';
    const shapeDescriptions: Record<string, string> = {
      'round': 'perfectly circular round',
      'square': 'geometric square',
      'heart': 'romantic heart-shaped'
    };
    const shapeDesc = shapeDescriptions[shape.toLowerCase()] || shape;
    
    parts.push(`A premium ${colorDesc} luxury flower gift box`);
    parts.push(`${shapeDesc} box shape, ${sizeDesc} dimensions`);
    parts.push(`containing exactly ${totalFlowers} fresh premium flowers arranged inside: ${flowerList}`);
    parts.push(`flower arrangement details: ${arrangementPositions}`);
    parts.push(`top-down aerial view, bird's eye perspective, camera positioned directly above looking down`);
    parts.push(`the ${colorDesc} ${shape} box lid is fully open, revealing the stunning flower arrangement inside`);
    parts.push(`box interior lined with elegant tissue paper`);
    parts.push(`box lid displays elegant golden embossed text "BEXY" in sophisticated capital letters, clearly visible and sharp`);
  } else {
    parts.push(`A ${sizeDesc} elegant hand-tied flower bouquet`);
    parts.push(`containing exactly ${totalFlowers} fresh premium flowers: ${flowerList}`);
    parts.push(`flower arrangement details: ${arrangementPositions}`);
    parts.push(`professionally wrapped in ${colorDesc} premium decorative paper`);
    parts.push(`tied with matching ${colorDesc} satin ribbon bow`);
    parts.push(`ribbon features an elegant tag with golden text "BEXY" clearly visible`);
    parts.push(`front view, standing upright, three-quarter angle showing full bouquet`);
    parts.push(`stems neatly trimmed and wrapped`);
  }
  
  // 2. Glitter effect with precise description
  if (withGlitter) {
    parts.push(`delicate sparkle glitter dust scattered on flower petals`);
    parts.push(`subtle shimmering highlights catching the light`);
    parts.push(`magical fairy dust sparkle effect, not overdone`);
  }
  
  // 3. Accessories with precise placement
  if (accessories.length > 0) {
    const accessoryDescriptions: Record<string, string> = {
      'crown': 'small decorative golden crown accessory placed prominently on top of the flowers, clearly visible',
      'graduation-hat': 'miniature black graduation cap with gold tassel placed among the flowers, celebrating achievement',
      'bear': 'cute small plush teddy bear toy nestled visibly in the flower arrangement',
      'chocolate': 'elegant box of premium chocolates or chocolate truffles placed beside the flowers'
    };
    parts.push('ACCESSORIES INCLUDED:');
    accessories.forEach(acc => {
      if (accessoryDescriptions[acc]) {
        parts.push(accessoryDescriptions[acc]);
      }
    });
  }
  
  // 4. Style preset modifiers
  parts.push(style.promptModifiers);
  parts.push(style.colorPalette);
  parts.push(style.lightingStyle);
  parts.push(style.backgroundStyle);
  
  // 5. Template modifiers
  if (templateConfig) {
    parts.push(templateConfig.basePrompt);
  }
  
  // 6. Quality and technical keywords
  parts.push('8K resolution, ultra-detailed, photorealistic');
  parts.push('professional commercial product photography');
  parts.push('sharp focus throughout, excellent depth of field');
  parts.push('studio lighting setup, soft shadows');
  parts.push('BEXY luxury floral brand, premium quality presentation');
  
  const positivePrompt = parts.join(', ');
  
  // Build negative prompt
  const negativePrompt = includeNegative ? buildNegativePrompt() : '';
  
  // Build human-readable preview
  const previewParts: string[] = [
    `📦 ${packageType === 'box' ? `${boxShape || 'Square'} Box` : 'Wrapped Bouquet'} (${size}, ${color})`,
    `🌸 ${totalFlowers} flowers: ${flowerList}`,
    `🎨 Style: ${style.name}`,
  ];
  if (withGlitter) previewParts.push('✨ With glitter');
  if (accessories.length > 0) previewParts.push(`🎁 Accessories: ${accessories.join(', ')}`);
  if (templateConfig) previewParts.push(`📋 Template: ${templateConfig.name}`);
  
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
