export type DocumentType = 'BASELINE' | 'AMENDMENT' | 'INVOICE' | 'PROGRESS_REPORT';

export type ProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Document {
  id: string;
  contract_id: string;
  document_type: DocumentType;
  version_number: number | null;
  filename: string;
  storage_path: string;
  mime_type: string | null;
  file_size: number | null;
  processing_status: ProcessingStatus;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentDownloadUrl {
  document_id: string;
  download_url: string;
  filename: string;
  expires_in_seconds: number;
}
