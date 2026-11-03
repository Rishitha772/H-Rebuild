import apiClient from './client';
import { CandidateProfile, RecruiterProfile, RecruiterStats } from '../types';

export const profilesApi = {
  getCandidateProfile: async (): Promise<CandidateProfile> => {
    const res = await apiClient.get<CandidateProfile>('/candidates/me');
    return res.data;
  },

  updateCandidateProfile: async (data: Partial<CandidateProfile> & { full_name?: string }): Promise<CandidateProfile> => {
    const res = await apiClient.put<CandidateProfile>('/candidates/me', data);
    return res.data;
  },

  getCandidateById: async (candidateId: number): Promise<CandidateProfile> => {
    const res = await apiClient.get<CandidateProfile>(`/candidates/${candidateId}`);
    return res.data;
  },

  getRecruiterProfile: async (): Promise<RecruiterProfile> => {
    const res = await apiClient.get<RecruiterProfile>('/recruiters/me');
    return res.data;
  },

  updateRecruiterProfile: async (data: Partial<RecruiterProfile> & { full_name?: string }): Promise<RecruiterProfile> => {
    const res = await apiClient.put<RecruiterProfile>('/recruiters/me', data);
    return res.data;
  },

  getRecruiterStats: async (): Promise<RecruiterStats> => {
    const res = await apiClient.get<RecruiterStats>('/recruiters/stats');
    return res.data;
  },
};

