# 🔧 DNS Resolution Issue - Fix Guide

## 🐛 **Problem**

Tests are failing with:
```
Error: The remote name could not be resolved: 'bexyflowers.shop'
```

This is a **DNS resolution issue**, not a code issue.

---

## 🔍 **Root Cause**

The domain `bexyflowers.shop` cannot be resolved by your DNS. This could mean:

1. **Custom domain not configured**: The domain might not be set up in Netlify
2. **DNS not propagated**: DNS changes might not have propagated yet
3. **Wrong domain**: You might need to use Netlify's default domain instead

---

## ✅ **Solutions**

### **Solution 1: Use Netlify Default Domain** (Recommended)

If your custom domain isn't working, use Netlify's default domain:

```powershell
# Set environment variable to Netlify default domain
$env:NETLIFY_URL = "https://bexyflowers.netlify.app"
$env:FRONTEND_API_KEY = "your-api-key"

# Run tests
.\tests\database-api-tests.ps1
```

**To find your Netlify domain**:
1. Go to Netlify Dashboard
2. Select your site
3. Check the site URL (usually `sitename.netlify.app`)

---

### **Solution 2: Configure Custom Domain**

If you want to use `bexyflowers.shop`:

1. **Go to Netlify Dashboard**:
   - Site Settings → Domain Management
   - Add custom domain: `bexyflowers.shop`

2. **Configure DNS**:
   - Add DNS records as instructed by Netlify
   - Wait for DNS propagation (can take up to 48 hours)

3. **Verify Domain**:
   ```powershell
   # Test if domain resolves
   Test-NetConnection -ComputerName "bexyflowers.shop" -Port 443
   ```

---

### **Solution 3: Check Current Domain**

Find out what domain your site is actually using:

1. **Check Netlify Dashboard**:
   - Go to your site
   - Look at the site URL shown

2. **Check Browser**:
   - Visit your live site
   - Check the URL in the address bar

3. **Use That Domain**:
   ```powershell
   $env:NETLIFY_URL = "https://actual-domain.netlify.app"
   ```

---

## 🚀 **Quick Fix (Use Netlify Domain)**

The fastest solution is to use Netlify's default domain:

```powershell
# Replace with your actual Netlify domain
$env:NETLIFY_URL = "https://bexyflowers.netlify.app"
$env:FRONTEND_API_KEY = "3917ebb25926c80e01308e15eda771ed0d707c38ca4019c771b25c2391ba4a9e"

# Run tests
.\tests\database-api-tests.ps1
```

---

## 🔍 **Verify Domain Works**

Before running tests, verify the domain is accessible:

```powershell
# Test if domain resolves
Test-NetConnection -ComputerName "bexyflowers.netlify.app" -Port 443

# Or test with curl
curl https://bexyflowers.netlify.app/.netlify/functions/health
```

---

## 📋 **Checklist**

- [ ] Identify your actual Netlify domain
- [ ] Set `NETLIFY_URL` environment variable
- [ ] Verify domain resolves (Test-NetConnection)
- [ ] Run tests again
- [ ] All tests should pass (assuming code is deployed)

---

## ⚠️ **Important Notes**

1. **Custom domains take time**: DNS propagation can take 24-48 hours
2. **Netlify default domain always works**: Use `*.netlify.app` for testing
3. **Both domains work the same**: Functions work on both custom and default domains
4. **Update CORS if needed**: If using custom domain, make sure it's in `ALLOWED_ORIGINS`

---

## ✅ **After Fix**

Once you use the correct domain, tests should work:

```powershell
# Expected output
==========================================
  Database API Tests
==========================================
Base URL: https://bexyflowers.netlify.app

[TEST] Missing API Key
  [PASS] Status: 401 (expected 401)
...
```

---

**Use your Netlify default domain for testing - it's the quickest solution!** 🚀

