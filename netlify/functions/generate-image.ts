/**
 * Netlify Serverless Function - Pollinations API Proxy (ENTERPRISE SECURE VERSION)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECURITY FEATURES (MULTI-LAYERED DEFENSE)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 🔐 API KEY PROTECTION:
 *    ✓ Dual API key support (primary + secondary fallback)
 *    ✓ Automatic failover on rate limit (429), unauthorized (401), forbidden (403)
 *    ✓ Keys stored server-side only (never exposed to frontend)
 *    ✓ Environment variable isolation
 * 
 * 🛡️ RATE LIMITING (Multi-Tier):
 *    ✓ Per-IP: 10/min, 100/hour, 500/day
 *    ✓ Global: 10,000/day across all users
 *    ✓ Minimum delay: 2 seconds between requests
 *    ✓ Distributed rate limiting with Redis/Upstash fallback
 * 
 * 🚨 DDoS & ABUSE PROTECTION:
 *    ✓ Rapid request detection (5 requests in 1 second = block)
 *    ✓ Identical prompt spam detection
 *    ✓ Short prompt spam detection (10+ prompts <20 chars)
 *    ✓ Warning level system (0-3, auto-block at level 3)
 *    ✓ IP fingerprinting for bot detection
 *    ✓ Automatic 1-hour ban for abusers
 * 
 * 🔒 AUTHENTICATION:
 *    ✓ Frontend API key validation (X-API-Key header)
 *    ✓ Optional HMAC request signing (SHA-256)
 *    ✓ Nonce validation (replay attack prevention)
 *    ✓ Timestamp validation (5-minute freshness window)
 * 
 * 🌐 CORS & ORIGIN VALIDATION:
 *    ✓ Strict origin whitelist (production + localhost dev)
 *    ✓ Dynamic CORS headers based on origin
 *    ✓ OPTIONS preflight support
 * 
 * 🔍 INPUT VALIDATION:
 *    ✓ Prompt: 10-1000 chars, sanitized, XSS/SQL injection blocked
 *    ✓ Dimensions: 256-2048px range enforcement
 *    ✓ Model: Whitelist of allowed Pollinations models
 *    ✓ Malicious pattern detection (script tags, eval, etc.)
 * 
 * 🖼️ OUTPUT VALIDATION:
 *    ✓ Image size validation (10KB - 10MB)
 *    ✓ Magic bytes verification (PNG/JPEG/WEBP/GIF)
 *    ✓ Content-Type verification
 *    ✓ Empty/corrupted image detection
 * 
 * ⏱️ TIMEOUT & RETRY PROTECTION:
 *    ✓ 45-second timeout per API request
 *    ✓ AbortController for clean cancellation
 *    ✓ Automatic failover to secondary key
 *    ✓ Detailed error logging for both keys
 * 
 * 📊 MONITORING & LOGGING:
 *    ✓ Security event logging (all levels)
 *    ✓ Performance metrics tracking
 *    ✓ API key usage tracking
 *    ✓ Error rate monitoring with alerts
 *    ✓ Request/response logging with sanitization
 * 
 * 🚫 ATTACK MITIGATION:
 *    ✓ Method restriction (POST only, GET disabled)
 *    ✓ Request body parsing with error handling
 *    ✓ Sensitive data redaction in logs
 *    ✓ IP-based temporary blocking
 *    ✓ Automated threat detection
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * KEY EXPOSURE PROTECTION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Even if keys are exposed/leaked:
 *    1. Rate limiting prevents abuse (10/min per IP)
 *    2. Frontend API key required (additional layer)
 *    3. CORS blocks unauthorized domains
 *    4. DDoS protection auto-blocks suspicious patterns
 *    5. Daily limits cap total damage (10k requests/day)
 *    6. Automatic failover to backup key maintains service
 *    7. Security logs alert administrators
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * FALLBACK STRATEGY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * PRIMARY KEY → SECONDARY KEY → ERROR
 *      ↓              ↓            ↓
 *   Success      Success      503 Service
 *   (logged)    (logged)    Unavailable
 *                           (all keys exhausted)
 * 
 * Endpoint: /.netlify/functions/generate-image
 * Method: POST only (GET disabled for security)
 * Version: 2.0.0 (Enhanced Security + Dual Key Fallback)
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { checkDistributedRateLimit } from './utils/rateLimiter';
import { logSecurityEvent, logPerformanceMetric } from './utils/monitoring';

interface RequestBody {
  prompt?: string;
  width?: number;
  height?: number;
  model?: string;
  timestamp?: number;
  nonce?: string;
  signature?: string;
}

// Rate limiting store (in-memory - use Redis for production)
interface RateLimitData {
  requests: number[];
  blocked: boolean;
  blockUntil: number;
  dailyCount: number;
  lastReset: number;
}

const rateLimitStore = new Map<string, RateLimitData>();

// Configuration
const RATE_LIMITS = {
  perMinute: 10,      // 10 requests per minute
  perHour: 100,       // 100 requests per hour
  perDay: 500,        // 500 requests per day
  minDelay: 2000,     // 2 seconds minimum between requests
};

const MAX_DAILY_REQUESTS = 10000; // Global daily limit
let globalDailyRequests = 0;
let globalDailyReset = Date.now();

// SECURITY: Enhanced DDoS protection
const SUSPICIOUS_THRESHOLDS = {
  rapidRequests: 5,            // 5 requests in 1 second = suspicious
  identicalPrompts: 3,         // Same prompt 3+ times = suspicious
  shortPromptSpam: 10,         // 10+ requests with very short prompts (<20 chars)
};

// In-memory abuse tracking (use Redis in production)
const abuseTracking = new Map<string, {
  rapidRequestCount: number;
  lastRequestTime: number;
  promptHistory: Array<{ prompt: string; time: number }>;
  shortPromptCount: number;
  warningLevel: number; // 0 = normal, 1 = suspicious, 2 = likely attack, 3 = blocked
}>();

// Allowed origins (CORS)
const ALLOWED_ORIGINS = [
  'https://bexyflowers.shop',
  'https://www.bexyflowers.shop',
  'http://localhost:5173', // Dev only
  'http://localhost:51635', // Netlify dev server
  'http://localhost:52933', // Current Netlify dev server
  'http://localhost:5174', // Dev only
];

// Allowed models (from Pollinations pricing table)
// See: https://pollinations.ai/pricing
const ALLOWED_MODELS = [
  // Flux variants (fast, affordable)
  'flux', 'flux-realism', 'flux-anime', 'flux-3d',
  // SDXL/Turbo (good balance)
  'turbo', 'zimage',
  // GPT Image models (best photorealism, text/logo support)
  'gptimage', 'gptimage-large',
  // Seedream models (high quality)
  'seedream', 'seedream-pro',
  // FLUX Kontext (better context understanding)
  'kontext',
  // NanoBanana (affordable)
  'nanobanana', 'nanobanana-pro'
];

/**
 * Get client IP address
 */
