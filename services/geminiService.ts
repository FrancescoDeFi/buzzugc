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
        // Call server endpoint to generate video (hides FAL secret)
        const resp = await fetch('/api/generate-ugc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageDataUrl: dataUrl, script, avatarImageUrl }),
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`Server error: ${resp.status} ${errText}`);
        }
        const { videoUrl } = await resp.json();
        if (!videoUrl) throw new Error('Missing video URL from server');

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
