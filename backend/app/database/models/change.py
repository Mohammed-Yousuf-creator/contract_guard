import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class Change(Base):
    __tablename__ = "changes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)

    from_version = Column(Integer, nullable=False)
    to_version = Column(Integer, nullable=False)

    field = Column(String(100), nullable=False)  # e.g., contract_value, completion_date, subcontractor, scope

    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)

    absolute_change = Column(Numeric(18, 2), nullable=True)
    percentage_change = Column(Numeric(8, 2), nullable=True)

    severity = Column(String(50), nullable=False, default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL

    evidence = Column(JSON, nullable=True)  # List of evidence references with doc_id, page, source_text

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    contract = relationship("Contract", back_populates="changes")
