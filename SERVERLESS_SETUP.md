# 🚀 Serverless Function Setup for Unlimited Pollinations API Rate Limits

This guide explains how to use a **Netlify serverless function** to proxy Pollinations API calls, allowing you to use **secret keys (sk_)** with **unlimited rate limits** - all without needing a physical server!

## 📊 Benefits

### **With Serverless Function (Secret Key)**
- ✅ **Unlimited rate limits** - No 1 pollen/hour restriction
- ✅ **Secret key stays secure** - Never exposed to client
- ✅ **No physical server needed** - Runs on Netlify's serverless infrastructure
- ✅ **Free tier available** - Netlify Functions have generous free limits
- ✅ **Automatic scaling** - Handles traffic spikes automatically

### **Without Serverless (Publishable Key)**
- ⚠️ **1 pollen/hour per IP** - Very limited
- ⚠️ **Key exposed in client** - Publishable key visible in browser
- ✅ **No setup needed** - Works immediately

## 🔧 Setup Instructions

### Step 1: Get a Pollinations Secret Key

1. Visit: https://enter.pollinations.ai
2. Sign up or log in
3. Go to **API Keys** section
4. Create a **Secret Key** (starts with `sk_`)
5. Copy the key (you'll need it in Step 3)

### Step 2: Enable Serverless Mode in Code

Edit `src/lib/api/aiConfig.ts`:

```typescript
apis: {
  pollinations: {
    enabled: true,
    // Change this to true to use serverless function
    useServerless: true, // ← Change from false to true
    serverlessEndpoint: '/.netlify/functions/generate-image',
    // ... rest of config
  }
}
```

### Step 3: Add Environment Variable in Netlify

1. Go to your **Netlify Dashboard**
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add:
   - **Key**: `POLLINATIONS_SECRET_KEY`
   - **Value**: `sk_your_secret_key_here` (paste your secret key from Step 1)
6. Click **Save**

### Step 4: Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add serverless function for unlimited Pollinations API"
   git push
   ```

2. Netlify will automatically:
   - Build your site
   - Deploy the serverless function
   - Make it available at `/.netlify/functions/generate-image`

## 🧪 Testing

After deployment, test the function:

1. Open your site
2. Go to the Customize page
3. Generate an image
4. Check browser console - you should see:
   ```
   [ImageGen] 🚀 Using Pollinations via serverless function (unlimited rate limits)
   ```

## 📁 Files Created

- `netlify/functions/generate-image.ts` - Serverless function code
- `netlify.toml` - Updated with functions configuration

## 🔄 Switching Between Modes

### Use Serverless (Unlimited):
```typescript
useServerless: true
```

### Use Direct API (Limited):
```typescript
useServerless: false
```

## 💰 Cost

**Netlify Functions Free Tier:**
- 125,000 requests/month
- 100 hours of execution time/month
- Perfect for most small to medium sites

**If you exceed free tier:**
- $25/month for Pro plan (includes more function time)
- Or pay per use (very affordable)

## 🛠️ Troubleshooting

### Function Not Found (404)
- Make sure `netlify.toml` has `functions = "netlify/functions"`
- Check that `netlify/functions/generate-image.ts` exists
- Redeploy after adding the function

### "API key not configured" Error
- Verify `POLLINATIONS_SECRET_KEY` is set in Netlify environment variables
- Make sure you're using a **secret key** (starts with `sk_`), not publishable key
- Redeploy after adding environment variable

### Function Timeout
- Netlify Functions have a 10-second timeout on free tier
- Image generation usually takes 5-10 seconds, so this should be fine
- If needed, upgrade to Pro plan for 26-second timeout

## 📚 Additional Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Pollinations API Docs](https://gen.pollinations.ai)
- [Pollinations Dashboard](https://enter.pollinations.ai)

## ✅ Checklist

- [ ] Got secret key from Pollinations
- [ ] Set `useServerless: true` in `aiConfig.ts`
- [ ] Added `POLLINATIONS_SECRET_KEY` to Netlify environment variables
- [ ] Committed and pushed changes
- [ ] Tested image generation
- [ ] Verified unlimited rate limits working

---

**That's it!** You now have unlimited Pollinations API rate limits using a serverless function - no physical server needed! 🎉

