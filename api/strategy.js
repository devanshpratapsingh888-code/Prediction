// Vercel serverless function — keeps GEMINI_API_KEY server-side
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { matchContext } = req.body;

  if (!matchContext) {
    return res.status(400).json({ error: 'Missing matchContext' });
  }

  // Ensure key is loaded
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(matchContext);
    const text = result.response.text();

    // Strip markdown code fences if Gemini wraps JSON in ```json ... ```
    const clean = text.replace(/```json|```/g, '').trim();

    res.status(200).json({ strategy: clean });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate strategy via Gemini API: ' + error.message });
  }
}
