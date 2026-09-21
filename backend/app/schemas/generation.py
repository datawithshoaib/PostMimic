from typing import Optional

from pydantic import BaseModel


class GeneratePostRequest(BaseModel):
    topic: str
    length: Optional[str] = "Medium"
    language: Optional[str] = "English"
    max_attempts: Optional[int] = 3


class RefinePostRequest(BaseModel):
    feedback: str
