import { apiClient } from '@/lib/api';
import { Contract, ContractSummary, PaginatedContracts } from '@/types/contract';
import { Change, ContractVersion, ContractAnalysisResult } from '@/types/change';
import { RiskScore, RiskScoreHistoryItem } from '@/types/risk';
import { EvidenceItem } from '@/types/evidence';

export interface ContractFilterParams {
  search?: string;
  risk_level?: string;
  status?: string;
  department?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export const contractsService = {
  async getContracts(params: ContractFilterParams = {}): Promise<PaginatedContracts> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.risk_level) query.append('risk_level', params.risk_level);
    if (params.status) query.append('status', params.status);
    if (params.department) query.append('department', params.department);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.sort_order) query.append('sort_order', params.sort_order);
    if (params.page) query.append('page', params.page.toString());
    if (params.page_size) query.append('page_size', params.page_size.toString());

    const qs = query.toString();
    return apiClient<PaginatedContracts>(`/contracts${qs ? `?${qs}` : ''}`);
  },

  async getContract(id: string): Promise<Contract> {
    return apiClient<Contract>(`/contracts/${id}`);
  },

  async getContractSummary(id: string): Promise<ContractSummary> {
    return apiClient<ContractSummary>(`/contracts/${id}/summary`);
  },

  async createContract(data: Partial<Contract>): Promise<Contract> {
    return apiClient<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    return apiClient<Contract>(`/contracts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteContract(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/contracts/${id}`, {
      method: 'DELETE',
    });
  },

  async getVersions(contractId: string): Promise<ContractVersion[]> {
    return apiClient<ContractVersion[]>(`/contracts/${contractId}/versions`);
  },

  async getChanges(
    contractId: string,
    filters?: { field?: string; severity?: string; version?: number }
  ): Promise<Change[]> {
    const query = new URLSearchParams();
    if (filters?.field) query.append('field', filters.field);
    if (filters?.severity) query.append('severity', filters.severity);
    if (filters?.version !== undefined) query.append('version', filters.version.toString());
    const qs = query.toString();
    return apiClient<Change[]>(`/contracts/${contractId}/changes${qs ? `?${qs}` : ''}`);
  },

  async getRisk(contractId: string): Promise<RiskScore> {
    return apiClient<RiskScore>(`/contracts/${contractId}/risk`);
  },

  async getRiskHistory(contractId: string): Promise<RiskScoreHistoryItem[]> {
    return apiClient<RiskScoreHistoryItem[]>(`/contracts/${contractId}/risk/history`);
  },

  async getEvidence(contractId: string): Promise<EvidenceItem[]> {
    return apiClient<EvidenceItem[]>(`/contracts/${contractId}/evidence`);
  },

  async triggerAnalysis(contractId: string): Promise<ContractAnalysisResult> {
    return apiClient<ContractAnalysisResult>(`/contracts/${contractId}/analyze`, {
      method: 'POST',
    });
  },
};
