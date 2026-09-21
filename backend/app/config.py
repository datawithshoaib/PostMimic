import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = BACKEND_DIR.parent

load_dotenv(REPO_ROOT / ".env")

# Legacy alias used by services that reference repo assets (data/, etc.)
BASE_DIR = REPO_ROOT

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

WRITER_MODEL = os.getenv("WRITER_MODEL", "openai/gpt-oss-120b")
REVIEWER_MODEL = os.getenv("REVIEWER_MODEL", "openai/gpt-oss-20b")
STYLE_ANALYZER_MODEL = os.getenv("STYLE_ANALYZER_MODEL", "openai/gpt-oss-120b")

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8080"))

DB_PATH = REPO_ROOT / "postmimic.db"

SECRET_KEY = os.getenv("SECRET_KEY", "postmimic-super-secret-key-2026")
TOKEN_EXPIRE_HOURS = 24 * 7

_default_cors = "http://localhost:3000,http://127.0.0.1:3000"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_cors).split(",")
    if origin.strip()
]
