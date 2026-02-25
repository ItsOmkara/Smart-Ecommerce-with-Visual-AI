"""
CLIP Model Loader and Image Encoder
Uses OpenAI's CLIP ViT-B/32 to generate 512-dimensional embeddings for images.
"""
import torch
import clip
import numpy as np
from PIL import Image
from typing import Union
import logging

logger = logging.getLogger(__name__)


class CLIPModelService:
    """Singleton-style CLIP model service for encoding images into vectors."""

    def __init__(self, model_name: str = "ViT-B/32"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Loading CLIP model '{model_name}' on device '{self.device}'...")
        self.model, self.preprocess = clip.load(model_name, device=self.device)
        logger.info("CLIP model loaded successfully.")

    def encode_image(self, image: Image.Image) -> np.ndarray:
        """
        Encode a PIL Image into a normalized 512-dim feature vector.
        
        Args:
            image: PIL Image object
            
        Returns:
            numpy array of shape (512,) — L2-normalized embedding
        """
        image_input = self.preprocess(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            image_features = self.model.encode_image(image_input)
        
        # Normalize to unit vector for cosine similarity
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        return image_features.cpu().numpy().flatten()

    def encode_images_batch(self, images: list[Image.Image]) -> np.ndarray:
        """
        Encode a batch of PIL Images into normalized feature vectors.
        
        Args:
            images: List of PIL Image objects
            
        Returns:
            numpy array of shape (N, 512)
        """
        image_inputs = torch.stack([self.preprocess(img) for img in images]).to(self.device)
        with torch.no_grad():
            image_features = self.model.encode_image(image_inputs)
        
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        return image_features.cpu().numpy()
