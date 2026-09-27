import { TUNISIA_KNOWLEDGE_BASE } from './data/tunisiaKnowledgeBase.js';

const MANDATORY_DISCLAIMER = "Information for educational guidance only — not legal, tax, financial or investment advice.";
const INSUFFICIENT_CONTEXT_MESSAGE = "I do not have enough verified Tunisia-specific information to answer this reliably. Please consult an official adviser or source.";

/**
 * Retrieve the 3 most relevant chunks from the Tunisia Knowledge Base
 * based on keyword matching and role relevance.
 */
export function retrieveContextChunks(role, question) {
  const normalized = (question || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = normalized.split(/\s+/).filter(t => t.length > 2);

  const scored = TUNISIA_KNOWLEDGE_BASE.map(chunk => {
    let score = 0;

    // Role-based baseline affinity
    if (role === 'startup') {
      if (['Business creation and registration', 'Pitch deck and investment readiness', 'Funding options', 'Intellectual property'].includes(chunk.category)) {
        score += 1.5;
      }
    } else if (role === 'investor') {
      if (['Investor due diligence', 'Responsible investment and risk', 'Funding options'].includes(chunk.category)) {
        score += 1.5;
      }
    }

    // Token matching across keywords, title, category, and content
    for (const token of tokens) {
      if (chunk.keywords.some(k => k.includes(token) || token.includes(k))) {
        score += 4;
      }
      if (chunk.title.toLowerCase().includes(token)) {
        score += 3;
      }
      if (chunk.category.toLowerCase().includes(token)) {
        score += 2;
      }
      if (chunk.content.toLowerCase().includes(token)) {
        score += 1;
      }
    }

    return { chunk, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take top 3 chunks
  const top3 = scored.slice(0, 3).map(item => item.chunk);

  return top3;
}

/**
 * Generate a local educational answer when no API key is present or when API fails
 */
export function generateLocalRAGAnswer(role, question, retrievedChunks) {
  const normalized = (question || "").toLowerCase();

  // If question is completely empty or meaningless
  if (!question || question.trim().length < 3) {
    return `${INSUFFICIENT_CONTEXT_MESSAGE}\n\n${MANDATORY_DISCLAIMER}`;
  }

  // Synthesis from retrieved chunks
  const chunkSnippets = retrievedChunks.map(c => `• **${c.title} (${c.category}):**\n  ${c.content}`).join("\n\n");

  const answer = `Based on our structured educational repository for Tunisia:

${chunkSnippets}

${MANDATORY_DISCLAIMER}`;

  return answer;
}

/**
 * Call an LLM with retrieved chunks as context.
 */
export async function generateRAGResponse(role, question) {
  const retrievedChunks = retrieveContextChunks(role, question);
  const sources = retrievedChunks.map(c => ({
    title: c.title,
    category: c.category,
    sourceLabel: c.sourceLabel,
    verified: c.verified
  }));

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;
  const nvidiaApiKey = process.env.NVIDIA_API_KEY;
  const nvidiaModel = process.env.NVIDIA_MODEL || 'moonshotai/kimi-k3';
  const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

  // Build the strict prompt context
  const contextString = retrievedChunks.map((c, i) => 
    `[Source ${i + 1}] Title: ${c.title}\nCategory: ${c.category}\nContent: ${c.content}`
  ).join("\n\n");

  const systemInstructions = `You are the StartupBridge AI Tunisia Assistant. You provide cautious, educational information to Tunisian founders and investors.
Strict Rules:
- Answer ONLY using the facts present in the provided Tunisia context chunks below.
- Do NOT invent specific laws, statutes, deadlines, numerical fees, government programs, or official external URLs.
- If the provided context is insufficient to answer the user question, you MUST say exactly: "${INSUFFICIENT_CONTEXT_MESSAGE}"
- Keep answers clear, structured with bullet points where appropriate, and respectful of the Tunisian startup ecosystem.
- End your final output with exactly this sentence:
"${MANDATORY_DISCLAIMER}"`;

  // 1. NVIDIA NIM / Kimi-K3 is the primary live model.
  if (nvidiaApiKey && !nvidiaApiKey.startsWith('your_')) {
    try {
      const response = await fetch(`${nvidiaBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nvidiaApiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: nvidiaModel,
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: `=== CONTEXT CHUNKS ===\n${contextString}\n\n=== USER QUESTION (Role: ${role}) ===\n${question}` }
          ],
          temperature: 0.2,
          max_tokens: 1200,
          stream: false,
          reasoning_effort: 'medium'
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`NVIDIA NIM returned ${response.status}: ${details.slice(0, 300)}`);
      }

      const data = await response.json();
      let answerText = data.choices?.[0]?.message?.content;
      if (answerText) {
        if (!answerText.includes(MANDATORY_DISCLAIMER)) answerText += `\n\n${MANDATORY_DISCLAIMER}`;
        return { answer: answerText.trim(), sources, mode: 'live', provider: 'nvidia', model: nvidiaModel };
      }
    } catch (error) {
      console.error('NVIDIA NIM generation failed:', error.message);
    }
  }

  // 2. Try Gemini if configured
  if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
    const geminiModels = ['gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-1.5-flash'];
    for (const model of geminiModels) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemInstructions}\n\n=== CONTEXT CHUNKS ===\n${contextString}\n\n=== USER QUESTION (Role: ${role}) ===\n${question}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answerText) {
            if (!answerText.includes(MANDATORY_DISCLAIMER)) {
              answerText += `\n\n${MANDATORY_DISCLAIMER}`;
            }
            return {
              answer: answerText.trim(),
              sources,
              mode: "live"
            };
          }
        }
      } catch (err) {
        // try next model or fallback
      }
    }
  }

  // 3. Try Groq if configured
  if (groqApiKey && groqApiKey !== 'your_groq_api_key_here') {
    const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'];
    for (const model of groqModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemInstructions },
              { role: 'user', content: `=== CONTEXT CHUNKS ===\n${contextString}\n\n=== USER QUESTION (Role: ${role}) ===\n${question}` }
            ],
            temperature: 0.2,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const data = await response.json();
          let answerText = data.choices?.[0]?.message?.content;
          if (answerText) {
            if (!answerText.includes(MANDATORY_DISCLAIMER)) {
              answerText += `\n\n${MANDATORY_DISCLAIMER}`;
            }
            return {
              answer: answerText.trim(),
              sources,
              mode: "live"
            };
          }
        }
      } catch (err) {
        // try next model
      }
    }
  }

  // 4. Fallback: Local Structured RAG Answer
  const localAnswer = generateLocalRAGAnswer(role, question, retrievedChunks);
  return {
    answer: localAnswer,
    sources,
    mode: "demo"
  };
}
