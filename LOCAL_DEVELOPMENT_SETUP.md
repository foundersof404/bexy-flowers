# 🚀 Local Development Setup Guide

## ⚠️ Current Issue

You're seeing `404 (Not Found)` errors for `.netlify/functions/database` because you're running the app with `npm run dev`, which only starts the Vite dev server. **Netlify Functions are not available** in this mode.

## ✅ Solution: Use Netlify Dev

Netlify Dev runs both your frontend AND serverless functions locally.

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

Or if you prefer to install locally:
```bash
npm install --save-dev netlify-cli
```

### Step 2: Login to Netlify (if not already)

```bash
netlify login
```

### Step 3: Link Your Site (if not already linked)

```bash
cd bexy-flowers
netlify link
```

This will ask you to select your site from Netlify.

### Step 4: Run Netlify Dev

Instead of `npm run dev`, use:

```bash
netlify dev
```

This will:
- ✅ Start your Vite frontend (usually on `http://localhost:8888`)
- ✅ Start all Netlify Functions locally
- ✅ Load environment variables from Netlify
- ✅ Make functions available at `/.netlify/functions/*`

### Step 5: Access Your App

Open `http://localhost:8888` (or the URL shown in terminal)

## 🔄 Alternative: Quick Fix for Development

If you can't use Netlify Dev right now, you can temporarily disable database operations in development:

### Option A: Mock the Database Client (Quick Fix)

Create a mock version that returns empty data in development:

```typescript
// src/lib/api/database-client.ts
const API_ENDPOINT = import.meta.env.DEV 
  ? '/api/mock-database' // Mock endpoint in dev
  : '/.netlify/functions/database'; // Real endpoint in production
```

### Option B: Deploy to Netlify (Best Solution)

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Fix: Remove all supabase references, use database proxy"
   git push
   ```

2. Netlify will auto-deploy
3. Test on your Netlify URL (functions work there!)

## 📋 Netlify Dev vs npm run dev

| Feature | `npm run dev` | `netlify dev` |
|---------|---------------|---------------|
| Frontend | ✅ Works | ✅ Works |
| Netlify Functions | ❌ Not available | ✅ Works |
| Environment Variables | From `.env` | From Netlify + `.env` |
| Port | Usually 5173 | Usually 8888 |
| Database API | ❌ 404 errors | ✅ Works |

## 🎯 Recommended Workflow

1. **For local development**: Use `netlify dev`
2. **For production testing**: Deploy to Netlify
3. **For quick UI changes**: `npm run dev` (but database won't work)

## ⚠️ Important Notes

- The React Router warnings are just deprecation notices (not errors)
- The GSAP "Invalid scope" warning is also just a warning
- The 404 errors will disappear once you use `netlify dev` or deploy

## 🚀 Quick Start

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login (if not logged in)
netlify login

# Link site (if not linked)
netlify link

# Start development server with functions
netlify dev
```

That's it! Your database functions will now work locally! 🎉
