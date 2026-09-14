from datetime import date
from typing import Any, List, Optional
from pydantic import BaseModel
from app.schemas.evidence import EvidenceItem
from app.schemas.risk import RiskFactor


class DriftResult(BaseModel):
    cost_percentage: float
    schedule_days: Optional[int] = None
    scope_similarity: Optional[float] = None


class RiskResult(BaseModel):
    score: float
    level: str  # LOW, MEDIUM, HIGH, CRITICAL


class ChangeAnalysisItem(BaseModel):
    field: str
    old_value: Optional[Any] = None
    new_value: Optional[Any] = None
    absolute_change: Optional[float] = None
    percentage_change: Optional[float] = None
    severity: str
    evidence: Optional[List[EvidenceItem]] = []


class TimelineItem(BaseModel):
    version: int
    label: str
    date: Optional[str] = None
    contract_value: Optional[float] = None
    completion_date: Optional[str] = None
    major_changes: Optional[str] = None


class ContractAnalysisResult(BaseModel):
    contract_id: str
    current_version: int
    drift: DriftResult
    risk: RiskResult
    risk_factors: List[RiskFactor] = []
    changes: List[ChangeAnalysisItem] = []
    timeline: List[TimelineItem] = []
    evidence: List[EvidenceItem] = []
