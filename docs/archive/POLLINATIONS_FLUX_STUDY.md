# Pollinations Flux Model - Comprehensive Study & Implementation

## 🔬 How Pollinations Works

### API Structure
- **Endpoint**: `https://gen.pollinations.ai/image/{prompt}?key=API_KEY&model=flux&width=1024&height=1024`
- **Method**: GET request (works with IMG tags, no CORS issues)
- **Authentication**: Query parameter `?key=YOUR_API_KEY`

### Supported Parameters
1. **model**: `flux`, `flux-realism`, `flux-anime`, `flux-3d`, `flux-pro`, `turbo`
2. **width** / **height**: Image dimensions (1024x1024 recommended for quality)
3. **seed**: Reproducibility (-1 for random, specific number for consistency)
4. **nologo**: `true` to remove watermark
5. **enhance**: `true` to improve prompt interpretation (IMPORTANT for quality)
6. **key**: API key for authentication

### Rate Limits
- **Publishable Keys (pk_)**: 1 pollen/hour per IP+key
- **Each generation = 1 pollen**
- **Result**: Only 1 image per hour per IP address

## 🎨 Flux Model Characteristics

### Model Variants
1. **flux**: General-purpose, high quality (12B parameters)
2. **flux-realism**: Optimized for photorealistic images ⭐ **BEST FOR PRODUCT PHOTOGRAPHY**
3. **flux-anime**: Anime-style images
4. **flux-3d**: 3D renderings
5. **flux-pro**: Highest quality but slower
6. **turbo**: Fast but lower quality (current)

### Flux Model Strengths
- **97.3% prompt fidelity** (follows prompts very closely)
- **Superior photorealism** (matches Midjourney v6.0, DALL·E 3)
- **Precise rendering** of details (hands, faces, text)
- **Commercial-grade quality** suitable for marketing materials

## 📝 Prompt Engineering for Pollinations/Flux

### How Flux Interprets Prompts
1. **Detailed descriptions work better** - Flux has 12B parameters, can handle complex prompts
2. **Structured format helps** - Subject + Composition + Lighting + Quality + Style
3. **Specific photography terms** - Flux understands professional photography terminology
4. **The `enhance` parameter** - Automatically refines prompts for better interpretation

### Best Prompt Structure for Product Photography

```
[Subject Description] + 
[Composition/Camera Angle] + 
[Lighting Setup] + 
[Quality Keywords] + 
[Style/Aesthetic] + 
[Background] + 
[Brand/Context]
```

### Example Structure:
```
"A luxury black gift box filled with 10 red roses, 
top-down aerial view, 
soft studio lighting from above with subtle shadows, 
8K resolution ultra-detailed photorealistic, 
professional product photography, 
white background, 
Bexy Flowers premium floral arrangement"
```

### Key Photography Terms Flux Understands
- **Camera angles**: "top-down view", "aerial view", "front view", "side view", "close-up", "macro"
- **Lighting**: "studio lighting", "soft natural light", "diffused lighting", "rim lighting", "golden hour"
- **Composition**: "centered", "rule of thirds", "symmetrical", "minimalist"
- **Quality**: "8K resolution", "ultra-detailed", "photorealistic", "sharp focus", "depth of field"
- **Background**: "white background", "seamless background", "isolated on white", "transparent background"

### What Makes a Good Prompt for Flux
1. **Be Specific**: "10 red roses" not "roses"
2. **Include Composition**: "top-down view" not just "box with flowers"
3. **Describe Lighting**: "soft studio lighting" helps Flux understand the mood
4. **Quality Keywords**: "8K resolution", "ultra-detailed" trigger high-quality generation
5. **Professional Terms**: Flux understands photography terminology
6. **Structured Format**: Logical flow helps Flux parse the prompt

### Negative Prompts (What to Exclude)
Flux responds well to exclusion terms:
- "blurry, low quality, distorted, deformed, ugly"
- "bad anatomy, extra limbs, duplicate"
- "watermark, text, signature, logo"
- "dark shadows, overexposed, underexposed"
- "noise, grain, artifacts, compression artifacts"

## 🎯 Implementation Strategy

### 1. Model Selection
- **Use**: `flux-realism` for product photography (best for photorealistic results)
- **Alternative**: `flux` if flux-realism not available
- **Avoid**: `turbo` (lower quality)

### 2. Resolution
- **Recommended**: 1024x1024 (best quality/speed balance)
- **Alternative**: 768x768 (faster, still good quality)
- **Avoid**: 512x512 (too low for product photography)

### 3. Parameters
- **model**: `flux-realism` or `flux`
- **width**: `1024`
- **height**: `1024`
- **enhance**: `true` (IMPORTANT - improves prompt interpretation)
- **nologo**: `true` (remove watermark)
- **seed**: `-1` (random) or specific number for consistency

### 4. Prompt Structure
Create a structured prompt builder that includes:
1. Subject (flowers, box, wrap)
2. Composition (camera angle, view)
3. Lighting (studio lighting description)
4. Quality keywords (8K, ultra-detailed, photorealistic)
5. Style (professional product photography)
6. Background (white, seamless)
7. Brand context (Bexy Flowers)

### 5. Single Generation Strategy
- **Remove multiple attempts** (only 1 pollen/hour)
- **Use optimal settings** from the start
- **If it fails, show error immediately** (don't waste time on retries)

## 📋 Implementation Plan

### Phase 1: Update Model & Parameters
1. Change model from `turbo` to `flux-realism` (or `flux`)
2. Increase resolution to 1024x1024
3. Enable `enhance=true` parameter
4. Keep `nologo=true`

### Phase 2: Improve Prompt Engineering
1. Create structured prompt builder function
2. Include photography-specific terms
3. Add composition descriptions
4. Include lighting descriptions
5. Add quality keywords
6. Structure prompts logically

### Phase 3: Optimize Generation
1. Remove multiple strategy attempts
2. Use single high-quality generation
3. Add better error handling
4. Show clear feedback to user

## ✅ Expected Improvements

1. **Higher Quality**: flux-realism produces photorealistic images
2. **Better Prompt Following**: 97.3% prompt fidelity
3. **More Details**: 12B parameters capture fine details
4. **Professional Look**: Suitable for commercial use
5. **Faster User Experience**: Single attempt, no wasted retries

