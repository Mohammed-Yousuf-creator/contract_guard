export interface EvidenceItem {
  document_id?: string | null;
  filename?: string | null;
  page?: number | null;
  source_text: string;
  original_value?: string | number | null;
  new_value?: string | number | null;
  field?: string | null;
  change_type?: string | null;
}
