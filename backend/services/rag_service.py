"""
RAG (Retrieval-Augmented Generation) Service for Guide Startup Tunisie.
Integrates:
- Query normalization (spelling, missing spaces, accents, Franco-Tunisian phrasing)
- Multi-query rewriting for semantic search expansion
- Multi-candidate Qdrant retrieval (topK=8, threshold=0.35, maxContext=5)
- General entrepreneurship guidance vs specific regulatory claims
- Automatic user-language detection (French, English, Arabic)
- Verified sources deduplication { title, url, publisher, score }
- Zero leak of internal vector/technical terms to end users
"""
import os
import logging
from typing import Dict, Any, List, Optional
import requests

from .qdrant_service import retrieve_relevant_context
from .query_normalizer import (
    normalize_query,
    rewrite_query_for_search,
    detect_language,
    detect_query_intent
)

logger = logging.getLogger(__name__)

MANDATORY_DISCLAIMER_FR = (
    "Note : Ces conseils sont fournis à titre éducatif et informatif d'après le cadre officiel "
    "du Startup Act et de la réglementation tunisienne. Ils ne remplacent pas une consultation juridique ou fiscale certifiée."
)
MANDATORY_DISCLAIMER_EN = (
    "Notice: This guidance is provided for educational and informational purposes based on the "
    "Tunisian Startup Act and official regulations. It does not constitute formal legal, tax, or financial advice."
)
MANDATORY_DISCLAIMER_AR = (
    "ملاحظة: هذه الإرشادات مقدمة لأغراض إعلامية وتوجيهية وفق قانون المؤسسات الناشئة التونسي، ولا تعتبر استشارة قانونية أو جبائية رسمية."
)


def get_disclaimer(lang: str) -> str:
    if lang == 'en':
        return MANDATORY_DISCLAIMER_EN
    elif lang == 'ar':
        return MANDATORY_DISCLAIMER_AR
    return MANDATORY_DISCLAIMER_FR


def build_system_prompt(role: str, lang: str, intent: str) -> str:
    """Builds system instructions according to user role, language, and query intent."""
    role_instruction = (
        "Vous vous adressez à un FONDATEUR D'ENTREPRISE / ENTREPRENEUR. "
        "Privilégiez les étapes pratiques de création (SARL/SUARL, RNE), les critères du label Startup Act, "
        "la Bourse de Startup (jusqu'à 5 000 TND/mois), les exonérations fiscales et le compte spécial en devises."
        if role == 'startup' else
        ("Vous vous adressez à un INVESTISSEUR (Business Angel, fonds VC, investisseur corporatif). "
         "Privilégiez la due diligence, le dégrèvement fiscal total sur bénéfices réinvestis, l'exonération "
         "des plus-values et les mécanismes de protection des devises via la BCT."
         if role == 'investor' else
         "Vous vous adressez à un ADMINISTRATEUR DE LA PLATEFORME. Fournissez des explications complètes et neutres.")
    )

    lang_instruction = (
        "LANGUE OBLIGATOIRE : Répondez STRICTEMENT en FRANÇAIS, dans un style professionnel, clair et encourageant."
        if lang == 'fr' else
        ("MANDATORY LANGUAGE: Answer STRICTLY in ENGLISH in a professional and clear tone."
         if lang == 'en' else
         "اللغة الإلزامية: أجب باللغة العربية بأسلوب واضح ومهني.")
    )

    intent_instruction = (
        "L'utilisateur pose une question de RÉGLEMENTATION PRÉCISE (fiscalité, montant, article de loi, critères formels). "
        "Appuyez-vous impérativement sur le contexte vérifié fourni. Ne fabriquez aucun chiffre ni pourcentage."
        if intent == 'specific_legal' else
        "L'utilisateur pose une question GÉNÉRALE D'ENTREPRENEURIAT (étapes de création, MVP, démarrage, pitch). "
        "Fournissez une explication claire et pratique, enrichie par les spécificités du contexte tunisien disponible."
    )

    return (
        "You are Guide Startup Tunisie, an AI assistant integrated into StartupY, a platform for Tunisian startups and investors.\n\n"
        "Your goal is to provide practical, concise and understandable guidance.\n\n"
        f"{role_instruction}\n"
        f"{lang_instruction}\n"
        f"{intent_instruction}\n\n"
        "CRITICAL RULES:\n"
        "1. Use retrieved knowledge-base context for Tunisian laws, Startup Act, financial incentives, "
        "administrative procedures and regulatory claims.\n"
        "2. For general entrepreneurship questions, you may provide standard startup guidance even when the vector database has limited context.\n"
        "3. Never fabricate legal, tax, financial or regulatory facts.\n"
        "4. If only part of the requested information is supported by verified sources, answer the supported/general parts "
        "and clearly identify what requires further verification.\n"
        "5. Do not reject an entire question merely because retrieval confidence is low.\n"
        "6. Always respond in the user's language.\n"
        "7. All monetary figures and valuations must be expressed in Tunisian Dinars (TND).\n"
        "8. NEVER mention embeddings, vector search, Qdrant, similarity thresholds, chunks or internal RAG implementation to the user.\n"
        f"9. Conclude your response with:\n\n{get_disclaimer(lang)}"
    )


