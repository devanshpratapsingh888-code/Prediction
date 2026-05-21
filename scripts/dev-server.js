import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Manually parse .env file to support all Node versions
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');
let geminiKey = '';
let openRouterKey = '';
let openRouterModel = 'google/gemma-2-9b-it:free'; // High-quality free model

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const geminiMatches = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
    if (geminiMatches && geminiMatches[1]) {
      geminiKey = geminiMatches[1].trim();
    }
    
    const openRouterMatches = envContent.match(/^OPENROUTER_API_KEY=(.*)$/m);
    if (openRouterMatches && openRouterMatches[1]) {
      openRouterKey = openRouterMatches[1].trim();
    }
    
    const modelMatches = envContent.match(/^OPENROUTER_MODEL=(.*)$/m);
    if (modelMatches && modelMatches[1]) {
      openRouterModel = modelMatches[1].trim();
    }
  }
} catch (err) {
  console.error('Failed to read .env file:', err);
}

if (openRouterKey) {
  console.log(`✅ Loaded OPENROUTER_API_KEY from local .env (using model: ${openRouterModel})`);
} else if (geminiKey) {
  console.log('✅ Loaded GEMINI_API_KEY from local .env');
} else {
  console.warn('⚠️ Neither GEMINI_API_KEY nor OPENROUTER_API_KEY configured in local .env');
}

// 2. Create the server on port 3001
const PORT = 3001;
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/strategy' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body);
        if (!prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing prompt in request body' }));
          return;
        }

        if (!openRouterKey && !geminiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Neither OPENROUTER_API_KEY nor GEMINI_API_KEY is configured in local .env' }));
          return;
        }

        let text = '';

        if (openRouterKey) {
          // Call OpenRouter API
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'http://localhost:3000',
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
          // Call Google Gemini API
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

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch (parseErr) {
          try {
            const clean = text.replace(/```json|```/gi, '').trim();
            parsed = JSON.parse(clean);
          } catch (innerErr) {
            parsed = text;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ strategy: parsed, raw: text }));
      } catch (err) {
        console.error('Local dev server error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Failed to generate strategy' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Local dev proxy server listening on http://localhost:${PORT}`);
  console.log(`💡 Vite requests to /api/strategy will now be routed here!`);
});
