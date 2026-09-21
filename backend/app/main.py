from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.db import init_db
from app.routers import api_router

init_db()

app = FastAPI(
    title="PostMimic API",
    description="LinkedIn Post Style Cloner & Multi-Agent Feedback Workflow",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/health")
def root_health():
    return {"status": "healthy", "service": "PostMimic API"}
