"""
Embedding Service for StartupBridge AI Tunisia RAG Pipeline.
Uses FastEmbed (BAAI/bge-small-en-v1.5) producing 384-dimensional dense vectors.
Exact same embedding model is used for document ingestion and query retrieval.
"""
from typing import List, Union
import logging

logger = logging.getLogger(__name__)

# Model configuration
DEFAULT_MODEL_NAME = "BAAI/bge-small-en-v1.5"
VECTOR_DIMENSION = 384

_model_instance = None


def get_embedding_model():
    """Lazy-load the FastEmbed TextEmbedding model singleton."""
    global _model_instance
    if _model_instance is None:
        try:
            from fastembed import TextEmbedding
            logger.info("Initializing FastEmbed TextEmbedding model: %s", DEFAULT_MODEL_NAME)
            _model_instance = TextEmbedding(model_name=DEFAULT_MODEL_NAME)
        except Exception as e:
            logger.error("Failed to initialize FastEmbed model: %s", e)
            raise RuntimeError(f"FastEmbed embedding model initialization failed: {e}")
    return _model_instance


def generate_embedding(text: str) -> List[float]:
    """
    Generate a normalized vector embedding for a single text string.
    Returns a list of 384 floats.
    """
    if not text or not text.strip():
        return [0.0] * VECTOR_DIMENSION

    model = get_embedding_model()
    embeddings = list(model.embed([text]))
    if not embeddings:
        return [0.0] * VECTOR_DIMENSION
    return embeddings[0].tolist()


def generate_embeddings(texts: List[str], batch_size: int = 32) -> List[List[float]]:
    """
    Generate vector embeddings for a list of texts in batches.
    """
    if not texts:
        return []

    model = get_embedding_model()
    results = []
    # FastEmbed generator processes in efficient batches
    for emb in model.embed(texts, batch_size=batch_size):
        results.append(emb.tolist())
    return results
