import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.apiKey);

export async function generateAiReport(promptText) {
  console.log("API Called")
  try {
    if (!promptText) throw new Error("Missing prompt");

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(promptText);
    const text = result.response.text();

    return { text, raw: result.response };
  } catch (err) {
    console.error("Proxy error:", err);
    return { error: String(err) };
  }
}
