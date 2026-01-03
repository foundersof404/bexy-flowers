/**
 * Netlify Serverless Function - Pollinations API Proxy
 * 
 * This function acts as a server-side proxy for Pollinations API calls.
 * It allows us to use secret keys (sk_) which have unlimited rate limits,
 * while keeping the key secure on the server.
 * 
 * Endpoint: /.netlify/functions/generate-image
 * Method: GET or POST
 * 
 * Query Parameters (GET) or Body (POST):
 * - prompt: The image generation prompt
 * - width: Image width (default: 1024)
 * - height: Image height (default: 1024)
 * - model: Model to use (default: 'flux')
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface RequestBody {
  prompt?: string;
  width?: number;
  height?: number;
  model?: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Get secret key from environment variable
    const secretKey = process.env.POLLINATIONS_SECRET_KEY;
    
    if (!secretKey) {
      console.error('[Netlify Function] Missing POLLINATIONS_SECRET_KEY environment variable');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server configuration error: API key not configured',
        }),
      };
    }

    // Parse request parameters
    let prompt: string;
    let width: number = 1024;
    let height: number = 1024;
    let model: string = 'flux';

    if (event.httpMethod === 'GET') {
      // GET request - parameters in query string
      const params = event.queryStringParameters || {};
      prompt = params.prompt || '';
      width = params.width ? parseInt(params.width, 10) : 1024;
      height = params.height ? parseInt(params.height, 10) : 1024;
      model = params.model || 'flux';
    } else if (event.httpMethod === 'POST') {
      // POST request - parameters in body
      const body: RequestBody = JSON.parse(event.body || '{}');
      prompt = body.prompt || '';
      width = body.width || 1024;
      height = body.height || 1024;
      model = body.model || 'flux';
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Build Pollinations API URL
    // Format: https://gen.pollinations.ai/image/{prompt}?key=SECRET_KEY&model=flux&width=1024&height=1024
    // SECURITY: secretKey is NEVER logged or exposed - only used in API URL
    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?key=${secretKey}&model=${model}&width=${width}&height=${height}`;

    // SECURITY: Never log the secret key or full URL with key
    console.log('[Netlify Function] Generating image with Pollinations API');
    console.log('[Netlify Function] Model:', model);
    console.log('[Netlify Function] Resolution:', `${width}x${height}`);
    console.log('[Netlify Function] Prompt length:', prompt.length);
    // Note: secretKey is used in URL but NEVER logged or returned to client

    // Fetch image from Pollinations API
    const response = await fetch(pollinationsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Netlify Function] Pollinations API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: `Pollinations API error: ${response.status}`,
          details: errorText.substring(0, 200), // Limit error text length
        }),
      };
    }

    // Get image as buffer
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return image as base64 data URL
    // Frontend can use this directly: data:image/png;base64,{base64}
    const dataUrl = `data:${contentType};base64,${imageBase64}`;

    console.log('[Netlify Function] ✅ Image generated successfully');
    console.log('[Netlify Function] Image size:', imageBuffer.byteLength, 'bytes');

    return {
      statusCode: 200,
      headers: {
        ...headers,
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
    console.error('[Netlify Function] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

