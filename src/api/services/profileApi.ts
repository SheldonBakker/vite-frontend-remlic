import apiClient from './apiClient';
import type { DeleteResponse } from '@/api/types/shared';

export async function getProfile(): Promise<Profile> {
  const response = await apiClient.get<ProfileResponse>('/profile');
  return response.data.data.profile;
}

export interface Profile {
  id: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export async function deleteAccount(): Promise<DeleteResponse> {
  const response = await apiClient.delete<DeleteResponse>('/profile');
  return response.data;
}

interface ProfileResponse {
  success: boolean;
  data: {
    profile: Profile;
  };
  timestamp: string;
  statusCode: number;
}