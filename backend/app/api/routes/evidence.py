from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Contract, Change
from app.database.models.user import Profile
from app.schemas.evidence import EvidenceItem
from app.api.dependencies import get_current_user

router = APIRouter(tags=["Evidence"])


@router.get("/contracts/{contract_id}/evidence", response_model=List[EvidenceItem])
async def list_contract_evidence(
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

    # Collect evidence stored across changes
    changes = db.query(Change).filter(Change.contract_id == contract.id).all()
    all_evidence: List[EvidenceItem] = []
    seen = set()

    for c in changes:
        if c.evidence and isinstance(c.evidence, list):
            for ev in c.evidence:
                key = (ev.get("filename"), ev.get("page"), ev.get("source_text"))
                if key not in seen:
                    seen.add(key)
                    all_evidence.append(
                        EvidenceItem(
                            document_id=ev.get("document_id"),
                            filename=ev.get("filename"),
                            page=ev.get("page"),
                            source_text=ev.get("source_text", ""),
                            original_value=ev.get("original_value") or c.old_value,
                            new_value=ev.get("new_value") or c.new_value,
                            field=ev.get("field") or c.field,
                            change_type=ev.get("change_type") or c.severity,
                        )
                    )
    return all_evidence


@router.get("/evidence/{evidence_id}", response_model=EvidenceItem)
async def get_single_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    # Search across all changes for this evidence_id or document_id
    changes = db.query(Change).all()
    for c in changes:
        if c.evidence and isinstance(c.evidence, list):
            for ev in c.evidence:
                if ev.get("document_id") == evidence_id or ev.get("id") == evidence_id:
                    return EvidenceItem(
                        document_id=ev.get("document_id"),
                        filename=ev.get("filename"),
                        page=ev.get("page"),
                        source_text=ev.get("source_text", ""),
                        original_value=ev.get("original_value") or c.old_value,
                        new_value=ev.get("new_value") or c.new_value,
                        field=ev.get("field") or c.field,
                        change_type=ev.get("change_type") or c.severity,
                    )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Evidence item not found",
    )
