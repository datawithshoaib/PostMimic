from typing import Optional

from pydantic import BaseModel


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
