import { fal } from "@fal-ai/client";

// Configure Fal.ai with API key for VEO 3 Fast
console.log("Using Fal.ai VEO 3 Fast for video generation");

fal.config({
  credentials: "b2a86808-1525-4bf5-a1df-feb4ade540ce:69e32cf8e657f20723cbc5dcdf725eb2"
});

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
        console.log("Generating UGC video with Fal.ai VEO 3 Fast...");
        console.log("Avatar:", avatarImageUrl);
        console.log("Script:", script);

        // Convert avatar image to base64 for the prompt
        const { base64 } = await imageUrlToBase64(avatarImageUrl);

        // Create a detailed prompt for VEO 3 Fast
        const fullPrompt = `Create a high-quality UGC (User-Generated Content) style video in a 9:16 vertical format. The person in the image should appear as the speaker, looking directly at the camera with natural expressions. The video should feature the person speaking the following text with clear lip-sync and natural gestures: "${script}". The setting should be casual and authentic, like a social media influencer or content creator speaking to their audience. Ensure good lighting and a clean background suitable for social media platforms like TikTok or Instagram.`;

        console.log("Submitting request to Fal.ai VEO 3 Fast...");

        // Submit the video generation request
        const result = await fal.subscribe("fal-ai/veo3/fast/image-to-video", {
            input: {
                prompt: fullPrompt,
                image_url: avatarImageUrl,
                duration: "8s",
                generate_audio: true,
                resolution: "720p"
            },
            logs: true,
            onQueueUpdate: (update) => {
                console.log("Queue update:", update);
                if (update.status === "IN_PROGRESS") {
                    update.logs?.map((log) => log.message).forEach(console.log);
                }
            }
        });

        console.log("Fal.ai VEO 3 Fast response:", result);

        if (!result.data || !result.data.video) {
            throw new Error("No video generated in response");
        }

        const videoUrl = result.data.video.url;
        console.log("Generated video URL:", videoUrl);

        // Fetch the video and create a blob URL
        const videoResponse = await fetch(videoUrl);
        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch generated video: ${videoResponse.statusText}`);
        }

        const videoBlob = await videoResponse.blob();
        const blobUrl = URL.createObjectURL(videoBlob);

        console.log("Video generation completed successfully!");
        return blobUrl;

    } catch (error) {
        console.error("Error in generateUgcVideo:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
}