const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const FETCH_TIMEOUT_MS = 30000; // 30 seconds

// Utility to validate base64 image string
const isValidBase64Image = (base64String) => {
  if (typeof base64String !== 'string' || !base64String) {
    return false;
  }
  const base64Regex = /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(base64String) || /^[A-Za-z0-9+/=]+$/.test(base64String);
};

// Utility for exponential backoff delay
const getRetryDelay = (attempt) => RETRY_DELAY_MS * Math.pow(2, attempt);

export async function fetchGeminiFeedback(base64Image) {
  // Input validation
  if (!base64Image) {
    return { success: false, message: 'No image provided. Please upload a valid image.' };
  }

  if (!isValidBase64Image(base64Image)) {
    return { success: false, message: 'Invalid image format. Please ensure the image is a valid base64-encoded JPEG.' };
  }

  // Ensure API key is present
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, message: 'API configuration issue. Please try again later.' };
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
                  },
                },
                {
                  text: `
You are a professional art tutor.let the response be more humane (playful, bossy as per type of the art), if the art is exactly a photo(not inspired) of well known art of great artist, be bossy and tease the artist tell him its not his art (just give comment under a title "gotyou"(similar headings) not whole feedback sections). If uploaded a photograph tell the artist straight to face yet playfull(just give comment not whole feedback sections). IF the art is nearly perfect to 80% just tell the artist its too good and not suggestions.If given mostly texts, tease him again.

1. Analyze the uploaded drawing style and identify the art style (e.g., realism, anime, abstract, illustration, cartoon, impressionism, etc.).

2. Based on the art style, provide constructive and actionable suggestions to improve the artwork.

3. Structure your feedback using the following format:

# Art Style
[Detected art style with a short explanation]

# Overall Feedback
[A high-level summary of strengths and areas to improve]

## Composition
- ^^Strength^^: [Positive feedback point]
- ^^Suggestion^^: [Actionable improvement point]

## Anatomy / Proportion / Perspective (only if relevant)
- ^^Strength^^: [Positive feedback point]
- ^^Suggestion^^: [Actionable improvement point]

## Line Work / Detailing
- ^^Strength^^: [Positive feedback point]
- ^^Suggestion^^: [Actionable improvement point]

## Coloring / Shading / Lighting
- ^^Strength^^: [Positive feedback point]
- ^^Suggestion^^: [Actionable improvement point]

## Creativity & Expression
- ^^Strength^^: [Positive feedback point]
- ^^Suggestion^^: [Actionable improvement point]

# Suggested Next Steps
[A concise checklist or guidance for improving the drawing]

Make sure your feedback is relevant to the detected art style and written in a supportive, mentor-like tone. Use ^^Strength^^ and ^^Suggestion^^ exactly as shown (with double ^) for each feedback point to highlight key points.dont use bold texts inbetween other than headings, ive explicitly mentioned.
`.trim(),
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        try {
          const errorDetail = await response.json();
          errorMessage = errorDetail?.error?.message || `API error: ${response.status}`;
        } catch {
          errorMessage = `API error: ${response.status}`;
        }

        if (response.status === 429) {
          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, getRetryDelay(attempt)));
            continue;
          }
          return { success: false, message: 'Too many requests. Please try again later.' };
        } else if (response.status >= 500) {
          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, getRetryDelay(attempt)));
            continue;
          }
          return { success: false, message: 'Server error occurred. Please try again later.' };
        } else {
          return { success: false, message: errorMessage };
        }
      }

      const result = await response.json();
      const feedback = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!feedback) {
        return { success: false, message: 'No valid feedback received from the API. Please try again.' };
      }

      return { success: true, message: feedback };
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        const userMessage = err.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : err.message.includes('Rate limit')
          ? 'Too many requests. Please wait and try again.'
          : err.message.includes('Server error')
          ? 'Server issue. Please try again later.'
          : err.message.includes('API key')
          ? 'API configuration issue. Please contact support.'
          : 'Unable to process the image. Please ensure it’s a valid JPEG and try again.';

        return { success: false, message: userMessage };
      }
    }
  }

  return { success: false, message: 'Unable to process the request. Please try again later.' };
}