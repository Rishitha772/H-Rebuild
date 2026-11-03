import apiClient from './client';
import { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: 'candidate' | 'recruiter';
  user_id: number;
  full_name: string;
  email: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  getMe: async (): Promise<User & { profile: any }> => {
    const res = await apiClient.get<User & { profile: any }>('/auth/me');
    return res.data;
  },
};

