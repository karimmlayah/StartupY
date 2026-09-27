import os
import re
import requests
from .knowledge_base import TUNISIA_KNOWLEDGE_BASE

MANDATORY_DISCLAIMER = "Information for educational guidance only — not legal, tax, financial or investment advice."
INSUFFICIENT_CONTEXT_MESSAGE = "I do not have enough verified Tunisia-specific information to answer this reliably. Please consult an official adviser or source."

def retrieve_context_chunks(role, question):
    normalized = re.sub(r'[^a-zA-Z0-9\s]', ' ', (question or "").lower())
    tokens = [t for t in normalized.split() if len(t) > 2]

    scored = []
    for chunk in TUNISIA_KNOWLEDGE_BASE:
        score = 0
        if role == 'startup':
            if chunk['category'] in ['Business creation and registration', 'Pitch deck and investment readiness', 'Funding options', 'Intellectual property']:
                score += 1.5
        elif role == 'investor':
            if chunk['category'] in ['Investor due diligence', 'Responsible investment and risk', 'Funding options']:
                score += 1.5

        for token in tokens:
            if any(token in k or k in token for k in chunk['keywords']):
                score += 4
            if token in chunk['title'].lower():
                score += 3
            if token in chunk['category'].lower():
                score += 2
            if token in chunk['content'].lower():
                score += 1

        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored[:3]]

def generate_local_answer(role, question, retrieved_chunks):
    if not question or len(question.strip()) < 3:
        return f"{INSUFFICIENT_CONTEXT_MESSAGE}\n\n{MANDATORY_DISCLAIMER}"

    snippets = "\n\n".join([f"• **{c['title']} ({c['category']}):**\n  {c['content']}" for c in retrieved_chunks])
    return f"Based on our structured educational repository for Tunisia:\n\n{snippets}\n\n{MANDATORY_DISCLAIMER}"

def generate_rag_response(role, question):
    retrieved_chunks = retrieve_context_chunks(role, question)
    sources = [{
        'title': c['title'],
        'category': c['category'],
        'sourceLabel': c['sourceLabel'],
        'verified': c['verified']
    } for c in retrieved_chunks]

    nvidia_key = os.getenv('NVIDIA_API_KEY')
    nvidia_model = os.getenv('NVIDIA_MODEL', 'moonshotai/kimi-k3')
    nvidia_url = os.getenv('NVIDIA_BASE_URL', 'https://integrate.api.nvidia.com/v1')

    gemini_key = os.getenv('GEMINI_API_KEY')
    groq_key = os.getenv('GROQ_API_KEY')

    context_str = "\n\n".join([
        f"[Source {i+1}] Title: {c['title']}\nCategory: {c['category']}\nContent: {c['content']}"
        for i, c in enumerate(retrieved_chunks)
    ])

    system_prompt = (
        f"You are the StartupY Educational Guide for {role}s.\n"
        "STRICT INSTRUCTIONS:\n"
        "1. Base your answer EXCLUSIVELY on the provided context.\n"
        "2. All currency must be in Tunisian Dinars (TND).\n"
        f"3. Always conclude with: '{MANDATORY_DISCLAIMER}'\n"
    )

    user_prompt = f"CONTEXT:\n{context_str}\n\nQUESTION: {question}"

    # 1. Try NVIDIA NIM
    if nvidia_key and not nvidia_key.startswith('your_'):
        try:
            res = requests.post(
                f"{nvidia_url.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {nvidia_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": nvidia_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 800
                },
                timeout=12
            )
            if res.status_code == 200:
                answer = res.json()['choices'][0]['message']['content']
                return {'answer': answer, 'sources': sources}
        except Exception as e:
            print("NVIDIA NIM call failed, attempting fallback:", e)

    # 2. Try Groq
    if groq_key and not groq_key.startswith('your_'):
        try:
            res = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 800
                },
                timeout=10
            )
            if res.status_code == 200:
                answer = res.json()['choices'][0]['message']['content']
                return {'answer': answer, 'sources': sources}
        except Exception as e:
            print("Groq call failed, attempting fallback:", e)

    # 3. Local fallback
    local_answer = generate_local_answer(role, question, retrieved_chunks)
    return {'answer': local_answer, 'sources': sources}
