from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Contract, Change
from app.database.models.user import Profile
from app.schemas.change import ChangeResponse
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/contracts/{contract_id}/changes", tags=["Changes"])


@router.get("", response_model=List[ChangeResponse])
async def list_contract_changes(
    contract_id: str,
    field: Optional[str] = None,
    severity: Optional[str] = None,
    version: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    contract = db.query(Contract).filter(
        or_(Contract.id == contract_id, Contract.contract_number == contract_id)
    ).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )

    query = db.query(Change).filter(Change.contract_id == contract.id)

    if field:
        query = query.filter(Change.field == field)

    if severity:
        query = query.filter(Change.severity == severity.upper())

    if version is not None:
        query = query.filter(
            or_(Change.from_version == version, Change.to_version == version)
        )

    changes = query.order_by(Change.created_at.desc()).all()
    return changes
