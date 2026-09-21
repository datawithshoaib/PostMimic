from typing import List, Optional

from pydantic import BaseModel


class AddHistoricPostRequest(BaseModel):
    text: str
    engagement: Optional[int] = 150
    language: Optional[str] = "English"
    tags: Optional[List[str]] = None
