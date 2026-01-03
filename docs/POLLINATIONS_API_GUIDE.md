# Pollinations API - Complete Guide

## 📊 Overview

Pollinations is an AI image generation service that powers the bouquet preview feature. This guide covers everything you need to know about the API, configuration, and optimization.

---

## 🔗 API Endpoint

### Current Endpoint (2025)
- **URL**: `https://gen.pollinations.ai/image/{prompt}`
- **Format**: `https://gen.pollinations.ai/image/{prompt}?key=API_KEY&model=flux&width=1024&height=1024`
- **Authentication**: Query parameter `?key=YOUR_API_KEY`
- **Method**: GET request (works with IMG tags, no CORS issues)

---

## 🔑 API Keys & Rate Limits

### Publishable Keys (pk_)
- **Client-side safe** - Can be used in browser
- **Rate Limit**: 1 pollen/hour per IP+key
- **Each generation = 1 pollen**
- **Result**: Only 1 image per hour per IP address
- **Use case**: Development, testing, low-traffic sites

### Secret Keys (sk_)
- **Server-side only** - Never expose to frontend
- **Rate Limit**: **No rate limits** ✅
- **Can spend prepaid Pollen credits**
- **Use case**: Production with unlimited generation
- **Implementation**: Use via Netlify serverless function

**Current Setup**: Using secret key via serverless function for unlimited rate limits.

---

## 🤖 Available Models

### 1. Flux (Default - Recommended) ⭐
```typescript
model: 'flux'
```
- **Best for**: Realistic flower arrangements, professional product photos
- **Speed**: Fast (5-8 seconds)
- **Quality**: High
- **Style**: Photorealistic

### 2. Flux-Realism
```typescript
model: 'flux-realism'
```
- **Best for**: Ultra-realistic flowers, product catalog images
- **Speed**: Medium (8-12 seconds)
- **Quality**: Very high
- **Style**: Ultra-realistic
- **⭐ BEST FOR PRODUCT PHOTOGRAPHY**

### 3. Flux-Anime
```typescript
model: 'flux-anime'
```
- **Best for**: Artistic bouquet designs, stylized presentations
- **Speed**: Fast
- **Quality**: High
- **Style**: Anime/artistic

### 4. Flux-3D
```typescript
model: 'flux-3d'
```
- **Best for**: 3D rendered flowers, modern digital look
- **Speed**: Medium
- **Quality**: High
- **Style**: 3D rendered

### 5. Flux-Pro
```typescript
model: 'flux-pro'
```
- **Best for**: Highest quality (slower)
- **Speed**: Slow
- **Quality**: Highest
- **Style**: Ultra-high quality

### 6. Turbo
```typescript
model: 'turbo'
```
- **Best for**: Fastest generation, quick previews
- **Speed**: Very fast (3-5 seconds)
- **Quality**: Medium
- **Style**: Decent quality

---

## 📝 Supported Parameters

### Core Parameters
1. **model**: `flux`, `flux-realism`, `flux-anime`, `flux-3d`, `flux-pro`, `turbo`
2. **width** / **height**: Image dimensions (1024x1024 recommended for quality)
3. **seed**: Reproducibility (-1 for random, specific number for consistency)
4. **key**: API key for authentication

### Optional Parameters
- **nologo**: `true` to remove watermark
- **enhance**: `true` to improve prompt interpretation (IMPORTANT for quality)

---

## 🎨 Prompt Engineering

### Optimal Prompt Structure

```
[Subject with ALL details] + 
[Composition/Camera Angle] + 
[Lighting Setup] + 
[Quality Keywords] + 
[Style/Aesthetic] + 
[Background] + 
[Brand/Context]
```

### Example Structure:
```
"A premium red luxury gift box, round shape, large size dimensions, 
filled with a stunning flower bouquet containing exactly 21 fresh premium flowers: 
21 red roses, expertly arranged in a professional large size floral arrangement 
featuring 21 red roses blooms, top-down aerial view, bird's eye perspective, 
camera positioned directly above, showing the elegant red round box with lid fully open 
revealing the beautiful flowers arranged inside, the box lid displays elegant golden text 
'Bexy Flowers' in elegant script font, clearly visible and readable, 
soft professional studio lighting from above creating gentle natural shadows, 
diffused natural light, premium floral gift presentation, Bexy Flowers luxury brand signature, 
elegant premium quality, commercial product photography, white seamless background, isolated on white"
```

