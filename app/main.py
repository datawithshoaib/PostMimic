import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from pathlib import Path

from app.config import BASE_DIR
from app.db import init_db, get_db_connection
from app.auth import (
    register_user, authenticate_user, get_current_user,
    create_session, get_user_by_token
)
from app.linkedin_service import (
    extract_posts_for_user, get_user_historic_posts, PERSONA_PRESETS
)
from app.style_analyzer import analyze_user_style, get_user_style_profile
from app.agent_workflow import generate_post_with_agents, revise_post_with_user_feedback

# Initialize database
init_db()

app = FastAPI(
    title="PostMimic API",
    description="LinkedIn Post Style Cloner & Multi-Agent Feedback Workflow",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    headline: Optional[str] = "LinkedIn Content Creator"
    avatar_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class ConnectLinkedInRequest(BaseModel):
    linkedin_url: Optional[str] = ""
    preset_key: Optional[str] = "tech_educator"
    custom_posts: Optional[List[str]] = None

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class AddHistoricPostRequest(BaseModel):
    text: str
    engagement: Optional[int] = 150
    language: Optional[str] = "English"
    tags: Optional[List[str]] = None

class GeneratePostRequest(BaseModel):
    topic: str
    length: Optional[str] = "Medium"
    language: Optional[str] = "English"
    max_attempts: Optional[int] = 3

class RefinePostRequest(BaseModel):
    feedback: str

# ----------------- AUTH ENDPOINTS -----------------

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    try:
        user_data = register_user(
            email=req.email,
            password=req.password,
            full_name=req.full_name,
            headline=req.headline or "LinkedIn Creator",
            avatar_url=req.avatar_url,
            linkedin_url=req.linkedin_url
        )
        # Automatically extract default 10-15 starter posts & initialize style
        extract_posts_for_user(user_data["user_id"], linkedin_url=req.linkedin_url)
        return {"status": "success", "user": user_data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(req: LoginRequest):
    user_data = authenticate_user(req.email, req.password)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"status": "success", "user": user_data}

@app.post("/api/auth/demo-login")
def demo_login():
    """Logs into the pre-seeded Mohan Sharma demo account."""
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
            "follower_count": user["follower_count"]
        }
    }

