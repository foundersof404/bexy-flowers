# 🔗 Frontend Integration Guide

**How to connect your React frontend to the local Python backend**

---

## 📋 **Overview**

Your current frontend uses online APIs (Pollinations.ai, Hugging Face).  
This guide shows how to switch to your **local Stable Diffusion backend**.

**Benefits:**
- ✅ No API rate limits
- ✅ Works offline
- ✅ Consistent quality
- ✅ More control
- ✅ Free forever

---

## 🎯 **Step 1: Update API Function**

Open `src/pages/Customize.tsx` and find the `generateBouquetImage` function (around line 360).

**Replace the ENTIRE function** with this:

```typescript
const generateBouquetImage = async () => {
  if (totalFlowers === 0) {
    toast.error("Please select at least one flower!");
    return;
  }

  setIsGenerating(true);

  try {
    // Build flower list from colorQuantities
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

    // Prepare request body for Python backend
    const requestBody = {
      packaging_type: selectedPackage?.type || 'box',
      box_color: selectedBoxColor?.name.toLowerCase() || 'red',
      box_shape: selectedBoxShape?.name.toLowerCase() || 'heart',
      wrap_color: selectedWrapColor?.name.toLowerCase() || 'pink',
      flowers: flowers,
      accessories: selectedAccessories,
      glitter: withGlitter,
      refinement: aiRefinementText.trim(),
      steps: 30,        // 20-50 (higher = better quality, slower)
      guidance: 7.5,    // 7-12 (higher = more prompt adherence)
      width: 1024,
      height: 1024
    };

    console.log('Sending to local backend:', requestBody);

    // Call LOCAL Python backend
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    // Convert response to blob and create object URL
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    setGeneratedImage(imageUrl);
    setShowPreview(true);
    
    toast.success("✅ Image generated successfully! 🌸");
    
  } catch (error: any) {
    console.error('❌ Generation error:', error);
    
    // User-friendly error messages
    if (error.message.includes('fetch')) {
      toast.error("❌ Can't connect to backend. Is server.py running on port 5000?");
    } else if (error.message.includes('500')) {
      toast.error("❌ Backend error. Check server.py terminal for details.");
    } else {
      toast.error(`❌ Failed to generate image: ${error.message}`);
    }
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 🎯 **Step 2: Update Loading Messages (Optional)**

Find the loading spinner in your `Customize.tsx` (around line 800-850) and update the message:

```typescript
{isGenerating && (
  <motion.div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mb-4"
         style={{ borderColor: GOLD }}></div>
    <p className="text-lg font-medium" style={{ color: GOLD }}>
      Generating your custom bouquet with AI...
    </p>
    <p className="text-sm text-gray-600 mt-2">
      Using local Stable Diffusion • This may take 5-10 seconds
    </p>
  </motion.div>
)}
```

---

## 🎯 **Step 3: Add Backend Health Check (Optional)**

Add a health check to verify the backend is running when the page loads.

Add this **after your existing state declarations** (around line 100):

```typescript
// Check if backend is available
const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

useEffect(() => {
  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackendStatus(data.model_loaded ? 'online' : 'offline');
        console.log('✅ Backend status:', data);
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      console.log('⚠️ Backend not reachable:', error);
      setBackendStatus('offline');
    }
  };

  checkBackend();
}, []);
```

Then add a status indicator in your UI (add this near the top of your return statement):

```typescript
{/* Backend Status Indicator */}
{backendStatus === 'offline' && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 
               bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
  >
    <p className="font-medium">⚠️ AI Backend Offline</p>
    <p className="text-sm">Please start server.py to generate images</p>
  </motion.div>
)}

