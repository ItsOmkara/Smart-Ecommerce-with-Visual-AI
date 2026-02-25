"""
Index Management API Route
Rebuild the FAISS index from product images in the database.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/index", tags=["Index Management"])


@router.post("/rebuild")
async def rebuild_index(background_tasks: BackgroundTasks):
    """
    Trigger a rebuild of the FAISS vector index.
    Downloads all product images, encodes them with CLIP, and rebuilds the FAISS index.
    Runs in the background so the endpoint returns immediately.
    """
    from main import rebuild_faiss_index
    
    background_tasks.add_task(rebuild_faiss_index)
    
    return {
        "status": "Index rebuild started",
        "message": "The FAISS index is being rebuilt in the background. This may take a few minutes."
    }


@router.get("/status")
async def index_status():
    """Get the current status of the FAISS index."""
    from main import faiss_index
    
    if faiss_index is None or faiss_index.index is None:
        return {
            "status": "not_ready",
            "totalVectors": 0,
            "message": "Index is not built yet."
        }
    
    return {
        "status": "ready",
        "totalVectors": faiss_index.index.ntotal,
        "totalProducts": len(faiss_index.product_ids),
    }
