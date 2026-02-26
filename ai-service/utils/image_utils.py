"""
Image utility functions for loading and preprocessing images.
"""
from PIL import Image
import requests
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

# Maximum image dimension before resizing (CLIP uses 224x224 internally)
MAX_IMAGE_SIZE = 1024


def _resize_if_needed(image: Image.Image) -> Image.Image:
    """Resize image if it's too large to prevent memory issues during CLIP inference."""
    w, h = image.size
    if max(w, h) > MAX_IMAGE_SIZE:
        ratio = MAX_IMAGE_SIZE / max(w, h)
        new_size = (int(w * ratio), int(h * ratio))
        logger.info(f"Resizing image from {w}x{h} to {new_size[0]}x{new_size[1]}")
        image = image.resize(new_size, Image.LANCZOS)
    return image


def load_image_from_url(url: str) -> Image.Image | None:
    """
    Download and load an image from a URL.
    
    Args:
        url: Image URL
        
    Returns:
        PIL Image in RGB mode, or None if loading fails
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
        return _resize_if_needed(image)
    except Exception as e:
        logger.error(f"Failed to load image from {url}: {e}")
        return None


def load_image_from_bytes(image_bytes: bytes) -> Image.Image | None:
    """
    Load an image from raw bytes (e.g., from file upload).
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        PIL Image in RGB mode, or None if loading fails
    """
    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        return _resize_if_needed(image)
    except Exception as e:
        logger.error(f"Failed to load image from bytes: {e}")
        return None
