import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.status(405).end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    res.status(500).end(JSON.stringify({ error: "Missing GOOGLE_AI_API_KEY" }));
    return;
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  const message = body?.message;
  if (!message) {
    res.status(400).end(JSON.stringify({ error: "Missing message" }));
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // 🔴 ESTE ES EL PUNTO CLAVE
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const text = result.response.text();

    res.status(200).end(JSON.stringify({ text }));
  } catch (err) {
    res.status(500).end(
      JSON.stringify({
        error: "Google AI error",
        details: String(err),
      })
    );
  }
}
