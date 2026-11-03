import apiClient from './client';
import { Task, TaskListResponse } from '../types';

export interface GetTasksParams {
  search?: string;
  category?: string;
  skill?: string;
  difficulty?: string;
  sort_by?: string;
  status_filter?: string;
  recruiter_only?: boolean;
  page?: number;
  page_size?: number;
}

export const tasksApi = {
  getTasks: async (params?: GetTasksParams): Promise<TaskListResponse> => {
    const res = await apiClient.get<TaskListResponse>('/tasks', { params });
    return res.data;
  },

  getTaskById: async (taskId: number): Promise<Task> => {
    const res = await apiClient.get<Task>(`/tasks/${taskId}`);
    return res.data;
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    const res = await apiClient.post<Task>('/tasks', taskData);
    return res.data;
  },

  updateTask: async (taskId: number, taskData: Partial<Task>): Promise<Task> => {
    const res = await apiClient.put<Task>(`/tasks/${taskId}`, taskData);
    return res.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  },
};

