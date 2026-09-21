from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.linkedin_service import PERSONA_PRESETS, extract_posts_for_user
from app.schemas.linkedin import ConnectLinkedInRequest
from app.style_analyzer import analyze_user_style, get_user_style_profile

router = APIRouter()


@router.post("/connect")
def connect_linkedin(req: ConnectLinkedInRequest, user: dict = Depends(get_current_user)):
    posts = extract_posts_for_user(
        user_id=user["id"],
        linkedin_url=req.linkedin_url or "",
        preset_key=req.preset_key or "tech_educator",
        custom_posts=req.custom_posts,
    )

    try:
        style_dna = analyze_user_style(user["id"])
    except Exception:
        style_dna = get_user_style_profile(user["id"])

    return {
        "status": "success",
        "message": f"Successfully extracted {len(posts)} LinkedIn posts!",
        "posts_count": len(posts),
        "posts": posts,
        "style_profile": style_dna,
    }


@router.get("/presets")
def get_presets():
    presets_summary = {}
    for key, value in PERSONA_PRESETS.items():
        presets_summary[key] = {
            "name": value["full_name"],
            "headline": value["headline"],
            "followers": value["follower_count"],
            "avatar": value["avatar_url"],
        }
    return {"status": "success", "presets": presets_summary}