def call_llm(system_prompt: str, user_prompt: str) -> Optional[str]:
    """
    Invokes available LLM providers in sequence:
    1. Groq (qwen/qwen3.8-27b or openai/gpt-oss-120b - ultra fast)
    2. NVIDIA NIM (Moonshot Kimi-K3 / specified model)
    Returns None if all cloud LLMs fail.
    """
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if groq_key and not groq_key.startswith("your_"):
        for groq_model in ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "allam-2-7b"]:
            try:
                res = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {groq_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": groq_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.25,
                        "max_tokens": 1024
                    },
                    timeout=12
                )
                if res.status_code == 200:
                    content = res.json()["choices"][0]["message"]["content"]
                    if content and content.strip():
                        return content.strip()
            except Exception as e:
                logger.warning("Groq (%s) call error: %s", groq_model, e)

    nvidia_key = os.getenv("NVIDIA_API_KEY", "").strip()
    nvidia_model = os.getenv("NVIDIA_MODEL", "moonshotai/kimi-k3").strip()
    nvidia_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").strip()

    if nvidia_key and not nvidia_key.startswith("your_"):
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
                    "temperature": 0.2,
                    "max_tokens": 1024
                },
                timeout=12
            )
            if res.status_code == 200:
                content = res.json()["choices"][0]["message"]["content"]
                if content and content.strip():
                    return content.strip()
        except Exception as e:
            logger.warning("NVIDIA NIM call error: %s", e)

    return None


def generate_rag_response(role: str, question: str) -> Dict[str, Any]:
    """
    Production-ready RAG Pipeline:
    1. Normalizes user query (spelling, missing spaces, accents, Franco-Tunisian phrasing).
    2. Rewrites into search queries.
    3. Executes multi-query semantic search in Qdrant (topK=8, threshold=0.35, maxContext=5).
    4. Formats clean, deduplicated sources: { title, url, publisher, score }.
    5. Detects user language and query intent.
    6. Calls LLM with balanced guidance and grounding.
    """
    raw_query = question.strip() if question else ""
    if not raw_query:
        return {
            "answer": "Veuillez poser votre question sur les startups ou l'investissement en Tunisie.",
            "sources": []
        }

    # 1. Normalize Query
    normalized_q = normalize_query(raw_query)

    # 2. Rewrite Query into search expansion queries
    search_queries = rewrite_query_for_search(normalized_q)

    # 3. Detect Language and Intent
    lang = detect_language(raw_query)
    intent = detect_query_intent(normalized_q)

    # Developer logging
    logger.info("=== [DEV LOG: RAG QUERY PIPELINE] ===")
    logger.info("Original query:   '%s'", raw_query)
    logger.info("Normalized query: '%s'", normalized_q)
    logger.info("Rewritten queries: %s", search_queries)
    logger.info("Detected Language: %s | Intent: %s | Role: %s", lang, intent, role)

    # 4. Multi-Query Retrieval from Qdrant
    retrieved_chunks = retrieve_relevant_context(
        query_input=search_queries,
        top_k=8,
        max_context=5,
        score_threshold=0.35
    )

    # 5. Format & Deduplicate Sources
    formatted_sources = []
    seen_titles = set()
    for c in retrieved_chunks:
        title = c.get("title", "Document vérifié")
        if title and title not in seen_titles:
            seen_titles.add(title)
            formatted_sources.append({
                "title": title,
                "url": c.get("url", ""),
                "publisher": c.get("source", "Tunisian Knowledge Base"),
                "score": round(c.get("score", 1.0), 3)
            })

    # 6. Build Context String
    if retrieved_chunks:
        context_blocks = []
        for idx, c in enumerate(retrieved_chunks, 1):
            context_blocks.append(
                f"[Document {idx}]\n"
                f"Titre: {c['title']}\n"
                f"Catégorie: {c['category']}\n"
                f"Source: {c['source']}\n"
                f"Contenu:\n{c['text']}"
            )
        context_str = "\n\n---\n\n".join(context_blocks)
    else:
        context_str = "Aucun document réglementaire spécifique trouvé pour cette recherche dans la base."

    # 7. Build Prompts
    system_prompt = build_system_prompt(role, lang, intent)
    user_prompt = (
        f"CONTEXTE TUNISIEN VÉRIFIÉ (BASE DE CONNAISSANCES) :\n"
        f"{context_str}\n\n"
        f"QUESTION DE L'UTILISATEUR :\n"
        f"{normalized_q}\n\n"
        f"Répondez avec clarté et précision à la question de l'utilisateur."
    )

    # 8. Call LLM
    answer = call_llm(system_prompt, user_prompt)

    # 9. Fallback handling if LLM gateway unavailable
    if not answer:
        logger.info("LLM gateway unavailable, providing structured synthesis.")
        if retrieved_chunks:
            items_str = "\n".join([f"• **{c['title']}** : {c['text'][:200]}..." for c in retrieved_chunks[:3]])
            answer = (
                f"Voici les dispositions vérifiées pour répondre à votre question (*{normalized_q}*) :\n\n"
                f"{items_str}\n\n"
                f"{get_disclaimer(lang)}"
            )
        else:
            answer = (
                f"Pour créer votre projet en Tunisie, voici la démarche générale recommandée :\n"
                f"1. **Validation de l'idée & MVP** : Définir la proposition de valeur et tester auprès des premiers clients.\n"
                f"2. **Choix de la forme juridique** : SARL pour plusieurs cofondateurs ou SUARL pour un fondateur unique.\n"
                f"3. **Immatriculation légale** : Enregistrement au Registre National des Entreprises (RNE) et obtention du matricule fiscal.\n"
                f"4. **Candidature au Startup Act** : Déposer le dossier sur startup.gov.tn pour obtenir le label et bénéficier de la Bourse de Startup et des exonérations fiscales.\n\n"
                f"{get_disclaimer(lang)}"
            )

    return {
        "answer": answer,
        "sources": formatted_sources
    }
