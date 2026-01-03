# Pollinations API - Comprehensive Study & Implementation Plan

## 📊 Current Understanding

### API Endpoint
- **New Endpoint**: `https://gen.pollinations.ai/image/{prompt}`
- **Format**: `https://gen.pollinations.ai/image/{prompt}?key=API_KEY&model=turbo&width=512&height=512`
- **Authentication**: Query parameter `?key=YOUR_API_KEY` (works with IMG tags, no CORS)

### Rate Limits & Pricing
- **Publishable Keys (pk_)**: 
  - Client-side safe
  - **1 pollen/hour per IP+key**
  - Each image generation = **1 pollen**
  - **Result: Only 1 image per hour per IP address**
  
- **Secret Keys (sk_)**:
  - Server-side only
  - No rate limits
  - Can spend prepaid Pollen credits
  - **Not suitable for client-side use**

### Current Implementation Issues
1. **Multiple Strategy Attempts**: Current code tries 3 different strategies (Enhanced, Simple, Fast)
   - Problem: Only first attempt works (1 pollen/hour limit)
   - Subsequent attempts fail due to rate limiting
   - Wastes time waiting for failed attempts

2. **Current Parameters**:
   - `model=turbo` (fast but lower quality)
   - `width=512, height=512` (low resolution)
   - Missing quality parameters (steps, guidance_scale, etc.)

3. **Prompt Enhancement**: Basic enhancement, could be more sophisticated

## 🔍 Research Needed

### 1. Available Models
According to API docs, models include:
- `turbo` - Fast generation (current)
- `flux` - Higher quality (mentioned in old config)
- `sdxl` - Stable Diffusion XL (high quality)
- `dreamshaper` - Artistic style
- Others: Need to verify what's available in new API

**Question**: Which model provides best quality for product photography?

### 2. Supported Parameters
From API documentation format: `?model=flux&width=512&height=512&key=API_KEY`

**Need to verify if these are supported**:
- `steps` - Number of inference steps (more = better quality, slower)
- `guidance_scale` or `cfg_scale` - How closely to follow prompt (7-9 recommended)
- `seed` - For reproducibility (-1 for random)
- `negative` or `negative_prompt` - What to exclude
- `aspect_ratio` - Alternative to width/height
- `enhance` - Image enhancement (boolean)
- `nologo` - Remove watermark (boolean)

### 3. Maximum Resolution
- Current: 512x512
- Need to test: 768x768, 1024x1024, 1280x1280
- Higher resolution = better quality but slower generation

### 4. Prompt Optimization
Current prompt structure:
```
"A luxury black gift box filled with a beautiful flower bouquet. 
The bouquet contains 10 red roses, expertly arranged. 
Small size arrangement. View from above showing the black box and flowers inside. 
Premium floral gift, elegant presentation, Bexy Flowers style"
```

**Enhancement opportunities**:
- Add photography-specific terms
- Include lighting descriptions
- Specify camera angles
- Add quality keywords
- Structure for better AI understanding

## 📋 Implementation Plan (Single Generation Strategy)

### Phase 1: Research & Testing
1. **Test Available Models**
   - Try: `flux`, `sdxl`, `dreamshaper`
   - Compare quality vs speed
   - Document which works best for product photography

2. **Test Parameters**
   - Test if `steps`, `guidance_scale`, `seed` are supported
   - Test maximum resolution
   - Test negative prompts

3. **Quality Benchmarking**
   - Generate same prompt with different settings
   - Compare: resolution, model, parameters
   - Document best combination

### Phase 2: Optimize Single Generation
**Goal**: Get the best possible quality from ONE generation (since we only have 1 pollen/hour)

1. **Remove Multiple Strategy Attempts**
   - Only try ONE generation with optimal settings
   - No fallbacks (they'll fail due to rate limit anyway)
   - Faster user experience

2. **Optimize Parameters**
   - Use best quality model (not turbo)
   - Increase resolution (768x768 or 1024x1024)
   - Add quality parameters if supported
   - Use fixed seed for consistency OR -1 for variety

3. **Enhance Prompt Engineering**
   - Structured prompt format
   - Photography-specific keywords
   - Better composition descriptions
   - Professional quality terms

4. **Improve Negative Prompts**
   - More comprehensive exclusion list
   - Remove unwanted artifacts
   - Focus on product quality

### Phase 3: Client-Side Post-Processing (Optional)
Since we can only generate once, enhance the result:
- Image sharpening
- Color correction
- Contrast/brightness adjustment
- Upscaling (if needed)

## 🎯 Recommended Strategy

### Single High-Quality Generation
1. **Model**: Test and use best available (likely `flux` or `sdxl`)
2. **Resolution**: 768x768 or 1024x1024 (test which works)
3. **Parameters**: 
   - `steps=30-50` (if supported)
   - `guidance_scale=7.5-8.5` (if supported)
   - `seed=-1` (random) or fixed seed for consistency
4. **Prompt**: Enhanced with photography keywords
5. **Negative Prompt**: Comprehensive exclusion list

### Remove Current Fallback Strategy
- Remove "Pollinations (Simple)" attempt
- Remove "Pollinations (Fast)" attempt
- Only use "Pollinations (Enhanced)" with optimal settings
- If it fails, show error immediately (don't waste time on retries)

## ⚠️ Constraints
- **1 pollen per hour**: Cannot generate multiple images
- **Client-side only**: Must use publishable key (pk_)
- **No server**: Cannot use secret key (sk_) for unlimited generation
- **Single attempt**: Must get it right the first time

## 📝 Next Steps
1. Test API with different models and parameters
2. Document what parameters are actually supported
3. Find optimal quality settings
4. Implement single high-quality generation strategy
5. Enhance prompt engineering
6. Add client-side post-processing if needed

