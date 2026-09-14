from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.database.session import get_db
from app.database.models.user import Profile

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Profile:
    if not credentials:
        # Development demo auditor profile fallback if no token provided
        dev_user = db.query(Profile).filter(Profile.email == "auditor@contractguard.gov").first()
        if not dev_user:
            dev_user = Profile(
                id="00000000-0000-0000-0000-000000000001",
                email="auditor@contractguard.gov",
                full_name="Rohan Vernekar (Lead Auditor)",
                role="AUDITOR",
                department="Public Works Oversight Division",
            )
            db.add(dev_user)
            db.commit()
            db.refresh(dev_user)
        return dev_user

    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str = payload.get("email") or payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject identity",
        )

    user = db.query(Profile).filter(Profile.email == email).first()
    if not user:
        # Create profile record if authenticated via Supabase
        user = Profile(
            email=email,
            full_name=payload.get("full_name") or email.split("@")[0].title(),
            role=payload.get("role", "AUDITOR"),
            department=payload.get("department", "Procurement Audit"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


async def get_current_admin(
    current_user: Profile = Depends(get_current_user),
) -> Profile:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required",
        )
    return current_user