### Key Photography Terms Flux Understands
- **Camera angles**: "top-down view", "aerial view", "front view", "side view", "close-up", "macro"
- **Lighting**: "studio lighting", "soft natural light", "diffused lighting", "rim lighting", "golden hour"
- **Composition**: "centered", "rule of thirds", "symmetrical", "minimalist"
- **Quality**: "8K resolution", "ultra-detailed", "photorealistic", "sharp focus", "depth of field"
- **Background**: "white background", "seamless background", "isolated on white", "transparent background"

### Best Practices
1. **Be Specific**: "10 red roses" not "roses"
2. **Include Composition**: "top-down view" not just "box with flowers"
3. **Describe Lighting**: "soft studio lighting" helps Flux understand the mood
4. **Quality Keywords**: "8K resolution", "ultra-detailed" trigger high-quality generation
5. **Professional Terms**: Flux understands photography terminology
6. **Structured Format**: Logical flow helps Flux parse the prompt

---

## ⚙️ Current Configuration

### Serverless Function Setup
- **Enabled**: `useServerless: true`
- **Endpoint**: `/.netlify/functions/generate-image`
- **Secret Key**: Stored in Netlify environment variables
- **Rate Limits**: Unlimited ✅

### Model Settings
```typescript
{
  model: 'flux',
  width: 1024,
  height: 1024,
  enhancePrompt: true
}
```

---

## 🚀 Implementation Strategy

### Single High-Quality Generation
1. **Model**: `flux` or `flux-realism` (best for product photography)
2. **Resolution**: 1024x1024 (best quality/speed balance)
3. **Parameters**: 
   - `enhance: true` (IMPORTANT - improves prompt interpretation)
   - `nologo: true` (remove watermark)
   - `seed: -1` (random) or specific number for consistency
4. **Prompt**: Enhanced with photography keywords
5. **Single attempt**: No fallbacks needed (unlimited rate limits with secret key)

---

## 📊 Performance

### Expected Generation Times
- **Flux**: 5-8 seconds
- **Flux-Realism**: 8-12 seconds
- **Flux-Anime**: 5-8 seconds
- **Flux-3D**: 8-12 seconds
- **Turbo**: 3-5 seconds

### Quality Comparison
| Model | Speed | Quality | Style | Best For |
|-------|-------|---------|-------|----------|
| **flux** ⭐ | Fast | High | Realistic | General use |
| **flux-realism** | Medium | Very High | Ultra-realistic | Product photos |
| **flux-anime** | Fast | High | Artistic | Creative designs |
| **flux-3d** | Medium | High | 3D rendered | Modern look |
| **turbo** | Very Fast | Medium | Decent | Quick previews |

---

## 🔧 Troubleshooting

### Common Issues

**1. Rate Limit Errors**
- **Symptom**: "Rate limit exceeded" or only 1 image per hour works
- **Solution**: Use secret key via serverless function (unlimited limits)

**2. Low Quality Images**
- **Symptom**: Blurry or low-resolution images
- **Solution**: 
  - Increase resolution to 1024x1024
  - Use `flux-realism` model
  - Enable `enhance: true`
  - Improve prompt with quality keywords

**3. Images Don't Match Prompt**
- **Symptom**: Generated image doesn't match description
- **Solution**:
  - Be more specific in prompts
  - Use structured prompt format
  - Include composition and lighting details
  - Enable `enhance: true`

**4. Slow Generation**
- **Symptom**: Takes too long to generate
- **Solution**:
  - Use `turbo` model for speed
  - Reduce resolution (512x512)
  - Disable `enhance` (faster but lower quality)

---

## 📚 Additional Resources

- **Official API Docs**: https://gen.pollinations.ai
- **API Key Dashboard**: https://enter.pollinations.ai
- **Serverless Setup**: See `SERVERLESS_SETUP.md`
- **Rate Limits**: See `RATE_LIMITS_CONFIRMATION.md`

---

## ✅ Summary

**Current Setup:**
- ✅ Using secret key via serverless function
- ✅ Unlimited rate limits
- ✅ Flux model (high quality)
- ✅ 1024x1024 resolution
- ✅ Enhanced prompts enabled
- ✅ Production-ready

**To Change Model:**
1. Edit `src/lib/api/aiConfig.ts`
2. Change `model: 'flux'` to your preferred model
3. Save and restart server
4. Test generation

---

**Last Updated**: 2025 - Current implementation uses serverless function with secret key for unlimited rate limits.

