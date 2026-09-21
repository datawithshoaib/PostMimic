from fastapi import APIRouter, Depends, HTTPException

from app.agent_workflow import generate_post_with_agents, revise_post_with_user_feedback
from app.auth import get_current_user
from app.schemas.generation import GeneratePostRequest, RefinePostRequest

router = APIRouter()


@router.post("/generate")
def generate_post(req: GeneratePostRequest, user: dict = Depends(get_current_user)):
    if not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    result = generate_post_with_agents(
        user_id=user["id"],
        topic=req.topic.strip(),
        length=req.length or "Medium",
        language=req.language or "English",
        max_attempts=req.max_attempts or 3,
    )
    return {"status": "success", "data": result}


@router.post("/generate/{post_id}/refine")
def refine_post(post_id: int, req: RefinePostRequest, user: dict = Depends(get_current_user)):
    if not req.feedback.strip():
        raise HTTPException(status_code=400, detail="Feedback cannot be empty.")

    try:
        updated = revise_post_with_user_feedback(
            post_id=post_id,
            user_id=user["id"],
            user_feedback=req.feedback.strip(),
        )
        return {"status": "success", "data": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
