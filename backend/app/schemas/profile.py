from typing import Optional

from pydantic import BaseModel


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
