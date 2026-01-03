# 🚀 Enterprise Security - Quick Start Guide

## ⚡ 5-Minute Setup

### **Step 1: Generate Secrets** (1 minute)

```bash
# Generate FRONTEND_API_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save the output** - you'll need it in steps 2 and 3.

---

### **Step 2: Add to Netlify** (2 minutes)

1. Go to **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Add:
   - **Key**: `FRONTEND_API_SECRET`
   - **Value**: `[your generated secret from Step 1]`
   - **Scopes**: Production, Deploy previews, Branch deploys
4. Click **Save**

**Optional (for distributed rate limiting)**:
- **Key**: `UPSTASH_REDIS_REST_URL`
- **Value**: `[from Upstash dashboard]`
- **Key**: `UPSTASH_REDIS_REST_TOKEN`
- **Value**: `[from Upstash dashboard]`

---

### **Step 3: Add to Local .env** (1 minute)

Add to your `.env` file:

```env
VITE_FRONTEND_API_SECRET=your_generated_secret_here
```

**Important**: Use the **same secret** as in Netlify!

---

### **Step 4: Replace Function** (1 minute)

```bash
# Backup current function
mv netlify/functions/generate-image.ts netlify/functions/generate-image-backup.ts

# Use enterprise version
mv netlify/functions/generate-image-enterprise.ts netlify/functions/generate-image.ts
```

---

### **Step 5: Redeploy** (1 minute)

1. **Netlify Dashboard** → **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**

**OR** push a commit to trigger automatic deployment.

---

## ✅ Verification

After deployment, test:

1. **Generate image** - Should work normally
2. **Check console** - Should see signed requests
3. **Try replay** - Same request twice should fail (replay protection)
4. **Check rate limit** - 11 requests in 1 minute, 11th should fail

---

## 🎯 What You Get

✅ **Request Signing** - HMAC-based authentication  
✅ **Replay Protection** - Nonce + timestamp validation  
✅ **Circuit Breaker** - Automatic failure protection  
✅ **Enhanced Security** - Multiple layers of protection  
✅ **Security Logging** - All events logged  

---

**That's it! Your API is now enterprise-grade secure!** 🛡️

For detailed information, see `ENTERPRISE_SECURITY_IMPLEMENTATION.md`

