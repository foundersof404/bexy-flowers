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

interface RequestBody {
  prompt?: string;
  width?: number;
  height?: number;
  model?: string;
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
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
}

/**
 * Validate API key
 */
function validateAPIKey(event: HandlerEvent): boolean {
  const frontendApiKey = process.env.FRONTEND_API_KEY;
  if (!frontendApiKey) {
    console.warn('[Security] FRONTEND_API_KEY not set - allowing all requests');
    return true; // Allow if not configured (backward compatibility)
  }
  
  const providedKey = event.headers['x-api-key'] || event.headers['X-API-Key'];
  return providedKey === frontendApiKey;
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
  
  // Check origin
  if (!isOriginAllowed(origin)) {
    const responseTime = Date.now() - startTime;
    logRequest(event, ip, responseTime, false, 403, 'Forbidden origin');
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Forbidden: Origin not allowed' }),
    };
  }
  
  // Validate API key
  if (!validateAPIKey(event)) {
    const responseTime = Date.now() - startTime;
    logRequest(event, ip, responseTime, false, 401, 'Invalid API key');
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
    };
  }
  
  // Check rate limits
  const rateLimitCheck = checkRateLimit(ip);
  if (!rateLimitCheck.allowed) {
    const responseTime = Date.now() - startTime;
    logRequest(event, ip, responseTime, false, 429, rateLimitCheck.error);
    const headers = {
      ...corsHeaders,
    };
    if (rateLimitCheck.retryAfter) {
      headers['Retry-After'] = rateLimitCheck.retryAfter.toString();
    }
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: rateLimitCheck.error || 'Rate limit exceeded',
        retryAfter: rateLimitCheck.retryAfter,
      }),
    };
  }
  
  try {
    // Get secret key from environment variable
    const secretKey = process.env.POLLINATIONS_SECRET_KEY;
    
    if (!secretKey) {
      console.error('[Netlify Function] Missing POLLINATIONS_SECRET_KEY environment variable');
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 500, 'Missing API key');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Server configuration error: API key not configured',
        }),
      };
    }
    
    // Parse request body
    let body: RequestBody;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseError) {
      const responseTime = Date.now() - startTime;
      logRequest(event, ip, responseTime, false, 400, 'Invalid JSON');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
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
    const model = body.model || 'gptimage';
    
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

