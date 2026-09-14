import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Numeric, Date, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_number = Column(String(100), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    department = Column(String(255), nullable=False, index=True)

    baseline_value = Column(Numeric(18, 2), nullable=True)
    current_value = Column(Numeric(18, 2), nullable=True)

    baseline_start_date = Column(Date, nullable=True)
    current_start_date = Column(Date, nullable=True)

    baseline_completion_date = Column(Date, nullable=True)
    current_completion_date = Column(Date, nullable=True)

    contractor = Column(String(255), nullable=True)

    risk_score = Column(Numeric(5, 2), nullable=True, index=True)
    risk_level = Column(String(50), nullable=True, index=True)  # LOW, MEDIUM, HIGH, CRITICAL

    status = Column(String(50), nullable=False, default="ACTIVE", index=True)  # ACTIVE, UNDER_REVIEW, CLEARED, ESCALATED, CLOSED

    created_by = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    documents = relationship("Document", back_populates="contract", cascade="all, delete-orphan")
    versions = relationship("ContractVersion", back_populates="contract", cascade="all, delete-orphan", order_by="ContractVersion.version_number")
    changes = relationship("Change", back_populates="contract", cascade="all, delete-orphan")
    risk_scores = relationship("RiskScore", back_populates="contract", cascade="all, delete-orphan", order_by="desc(RiskScore.created_at)")
    review_decisions = relationship("ReviewDecision", back_populates="contract", cascade="all, delete-orphan", order_by="desc(ReviewDecision.created_at)")
    alerts = relationship("Alert", back_populates="contract", cascade="all, delete-orphan")
