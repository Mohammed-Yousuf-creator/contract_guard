import { EvidenceItem } from './evidence';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Change {
  id: string;
  contract_id: string;
  from_version: number;
  to_version: number;
  field: string;
  old_value: any;
  new_value: any;
  absolute_change: number | null;
  percentage_change: number | null;
  severity: SeverityLevel;
  evidence: EvidenceItem[];
  created_at: string;
}

export interface ContractVersion {
  id: string;
  contract_id: string;
  document_id: string | null;
  version_number: number;
  contract_value: number | null;
  start_date: string | null;
  completion_date: string | null;
  contractor: string | null;
  subcontractors: any;
  materials: any;
  scope: string | null;
  milestones: any;
  payment_terms: string | null;
  extracted_data: Record<string, any> | null;
  created_at: string;
}

export interface DriftMetrics {
  cost_percentage: number;
  schedule_days?: number | null;
  scope_similarity?: number | null;
}

export interface TimelineItem {
  version: number;
  label: string;
  date?: string | null;
  contract_value?: number | null;
  completion_date?: string | null;
  major_changes?: string | null;
}

export interface ContractAnalysisResult {
  contract_id: string;
  current_version: number;
  drift: DriftMetrics;
  risk: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  risk_factors: Array<{
    name: string;
    score: number;
    weight: number;
    reason: string;
  }>;
  changes: Array<{
    field: string;
    old_value: any;
    new_value: any;
    absolute_change: number | null;
    percentage_change: number | null;
    severity: string;
    evidence: EvidenceItem[];
  }>;
  timeline: TimelineItem[];
  evidence: EvidenceItem[];
}
