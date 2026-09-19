import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env
load_dotenv(BASE_DIR / ".env")

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# LLM Models
# On Groq, openai/gpt-oss-120b is top quality for writing, and 20b is super fast for reviewing
WRITER_MODEL = os.getenv("WRITER_MODEL", "openai/gpt-oss-120b")
REVIEWER_MODEL = os.getenv("REVIEWER_MODEL", "openai/gpt-oss-20b")
STYLE_ANALYZER_MODEL = os.getenv("STYLE_ANALYZER_MODEL", "openai/gpt-oss-120b")

# Server Config
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8080"))

# Database
DB_PATH = BASE_DIR / "postmimic.db"

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "postmimic-super-secret-key-2026")
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days
