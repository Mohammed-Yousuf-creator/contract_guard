from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ReviewDecisionCreate(BaseModel):
    decision: str = Field(..., description="UNDER_REVIEW, CLEARED, ESCALATED, NEEDS_EVIDENCE")
    notes: Optional[str] = None


class ReviewDecisionResponse(BaseModel):
    id: str
    contract_id: str
    reviewer_id: Optional[str] = None
    reviewer_name: Optional[str] = None
    decision: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
