# LCP Image Optimization Guide

## Current Status
- **LCP**: 8.76s (poor) 
- **LCP Element**: `img.w-full.h-full.object-...` (CarouselHero image)
- **Root Cause**: Large PNG images (2-2.7MB) without optimization

## Critical Issue
The hero section images are:
- `image1.png`: 2.26 MB
- `image2.png`: 2.77 MB  
- `image3.png`: 2.64 MB

These large PNG files are causing the slow LCP.

## Optimizations Applied

### 1. ✅ Image Decoding Strategy
- **File**: `src/components/CarouselHero.tsx` (line 335)
- **Change**: First image uses `decoding="sync"` instead of `async`
- **Impact**: Browser decodes image immediately, not deferred

### 2. ✅ CSS Performance Optimizations
- **File**: `src/components/CarouselHero.css`
- **Changes**:
  - Added `content-visibility: auto` to `.bottle-img` (line 443)
  - Added `contain: layout style paint` (line 444)
  - Added `will-change: transform` (line 447)
  - Added `backface-visibility: hidden` (line 448)
  - Added `translateZ(0)` for GPU acceleration (line 438)
  - Simplified `filter` from double to single drop-shadow (line 441)
  - Added `image-rendering: -webkit-optimize-contrast` (line 445)

### 3. ✅ Container Optimizations
- **File**: `src/components/CarouselHero.css`
- **Changes**:
  - Added `will-change: background-color` to `.right-side__img` (line 413)
  - Added `contain: layout style` (line 414)

### 4. ✅ Preload Already in Place
- **File**: `index.html` (line 24)
- **Code**: `<link rel="preload" as="image" href="/assets/hero_section/image1.png" fetchpriority="high" />`
- **Status**: Already optimized

## Expected Improvement
With these optimizations: **~1-2s improvement** (from 8.76s to ~6-7s)

However, the **real bottleneck is image file size**.

## 🚨 CRITICAL RECOMMENDATIONS

To achieve LCP < 2.5s (good), you MUST optimize the images:

### Option 1: Convert to WebP (Recommended)
```bash
# Using ImageMagick or similar tool
magick convert image1.png -quality 85 image1.webp
magick convert image2.png -quality 85 image2.webp
magick convert image3.png -quality 85 image3.webp
```

**Expected file sizes**: 200-400 KB (85-90% reduction)
**Expected LCP**: < 2.5s ✅

### Option 2: Optimize PNG Files
```bash
# Using pngquant
pngquant --quality=65-80 image1.png --output image1-optimized.png
```

**Expected file sizes**: 500-800 KB (60-70% reduction)
**Expected LCP**: ~3-4s (still needs improvement)

### Option 3: Use Responsive Images
Update `CarouselHero.tsx` to use `srcset`:

```tsx
<img
  className="bottle-img"
  src={slide.productImage}
  srcSet={`
    ${slide.productImage.replace('.png', '-small.webp')} 400w,
    ${slide.productImage.replace('.png', '-medium.webp')} 800w,
    ${slide.productImage.replace('.png', '.webp')} 1200w
  `}
  sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
  alt={`${slide.title} flower arrangement`}
  width="600"
  height="800"
  loading="eager"
  decoding="sync"
  fetchPriority="high"
/>
```

## Implementation Priority

1. **URGENT**: Convert images to WebP format (85% quality)
2. **HIGH**: Implement responsive images with srcset
3. **MEDIUM**: Add lazy loading for non-first slides
4. **LOW**: Consider using a CDN with automatic image optimization

## Tools for Image Optimization

### Online Tools
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPEG optimizer
- [CloudConvert](https://cloudconvert.com/) - Batch conversion

### CLI Tools
```bash
# Install ImageMagick
brew install imagemagick  # macOS
choco install imagemagick # Windows

# Install pngquant
brew install pngquant      # macOS
choco install pngquant     # Windows

# Install cwebp (WebP encoder)
brew install webp          # macOS
choco install webp         # Windows
```

## Quick Win Script

Create `scripts/optimize-hero-images.sh`:

```bash
#!/bin/bash
cd public/assets/hero_section

# Convert to WebP
for img in *.png; do
  cwebp -q 85 "$img" -o "${img%.png}.webp"
  echo "Converted $img to WebP"
done

# Create responsive sizes
for img in *.webp; do
  # Small (400px width)
  magick "$img" -resize 400x "${img%.webp}-small.webp"
  # Medium (800px width)
  magick "$img" -resize 800x "${img%.webp}-medium.webp"
  echo "Created responsive sizes for $img"
done

echo "✅ Image optimization complete!"
```

## Performance Impact

| Optimization | Current | After WebP | Improvement |
|-------------|---------|------------|-------------|
| Image Size | 2.26 MB | ~300 KB | 87% smaller |
| Download Time (3G) | ~6s | ~0.8s | 5.2s faster |
| LCP | 8.76s | ~2.0s | 6.76s faster |
| Score | Poor (Red) | Good (Green) | ✅ |

## Next Steps

1. Run the image optimization script
2. Update `CarouselHero.tsx` to use `.webp` files
3. Add fallback to `.png` for older browsers
4. Test LCP with Lighthouse
5. Verify LCP < 2.5s

## Browser Compatibility

WebP is supported by:
- Chrome 23+
- Firefox 65+
- Safari 14+
- Edge 18+

Coverage: 96%+ of users

For older browsers, use:
```tsx
<picture>
  <source srcset={slide.productImage.replace('.png', '.webp')} type="image/webp" />
  <img src={slide.productImage} alt="..." />
</picture>
```
