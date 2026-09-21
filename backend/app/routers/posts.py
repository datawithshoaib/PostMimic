from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.linkedin_service import get_user_historic_posts
from app.schemas.posts import AddHistoricPostRequest
from app.services.historic_service import add_historic_post, delete_historic_post

router = APIRouter()


@router.get("/historic")
def get_historic_posts(user: dict = Depends(get_current_user)):
    posts = get_user_historic_posts(user["id"])
    return {"status": "success", "count": len(posts), "posts": posts}


@router.post("/historic")
def create_historic_post(req: AddHistoricPostRequest, user: dict = Depends(get_current_user)):
    post_id = add_historic_post(user["id"], req)
    return {"status": "success", "id": post_id, "message": "Historic post added"}


@router.delete("/historic/{post_id}")
def remove_historic_post(post_id: int, user: dict = Depends(get_current_user)):
    delete_historic_post(user["id"], post_id)
    return {"status": "success", "message": "Post removed"}
