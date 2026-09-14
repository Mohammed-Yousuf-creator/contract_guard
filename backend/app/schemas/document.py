from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    document_type: str  # BASELINE, AMENDMENT, INVOICE, PROGRESS_REPORT
    version_number: Optional[int] = None


class DocumentResponse(BaseModel):
    id: str
    contract_id: str
    document_type: str
    version_number: Optional[int] = None
    filename: str
    storage_path: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    processing_status: str
    uploaded_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentDownloadUrlResponse(BaseModel):
    document_id: str
    download_url: str
    filename: str
    expires_in_seconds: int = 3600
