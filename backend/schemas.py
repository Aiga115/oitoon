from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None


class LoginRequest(BaseModel):
    identifier: str  # email or username
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    avatar_url: Optional[str]
    country: Optional[str]
    member_since: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
