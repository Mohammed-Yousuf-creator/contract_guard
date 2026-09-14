from typing import Optional, Any
from pydantic import BaseModel


class EvidenceItem(BaseModel):
    document_id: Optional[str] = None
    filename: Optional[str] = None
    page: Optional[int] = None
    source_text: str
    original_value: Optional[Any] = None
    new_value: Optional[Any] = None
    field: Optional[str] = None
    change_type: Optional[str] = None
