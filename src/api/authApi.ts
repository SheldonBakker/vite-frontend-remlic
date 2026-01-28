import axios from 'axios';

const authClient = axios.create({
  baseURL: import.meta.env.VITE_CUSTOM_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function signup(data: SignupRequest): Promise<string> {
  const response = await authClient.post<SignupResponse>('/auth/signup', data);

  if (!response.data.success) {
    throw new Error(response.data.error ?? 'Signup failed');
  }

  return response.data.data?.message ?? 'Registration successful';
}

interface SignupRequest {
  email: string;
  phone: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  error?: string;
  data?: {
    message?: string;
  };
}