from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.style_analyzer import analyze_user_style, get_user_style_profile

router = APIRouter()


@router.get("")
def get_style(user: dict = Depends(get_current_user)):
    style = get_user_style_profile(user["id"])
    return {"status": "success", "style": style}


@router.post("/reanalyze")
def reanalyze_style(user: dict = Depends(get_current_user)):
    style = analyze_user_style(user["id"])
    return {"status": "success", "style": style}
