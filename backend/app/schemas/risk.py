from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class RiskFactor(BaseModel):
    name: str
    score: float
    weight: float
    reason: str


class RiskScoreResponse(BaseModel):
    id: Optional[str] = None
    contract_id: str
    overall_score: float
    risk_level: str
    factors: List[RiskFactor] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RiskScoreHistoryItem(BaseModel):
    id: str
    overall_score: float
    risk_level: str
    factors: List[RiskFactor] = []
    created_at: datetime

    class Config:
        from_attributes = True
