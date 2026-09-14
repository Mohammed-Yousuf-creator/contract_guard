import { apiClient } from '@/lib/api';

export const reportsService = {
  async downloadReport(contractId: string, contractNumber: string): Promise<void> {
    const blob = await apiClient<Blob>(`/contracts/${contractId}/reports`, {
      method: 'GET',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contract_Guard_Report_${contractNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
