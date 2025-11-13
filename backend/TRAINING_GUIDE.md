# 🎨 Fine-Tuning Guide - Train AI on YOUR Bexy Flowers Style

**Make the AI generate images that look EXACTLY like your brand!**

---

## 🎯 **What is Fine-Tuning?**

Fine-tuning teaches the AI your specific style:
- Your exact box colors and shapes
- Your wrapping paper style
- Your flower arrangements
- Your branding (Bexy Flowers logo)
- Your photography style

**Result:** AI that generates perfect Bexy Flowers product images! 🌸

---

## 📸 **What You Need**

### **1. Training Images (20-50 photos)**

Collect high-quality photos of your actual products:

**Must Have:**
- ✅ Different box colors (red, pink, gold, white, black)
- ✅ Different box shapes (heart, circle, rectangle, square)
- ✅ Wrapped bouquets (different wrapping colors)
- ✅ Mixed flower types (roses, tulips, lilies, etc.)
- ✅ With accessories (teddy bears, crowns, chocolates, cards)
- ✅ With glitter effects
- ✅ Clear Bexy Flowers branding visible

**Photo Quality:**
- 📷 High resolution (at least 1024x1024)
- 💡 Good lighting (natural or studio)
- ⬜ Clean background (preferably white)
- 🎯 Product clearly visible
- 📐 Centered composition

**Examples from your photos:**
1. Mixed flower table decoration ✅
2. "I ❤️ U" rose box arrangement ✅
3. Black wrap with glittery roses + accessory ✅

---

## 🚀 **Step-by-Step Training Process**

### **Step 1: Setup Environment**

```bash
cd backend

# Make sure virtual environment is active
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install additional dependencies for training
pip install accelerate datasets
```

---

### **Step 2: Prepare Training Directory**

```bash
python setup_training.py
```

This creates:
```
backend/
├── training_data/
│   ├── images/           # Processed training images (auto-generated)
│   ├── raw_images/      # PUT YOUR PHOTOS HERE!
│   └── captions.json    # Image descriptions
└── fine_tuned_model/    # Output directory
```

---

### **Step 3: Add Your Photos**

**Copy 20-50 of your best Bexy Flowers product photos to:**
```
backend/training_data/raw_images/
```

**Supported formats:** JPG, PNG, WEBP

**Naming convention:** Doesn't matter, use any names like:
- `box_red_heart_roses.jpg`
- `wrap_pink_tulips.jpg`
- `IMG_001.jpg`
- etc.

---

### **Step 4: Process Images**

This resizes all images to 512x512 and creates initial captions:

```bash
python setup_training.py --prepare
```

**Output:**
- Images resized and saved to `training_data/images/`
- Initial captions generated in `captions.json`

---

### **Step 5: Edit Captions (IMPORTANT!)**

Open `training_data/captions.json` and make captions SPECIFIC and ACCURATE.

**❌ BAD Caption:**
```json
{
  "bexy_image_001": "flower bouquet"
}
```

**✅ GOOD Caption:**
```json
{
  "bexy_image_001": "Beautiful flower bouquet with 15 red roses in a pink heart-shaped luxury gift box with Bexy Flowers elegant gold logo printed on front, professional product photography, white background, studio lighting, high quality"
}
```

**Caption Template:**
```
Beautiful flower bouquet with [X flowers] [flower types] in/wrapped in [packaging description] with Bexy Flowers [logo/branding description], professional product photography, white background, [additional details]
```

**Examples:**

```json
{
  "bexy_image_001": "Beautiful flower bouquet with 10 red roses in a red heart-shaped box with Bexy Flowers gold logo, professional product photography, white background",
  
  "bexy_image_002": "Beautiful flower bouquet with 15 mixed roses (red and white) wrapped in pink wrapping paper with Bexy Flowers elegant branding pattern, tied with white silk ribbon, professional product photography, white background",
  
  "bexy_image_003": "Beautiful flower bouquet with 8 glittery red roses and 7 blue roses in black wrapping paper with Bexy Flowers text, Spider-Man plush toy accessory, tied with red and blue ribbon, hand holding bouquet, professional photography",
  
  "bexy_image_004": "Luxury circular black box filled with white and red roses arranged to spell I LOVE YOU pattern by Bexy Flowers, top down view, professional product photography",
  
  "bexy_image_005": "Beautiful mixed flower arrangement with orange lilies, pink roses, blue hydrangeas, white tulips by Bexy Flowers, in clear glass vase, table decoration style, professional photography"
}
```

