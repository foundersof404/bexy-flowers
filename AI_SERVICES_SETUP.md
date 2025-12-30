# 🚀 AI Image Generation Setup Guide

Since Pollinations AI is experiencing issues, here are reliable alternatives for AI-powered flower image generation:

## 🎯 Quick Fix: Use Replicate AI (Free Tier Available)

### 1. Sign up for Replicate
- Go to [replicate.com](https://replicate.com)
- Create a free account
- Get your API key from the dashboard

### 2. Add to Environment Variables
Create a `.env` file in your project root:

```bash
# Replicate AI (Free tier: 500 predictions/month)
REACT_APP_REPLICATE_API_KEY=r8_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Restart Your App
```bash
npm run dev
```

**Result**: Professional AI-generated images using Stable Diffusion models!

---

## 💰 Paid Services (For Production)

### Stability AI (Recommended)
- **Cost**: $0.02 per image
- **Quality**: Excellent for photorealistic flowers
- **Setup**: Get API key from [stability.ai](https://platform.stability.ai)

### OpenAI DALL-E 3
- **Cost**: $0.04-0.08 per image
- **Quality**: Very high, artistic style
- **Setup**: Get API key from [OpenAI](https://platform.openai.com)

### Midjourney API
- **Cost**: $0.03-0.05 per image
- **Quality**: Artistic, unique style
- **Setup**: Apply for API access at [midjourney.com](https://midjourney.com)

---

## 🏠 Self-Hosted Option (Local GPU Required)

If you have an NVIDIA GPU with 4GB+ VRAM:

### Quick Setup:
```bash
# Follow the self-hosted guide
./setup-selfhosted.sh
```

**Pros**: Free unlimited generation, full control
**Cons**: Requires powerful GPU, setup time

---

## 📊 Service Comparison

| Service | Cost | Quality | Speed | Setup Time |
|---------|------|---------|-------|------------|
| **Replicate** | Free tier | ⭐⭐⭐⭐ | ⭐⭐⭐ | 5 min |
| **Stability AI** | $0.02/img | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 5 min |
| **DALL-E 3** | $0.04/img | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 5 min |
| **Self-hosted** | Free | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 30 min |
| **Pollinations** | Free | ⭐⭐⭐ (unreliable) | ⭐⭐ | N/A |

---

## 🔧 Current Status

Your app currently uses **Smart Preview** which intelligently selects the best matching images from your collection based on:
- Flower type and color
- Packaging style
- Occasion (wedding, graduation, etc.)

This provides beautiful, relevant previews even without AI generation!

**To enable AI generation**: Choose a service above and add the API key to your `.env` file.




