// api/models.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const models = await genAI.listModels();
    res.status(200).json(models);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
