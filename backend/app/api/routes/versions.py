from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Contract, ContractVersion
from app.database.models.user import Profile
from app.schemas.version import ContractVersionResponse
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/contracts/{contract_id}/versions", tags=["Versions"])


@router.get("", response_model=List[ContractVersionResponse])
async def list_contract_versions(
    contract_id: str,
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

    versions = (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract.id)
        .order_by(ContractVersion.version_number.asc())
        .all()
    )
    return versions


@router.get("/{version}", response_model=ContractVersionResponse)
async def get_contract_version(
    contract_id: str,
    version: int,
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

    ver = (
        db.query(ContractVersion)
        .filter(
            ContractVersion.contract_id == contract.id,
            ContractVersion.version_number == version,
        )
        .first()
    )
    if not ver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version {version} not found for contract",
        )
    return ver
