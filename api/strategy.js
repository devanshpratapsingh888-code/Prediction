import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openRouterModel = process.env.OPENROUTER_MODEL || 'google/gemma-2-9b-it:free';

  if (!openRouterKey && !geminiKey) {
    return res.status(500).json({ error: 'Neither OPENROUTER_API_KEY nor GEMINI_API_KEY is configured on the server' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    let text = '';

    if (openRouterKey) {
      // Use OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://cricket-strategy-engine.vercel.app', // Production or fallback referer
          'X-Title': 'Cricket Strategy Engine'
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      if (!json.choices || json.choices.length === 0) {
        throw new Error('OpenRouter returned an empty response choices list');
      }
      text = json.choices[0].message.content;
    } else {
      // Fallback to Google Gemini
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    // Attempt to parse — return raw text too so client can debug if needed
    try {
      const parsed = JSON.parse(text);
      return res.status(200).json({ strategy: parsed, raw: text });
    } catch (parseErr) {
      try {
        // Strip markdown fences if AI ignored the mimeType setting
        const clean = text.replace(/```json|```/gi, '').trim();
        const parsed = JSON.parse(clean);
        return res.status(200).json({ strategy: parsed, raw: text });
      } catch (innerErr) {
        // If it's not JSON, return it as raw string so free-text prompts like matchups don't crash
        return res.status(200).json({ strategy: text, raw: text, isRaw: true });
      }
    }
  } catch (err) {
    console.error('API execution error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate strategy',
    });
  }
}
