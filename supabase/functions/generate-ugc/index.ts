import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Supabase Edge Function: generate-ugc
// Generates UGC videos using Fal.ai VEO 3 Fast model
// Takes an avatar image and script text as input

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

interface FalApiResponse {
  video?: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  request_id?: string;
}

interface FalQueueResponse {
  request_id: string;
}

interface FalStatusResponse {
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  completed_at?: string;
  started_at?: string;
  queue_position?: number;
  response_url?: string;
  logs?: Array<{ message: string; level: string; timestamp: string }>;
}

function buildCorsHeaders(originHeader: string | null) {
  const origin = originHeader ?? '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization,apikey,content-type,x-client-info',
    'Access-Control-Max-Age': '86400',
  } as Record<string, string>;
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req.headers.get('origin'));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { imageDataUrl, avatarImageUrl, script } = body;

    // Validate inputs
    if (!script || typeof script !== 'string' || script.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Script text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!imageDataUrl && !avatarImageUrl) {
      return new Response(JSON.stringify({ error: 'Avatar image is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get FAL API key from environment
    const FAL_KEY = Deno.env.get('FAL_KEY');
    if (!FAL_KEY) {
      console.error('FAL_KEY environment variable not set');
      return new Response(JSON.stringify({ error: 'API configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine image URL to use
    let imageUrl = imageDataUrl;
    if (!imageUrl && avatarImageUrl) {
      // If avatarImageUrl is relative, make it absolute
      if (avatarImageUrl.startsWith('/')) {
        const origin = req.headers.get('origin') || 'https://localhost:3000';
        imageUrl = `${origin}${avatarImageUrl}`;
      } else {
        imageUrl = avatarImageUrl;
      }
    }

    console.log('Generating UGC video with Fal.ai VEO 3 Fast');
    console.log('Script length:', script.length);
    console.log('Using image:', imageUrl ? 'provided' : 'missing');

    // Create the prompt for VEO 3 Fast
    const prompt = `Create a high-quality UGC (User-Generated Content) style video in a 9:16 vertical format. The person in the image should appear as the speaker, looking directly at the camera with natural expressions and lip-sync. The person should speak the following text: "${script}". The setting should be casual and authentic, like a social media influencer or content creator speaking to their audience. Ensure good lighting and a clean background suitable for social media platforms like TikTok or Instagram. The person should have natural gestures and body language while speaking.`;

    // Prepare the request payload for Fal.ai VEO 3 Fast
    const payload = {
      prompt: prompt,
      aspect_ratio: "9:16" as const, // Vertical format for UGC
      duration: "8s" as const,
      resolution: "720p" as const,
      generate_audio: true,
      enhance_prompt: true,
      auto_fix: true,
    };

    // Add image_url if we have an image
    if (imageUrl) {
      (payload as any).image_url = imageUrl;
    }

    console.log('Submitting request to Fal.ai...');

    // Try the direct API first (fal.subscribe equivalent)
    const directResponse = await fetch('https://fal.run/fal-ai/veo3/fast', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (directResponse.ok) {
      const result: FalApiResponse = await directResponse.json();
      console.log('Direct API success:', result);
      
      if (result.video?.url) {
        return new Response(JSON.stringify({ 
          videoUrl: result.video.url,
          requestId: result.request_id 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log('Direct API failed or no immediate result, trying queue API...');

    // If direct API fails or doesn't return immediately, use queue API
    const queueResponse = await fetch('https://fal.run/fal-ai/veo3/fast', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
        'X-Fal-Queue': 'true', // Use queue mode
      },
      body: JSON.stringify(payload),
    });

    if (!queueResponse.ok) {
      const errorText = await queueResponse.text();
      console.error('Queue API failed:', queueResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit video generation request',
        details: errorText 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const queueResult: FalQueueResponse = await queueResponse.json();
    const requestId = queueResult.request_id;
    
    console.log('Video generation queued with ID:', requestId);

    // Poll for completion with timeout
    const startTime = Date.now();
    const timeoutMs = 90000; // 90 seconds to stay within Supabase limits
    const pollIntervalMs = 2000; // Poll every 2 seconds

    while (Date.now() - startTime < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));

      try {
        const statusResponse = await fetch(`https://fal.run/fal-ai/veo3/fast/requests/${requestId}/status`, {
          headers: {
            'Authorization': `Key ${FAL_KEY}`,
          },
        });

        if (!statusResponse.ok) {
          console.error('Status check failed:', statusResponse.status);
          continue;
        }

        const status: FalStatusResponse = await statusResponse.json();
        console.log('Status:', status.status, 'Queue position:', status.queue_position);

        if (status.status === 'COMPLETED') {
          // Get the final result
          const resultResponse = await fetch(`https://fal.run/fal-ai/veo3/fast/requests/${requestId}`, {
            headers: {
              'Authorization': `Key ${FAL_KEY}`,
            },
          });

          if (resultResponse.ok) {
            const finalResult: FalApiResponse = await resultResponse.json();
            console.log('Video generation completed:', finalResult);

            if (finalResult.video?.url) {
              return new Response(JSON.stringify({ 
                videoUrl: finalResult.video.url,
                requestId: requestId 
              }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          }
        } else if (status.status === 'FAILED') {
          console.error('Video generation failed');
          return new Response(JSON.stringify({ 
            error: 'Video generation failed',
            requestId: requestId 
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (pollError) {
        console.error('Polling error:', pollError);
        // Continue polling despite errors
      }
    }

    // Timeout reached
    console.log('Polling timeout reached, returning request ID for client-side polling');
    return new Response(JSON.stringify({ 
      error: 'Video generation is taking longer than expected',
      message: 'Your video is still being generated. Please try again in a few minutes.',
      requestId: requestId,
      status: 'processing'
    }), {
      status: 202, // Accepted
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});