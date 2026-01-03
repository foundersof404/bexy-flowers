# 🔧 Production Troubleshooting - Serverless Function Not Working

## 🔍 Issue: Serverless Function Not Being Used

**Symptoms:**
- Console shows: `🌸 Using Pollinations Flux model` (direct API)
- Should show: `🚀 Using Pollinations via serverless function`
- Image generation times out or fails

---

## 🎯 Root Causes & Solutions

### Issue 1: Serverless Function Returns 500 Error

**Cause**: Missing or incorrect environment variable in Netlify

**Solution**:
1. Go to **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Verify `POLLINATIONS_SECRET_KEY` exists
4. Verify value is correct: `sk_VmbyD8Bc3zB0qMWo70KrJZSWAtdEB8vC`
5. **Redeploy** site after adding/updating

**Check Function Logs**:
1. Go to **Netlify Dashboard** → Your Site
2. **Functions** tab
3. Click on `generate-image` function
4. Check **Logs** for errors
5. Look for: `Missing POLLINATIONS_SECRET_KEY environment variable`

---

### Issue 2: Serverless Function Not Deployed

**Cause**: Function file not included in deployment

**Solution**:
1. Verify `netlify/functions/generate-image.ts` exists
2. Verify `netlify.toml` has: `functions = "netlify/functions"`
3. Check **Netlify Dashboard** → **Functions** tab
4. Should see `generate-image` function listed
5. If not, redeploy

---

### Issue 3: Build Errors

**Cause**: TypeScript compilation errors in serverless function

**Solution**:
1. Check **Netlify Dashboard** → **Deploys** tab
2. Click on latest deploy
3. Check **Build log** for errors
4. Look for TypeScript errors in `netlify/functions/generate-image.ts`
5. Fix errors and redeploy

---

### Issue 4: Function Timeout

**Cause**: Image generation takes longer than function timeout

**Solution**:
- Free tier: 10-second timeout
- Pro tier: 26-second timeout
- Image generation usually takes 5-10 seconds
- If timing out, upgrade to Pro plan

---

## 🧪 How to Debug

### Step 1: Check Function Exists

1. Go to **Netlify Dashboard** → **Functions** tab
2. Should see: `generate-image`
3. If missing, function wasn't deployed

### Step 2: Check Function Logs

1. Click on `generate-image` function
2. Go to **Logs** tab
3. Look for errors:
   - `Missing POLLINATIONS_SECRET_KEY` → Add env var
   - `Pollinations API error` → Check API key
   - `Timeout` → Upgrade plan or optimize

### Step 3: Test Function Directly

1. Go to your production site
2. Open browser console
3. Run:
   ```javascript
   fetch('/.netlify/functions/generate-image', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       prompt: 'test',
       width: 1024,
       height: 1024,
       model: 'flux'
     })
   }).then(r => r.json()).then(console.log).catch(console.error)
   ```
4. Check response:
   - `{ success: true, ... }` → Function works!
   - `{ error: "..." }` → Check error message

---

## ✅ Verification Checklist

- [ ] `POLLINATIONS_SECRET_KEY` set in Netlify environment variables
- [ ] Environment variable value is correct (starts with `sk_`)
- [ ] Site redeployed after adding environment variable
- [ ] `generate-image` function appears in Netlify Functions tab
- [ ] Function logs show no errors
- [ ] Browser console shows `🚀 Using Pollinations via serverless function`
- [ ] Image generation succeeds without timeout

---

## 🔄 Quick Fix Steps

1. **Verify Environment Variable**:
   - Netlify Dashboard → Site settings → Environment variables
   - Key: `POLLINATIONS_SECRET_KEY`
   - Value: `sk_VmbyD8Bc3zB0qMWo70KrJZSWAtdEB8vC`

2. **Redeploy**:
   - Deploys tab → Trigger deploy → Clear cache and deploy site

3. **Test**:
   - Go to Customize page
   - Generate image
   - Check console for `🚀 Using Pollinations via serverless function`

4. **Check Logs**:
   - Functions tab → generate-image → Logs
   - Look for any errors

---

## 📊 Expected Behavior

### ✅ Working Correctly:
```
[ImageGen] 🚀 Using Pollinations via serverless function (unlimited rate limits)
[ImageGen] Model: flux
[ImageGen] Resolution: 1024x1024
[ImageGen] ✅ Pollinations serverless successful
```

### ❌ Not Working:
```
[ImageGen] 🚀 Using Pollinations via serverless function (unlimited rate limits)
[ImageGen] ❌ Serverless function error: Server configuration error: API key not configured
[ImageGen] 🔄 Serverless function unavailable - using direct API with publishable key
[ImageGen] 🌸 Using Pollinations Flux model (direct API call)
```

---

## 🆘 Still Not Working?

1. **Check Netlify Function Logs** - Most important!
2. **Verify environment variable** is set correctly
3. **Redeploy** after any changes
4. **Clear browser cache** and test again
5. **Check build logs** for compilation errors

---

**The most common issue is missing environment variable!** Check that first! 🔍

