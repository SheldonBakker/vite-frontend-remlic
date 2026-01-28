import apiClient from './apiClient';

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

interface ProfileResponse {
  success: boolean;
  data: {
    profile: Profile;
  };
  timestamp: string;
  statusCode: number;
}