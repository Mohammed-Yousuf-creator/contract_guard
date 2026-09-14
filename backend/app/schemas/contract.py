from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ContractBase(BaseModel):
    contract_number: str
    title: str
    description: Optional[str] = None
    department: str
    contractor: Optional[str] = None
    baseline_value: Optional[float] = None
    current_value: Optional[float] = None
    baseline_start_date: Optional[date] = None
    current_start_date: Optional[date] = None
    baseline_completion_date: Optional[date] = None
    current_completion_date: Optional[date] = None
    status: Optional[str] = "ACTIVE"


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    department: Optional[str] = None
    contractor: Optional[str] = None
    baseline_value: Optional[float] = None
    current_value: Optional[float] = None
    baseline_start_date: Optional[date] = None
    current_start_date: Optional[date] = None
    baseline_completion_date: Optional[date] = None
    current_completion_date: Optional[date] = None
    status: Optional[str] = None
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None


class ContractResponse(ContractBase):
    id: str
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContractSummaryResponse(BaseModel):
    id: str
    contract_number: str
    title: str
    department: str
    contractor: Optional[str] = None
    status: str
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    
    baseline_value: Optional[float] = None
    current_value: Optional[float] = None
    cost_drift_percentage: Optional[float] = None
    
    baseline_completion_date: Optional[date] = None
    current_completion_date: Optional[date] = None
    schedule_drift_months: Optional[float] = None
    
    version_count: int = 0
    document_count: int = 0
    change_count: int = 0
    latest_review_decision: Optional[str] = None
    last_updated: datetime
