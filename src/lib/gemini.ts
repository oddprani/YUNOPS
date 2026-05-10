import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getDebuggingSuggestion(logMessage: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "Gemini API key is not configured. Please add it to your secrets.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `You are a Senior DevOps Engineer. Analyze the following error log and provide a concise, technical suggestion for debugging or fixing it.
          
          Log: "${logMessage}"
          
          Guidelines:
          - Be extremely concise.
          - Use technical terminology suitable for DevOps (Docker, Kubernetes, Networking, etc).
          - Provide actionable steps.`
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text || "No suggestion available.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to generate AI suggestion. Please check logs manually.";
  }
}