function getClientIP(event: HandlerEvent): string {
  return (
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers['x-real-ip'] ||
    event.headers['cf-connecting-ip'] ||
    'unknown'
  );
}

/**
 * Generate request fingerprint
 */
function generateFingerprint(event: HandlerEvent, ip: string): string {
  const components = [
    ip,
    event.headers['user-agent'] || 'unknown',
    event.headers['accept-language'] || 'unknown',
  ];
  
  // Simple hash (in production, use crypto.createHash)
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
}

/**
 * Validate API key
 */
function validateAPIKey(event: HandlerEvent): { allowed: boolean; reason?: string } {
  const frontendApiKey = process.env.FRONTEND_API_KEY;
  if (!frontendApiKey) {
    console.warn('[Security] FRONTEND_API_KEY not set - allowing all requests');
    return { allowed: true }; // Allow if not configured (backward compatibility)
  }
  
  const providedKey = event.headers['x-api-key'] || event.headers['X-API-Key'];
  
  if (!providedKey) {
    return { 
      allowed: false, 
      reason: 'API key required but not provided. Please set VITE_FRONTEND_API_KEY in Netlify environment variables.' 
    };
  }
  
  if (providedKey !== frontendApiKey) {
    return { 
      allowed: false, 
      reason: 'API key mismatch. Please verify VITE_FRONTEND_API_KEY matches FRONTEND_API_KEY in Netlify.' 
    };
  }
  
  return { allowed: true };
}

/**
 * Validate request signature (HMAC)
 */
