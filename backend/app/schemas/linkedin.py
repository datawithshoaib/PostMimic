from typing import List, Optional

from pydantic import BaseModel


class ConnectLinkedInRequest(BaseModel):
    linkedin_url: Optional[str] = ""
    preset_key: Optional[str] = "tech_educator"
    custom_posts: Optional[List[str]] = None
