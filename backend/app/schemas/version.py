from datetime import date, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class ContractVersionResponse(BaseModel):
    id: str
    contract_id: str
    document_id: Optional[str] = None
    version_number: int
    contract_value: Optional[float] = None
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    contractor: Optional[str] = None
    subcontractors: Optional[Any] = None
    materials: Optional[Any] = None
    scope: Optional[str] = None
    milestones: Optional[Any] = None
    payment_terms: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
