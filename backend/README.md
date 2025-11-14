# 🌸 Bexy Flowers AI Backend Server

**Local AI Image Generation with Stable Diffusion + Flask**

Generate beautiful flower bouquet images **100% offline** using Stable Diffusion!

---

## 📋 **Requirements**

### **Hardware:**
- **Recommended:** NVIDIA GPU with 8GB+ VRAM (RTX 3060, RTX 3070, RTX 4060, etc.)
- **Minimum:** 16GB RAM for CPU generation (slower but works!)
- **Storage:** ~10GB free space (for models and dependencies)

### **Software:**
- **Python 3.9 - 3.11** (Python 3.12+ may have compatibility issues)
- **pip** (Python package manager)
- **CUDA 11.8+** (only if using GPU - [Download CUDA](https://developer.nvidia.com/cuda-downloads))

---

## 🚀 **Installation Guide**

### **Step 1: Install Python**

**Windows:**
1. Download Python 3.11 from [python.org](https://www.python.org/downloads/)
2. **IMPORTANT:** Check "Add Python to PATH" during installation
3. Verify installation:
```bash
python --version
# Should show: Python 3.11.x
```

**macOS/Linux:**
```bash
# macOS (using Homebrew)
brew install python@3.11

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

---

### **Step 2: Create Virtual Environment**

Navigate to the backend folder and create an isolated environment:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

---

### **Step 3: Install Dependencies**

#### **For GPU (NVIDIA CUDA):**

```bash
# Install PyTorch with CUDA support first
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# Then install other dependencies
pip install -r requirements.txt
```

#### **For CPU Only:**

```bash
# Install CPU version of PyTorch
pip install torch torchvision

# Then install other dependencies
pip install -r requirements.txt
```

**This will take 5-10 minutes** - it's downloading ~2GB of packages.

---

### **Step 4: First Run (Model Download)**

The first time you run the server, it will download the Stable Diffusion model (~4GB):

```bash
python server.py
```

**Output:**
```
============================================================
🌸 Bexy Flowers AI Backend Server 🌸
============================================================
Loading Stable Diffusion model: runwayml/stable-diffusion-v1-5
This may take a few minutes on first run (downloading ~4GB model)...
Using device: cuda  (or cpu)
✅ Model loaded successfully!
Starting Flask server on http://localhost:5000
============================================================
```

**First download:** 5-15 minutes depending on internet speed
**Subsequent runs:** 10-30 seconds (model is cached locally)

---

## 🎮 **Usage**

### **Start the Server:**

```bash
# Make sure virtual environment is activated (you should see "(venv)")
python server.py
```

Server will run on: **http://localhost:5000**

---

### **API Endpoints:**

#### **1. Health Check**
```bash
GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cuda",
  "timestamp": "2025-11-13T10:30:00"
}
```

---

#### **2. Generate Image**
```bash
POST http://localhost:5000/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "packaging_type": "box",
  "box_color": "red",
  "box_shape": "heart",
  "flowers": [
    {"type": "roses", "color": "red", "quantity": 5},
    {"type": "tulips", "color": "yellow", "quantity": 3}
  ],
  "accessories": ["crown", "teddy"],
  "glitter": true,
  "refinement": "Make the roses bigger",
  "steps": 30,
  "guidance": 7.5
}
```

**Or for Wrapping Paper:**
```json
{
  "packaging_type": "wrap",
  "wrap_color": "pink",
  "flowers": [
    {"type": "roses", "color": "red", "quantity": 10}
  ],
  "glitter": false,
  "steps": 30,
  "guidance": 7.5
}
```

**Response:** PNG image file

**Generation Time:**
- **GPU (RTX 3060):** 3-5 seconds
- **GPU (RTX 4070):** 1-2 seconds
- **CPU:** 60-180 seconds (1-3 minutes)

---

## 🔧 **Configuration & Optimization**

### **Change Model:**

Edit `server.py` line 30:

```python
# Default (fast, good quality)
MODEL_ID = "runwayml/stable-diffusion-v1-5"

# Better quality (slower, more VRAM)
MODEL_ID = "stabilityai/stable-diffusion-2-1"

# Best quality (requires 12GB+ VRAM)
MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"
```

---

### **Reduce VRAM Usage (Low GPU Memory):**

Uncomment line 67 in `server.py`:

```python
# For GPUs with < 8GB VRAM
pipeline.enable_sequential_cpu_offload()
```

---

### **Speed Up Generation:**

**1. Install xformers (GPU only):**
```bash
pip install xformers
```

Then add to `server.py` after line 68:
```python
pipeline.enable_xformers_memory_efficient_attention()
```

**2. Reduce steps (faster but lower quality):**
```json
{
  "steps": 20  // Default is 30, min is 15
}
```

---

## 🔗 **Connect to Frontend**

### **Update Frontend API URL:**

Edit `src/pages/Customize.tsx` and replace the `generateBouquetImage` function:

```typescript
const generateBouquetImage = async () => {
  setIsGenerating(true);
  
  try {
    // Build flower list
    const flowers = Object.entries(colorQuantities)
      .flatMap(([flowerId, colors]) => {
        const flower = FLOWERS.find(f => f.id === flowerId);
        return Object.entries(colors)
          .filter(([_, count]) => count > 0)
          .map(([colorId, count]) => {
            const colorObj = flower?.colors.find(c => c.id === colorId);
            return {
              type: flower?.name.toLowerCase() || '',
              color: colorObj?.name.toLowerCase() || '',
              quantity: count
            };
          });
      });

    // Prepare request body
    const requestBody = {
      packaging_type: selectedPackage?.type || 'box',
      box_color: selectedBoxColor?.name.toLowerCase() || 'red',
      box_shape: selectedBoxShape?.name.toLowerCase() || 'heart',
      wrap_color: selectedWrapColor?.name.toLowerCase() || 'pink',
      flowers: flowers,
      accessories: selectedAccessories,
      glitter: withGlitter,
      refinement: aiRefinementText,
      steps: 30,
      guidance: 7.5
    };

    // Call local backend
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('Generation failed');

    // Convert response to blob and create URL
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    setGeneratedImage(imageUrl);
    setShowPreview(true);
    
    toast.success("Image generated successfully! 🌸");
    
  } catch (error) {
    console.error('Generation error:', error);
    toast.error("Failed to generate image. Is the backend running?");
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 🐛 **Troubleshooting**

### **Problem: "No module named 'torch'"**
**Solution:**
```bash
pip install torch torchvision
```

---

### **Problem: CUDA out of memory**
**Solution:** Enable CPU offloading:
```python
# In server.py, line 67:
pipeline.enable_sequential_cpu_offload()
```

Or use a smaller model:
```python
MODEL_ID = "runwayml/stable-diffusion-v1-5"  # Smaller than 2.1
```

---

### **Problem: Generation too slow on CPU**
**Solution:** Reduce steps:
```json
{
  "steps": 15  // Minimum for acceptable quality
}
```

---

### **Problem: "Address already in use" (Port 5000)**
**Solution:** Change port in `server.py` line 258:
```python
app.run(port=5001)  # Use different port
```

---

### **Problem: Frontend can't connect (CORS error)**
**Solution:** Check Flask-CORS is installed:
```bash
pip install flask-cors
```

---

## 📁 **Project Structure**

```
backend/
├── server.py              # Main Flask server
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── generated_images/     # Output folder (created automatically)
└── venv/                 # Virtual environment (created by you)
```

---

## 🎯 **Performance Benchmarks**

| Hardware | Generation Time | Quality |
|----------|----------------|---------|
| RTX 4090 | 1-2 seconds | ⭐⭐⭐⭐⭐ |
| RTX 4070 | 2-3 seconds | ⭐⭐⭐⭐⭐ |
| RTX 3060 | 4-6 seconds | ⭐⭐⭐⭐⭐ |
| RTX 2060 | 8-12 seconds | ⭐⭐⭐⭐ |
| CPU (i7) | 90-120 seconds | ⭐⭐⭐⭐ |

---

## 🌟 **Advanced: Deploy to Production**

### **Using Gunicorn (Linux/macOS):**

```bash
pip install gunicorn

gunicorn -w 4 -b 0.0.0.0:5000 server:app
```

### **Using Waitress (Windows):**

```bash
pip install waitress

waitress-serve --port=5000 server:app
```

---

## 📝 **Notes**

- **Models are cached** in `~/.cache/huggingface/` (~4-8GB)
- Generated images are saved in `generated_images/` folder
- **First run downloads models** - be patient!
- **GPU highly recommended** for production use
- Backend runs completely **offline** after first download

---

## 🆘 **Need Help?**

Check logs in the terminal where `server.py` is running. Look for:
- `✅ Model loaded successfully!` - Good!
- `❌ Error loading model:` - Check CUDA/dependencies
- `✅ Image generated successfully!` - Working!

---

## 🎉 **You're Ready!**

Start the server and test with:
```bash
curl http://localhost:5000/health
```

If you see `"status": "ok"`, you're good to go! 🚀🌸

---

**Made with ❤️ for Bexy Flowers**

