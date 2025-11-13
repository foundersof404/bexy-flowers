# ⚡ QUICK START - 5 Minutes Setup

## 🎯 **Super Fast Installation**

### **1. Install Python 3.11** (if not installed)
Download from: https://www.python.org/downloads/
✅ **CHECK "Add Python to PATH"**

Verify:
```bash
python --version
```

---

### **2. Setup Backend**

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

---

### **3. Install Dependencies**

**GPU (NVIDIA):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt
```

**CPU Only:**
```bash
pip install torch torchvision
pip install -r requirements.txt
```

⏱️ **Takes:** 5-10 minutes

---

### **4. Start Server**

```bash
python server.py
```

⏱️ **First run:** 10-15 minutes (downloads 4GB AI model)
⏱️ **Next runs:** 10-30 seconds

You'll see:
```
✅ Model loaded successfully!
Starting Flask server on http://localhost:5000
```

---

### **5. Test It!**

Open browser: http://localhost:5000/health

You should see:
```json
{"status": "ok", "model_loaded": true}
```

✅ **BACKEND IS READY!**

---

## 🔗 **Connect Frontend**

See `FRONTEND_INTEGRATION.md` for connecting your React app!

---

## 🎨 **Generate Your First Image**

Use Postman, curl, or your frontend:

```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "packaging_type": "box",
    "box_color": "red",
    "box_shape": "heart",
    "flowers": [
      {"type": "roses", "color": "red", "quantity": 5}
    ]
  }' \
  --output test_bouquet.png
```

Check `test_bouquet.png` - you should see your generated flower box! 🌸

---

## ⚙️ **Generation Times**

| Hardware | Time per Image |
|----------|---------------|
| RTX 4070 | 2-3 seconds ⚡ |
| RTX 3060 | 5-6 seconds ⚡ |
| CPU | 1-2 minutes 🐢 |

---

## 🆘 **Issues?**

1. **Can't install torch?**
   - Use CPU version: `pip install torch torchvision`

2. **Out of memory?**
   - Edit `server.py` line 67: uncomment `pipeline.enable_sequential_cpu_offload()`

3. **Port 5000 busy?**
   - Edit `server.py` line 258: change to `port=5001`

4. **Can't download model?**
   - Check internet connection
   - Try different model: Edit `MODEL_ID` in `server.py`

---

## 📱 **Next Steps**

- ✅ Backend running
- 📖 Read `FRONTEND_INTEGRATION.md` to connect React app
- 🎨 Test with different flower combinations
- 🚀 Deploy to production (see README.md)

---

**That's it! Happy flower generating! 🌸✨**