{backendStatus === 'online' && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="fixed top-20 right-4 z-50 
               bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
  >
    ✅ AI Ready
  </motion.div>
)}
```

---

## 🎯 **Step 4: Test the Integration**

### **1. Make sure backend is running:**
```bash
cd backend
python server.py
```

You should see:
```
✅ Model loaded successfully!
Starting Flask server on http://localhost:5000
```

### **2. Start your frontend:**
```bash
cd ..  # back to project root
npm run dev
```

### **3. Test it:**
1. Go to http://localhost:5173/customize
2. Select packaging, flowers, etc.
3. Click "Generate with AI"
4. Wait 5-10 seconds (first generation)
5. See your custom bouquet! 🌸

---

## 🔧 **Configuration Options**

### **Adjust Generation Quality:**

In the `requestBody` in `generateBouquetImage`:

```typescript
const requestBody = {
  // ... other fields ...
  steps: 40,        // 20-50 (higher = better, slower)
  guidance: 10.0,   // 7-12 (higher = more accurate to prompt)
  width: 1024,      // Image width (512, 768, 1024)
  height: 1024,     // Image height
};
```

**Recommended Settings:**

| Use Case | Steps | Guidance | Time (RTX 3060) |
|----------|-------|----------|-----------------|
| Fast Preview | 20 | 7.5 | 3 seconds |
| **Balanced (Default)** | 30 | 7.5 | 5 seconds |
| High Quality | 40 | 10.0 | 7 seconds |
| Maximum Quality | 50 | 12.0 | 10 seconds |

---

## 🐛 **Troubleshooting**

### **Error: "Can't connect to backend"**

**Check:**
1. Is `server.py` running?
   ```bash
   cd backend
   python server.py
   ```

2. Is it on port 5000?
   - Check terminal output: `Starting Flask server on http://localhost:5000`
   - If different port, update fetch URL in frontend

3. CORS issues?
   - Make sure `flask-cors` is installed:
     ```bash
     pip install flask-cors
     ```

---

### **Error: "Backend error: 500"**

**Check backend terminal** for error details. Common issues:

1. **Out of memory:**
   ```python
   # In server.py, line 67:
   pipeline.enable_sequential_cpu_offload()
   ```

2. **Invalid input:**
   - Check console.log output in browser
   - Verify flower data format

---

### **Generation takes too long (CPU mode)**

If you don't have a GPU, reduce steps:

```typescript
const requestBody = {
  // ... other fields ...
  steps: 15,  // Minimum for acceptable quality
};
```

---

## 🚀 **Advanced: Fallback to Online APIs**

Want to use local backend when available, but fall back to online APIs if it's offline?

```typescript
const generateBouquetImage = async () => {
  setIsGenerating(true);

  try {
    // Try local backend first
    if (backendStatus === 'online') {
      console.log('Using local Stable Diffusion backend...');
      // ... local backend code ...
      return;
    }
    
    // Fallback to online API
    console.log('Using Pollinations.ai fallback...');
    const simplePrompt = `Beautiful flower bouquet...`; // Your existing prompt
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(simplePrompt)}?width=1024&height=1024`;
    
    const response = await fetch(url);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    setGeneratedImage(imageUrl);
    setShowPreview(true);
    
  } catch (error) {
    toast.error("Failed to generate image");
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 📊 **Performance Monitoring**

Add generation time tracking:

```typescript
const generateBouquetImage = async () => {
  const startTime = performance.now();
  setIsGenerating(true);

  try {
    // ... generation code ...
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    toast.success(`✅ Generated in ${duration}s! 🌸`);
    
  } catch (error) {
    // ... error handling ...
  }
};
```

---

## ✅ **Checklist**

- [ ] Backend running (`python server.py`)
- [ ] Health endpoint working (`http://localhost:5000/health`)
- [ ] `generateBouquetImage` function updated
- [ ] CORS enabled in backend
- [ ] Frontend can reach `http://localhost:5000`
- [ ] Test generation with simple flower selection
- [ ] Check browser console for errors
- [ ] Check backend terminal for logs

---

## 🎉 **You're Done!**

Your frontend is now connected to your local AI backend!

**Test it:**
1. Select "Box" → "Heart" → "Red"
2. Add "5 Red Roses"
3. Click "Generate"
4. Watch the magic happen! ✨🌸

---

## 📝 **Notes**

- First generation is slower (model warmup)
- Subsequent generations are faster (cached)
- Images are saved in `backend/generated_images/`
- You can customize prompts in `server.py` (line 105-150)

---

**Need help? Check the backend terminal logs for detailed error messages!**

Made with ❤️ for Bexy Flowers

