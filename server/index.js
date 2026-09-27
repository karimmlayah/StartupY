import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRAGResponse } from './ragService.js';
import { issueMeetingToken } from './zegoTokenService.js';

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
    service: 'StartupBridge AI Tunisia RAG & Video Meeting Server',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here'),
    zegoConfigured: Boolean(process.env.ZEGO_APP_ID && process.env.ZEGO_SERVER_SECRET && process.env.ZEGO_APP_ID !== 'your_zego_app_id'),
  });
});

/**
 * POST /api/ai/guide
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

/**
 * POST /api/meetings/:meetingId/join-token
 * 
 * Secure backend endpoint for ZEGOCLOUD Video Call Kit token generation.
 * ServerSecret is strictly kept on the backend and NEVER exposed to frontend.
 * 
 * Expected Input:
 * {
 *   "userId": "string",
 *   "userName": "string",
 *   "role": "startup" | "investor",
 *   "meeting": { ... meeting object ... }
 * }
 * 
 * Expected Output:
 * {
 *   "appID": number,
 *   "kitToken": "string",
 *   "roomId": "string",
 *   "userID": "string",
 *   "userName": "string"
 * }
 */
app.post('/api/meetings/:meetingId/join-token', (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId, userName, role, meeting } = req.body;

    if (!meetingId) {
      return res.status(400).json({ error: 'Missing meetingId parameter' });
    }

    // Generate token server-side without leaking server secret
    const tokenData = issueMeetingToken({
      meetingId,
      userId: userId || `user_${Date.now().toString().slice(-4)}`,
      userName: userName || 'Participant',
      role,
      meeting
    });

    return res.json({
      appID: tokenData.appID,
      kitToken: tokenData.kitToken,
      roomId: tokenData.roomId,
      userID: tokenData.userID,
      userName: tokenData.userName
    });
  } catch (err) {
    console.error(`Error generating meeting token for ${req.params.meetingId}:`, err.message);
    return res.status(400).json({
      error: err.message || 'Failed to generate meeting access token'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 StartupBridge AI / Bidaya Tunisia server running on port ${PORT}`);
  console.log(`📡 Endpoints: POST /api/ai/guide, POST /api/meetings/:meetingId/join-token`);
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    console.log('🔑 Gemini API Key detected: Live AI generation active.');
  } else if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    console.log('🔑 Groq API Key detected: Live AI generation active.');
  } else {
    console.log('ℹ️  No LLM API key configured: Operating in Tunisia RAG Demo mode with local sources.');
  }
  if (process.env.ZEGO_APP_ID && process.env.ZEGO_SERVER_SECRET && process.env.ZEGO_APP_ID !== 'your_zego_app_id') {
    console.log('📹 ZEGOCLOUD Video Call Kit: Configured with App ID & Server Secret.');
  } else {
    console.log('📹 ZEGOCLOUD Video Call Kit: Development Token Mode active (Dev App ID & Secret).');
  }
});
