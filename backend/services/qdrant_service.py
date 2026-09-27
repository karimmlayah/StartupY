"""
Qdrant Vector Database Service for StartupBridge AI Tunisia.
Manages collection lifecycle, point indexing, and semantic similarity search.

SECURITY NOTICE:
QDRANT_API_KEY and QDRANT_URL are read strictly on the server side.
They are never sent or exposed to the client/frontend.
"""
import os
import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from pathlib import Path

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from .embedding_service import generate_embedding, generate_embeddings, VECTOR_DIMENSION

logger = logging.getLogger(__name__)

# Server-side environment variables
QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()
DEFAULT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION", "startup_knowledge").strip() or "startup_knowledge"

# Default persistent directory inside backend if remote QDRANT_URL is not set
BACKEND_DIR = Path(__file__).resolve().parent.parent
LOCAL_DB_PATH = str(BACKEND_DIR / "qdrant_db")

_client_instance: Optional[QdrantClient] = None


def get_qdrant_client() -> QdrantClient:
    """
    Initializes and returns a singleton QdrantClient.
    If QDRANT_URL is provided, connects to the remote/cloud Qdrant instance.
    Otherwise, uses the local persistent disk database (qdrant_db).
    """
    global _client_instance
    if _client_instance is not None:
        return _client_instance

    url = os.getenv("QDRANT_URL", "").strip()
    api_key = os.getenv("QDRANT_API_KEY", "").strip()

    if url:
        logger.info("Connecting to remote Qdrant cluster at %s", url)
        _client_instance = QdrantClient(
            url=url,
            api_key=api_key if api_key else None,
            timeout=30.0
        )
    else:
        logger.info("Initializing local persistent Qdrant instance at %s", LOCAL_DB_PATH)
        Path(LOCAL_DB_PATH).mkdir(parents=True, exist_ok=True)
        _client_instance = QdrantClient(path=LOCAL_DB_PATH, force_disable_check_same_thread=True)

    return _client_instance


def verify_or_create_collection(collection_name: Optional[str] = None) -> bool:
    """
    Automatically verifies:
    - Qdrant connection
    - Collection existence
    - Vector dimensions (384)
    - Distance metric (Cosine)
    Creates the collection automatically if it does not exist.
    """
    collection = collection_name or os.getenv("QDRANT_COLLECTION", DEFAULT_COLLECTION_NAME)
    client = get_qdrant_client()

    try:
        exists = client.collection_exists(collection_name=collection)
        if not exists:
            logger.info("Creating Qdrant collection '%s' (dim: %d, metric: Cosine)...", collection, VECTOR_DIMENSION)
            client.create_collection(
                collection_name=collection,
                vectors_config=VectorParams(
                    size=VECTOR_DIMENSION,
                    distance=Distance.COSINE
                )
            )
            logger.info("Collection '%s' created successfully.", collection)
            return True

        # Verify existing collection configuration
        info = client.get_collection(collection_name=collection)
        vectors_config = info.config.params.vectors
        size = getattr(vectors_config, "size", None)
        distance = getattr(vectors_config, "distance", None)
        logger.info("Collection '%s' exists (dim: %s, distance: %s).", collection, size, distance)
        return True

    except Exception as e:
        logger.error("Error verifying/creating Qdrant collection '%s': %s", collection, e)
        raise


def upsert_knowledge_chunks(chunks: List[Dict[str, Any]], collection_name: Optional[str] = None) -> int:
    """
    Upserts semantic knowledge chunks into Qdrant.
    Generates embeddings if missing and applies deterministic point IDs to prevent duplicates.

    Each point payload contains:
    - title
    - source
    - category
    - url
    - text
    - language
    - updated_at
    """
    if not chunks:
        return 0

    collection = collection_name or os.getenv("QDRANT_COLLECTION", DEFAULT_COLLECTION_NAME)
    verify_or_create_collection(collection)
    client = get_qdrant_client()

    # Extract texts needing embeddings
    texts_to_embed = []
    indices_needing_embed = []
    for idx, c in enumerate(chunks):
        if "vector" not in c or not c["vector"]:
            texts_to_embed.append(c["text"])
            indices_needing_embed.append(idx)

    if texts_to_embed:
        embeddings = generate_embeddings(texts_to_embed)
        for idx, emb in zip(indices_needing_embed, embeddings):
            chunks[idx]["vector"] = emb

    points = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for idx, c in enumerate(chunks):
        # Deterministic UUID based on url + title + text snippet to avoid duplicate points
        seed = f"{c.get('url', '')}:{c.get('title', '')}:{c.get('text', '')[:100]}"
        point_id = str(uuid.uuid5(uuid.NAMESPACE_URL, seed))

        payload = {
            "title": c.get("title", "Tunisia Startup Knowledge"),
            "source": c.get("source", "Tunisia Official / Ecosystem"),
            "category": c.get("category", "General"),
            "url": c.get("url", ""),
            "text": c.get("text", ""),
            "language": c.get("language", "en"),
            "updated_at": c.get("updated_at", now_iso)
        }

        points.append(
            PointStruct(
                id=point_id,
                vector=c["vector"],
                payload=payload
            )
        )

    # Upsert in batches of 64
    batch_size = 64
    total_upserted = 0
    for i in range(0, len(points), batch_size):
        batch = points[i:i + batch_size]
        client.upsert(collection_name=collection, points=batch)
        total_upserted += len(batch)

    logger.info("Successfully upserted %d points to Qdrant collection '%s'.", total_upserted, collection)
    return total_upserted


