# 🔧 Netlify Function Setup Guide

## ✅ Current Status

You already have a serverless function created at:
- **Location**: `netlify/functions/generate-image.ts`
- **Endpoint**: `/.netlify/functions/generate-image`
- **Status**: ✅ Function code is correct

---

## 🎯 Using Netlify CLI (Optional)

If you want to use the CLI to verify or recreate the function:

### Step 1: Install Netlify CLI (Already Done)
```bash
npm install --save-dev netlify-cli
```

### Step 2: Run Function Creation
```bash
npx netlify functions:create
```

**When prompted:**
1. Select: **"Serverless function (Node/Go/Rust)"**
2. Select template: **"typescript"** or **"hello-world"** (we'll replace it)
3. Function name: **"generate-image"** (or keep default and rename)

**Note**: This will create a template. You'll need to replace it with your existing code from `netlify/functions/generate-image.ts`.

---

## ✅ Your Current Function is Correct!

Your existing function at `netlify/functions/generate-image.ts` is **already properly structured** and matches Netlify's requirements:

- ✅ Uses `@netlify/functions` types
- ✅ Exports `handler` function
- ✅ Handles CORS
- ✅ Uses environment variables correctly
- ✅ Returns proper response format

**You don't need to recreate it!**

---

## 🔍 Why It Might Not Be Working

### Issue 1: Function Not Deployed

**Check**:
1. Go to **Netlify Dashboard** → Your Site
2. Click **Functions** tab
3. Should see: `generate-image`

**If missing**:
- Verify `netlify.toml` has: `functions = "netlify/functions"`
- Push code to trigger deployment
- Check build logs for errors

### Issue 2: Environment Variable Not Set

**Check**:
1. **Netlify Dashboard** → Site settings → Environment variables
2. Verify `POLLINATIONS_SECRET_KEY` exists
3. Value should be: `sk_VmbyD8Bc3zB0qMWo70KrJZSWAtdEB8vC`

**If missing**:
- Add it
- **Redeploy** site (important!)

### Issue 3: Function Returns 500 Error

**Check Function Logs**:
1. **Netlify Dashboard** → Functions → `generate-image`
2. Click **Logs** tab
3. Look for errors

**Common errors**:
- `Missing POLLINATIONS_SECRET_KEY` → Add env var and redeploy
- `Pollinations API error` → Check API key validity

---

## 🚀 Quick Fix Steps

### 1. Verify Function Structure ✅

Your function is already correct:
```
netlify/
  functions/
    generate-image.ts  ✅
```

### 2. Verify netlify.toml ✅

Your config is correct:
```toml
[build]
  functions = "netlify/functions"  ✅
```

### 3. Add Environment Variable ⚠️

1. **Netlify Dashboard** → Site settings → Environment variables
2. Add: `POLLINATIONS_SECRET_KEY` = `sk_VmbyD8Bc3zB0qMWo70KrJZSWAtdEB8vC`
3. **Save**

### 4. Redeploy ⚠️ **CRITICAL**

After adding environment variable:
- **Deploys** tab → **Trigger deploy** → **Clear cache and deploy site**

OR push a commit to trigger automatic deployment.

---

## 🧪 Testing the Function

### Test in Browser Console:

```javascript
fetch('/.netlify/functions/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'a beautiful flower',
    width: 1024,
    height: 1024,
    model: 'flux'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected Response** (if working):
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "width": 1024,
  "height": 1024,
  "model": "flux"
}
```

**Error Response** (if env var missing):
```json
{
  "error": "Server configuration error: API key not configured"
}
```

---

## 📋 Verification Checklist

- [x] Function file exists: `netlify/functions/generate-image.ts`
- [x] `netlify.toml` configured: `functions = "netlify/functions"`
- [x] Function code is correct
- [ ] `POLLINATIONS_SECRET_KEY` set in Netlify Dashboard
- [ ] Site redeployed after adding env var
- [ ] Function appears in Netlify Functions tab
- [ ] Function logs show no errors

---

## 🎯 Summary

**Your function is already correctly set up!** The issue is likely:

1. **Environment variable not set** → Add in Netlify Dashboard
2. **Site not redeployed** → Redeploy after adding env var
3. **Function not deployed** → Check Functions tab in Netlify

**You don't need to use `netlify functions:create`** - your function is already correct! Just make sure:
- ✅ Environment variable is set
- ✅ Site is redeployed
- ✅ Function appears in Netlify Dashboard

---

**The function code is perfect - just needs the environment variable and redeploy!** 🚀

