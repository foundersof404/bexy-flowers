# 🚨 Quick Fix for 404 Database Errors

## ⚠️ The Problem

You're seeing `404 (Not Found)` errors because you're running `npm run dev`, which **only starts the Vite frontend**. Netlify Functions (like your database API) are **not available** in this mode.

## ✅ The Solution

**Use `netlify dev` instead of `npm run dev`**

### Quick Steps:

1. **Stop your current dev server** (Ctrl+C)

2. **Run Netlify Dev:**
   ```bash
   npm run dev:netlify
   ```
   
   Or directly:
   ```bash
   npx netlify dev
   ```

3. **If you haven't linked your site yet:**
   ```bash
   npx netlify link
   ```
   (Select your site from the list)

4. **Access your app** at the URL shown (usually `http://localhost:8888`)

## 🎯 What This Does

- ✅ Starts your Vite frontend
- ✅ Starts all Netlify Functions locally
- ✅ Makes `/.netlify/functions/database` available
- ✅ Loads environment variables from Netlify
- ✅ **All 404 errors will disappear!**

## 📋 Comparison

| Command | Frontend | Functions | Database Works? |
|---------|----------|-----------|-----------------|
| `npm run dev` | ✅ | ❌ | ❌ (404 errors) |
| `npm run dev:netlify` | ✅ | ✅ | ✅ (Works!) |

## ⚠️ Other Warnings (Not Errors)

These are just warnings, not errors:
- ⚠️ React Router Future Flag Warnings → Can be ignored (or add future flags to Router)
- ⚠️ GSAP "Invalid scope" → Can be ignored
- ⚠️ React DevTools suggestion → Optional

## 🚀 After Running Netlify Dev

Once you run `npm run dev:netlify`, you should see:
- ✅ No more 404 errors
- ✅ Database operations working
- ✅ Cart and favorites loading
- ✅ Wedding creations loading

**That's it!** Your app will work exactly like it does on Netlify, but locally! 🎉
