# ⚡ Speed Optimization Guide

## 🎯 Current Optimizations Applied

### ✅ Frontend (Customize.tsx)
- **Steps reduced:** 30 → **20** (faster, still good quality)
- **Resolution reduced:** 1024x1024 → **512x512** (faster, still good quality)
- **Timeout added:** 5 minutes max wait time

### ✅ Backend (server.py)
- **VAE Slicing enabled:** Faster VAE decoding
- **Attention Slicing enabled:** Better memory usage
- **DPM++ Scheduler:** Faster than default scheduler
- **Progress logging:** Shows estimated and actual generation time

## ⏱️ Expected Generation Times

### On GPU (CUDA):
- **First generation:** 20-30 seconds (model warmup)
- **Subsequent generations:** 10-20 seconds
- **With 20 steps, 512x512:** ~15 seconds average

### On CPU:
- **First generation:** 60-90 seconds
- **Subsequent generations:** 45-60 seconds
- **Much slower - use GPU if available!**

## 🚀 How to Make It Even Faster

### Option 1: Reduce Steps Further (Faster, Slightly Lower Quality)
Edit `src/pages/Customize.tsx`:
```typescript
steps: 15,  // Even faster (15-20 is minimum for good quality)
```

### Option 2: Use Lower Resolution (Much Faster)
```typescript
width: 384,   // Smaller but still good for preview
height: 384
```

### Option 3: Use Higher Quality (Slower, Better Quality)
```typescript
steps: 30,    // Better quality
width: 768,   // Higher resolution
height: 768
```

## 📊 Speed vs Quality Trade-offs

| Steps | Resolution | Speed | Quality | Use Case |
|-------|-----------|-------|---------|----------|
| 15 | 384x384 | ⚡⚡⚡ Very Fast | ⭐⭐⭐ Good | Quick previews |
| 20 | 512x512 | ⚡⚡ Fast | ⭐⭐⭐⭐ Great | **Current (Recommended)** |
| 25 | 768x768 | ⚡ Medium | ⭐⭐⭐⭐⭐ Excellent | High quality |
| 30 | 1024x1024 | 🐌 Slow | ⭐⭐⭐⭐⭐ Perfect | Final images |

## 🔧 Backend Optimizations (Advanced)

### Enable xFormers (Faster Attention)
```bash
pip install xformers
```
Then uncomment in `server.py`:
```python
# pipeline.enable_xformers_memory_efficient_attention()
```

### Use 8-bit Quantization (Less VRAM, Slightly Slower)
```bash
pip install bitsandbytes
```

## 💡 Tips

1. **First generation is always slower** - model needs to warm up
2. **512x512 is perfect** for web previews (can upscale later if needed)
3. **20 steps is the sweet spot** - good quality, reasonable speed
4. **GPU is essential** - CPU is 3-5x slower
5. **Close other GPU apps** - gives more VRAM to generation

## 🎯 Recommended Settings

**For Fast Previews:**
- Steps: 20
- Resolution: 512x512
- **Time: ~15 seconds on GPU**

**For Final Images:**
- Steps: 25-30
- Resolution: 768x768 or 1024x1024
- **Time: ~30-45 seconds on GPU**

## 📝 Current Status

✅ Optimized for speed while maintaining quality
✅ 512x512 resolution (good for web)
✅ 20 steps (fast but quality)
✅ GPU optimizations enabled
✅ Progress logging added

**Expected time: ~15-20 seconds per image on GPU!** ⚡





