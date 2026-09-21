from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.generation import GeneratePostRequest, RefinePostRequest
from app.schemas.linkedin import ConnectLinkedInRequest
from app.schemas.posts import AddHistoricPostRequest
from app.schemas.profile import ProfileUpdateRequest

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "ConnectLinkedInRequest",
    "ProfileUpdateRequest",
    "AddHistoricPostRequest",
    "GeneratePostRequest",
    "RefinePostRequest",
]
