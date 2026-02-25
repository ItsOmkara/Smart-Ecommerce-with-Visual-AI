"""
Configuration for the AI Visual Search Service
"""
import os

# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+mysqlconnector://root:sharada@localhost:3306/visual_ecommerce_db"
)

# CLIP Model
CLIP_MODEL_NAME = "ViT-B/32"

# FAISS
FAISS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "faiss_index")
TOP_K_RESULTS = 10

# Server
HOST = "0.0.0.0"
PORT = 8001

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]
