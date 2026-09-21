from fastapi import APIRouter, Depends, HTTPException

from app.auth import (
    authenticate_user,
    create_session,
    get_current_user,
    register_user,
)
from app.db import get_db_connection, init_db
from app.linkedin_service import extract_posts_for_user
from app.schemas.auth import LoginRequest, RegisterRequest

router = APIRouter()


@router.post("/register")
def register(req: RegisterRequest):
    try:
        user_data = register_user(
            email=req.email,
            password=req.password,
            full_name=req.full_name,
            headline=req.headline or "LinkedIn Creator",
            avatar_url=req.avatar_url,
            linkedin_url=req.linkedin_url,
        )
        extract_posts_for_user(user_data["user_id"], linkedin_url=req.linkedin_url)
        return {"status": "success", "user": user_data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(req: LoginRequest):
    user_data = authenticate_user(req.email, req.password)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"status": "success", "user": user_data}


@router.post("/demo-login")
def demo_login():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = 'mohan@codebasics.io'")
    user = cursor.fetchone()
    conn.close()

    if not user:
        init_db()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = 'mohan@codebasics.io'")
        user = cursor.fetchone()
        conn.close()

    token = create_session(user["id"])
    return {
        "status": "success",
        "user": {
            "user_id": user["id"],
            "token": token,
            "email": user["email"],
            "full_name": user["full_name"],
            "headline": user["headline"],
            "avatar_url": user["avatar_url"],
            "linkedin_url": user["linkedin_url"],
            "follower_count": user["follower_count"],
        },
    }


@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"status": "success", "user": user}
