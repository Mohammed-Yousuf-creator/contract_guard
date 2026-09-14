from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import or_, desc
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Contract, RiskScore, Change, ReviewDecision, ContractVersion
from app.database.models.user import Profile
from app.services.reports.report_service import generate_contract_pdf_report
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/contracts/{contract_id}/reports", tags=["Reports"])


@router.post("", status_code=status.HTTP_200_OK)
async def generate_report_endpoint(
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
    changes = db.query(Change).filter(Change.contract_id == contract.id).all()
    versions = (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract.id)
        .order_by(ContractVersion.version_number.asc())
        .all()
    )
    latest_review = (
        db.query(ReviewDecision)
        .filter(ReviewDecision.contract_id == contract.id)
        .order_by(desc(ReviewDecision.created_at))
        .first()
    )

    pdf_bytes = generate_contract_pdf_report(
        contract=contract,
        latest_risk=latest_risk,
        changes=changes,
        versions=versions,
        latest_review=latest_review,
    )

    filename = f"Contract_Guard_Report_{contract.contract_number}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("", status_code=status.HTTP_200_OK)
async def download_report_endpoint(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    return await generate_report_endpoint(contract_id=contract_id, db=db, current_user=current_user)
