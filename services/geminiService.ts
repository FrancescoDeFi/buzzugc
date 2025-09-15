import { supabase } from './supabaseClient';

// Client-side service: calls server endpoint to generate video securely

/**
 * Converts an image URL to a base64 encoded string.
 * @param url The URL of the image to convert.
 * @returns A promise that resolves to an object containing the base64 string and mime type.
 */
async function imageUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  const mimeType = blob.type;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as Data URL."));
      }
      const base64String = reader.result.split(',')[1];
      resolve({ base64: base64String, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generates a UGC video using VEO 3 Fast via Fal.ai
 * @param avatarImageUrl The URL of the avatar image.
 * @param script The text script for the avatar to speak.
 * @returns A promise that resolves to the object URL of the generated video.
 */
export async function generateUgcVideo(avatarImageUrl: string, script: string): Promise<string> {
    try {
        console.log("Generating UGC video...");

        // Convert avatar image to base64 for the prompt
        const { base64 } = await imageUrlToBase64(avatarImageUrl);
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        // Prefer same-origin Vercel API to avoid cross-origin preflight; fallback to Supabase Edge Function
        let videoUrl: string | undefined;
        try {
          const respLocal = await fetch('/api/generate-ugc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageDataUrl: dataUrl, script, avatarImageUrl }),
          });
          if (respLocal.ok) {
            const json = await respLocal.json();
            videoUrl = json.videoUrl;
          } else {
            console.warn('Local API generate-ugc failed:', respLocal.status);
          }
        } catch (e) {
          console.warn('Local API generate-ugc not available, trying Supabase Edge Function');
        }

        if (!videoUrl) {
          const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
          const supaUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
          try {
            if ((supabase as any)?.functions) {
              const headers: Record<string, string> = {};
              if (anonKey) {
                headers['apikey'] = anonKey;
                headers['Authorization'] = `Bearer ${anonKey}`;
              }
              const { data, error } = await (supabase as any).functions.invoke('generate-ugc', {
                body: { imageDataUrl: dataUrl, script, avatarImageUrl },
                headers,
              });
              if (error) throw error;
              videoUrl = data?.videoUrl;
            }
          } catch (e) {
            console.warn('Edge Function invoke failed, trying direct function URL:', e);
          }
          if (!videoUrl && supaUrl && anonKey) {
            const resp = await fetch(`${supaUrl.replace(/\/$/, '')}/functions/v1/generate-ugc`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${anonKey}`, 'apikey': anonKey },
              body: JSON.stringify({ imageDataUrl: dataUrl, script, avatarImageUrl }),
            });
            if (!resp.ok) {
              const errText = await resp.text();
              throw new Error(`Server error: ${resp.status} ${errText}`);
            }
            const json = await resp.json();
            videoUrl = json.videoUrl;
          }
        }
        if (!videoUrl) throw new Error('Missing video URL from server');
        if (!videoUrl) throw new Error('Missing video URL from server');

        // Return the remote video URL directly to avoid CORS issues when fetching binary data
        console.log("Video generation completed successfully! URL:", videoUrl);
        return videoUrl;

    } catch (error) {
        console.error("Error in generateUgcVideo:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
}
