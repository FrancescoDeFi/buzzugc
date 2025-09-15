export default async function handler(req, res) {
  // CORS (allow same-origin or any; Vercel API is same-origin to your app)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;
  if (!FAL_KEY) {
    return res.status(500).json({ error: 'FAL_KEY not configured on server' });
  }

  try {
    const { imageDataUrl, avatarImageUrl, script } = req.body || {};
    if (!script || (!imageDataUrl && !avatarImageUrl)) {
      return res.status(400).json({ error: 'Missing image or script' });
    }

    const origin = req.headers.origin || req.headers.referer || '';
    const imageUrl = imageDataUrl
      ? imageDataUrl
      : (avatarImageUrl?.startsWith('http') ? avatarImageUrl : `${origin.replace(/\/$/, '')}${avatarImageUrl}`);

    const prompt = `Create a high-quality UGC (User-Generated Content) style video in a 9:16 vertical format. The person in the image should appear as the speaker, looking directly at the camera with natural expressions. The video should feature the person speaking the following text with clear lip-sync and natural gestures: "${script}". The setting should be casual and authentic, like a social media influencer or content creator speaking to their audience. Ensure good lighting and a clean background suitable for social media platforms like TikTok or Instagram.`;

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
      return res.status(502).json({ error: 'Fal request failed', details: text });
    }

    const json = await falResp.json();
    const videoUrl = json?.data?.video?.url || json?.video?.url || json?.videoUrl;
    if (!videoUrl) {
      return res.status(502).json({ error: 'Missing video URL in Fal response' });
    }

    return res.status(200).json({ videoUrl });
  } catch (err) {
    return res.status(500).json({ error: 'Unhandled error', details: String(err) });
  }
}

