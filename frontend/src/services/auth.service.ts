import { apiClient, setAuthToken, removeAuthToken } from '@/lib/api';
import { UserProfile } from '@/types/review';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      setAuthToken(data.access_token);
      localStorage.setItem('contract_guard_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser(): Promise<UserProfile> {
    const user = await apiClient<UserProfile>('/auth/me');
    localStorage.setItem('contract_guard_user', JSON.stringify(user));
    return user;
  },

  getStoredUser(): UserProfile | null {
    const stored = localStorage.getItem('contract_guard_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  logout(): void {
    removeAuthToken();
    localStorage.removeItem('contract_guard_user');
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('contract_guard_token'));
  },
};
