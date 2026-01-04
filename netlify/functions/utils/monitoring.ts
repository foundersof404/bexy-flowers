/**
 * Monitoring & Alerting Utilities
 * 
 * Tracks error rates, performance metrics, and security events
 */

interface SecurityEvent {
  timestamp: string;
  type: 'error' | 'rate_limit' | 'auth_failure' | 'validation_error' | 'success';
  severity: 'info' | 'warning' | 'error' | 'critical';
  endpoint: string;
  ip: string;
  details: Record<string, any>;
}

interface PerformanceMetric {
  endpoint: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
}

// In-memory stores (for serverless - use external service in production)
const errorCounts = new Map<string, { count: number; lastReset: number }>();
const performanceMetrics: PerformanceMetric[] = [];
const securityEvents: SecurityEvent[] = [];

const ERROR_RATE_WINDOW = 60 * 1000; // 1 minute
const MAX_ERRORS_PER_WINDOW = 10;
const MAX_METRICS = 1000; // Keep last 1000 metrics
const MAX_EVENTS = 500; // Keep last 500 events

/**
 * Log security event
 */
export function logSecurityEvent(
  type: SecurityEvent['type'],
  severity: SecurityEvent['severity'],
  endpoint: string,
  ip: string,
  details: Record<string, any> = {}
): void {
  const event: SecurityEvent = {
    timestamp: new Date().toISOString(),
    type,
    severity,
    endpoint,
    ip,
    details,
  };
  
  securityEvents.push(event);
  
  // Keep only last MAX_EVENTS
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.shift();
  }
  
  // Log to console (structured)
  console.log('[Security Event]', JSON.stringify(event));
  
  // Check if alert needed
  if (severity === 'critical' || severity === 'error') {
    checkErrorRate(endpoint, ip);
  }
}

/**
 * Log performance metric
 */
export function logPerformanceMetric(
  endpoint: string,
  responseTime: number,
  statusCode: number
): void {
  const metric: PerformanceMetric = {
    endpoint,
    responseTime,
    statusCode,
    timestamp: new Date().toISOString(),
  };
  
  performanceMetrics.push(metric);
  
  // Keep only last MAX_METRICS
  if (performanceMetrics.length > MAX_METRICS) {
    performanceMetrics.shift();
  }
  
  // Log slow requests
  if (responseTime > 5000) {
    console.warn(`[Performance] Slow request: ${endpoint} - ${responseTime}ms`);
  }
}

/**
 * Check error rate and alert if high
 */
function checkErrorRate(endpoint: string, ip: string): void {
  const now = Date.now();
  const key = `${endpoint}:${ip}`;
  
  let errorData = errorCounts.get(key);
  if (!errorData || (now - errorData.lastReset) > ERROR_RATE_WINDOW) {
    errorData = { count: 0, lastReset: now };
    errorCounts.set(key, errorData);
  }
  
  errorData.count++;
  
  if (errorData.count >= MAX_ERRORS_PER_WINDOW) {
    console.error(`[Alert] High error rate detected: ${endpoint} from IP: ${ip} - ${errorData.count} errors in last minute`);
    // In production, send to alerting service (e.g., Sentry, Datadog)
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(endpoint?: string): {
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  totalRequests: number;
  errorRate: number;
} {
  const relevant = endpoint
    ? performanceMetrics.filter(m => m.endpoint === endpoint)
    : performanceMetrics;
  
  if (relevant.length === 0) {
    return {
      avgResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      totalRequests: 0,
      errorRate: 0,
    };
  }
  
  const sorted = [...relevant].sort((a, b) => a.responseTime - b.responseTime);
  const errors = relevant.filter(m => m.statusCode >= 400).length;
  
  return {
    avgResponseTime: relevant.reduce((sum, m) => sum + m.responseTime, 0) / relevant.length,
    p95ResponseTime: sorted[Math.floor(sorted.length * 0.95)]?.responseTime || 0,
    p99ResponseTime: sorted[Math.floor(sorted.length * 0.99)]?.responseTime || 0,
    totalRequests: relevant.length,
    errorRate: errors / relevant.length,
  };
}

/**
 * Get security event summary
 */
export function getSecuritySummary(): {
  totalEvents: number;
  criticalEvents: number;
  errorEvents: number;
  rateLimitHits: number;
  authFailures: number;
} {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  const recent = securityEvents.filter(e => 
    new Date(e.timestamp).getTime() > oneHourAgo
  );
  
  return {
    totalEvents: recent.length,
    criticalEvents: recent.filter(e => e.severity === 'critical').length,
    errorEvents: recent.filter(e => e.severity === 'error').length,
    rateLimitHits: recent.filter(e => e.type === 'rate_limit').length,
    authFailures: recent.filter(e => e.type === 'auth_failure').length,
  };
}

