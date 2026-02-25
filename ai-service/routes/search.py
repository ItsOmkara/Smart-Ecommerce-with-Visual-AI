"""
Visual Search API Route
Accepts image uploads and returns visually similar products using CLIP + FAISS.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.image_utils import load_image_from_bytes
import logging
import traceback

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/search", tags=["Visual Search"])


@router.post("/visual")
async def visual_search(image: UploadFile = File(...)):
    """
    Search for visually similar products by uploading an image.
    
    - Accepts: multipart/form-data with an 'image' field
    - Returns: JSON array of {productId, similarity} sorted by similarity descending
    """
    # Validate file type — also accept when content_type is missing (proxy forwards)
    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image (JPG, PNG, WebP)."
        )
    
    # Read and validate image
    image_bytes = await image.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=400,
            detail="Image too large. Maximum size is 10MB."
        )
    
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty image file."
        )
    
    pil_image = load_image_from_bytes(image_bytes)
    if pil_image is None:
        raise HTTPException(
            status_code=400,
            detail="Could not process the uploaded image."
        )
    
    # Get app state (CLIP model and FAISS index are loaded at startup)
    from main import clip_service, faiss_index
    
    if clip_service is None or faiss_index is None:
        raise HTTPException(
            status_code=503,
            detail="AI service is still initializing. Please try again in a moment."
        )
    
    try:
        # Encode the uploaded image
        logger.info(f"Encoding image ({len(image_bytes)} bytes, type={image.content_type})...")
        query_vector = clip_service.encode_image(pil_image)
        
        # Search FAISS index
        results = faiss_index.search(query_vector, k=10)
        
        logger.info(f"Visual search returned {len(results)} results")
        return {"results": results}
    except Exception as e:
        logger.error(f"Visual search error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"AI processing error: {str(e)}"
        )
