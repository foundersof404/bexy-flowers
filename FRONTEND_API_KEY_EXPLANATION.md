# 🔑 FRONTEND_API_KEY - Role & Purpose

## 🎯 What is FRONTEND_API_KEY?

`FRONTEND_API_KEY` is a **shared secret** between your frontend (website) and your backend (Netlify function). It acts like a **password** that proves requests are coming from your legitimate website, not from attackers or unauthorized users.

---

## 🛡️ Why Do We Need It?

### **The Problem (Without API Key):**

**Before security fix:**
```
❌ Anyone can call your API:
   - Attacker's website → Your API → Unlimited requests
   - Postman/curl → Your API → Generate 1000 images
   - Bot scripts → Your API → DDoS attack
   - Competitor → Your API → Steal your service
```

**Your API endpoint is public:**
- `https://bexyflowers.shop/.netlify/functions/generate-image`
- Anyone who knows this URL can call it
- No way to verify if request is legitimate

### **The Solution (With API Key):**

**After security fix:**
```
✅ Only your frontend can call your API:
   - Your website → Includes API key → ✅ Allowed
   - Attacker's website → No API key → ❌ Blocked (401 Unauthorized)
   - Postman/curl → No API key → ❌ Blocked
   - Bot scripts → No API key → ❌ Blocked
```

---

## 🔄 How It Works

### **Step 1: Frontend Sends Request**

Your website (frontend) includes the API key in the request header:

```typescript
// Frontend code (imageGeneration.ts)
fetch('/.netlify/functions/generate-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-secret-key-here'  // ← API key sent here
  },
  body: JSON.stringify({ prompt: '...' })
})
```

### **Step 2: Server Validates Key**

Your Netlify function checks if the key matches:

```typescript
// Server code (generate-image.ts)
const frontendApiKey = process.env.FRONTEND_API_KEY;  // From Netlify env vars
const providedKey = event.headers['x-api-key'];      // From request

if (providedKey !== frontendApiKey) {
  return { statusCode: 401, error: 'Unauthorized' };  // ❌ Blocked
}

// Key matches → ✅ Allow request
```

### **Step 3: Request Processed or Blocked**

- ✅ **Key matches** → Request processed, image generated
- ❌ **Key missing/wrong** → 401 Unauthorized, request rejected

---

## 🔐 Security Benefits

### **1. Prevents Unauthorized Access**

**Without API Key:**
```
Attacker's Website:
  fetch('https://bexyflowers.shop/.netlify/functions/generate-image', {
    body: { prompt: 'generate 1000 images' }
  })
  → ✅ Works! (No protection)
```

**With API Key:**
```
Attacker's Website:
  fetch('https://bexyflowers.shop/.netlify/functions/generate-image', {
    headers: { 'X-API-Key': 'wrong-key' },
    body: { prompt: 'generate 1000 images' }
  })
  → ❌ 401 Unauthorized (Blocked!)
```

### **2. Protects Against Scraping**

**Without API Key:**
- Anyone can scrape your API
- Competitors can use your service for free
- Bots can abuse your endpoint

**With API Key:**
- Only your frontend has the key
- Key is in environment variable (not in Git)
- Attackers can't get the key easily

### **3. Works with Rate Limiting**

The API key works **together** with rate limiting:

```
Request Flow:
1. Check API key → ✅ Valid
2. Check rate limit → ✅ Under limit
3. Process request → ✅ Generate image

OR

1. Check API key → ❌ Invalid
2. Reject immediately → ❌ 401 Unauthorized (No rate limit check needed)
```

---

## 📋 Key Characteristics

### **✅ Safe to Expose in Frontend**

**Why it's safe:**
- It's a **public** key (not secret like `POLLINATIONS_SECRET_KEY`)
- It's visible in browser DevTools (anyone can see it)
- It's in your frontend code (bundled in JavaScript)

**But it still works because:**
- Only your website uses it
- Attackers can't easily find it (it's in environment variable)
- Even if they find it, they can only use it from your domain (CORS protection)
- Rate limiting still applies

### **🔒 Different from Secret Key**

| Key Type | Purpose | Where Used | Visibility |
|----------|---------|------------|------------|
| **FRONTEND_API_KEY** | Authenticate frontend requests | Frontend → Backend | Public (in browser) |
| **POLLINATIONS_SECRET_KEY** | Call Pollinations API | Backend → Pollinations | Secret (server-only) |

**Important**: 
- `FRONTEND_API_KEY` = Public key (safe in frontend)
- `POLLINATIONS_SECRET_KEY` = Secret key (NEVER in frontend!)

---

## 🎯 Real-World Example

### **Scenario: Attacker Tries to Abuse Your API**

**Without API Key:**
```javascript
// Attacker's script
for (let i = 0; i < 1000; i++) {
  fetch('https://bexyflowers.shop/.netlify/functions/generate-image', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'image ' + i })
  });
}
// ✅ All 1000 requests succeed (no protection)
```

**With API Key:**
```javascript
// Attacker's script
for (let i = 0; i < 1000; i++) {
  fetch('https://bexyflowers.shop/.netlify/functions/generate-image', {
    method: 'POST',
    headers: { 'X-API-Key': '???' },  // ← Doesn't know the key!
    body: JSON.stringify({ prompt: 'image ' + i })
  });
}
// ❌ All 1000 requests fail with 401 Unauthorized
```

---

## 🔧 How It's Configured

### **1. Generate a Random Key**

```bash
# Generate secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### **2. Store in Netlify (Backend)**

```
Netlify Dashboard → Environment Variables:
  FRONTEND_API_KEY = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### **3. Store in .env (Frontend)**

```env
# .env file
VITE_FRONTEND_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Note**: The `VITE_` prefix makes it available in frontend code via `import.meta.env.VITE_FRONTEND_API_KEY`

---

## ⚠️ Important Notes

### **1. It's Not Perfect Security**

**Limitations:**
- Key is visible in browser DevTools
- Anyone can inspect your website's JavaScript
- Determined attackers can extract it

**But it's still effective because:**
- Most attackers won't bother
- CORS protection adds another layer
- Rate limiting still applies
- It's a **first line of defense**, not the only defense

### **2. Works Best with Other Security**

The API key is **one layer** of security. It works best with:

- ✅ **CORS restriction** (only your domain)
- ✅ **Rate limiting** (prevent abuse)
- ✅ **Input validation** (prevent malicious prompts)
- ✅ **IP blocking** (block abusive IPs)

### **3. Backward Compatibility**

The function will still work **without** the API key (for migration), but:
- ⚠️ Authentication is disabled
- ⚠️ Less secure
- ⚠️ Should be set ASAP

---

## 📊 Summary

**FRONTEND_API_KEY Role:**
- 🔑 **Authentication**: Proves request is from your frontend
- 🛡️ **Access Control**: Blocks unauthorized requests
- 🚫 **Abuse Prevention**: Prevents random attackers from using your API
- ✅ **First Line of Defense**: Works with other security measures

**Think of it as:**
- A **password** that your frontend uses to access your API
- A **badge** that identifies legitimate requests
- A **gatekeeper** that blocks unauthorized access

**It's not perfect, but it's essential for basic API security!** 🛡️

