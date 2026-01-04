# 🔍 Additional Critical Tests Plan

## Current Status
✅ **Image Generation API**: Fully tested (8/9 passing)  
❌ **Database API**: **NOT TESTED YET**  
❓ **Request Signing**: Not verified  
❓ **SQL Injection Protection**: Not tested  

---

## 🎯 Critical Missing Tests

### **Priority 1: Database API Tests** 🔴

The database proxy (`/.netlify/functions/database`) is a major component that needs testing:

#### **Test 1: Database Query Operation**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{
    "operation": "select",
    "table": "your_table",
    "filters": {"status": "active"}
  }'
```

**Expected**: 200 OK with data array

---

#### **Test 2: Database Insert Operation**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{
    "operation": "insert",
    "table": "your_table",
    "data": {
      "name": "Test Record",
      "status": "active"
    }
  }'
```

**Expected**: 200 OK with inserted record

---

#### **Test 3: Database Update Operation**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{
    "operation": "update",
    "table": "your_table",
    "filters": {"id": 123},
    "data": {"status": "inactive"}
  }'
```

**Expected**: 200 OK with updated record

---

#### **Test 4: Database Delete Operation**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{
    "operation": "delete",
    "table": "your_table",
    "filters": {"id": 123}
  }'
```

**Expected**: 200 OK with success confirmation

---

#### **Test 5: Database API - Missing API Key**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{"operation": "select", "table": "test"}'
```

**Expected**: 401 Unauthorized

---

#### **Test 6: Database API - Invalid Origin**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://malicious-site.com" \
  -d '{"operation": "select", "table": "test"}'
```

**Expected**: 403 Forbidden

---

### **Priority 2: SQL Injection Protection** 🟡

#### **Test 7: SQL Injection in Table Name**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{
    "operation": "select",
    "table": "users; DROP TABLE users; --",
    "filters": {}
  }'
```

**Expected**: 400 Bad Request (invalid table name)

---

#### **Test 8: SQL Injection in Filters**
```bash
curl -X POST https://your-domain/.netlify/functions/database \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${FRONTEND_API_KEY}" \
  -H "Origin: https://bexyflowers.shop" \
  -d '{
    "operation": "select",
    "table": "users",
    "filters": {"id": "1 OR 1=1"}
  }'
```

**Expected**: Safe handling (no SQL injection, proper filtering)

---

### **Priority 3: Request Signing (If Enabled)** 🟢

#### **Test 9: Request Signing Validation**
```bash
# Check if request signing is enforced
# If ENFORCE_REQUEST_SIGNING=true, test signed requests
```

**Expected**: Signed requests accepted, unsigned rejected

---

### **Priority 4: Additional Image Generation Tests** 🟢

#### **Test 10: Different Models**
```bash
# Test each model: flux, flux-realism, flux-anime, etc.
```

#### **Test 11: Large Request Body**
```bash
# Test 1MB+ request body (should be rejected)
```

---

## 📊 Test Execution Priority

1. **🔴 CRITICAL**: Database API tests (Tests 1-6)
2. **🟡 HIGH**: SQL Injection protection (Tests 7-8)
3. **🟢 MEDIUM**: Request signing (Test 9)
4. **🟢 LOW**: Additional image generation tests (Tests 10-11)

---

## ✅ Recommendation

**Start with Database API tests** - This is a major component that hasn't been tested yet and is critical for your application functionality.

