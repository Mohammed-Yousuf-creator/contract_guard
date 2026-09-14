export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ContractStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'CLEARED' | 'ESCALATED' | 'CLOSED';

export interface Contract {
  id: string;
  contractNumber: string;
  contract_number?: string;
  title: string;
  description?: string | null;
  department: string;
  contractor?: string | null;
  baselineValue: number | null;
  baseline_value?: number | null;
  currentValue: number | null;
  current_value?: number | null;
  baselineStartDate?: string | null;
  baseline_start_date?: string | null;
  currentStartDate?: string | null;
  current_start_date?: string | null;
  baselineCompletionDate?: string | null;
  baseline_completion_date?: string | null;
  currentCompletionDate?: string | null;
  current_completion_date?: string | null;
  riskScore: number | null;
  risk_score?: number | null;
  riskLevel: RiskLevel | null;
  risk_level?: RiskLevel | null;
  status: ContractStatus;
  createdBy?: string | null;
  created_by?: string | null;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
}

export interface ContractSummary {
  id: string;
  contract_number: string;
  title: string;
  department: string;
  contractor: string | null;
  status: ContractStatus;
  risk_score: number | null;
  risk_level: RiskLevel | null;
  baseline_value: number | null;
  current_value: number | null;
  cost_drift_percentage: number | null;
  baseline_completion_date: string | null;
  current_completion_date: string | null;
  schedule_drift_months: number | null;
  version_count: number;
  document_count: number;
  change_count: number;
  latest_review_decision: string | null;
  last_updated: string;
}

export interface PaginatedContracts {
  items: Contract[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