# Configurable RAG parameters
DEFAULT_TOP_K = int(os.getenv("RAG_TOP_K", "8"))
DEFAULT_MAX_CONTEXT = int(os.getenv("RAG_MAX_CONTEXT", "5"))
DEFAULT_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", "0.35"))


def retrieve_relevant_context(
    query_input: Any, 
    top_k: Optional[int] = None, 
    max_context: Optional[int] = None,
    score_threshold: Optional[float] = None, 
    collection_name: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Enhanced Multi-Query Semantic Retrieval in Qdrant:
    1. Supports single query string or list of rewritten query variations.
    2. Retrieves up to top_k candidates (default 8) per query.
    3. Merges, deduplicates by point ID, and sorts by highest cosine score.
    4. Applies configurable score_threshold (default 0.35).
    5. Returns top max_context (default 5) most relevant chunks.
    6. Emits structured developer logs for monitoring retrieval quality.
    """
    if not query_input:
        return []

    # Standardize input to list of search queries
    if isinstance(query_input, str):
        search_queries = [query_input.strip()] if query_input.strip() else []
    elif isinstance(query_input, (list, tuple)):
        search_queries = [str(q).strip() for q in query_input if str(q).strip()]
    else:
        search_queries = [str(query_input).strip()]

    if not search_queries:
        return []

    effective_top_k = top_k or DEFAULT_TOP_K
    effective_max_context = max_context or DEFAULT_MAX_CONTEXT
    effective_threshold = score_threshold if score_threshold is not None else DEFAULT_SCORE_THRESHOLD
    collection = collection_name or os.getenv("QDRANT_COLLECTION", DEFAULT_COLLECTION_NAME)

    verify_or_create_collection(collection)
    client = get_qdrant_client()

    merged_candidates: Dict[str, Dict[str, Any]] = {}

    for query_str in search_queries:
        try:
            query_vector = generate_embedding(query_str)
            response = client.query_points(
                collection_name=collection,
                query=query_vector,
                limit=effective_top_k,
                with_payload=True
            )

            matched_points = response.points if hasattr(response, "points") else []
            for p in matched_points:
                score = float(p.score) if hasattr(p, "score") and p.score is not None else 1.0
                pid = str(p.id)

                payload = p.payload or {}
                chunk_data = {
                    "id": pid,
                    "score": score,
                    "title": payload.get("title", "Untitled Document"),
                    "source": payload.get("source", "Knowledge Base"),
                    "category": payload.get("category", "General"),
                    "url": payload.get("url", ""),
                    "text": payload.get("text", ""),
                    "language": payload.get("language", "en"),
                    "updated_at": payload.get("updated_at", "")
                }

                # If candidate already seen from another query variation, keep the highest score
                if pid not in merged_candidates or score > merged_candidates[pid]["score"]:
                    merged_candidates[pid] = chunk_data

        except Exception as e:
            logger.error("Error retrieving context for query '%s': %s", query_str, e)

    # Sort all candidates by score descending
    all_sorted = sorted(merged_candidates.values(), key=lambda x: x["score"], reverse=True)

    # Filter by threshold
    filtered_results = [c for c in all_sorted if c["score"] >= effective_threshold]

    # Select top max_context
    final_results = filtered_results[:effective_max_context]

    # Structured developer logging
    logger.info("=== [DEV LOG: QDRANT RETRIEVAL] ===")
    logger.info("Queries executed: %s", search_queries)
    logger.info("Total unique candidates found: %d | Passed threshold (>= %.2f): %d | Retained: %d",
                len(all_sorted), effective_threshold, len(filtered_results), len(final_results))
    for idx, c in enumerate(final_results, 1):
        preview = c['text'].replace('\n', ' ')[:100]
        logger.info("  [%d] Score: %.4f | Title: '%s' | Preview: '%s...'", idx, c['score'], c['title'], preview)
    logger.info("===================================")

    return final_results
