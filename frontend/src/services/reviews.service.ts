import { apiClient } from '@/lib/api';
import { ReviewDecision, ReviewDecisionPayload } from '@/types/review';

export const reviewsService = {
  async getReviews(contractId: string): Promise<ReviewDecision[]> {
    return apiClient<ReviewDecision[]>(`/contracts/${contractId}/reviews`);
  },

  async createReview(contractId: string, payload: ReviewDecisionPayload): Promise<ReviewDecision> {
    return apiClient<ReviewDecision>(`/contracts/${contractId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
