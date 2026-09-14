export type ReviewDecisionType = 'UNDER_REVIEW' | 'CLEARED' | 'ESCALATED' | 'NEEDS_EVIDENCE';

export interface ReviewDecision {
  id: string;
  contract_id: string;
  reviewer_id?: string | null;
  reviewer_name?: string | null;
  decision: ReviewDecisionType;
  notes?: string | null;
  created_at: string;
}

export interface ReviewDecisionPayload {
  decision: ReviewDecisionType;
  notes?: string;
}

export interface Alert {
  id: string;
  contract_id: string;
  contract_number?: string | null;
  contract_title?: string | null;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  read: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'ADMIN' | 'AUDITOR';
  department: string | null;
}
