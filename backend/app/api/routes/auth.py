from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.security import create_access_token, verify_password, get_password_hash
from app.database.session import get_db
from app.database.models.user import Profile
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    department: Optional[str] = None


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Profile).filter(Profile.email == data.email).first()
    
    # Check demo users or initialize if not present
    if not user:
        if data.email in ["auditor@contractguard.gov", "admin@contractguard.gov", "officer@pwd.gov"]:
            role = "ADMIN" if "admin" in data.email else "AUDITOR"
            dept = "Audit & Oversight Directorate" if role == "ADMIN" else "Public Works Oversight Division"
            name = "System Admin" if role == "ADMIN" else "Senior Procurement Auditor"
            user = Profile(
                email=data.email,
                full_name=name,
                role=role,
                department=dept,
                hashed_password=get_password_hash("AuditGuard2026!"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please use an authorized government audit email.",
            )

    token = create_access_token(
        subject=user.email,
        role=user.role,
        department=user.department,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "department": user.department,
        },
    }


@router.get("/me", response_model=UserProfileResponse)
async def get_current_profile(current_user: Profile = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "department": current_user.department,
    }
