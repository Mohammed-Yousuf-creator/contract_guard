from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, desc
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Contract, RiskScore
from app.database.models.user import Profile
from app.schemas.risk import RiskScoreResponse, RiskScoreHistoryItem
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/contracts/{contract_id}/risk", tags=["Risk"])


@router.get("", response_model=RiskScoreResponse)
async def get_contract_risk(
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

    latest_risk = (
        db.query(RiskScore)
        .filter(RiskScore.contract_id == contract.id)
        .order_by(desc(RiskScore.created_at))
        .first()
    )
    if not latest_risk:
        # If no risk score recorded yet, construct baseline placeholder
        return RiskScoreResponse(
            contract_id=contract.id,
            overall_score=float(contract.risk_score or 0.0),
            risk_level=contract.risk_level or "LOW",
            factors=[],
        )

    return latest_risk


@router.get("/history", response_model=List[RiskScoreHistoryItem])
async def get_contract_risk_history(
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

    history = (
        db.query(RiskScore)
        .filter(RiskScore.contract_id == contract.id)
        .order_by(desc(RiskScore.created_at))
        .all()
    )
    return history
