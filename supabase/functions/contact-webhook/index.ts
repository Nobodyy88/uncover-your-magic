import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration
const RATE_LIMIT_MAX_REQUESTS = 5; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour in milliseconds

// Simple validation schema
function validateContactForm(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }
  
  const form = data as Record<string, unknown>;
  
  // Validate name
  if (!form.name || typeof form.name !== 'string' || form.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (form.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  // Validate phone
  if (!form.phone || typeof form.phone !== 'string' || form.phone.trim().length < 6) {
    errors.push('Phone must be at least 6 characters');
  } else if (form.phone.length > 20) {
    errors.push('Phone must be less than 20 characters');
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || typeof form.email !== 'string' || !emailRegex.test(form.email)) {
    errors.push('Invalid email address');
  } else if (form.email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }
  
  // Validate machine (optional but limited length)
  if (form.machine && typeof form.machine === 'string' && form.machine.length > 200) {
    errors.push('Machine field must be less than 200 characters');
  }
  
  // Validate message
  if (!form.message || typeof form.message !== 'string' || form.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (form.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

// Rate limit data interface
interface RateLimitData {
  ip: string;
  count: number;
  last_reset: number;
}

// Rate limiting function using Supabase
async function checkRateLimit(supabaseAdmin: any, ip: string): Promise<{ allowed: boolean; remainingRequests: number }> {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  try {
    // Get current rate limit entry for this IP
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('count, last_reset')
      .eq('ip', ip)
      .maybeSingle();
    
    if (error) {
      console.error('Rate limit check error:', error);
      // Allow request on error to prevent blocking legitimate users
      return { allowed: true, remainingRequests: RATE_LIMIT_MAX_REQUESTS };
    }
    
    const rateLimitData = data as RateLimitData | null;
    
    // If no entry exists or window has expired, create/reset
    if (!rateLimitData || rateLimitData.last_reset < windowStart) {
      await supabaseAdmin
        .from('rate_limits')
        .upsert({
          ip,
          count: 1,
          last_reset: now
        }, { onConflict: 'ip' });
      
      return { allowed: true, remainingRequests: RATE_LIMIT_MAX_REQUESTS - 1 };
    }
    
    // Check if rate limit exceeded
    if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
      const resetTime = new Date(rateLimitData.last_reset + RATE_LIMIT_WINDOW_MS);
      console.log(`Rate limit exceeded for IP ${ip}. Resets at ${resetTime.toISOString()}`);
      return { allowed: false, remainingRequests: 0 };
    }
    
    // Increment counter
    await supabaseAdmin
      .from('rate_limits')
      .update({ count: rateLimitData.count + 1 })
      .eq('ip', ip);
    
    return { allowed: true, remainingRequests: RATE_LIMIT_MAX_REQUESTS - rateLimitData.count - 1 };
  } catch (err) {
    console.error('Rate limit error:', err);
    // Allow on error to prevent blocking
    return { allowed: true, remainingRequests: RATE_LIMIT_MAX_REQUESTS };
  }
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  // Check standard headers in order of preference
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  // Fallback to a hash of user-agent + timestamp if no IP available
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `unknown-${userAgent.substring(0, 20)}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get client IP and check rate limit
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(supabaseAdmin, clientIP);
    
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000))
          } 
        }
      );
    }

    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    console.log('Received contact form submission');
    
    // Validate form data
    const validation = validateContactForm(body);
    if (!validation.valid) {
      console.log('Validation failed:', validation.errors);
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and prepare data
    const sanitizedData = {
      name: String(body.name).trim().slice(0, 100),
      phone: String(body.phone).trim().slice(0, 20),
      email: String(body.email).trim().toLowerCase().slice(0, 255),
      machine: body.machine ? String(body.machine).trim().slice(0, 200) : '',
      message: String(body.message).trim().slice(0, 2000),
      timestamp: new Date().toISOString(),
    };

    // Forward to n8n webhook with Cloudflare Access Service Token
    const cfAccessClientId = Deno.env.get('CF_ACCESS_CLIENT_ID');
    const cfAccessClientSecret = Deno.env.get('CF_ACCESS_CLIENT_SECRET');
    
    const webhookHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add Cloudflare Access headers if configured
    if (cfAccessClientId && cfAccessClientSecret) {
      webhookHeaders['CF-Access-Client-Id'] = cfAccessClientId;
      webhookHeaders['CF-Access-Client-Secret'] = cfAccessClientSecret;
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify(sanitizedData),
    });

    if (!response.ok) {
      console.error('Webhook responded with error:', response.status);
      return new Response(
        JSON.stringify({ error: 'Failed to process request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contact form submission forwarded successfully');
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimitResult.remainingRequests)
        } 
      }
    );

  } catch (error) {
    console.error('Error in contact-webhook function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
