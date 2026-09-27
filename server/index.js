import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRAGResponse } from './ragService.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing and JSON body parsing
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'StartupBridge AI Tunisia RAG Server',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here'),
  });
});

/**
 * POST /api/ai/guide
 * 
 * Expected Input:
 * {
 *   "role": "startup" | "investor",
 *   "question": "user question"
 * }
 * 
 * Expected Output:
 * {
 *   "answer": "answer text",
 *   "sources": [
 *     { "title": "Source title", "category": "Business creation" }
 *   ],
 *   "mode": "live" | "demo"
 * }
 */
app.post('/api/ai/guide', async (req, res) => {
  try {
    const { role = 'startup', question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'Missing required field: question'
      });
    }

    const sanitizedRole = (role === 'investor') ? 'investor' : 'startup';
    const result = await generateRAGResponse(sanitizedRole, question.trim());

    return res.json(result);
  } catch (error) {
    console.error('Error processing AI guide request:', error);
    return res.status(500).json({
      error: 'Failed to process AI guide request',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 StartupBridge AI Tunisia RAG server running on port ${PORT}`);
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/ai/guide`);
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    console.log('🔑 Gemini API Key detected: Live AI generation active.');
  } else if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    console.log('🔑 Groq API Key detected: Live AI generation active.');
  } else {
    console.log('ℹ️  No API key configured: Operating in Tunisia RAG Demo mode with local sources.');
  }
});