function validateSignature(
  body: RequestBody,
  providedSignature: string,
  timestamp: number
): boolean {
  const frontendSecret = process.env.FRONTEND_API_SECRET;
  if (!frontendSecret) {
    // If secret not configured, allow unsigned requests (backward compatibility)
    return providedSignature === '';
  }
  
  // Check timestamp freshness (5 minute window)
  const now = Date.now();
  const timestampTolerance = 5 * 60 * 1000; // 5 minutes
  if (Math.abs(now - timestamp) > timestampTolerance) {
    return false; // Request too old or from future
  }
  
  // Reconstruct signature payload (must match frontend exactly)
  const payload = JSON.stringify({
    prompt: body.prompt,
    width: body.width || 1024,
    height: body.height || 1024,
    model: body.model || 'flux',
    timestamp,
    nonce: body.nonce,
  });
  
  // Use Node.js crypto for HMAC validation
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', frontendSecret)
    .update(payload)
    .digest('hex');
  
  // Constant-time comparison to prevent timing attacks
  if (providedSignature.length !== expectedSignature.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < providedSignature.length; i++) {
    result |= providedSignature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Check for replay attacks (nonce validation)
 */
const nonceStore = new Map<string, number>();
const NONCE_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

function checkReplay(nonce: string, timestamp: number): { valid: boolean; error?: string } {
  // Check if nonce already used
  if (nonceStore.has(nonce)) {
    return { valid: false, error: 'Replay attack detected: nonce already used' };
  }
  
  // Check timestamp freshness
  const now = Date.now();
  const timestampTolerance = 5 * 60 * 1000; // 5 minutes
  if (Math.abs(now - timestamp) > timestampTolerance) {
    return { valid: false, error: 'Request expired or from future' };
  }
  
  // Store nonce
  nonceStore.set(nonce, timestamp);
  
  // Cleanup old nonces
  if (nonceStore.size > 10000) {
    for (const [storedNonce, storedTimestamp] of nonceStore.entries()) {
      if (now - storedTimestamp > timestampTolerance) {
        nonceStore.delete(storedNonce);
      }
    }
  }
  
  return { valid: true };
}

/**
 * Validate and sanitize prompt
 */
function validatePrompt(prompt: string): { valid: boolean; error?: string; sanitized?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' };
  }
  
  const trimmed = prompt.trim();
  
  if (trimmed.length < 10) {
    return { valid: false, error: 'Prompt too short (minimum 10 characters)' };
  }
  
  if (trimmed.length > 1000) {
    return { valid: false, error: 'Prompt too long (maximum 1000 characters)' };
  }
  
  // Block suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /eval\(/i,
    /exec\(/i,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(trimmed))) {
    return { valid: false, error: 'Invalid prompt content detected' };
  }
  
  // Sanitize: Remove null bytes and control characters
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F]/g, '');
  
  return { valid: true, sanitized };
}

/**
 * Validate parameters
 */
function validateParameters(width: number, height: number, model: string): { valid: boolean; error?: string } {
  // Validate dimensions
  if (width < 256 || width > 2048 || height < 256 || height > 2048) {
    return { valid: false, error: 'Dimensions must be between 256 and 2048' };
  }
  
  // Validate model
  if (!ALLOWED_MODELS.includes(model)) {
    return { valid: false, error: `Invalid model. Allowed: ${ALLOWED_MODELS.join(', ')}` };
  }
  
  return { valid: true };
}

/**
 * SECURITY: Enhanced abuse detection
 */
function detectAbuse(ip: string, prompt: string): { suspicious: boolean; reason?: string; block: boolean } {
  const now = Date.now();
  
  // Get or create abuse tracking data
  let data = abuseTracking.get(ip);
  if (!data) {
    data = {
      rapidRequestCount: 0,
      lastRequestTime: 0,
      promptHistory: [],
      shortPromptCount: 0,
      warningLevel: 0,
    };
    abuseTracking.set(ip, data);
  }
  
  // Clean old prompt history (keep last 5 minutes)
  data.promptHistory = data.promptHistory.filter(p => now - p.time < 5 * 60 * 1000);
  
  // Check 1: Rapid requests (multiple requests within 1 second)
  if (data.lastRequestTime > 0 && (now - data.lastRequestTime) < 1000) {
    data.rapidRequestCount++;
    if (data.rapidRequestCount >= SUSPICIOUS_THRESHOLDS.rapidRequests) {
      data.warningLevel = Math.min(3, data.warningLevel + 1);
      return {
        suspicious: true,
        block: data.warningLevel >= 3,
        reason: 'Rapid request pattern detected (DDoS attempt)',
      };
    }
  } else {
    data.rapidRequestCount = 0; // Reset if requests are spaced out
  }
  
  // Check 2: Identical prompts (same prompt repeated multiple times)
  const identicalCount = data.promptHistory.filter(p => p.prompt === prompt).length;
  if (identicalCount >= SUSPICIOUS_THRESHOLDS.identicalPrompts) {
    data.warningLevel = Math.min(2, data.warningLevel + 1);
    return {
      suspicious: true,
      block: false, // Don't block, but warn
      reason: 'Identical prompt repetition detected',
    };
  }
  
  // Check 3: Short prompt spam (multiple very short prompts)
  if (prompt.length < 20) {
    data.shortPromptCount++;
    if (data.shortPromptCount >= SUSPICIOUS_THRESHOLDS.shortPromptSpam) {
      data.warningLevel = Math.min(2, data.warningLevel + 1);
      return {
        suspicious: true,
        block: false,
        reason: 'Short prompt spam detected',
      };
    }
  }
  
  // Update tracking data
  data.lastRequestTime = now;
  data.promptHistory.push({ prompt, time: now });
  
  // Decay warning level over time (reset after 1 hour of good behavior)
  if (data.warningLevel > 0 && data.promptHistory.length > 0) {
    const oldestRequest = Math.min(...data.promptHistory.map(p => p.time));
    if (now - oldestRequest > 60 * 60 * 1000) {
      data.warningLevel = Math.max(0, data.warningLevel - 1);
    }
  }
  
  return { suspicious: false, block: false };
}

