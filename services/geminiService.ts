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
        console.log("Generating UGC video with VEO 3 Fast...");
        console.log("Avatar image:", avatarImageUrl);
        console.log("Script:", script.substring(0, 100) + "...");

        // Validate inputs
        if (!script || script.trim().length === 0) {
            throw new Error("Script text is required");
        }

        if (!avatarImageUrl) {
            throw new Error("Avatar image is required");
        }

        // Convert avatar image to base64 for the API
        const { base64 } = await imageUrlToBase64(avatarImageUrl);
        const imageDataUrl = `data:image/jpeg;base64,${base64}`;

        // Get Supabase configuration
        const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string;
        const supaUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string;

        if (!anonKey || !supaUrl) {
            throw new Error("Supabase configuration is missing");
        }

        console.log("Calling Supabase edge function...");

        // Call the Supabase edge function
        const response = await fetch(`${supaUrl.replace(/\/$/, '')}/functions/v1/generate-ugc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`,
                'apikey': anonKey,
            },
            body: JSON.stringify({
                imageDataUrl: imageDataUrl,
                avatarImageUrl: avatarImageUrl,
                script: script,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Edge function error:", response.status, result);
            
            if (response.status === 202 && result.status === 'processing') {
                // Video is still being generated
                throw new Error(result.message || 'Video generation is taking longer than expected. Please try again in a few minutes.');
            }
            
            throw new Error(result.error || `Server error: ${response.status}`);
        }

        if (!result.videoUrl) {
            console.error("No video URL in response:", result);
            throw new Error("No video URL returned from server");
        }

        console.log("Video generation completed successfully!");
        console.log("Video URL:", result.videoUrl);

        return result.videoUrl;

    } catch (error) {
        console.error("Error in generateUgcVideo:", error);
        
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        
        throw new Error("An unknown error occurred during video generation.");
    }
}
