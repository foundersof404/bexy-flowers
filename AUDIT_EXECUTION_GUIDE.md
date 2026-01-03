# 🔍 Complete System Audit - Execution Guide

**Quick Reference for Running the Complete Audit**

---

## 🚀 Quick Start

### **Option 1: Automated Script (Recommended)**

#### **Linux/Mac**:
```bash
# Set environment variables
export NETLIFY_URL="https://your-domain.netlify.app"
export FRONTEND_API_KEY="your-api-key"
export FRONTEND_API_SECRET="your-api-secret"  # Optional

# Run audit
chmod +x tests/audit-runner.sh
./tests/audit-runner.sh
```

#### **Windows (PowerShell)**:
```powershell
# Set environment variables
$env:NETLIFY_URL = "https://your-domain.netlify.app"
$env:FRONTEND_API_KEY = "your-api-key"
$env:FRONTEND_API_SECRET = "your-api-secret"  # Optional

# Run audit
.\tests\audit-runner.ps1
```

---

## 📋 Pre-Audit Checklist

Before running the audit, ensure:

- [ ] **Environment Variables Set**:
  - `NETLIFY_URL` - Your Netlify site URL
  - `FRONTEND_API_KEY` - Your frontend API key
  - `FRONTEND_API_SECRET` - Optional (for request signing tests)

- [ ] **Netlify Functions Deployed**:
  - `/.netlify/functions/generate-image`
  - `/.netlify/functions/database`
  - `/.netlify/functions/health`

- [ ] **External Services Accessible**:
  - Pollinations API (via backend)
  - Supabase (via backend)
  - Redis/Upstash (optional, for distributed rate limiting)

---

## 🔧 Manual Testing (If Needed)

### **Phase 1: Environment Validation**

```bash
# Test health endpoint
curl https://your-domain.netlify.app/.netlify/functions/health

# Test CORS
curl -I -X OPTIONS https://your-domain.netlify.app/.netlify/functions/generate-image \
  -H "Origin: https://bexyflowers.shop" \
  -H "Access-Control-Request-Method: POST"
```

### **Phase 2: API Testing**

```bash
# Test image generation
curl -X POST https://your-domain.netlify.app/.netlify/functions/generate-image \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"prompt": "test", "width": 512, "height": 512}'

# Test database query
curl -X POST https://your-domain.netlify.app/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"operation": "select", "table": "collection_products", "limit": 1}'
```

### **Phase 3: Security Testing**

```bash
# Test missing API key (should fail)
curl -X POST https://your-domain.netlify.app/.netlify/functions/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'

# Test invalid API key (should fail)
curl -X POST https://your-domain.netlify.app/.netlify/functions/generate-image \
  -H "Content-Type: application/json" \
  -H "X-API-Key: invalid_key" \
  -d '{"prompt": "test"}'

# Test rate limiting (send 15 requests quickly)
for i in {1..15}; do
  curl -X POST https://your-domain.netlify.app/.netlify/functions/generate-image \
    -H "Content-Type: application/json" \
    -H "X-API-Key: YOUR_API_KEY" \
    -d "{\"prompt\": \"test $i\", \"width\": 256, \"height\": 256}"
  sleep 1
done
```

---

## 📊 Understanding Results

### **Test Results Format**

Results are saved in `test-results/`:
- **`report_TIMESTAMP.md`** - Human-readable summary
- **`results_TIMESTAMP.json`** - Detailed JSON results

### **Success Criteria**

- ✅ **All Critical Tests Pass**: Authentication, CORS, Rate Limiting
- ✅ **Pass Rate > 95%**: Excluding skipped tests
- ✅ **No Security Failures**: All security tests must pass
- ✅ **Performance Acceptable**: Response times within targets

### **Common Issues & Fixes**

1. **"Health endpoint failed"**
   - Check Netlify deployment
   - Verify function is deployed
   - Check Netlify logs

2. **"Missing API key not rejected"**
   - Verify `FRONTEND_API_KEY` is set in Netlify
   - Check function code for API key validation

3. **"Rate limiting not triggered"**
   - May need more requests
   - Check rate limit configuration
   - Verify Redis connection (if using)

4. **"Image generation failed"**
   - Check `POLLINATIONS_SECRET_KEY` in Netlify
   - Verify Pollinations API is accessible
   - Check function timeout settings

---

## 🎯 Next Steps After Audit

1. **Review Results**: Check `test-results/report_TIMESTAMP.md`
2. **Fix Failures**: Address any failed tests
3. **Re-run**: Execute audit again to verify fixes
4. **Document**: Update documentation with findings
5. **Monitor**: Set up continuous monitoring

---

## 📚 Additional Resources

- **Full Audit Plan**: See `AUDIT_PLAN.md` (if exists)
- **Security Documentation**: See `SECURITY_FINAL_EXECUTIVE_SUMMARY.md`
- **API Documentation**: See `DATABASE_PROXY_SETUP.md`

---

**Ready to audit? Run the automated script and review the results!** 🚀

