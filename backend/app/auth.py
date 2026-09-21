import os
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db import get_db_connection
from app.config import TOKEN_EXPIRE_HOURS

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    iterations = 100000
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), iterations)
    return f"{salt}:{key.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, key = stored_hash.split(':')
        iterations = 100000
        new_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), iterations)
        return hmac.compare_digest(new_key.hex(), key)
    except Exception:
        return False

def create_session(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (?, ?, ?)
    """, (token, user_id, expires_at.isoformat()))
    conn.commit()
    conn.close()
    return token

def get_user_by_token(token: str):
    if not token:
        return None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.email, u.full_name, u.headline, u.avatar_url, u.linkedin_url, u.follower_count, s.expires_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    
    try:
        expires_at = datetime.fromisoformat(row["expires_at"])
        if datetime.utcnow() > expires_at:
            return None
    except Exception:
        pass
    
    return dict(row)

def register_user(email: str, password: str, full_name: str, headline: str = "", avatar_url: str = "", linkedin_url: str = ""):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (email.lower().strip(),))
    if cursor.fetchone():
        conn.close()
        raise ValueError("A user with this email already exists.")
    
    pwd_hash = hash_password(password)
    default_avatar = avatar_url or f"https://api.dicebear.com/7.x/initials/svg?seed={full_name}"
    
    cursor.execute("""
        INSERT INTO users (email, password_hash, full_name, headline, avatar_url, linkedin_url, follower_count)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        email.lower().strip(),
        pwd_hash,
        full_name.strip(),
        headline.strip() or "LinkedIn Content Creator",
        default_avatar,
        linkedin_url.strip() or f"https://linkedin.com/in/{full_name.lower().replace(' ', '-')}",
        500
    ))
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    token = create_session(user_id)
    return {"user_id": user_id, "token": token, "email": email, "full_name": full_name}

def authenticate_user(email: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(password, user["password_hash"]):
        return None
    
    token = create_session(user["id"])
    return {
        "user_id": user["id"],
        "token": token,
        "email": user["email"],
        "full_name": user["full_name"],
        "headline": user["headline"],
        "avatar_url": user["avatar_url"],
        "linkedin_url": user["linkedin_url"],
        "follower_count": user["follower_count"]
    }

async def get_current_user(
    request: Request,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    token = None
    if auth:
        token = auth.credentials
    elif "Authorization" in request.headers:
        header = request.headers.get("Authorization")
        if header.startswith("Bearer "):
            token = header.split(" ")[1]
    elif "token" in request.query_params:
        token = request.query_params.get("token")
    elif "session_token" in request.cookies:
        token = request.cookies.get("session_token")
        
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in or use the demo session."
        )
    return user
