# 🔒 Security Setup Instructions

## 🚨 CRITICAL: Your API is Currently Vulnerable!

The secure version has been created. Follow these steps to activate it:

---

## 📋 Step-by-Step Setup

### **Step 1: Generate Frontend API Key**

Generate a secure random API key for your frontend:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://randomkeygen.com/
```

**Save this key** - you'll need it in steps 2 and 3.

**Example key format**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

---

### **Step 2: Add Environment Variables to Netlify**

1. Go to **Netlify Dashboard** → Your Site
2. Click **Site settings** → **Environment variables**
3. Add these variables:

#### **Required:**
- **Key**: `FRONTEND_API_KEY`
- **Value**: `[Your generated key from Step 1]`
- **Scopes**: Production, Deploy previews, Branch deploys

#### **Already Set (Verify):**
- **Key**: `POLLINATIONS_SECRET_KEY`
- **Value**: `sk_VmbyD8Bc3zB0qMWo70KrJZSWAtdEB8vC`
- **Scopes**: Production, Deploy previews, Branch deploys

4. Click **Save**

---

### **Step 3: Add Frontend API Key to Local Development**

1. Open your `.env` file (or create it if it doesn't exist)
2. Add:

```env
# Frontend API Key (for serverless function authentication)
VITE_FRONTEND_API_KEY=your_generated_key_here

# Pollinations Secret Key (already set)
POLLINATIONS_SECRET_KEY=sk_VmbyD8Bc3zB0qMWo70KrJZSWAtdEB8vC
```

**Important**: Use the **same key** in both Netlify and `.env`!

---

### **Step 4: Redeploy Your Site**

After adding environment variables:

1. Go to **Netlify Dashboard** → **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete

**OR** push a commit to trigger automatic deployment.

---

### **Step 5: Test the Secure Function**

1. Go to your production site: `https://bexyflowers.shop/customize`
2. Try generating an image
3. Check browser console - should see successful generation
4. Try from a different origin - should be blocked (403 error)

---

## 🔍 Verification Checklist

After setup, verify:

- [ ] `FRONTEND_API_KEY` added to Netlify environment variables
- [ ] `VITE_FRONTEND_API_KEY` added to local `.env` file
- [ ] Site redeployed after adding environment variables
- [ ] Image generation works on production site
- [ ] Requests from unauthorized origins are blocked (403)
- [ ] Rate limiting works (try 11 requests in 1 minute - 11th should fail)

---

## 🛡️ Security Features Activated

Once setup is complete, you'll have:

✅ **Rate Limiting**: 10 requests/min, 100/hour, 500/day per IP
✅ **API Key Authentication**: Only your frontend can call the API
✅ **CORS Protection**: Only your domain allowed
✅ **Input Validation**: Prompts and parameters validated
✅ **Abuse Detection**: Automatic IP blocking
✅ **Daily Limits**: Max 10,000 requests/day globally
✅ **Request Logging**: All requests logged for monitoring

---

## ⚠️ Important Notes

### **Backward Compatibility**
- If `FRONTEND_API_KEY` is not set, the function will still work (for migration)
- **But this disables authentication** - set it ASAP!

### **Local Development**
- The function will work locally even without the API key
- But production requires it for security

### **Rate Limits**
- **Per IP**: 10/min, 100/hour, 500/day
- **Global**: 10,000/day maximum
- **Minimum delay**: 2 seconds between requests

### **Blocked IPs**
- IPs that exceed rate limits are blocked for 1 hour
- Blocked IPs receive 429 status with `Retry-After` header

---

## 🚨 Troubleshooting

### **Issue: "Unauthorized: Invalid API key"**

**Solution**:
1. Verify `FRONTEND_API_KEY` is set in Netlify
2. Verify `VITE_FRONTEND_API_KEY` matches in `.env`
3. Redeploy site after adding environment variables
4. Clear browser cache

### **Issue: "Forbidden: Origin not allowed"**

**Solution**:
- This is expected for unauthorized origins
- Your domain should work fine
- Check that your domain is in `ALLOWED_ORIGINS` in the function

### **Issue: "Rate limit exceeded"**

**Solution**:
- This is working as intended
- Wait for the rate limit window to reset
- Or adjust limits in the function code if needed

---

## 📊 Monitoring

### **Check Function Logs**

1. Go to **Netlify Dashboard** → **Functions** tab
2. Click `generate-image`
3. Click **Logs** tab
4. View request logs and errors

### **What to Look For**

- ✅ Successful requests (200 status)
- ⚠️ Rate limit hits (429 status)
- ❌ Blocked origins (403 status)
- ❌ Invalid API keys (401 status)

---

## 🎯 Next Steps

After setup:

1. **Monitor logs** for the first few days
2. **Adjust rate limits** if needed based on usage
3. **Review blocked IPs** to identify abuse patterns
4. **Consider Redis** for rate limiting in production (optional)

---

**Your API is now secure!** 🛡️

If you need help with any step, let me know!

