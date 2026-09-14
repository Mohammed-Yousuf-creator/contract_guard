import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)

    overall_score = Column(Numeric(5, 2), nullable=False)
    risk_level = Column(String(50), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL

    factors = Column(JSON, nullable=True)  # List of factors: {name, score, weight, reason}

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    contract = relationship("Contract", back_populates="risk_scores")
