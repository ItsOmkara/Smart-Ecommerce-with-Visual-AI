"""
Smart Ecommerce Visual AI Search Service
FastAPI application that provides visual similarity search using CLIP + FAISS.
"""
# Fix OpenMP conflict between FAISS (Intel MKL) and PyTorch (LLVM OpenMP)
# Must be set BEFORE importing torch or faiss
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OMP_NUM_THREADS"] = "1"

import logging
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

from config import DATABASE_URL, CLIP_MODEL_NAME, FAISS_INDEX_PATH, ALLOWED_ORIGINS, HOST, PORT
from models.clip_model import CLIPModelService
from models.faiss_index import FAISSIndex
from utils.image_utils import load_image_from_url

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Database engine
engine = create_engine(DATABASE_URL)

# ─── Load CLIP model and FAISS index at module level ──────────────
# This ensures they are available in the same process context as the
# request handlers, avoiding crashes when accessed from async handlers.
logger.info("=" * 60)
logger.info("Starting Visual AI Search Service")
logger.info("=" * 60)

clip_service = CLIPModelService(CLIP_MODEL_NAME)
faiss_index = FAISSIndex(dimension=512)


def get_products_from_db() -> list[dict]:
    """Fetch all products with their primary image from MySQL."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, name, image FROM products"))
        products = [{"id": row[0], "name": row[1], "image": row[2]} for row in result]
    logger.info(f"Fetched {len(products)} products from database.")
    return products


def rebuild_faiss_index():
    """Download product images, encode with CLIP, and rebuild the FAISS index."""
    global faiss_index
    
    logger.info("Starting FAISS index rebuild...")
    products = get_products_from_db()
    
    if not products:
        logger.warning("No products found in database. Skipping index build.")
        return
    
    embeddings = []
    product_ids = []
    
    for i, product in enumerate(products):
        logger.info(f"Processing product {i+1}/{len(products)}: {product['name']}")
        image = load_image_from_url(product["image"])
        if image is not None:
            embedding = clip_service.encode_image(image)
            embeddings.append(embedding)
            product_ids.append(product["id"])
        else:
            logger.warning(f"Skipping product {product['id']} — failed to load image.")
    
    if embeddings:
        embeddings_array = np.array(embeddings, dtype=np.float32)
        faiss_index.build_index(embeddings_array, product_ids)
        faiss_index.save(FAISS_INDEX_PATH)
        logger.info(f"FAISS index rebuilt with {len(product_ids)} products.")
    else:
        logger.error("No embeddings generated. Index not built.")


# Try to load existing FAISS index from disk
if faiss_index.load(FAISS_INDEX_PATH):
    logger.info("Loaded existing FAISS index from disk.")
else:
    logger.info("No existing index found. Building from database...")
    try:
        rebuild_faiss_index()
    except Exception as e:
        logger.error(f"Failed to build initial index: {e}")
        logger.info("You can trigger a rebuild later via POST /api/index/rebuild")

logger.info("=" * 60)
logger.info("Visual AI Search Service is ready!")
logger.info("=" * 60)


# Create FastAPI app (no lifespan needed — everything loaded above)
app = FastAPI(
    title="Visual AI Search Service",
    description="Visual similarity search for e-commerce products using CLIP + FAISS",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
from routes.search import router as search_router
from routes.index import router as index_router

app.include_router(search_router)
app.include_router(index_router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "Visual AI Search",
        "status": "running",
        "model": CLIP_MODEL_NAME,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