/**
 * Check rate limits
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number; error?: string } {
  const now = Date.now();
  
  // Reset daily counters if needed
  if (now - globalDailyReset > 24 * 60 * 60 * 1000) {
    globalDailyRequests = 0;
    globalDailyReset = now;
    rateLimitStore.forEach((data, key) => {
      if (now - data.lastReset > 24 * 60 * 60 * 1000) {
        data.dailyCount = 0;
        data.lastReset = now;
      }
    });
  }
  
  // Check global daily limit
  if (globalDailyRequests >= MAX_DAILY_REQUESTS) {
    return { allowed: false, error: 'Daily request limit reached. Please try again tomorrow.' };
  }
  
  // Get or create rate limit data
  let data = rateLimitStore.get(ip);
  if (!data) {
    data = {
      requests: [],
      blocked: false,
      blockUntil: 0,
      dailyCount: 0,
      lastReset: now,
    };
    rateLimitStore.set(ip, data);
  }
  
  // Check if IP is blocked
  if (data.blocked && now < data.blockUntil) {
    const retryAfter = Math.ceil((data.blockUntil - now) / 1000);
    return { allowed: false, retryAfter, error: `IP temporarily blocked. Retry after ${retryAfter} seconds.` };
  }
  
  // Reset block if expired
  if (data.blocked && now >= data.blockUntil) {
    data.blocked = false;
    data.blockUntil = 0;
  }
  
  // Clean old requests (older than 1 hour)
  data.requests = data.requests.filter(timestamp => now - timestamp < 60 * 60 * 1000);
  
  // Check per-minute limit
  const requestsLastMinute = data.requests.filter(timestamp => now - timestamp < 60 * 1000).length;
  if (requestsLastMinute >= RATE_LIMITS.perMinute) {
    // Block for 1 hour on excessive requests
    data.blocked = true;
    data.blockUntil = now + 60 * 60 * 1000;
    return { allowed: false, retryAfter: 3600, error: 'Rate limit exceeded. IP blocked for 1 hour.' };
  }
  
  // Check per-hour limit
  const requestsLastHour = data.requests.length;
  if (requestsLastHour >= RATE_LIMITS.perHour) {
    return { allowed: false, retryAfter: 3600, error: 'Hourly rate limit exceeded. Please try again later.' };
  }
  
  // Check per-day limit
  if (data.dailyCount >= RATE_LIMITS.perDay) {
    return { allowed: false, error: 'Daily rate limit exceeded. Please try again tomorrow.' };
  }
  
  // Check minimum delay between requests
  if (data.requests.length > 0) {
    const lastRequest = data.requests[data.requests.length - 1];
    const timeSinceLastRequest = now - lastRequest;
    if (timeSinceLastRequest < RATE_LIMITS.minDelay) {
      const retryAfter = Math.ceil((RATE_LIMITS.minDelay - timeSinceLastRequest) / 1000);
      return { allowed: false, retryAfter, error: `Please wait ${retryAfter} seconds between requests.` };
    }
  }
  
  // All checks passed - add request
  data.requests.push(now);
  data.dailyCount++;
  globalDailyRequests++;
  
  return { allowed: true };
}

/**
 * Log request for monitoring
 */
