/**
 * Netlify Serverless Function - Pollinations API Proxy (SECURE VERSION)
 * 
 * SECURITY FEATURES:
 * - Rate limiting per IP (10/min, 100/hour, 500/day)
 * - Frontend API key authentication
 * - CORS restriction (only allowed origins)
 * - Input validation and sanitization
 * - Abuse detection and IP blocking
 * - Daily request limits
 * - Request logging
 * 
 * Endpoint: /.netlify/functions/generate-image
 * Method: POST only (GET disabled for security)
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
    // Get secret key from environment variable
    const secretKey = process.env.POLLINATIONS_SECRET_KEY;
    
    if (!secretKey) {
      console.error('[Netlify Function] Missing POLLINATIONS_SECRET_KEY environment variable');
      const responseTime = Date.now() - startTime;
      logSecurityEvent('error', 'critical', event.path, ip, {
        reason: 'Missing POLLINATIONS_SECRET_KEY',
      });
      logRequest(event, ip, responseTime, false, 500, 'Missing API key');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Server configuration error: API key not configured',
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
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?key=${secretKey}&model=${model}&width=${width}&height=${height}`;
    
    // Log request (without secret key)
    console.log('[Netlify Function] Generating image');
    console.log('[Netlify Function] IP:', ip);
    console.log('[Netlify Function] Model:', model);
    console.log('[Netlify Function] Resolution:', `${width}x${height}`);
    console.log('[Netlify Function] Prompt length:', prompt.length);
    
    // Fetch image from Pollinations API
    const response = await fetch(pollinationsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Netlify Function] Pollinations API error:', response.status, errorText.substring(0, 200));
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, response.status, errorText.substring(0, 200));
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({
          error: `Pollinations API error: ${response.status}`,
          details: errorText.substring(0, 200),
        }),
      };
    }
    
    // Get image as buffer
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // Return image as base64 data URL
    const dataUrl = `data:${contentType};base64,${imageBase64}`;
    
    const responseTime = Date.now() - startTime;
    console.log('[Netlify Function] ✅ Image generated successfully');
    console.log('[Netlify Function] Image size:', imageBuffer.byteLength, 'bytes');
    console.log('[Netlify Function] Response time:', responseTime, 'ms');
    
    // Log performance metric
    logPerformanceMetric(event.path, responseTime, 200);
    logSecurityEvent('success', 'info', event.path, ip, {
      responseTime,
      imageSize: imageBuffer.byteLength,
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
      }),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Netlify Function] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error event
    logSecurityEvent('error', 'error', event.path, ip, {
      error: errorMessage,
      responseTime,
    });
    logPerformanceMetric(event.path, responseTime, 500);
    logRequest(event, ip, responseTime, false, 500, errorMessage);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: errorMessage,
      }),
    };
  }
};

