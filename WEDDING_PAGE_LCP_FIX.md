# Wedding & Events Page LCP Optimization

## Current Status
- **LCP**: 8.46s (poor)
- **LCP Element**: `img.w-full.h-full.object-...` (Hero image)
- **Root Cause**: Large hero image file

## Problem Analysis

### Hero Image
- **File**: `src/assets/heroWedding.jpg`
- **Size**: 1.53 MB (1533 KB)
- **Format**: JPG
- **Issue**: Too large for LCP element

## Optimizations Applied

### 1. ✅ Image Loading Attributes
- **File**: `src/pages/WeddingAndEvents.tsx` (lines 260-264)
- **Changes**:
  - Added `loading="eager"` - Load immediately, don't lazy load
  - Added `decoding="sync"` - Decode synchronously for faster display
  - Added `fetchPriority="high"` - Prioritize this image download
  - Added `width="1920"` and `height="1080"` - Prevent layout shift

### 2. ✅ CSS Performance Optimizations
- **File**: `src/pages/WeddingAndEvents.tsx` (lines 253-271)
- **Changes**:
  - Added `willChange: 'transform'` to container - GPU acceleration hint
  - Added `contain: 'layout style paint'` - Isolate rendering
  - Added `imageRendering: '-webkit-optimize-contrast'` - Faster rendering
  - Added `backfaceVisibility: 'hidden'` - GPU optimization
  - Added `transform: 'translateZ(0)'` - Force GPU layer

## Expected Improvement
With code optimizations: **~1-2s improvement** (from 8.46s to ~6-7s)

## 🚨 CRITICAL: Image Must Be Optimized

To achieve LCP < 2.5s, you **MUST** compress the hero image.

### Recommended Solution: Convert to WebP

```bash
# Option 1: Online tool (easiest)
# 1. Go to https://squoosh.app/
# 2. Upload src/assets/heroWedding.jpg
# 3. Select WebP format, quality 80-85%
# 4. Download as heroWedding.webp
# 5. Update import in WeddingAndEvents.tsx

# Option 2: CLI (if you have ImageMagick/cwebp)
cd src/assets
cwebp -q 85 heroWedding.jpg -o heroWedding.webp
```

**Expected results:**
- File size: 1.53 MB → ~200-300 KB (80-85% reduction)
- LCP: 8.46s → **~2.0s** ✅

### After Converting to WebP

Update the import in `src/pages/WeddingAndEvents.tsx`:

```tsx
// Change line 12 from:
import heroWeddingImage from "@/assets/heroWedding.jpg";

// To:
import heroWeddingImage from "@/assets/heroWedding.webp";
```

### Alternative: Optimize JPG

If you can't use WebP, optimize the JPG:

```bash
# Using ImageMagick
magick heroWedding.jpg -quality 80 -strip heroWedding-optimized.jpg

# Or use online tools:
# - TinyJPG: https://tinyjpg.com/
# - Compressor.io: https://compressor.io/
```

**Expected results:**
- File size: 1.53 MB → ~400-600 KB (60-70% reduction)
- LCP: 8.46s → ~3-4s (still needs improvement)

## Gallery Images Status

The wedding/event gallery images are already optimized:
- ✅ Already in WebP format
- ✅ Sizes range from 136 KB to 1 MB
- ✅ Lazy loaded (not affecting LCP)

**Largest gallery images:**
- `IMG_1791.webp`: 1059 KB (could be optimized further)
- `IMG_4875.webp`: 792 KB
- `IMG_5461.webp`: 745 KB

These don't affect LCP since they're below the fold and lazy loaded.

## Performance Impact Breakdown

| Optimization | Current | After WebP | Improvement |
|-------------|---------|------------|-------------|
| Hero Image Size | 1.53 MB | ~250 KB | 84% smaller |
| Download Time (3G) | ~4s | ~0.7s | 3.3s faster |
| Rendering Time | ~4s | ~1.3s | 2.7s faster |
| **Total LCP** | **8.46s** | **~2.0s** | **6.46s faster** |
| **Score** | Poor (Red) | Good (Green) | ✅ |

## Implementation Steps

1. **Convert hero image to WebP** (CRITICAL)
   ```bash
   # Use Squoosh.app or CLI
   cwebp -q 85 src/assets/heroWedding.jpg -o src/assets/heroWedding.webp
   ```

2. **Update import in WeddingAndEvents.tsx**
   ```tsx
   import heroWeddingImage from "@/assets/heroWedding.webp";
   ```

3. **Optional: Add preload hint** (if this is a common landing page)
   In `index.html`, add:
   ```html
   <link rel="preload" as="image" href="/src/assets/heroWedding.webp" 
         fetchpriority="high" type="image/webp" 
         media="(min-width: 768px)" />
   ```
   Note: Only preload on desktop since mobile uses video

4. **Clear cache and test**
   - Hard refresh (Ctrl+Shift+Delete)
   - Run Lighthouse audit
   - Verify LCP < 2.5s

## Additional Recommendations

### For Gallery Images
Consider optimizing the largest gallery images:
```bash
# Compress large gallery images
cwebp -q 80 public/assets/wedding-events/IMG_1791.webp -o IMG_1791-optimized.webp
cwebp -q 80 public/assets/wedding-events/IMG_4875.webp -o IMG_4875-optimized.webp
cwebp -q 80 public/assets/wedding-events/IMG_5461.webp -o IMG_5461-optimized.webp
```

### Responsive Images
For even better performance, create multiple sizes:
```bash
# Small (mobile)
cwebp -q 85 -resize 800 0 heroWedding.jpg -o heroWedding-small.webp

# Medium (tablet)
cwebp -q 85 -resize 1200 0 heroWedding.jpg -o heroWedding-medium.webp

# Large (desktop)
cwebp -q 85 heroWedding.jpg -o heroWedding-large.webp
```

Then use `srcset`:
```tsx
<img
  src={heroWeddingImage}
  srcSet={`
    ${heroWeddingImageSmall} 800w,
    ${heroWeddingImageMedium} 1200w,
    ${heroWeddingImageLarge} 1920w
  `}
  sizes="100vw"
  alt="Elegant Wedding Couple"
  // ... other attributes
/>
```

## Browser Compatibility

WebP is supported by:
- Chrome 23+
- Firefox 65+
- Safari 14+
- Edge 18+

Coverage: 96%+ of users

For older browsers, use `<picture>` element:
```tsx
<picture>
  <source srcSet={heroWeddingImageWebP} type="image/webp" />
  <img src={heroWeddingImageJPG} alt="..." />
</picture>
```

## Summary

**Code optimizations applied:** ✅ Complete
**Image optimization needed:** 🚨 CRITICAL - Convert to WebP

**Next action:** Convert `heroWedding.jpg` to WebP format to achieve LCP < 2.5s
