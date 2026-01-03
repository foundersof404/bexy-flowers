/**
 * Health Check & Monitoring Endpoint
 * 
 * Provides system health status, performance metrics, and security summary
 * 
 * Endpoint: /.netlify/functions/health
 * Method: GET
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { getPerformanceStats, getSecuritySummary } from './utils/monitoring';

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed. Only GET requests are accepted.' }),
    };
  }
  
  try {
    // Get performance statistics
    const imageGenStats = getPerformanceStats('/.netlify/functions/generate-image');
    const databaseStats = getPerformanceStats('/.netlify/functions/database');
    const overallStats = getPerformanceStats();
    
    // Get security summary
    const securitySummary = getSecuritySummary();
    
    // Check environment variables
    const envStatus = {
      POLLINATIONS_SECRET_KEY: !!process.env.POLLINATIONS_SECRET_KEY,
      FRONTEND_API_KEY: !!process.env.FRONTEND_API_KEY,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY || !!process.env.SUPABASE_ANON_KEY,
      FRONTEND_API_SECRET: !!process.env.FRONTEND_API_SECRET,
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
      ENFORCE_REQUEST_SIGNING: process.env.ENFORCE_REQUEST_SIGNING === 'true',
    };
    
    // Determine overall health
    const allEnvConfigured = Object.values(envStatus).filter(v => v === false).length === 0;
    const hasErrors = securitySummary.errorEvents > 0 || securitySummary.criticalEvents > 0;
    const isHealthy = allEnvConfigured && !hasErrors && overallStats.errorRate < 0.1;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown',
        environment: {
          ...envStatus,
          nodeVersion: process.version,
        },
        performance: {
          imageGeneration: imageGenStats,
          database: databaseStats,
          overall: overallStats,
        },
        security: securitySummary,
        recommendations: [
          ...(!envStatus.UPSTASH_REDIS_REST_URL ? ['Configure Upstash Redis for distributed rate limiting'] : []),
          ...(!envStatus.FRONTEND_API_SECRET ? ['Configure FRONTEND_API_SECRET for request signing'] : []),
          ...(!envStatus.ENFORCE_REQUEST_SIGNING ? ['Enable ENFORCE_REQUEST_SIGNING in production'] : []),
          ...(overallStats.errorRate > 0.05 ? ['High error rate detected - investigate'] : []),
        ],
      }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

