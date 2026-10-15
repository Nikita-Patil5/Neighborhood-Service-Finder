"""Semantic search over services using sentence embeddings + FAISS."""
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

MIN_SCORE = 0.25  # cosine similarity below this is considered irrelevant


class SemanticIndex:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.ids: list[int] = []

    def build(self, items) -> int:
        """items: list of objects with id, name, category, description, location."""
        if not items:
            self.index, self.ids = None, []
            return 0
        texts = [
            f"{i.name}. {i.category}. {i.description or ''}. {i.location or ''}"
            for i in items
        ]
        emb = self.model.encode(texts, normalize_embeddings=True, convert_to_numpy=True)
        emb = emb.astype("float32")
        index = faiss.IndexFlatIP(emb.shape[1])  # inner product == cosine (normalized)
        index.add(emb)
        self.index, self.ids = index, [i.id for i in items]
        return len(self.ids)

    def search(self, query: str, top_k: int = 10):
        if self.index is None or not query.strip():
            return []
        q = self.model.encode([query], normalize_embeddings=True, convert_to_numpy=True)
        k = min(top_k, len(self.ids))
        scores, pos = self.index.search(q.astype("float32"), k)
        return [
            {"id": self.ids[p], "score": round(float(s), 4)}
            for s, p in zip(scores[0], pos[0])
            if p >= 0 and s >= MIN_SCORE
        ]
