"""
FAISS Vector Index for fast similarity search.
Builds an index from product image embeddings and supports nearest-neighbor queries.
"""
import faiss
import numpy as np
import os
import pickle
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class FAISSIndex:
    """Manages a FAISS index for product image similarity search."""

    def __init__(self, dimension: int = 512):
        self.dimension = dimension
        self.index: Optional[faiss.IndexFlatIP] = None
        self.product_ids: list[int] = []

    def build_index(self, embeddings: np.ndarray, product_ids: list[int]):
        """
        Build a FAISS index from embeddings.
        Uses IndexFlatIP (inner product) since vectors are L2-normalized,
        making inner product equivalent to cosine similarity.
        
        Args:
            embeddings: numpy array of shape (N, 512)
            product_ids: list of product IDs corresponding to each embedding
        """
        self.product_ids = product_ids
        self.index = faiss.IndexFlatIP(self.dimension)
        
        # Ensure embeddings are float32
        embeddings = embeddings.astype(np.float32)
        self.index.add(embeddings)
        
        logger.info(f"FAISS index built with {self.index.ntotal} vectors.")

    def search(self, query_vector: np.ndarray, k: int = 10) -> list[dict]:
        """
        Search for the k most similar products.
        
        Args:
            query_vector: numpy array of shape (512,) — query embedding
            k: number of results to return
            
        Returns:
            List of dicts with 'productId' and 'similarity' keys
        """
        if self.index is None or self.index.ntotal == 0:
            logger.warning("FAISS index is empty. Returning empty results.")
            return []

        query_vector = query_vector.astype(np.float32).reshape(1, -1)
        k = min(k, self.index.ntotal)
        
        scores, indices = self.index.search(query_vector, k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < len(self.product_ids):
                results.append({
                    "productId": int(self.product_ids[idx]),
                    "similarity": round(float(score) * 100, 2)  # Convert to percentage
                })
        
        return results

    def save(self, path: str):
        """Save index and product IDs to disk."""
        os.makedirs(path, exist_ok=True)
        if self.index is not None:
            faiss.write_index(self.index, os.path.join(path, "index.faiss"))
        with open(os.path.join(path, "product_ids.pkl"), "wb") as f:
            pickle.dump(self.product_ids, f)
        logger.info(f"FAISS index saved to {path}")

    def load(self, path: str) -> bool:
        """Load index and product IDs from disk. Returns True if successful."""
        index_path = os.path.join(path, "index.faiss")
        ids_path = os.path.join(path, "product_ids.pkl")
        
        if not os.path.exists(index_path) or not os.path.exists(ids_path):
            return False
        
        self.index = faiss.read_index(index_path)
        with open(ids_path, "rb") as f:
            self.product_ids = pickle.load(f)
        
        logger.info(f"FAISS index loaded from {path} ({self.index.ntotal} vectors)")
        return True
