from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel
from app.schemas.evidence import EvidenceItem


class ChangeResponse(BaseModel):
    id: str
    contract_id: str
    from_version: int
    to_version: int
    field: str
    old_value: Optional[Any] = None
    new_value: Optional[Any] = None
    absolute_change: Optional[float] = None
    percentage_change: Optional[float] = None
    severity: str
    evidence: Optional[List[EvidenceItem]] = []
    created_at: datetime

    class Config:
        from_attributes = True
