from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Alert, Contract
from app.database.models.user import Profile
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/alerts", tags=["Alerts"])


class AlertResponse(BaseModel):
    id: str
    contract_id: str
    contract_number: Optional[str] = None
    contract_title: Optional[str] = None
    risk_level: str
    message: str
    read: bool
    created_at: str


@router.get("", response_model=List[AlertResponse])
async def list_alerts(
    unread: Optional[bool] = Query(None, description="Filter by unread status"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    date_filter: Optional[date] = Query(None, alias="date", description="Filter by date"),
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    query = db.query(Alert)

    if unread is not None:
        if unread:
            query = query.filter(Alert.read == False)
        else:
            query = query.filter(Alert.read == True)

    if risk_level:
        query = query.filter(Alert.risk_level == risk_level.upper())

    if date_filter:
        query = query.filter(Alert.created_at >= date_filter)

    alerts = query.order_by(desc(Alert.created_at)).all()

    results = []
    for a in alerts:
        contract = db.query(Contract).filter(Contract.id == a.contract_id).first()
        results.append(
            AlertResponse(
                id=a.id,
                contract_id=a.contract_id,
                contract_number=contract.contract_number if contract else None,
                contract_title=contract.title if contract else None,
                risk_level=a.risk_level,
                message=a.message,
                read=a.read,
                created_at=a.created_at.isoformat() if a.created_at else "",
            )
        )
    return results


@router.post("/{alert_id}/read", response_model=dict)
async def mark_alert_read(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found",
        )

    alert.read = True
    db.commit()
    return {"message": "Alert marked as read", "alert_id": alert_id}
