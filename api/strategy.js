import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json', // Forces Gemini to return pure JSON
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Attempt to parse — return raw text too so client can debug if needed
    try {
      const parsed = JSON.parse(text);
      return res.status(200).json({ strategy: parsed, raw: text });
    } catch (parseErr) {
      try {
        // Strip markdown fences if Gemini ignored the mimeType setting
        const clean = text.replace(/```json|```/gi, '').trim();
        const parsed = JSON.parse(clean);
        return res.status(200).json({ strategy: parsed, raw: text });
      } catch (innerErr) {
        // If it's not JSON, return it as raw string so free-text prompts like matchups don't crash
        return res.status(200).json({ strategy: text, raw: text, isRaw: true });
      }
    }
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate strategy',
    });
  }
}
