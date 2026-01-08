import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Forward to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in contact-webhook function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
