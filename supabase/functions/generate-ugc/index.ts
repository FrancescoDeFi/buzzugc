// Supabase Edge Function: generate-ugc
// Hides the Fal.ai API key and returns a generated video URL
// Run locally: supabase functions serve generate-ugc --no-verify-jwt
// Deploy: supabase functions deploy generate-ugc

// deno-lint-ignore no-explicit-any
type Json = any;

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Robust body parsing: accept JSON, form-encoded, or plain text
    const contentType = req.headers.get('content-type') ?? '';
    const raw = await req.text();

    let parsed: Record<string, unknown> = {};
    if (contentType.includes('application/json')) {
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON body', details: String(e) }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(raw);
      parsed = Object.fromEntries(params.entries());
    } else if (contentType.includes('text/plain')) {
      parsed = { script: raw };
    } else if (raw?.trim().startsWith('{')) {
      // Attempt JSON parse even if header missing
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        return new Response(
          JSON.stringify({ error: 'Unrecognized or invalid request body', details: String(e) }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported Content-Type', contentType }),
        { status: 415, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const imageDataUrl = (parsed as Json).imageDataUrl as string | undefined;
    const avatarImageUrl = (parsed as Json).avatarImageUrl as string | undefined;
    const script = (parsed as Json).script as string | undefined;

    const FAL_KEY = Deno.env.get('FAL_KEY') || Deno.env.get('FAL_API_KEY');
    if (!FAL_KEY) {
      return new Response(JSON.stringify({ error: 'FAL_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!script || (!imageDataUrl && !avatarImageUrl)) {
      return new Response(JSON.stringify({ error: 'Missing image or script' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build absolute or data URL for Fal
    const origin = req.headers.get('origin') ?? '';
    const imageUrl = imageDataUrl
      ? imageDataUrl
      : (avatarImageUrl?.startsWith('http') ? avatarImageUrl : `${origin}${avatarImageUrl}`);

    // Compose prompt
    const prompt = `Create a high-quality UGC (User-Generated Content) style video in a 9:16 vertical format. The person in the image should appear as the speaker, looking directly at the camera with natural expressions. The video should feature the person speaking the following text with clear lip-sync and natural gestures: "${script}". The setting should be casual and authentic, like a social media influencer or content creator speaking to their audience. Ensure good lighting and a clean background suitable for social media platforms like TikTok or Instagram.`;

    // Fal.ai synchronous invoke endpoint for the VEO 3 Fast image-to-video model
    const falEndpoint = 'https://api.fal.ai/fal-ai/veo3/fast/image-to-video';

    const falResp = await fetch(falEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        input: {
          prompt,
          image_url: imageUrl,
          duration: '8s',
          generate_audio: true,
          resolution: '720p',
        },
      }),
    });

    if (!falResp.ok) {
      const text = await falResp.text();
      return new Response(JSON.stringify({ error: 'Fal request failed', details: text }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const falJson: Json = await falResp.json();
    const videoUrl: string | undefined = falJson?.data?.video?.url || falJson?.video?.url || falJson?.videoUrl;
    if (!videoUrl) {
      return new Response(JSON.stringify({ error: 'Missing video URL in Fal response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ videoUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unhandled error', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
