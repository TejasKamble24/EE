
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client following the provided guidelines.
// Always use the process.env.API_KEY directly as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTeachingAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "You are an expert Teaching Coach. Your goal is to provide practical, empathetic, and actionable advice to school teachers. Keep responses concise, supportive, and focused on classroom implementation.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my teaching resources right now. Please try again in a moment!";
  }
};
