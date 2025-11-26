# 🚀 How to Start the Backend Server

## ✅ Correct Way (From Backend Directory)

**Option 1: Using Batch File (Easiest)**
```powershell
# Double-click this file:
backend/start_server.bat
```

**Option 2: Manual Command**
```powershell
# Navigate to backend folder first
cd backend

# Then run:
.\venv\Scripts\python.exe server.py
```

**Option 3: Activate Venv First**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python server.py
```

## ❌ Common Mistakes

**DON'T run from root directory:**
```powershell
# ❌ WRONG - This won't work:
python server.py
```

**DO run from backend directory:**
```powershell
# ✅ CORRECT:
cd backend
python server.py
```

## 📍 Important Notes

- **Always be in the `backend` folder** when running `server.py`
- The `venv` folder is inside `backend`, so you need to be there
- If you see "file not found" errors, check you're in the right directory

## 🔍 Verify You're in the Right Place

Before running, check:
```powershell
# Should show: C:\Users\bossm\Desktop\e-commerce-Bexy_Flowers-main\backend
pwd

# Should show server.py exists
Test-Path server.py
```

## 🎯 What You Should See

When server starts successfully, you'll see:
```
INFO: Loading base model...
INFO: Loading fine-tuned PEFT LoRA model...
INFO: Running on http://127.0.0.1:5000
```

Then the server is ready! 🎉





