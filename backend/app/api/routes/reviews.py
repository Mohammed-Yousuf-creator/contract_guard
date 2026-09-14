from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, desc
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Contract, ReviewDecision, Alert
from app.database.models.user import Profile
from app.schemas.review import ReviewDecisionCreate, ReviewDecisionResponse
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/contracts/{contract_id}/reviews", tags=["Reviews"])


@router.post("", response_model=ReviewDecisionResponse, status_code=status.HTTP_201_CREATED)
async def create_review_decision(
    contract_id: str,
    data: ReviewDecisionCreate,
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

    valid_decisions = ["UNDER_REVIEW", "CLEARED", "ESCALATED", "NEEDS_EVIDENCE"]
    decision_val = data.decision.upper()
    if decision_val not in valid_decisions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid decision '{data.decision}'. Must be one of {valid_decisions}",
        )

    review = ReviewDecision(
        contract_id=contract.id,
        reviewer_id=current_user.id,
        decision=decision_val,
        notes=data.notes,
    )
    db.add(review)

    # Synchronize contract status based on reviewer decision
    if decision_val in ["UNDER_REVIEW", "CLEARED", "ESCALATED"]:
        contract.status = decision_val
    elif decision_val == "NEEDS_EVIDENCE":
        contract.status = "UNDER_REVIEW"

    # If escalated, generate an alert
    if decision_val == "ESCALATED":
        alert = Alert(
            contract_id=contract.id,
            risk_level="CRITICAL",
            message=f"Contract {contract.contract_number} has been ESCALATED by {current_user.full_name or 'Auditor'}. Notes: {data.notes or 'Urgent oversight required.'}",
        )
        db.add(alert)

    db.commit()
    db.refresh(review)

    return ReviewDecisionResponse(
        id=review.id,
        contract_id=review.contract_id,
        reviewer_id=review.reviewer_id,
        reviewer_name=current_user.full_name or current_user.email,
        decision=review.decision,
        notes=review.notes,
        created_at=review.created_at,
    )


@router.get("", response_model=List[ReviewDecisionResponse])
async def list_contract_reviews(
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

    reviews = (
        db.query(ReviewDecision)
        .filter(ReviewDecision.contract_id == contract.id)
        .order_by(desc(ReviewDecision.created_at))
        .all()
    )

    response_items = []
    for r in reviews:
        reviewer = db.query(Profile).filter(Profile.id == r.reviewer_id).first() if r.reviewer_id else None
        response_items.append(
            ReviewDecisionResponse(
                id=r.id,
                contract_id=r.contract_id,
                reviewer_id=r.reviewer_id,
                reviewer_name=reviewer.full_name if reviewer else "Staff Auditor",
                decision=r.decision,
                notes=r.notes,
                created_at=r.created_at,
            )
        )
    return response_items
