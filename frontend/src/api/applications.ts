import apiClient from './client';
import { Application, Submission, Evaluation } from '../types';

export interface ApplyPayload {
  submission_url?: string;
  description?: string;
  attachment_url?: string;
}

export interface EvaluationPayload {
  rating: number;
  feedback?: string;
  private_notes?: string;
  decision: 'Shortlisted' | 'Rejected' | 'Under Review';
}

export const applicationsApi = {
  applyToTask: async (taskId: number, data?: ApplyPayload): Promise<Application> => {
    const res = await apiClient.post<Application>(`/tasks/${taskId}/apply`, data || {});
    return res.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const res = await apiClient.get<Application[]>('/applications/me');
    return res.data;
  },

  getTaskApplications: async (taskId: number): Promise<Application[]> => {
    const res = await apiClient.get<Application[]>(`/tasks/${taskId}/applications`);
    return res.data;
  },

  getApplicationById: async (applicationId: number): Promise<Application> => {
    const res = await apiClient.get<Application>(`/applications/${applicationId}`);
    return res.data;
  },

  submitSolution: async (applicationId: number, data: { submission_url: string; description: string; attachment_url?: string }): Promise<Submission> => {
    const res = await apiClient.post<Submission>(`/applications/${applicationId}/submit`, data);
    return res.data;
  },

  updateSubmission: async (applicationId: number, data: { submission_url?: string; description?: string; attachment_url?: string }): Promise<Submission> => {
    const res = await apiClient.put<Submission>(`/applications/${applicationId}/submission`, data);
    return res.data;
  },

  evaluateApplication: async (applicationId: number, data: EvaluationPayload): Promise<Evaluation> => {
    const res = await apiClient.post<Evaluation>(`/applications/${applicationId}/evaluate`, data);
    return res.data;
  },
};

