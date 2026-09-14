import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String(36), nullable=True)

    decision = Column(String(50), nullable=False)  # UNDER_REVIEW, CLEARED, ESCALATED, NEEDS_EVIDENCE
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    contract = relationship("Contract", back_populates="review_decisions")