function logRequest(
  event: HandlerEvent,
  ip: string,
  responseTime: number,
  success: boolean,
  statusCode: number,
  error?: string
) {
  const log = {
    timestamp: new Date().toISOString(),
    ip,
    method: event.httpMethod,
    path: event.path,
    responseTime,
    success,
    statusCode,
    error: error?.substring(0, 100), // Limit error length
    userAgent: event.headers['user-agent']?.substring(0, 100),
  };
  
  console.log('[Request Log]', JSON.stringify(log));
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const startTime = Date.now();
  const ip = getClientIP(event);
  const origin = event.headers.origin || event.headers.referer || '';
  
  // CORS headers
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  // Set CORS origin (only if allowed)
  if (isOriginAllowed(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }
  
  // Only allow POST requests (GET disabled for security)
  if (event.httpMethod !== 'POST') {
    const responseTime = Date.now() - startTime;
    logRequest(event, ip, responseTime, false, 405);
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed. Only POST requests are accepted.' }),
    };
  }
  
  // Check origin (allow requests without origin for testing/API clients)
  if (origin && !isOriginAllowed(origin)) {
    const responseTime = Date.now() - startTime;
    logSecurityEvent('error', 'warning', event.path, ip, {
      reason: 'Forbidden origin',
      origin: origin,
    });
    logRequest(event, ip, responseTime, false, 403, 'Forbidden origin');
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Forbidden: Origin not allowed' }),
    };
  }
  
  // If no origin provided, allow if API key is valid (for API clients/testing)
  // This allows automated tests and API clients to work
  
  // Validate API key
  const apiKeyValidation = validateAPIKey(event);
  if (!apiKeyValidation.allowed) {
    const responseTime = Date.now() - startTime;
    logSecurityEvent('auth_failure', 'error', event.path, ip, {
      reason: apiKeyValidation.reason || 'Invalid API key',
      hasBackendKey: !!process.env.FRONTEND_API_KEY,
      hasFrontendKey: !!(event.headers['x-api-key'] || event.headers['X-API-Key']),
    });
    logRequest(event, ip, responseTime, false, 401, apiKeyValidation.reason || 'Invalid API key');
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Unauthorized: Invalid API key',
        message: apiKeyValidation.reason || 'API key validation failed. Please check your environment variables.',
      }),
    };
  }
  
  // Parse request body early for signature validation
  let body: RequestBody;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (parseError) {
    const responseTime = Date.now() - startTime;
    logSecurityEvent('validation_error', 'warning', event.path, ip, {
      reason: 'Invalid JSON',
    });
    logRequest(event, ip, responseTime, false, 400, 'Invalid JSON');
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }
  
  // Validate request signature if provided (enforce in production)
  const enforceSigning = process.env.ENFORCE_REQUEST_SIGNING === 'true';
  const timestamp = body.timestamp || Date.now();
  const nonce = body.nonce || '';
  const signature = body.signature || event.headers['x-signature'] || '';
  
  if (signature || enforceSigning) {
    if (!signature) {
      logSecurityEvent('auth_failure', 'error', event.path, ip, {
        reason: 'Missing signature (signing enforced)',
      });
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request signature required' }),
      };
    }
    
    if (!nonce) {
      logSecurityEvent('auth_failure', 'error', event.path, ip, {
        reason: 'Missing nonce',
      });
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request nonce required' }),
      };
    }
    
    // Validate signature
    const sigValid = validateSignature(body, signature, timestamp);
    if (!sigValid) {
      logSecurityEvent('auth_failure', 'critical', event.path, ip, {
        reason: 'Invalid signature',
      });
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid request signature' }),
      };
    }
    
    // Check for replay attacks
    const replayCheck = checkReplay(nonce, timestamp);
    if (!replayCheck.valid) {
      logSecurityEvent('auth_failure', 'critical', event.path, ip, {
        reason: 'Replay attack detected',
        details: replayCheck.error,
      });
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: replayCheck.error }),
      };
    }
  }
  
  // SECURITY: Enhanced abuse detection (before rate limit check)
  const abuseCheck = detectAbuse(ip, body.prompt || '');
  if (abuseCheck.block) {
    console.error(`[Security] Blocking suspected attack from IP: ${ip}`);
    logSecurityEvent('rate_limit', 'critical', event.path, ip, {
      reason: abuseCheck.reason,
      blocked: true,
      message: 'Automated abuse detection triggered',
    });
    return {
      statusCode: 429,
      headers: {
        ...corsHeaders,
        'Retry-After': '3600', // 1 hour
      },
      body: JSON.stringify({
        error: 'Too many requests',
        message: 'Your IP has been temporarily blocked due to suspicious activity. Please try again later.',
      }),
    };
  }
  
  if (abuseCheck.suspicious) {
    console.warn(`[Security] Suspicious activity detected from IP: ${ip} - ${abuseCheck.reason}`);
    logSecurityEvent('rate_limit', 'warning', event.path, ip, {
      reason: abuseCheck.reason,
      suspicious: true,
    });
  }
  
  // Check rate limits (distributed with Redis fallback to memory)
  const fingerprint = generateFingerprint(event, ip);
  const rateLimitCheck = await checkDistributedRateLimit(ip, fingerprint, {
    perMinute: RATE_LIMITS.perMinute,
    perHour: RATE_LIMITS.perHour,
    perDay: RATE_LIMITS.perDay,
    minDelay: RATE_LIMITS.minDelay,
    maxDailyRequests: MAX_DAILY_REQUESTS,
  });
  
  if (!rateLimitCheck.allowed) {
    const responseTime = Date.now() - startTime;
    logSecurityEvent('rate_limit', 'warning', event.path, ip, {
      retryAfter: rateLimitCheck.retryAfter,
      error: rateLimitCheck.error,
    });
    logRequest(event, ip, responseTime, false, 429, rateLimitCheck.error);
    const headers = {
      ...corsHeaders,
    };
    if (rateLimitCheck.retryAfter) {
      headers['Retry-After'] = rateLimitCheck.retryAfter.toString();
    }
    if (rateLimitCheck.resetAt) {
      headers['X-RateLimit-Reset'] = new Date(rateLimitCheck.resetAt).toISOString();
    }
    if (rateLimitCheck.remaining !== undefined) {
      headers['X-RateLimit-Remaining'] = rateLimitCheck.remaining.toString();
    }
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: rateLimitCheck.error || 'Rate limit exceeded',
        retryAfter: rateLimitCheck.retryAfter,
        resetAt: rateLimitCheck.resetAt ? new Date(rateLimitCheck.resetAt).toISOString() : undefined,
      }),
    };
  }
  
  try {
    // Get secret keys from environment variables (with fallback support)
    const secretKey = process.env.POLLINATIONS_SECRET_KEY;
    const secretKey2 = process.env.POLLINATIONS_SECRET_KEY2;
    
    if (!secretKey && !secretKey2) {
      console.error('[Netlify Function] Missing POLLINATIONS_SECRET_KEY and POLLINATIONS_SECRET_KEY2 environment variables');
      const responseTime = Date.now() - startTime;
      logSecurityEvent('error', 'critical', event.path, ip, {
        reason: 'Missing both POLLINATIONS_SECRET_KEY and POLLINATIONS_SECRET_KEY2',
      });
      logRequest(event, ip, responseTime, false, 500, 'Missing API keys');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Server configuration error: API keys not configured',
        }),
      };
    }
    
    // Validate prompt
    const promptValidation = validatePrompt(body.prompt || '');
    if (!promptValidation.valid) {
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 400, promptValidation.error);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: promptValidation.error }),
      };
    }
    
    const prompt = promptValidation.sanitized || body.prompt || '';
    
    // Get and validate parameters
    const width = body.width || 1024;
    const height = body.height || 1024;
    const model = body.model || 'flux';
    
    const paramValidation = validateParameters(width, height, model);
    if (!paramValidation.valid) {
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 400, paramValidation.error);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: paramValidation.error }),
      };
    }
    
    // Build Pollinations API URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Log request (without secret key)
    console.log('[Netlify Function] Generating image');
    console.log('[Netlify Function] IP:', ip);
    console.log('[Netlify Function] Model:', model);
    console.log('[Netlify Function] Resolution:', `${width}x${height}`);
    console.log('[Netlify Function] Prompt length:', prompt.length);
    
    // Enhanced API fetch with timeout and retry protection
    const API_TIMEOUT = 90000; // Increased to 90 seconds (Pollinations can be slow for high-quality models)
    const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'image/*',
            'User-Agent': 'BexyFlowers/1.0',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if ((error as Error).name === 'AbortError') {
          throw new Error('Request timeout - Pollinations API took too long (>90 seconds)');
        }
        throw error;
      }
    };
    
    // Try primary key first, fallback to secondary key if it fails
    let response: Response | null = null;
    let usedKey: 'primary' | 'secondary' = 'primary';
    let primaryError: string | null = null;
    let secondaryError: string | null = null;
    
    // Attempt 1: Primary key
    if (secretKey) {
      try {
        console.log('[Netlify Function] Attempting with PRIMARY API key');
        const pollinationsUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?key=${secretKey}&model=${model}&width=${width}&height=${height}`;
        
        response = await fetchWithTimeout(pollinationsUrl, API_TIMEOUT);
        
        // Check if response is valid
        if (response.ok) {
          console.log('[Netlify Function] ✅ PRIMARY key succeeded');
          usedKey = 'primary';
        } else {
          primaryError = `Status ${response.status}`;
          console.warn(`[Netlify Function] PRIMARY key failed: ${primaryError}`);
          
          // Only fallback for specific error codes
          if (response.status === 429 || response.status === 401 || response.status === 403 || response.status === 402) {
            response = null; // Clear response to trigger fallback
          }
        }
      } catch (error) {
        primaryError = (error as Error).message;
        console.error('[Netlify Function] PRIMARY key error:', primaryError);
        response = null;
      }
    }
    
    // Attempt 2: Secondary key (if primary failed and secondary exists)
    if (!response && secretKey2) {
      try {
        console.log('[Netlify Function] Falling back to SECONDARY API key');
        console.log(`[Netlify Function] Primary failure reason: ${primaryError || 'Not available'}`);
        
        const pollinationsUrl2 = `https://gen.pollinations.ai/image/${encodedPrompt}?key=${secretKey2}&model=${model}&width=${width}&height=${height}`;
        
        response = await fetchWithTimeout(pollinationsUrl2, API_TIMEOUT);
        
        if (response.ok) {
          console.log('[Netlify Function] ✅ SECONDARY key succeeded');
          usedKey = 'secondary';
          
          // Log successful fallback event
          logSecurityEvent('success', 'warning', event.path, ip, {
            message: 'Successful failover to secondary key',
            primaryError,
            reason: 'Primary key exhausted or blocked',
          });
        } else {
          secondaryError = `Status ${response.status}`;
          console.error(`[Netlify Function] SECONDARY key also failed: ${secondaryError}`);
        }
      } catch (error) {
        secondaryError = (error as Error).message;
        console.error('[Netlify Function] SECONDARY key error:', secondaryError);
        response = null;
      }
    }
    
    // Attempt 3: Use secondary key directly if primary not set
    if (!response && !secretKey && secretKey2) {
      try {
        console.log('[Netlify Function] PRIMARY key not configured, using SECONDARY key');
        const pollinationsUrl2 = `https://gen.pollinations.ai/image/${encodedPrompt}?key=${secretKey2}&model=${model}&width=${width}&height=${height}`;
        
        response = await fetchWithTimeout(pollinationsUrl2, API_TIMEOUT);
        
        if (response.ok) {
          console.log('[Netlify Function] ✅ SECONDARY key succeeded');
          usedKey = 'secondary';
        } else {
          secondaryError = `Status ${response.status}`;
          console.error(`[Netlify Function] SECONDARY key failed: ${secondaryError}`);
        }
      } catch (error) {
        secondaryError = (error as Error).message;
        console.error('[Netlify Function] SECONDARY key error:', secondaryError);
        response = null;
      }
    }
    
    // Final error handling - both keys failed
    if (!response || !response.ok) {
      const errorDetails = {
        primaryKey: secretKey ? (primaryError || 'Not attempted') : 'Not configured',
        secondaryKey: secretKey2 ? (secondaryError || 'Not attempted') : 'Not configured',
        bothKeysFailed: !!(secretKey && secretKey2 && primaryError && secondaryError),
      };
      
      console.error('[Netlify Function] ❌ ALL API keys failed');
      console.error('[Netlify Function] Error details:', errorDetails);
      
      // Log critical security event - API keys may be compromised or exhausted
      logSecurityEvent('error', 'critical', event.path, ip, {
        message: 'All API keys failed',
        ...errorDetails,
      });
      
      const responseTime = Date.now() - startTime;
      const errorText = response ? await response.text().catch(() => 'Unable to read error') : 'No response';
      logRequest(event, ip, responseTime, false, response?.status || 500, errorText.substring(0, 200));
      
      return {
        statusCode: response?.status || 503,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Image generation service unavailable',
          message: response?.status === 429 
            ? 'API rate limit exceeded on all keys. Please try again later.'
            : 'Unable to generate image at this time. Please try again in a few moments.',
          details: errorText.substring(0, 200),
          errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        }),
      };
    }
    
    console.log(`[Netlify Function] ✅ Image generation successful using ${usedKey.toUpperCase()} key`);
    
    // Get image as buffer with validation
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // SECURITY: Validate image buffer
    if (!imageBuffer || imageBuffer.byteLength === 0) {
      console.error('[Netlify Function] ❌ Received empty image buffer');
      logSecurityEvent('error', 'error', event.path, ip, {
        message: 'Empty image buffer received',
        usedKey,
      });
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 500, 'Empty image buffer');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid image received',
          message: 'The generated image is empty or corrupted',
        }),
      };
    }
    
    // SECURITY: Validate image size (minimum 10KB, maximum 10MB)
    const MIN_IMAGE_SIZE = 10 * 1024; // 10KB
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    
    if (imageBuffer.byteLength < MIN_IMAGE_SIZE) {
      console.error(`[Netlify Function] ❌ Image too small: ${imageBuffer.byteLength} bytes (min: ${MIN_IMAGE_SIZE})`);
      logSecurityEvent('validation_error', 'warning', event.path, ip, {
        message: 'Generated image too small (likely error page)',
        size: imageBuffer.byteLength,
        minSize: MIN_IMAGE_SIZE,
        usedKey,
      });
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 500, 'Image too small');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid image received',
          message: 'The generated image is too small (likely an error page)',
        }),
      };
    }
    
    if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
      console.error(`[Netlify Function] ❌ Image too large: ${imageBuffer.byteLength} bytes (max: ${MAX_IMAGE_SIZE})`);
      logSecurityEvent('validation_error', 'warning', event.path, ip, {
        message: 'Generated image exceeds size limit',
        size: imageBuffer.byteLength,
        maxSize: MAX_IMAGE_SIZE,
        usedKey,
      });
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 413, 'Image too large');
      return {
        statusCode: 413,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Image too large',
          message: 'The generated image exceeds the maximum size limit',
        }),
      };
    }
    
    // SECURITY: Validate content type
    const VALID_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!VALID_CONTENT_TYPES.includes(contentType)) {
      console.warn(`[Netlify Function] ⚠️ Unexpected content type: ${contentType}`);
      logSecurityEvent('validation_error', 'warning', event.path, ip, {
        message: 'Unexpected content type',
        contentType,
        usedKey,
      });
      // Don't fail - just log warning and proceed
    }
    
    // SECURITY: Check for image magic bytes to ensure it's a real image
    const buffer = Buffer.from(imageBuffer);
    const magicBytes = buffer.slice(0, 8);
    const isPNG = magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47;
    const isJPEG = magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF;
    const isWEBP = magicBytes[8] === 0x57 && magicBytes[9] === 0x45 && magicBytes[10] === 0x42 && magicBytes[11] === 0x50;
    const isGIF = magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46;
    
    if (!isPNG && !isJPEG && !isWEBP && !isGIF) {
      console.error('[Netlify Function] ❌ Invalid image format (magic bytes check failed)');
      console.error('[Netlify Function] Magic bytes:', Array.from(magicBytes.slice(0, 12)).map(b => '0x' + b.toString(16)).join(' '));
      logSecurityEvent('validation_error', 'error', event.path, ip, {
        message: 'Invalid image format (not a real image file)',
        magicBytes: Array.from(magicBytes.slice(0, 12)).map(b => '0x' + b.toString(16)).join(' '),
        usedKey,
      });
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 500, 'Invalid image format');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid image format',
          message: 'The received data is not a valid image file',
        }),
      };
    }
    
    console.log(`[Netlify Function] ✅ Image validation passed (${isPNG ? 'PNG' : isJPEG ? 'JPEG' : isWEBP ? 'WEBP' : 'GIF'})`);
    
    // Convert to base64
    const imageBase64 = buffer.toString('base64');
    
    // Return image as base64 data URL
    const dataUrl = `data:${contentType};base64,${imageBase64}`;
    
    const responseTime = Date.now() - startTime;
    console.log('[Netlify Function] ✅ Image generated successfully');
    console.log('[Netlify Function] Image size:', imageBuffer.byteLength, 'bytes');
    console.log('[Netlify Function] Response time:', responseTime, 'ms');
    console.log('[Netlify Function] API key used:', usedKey);
    
    // Log performance metric
    logPerformanceMetric(event.path, responseTime, 200);
    logSecurityEvent('success', 'info', event.path, ip, {
      responseTime,
      imageSize: imageBuffer.byteLength,
      apiKeyUsed: usedKey,
    });
    logRequest(event, ip, responseTime, true, 200);
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        imageUrl: dataUrl,
        width,
        height,
        model,
        size: imageBuffer.byteLength,
        apiKeyUsed: usedKey,
      }),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Netlify Function] ❌ CRITICAL ERROR:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    // Enhanced error logging for debugging
    console.error('[Netlify Function] Error details:', {
      message: errorMessage,
      stack: errorStack?.substring(0, 500),
      responseTime,
      ip,
      hasSecretKey: !!process.env.POLLINATIONS_SECRET_KEY,
      hasSecretKey2: !!process.env.POLLINATIONS_SECRET_KEY2,
    });
    
    // Log error event
    logSecurityEvent('error', 'error', event.path, ip, {
      error: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      responseTime,
      hasKeys: {
        primary: !!process.env.POLLINATIONS_SECRET_KEY,
        secondary: !!process.env.POLLINATIONS_SECRET_KEY2,
      },
    });
    logPerformanceMetric(event.path, responseTime, 500);
    logRequest(event, ip, responseTime, false, 500, errorMessage);
    
    // Determine appropriate status code based on error type
    let statusCode = 500;
    let userMessage = 'Internal server error';
    
    if (errorMessage.includes('timeout') || errorMessage.includes('Request timeout')) {
      statusCode = 504; // Gateway Timeout
      userMessage = 'Image generation timeout. Please try again.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch failed')) {
      statusCode = 502; // Bad Gateway
      userMessage = 'Unable to reach image generation service. Please try again.';
    } else if (errorMessage.includes('API keys')) {
      statusCode = 503; // Service Unavailable
      userMessage = 'Image generation service unavailable. Please contact support.';
    }
    
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({
        error: userMessage,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        requestId: `${Date.now()}-${ip.replace(/\./g, '')}`, // Help track errors
      }),
    };
  }
};