**Tips:**
- Be SPECIFIC about flower counts, colors, types
- Mention packaging details (box shape, color, wrap color)
- Always include "Bexy Flowers" and branding details
- Mention accessories if present
- Describe the photography style

---

### **Step 6: Start Training!**

```bash
python train_model.py
```

**What happens:**
1. Loads Stable Diffusion base model (~4GB download first time)
2. Sets up LoRA layers for efficient training
3. Trains for 100 epochs (will take time!)
4. Saves checkpoints every 10 epochs
5. Saves final model

**Training Time:**
- **GPU (RTX 3060):** 2-4 hours for 100 epochs
- **GPU (RTX 4070):** 1-2 hours for 100 epochs
- **CPU:** 12-24 hours (not recommended)

**Progress Output:**
```
============================================================
🌸 Bexy Flowers Model Fine-Tuning 🌸
============================================================
Using device: cuda
Loading base model: runwayml/stable-diffusion-v1-5
Setting up LoRA layers (rank=4)
Trainable parameters: 1,234,567
Loading training dataset...
Found 25 training images
============================================================
Starting training...
Epochs: 100
Batch size: 1
Gradient accumulation: 4
============================================================

Epoch 1/100
Training: 100%|██████████| 25/25 [loss: 0.1234]
...
✅ Saved checkpoint to fine_tuned_model/checkpoint-10
...
Training complete! Saving final model...
✅ Final model saved to fine_tuned_model/final
============================================================
🎉 Training complete!
============================================================
```

---

### **Step 7: Use Your Fine-Tuned Model**

After training, restart your backend server:

```bash
python server.py
```

You'll see:
```
Loading Stable Diffusion model: runwayml/stable-diffusion-v1-5
🎨 Loading fine-tuned LoRA weights from: fine_tuned_model/final/lora_weights.pt
✅ Fine-tuned LoRA weights loaded successfully!
   Your AI will now generate in BEXY FLOWERS STYLE! 🌸
✅ Model loaded successfully!
```

**Now generate images** and they will be in YOUR EXACT STYLE! 🎉

---

## ⚙️ **Configuration & Tweaking**

### **Training Parameters (in `train_model.py`):**

```python
TRAINING_CONFIG = {
    "model_id": "runwayml/stable-diffusion-v1-5",
    "lora_rank": 4,              # LoRA rank: 4, 8, or 16
    "learning_rate": 1e-4,       # Learning rate
    "num_epochs": 100,           # Number of training epochs
    "batch_size": 1,             # Batch size
    "gradient_accumulation_steps": 4,  # Gradient accumulation
    "save_every": 10,            # Save checkpoint every N epochs
    "resolution": 512,           # Training resolution
}
```

**Recommendations:**

| Setting | Value | When to Use |
|---------|-------|-------------|
| **lora_rank** | 4 | Fast training, good for 20-30 images |
| **lora_rank** | 8 | Better quality, more training data (50+) |
| **lora_rank** | 16 | Best quality, lots of data (100+), slower |
| **num_epochs** | 50 | Quick test run |
| **num_epochs** | 100 | Standard training (recommended) |
| **num_epochs** | 200 | Maximum quality, more time |
| **learning_rate** | 1e-4 | Standard (recommended) |
| **learning_rate** | 5e-5 | If training is unstable |

---

## 🐛 **Troubleshooting**

### **Problem: "CUDA out of memory"**

**Solution:** Reduce batch size or enable CPU offloading:
```python
# In train_model.py, around line 180:
config["batch_size"] = 1  # Already set to 1
config["gradient_accumulation_steps"] = 8  # Increase this

# OR use CPU offloading (slower but works):
pipeline.enable_sequential_cpu_offload()
```

---

### **Problem: "No training images found"**

**Solution:** Make sure images are in the correct directory:
```bash
ls training_data/raw_images/  # Should show your images
python setup_training.py --prepare  # Process them
ls training_data/images/  # Should show processed images
```

