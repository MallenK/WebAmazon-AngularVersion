export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: "Missing GOOGLE_AI_API_KEY" }));
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Invalid JSON" }));
  }

  const message = body?.message;
  if (!message) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Missing message" }));
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );

    const data = await r.json();

    if (!r.ok) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Google AI error", data }));
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";

    res.statusCode = 200;
    res.end(JSON.stringify({ text }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Server error", details: String(err) }));
  }
}
