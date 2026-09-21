from fastapi import APIRouter

from app.routers import auth, drafts, generation, health, linkedin, posts, profile, style

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(linkedin.router, prefix="/linkedin", tags=["linkedin"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(style.router, prefix="/style", tags=["style"])
api_router.include_router(generation.router, tags=["generation"])
api_router.include_router(drafts.router, prefix="/drafts", tags=["drafts"])
