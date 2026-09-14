import { apiClient } from '@/lib/api';
import { Alert } from '@/types/review';

export interface AlertFilterParams {
  unread?: boolean;
  risk_level?: string;
  date?: string;
}

export const alertsService = {
  async getAlerts(params: AlertFilterParams = {}): Promise<Alert[]> {
    const query = new URLSearchParams();
    if (params.unread !== undefined) query.append('unread', params.unread.toString());
    if (params.risk_level) query.append('risk_level', params.risk_level);
    if (params.date) query.append('date', params.date);
    const qs = query.toString();
    return apiClient<Alert[]>(`/alerts${qs ? `?${qs}` : ''}`);
  },

  async markAsRead(alertId: string): Promise<{ message: string; alert_id: string }> {
    return apiClient<{ message: string; alert_id: string }>(`/alerts/${alertId}/read`, {
      method: 'POST',
    });
  },
};