@app.get("/api/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"status": "success", "user": user}

# ----------------- PROFILE & LINKEDIN ENDPOINTS -----------------

@app.get("/api/profile")
def get_profile(user: dict = Depends(get_current_user)):
    return {"status": "success", "profile": user}

@app.put("/api/profile")
def update_profile(req: ProfileUpdateRequest, user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET full_name = COALESCE(?, full_name),
            headline = COALESCE(?, headline),
            avatar_url = COALESCE(?, avatar_url),
            linkedin_url = COALESCE(?, linkedin_url)
        WHERE id = ?
    """, (req.full_name, req.headline, req.avatar_url, req.linkedin_url, user["id"]))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Profile updated successfully"}

@app.post("/api/linkedin/connect")
def connect_linkedin(req: ConnectLinkedInRequest, user: dict = Depends(get_current_user)):
    """
    Connects to user's LinkedIn, extracts 10 to 15 posts,
    analyzes the style, and updates the profile.
    """
    posts = extract_posts_for_user(
        user_id=user["id"],
        linkedin_url=req.linkedin_url or "",
        preset_key=req.preset_key or "tech_educator",
        custom_posts=req.custom_posts
    )

    # Immediately trigger style DNA analysis on the extracted 10-15 posts
    try:
        style_dna = analyze_user_style(user["id"])
    except Exception as e:
        style_dna = get_user_style_profile(user["id"])

    return {
        "status": "success",
        "message": f"Successfully extracted {len(posts)} LinkedIn posts!",
        "posts_count": len(posts),
        "posts": posts,
        "style_profile": style_dna
    }

@app.get("/api/linkedin/presets")
def get_presets():
    """Returns available instant persona presets (Tech Educator, AI Founder, Growth Creator)."""
    presets_summary = {}
    for k, v in PERSONA_PRESETS.items():
        presets_summary[k] = {
            "name": v["full_name"],
            "headline": v["headline"],
            "followers": v["follower_count"],
            "avatar": v["avatar_url"]
        }
    return {"status": "success", "presets": presets_summary}

# ----------------- HISTORIC POSTS ENDPOINTS -----------------

@app.get("/api/posts/historic")
def get_historic_posts(user: dict = Depends(get_current_user)):
    posts = get_user_historic_posts(user["id"])
    return {
        "status": "success",
        "count": len(posts),
        "posts": posts
    }

@app.post("/api/posts/historic")
def add_historic_post(req: AddHistoricPostRequest, user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    line_cnt = len([l for l in req.text.split("\n") if l.strip()])
    tags_json = json.dumps(req.tags if req.tags else ["Custom"])

    cursor.execute("""
        INSERT INTO historic_posts (user_id, text, engagement, line_count, language, tags, source)
        VALUES (?, ?, ?, ?, ?, ?, 'manual')
    """, (user["id"], req.text.strip(), req.engagement, line_cnt, req.language, tags_json))
    post_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"status": "success", "id": post_id, "message": "Historic post added"}

@app.delete("/api/posts/historic/{post_id}")
def delete_historic_post(post_id: int, user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM historic_posts WHERE id = ? AND user_id = ?", (post_id, user["id"]))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Post removed"}

# ----------------- STYLE PROFILE ENDPOINTS -----------------

@app.get("/api/style")
def get_style(user: dict = Depends(get_current_user)):
    style = get_user_style_profile(user["id"])
    return {"status": "success", "style": style}

@app.post("/api/style/reanalyze")
def reanalyze_style(user: dict = Depends(get_current_user)):
    """Triggers a fresh LLM style analysis on the user's 10-15 posts."""
    style = analyze_user_style(user["id"])
    return {"status": "success", "style": style}

# ----------------- MULTI-AGENT GENERATION ENDPOINTS -----------------

@app.post("/api/generate")
def generate_post(req: GeneratePostRequest, user: dict = Depends(get_current_user)):
    """
    Executes the multi-agent feedback loop:
    Writer Agent -> Reviewer Agent -> Feedback Loop Iterations -> Final Approved Post.
    """
    if not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    result = generate_post_with_agents(
        user_id=user["id"],
        topic=req.topic.strip(),
        length=req.length or "Medium",
        language=req.language or "English",
        max_attempts=req.max_attempts or 3
    )
    return {"status": "success", "data": result}

@app.post("/api/generate/{post_id}/refine")
def refine_post(post_id: int, req: RefinePostRequest, user: dict = Depends(get_current_user)):
    """Human-in-the-loop: user provides custom feedback to refine a drafted post."""
    if not req.feedback.strip():
        raise HTTPException(status_code=400, detail="Feedback cannot be empty.")

    try:
        updated = revise_post_with_user_feedback(
            post_id=post_id,
            user_id=user["id"],
            user_feedback=req.feedback.strip()
        )
        return {"status": "success", "data": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/drafts")
def list_drafts(user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, topic, length, language, final_post, is_approved, attempts, review_feedback, trace_json, created_at
        FROM generated_posts
        WHERE user_id = ?
        ORDER BY id DESC
    """, (user["id"],))
    rows = cursor.fetchall()
    conn.close()

    drafts = []
    for r in rows:
        item = dict(r)
        try:
            item["trace"] = json.loads(item["trace_json"])
        except Exception:
            item["trace"] = []
        del item["trace_json"]
        drafts.append(item)

    return {"status": "success", "drafts": drafts}

@app.delete("/api/drafts/{post_id}")
def delete_draft(post_id: int, user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM generated_posts WHERE id = ? AND user_id = ?", (post_id, user["id"]))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Draft deleted"}

# ----------------- SERVE FRONTEND (REACT VITE BUILD OR FALLBACK) -----------------

dist_dir = BASE_DIR / "frontend" / "dist"
frontend_dir = BASE_DIR / "frontend"

if dist_dir.exists() and (dist_dir / "index.html").exists():
    if (dist_dir / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(dist_dir / "assets")), name="react-assets")

    @app.get("/")
    def serve_index():
        return FileResponse(dist_dir / "index.html")

    @app.get("/health")
    def health_check():
        return {"status": "healthy", "service": "PostMimic Multi-Agent Web App"}

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = dist_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_dir / "index.html")
else:
    if frontend_dir.exists():
        app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")

    @app.get("/")
    def serve_index():
        index_file = BASE_DIR / "frontend" / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"message": "PostMimic API is running. Frontend not yet mounted."}

    @app.get("/health")
    def health_check():
        return {"status": "healthy", "service": "PostMimic Multi-Agent Web App"}
