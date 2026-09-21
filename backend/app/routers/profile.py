from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.schemas.profile import ProfileUpdateRequest
from app.services.profile_service import update_user_profile

router = APIRouter()


@router.get("")
def get_profile(user: dict = Depends(get_current_user)):
    return {"status": "success", "profile": user}


@router.put("")
def update_profile(req: ProfileUpdateRequest, user: dict = Depends(get_current_user)):
    update_user_profile(user["id"], req)
    return {"status": "success", "message": "Profile updated successfully"}
