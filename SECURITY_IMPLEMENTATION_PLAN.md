# 🔒 Comprehensive Security Implementation Plan

## 🚨 Current Security Issues

### **Critical Vulnerabilities:**
1. ❌ **No Rate Limiting** - Anyone can send unlimited requests
2. ❌ **No Authentication** - Endpoint is completely open
3. ❌ **CORS: Allow All Origins** - Any website can call your API
4. ❌ **No Request Validation** - No input sanitization limits
5. ❌ **No Abuse Detection** - Can't identify malicious users
6. ❌ **No Cost Protection** - Unlimited API calls = unlimited costs
7. ❌ **No Request Queuing** - Can be overwhelmed with 1000+ concurrent requests

### **Attack Scenarios:**
- **DDoS Attack**: Send 1000+ requests simultaneously
- **Cost Attack**: Generate thousands of images to exhaust API credits
- **Abuse**: Scrape your API for free image generation
- **Origin Hijacking**: Any website can use your API

---

## 🛡️ Security Implementation Strategy

### **Phase 1: Rate Limiting (CRITICAL - Implement First)**

#### 1.1 IP-Based Rate Limiting
**Goal**: Limit requests per IP address

**Implementation**:
- Use in-memory store (or Redis) to track requests per IP
- Limit: 10 requests per minute per IP
- Limit: 100 requests per hour per IP
- Limit: 500 requests per day per IP

**Code Structure**:
```typescript
// Rate limit store (in-memory or Redis)
const rateLimitStore = new Map<string, {
  requests: number[],
  blocked: boolean,
  blockUntil: number
}>();

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean, retryAfter?: number } {
  // Implementation
}
```

#### 1.2 Request Throttling
**Goal**: Prevent burst attacks

**Implementation**:
- Minimum 2 seconds between requests from same IP
- Queue requests if too many pending
- Reject if queue is full

#### 1.3 Concurrent Request Limiting
**Goal**: Prevent 1000+ simultaneous requests

**Implementation**:
- Max 3 concurrent requests per IP
- Max 50 total concurrent requests globally
- Reject excess requests with 429 status

---

### **Phase 2: Authentication & Authorization**

#### 2.1 Frontend API Key
**Goal**: Only your frontend can call the API

**Implementation**:
1. Generate a public API key for your frontend
2. Store in environment variable: `FRONTEND_API_KEY`
3. Frontend sends key in header: `X-API-Key`
4. Server validates key before processing

**Frontend Changes**:
```typescript
// Add API key to requests
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': import.meta.env.VITE_FRONTEND_API_KEY
}
```

**Server Validation**:
```typescript
const frontendApiKey = process.env.FRONTEND_API_KEY;
const providedKey = event.headers['x-api-key'];

if (providedKey !== frontendApiKey) {
  return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
}
```

#### 2.2 Origin Validation
**Goal**: Only allow requests from your domain

**Implementation**:
- Check `Origin` or `Referer` header
- Whitelist: `bexyflowers.shop`, `www.bexyflowers.shop`
- Reject all other origins

**Code**:
```typescript
const allowedOrigins = [
  'https://bexyflowers.shop',
  'https://www.bexyflowers.shop',
  'http://localhost:5173', // Dev only
];

const origin = event.headers.origin || event.headers.referer;
if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
  return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden origin' }) };
}
```

---

### **Phase 3: CORS Security**

#### 3.1 Restrict CORS
**Current**: `'Access-Control-Allow-Origin': '*'` (ALLOWS EVERYONE)
**Fix**: Only allow your domain

**Implementation**:
```typescript
const origin = event.headers.origin;
const allowedOrigins = [
  'https://bexyflowers.shop',
  'https://www.bexyflowers.shop',
  'http://localhost:5173', // Dev only
];

const headers = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
```

---

### **Phase 4: Input Validation & Sanitization**

#### 4.1 Prompt Validation
**Goal**: Prevent malicious or excessive prompts

**Implementation**:
- Max prompt length: 1000 characters
- Min prompt length: 10 characters
- Block suspicious patterns (SQL injection, XSS attempts)
- Sanitize special characters

**Code**:
```typescript
function validatePrompt(prompt: string): { valid: boolean, error?: string } {
  if (!prompt || prompt.length < 10) {
    return { valid: false, error: 'Prompt too short' };
  }
  if (prompt.length > 1000) {
    return { valid: false, error: 'Prompt too long' };
  }
  // Block suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
  ];
  if (suspiciousPatterns.some(pattern => pattern.test(prompt))) {
    return { valid: false, error: 'Invalid prompt content' };
  }
  return { valid: true };
}
```

#### 4.2 Parameter Validation
**Goal**: Prevent resource exhaustion

**Implementation**:
- Width/Height: Min 256, Max 2048
- Model: Whitelist only allowed models
- Reject invalid parameters

**Code**:
```typescript
function validateParameters(width: number, height: number, model: string) {
  if (width < 256 || width > 2048 || height < 256 || height > 2048) {
    return { valid: false, error: 'Invalid dimensions' };
  }
  const allowedModels = ['flux', 'flux-realism', 'turbo'];
  if (!allowedModels.includes(model)) {
    return { valid: false, error: 'Invalid model' };
  }
  return { valid: true };
}
```

---

### **Phase 5: Abuse Detection & Blocking**

#### 5.1 Pattern Detection
**Goal**: Identify abusive behavior

**Implementation**:
- Track request patterns per IP
- Detect rapid-fire requests (10+ in 1 second)
- Detect repeated identical prompts
- Flag suspicious activity

