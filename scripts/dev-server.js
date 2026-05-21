import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Manually parse .env file to support older Node versions
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');
let apiKey = '';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const matches = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
    if (matches && matches[1]) {
      apiKey = matches[1].trim();
    }
  }
} catch (err) {
  console.error('Failed to read .env file:', err);
}

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY not found in local .env file. Direct Gemini calls will fail.');
} else {
  console.log('✅ Loaded GEMINI_API_KEY from local .env');
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

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured in local .env' }));
          return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

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