---

### **Problem: Generated images don't look like my style**

**Solutions:**
1. **Add more training images** (aim for 30-50)
2. **Improve captions** - be MORE SPECIFIC
3. **Train longer** - increase `num_epochs` to 200
4. **Check training images** - are they good quality?
5. **Increase LoRA rank** - change `lora_rank` to 8 or 16

---

### **Problem: Training is too slow**

**Solutions:**
1. **Use GPU** (CPU training takes 10-20x longer)
2. **Reduce epochs** - try 50 epochs first
3. **Reduce resolution** - change `resolution` to 256 (faster but lower quality)

---

### **Problem: Model generates weird/bad images**

**Causes:**
- Too few training images (< 10)
- Bad quality training images
- Vague captions
- Overfitting (trained too long)

**Solutions:**
1. Add more diverse training images
2. Improve image quality
3. Write better, more specific captions
4. Reduce epochs to 50-75

---

## 📊 **Training Tips & Best Practices**

### **1. Image Diversity**

Train on varied examples:
- ✅ Different flowers: roses, tulips, lilies, carnations
- ✅ Different colors: red, pink, white, yellow, blue
- ✅ Different packaging: boxes and wraps
- ✅ Different arrangements: single type, mixed, patterns
- ✅ With and without accessories

### **2. Caption Quality**

**Always include:**
- Flower types and quantities
- Colors
- Packaging details
- "Bexy Flowers" branding
- Photography style

### **3. Training Data Size**

| Images | Quality | Recommended Epochs |
|--------|---------|-------------------|
| 10-20 | Good starting point | 50-75 |
| 20-40 | Recommended | 100 |
| 40-100 | Excellent | 100-150 |
| 100+ | Professional | 150-200 |

### **4. Validation**

Test your model every 10 epochs:
- Generate test images
- Check if style is improving
- Stop if quality is good enough

---

## 🎯 **Expected Results**

### **Before Fine-Tuning (Base Model):**
- Generic flower bouquets
- No Bexy Flowers branding
- Random styles
- Inconsistent quality

### **After Fine-Tuning (Your Model):**
- ✅ Perfect Bexy Flowers style
- ✅ Branded boxes and wraps
- ✅ Your exact color palettes
- ✅ Your arrangement style
- ✅ Consistent high quality
- ✅ Follows your aesthetic

---

## 📝 **Quick Reference Commands**

```bash
# 1. Setup
python setup_training.py

# 2. Add images to training_data/raw_images/

# 3. Process images
python setup_training.py --prepare

# 4. Edit captions in training_data/captions.json

# 5. Train
python train_model.py

# 6. Use fine-tuned model
python server.py
```

---

## 🚀 **Advanced: Multiple Training Runs**

You can experiment with different settings:

```bash
# Run 1: Quick test (50 epochs)
python train_model.py  # Edit num_epochs to 50

# Run 2: Standard (100 epochs)
python train_model.py  # Edit num_epochs to 100

# Run 3: High quality (200 epochs, rank 8)
python train_model.py  # Edit num_epochs to 200, lora_rank to 8
```

Compare results and use the best one!

---

## 💡 **Pro Tips**

1. **Start small** - Train on 20 images first, then add more
2. **Test frequently** - Generate test images every 10 epochs
3. **Good captions matter** - Spend time writing accurate descriptions
4. **Diverse data** - Include all your product types
5. **Quality > Quantity** - 30 great images beats 100 mediocre ones
6. **Save checkpoints** - Keep checkpoint-50, checkpoint-100, etc.
7. **Version control** - Name models: `bexy_v1`, `bexy_v2`, etc.

---

## 🎉 **You're Ready!**

Follow the steps above and you'll have an AI that generates perfect Bexy Flowers images!

**Summary:**
1. ✅ Setup environment
2. ✅ Add 20-50 product photos
3. ✅ Process images
4. ✅ Write specific captions
5. ✅ Train for 100 epochs
6. ✅ Use your custom model
7. ✅ Generate perfect Bexy Flowers images!

**Questions? Check the troubleshooting section or inspect the training logs!**

---

**Made with ❤️ for Bexy Flowers**

*Your AI, Your Style, Your Brand* 🌸✨

