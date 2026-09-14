import { RiskLevel } from './contract';

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  reason: string;
}

export interface RiskScore {
  id?: string;
  contract_id: string;
  overall_score: number;
  risk_level: RiskLevel;
  factors: RiskFactor[];
  created_at?: string;
}

export interface RiskScoreHistoryItem {
  id: string;
  overall_score: number;
  risk_level: RiskLevel;
  factors: RiskFactor[];
  created_at: string;
}
