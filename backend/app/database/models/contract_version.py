import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class ContractVersion(Base):
    __tablename__ = "contract_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)

    version_number = Column(Integer, nullable=False)

    contract_value = Column(Numeric(18, 2), nullable=True)
    start_date = Column(Date, nullable=True)
    completion_date = Column(Date, nullable=True)

    contractor = Column(String(255), nullable=True)

    subcontractors = Column(JSON, nullable=True)  # List of subcontractors
    materials = Column(JSON, nullable=True)       # Materials details
    scope = Column(Text, nullable=True)           # Scope description
    milestones = Column(JSON, nullable=True)      # Milestones list
    payment_terms = Column(Text, nullable=True)

    extracted_data = Column(JSON, nullable=True)  # Full AI extraction output

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    contract = relationship("Contract", back_populates="versions")
    document = relationship("Document", back_populates="version")