**Code**:
```typescript
interface RequestLog {
  ip: string;
  timestamp: number;
  prompt: string;
  userAgent?: string;
}

function detectAbuse(logs: RequestLog[]): boolean {
  // Check for rapid-fire requests
  const recentRequests = logs.filter(log => 
    Date.now() - log.timestamp < 1000
  );
  if (recentRequests.length > 10) return true;
  
  // Check for identical prompts
  const promptCounts = new Map<string, number>();
  logs.forEach(log => {
    promptCounts.set(log.prompt, (promptCounts.get(log.prompt) || 0) + 1);
  });
  if (Array.from(promptCounts.values()).some(count => count > 20)) return true;
  
  return false;
}
```

#### 5.2 Automatic Blocking
**Goal**: Block abusive IPs automatically

**Implementation**:
- Temporary block: 1 hour for first offense
- Extended block: 24 hours for repeat offenses
- Permanent block: After 3 offenses (store in database)

**Code**:
```typescript
function blockIP(ip: string, duration: number) {
  rateLimitStore.set(ip, {
    requests: [],
    blocked: true,
    blockUntil: Date.now() + duration
  });
}
```

---

### **Phase 6: Cost Protection**

#### 6.1 Daily Request Limits
**Goal**: Prevent unlimited API costs

**Implementation**:
- Global daily limit: 10,000 requests
- Per-IP daily limit: 100 requests
- Track usage and reject when limit reached

**Code**:
```typescript
let globalDailyRequests = 0;
const MAX_DAILY_REQUESTS = 10000;

function checkDailyLimit(): boolean {
  if (globalDailyRequests >= MAX_DAILY_REQUESTS) {
    return false;
  }
  globalDailyRequests++;
  return true;
}
```

#### 6.2 Request Cost Estimation
**Goal**: Monitor API costs

**Implementation**:
- Track each request
- Estimate cost per request
- Alert when approaching budget limit

---

### **Phase 7: Monitoring & Logging**

#### 7.1 Request Logging
**Goal**: Track all requests for analysis

**Implementation**:
- Log: IP, timestamp, prompt length, model, response time
- Store in structured format
- Don't log full prompts (privacy)

**Code**:
```typescript
function logRequest(event: HandlerEvent, responseTime: number, success: boolean) {
  const log = {
    ip: event.headers['x-forwarded-for'] || 'unknown',
    timestamp: new Date().toISOString(),
    method: event.httpMethod,
    promptLength: event.body ? JSON.parse(event.body).prompt?.length : 0,
    responseTime,
    success,
    statusCode: success ? 200 : 500,
  };
  console.log('[Request Log]', JSON.stringify(log));
}
```

#### 7.2 Alert System
**Goal**: Get notified of abuse

**Implementation**:
- Alert when rate limit exceeded
- Alert when daily limit reached
- Alert when suspicious activity detected
- Send to email/webhook

---

### **Phase 8: Request Queuing**

#### 8.1 Queue Management
**Goal**: Handle high traffic gracefully

**Implementation**:
- Queue requests if too many concurrent
- Process queue with rate limiting
- Reject if queue is full (100+ pending)

**Code**:
```typescript
const requestQueue: Array<() => Promise<void>> = [];
const MAX_QUEUE_SIZE = 100;
let processing = false;

async function processQueue() {
  if (processing || requestQueue.length === 0) return;
  processing = true;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) await request();
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
  }
  processing = false;
}
```

---

## 📋 Implementation Priority

### **🔴 CRITICAL (Implement Immediately)**
1. ✅ Rate limiting per IP (10/min, 100/hour)
2. ✅ CORS restriction (only your domain)
3. ✅ Frontend API key authentication
4. ✅ Input validation (prompt length, parameters)

### **🟡 HIGH PRIORITY (Implement This Week)**
5. ✅ Abuse detection
6. ✅ Automatic IP blocking
7. ✅ Daily request limits
8. ✅ Request logging

### **🟢 MEDIUM PRIORITY (Implement This Month)**
9. ✅ Request queuing
10. ✅ Cost monitoring
11. ✅ Alert system
12. ✅ Advanced pattern detection

---

## 🚀 Quick Start Implementation

### **Step 1: Add Rate Limiting (5 minutes)**
Add basic IP-based rate limiting to function

### **Step 2: Add API Key (5 minutes)**
Add frontend API key validation

### **Step 3: Fix CORS (2 minutes)**
Restrict CORS to your domain only

### **Step 4: Add Input Validation (5 minutes)**
Validate prompts and parameters

**Total Time**: ~20 minutes for critical security fixes

---

## 📊 Expected Results

### **Before Security:**
- ❌ Unlimited requests per IP
- ❌ Any origin can call API
- ❌ No authentication
- ❌ Vulnerable to DDoS
- ❌ Unlimited costs

### **After Security:**
- ✅ 10 requests/min per IP
- ✅ Only your domain allowed
- ✅ API key required
- ✅ Protected from DDoS
- ✅ Cost-controlled (10k/day max)

---

## 🔧 Next Steps

1. **Review this plan** - Understand all security measures
2. **Prioritize** - Decide which phases to implement first
3. **Implement** - Start with critical fixes
4. **Test** - Verify security measures work
5. **Monitor** - Watch for abuse attempts
6. **Iterate** - Adjust limits based on usage

---

**Ready to implement? Let me know which phase you want to start with!** 🛡️

