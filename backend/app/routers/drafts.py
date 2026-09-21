from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.services.drafts_service import delete_user_draft, list_user_drafts

router = APIRouter()


@router.get("")
def list_drafts(user: dict = Depends(get_current_user)):
    drafts = list_user_drafts(user["id"])
    return {"status": "success", "drafts": drafts}


@router.delete("/{post_id}")
def delete_draft(post_id: int, user: dict = Depends(get_current_user)):
    delete_user_draft(user["id"], post_id)
    return {"status": "success", "message": "Draft deleted"}
